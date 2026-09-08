import sys
from pathlib import Path
import traceback

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.triage_agent import triage_ticket
from src.models import EvalTestResult
from src.llm_client import LLMClient
from src.data_loader import DataLoader
from src.kb_retriever import KBRetriever
import config

def test_clear_p1_bug(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "URGENT: Production pipeline completely down - DataBridge Pro"
        body = "Our production data pipeline has stopped processing entirely since 2 hours ago. Error: PIPELINE_STALLED: no heartbeat for 15 minutes. This is blocking all data ingestion for 200+ users. We need immediate assistance."
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product == "DataBridge Pro":
            score += 0.25
            details.append("Product exact match (0.25)")
        else:
            details.append(f"Product mismatch: got {result.predicted_product}")
            
        if result.predicted_category == "Bug":
            score += 0.25
            details.append("Category exact match (0.25)")
        else:
            details.append(f"Category mismatch: got {result.predicted_category}")
            
        if result.predicted_urgency == "P1":
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency == "P2":
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
        else:
            details.append(f"Urgency mismatch: got {result.predicted_urgency}")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_clear_p1_bug", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_clear_p1_bug", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_feature_request(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "Request: bulk export functionality in AnalyticsHub Reports"
        body = "Currently AnalyticsHub only allows individual report exports. As our team has grown to 150 users, we need the ability to bulk export multiple reports at once. Expected: select multiple reports, export all as a ZIP. Current workaround: manual one-by-one."
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product == "AnalyticsHub":
            score += 0.25
            details.append("Product exact match (0.25)")
            
        if result.predicted_category == "Feature Request":
            score += 0.25
            details.append("Category exact match (0.25)")
            
        if result.predicted_urgency in ["P3", "P4"]:
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency == "P2":
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_feature_request", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_feature_request", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_sso_error(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "New users cannot log in via SSO - SecureVault"
        body = "We migrated to SSO last week using Okta. Existing users work fine but new hires get an error: SAML_ASSERTION_EXPIRED. We've checked our Okta setup and it looks correct. 15 new users are blocked."
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product == "SecureVault":
            score += 0.25
            details.append("Product exact match (0.25)")
            
        if result.predicted_category == "Bug":
            score += 0.25
            details.append("Category exact match (0.25)")
            
        if result.predicted_urgency == "P2":
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency in ["P1", "P3"]:
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_sso_error", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_sso_error", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_billing_inquiry(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "Invoice shows 200 seats but we only have 150 active users"
        body = "Our latest invoice charges us for 200 seats but our active user count is only 150. Can you explain the discrepancy? We're on the Professional plan and want to understand how seats are counted."
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        score += 0.25
        details.append("Product exact match (any product allowed) (0.25)")
            
        if result.predicted_category == "Billing":
            score += 0.25
            details.append("Category exact match (0.25)")
            
        if result.predicted_urgency in ["P3", "P4"]:
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency == "P2":
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_billing_inquiry", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_billing_inquiry", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_onboarding_new_org(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "Help setting up CloudSync for our organization"
        body = "We just purchased CloudSync Business plan. We need help with initial setup: configuring SSO with Azure AD, setting up our first sync job between our NAS and AWS S3, and provisioning 50 users. Is there a setup guide?"
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product == "CloudSync":
            score += 0.25
            details.append("Product exact match (0.25)")
            
        if result.predicted_category == "Onboarding":
            score += 0.25
            details.append("Category exact match (0.25)")
            
        if result.predicted_urgency in ["P3", "P4"]:
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency == "P2":
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_onboarding_new_org", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_onboarding_new_org", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_performance_issue(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "AnalyticsHub dashboard extremely slow"
        body = "Our main dashboard has been loading for over 2 minutes. We have 15 widgets and data spanning 18 months. The error sometimes shows 'Query timed out'. This started after we added a new data source last week. 50 analysts are affected."
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product == "AnalyticsHub":
            score += 0.25
            details.append("Product exact match (0.25)")
            
        if result.predicted_category == "Performance":
            score += 0.25
            details.append("Category exact match (0.25)")
            
        if result.predicted_urgency in ["P2", "P3"]:
            score += 0.25
            details.append("Urgency exact match (0.25)")
        elif result.predicted_urgency in ["P1", "P4"]:
            score += 0.125
            details.append("Urgency within 1 level (0.125)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_performance_issue", task="triage", passed=passed, quality_score=score, details="; ".join(details))
    except Exception as e:
        return EvalTestResult(test_name="test_performance_issue", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}")

def test_adversarial_ambiguous(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "Multiple issues with our platform"
        body = "We have several problems: 1) Our sync jobs in CloudSync keep failing with ERR_CONNECTION_TIMEOUT, 2) We also want to request a feature for bulk file operations, 3) Our invoice seems wrong. Which team handles this?"
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 0.0
        details = []
        
        if result.predicted_product in config.VALID_PRODUCTS:
            score += 0.25
            details.append("Valid product chosen (0.25)")
            
        if result.predicted_category in config.VALID_CATEGORIES:
            score += 0.25
            details.append("Valid category chosen (0.25)")
            
        if result.predicted_urgency in config.VALID_URGENCIES:
            score += 0.25
            details.append("Valid urgency chosen (0.25)")
            
        if result.reasoning and len(result.reasoning) > 20:
            score += 0.125
            details.append("Has reasoning (0.125)")
            
        if result.draft_response and len(result.draft_response) > 20:
            score += 0.125
            details.append("Has draft response (0.125)")
            
        passed = score >= 0.5
        return EvalTestResult(test_name="test_adversarial_ambiguous", task="triage", passed=passed, quality_score=score, details="; ".join(details), is_adversarial=True)
    except Exception as e:
        return EvalTestResult(test_name="test_adversarial_ambiguous", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}", is_adversarial=True)

def test_adversarial_gibberish(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> EvalTestResult:
    try:
        subject = "asdfghjkl"
        body = "12345 !@#$% test test test"
        
        result = triage_ticket(subject, body, data_loader, kb_retriever, llm_client)
        
        score = 1.0
        details = ["Handled gibberish without crashing (1.0)"]
            
        passed = True
        return EvalTestResult(test_name="test_adversarial_gibberish", task="triage", passed=passed, quality_score=score, details="; ".join(details), is_adversarial=True)
    except Exception as e:
        return EvalTestResult(test_name="test_adversarial_gibberish", task="triage", passed=False, quality_score=0.0, details=f"Error: {str(e)}", is_adversarial=True)

def run_triage_tests(llm_client: LLMClient, data_loader: DataLoader, kb_retriever: KBRetriever) -> list[EvalTestResult]:
    tests = [
        test_clear_p1_bug,
        test_feature_request,
        test_sso_error,
        test_billing_inquiry,
        test_onboarding_new_org,
        test_performance_issue,
        test_adversarial_ambiguous,
        test_adversarial_gibberish
    ]
    
    results = []
    for test in tests:
        results.append(test(llm_client, data_loader, kb_retriever))
        
    return results
