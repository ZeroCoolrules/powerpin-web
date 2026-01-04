import json
import uuid
import hashlib
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional

REGISTRY_PATH = Path("artifacts/registry.json")


# ---------- storage ----------

def _load() -> List[Dict]:
    if REGISTRY_PATH.exists():
        return json.loads(REGISTRY_PATH.read_text())
    return []


def _save(data: List[Dict]) -> None:
    REGISTRY_PATH.parent.mkdir(exist_ok=True)
    tmp = REGISTRY_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2))
    tmp.replace(REGISTRY_PATH)


# ---------- hashing ----------

def hash_files(files: List[str]) -> str:
    h = hashlib.sha256()
    for f in sorted(files):
        p = Path(f)
        if not p.exists():
            raise FileNotFoundError(f"Artifact file missing: {f}")
        h.update(p.read_bytes())
    return h.hexdigest()


# ---------- registry ----------

def register_artifact(*, manifest: dict, files: List[str], builder: str):
    artifact_hash = hash_files(files)

    record = {
        "id": str(uuid.uuid4()),
        "manifest": manifest,
        "files": files,
        "builder": builder,
        "artifact_hash": artifact_hash,
        "created_at": datetime.utcnow().isoformat()
    }

    data = _load()
    data.append(record)
    _save(data)

    return record["id"], artifact_hash


def list_registered() -> List[Dict]:
    return _load()


def get_artifact(artifact_id: str) -> Optional[Dict]:
    for r in _load():
        if r["id"] == artifact_id:
            return r
    return None


# ---------- cryptographic verification ----------

def verify_signature(
    artifact_hash: str,
    signature_b64: str,
    public_key
) -> bool:
    """
    public_key must be a cryptography / pynacl / ed25519 public key object
    """
    try:
        import base64
        signature = base64.b64decode(signature_b64)
        public_key.verify(signature, artifact_hash.encode())
        return True
    except Exception:
        return False


# ---------- runtime gate ----------

def is_artifact_runnable(
    artifact_id: str,
    approvals: List[Dict],
    signatures: List[Dict],
    system_public_key
) -> bool:
    artifact = get_artifact(artifact_id)
    if not artifact:
        return False

    artifact_hash = artifact["artifact_hash"]

    # 1. approval must exist
    approval = next(
        (
            a for a in approvals
            if a["artifact_id"] == artifact_id
            and a["status"] == "approved"
        ),
        None
    )
    if not approval:
        return False

    # 2. signature must exist
    signature = next(
        (s for s in signatures if s["artifact_id"] == artifact_id),
        None
    )
    if not signature:
        return False

    # 3. signature must verify
    if not verify_signature(
        artifact_hash,
        signature["signature"],
        system_public_key
    ):
        return False

    return True
