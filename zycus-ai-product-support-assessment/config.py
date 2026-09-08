import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
KB_DIR = BASE_DIR / "knowledge-base"
TICKETS_PATH = DATA_DIR / "tickets.json"
ACCOUNTS_PATH = DATA_DIR / "accounts.json"

NIM_BASE_URL = "https://integrate.api.nvidia.com/v1"
NIM_MODEL = os.getenv("NIM_MODEL", "meta/llama-3.2-11b-vision-instruct")
NIM_SEED = 42
NIM_MAX_TOKENS = 2048

KB_TOP_K = 3
KB_MIN_SIMILARITY = 0.05

VALID_PRODUCTS = [
    "DataBridge Pro",
    "CloudSync",
    "AnalyticsHub",
    "SecureVault",
    "WorkflowEngine"
]

VALID_CATEGORIES = [
    "Bug",
    "Feature Request",
    "How-To",
    "Performance",
    "Billing",
    "Integration",
    "Onboarding",
    "Data Loss"
]

VALID_URGENCIES = ["P1", "P2", "P3", "P4"]

VALID_PRODUCT_AREAS = {
    "DataBridge Pro": [
        "Data Ingestion",
        "Schema Management",
        "Pipeline Monitoring",
        "Connectors",
        "API"
    ],
    "CloudSync": [
        "File Sync",
        "Conflict Resolution",
        "Permissions",
        "Bandwidth Limits",
        "Integrations"
    ],
    "AnalyticsHub": [
        "Dashboard",
        "Reports",
        "Data Sources",
        "Alerts",
        "Exports"
    ],
    "SecureVault": [
        "Authentication",
        "Encryption",
        "Audit Logs",
        "Key Management",
        "SSO"
    ],
    "WorkflowEngine": [
        "Triggers",
        "Actions",
        "Scheduling",
        "Error Handling",
        "Templates"
    ]
}

TEAM_ROUTING = {
    "DataBridge Pro": "Data Platform Team",
    "CloudSync": "Cloud Infrastructure Team",
    "AnalyticsHub": "BI & Analytics Team",
    "SecureVault": "Security & Compliance Team",
    "WorkflowEngine": "Automation & Integrations Team",
    "default": "General Support"
}
