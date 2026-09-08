# System Design Note: Zycus AI Engineer Assessment

This document outlines considerations for scaling the ticket triage and account health summarisation system to production, focusing on failure modes, latency, data sensitivity, and scaling.

## 1. Top 3 Production Failure Modes, Detection and Mitigation

**A. LLM API Unavailability or Rate Limiting**
*Failure Mode:* The NVIDIA NIM API becomes unreachable or rate limits are exhausted, stalling the ticket triage pipeline.
*Detection:* Monitor for HTTP 429 (Too Many Requests) or 503 (Service Unavailable). Track P99 latency for sudden spikes indicating degraded service.
*Mitigation:* Use exponential backoff with retries and implement a circuit breaker. For critical triage, fall back to a zero-LLM rule-based classifier (e.g., regex-based routing) to ensure business continuity. Cache identical requests to reduce API load.

**B. LLM Hallucination and Malformed Output**
*Failure Mode:* The model returns non-existent product names, hallucinated error codes, or unparseable text instead of JSON, breaking downstream routing.
*Detection:* Validate all LLM responses against strict Pydantic schemas and exact enums (e.g., ensuring `category` is exactly one of the 8 allowed values).
*Mitigation:* Use constrained decoding (JSON mode). If validation fails, retry the LLM with a rephrased prompt containing the error. After 3 failed retries, log the failure and route the ticket to a human "catch-all" queue.

**C. KB Retrieval Returning Irrelevant Context**
*Failure Mode:* The TF-IDF retrieval system surfaces unrelated documentation. The LLM then uses this to provide incorrect advice or misclassify the ticket.
*Detection:* Log retrieval similarity scores. Monitor user feedback metrics (e.g., thumbs down on draft responses) and agent override rates.
*Mitigation:* Enforce a strict minimum similarity threshold. If no KB chunks meet the threshold, use a no-context prompt rather than injecting noise. Boost exact error-code matches (like `SCHEMA_MISMATCH`), and filter the search space by product name after the initial classification step.

## 2. Latency vs. Quality Trade-off

A key decision is choosing the LLM size. A 70B parameter model offers superior classification accuracy and nuanced reasoning but adds 2-5x the latency of an 8B model.

For batch-processing triage workflows, a few seconds of latency per ticket is acceptable, making the 70B model preferable. However, if this system evolves into a real-time chat assistant requiring <500ms latency, speed becomes paramount. To achieve this: switch to the 8B model, implement keyword heuristics to pre-classify the product, and cache frequent ticket queries. We could also fine-tune the 8B model on historical data to bridge the quality gap while maintaining strict low latency.

## 3. PII and Data Sensitivity

Support tickets contain sensitive data: company names, infrastructure details, and PII (emails, IPs). Transmitting this to external LLMs introduces privacy risks.

To secure this:
1. **Enterprise Guarantees:** Ensure we use NVIDIA NIM's enterprise tier, which provides explicit guarantees against using our data for model training.
2. **Data Scrubbing:** Implement a scrubbing layer (using regex or NER) to mask PII before the prompt leaves our network.
3. **On-Premise Deployment:** For maximum compliance, deploy the NIM container on-premise or in a secure VPC.
4. **Secure Logging:** Never log raw unmasked LLM prompts in monitoring systems like Datadog.

## 4. Scaling to 10x Ticket Volume (5,000 Tickets)

If volume surges to 5,000 tickets, the primary bottleneck will be LLM throughput. Processing 5,000 tickets sequentially at ~2 seconds per API call takes nearly 2.8 hours.

**Fixing the Bottleneck:** Transition from sequential processing to batch processing with asynchronous, concurrent API requests, utilizing a semaphore to respect rate limits.

Other components:
* **TF-IDF Retrieval:** Remains fast. O(n) similarity over 50 chunks is negligible. We only need dense embeddings and a vector database if the KB grows by 100x.
* **Data Loading:** 5,000 JSON records fit easily in memory.
* **Account Health Summariser:** As volume grows, a single account might accumulate hundreds of tickets. Passing all into a single prompt will exceed the LLM's context window. We must implement ticket summarisation or intelligent sampling (e.g., summarizing only P1 tickets and the 10 most recent tickets) before generating the health report.
