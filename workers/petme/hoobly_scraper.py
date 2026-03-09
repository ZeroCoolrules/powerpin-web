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
    match = re.search(r"/(\d+)(?:\?|$)", url)
    return match.group(1) if match else url.rstrip("/").split("/")[-1][:255]


def infer_species_and_breed(title: str, description: str | None = None) -> tuple[str | None, str | None]:
    haystack = f"{title} {description or ''}".lower()

    if any(x in haystack for x in ["puppy", "dog", "french bulldog", "pitbull", "poodle", "husky"]):
        return "dog", None
    if any(x in haystack for x in ["kitten", "cat", "maine coon", "persian"]):
        return "cat", None
    if any(x in haystack for x in ["bird", "parrot", "cockatoo", "macaw"]):
        return "bird", None
    if any(x in haystack for x in ["snake", "reptile", "gecko", "iguana"]):
        return "reptile", None

    return None, None


def split_location(location_text: str | None) -> tuple[str | None, str | None]:
    if not location_text:
        return None, None
    parts = [p.strip() for p in location_text.split(",") if p.strip()]
    if len(parts) >= 2:
        return parts[0], parts[-1]
    return location_text, None


def normalize_card(card: Any, source_url: str) -> dict[str, Any] | None:
    link_el = card.select_one("a[href]")
    title_el = card.select_one("a[href] h3") or card.select_one("h3") or link_el

    if not title_el:
        return None

    title = title_el.get_text(" ", strip=True)
    href = link_el.get("href") if link_el else None
    listing_url = urljoin(source_url, href) if href else source_url

    price_el = card.select_one(".price")
    loc_el = card.select_one(".location") or card.select_one(".city")
    desc_el = card.select_one(".description") or card.select_one("p")
    img_el = card.select_one("img")

    description = desc_el.get_text(" ", strip=True) if desc_el else None
    species, breed = infer_species_and_breed(title, description)
    city, state = split_location(loc_el.get_text(" ", strip=True) if loc_el else None)
    image_url = img_el.get("src") if img_el else None

    return {
        "seller_uid": None,
        "source": "hoobly",
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


def scrape_hoobly(search_url: str, timeout: int = 20) -> list[dict[str, Any]]:
    response = requests.get(search_url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    cards = soup.select("article, .listing, .ad, .item")

    listings: list[dict[str, Any]] = []
    for card in cards:
        row = normalize_card(card, search_url)
        if row:
            listings.append(row)

    return listings