from pydantic import BaseModel
from typing import List

class ToolManifest(BaseModel):
    name: str
    version: str
    description: str
    permissions: List[str]
    trust_class: str
    audit_required: bool = True
