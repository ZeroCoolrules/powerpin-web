import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERVICE_NAME = "PoWERPiN Trust Agent"
MAX_TRUST_DELTA = 5.0
