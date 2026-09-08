"""Data loading and indexing module for the Zycus assessment."""

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config


class DataLoader:
    """Loads and indexes the synthetic dataset.

    Builds lookup indexes for fast account retrieval and ticket filtering.
    Handles the critical data join issue: most ticket account_ids don't match
    accounts.json, so we fall back to joining by company name.
    """

    def __init__(self, tickets_path: str = None, accounts_path: str = None):
        project_root = Path(__file__).resolve().parent.parent
        self.tickets_path = tickets_path or str(project_root / "data" / "tickets.json")
        self.accounts_path = accounts_path or str(project_root / "data" / "accounts.json")

        self._tickets: list[dict] = []
        self._accounts: list[dict] = []
        self.account_map: dict[str, dict] = {}
        self.company_tickets_map: dict[str, list[dict]] = {}
        self._reference_date: datetime | None = None

        self._load_data()

    def _parse_ticket_date(self, date_str: str) -> datetime:
        """Parse ISO 8601 date string with Z suffix to timezone-aware datetime."""
        return datetime.fromisoformat(date_str.replace("Z", "+00:00"))

    def _load_data(self) -> None:
        """Load tickets and accounts, build indexes."""
        with open(self.tickets_path, "r", encoding="utf-8") as f:
            self._tickets = json.load(f)

        with open(self.accounts_path, "r", encoding="utf-8") as f:
            self._accounts = json.load(f)

        # Build account lookup by account_id
        for account in self._accounts:
            self.account_map[account["account_id"]] = account

        # Build company -> tickets index (the field is "company", not "company_name")
        for ticket in self._tickets:
            company = ticket.get("company")
            if company:
                if company not in self.company_tickets_map:
                    self.company_tickets_map[company] = []
                self.company_tickets_map[company].append(ticket)

        # Parse dates and find the reference date (max created_at)
        max_date = datetime.min.replace(tzinfo=timezone.utc)
        for ticket in self._tickets:
            date_str = ticket.get("created_at", "")
            if date_str:
                dt = self._parse_ticket_date(date_str)
                ticket["_parsed_date"] = dt
                if dt > max_date:
                    max_date = dt

        self._reference_date = max_date

    def get_account(self, account_id: str) -> dict | None:
        """Look up account by account_id."""
        return self.account_map.get(account_id)

    def get_account_tickets(self, account_id: str, days: int = 90, as_of_date: datetime = None) -> list[dict]:
        """Get tickets for an account within the last N days.

        CRITICAL: The 90-day window is anchored to the LATEST ticket date
        in the dataset (2026-05-22), NOT datetime.now(). All tickets span
        2026-02-20 to 2026-05-22.

        Join strategy:
        1. Try direct account_id match first
        2. If no results, fall back to company name match:
           - Look up company name from account
           - Find all tickets with that company name
        """
        ref_date = as_of_date if as_of_date else self._reference_date
        cutoff_date = ref_date - timedelta(days=days)

        # 1. Try direct account_id match
        account_tickets = [
            t for t in self._tickets
            if t.get("account_id") == account_id
            and t.get("_parsed_date", datetime.min.replace(tzinfo=timezone.utc)) > cutoff_date
        ]

        if account_tickets:
            return account_tickets

        # 2. Fallback to company name match
        account = self.get_account(account_id)
        if not account:
            return []

        company = account.get("company")
        if not company:
            return []

        company_tickets = self.company_tickets_map.get(company, [])
        return [
            t for t in company_tickets
            if t.get("_parsed_date", datetime.min.replace(tzinfo=timezone.utc)) > cutoff_date
        ]

    def get_all_accounts(self) -> list[dict]:
        """Return all accounts."""
        return self._accounts

    def get_reference_date(self) -> datetime:
        """Return the max created_at date from tickets (anchor for 90-day window)."""
        return self._reference_date

    @property
    def tickets(self) -> list[dict]:
        """All loaded tickets."""
        return self._tickets

    @property
    def accounts(self) -> list[dict]:
        """All loaded accounts."""
        return self._accounts
