from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.store.registry import (
    list_pending,
    list_available,
    approve_artifact,
    get_artifact,
)

router = APIRouter(
    prefix="/store",
    tags=["store"]
)


# -----------------------------
# Schemas
# -----------------------------
class ApprovalRequest(BaseModel):
    artifact_id: str
    approver: str


# -----------------------------
# Routes
# -----------------------------
@router.get("/pending")
def pending():
    """
    List all unapproved artifacts.
    """
    return list_pending()


@router.get("/available")
def available():
    """
    List all approved artifacts.
    """
    return list_available()


@router.get("/artifact/{artifact_id}")
def artifact(artifact_id: str):
    """
    Get a single artifact by ID.
    """
    record = get_artifact(artifact_id)
    if not record:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return record


@router.post("/approve")
def approve(req: ApprovalRequest):
    """
    Approve an artifact (human-in-the-loop).
    """
    try:
        return approve_artifact(
            artifact_id=req.artifact_id,
            approver=req.approver,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
