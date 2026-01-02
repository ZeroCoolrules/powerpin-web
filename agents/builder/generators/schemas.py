from pydantic import BaseModel
from typing import Optional

class TrustRequest(BaseModel):
    actor_id: str
    actor_type: str  # POW / PIN
    action: str
    context: Optional[dict] = {}

class TrustDecision(BaseModel):
    allow: bool
    trust_delta: float
    reason: str
    confidence: float
