from sources.craigslist import scrape_craigslist
from normalize import normalize_pet

def run_engine():

    pets = []

    pets += scrape_craigslist()

    normalized = []

    for pet in pets:

        normalized.append(
            normalize_pet(pet)
        )

    return normalized


if __name__ == "__main__":

    data = run_engine()

    print(data)