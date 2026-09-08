"""Task 1: Intelligent Ticket Triage Agent.

Accepts a raw support ticket (subject + body), classifies it, retrieves
relevant KB context, and drafts a first-response message.
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config
from src.models import TriageInput, TriageResult
from src.data_loader import DataLoader
from src.kb_retriever import KBRetriever
from src.llm_client import LLMClient


# All valid product areas flattened for the prompt
_ALL_PRODUCT_AREAS = []
for product, areas in config.VALID_PRODUCT_AREAS.items():
    for area in areas:
        _ALL_PRODUCT_AREAS.append(f"{product} → {area}")

_SYSTEM_PROMPT = """You are an expert product support triage agent for a SaaS platform with 5 products.

PRODUCTS AND THEIR AREAS:
{product_areas}

ISSUE CATEGORIES (pick exactly one):
- Bug — product defect or unexpected behaviour
- Feature Request — request for new functionality
- How-To — guidance or documentation request
- Performance — slowness, timeouts, throughput issues
- Billing — invoice, payment, or plan questions
- Integration — third-party integration issues
- Onboarding — new user or new organisation setup
- Data Loss — missing, corrupted, or inaccessible data

URGENCY LEVELS:
- P1 — critical, business stopped (production down, data loss, security breach)
- P2 — major impact, significant workaround needed (many users affected, core feature broken)
- P3 — moderate impact, workaround available (single feature issue, non-blocking)
- P4 — low impact, cosmetic or minor (UI glitch, documentation request, nice-to-have)

TEAM ROUTING:
- DataBridge Pro → Data Platform Team
- CloudSync → Cloud Infrastructure Team
- AnalyticsHub → BI & Analytics Team
- SecureVault → Security & Compliance Team
- WorkflowEngine → Automation & Integrations Team

Your task: Given a support ticket (subject + body) and relevant KB documentation,
classify the ticket and produce a structured JSON response.

IMPORTANT RULES:
1. Base your classification on the CONTENT of the ticket, not just the subject line.
2. If a ticket says "Request:" or asks for new functionality, it is likely a Feature Request regardless of other signals.
3. Look for error codes in the body — they strongly indicate the product and issue type.
4. A ticket is a "known issue" if the KB documentation describes the exact error code or scenario.
5. The draft response should be professional, empathetic, and reference specific troubleshooting steps from the KB if applicable.
6. predicted_product must be one of: DataBridge Pro, CloudSync, AnalyticsHub, SecureVault, WorkflowEngine
7. predicted_product_area must be one of the areas listed for the predicted product.
8. predicted_category must be exactly one of the 8 categories listed above.
9. predicted_urgency must be P1, P2, P3, or P4.

Respond ONLY with valid JSON in this exact schema:
{{
  "predicted_product": "string",
  "predicted_product_area": "string",
  "predicted_category": "string",
  "predicted_urgency": "string",
  "reasoning": "string (2-3 sentences explaining your classification)",
  "matches_known_issue": true/false,
  "known_issue_summary": "string or null",
  "relevant_kb_articles": ["list of KB section titles used"],
  "recommended_team": "string",
  "draft_response": "string (professional first-response to the customer)"
}}"""


def _extract_error_codes(text: str) -> list[str]:
    """Extract error codes like ERR_CONNECTION_TIMEOUT, SCHEMA_MISMATCH from text."""
    pattern = r'\b[A-Z][A-Z_]+(?:_[A-Z]+)+\b'
    codes = re.findall(pattern, text)
    # Filter out common false positives
    return [c for c in codes if len(c) > 5]


def triage_ticket(
    subject: str,
    body: str,
    data_loader: DataLoader = None,
    kb_retriever: KBRetriever = None,
    llm_client: LLMClient = None,
) -> TriageResult:
    """Triage a single support ticket.

    Args:
        subject: Ticket subject line.
        body: Full ticket body text.
        data_loader: Optional DataLoader instance (shared across calls).
        kb_retriever: Optional KBRetriever instance (shared across calls).
        llm_client: Optional LLMClient instance (shared across calls).

    Returns:
        TriageResult with classification, KB matches, and draft response.
    """
    # Initialize components if not provided
    if kb_retriever is None:
        kb_retriever = KBRetriever()
    if llm_client is None:
        llm_client = LLMClient()

    # Combine subject + body for retrieval query
    query_text = f"{subject}\n{body}"

    # Step 1: Retrieve relevant KB chunks via TF-IDF similarity
    kb_chunks = kb_retriever.retrieve(
        query=query_text,
        top_k=config.KB_TOP_K,
        min_similarity=config.KB_MIN_SIMILARITY,
    )

    # Step 2: Check for error codes and do direct lookup
    error_codes = _extract_error_codes(body)
    for code in error_codes:
        code_chunks = kb_retriever.retrieve_by_error_code(code)
        for chunk in code_chunks:
            if chunk not in kb_chunks:
                kb_chunks.append(chunk)

    # Limit total context to avoid token overflow
    kb_chunks = kb_chunks[:5]

    # Step 3: Build context string from retrieved KB chunks
    kb_context_parts = []
    for i, chunk in enumerate(kb_chunks, 1):
        product_label = f" ({chunk.product})" if chunk.product else ""
        kb_context_parts.append(
            f"--- KB Document {i}: {chunk.section_title}{product_label} ---\n"
            f"Source: {chunk.source_file}\n{chunk.content[:1500]}"
        )
    kb_context = "\n\n".join(kb_context_parts) if kb_context_parts else "No relevant KB documentation found."

    # Step 4: Build the prompt
    product_areas_str = "\n".join(f"  - {pa}" for pa in _ALL_PRODUCT_AREAS)
    system_prompt = _SYSTEM_PROMPT.format(product_areas=product_areas_str)

    user_prompt = f"""TICKET SUBJECT: {subject}

TICKET BODY:
{body[:3000]}

RELEVANT KNOWLEDGE BASE DOCUMENTATION:
{kb_context}

Classify this ticket and respond with JSON."""

    # Step 5: Call LLM
    response = llm_client.chat_json(system_prompt, user_prompt)

    # Step 6: Validate and construct result
    # Ensure predicted_product is valid
    predicted_product = response.get("predicted_product", "")
    if predicted_product not in config.VALID_PRODUCTS:
        # Try to find closest match
        for valid in config.VALID_PRODUCTS:
            if valid.lower() in predicted_product.lower() or predicted_product.lower() in valid.lower():
                predicted_product = valid
                break
        else:
            predicted_product = config.VALID_PRODUCTS[0]

    # Ensure predicted_product_area is valid for the product
    predicted_area = response.get("predicted_product_area", "")
    valid_areas = config.VALID_PRODUCT_AREAS.get(predicted_product, [])
    if predicted_area not in valid_areas:
        for valid in valid_areas:
            if valid.lower() in predicted_area.lower() or predicted_area.lower() in valid.lower():
                predicted_area = valid
                break
        else:
            predicted_area = valid_areas[0] if valid_areas else "Unknown"

    # Ensure predicted_category is valid
    predicted_category = response.get("predicted_category", "")
    if predicted_category not in config.VALID_CATEGORIES:
        for valid in config.VALID_CATEGORIES:
            if valid.lower() == predicted_category.lower():
                predicted_category = valid
                break
        else:
            predicted_category = "Bug"

    # Ensure predicted_urgency is valid
    predicted_urgency = response.get("predicted_urgency", "P3")
    if predicted_urgency not in config.VALID_URGENCIES:
        predicted_urgency = "P3"

    # Build the TriageResult
    result = TriageResult(
        predicted_product=predicted_product,
        predicted_product_area=predicted_area,
        predicted_category=predicted_category,
        predicted_urgency=predicted_urgency,
        reasoning=response.get("reasoning", "No reasoning provided."),
        matches_known_issue=response.get("matches_known_issue", False),
        known_issue_summary=response.get("known_issue_summary"),
        relevant_kb_articles=[chunk.section_title for chunk in kb_chunks],
        recommended_team=config.TEAM_ROUTING.get(predicted_product, config.TEAM_ROUTING["default"]),
        draft_response=response.get("draft_response", "Thank you for contacting support. We are reviewing your ticket and will respond shortly."),
    )

    return result
