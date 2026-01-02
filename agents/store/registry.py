import json
import uuid
from pathlib import Path
from datetime import datetime

REGISTRY_PATH = Path("artifacts/registry.json")


def _load():
    if REGISTRY_PATH.exists():
        return json.loads(REGISTRY_PATH.read_text())
    return []


def _save(data):
    REGISTRY_PATH.parent.mkdir(exist_ok=True)
    REGISTRY_PATH.write_text(json.dumps(data, indent=2))


def register_artifact(*, manifest: dict, files: list[str], builder: str):
    record = {
        "id": str(uuid.uuid4()),
        "manifest": manifest,
        "files": files,
        "builder": builder,
        "approved": False,
        "approved_by": None,
        "created_at": datetime.utcnow().isoformat(),
        "approved_at": None,
    }

    data = _load()
    data.append(record)
    _save(data)

    return record["id"]


def list_pending():
    return [r for r in _load() if not r["approved"]]


def list_available():
    return [r for r in _load() if r["approved"]]


def get_artifact(artifact_id: str):
    for r in _load():
        if r["id"] == artifact_id:
            return r
    return None


def approve_artifact(artifact_id: str, approver: str):
    data = _load()
    for r in data:
        if r["id"] == artifact_id:
            r["approved"] = True
            r["approved_by"] = approver
            r["approved_at"] = datetime.utcnow().isoformat()
            _save(data)
            return r

    raise ValueError("Artifact not found")
