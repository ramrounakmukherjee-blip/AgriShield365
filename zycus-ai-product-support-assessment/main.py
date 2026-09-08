import argparse
import json
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent))


def cmd_triage(args):
    """Run the ticket triage agent."""
    from src.triage_agent import triage_ticket
    from src.data_loader import DataLoader
    from src.kb_retriever import KBRetriever
    from src.llm_client import LLMClient
    
    llm = LLMClient()
    dl = DataLoader()
    kb = KBRetriever()
    
    result = triage_ticket(
        subject=args.subject,
        body=args.body,
        data_loader=dl,
        kb_retriever=kb,
        llm_client=llm,
    )
    
    print(json.dumps(result.model_dump(), indent=2))


def cmd_health(args):
    """Run the account health summariser."""
    from src.account_health import summarize_account_health
    from src.data_loader import DataLoader
    from src.llm_client import LLMClient
    
    llm = LLMClient()
    dl = DataLoader()
    
    try:
        result = summarize_account_health(
            account_id=args.account_id,
            data_loader=dl,
            llm_client=llm,
        )
        print(json.dumps(result.model_dump(), indent=2))
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def cmd_evaluate(args):
    """Run the evaluation harness."""
    from evaluation.harness import run_all_tests
    run_all_tests()


def main():
    parser = argparse.ArgumentParser(
        description="AI Product Support Agent - Triage, Retrieval & Account Health System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Examples:
  python main.py triage --subject "Pipeline down" --body "Our DataBridge Pro pipeline stopped..."
  python main.py health --account-id ACC-3336
  python main.py evaluate"""
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Triage subcommand
    triage_parser = subparsers.add_parser("triage", help="Triage a support ticket")
    triage_parser.add_argument("--subject", required=True, help="Ticket subject line")
    triage_parser.add_argument("--body", required=True, help="Ticket body text")
    triage_parser.set_defaults(func=cmd_triage)
    
    # Health subcommand  
    health_parser = subparsers.add_parser("health", help="Generate account health summary")
    health_parser.add_argument("--account-id", required=True, help="Account ID (e.g., ACC-3336)")
    health_parser.set_defaults(func=cmd_health)
    
    # Evaluate subcommand
    eval_parser = subparsers.add_parser("evaluate", help="Run evaluation harness")
    eval_parser.set_defaults(func=cmd_evaluate)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    args.func(args)


if __name__ == "__main__":
    main()
