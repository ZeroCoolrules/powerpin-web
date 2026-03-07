import hashlib

def generate_pet_id(pet):

    raw = f"{pet['name']}{pet['breed']}{pet['source']}"

    return hashlib.sha256(raw.encode()).hexdigest()