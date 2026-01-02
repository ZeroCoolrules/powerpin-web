from datetime import datetime

def log_decision(actor_id, decision):
    record = {
        "actor_id": actor_id,
        "decision": decision,
        "timestamp": datetime.utcnow().isoformat()
    }
    print("AUDIT:", record)
    # later → Supabase insert
