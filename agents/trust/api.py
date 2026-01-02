from fastapi import APIRouter, HTTPException
from agents.trust.agent import evaluate_trust
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/trust",
    tags=["trust"]
)

class TrustRequest(BaseModel):
    actor_id: str
    actor_type: str  # POW | PIN | SYSTEM
    action: str
    context: Optional[dict] = {}

class TrustResponse(BaseModel):
    allow: bool
    trust_delta: float
    reason: str
    confidence: float

@router.post("/evaluate", response_model=TrustResponse)
def evaluate(request: TrustRequest):
    try:
        decision = evaluate_trust(request)
        return decision
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trust evaluation failed: {e}")
