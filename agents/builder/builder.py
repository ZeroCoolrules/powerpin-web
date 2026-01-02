from typing import Dict

from openai import OpenAI

from agents.builder.planner import plan_build
from agents.builder.manifests import ToolManifest
from agents.builder.generators.service import generate_service
from agents.store.registry import register_artifact
from agents.trust.policy import validate_description

from config import OPENAI_API_KEY


# -------------------------------------------------------------------
# OpenAI client (Builder Agent NEVER deploys or mints)
# -------------------------------------------------------------------
client = OpenAI(api_key=OPENAI_API_KEY)


# -------------------------------------------------------------------
# System Prompt (Builder is an ARCHITECT, not an operator)
# -------------------------------------------------------------------
SYSTEM_PROMPT = """
You are the Endless Builder Agent.

You DESIGN systems.
You DO NOT deploy systems.
You DO NOT mint currency.
You DO NOT modify trust or permissions.

You only:
- Generate scaffolds
- Generate manifests
- Generate documentation
- Register artifacts for human approval

All output must be deterministic and reviewable.
"""


# -------------------------------------------------------------------
# Core Builder Entry
# -------------------------------------------------------------------
def run_builder(request) -> Dict:
    """
    Main Builder Agent execution path.

    This function:
    - Validates intent
    - Plans the build
    - Generates artifacts
    - Registers output in the Store registry
    - NEVER deploys
    """

    # ---------------------------------------------------------------
    # 1. Validate request intent (hard guardrail)
    # ---------------------------------------------------------------
    validate_description(request.description)

    # ---------------------------------------------------------------
    # 2. Decompose the build into steps (planning only)
    # ---------------------------------------------------------------
    plan_build(request.description)

    # ---------------------------------------------------------------
    # 3. Generate artifacts (SAFE GENERATION ONLY)
    # ---------------------------------------------------------------
    artifacts: Dict[str, str] = {}

    build_type = request.type.lower()

    if build_type == "service":
        artifacts.update(generate_service(request.name))

    elif build_type == "agent":
        raise ValueError("Agent generation not implemented yet")

    elif build_type == "tool":
        raise ValueError("Tool generation not implemented yet")

    elif build_type == "schema":
        raise ValueError("Schema generation not implemented yet")

    else:
        raise ValueError(f"Unsupported build type: {request.type}")

    # ---------------------------------------------------------------
    # 4. Ensure something was actually generated
    # ---------------------------------------------------------------
    if not artifacts:
        raise ValueError("Builder produced no artifacts")

    # ---------------------------------------------------------------
    # 5. Build manifest (Store + Trust readable)
    # ---------------------------------------------------------------
    manifest = ToolManifest(
        name=request.name,
        version="0.1.0",
        description=request.description,
        permissions=[],
        trust_class="NEUTRAL",
        audit_required=True,
    ).dict()

    # ---------------------------------------------------------------
    # 6. Register artifact (IMMUTABLE, UNAPPROVED)
    # ---------------------------------------------------------------
    artifact_id = register_artifact(
        manifest=manifest,
        files=list(artifacts.keys()),
        builder="Endless Builder Agent",
    )

    # ---------------------------------------------------------------
    # 7. Controlled response
    # ---------------------------------------------------------------
    return {
        "build_id": artifact_id,
        "files_generated": len(artifacts),
        "artifact_path": f"artifacts/{artifact_id}",
        "requires_approval": True,
    }
