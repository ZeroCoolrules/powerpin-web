def base_score(action: str) -> float:
    if action == "mint_attempt":
        return -1.0
    if action == "assist":
        return 1.5
    return 0.0
