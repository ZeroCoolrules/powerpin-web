"""
Trust policy enforcement for PoWERPiN.

This module contains HARD, NON-AI rules.
AI may recommend deltas, but policy always wins.
"""

from config import MAX_TRUST_DELTA


# -------------------------------------------------------------------
# Clamp trust deltas to absolute system limits
# -------------------------------------------------------------------
def clamp_delta(delta: float) -> float:
    """
    Enforce absolute maximum trust delta.
    """
    return max(min(delta, MAX_TRUST_DELTA), -MAX_TRUST_DELTA)


# -------------------------------------------------------------------
# POW / PIN specific rules
# -------------------------------------------------------------------
def pow_pin_rules(actor_type: str, delta: float) -> float:
    """
    Apply role-based trust constraints.

    PINs cannot gain excessive trust too quickly.
    POWs may gain full trust within global limits.
    """
    actor_type = actor_type.upper()

    if actor_type == "PIN" and delta > 2.0:
        return 2.0

    return delta


# -------------------------------------------------------------------
# Intent validation (Builder + Trust shared guard)
# -------------------------------------------------------------------
FORBIDDEN_INTENT = [
    "deploy",
    "mint",
    "transfer",
    "bypass",
    "override",
    "disable audit",
    "disable trust",
]


def validate_description(text: str):
    """
    Hard stop on forbidden intent.
    Used by Builder Agent before generation.
    """
    lowered = text.lower()
    for word in FORBIDDEN_INTENT:
        if word in lowered:
            raise ValueError(f"Forbidden intent detected: {word}")
