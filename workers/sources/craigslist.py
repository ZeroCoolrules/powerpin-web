import requests
from bs4 import BeautifulSoup

def scrape_craigslist():

    url = "https://craigslist.org/search/pet"

    r = requests.get(url)

    soup = BeautifulSoup(r.text, "html.parser")

    pets = []

    posts = soup.select(".result-row")

    for post in posts:

        title = post.select_one(".result-title").text

        price = post.select_one(".result-price")

        pets.append({
            "title": title,
            "price": price.text if price else None,
            "source": "craigslist"
        })

    return pets