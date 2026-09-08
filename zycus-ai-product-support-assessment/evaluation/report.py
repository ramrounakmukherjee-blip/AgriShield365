import sys
from pathlib import Path
from datetime import datetime
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from src.models import EvalTestResult

def generate_report(results: list[EvalTestResult]) -> str:
    """Generate a markdown evaluation report and save to output/evaluation_report.md."""
    project_root = Path(__file__).resolve().parent.parent
    output_dir = project_root / "output"
    output_dir.mkdir(exist_ok=True)
    report_path = output_dir / "evaluation_report.md"
    
    # Group by task
    triage_results = [r for r in results if r.task == "triage"]
    health_results = [r for r in results if r.task == "account_health"]
    
    total = len(results)
    passed = sum(1 for r in results if r.passed)
    failed = total - passed
    avg_score = sum(r.quality_score for r in results) / total if total else 0
    
    # Build markdown
    lines = [
        "# Evaluation Report",
        "",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## Summary",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Total Tests | {total} |",
        f"| Passed | {passed} |",
        f"| Failed | {failed} |",
        f"| Pass Rate | {passed/total*100:.1f}% |" if total else "| Pass Rate | N/A |",
        f"| Average Quality Score | {avg_score:.2f} |",
        "",
        "---",
        "",
    ]
    
    # Triage results table
    if triage_results:
        lines.extend([
            "## Task 1: Ticket Triage Tests",
            "",
            "| # | Test Name | Type | Result | Score | Details |",
            "|---|-----------|------|--------|-------|---------|",
        ])
        for i, r in enumerate(triage_results, 1):
            status = "✅ PASS" if r.passed else "❌ FAIL"
            test_type = "Adversarial" if r.is_adversarial else "Standard"
            # Escape pipe characters in details
            details = r.details.replace("|", "\\|").replace("\n", " ")
            if len(details) > 100:
                details = details[:100] + "..."
            lines.append(f"| {i} | {r.test_name} | {test_type} | {status} | {r.quality_score:.2f} | {details} |")
        
        t_passed = sum(1 for r in triage_results if r.passed)
        t_avg = sum(r.quality_score for r in triage_results) / len(triage_results)
        lines.extend(["", f"**Triage Summary:** {t_passed}/{len(triage_results)} passed, avg score {t_avg:.2f}", "", "---", ""])
    
    # Health results table
    if health_results:
        lines.extend([
            "## Task 2: Account Health Tests",
            "",
            "| # | Test Name | Type | Result | Score | Details |",
            "|---|-----------|------|--------|-------|---------|",
        ])
        for i, r in enumerate(health_results, 1):
            status = "✅ PASS" if r.passed else "❌ FAIL"
            test_type = "Adversarial" if r.is_adversarial else "Standard"
            details = r.details.replace("|", "\\|").replace("\n", " ")
            if len(details) > 100:
                details = details[:100] + "..."
            lines.append(f"| {i} | {r.test_name} | {test_type} | {status} | {r.quality_score:.2f} | {details} |")
        
        h_passed = sum(1 for r in health_results if r.passed)
        h_avg = sum(r.quality_score for r in health_results) / len(health_results)
        lines.extend(["", f"**Health Summary:** {h_passed}/{len(health_results)} passed, avg score {h_avg:.2f}", ""])
    
    report_content = "\n".join(lines)
    report_path.write_text(report_content, encoding='utf-8')
    root_report_path = project_root / "eval_report.md"
    root_report_path.write_text(report_content, encoding='utf-8')
    return str(report_path)
