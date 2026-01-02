def plan_build(description: str) -> list[str]:
    """
    Breaks a build into safe steps.
    """
    return [
        "Define purpose",
        "Identify components",
        "Generate manifests",
        "Generate scaffolds",
        "Register artifacts"
    ]
