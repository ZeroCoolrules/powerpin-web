from openai import OpenAI
from config import OPENAI_API_KEY
from agents.trust.scoring import base_score
from agents.trust.policy import clamp_delta, pow_pin_rules

client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a PoWERPiN Trust Agent.
You may recommend trust changes but never exceed policy limits.
Respond ONLY in JSON.
"""

def evaluate_trust(payload):
    base = base_score(payload.action)

    response = client.responses.create(
        model="gpt-5.2",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": payload.json()},
        ],
    )

    ai = response.output_parsed  # structured JSON

    delta = base + ai["trust_delta"]
    delta = clamp_delta(delta)
    delta = pow_pin_rules(payload.actor_type, delta)

    return {
        "allow": ai["allow"],
        "trust_delta": delta,
        "reason": ai["reason"],
        "confidence": ai.get("confidence", 0.8),
    }
