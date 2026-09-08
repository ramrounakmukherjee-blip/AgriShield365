import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.llm_client import LLMClient
from src.data_loader import DataLoader
from src.kb_retriever import KBRetriever
from src.models import EvalTestResult
from evaluation.test_triage import run_triage_tests
from evaluation.test_account_health import run_account_health_tests
from evaluation.report import generate_report


def run_all_tests() -> list[EvalTestResult]:
    """Run all evaluation tests and return results."""
    print("Initializing components...")
    llm_client = LLMClient()
    data_loader = DataLoader()
    kb_retriever = KBRetriever()
    
    all_results = []
    
    print("\n=== Running Triage Tests ===")
    triage_results = run_triage_tests(llm_client, data_loader, kb_retriever)
    all_results.extend(triage_results)
    for r in triage_results:
        status = "PASS" if r.passed else "FAIL"
        adv = " [ADVERSARIAL]" if r.is_adversarial else ""
        print(f"  [{status}] {r.test_name} — score: {r.quality_score:.2f}{adv}")
    
    print("\n=== Running Account Health Tests ===")
    health_results = run_account_health_tests(llm_client, data_loader)
    all_results.extend(health_results)
    for r in health_results:
        status = "PASS" if r.passed else "FAIL"
        adv = " [ADVERSARIAL]" if r.is_adversarial else ""
        print(f"  [{status}] {r.test_name} — score: {r.quality_score:.2f}{adv}")
    
    # Summary
    total = len(all_results)
    passed = sum(1 for r in all_results if r.passed)
    avg_score = sum(r.quality_score for r in all_results) / total if total else 0
    
    print(f"\n=== Summary ===")
    print(f"Total: {total} | Passed: {passed} | Failed: {total - passed}")
    print(f"Average Quality Score: {avg_score:.2f}")
    
    # Generate markdown report
    report_path = generate_report(all_results)
    print(f"\nReport saved to: {report_path}")
    
    return all_results
