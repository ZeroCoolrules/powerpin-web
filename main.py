from fastapi import FastAPI

from agents.builder.api import router as builder_router
from agents.trust.api import router as trust_router
from agents.store.api import router as store_router

app = FastAPI(
    title="PoWERPiN Core",
    description="Endless Builder + Trust + Store Authority",
    version="0.1.0",
)

app.include_router(builder_router)
app.include_router(trust_router)
app.include_router(store_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "services": ["builder", "trust", "store"],
    }
