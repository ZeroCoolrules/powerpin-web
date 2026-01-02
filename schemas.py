from pydantic import BaseModel
from typing import Literal, Optional

class BuildRequest(BaseModel):
    name: str
    type: Literal["tool", "agent", "service", "schema"]
    description: str
    target_language: Literal["python", "typescript"]
    constraints: Optional[str] = None

class BuildResult(BaseModel):
    build_id: str
    files_generated: int
    artifact_path: str
    requires_approval: bool = True
