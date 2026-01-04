from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.builder.builder import run_builder

router = APIRouter(
    prefix="/builder",
    tags=["builder"]
)

class BuildRequest(BaseModel):
    name: str
    type: str  # service | agent | tool | schema
    description: str
    target_language: str = "python"
    constraints: str | None = None

class BuildResponse(BaseModel):
    build_id: str
    files_generated: int
    artifact_path: str
    requires_approval: bool

@router.post("/build", response_model=BuildResponse)
def build(request: BuildRequest):
    try:
        return run_builder(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Builder failed: {e}")
