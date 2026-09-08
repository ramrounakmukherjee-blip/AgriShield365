"""Task 2: TAM Account Health Summariser.

Given an account_id, retrieves the account and its recent tickets,
then produces an executive summary, open risks with supporting quotes,
and recommended TAM talking points.
"""

import sys
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config
from src.models import AccountHealthResult, RiskItem
from src.data_loader import DataLoader
from src.llm_client import LLMClient


_SYSTEM_PROMPT = """You are a Technical Account Manager (TAM) analyst for a SaaS platform.
You produce concise, data-driven account health summaries for TAMs preparing for customer meetings.

Given an account's metadata and their recent support tickets, produce a structured JSON report.

IMPORTANT RULES:
1. The Executive Summary must be EXACTLY 3-5 sentences. Be specific — cite numbers, products, and trends.
2. Open Risks must include DIRECT QUOTES from tickets or escalation notes as the "supporting_quote" field.
   Quotes must be exact text from the provided data, enclosed in quotation marks.
3. Each risk must have a severity: "High", "Medium", or "Low".
4. Recommended Talking Points should be 3-5 actionable items the TAM can discuss with the customer.
5. Churn Risk Level must be "Low", "Medium", or "High" based on all signals:
   - "High": churning status, decision maker evaluating competitors, champion left, multiple P1s
   - "Medium": at risk status, declining usage, negative sentiment, skipped QBRs
   - "Low": healthy status, increasing usage, no escalation notes
6. If there are no tickets, base the summary on account metadata and escalation notes only.

Respond ONLY with valid JSON in this exact schema:
{{
  "executive_summary": "string (3-5 sentences)",
  "open_risks": [
    {{
      "description": "string",
      "supporting_quote": "string (exact quote from data)",
      "severity": "High|Medium|Low"
    }}
  ],
  "recommended_talking_points": ["string", "string", ...],
  "churn_risk_level": "Low|Medium|High"
}}"""


def _format_ticket_for_prompt(ticket: dict) -> str:
    """Format a single ticket for inclusion in the LLM prompt."""
    return (
        f"[{ticket.get('ticket_id', 'N/A')}] "
        f"Product: {ticket.get('product', 'N/A')} | "
        f"Area: {ticket.get('product_area', 'N/A')} | "
        f"Category: {ticket.get('category', 'N/A')} | "
        f"Urgency: {ticket.get('urgency', 'N/A')} | "
        f"Status: {ticket.get('status', 'N/A')} | "
        f"CSAT: {ticket.get('satisfaction_score', 'N/A')}\n"
        f"Subject: {ticket.get('subject', 'N/A')}\n"
        f"Body: {ticket.get('body', 'N/A')[:500]}\n"
    )


def _format_account_for_prompt(account: dict) -> str:
    """Format account metadata for the LLM prompt."""
    contact = account.get("primary_contact", {})
    return (
        f"Account ID: {account.get('account_id', 'N/A')}\n"
        f"Company: {account.get('company', 'N/A')}\n"
        f"TAM: {account.get('tam', 'N/A')}\n"
        f"Plan: {account.get('plan_tier', 'N/A')}\n"
        f"ARR: ${account.get('arr_usd', 0):,}\n"
        f"Seats: {account.get('seats_active', 0)} active / {account.get('seats_licensed', 0)} licensed\n"
        f"Products: {', '.join(account.get('products', []))}\n"
        f"Health Status: {account.get('health_status', 'N/A')}\n"
        f"Usage Trend: {account.get('usage_trend', 'N/A')}\n"
        f"Open Tickets: {account.get('open_tickets', 0)}\n"
        f"P1 Tickets (last 30d): {account.get('p1_tickets_last_30d', 0)}\n"
        f"Customer Since: {account.get('customer_since', 'N/A')}\n"
        f"Renewal Date: {account.get('renewal_date', 'N/A')}\n"
        f"Last QBR: {account.get('last_qbr_date', 'N/A')}\n"
        f"Last Login: {account.get('last_login_days_ago', 'N/A')} days ago\n"
        f"NPS Score: {account.get('nps_score', 'N/A')}\n"
        f"Region: {account.get('region', 'N/A')}\n"
        f"Industry: {account.get('industry', 'N/A')}\n"
        f"Primary Contact: {contact.get('name', 'N/A')} ({contact.get('title', 'N/A')})\n"
        f"Active Integrations: {', '.join(account.get('integrations_active', []))}\n"
        f"Escalation Notes:\n"
        + "\n".join(f"  - \"{note}\"" for note in account.get("escalation_notes", []))
    )


def summarize_account_health(
    account_id: str,
    data_loader: DataLoader = None,
    llm_client: LLMClient = None,
) -> AccountHealthResult:
    """Generate an account health summary for TAM preparation.

    Args:
        account_id: The account ID to summarize.
        data_loader: Optional DataLoader instance.
        llm_client: Optional LLMClient instance.

    Returns:
        AccountHealthResult with executive summary, risks, and talking points.

    Raises:
        ValueError: If account_id is not found in accounts.json.
    """
    if data_loader is None:
        data_loader = DataLoader()
    if llm_client is None:
        llm_client = LLMClient()

    # Look up account
    account = data_loader.get_account(account_id)
    if account is None:
        raise ValueError(f"Account '{account_id}' not found in accounts.json.")

    # Get recent tickets (90-day window anchored to max ticket date)
    tickets = data_loader.get_account_tickets(account_id, days=90)

    # Format account metadata
    account_text = _format_account_for_prompt(account)

    # Format tickets (limit to most recent 20 to stay within token limits)
    # Sort by urgency (P1 first) then by date (newest first)
    urgency_order = {"P1": 0, "P2": 1, "P3": 2, "P4": 3}
    sorted_tickets = sorted(
        tickets,
        key=lambda t: (
            urgency_order.get(t.get("urgency", "P4"), 4),
            t.get("created_at", ""),
        ),
    )
    display_tickets = sorted_tickets[:20]

    if display_tickets:
        tickets_text = "\n---\n".join(
            _format_ticket_for_prompt(t) for t in display_tickets
        )
        tickets_header = f"RECENT SUPPORT TICKETS ({len(tickets)} total, showing top {len(display_tickets)}):"
    else:
        tickets_text = "No support tickets found in the analysis window."
        tickets_header = "RECENT SUPPORT TICKETS (0 found):"

    # Compute data window
    ref_date = data_loader.get_reference_date()
    window_start = (ref_date - timedelta(days=90)).strftime("%Y-%m-%d")
    window_end = ref_date.strftime("%Y-%m-%d")
    data_window = f"{window_start} to {window_end}"

    # Build prompt
    user_prompt = f"""ACCOUNT METADATA:
{account_text}

{tickets_header}
{tickets_text}

DATA WINDOW: {data_window}

Produce the account health summary as JSON."""

    # Call LLM
    response = llm_client.chat_json(_SYSTEM_PROMPT, user_prompt)

    # Validate and construct result
    # Parse open_risks
    raw_risks = response.get("open_risks", [])
    risks = []
    for risk in raw_risks:
        severity = risk.get("severity", "Medium")
        if severity not in ("High", "Medium", "Low"):
            severity = "Medium"
        risks.append(RiskItem(
            description=risk.get("description", "Unspecified risk"),
            supporting_quote=risk.get("supporting_quote", "No quote available"),
            severity=severity,
        ))

    # Parse churn risk level
    churn_risk = response.get("churn_risk_level", "Medium")
    if churn_risk not in ("Low", "Medium", "High"):
        churn_risk = "Medium"

    # Parse talking points
    talking_points = response.get("recommended_talking_points", [])
    if not talking_points:
        talking_points = ["Review recent support ticket trends", "Discuss renewal timeline"]

    result = AccountHealthResult(
        account_id=account_id,
        company=account.get("company", "Unknown"),
        executive_summary=response.get("executive_summary", "No summary available."),
        open_risks=risks,
        recommended_talking_points=talking_points,
        churn_risk_level=churn_risk,
        data_window=data_window,
    )

    return result
