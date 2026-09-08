# Evaluation Report

Generated: 2026-08-28 16:04:22

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 15 |
| Passed | 15 |
| Failed | 0 |
| Pass Rate | 100.0% |
| Average Quality Score | 0.96 |

---

## Task 1: Ticket Triage Tests

| # | Test Name | Type | Result | Score | Details |
|---|-----------|------|--------|-------|---------|
| 1 | test_clear_p1_bug | Standard | ✅ PASS | 0.88 | Product exact match (0.25); Category exact match (0.25); Urgency within 1 level (0.125); Has reasoni... |
| 2 | test_feature_request | Standard | ✅ PASS | 1.00 | Product exact match (0.25); Category exact match (0.25); Urgency exact match (0.25); Has reasoning (... |
| 3 | test_sso_error | Standard | ✅ PASS | 1.00 | Product exact match (0.25); Category exact match (0.25); Urgency exact match (0.25); Has reasoning (... |
| 4 | test_billing_inquiry | Standard | ✅ PASS | 1.00 | Product exact match (any product allowed) (0.25); Category exact match (0.25); Urgency exact match (... |
| 5 | test_onboarding_new_org | Standard | ✅ PASS | 1.00 | Product exact match (0.25); Category exact match (0.25); Urgency exact match (0.25); Has reasoning (... |
| 6 | test_performance_issue | Standard | ✅ PASS | 1.00 | Product exact match (0.25); Category exact match (0.25); Urgency exact match (0.25); Has reasoning (... |
| 7 | test_adversarial_ambiguous | Adversarial | ✅ PASS | 1.00 | Valid product chosen (0.25); Valid category chosen (0.25); Valid urgency chosen (0.25); Has reasonin... |
| 8 | test_adversarial_gibberish | Adversarial | ✅ PASS | 1.00 | Handled gibberish without crashing (1.0) |

**Triage Summary:** 8/8 passed, avg score 0.98

---

## Task 2: Account Health Tests

| # | Test Name | Type | Result | Score | Details |
|---|-----------|------|--------|-------|---------|
| 1 | test_healthy_account | Standard | ✅ PASS | 1.00 | Valid executive summary (0.2); Has open risks (0.2); Has supporting quotes (0.2); Valid talking poin... |
| 2 | test_at_risk_with_escalation | Standard | ✅ PASS | 1.00 | Valid executive summary (0.2); Has open risks (0.2); Has supporting quotes (0.2); Valid talking poin... |
| 3 | test_churning_account | Standard | ✅ PASS | 1.00 | Valid executive summary (0.2); Has open risks (0.2); Has supporting quotes (0.2); Valid talking poin... |
| 4 | test_new_account | Standard | ✅ PASS | 0.80 | Valid executive summary (0.2); Has open risks (0.2); Has supporting quotes (0.2); Valid talking poin... |
| 5 | test_determinism | Standard | ✅ PASS | 1.00 | Deterministic results (1.0) |
| 6 | test_adversarial_nonexistent | Adversarial | ✅ PASS | 1.00 | Handled correctly: Account 'ACC-0000' not found in accounts.json. |
| 7 | test_at_risk_high_arr | Standard | ✅ PASS | 0.80 | Valid executive summary (0.2); Has open risks (0.2); Has supporting quotes (0.2); Valid talking poin... |

**Health Summary:** 7/7 passed, avg score 0.94
