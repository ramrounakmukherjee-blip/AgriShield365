import sys
from pathlib import Path
import traceback

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.account_health import summarize_account_health
from src.models import EvalTestResult
from src.llm_client import LLMClient
from src.data_loader import DataLoader
import config

def score_health_result(result, expected_churn: str = None) -> tuple[float, list[str]]:
    score = 0.0
    details = []
    
    # has_summary
    if result.executive_summary:
        sentences = [s for s in result.executive_summary.split('.') if len(s.strip()) > 5]
        if 2 <= len(sentences) <= 6:
            score += 0.2
            details.append("Valid executive summary (0.2)")
        else:
            details.append(f"Summary length unexpected: {len(sentences)} sentences")
            
    # has_risks
    if result.open_risks and len(result.open_risks) > 0:
        score += 0.2
        details.append("Has open risks (0.2)")
        
        # has_quotes
        has_quotes = any(len(risk.supporting_quote) > 10 and risk.supporting_quote != "No quote available" for risk in result.open_risks)
        if has_quotes:
            score += 0.2
            details.append("Has supporting quotes (0.2)")
        else:
            details.append("Missing or invalid supporting quotes")
    else:
        details.append("No open risks")
        
    # has_talking_points
    if result.recommended_talking_points and 2 <= len(result.recommended_talking_points) <= 6:
        score += 0.2
        details.append("Valid talking points (0.2)")
    else:
        details.append("Invalid talking points")
        
    # valid_churn_level
    if expected_churn and result.churn_risk_level == expected_churn:
        score += 0.2
        details.append(f"Churn risk level matches expected {expected_churn} (0.2)")
    elif expected_churn:
        details.append(f"Churn risk mismatch: got {result.churn_risk_level}, expected {expected_churn}")
    elif result.churn_risk_level in ["Low", "Medium", "High"]:
        score += 0.2
        details.append("Valid churn risk level (0.2)")
        
    return score, details

def test_healthy_account(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        result = summarize_account_health("ACC-4610", data_loader, llm_client)
        score, details = score_health_result(result, "Low")
        return EvalTestResult(test_name="test_healthy_account", task="account_health", passed=score >= 0.5, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_healthy_account", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_at_risk_with_escalation(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        result = summarize_account_health("ACC-3336", data_loader, llm_client)
        score, details = score_health_result(result)
        if result.churn_risk_level in ["Medium", "High"]:
            score += 0.1
            details.append("Expected Medium or High churn (0.1)")
        return EvalTestResult(test_name="test_at_risk_with_escalation", task="account_health", passed=score >= 0.5, quality_score=min(1.0, score), details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_at_risk_with_escalation", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_churning_account(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        result = summarize_account_health("ACC-2944", data_loader, llm_client)
        score, details = score_health_result(result, "High")
        return EvalTestResult(test_name="test_churning_account", task="account_health", passed=score >= 0.5, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_churning_account", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_new_account(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        result = summarize_account_health("ACC-7893", data_loader, llm_client)
        score, details = score_health_result(result, "Low")
        return EvalTestResult(test_name="test_new_account", task="account_health", passed=score >= 0.5, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_new_account", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_determinism(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        r1 = summarize_account_health("ACC-3336", data_loader, llm_client)
        r2 = summarize_account_health("ACC-3336", data_loader, llm_client)
        
        score = 0.0
        details = []
        if r1.churn_risk_level == r2.churn_risk_level and len(r1.open_risks) == len(r2.open_risks):
            score = 1.0
            details.append("Deterministic results (1.0)")
        elif r1.churn_risk_level == r2.churn_risk_level:
            score = 0.5
            details.append("Partially deterministic (0.5)")
        else:
            details.append("Non-deterministic results")
            
        return EvalTestResult(test_name="test_determinism", task="account_health", passed=score >= 0.5, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_determinism", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_adversarial_nonexistent(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        summarize_account_health("ACC-0000", data_loader, llm_client)
        return EvalTestResult(test_name="test_adversarial_nonexistent", task="account_health", passed=False, quality_score=0.0, details="Failed to raise error", is_adversarial=True)
    except ValueError as e:
        return EvalTestResult(test_name="test_adversarial_nonexistent", task="account_health", passed=True, quality_score=1.0, details=f"Handled correctly: {str(e)}", is_adversarial=True)
    except Exception as e:
        return EvalTestResult(test_name="test_adversarial_nonexistent", task="account_health", passed=False, quality_score=0.0, details=f"Unexpected error: {str(e)}", is_adversarial=True)

def test_at_risk_high_arr(llm_client: LLMClient, data_loader: DataLoader) -> EvalTestResult:
    try:
        result = summarize_account_health("ACC-8113", data_loader, llm_client)
        score, details = score_health_result(result, "High")
        return EvalTestResult(test_name="test_at_risk_high_arr", task="account_health", passed=score >= 0.5, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_at_risk_high_arr", task="account_health", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def run_account_health_tests(llm_client: LLMClient, data_loader: DataLoader) -> list[EvalTestResult]:
    tests = [
        test_healthy_account,
        test_at_risk_with_escalation,
        test_churning_account,
        test_new_account,
        test_determinism,
        test_adversarial_nonexistent,
        test_at_risk_high_arr
    ]
    
    results = []
    for test in tests:
        results.append(test(llm_client, data_loader))
        
    return results
