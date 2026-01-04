from jinja2 import Template

SERVICE_TEMPLATE = Template("""
from fastapi import FastAPI

app = FastAPI(title="{{ name }}")

@app.get("/health")
def health():
    return {"status": "ok"}
""")

def generate_service(name: str) -> dict:
    filename = f"{name.lower()}_service.py"
    content = SERVICE_TEMPLATE.render(name=name)
    return {filename: content}
