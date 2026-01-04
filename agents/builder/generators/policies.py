FORBIDDEN_ACTIONS = [
    "deploy",
    "mint",
    "transfer_funds",
    "modify_trust",
    "bypass_auth",
]

def validate_description(text: str):
    for word in FORBIDDEN_ACTIONS:
        if word in text.lower():
            raise ValueError(f"Forbidden intent detected: {word}")
