import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

AGENT_NAME = "Endless Builder Agent"
MAX_FILES_PER_BUILD = 10
# --------------------------------------------------
# Trust system constants (GLOBAL AUTHORITY)
# --------------------------------------------------
MAX_TRUST_DELTA = 5.0
# HARD LOCKS
ALLOW_DEPLOYMENT = False
ALLOW_MINTING = False
ALLOW_DIRECT_DB_WRITES = False
