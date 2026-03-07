def normalize_pet(data):

    return {

        "name": data.get("title"),
        "species": "unknown",
        "breed": "unknown",
        "price": data.get("price"),
        "source": data.get("source")

    }