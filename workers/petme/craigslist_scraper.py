import re
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0 Safari/537.36"
}


def parse_price(price_text: str | None) -> float | None:
    if not price_text:
        return None
    cleaned = price_text.replace(",", "")
    match = re.search(r"(\d+(?:\.\d{1,2})?)", cleaned)
    return float(match.group(1)) if match else None


def extract_listing_id(url: str) -> str:
    match = re.search(r"/(\d+)\.html", url)
    return match.group(1) if match else url.rstrip("/").split("/")[-1][:255]


def infer_species_and_breed(title: str, description: str | None = None) -> tuple[str | None, str | None]:
    haystack = f"{title} {description or ''}".lower()

    if any(x in haystack for x in ["puppy", "dog", "french bulldog", "pitbull", "poodle", "husky", "shepherd"]):
        return "dog", None
    if any(x in haystack for x in ["kitten", "cat", "maine coon", "persian"]):
        return "cat", None
    if any(x in haystack for x in ["bird", "parrot", "cockatiel", "macaw"]):
        return "bird", None
    if any(x in haystack for x in ["snake", "reptile", "gecko", "iguana", "bearded dragon"]):
        return "reptile", None
    if any(x in haystack for x in ["fish", "betta", "goldfish", "koi"]):
        return "fish", None

    return None, None


def split_location(location_text: str | None) -> tuple[str | None, str | None]:
    if not location_text:
        return None, None
    parts = [p.strip(" ()") for p in location_text.split(",") if p.strip()]
    if len(parts) >= 2:
        return parts[0], parts[-1]
    return location_text.strip(" ()"), None


def normalize_card(card: Any, source_url: str) -> dict[str, Any] | None:
    title_el = card.select_one(".title") or card.select_one(".result-title") or card.select_one("a")
    if not title_el:
        return None

    title = title_el.get_text(" ", strip=True)
    href = title_el.get("href")
    listing_url = urljoin(source_url, href) if href else source_url

    price_el = card.select_one(".price") or card.select_one(".result-price")
    hood_el = card.select_one(".location") or card.select_one(".result-hood")
    desc_el = card.select_one(".description") or card.select_one(".result-snippet")
    img_el = card.select_one("img")

    description = desc_el.get_text(" ", strip=True) if desc_el else None
    species, breed = infer_species_and_breed(title, description)
    city, state = split_location(hood_el.get_text(" ", strip=True) if hood_el else None)
    image_url = None
    if img_el:
        image_url = img_el.get("src") or img_el.get("data-src")

    return {
        "seller_uid": None,
        "source": "craigslist",
        "source_listing_id": extract_listing_id(listing_url),
        "title": title,
        "description": description,
        "species": species,
        "breed": breed,
        "price": parse_price(price_el.get_text(strip=True) if price_el else None),
        "city": city,
        "state": state,
        "image_url": image_url,
        "listing_url": listing_url,
        "is_active": True,
    }


def scrape_craigslist(search_url: str, timeout: int = 20) -> list[dict[str, Any]]:
    response = requests.get(search_url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    cards = soup.select("li.cl-static-search-result, li.result-row")

    listings: list[dict[str, Any]] = []
    for card in cards:
        row = normalize_card(card, search_url)
        if row:
            listings.append(row)

    return listings