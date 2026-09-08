from pydantic import BaseModel, Field, field_validator
from typing import Optional, List

class TriageInput(BaseModel):
    """Input model for the triage task."""
    subject: str
    body: str

class TriageResult(BaseModel):
    """Output model for the triage task."""
    predicted_product: str
    predicted_product_area: str
    predicted_category: str
    predicted_urgency: str
    reasoning: str
    matches_known_issue: bool
    known_issue_summary: Optional[str] = None
    relevant_kb_articles: List[str]
    recommended_team: str
    draft_response: str

    @field_validator("predicted_urgency")
    @classmethod
    def validate_urgency(cls, v: str) -> str:
        """Validate that the urgency is valid."""
        if v not in ["P1", "P2", "P3", "P4"]:
            raise ValueError("Urgency must be P1, P2, P3, or P4")
        return v

class AccountHealthInput(BaseModel):
    """Input model for the account health task."""
    account_id: str

class RiskItem(BaseModel):
    """Model representing an open risk."""
    description: str
    supporting_quote: str
    severity: str

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, v: str) -> str:
        """Validate that the severity is valid."""
        if v not in ["High", "Medium", "Low"]:
            raise ValueError("Severity must be High, Medium, or Low")
        return v

class AccountHealthResult(BaseModel):
    """Output model for the account health task."""
    account_id: str
    company: str
    executive_summary: str
    open_risks: List[RiskItem]
    recommended_talking_points: List[str]
    churn_risk_level: str
    data_window: str

    @field_validator("churn_risk_level")
    @classmethod
    def validate_churn_risk(cls, v: str) -> str:
        """Validate that the churn risk level is valid."""
        if v not in ["Low", "Medium", "High"]:
            raise ValueError("Churn risk level must be Low, Medium, or High")
        return v

class EvalTestResult(BaseModel):
    """Model representing the result of an evaluation test."""
    test_name: str
    task: str
    passed: bool
    quality_score: float
    details: str
    is_adversarial: bool = False

    @field_validator("quality_score")
    @classmethod
    def validate_quality_score(cls, v: float) -> float:
        """Validate that the quality score is between 0.0 and 1.0."""
        if not (0.0 <= v <= 1.0):
            raise ValueError("Quality score must be between 0.0 and 1.0")
        return v
    
    @field_validator("task")
    @classmethod
    def validate_task(cls, v: str) -> str:
        """Validate that the task is valid."""
        if v not in ["triage", "account_health"]:
            raise ValueError("Task must be triage or account_health")
        return v
