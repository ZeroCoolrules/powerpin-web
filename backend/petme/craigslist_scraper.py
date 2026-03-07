import re
from dataclasses import dataclass, asdict
from decimal import Decimal, InvalidOperation
from typing import List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = 'https://stlouis.craigslist.org'
SEARCH_URL = f'{BASE_URL}/search/pet'
USER_AGENT = 'Mozilla/5.0 (compatible; PetMeBabyBot/0.1; +https://petme.baby)'


@dataclass
class ListingData:
    source: str
    source_listing_id: str
    title: str
    description: Optional[str]
    category: Optional[str]
    species: Optional[str]
    breed: Optional[str]
    sex: Optional[str]
    age_text: Optional[str]
    color: Optional[str]
    price: Optional[Decimal]
    currency: str
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    listing_url: str
    image_url: Optional[str]
    health_status: Optional[str]
    is_vaccinated: bool
    is_microchipped: bool
    is_spayed_neutered: bool


def _parse_price(raw: Optional[str]) -> Optional[Decimal]:
    if not raw:
        return None
    digits = re.sub(r'[^\d.]', '', raw)
    if not digits:
        return None
    try:
        return Decimal(digits)
    except InvalidOperation:
        return None


SPECIES_KEYWORDS = {
    'dog': 'Dog',
    'puppy': 'Dog',
    'cat': 'Cat',
    'kitten': 'Cat',
    'bird': 'Bird',
    'parrot': 'Bird',
    'reptile': 'Reptile',
    'snake': 'Reptile',
    'lizard': 'Reptile',
    'tortoise': 'Reptile',
    'rabbit': 'Rabbit',
    'bunny': 'Rabbit',
    'ferret': 'Ferret',
    'hamster': 'Hamster',
    'guinea pig': 'Guinea Pig',
    'fish': 'Fish',
}


def _infer_species(title: str, description: Optional[str]) -> Optional[str]:
    haystack = f'{title} {description or ""}'.lower()
    for keyword, value in SPECIES_KEYWORDS.items():
        if keyword in haystack:
            return value
    return None


HEALTH_WORDS = {
    'vaccinated': ('is_vaccinated', True),
    'shots': ('is_vaccinated', True),
    'microchipped': ('is_microchipped', True),
    'neutered': ('is_spayed_neutered', True),
    'spayed': ('is_spayed_neutered', True),
}


def _extract_flags(text: str):
    flags = {
        'is_vaccinated': False,
        'is_microchipped': False,
        'is_spayed_neutered': False,
    }
    lower = text.lower()
    for word, (field, value) in HEALTH_WORDS.items():
        if word in lower:
            flags[field] = value
    return flags


class CraigslistScraper:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})

    def fetch_search_page(self, query: Optional[str] = None, limit: int = 25) -> str:
        params = {'query': query, 'sort': 'date'} if query else {'sort': 'date'}
        response = self.session.get(SEARCH_URL, params=params, timeout=20)
        response.raise_for_status()
        return response.text

    def parse_search_results(self, html: str, limit: int = 25) -> List[ListingData]:
        soup = BeautifulSoup(html, 'html.parser')
        items = soup.select('li.cl-static-search-result, li.cl-search-result')
        listings: List[ListingData] = []

        for item in items[:limit]:
            title_el = item.select_one('.title, .posting-title, a.cl-app-anchor') or item.select_one('a')
            price_el = item.select_one('.price')
            location_el = item.select_one('.location')
            img_el = item.select_one('img')
            href = title_el.get('href') if title_el else None
            title = title_el.get_text(strip=True) if title_el else 'Untitled Listing'
            if not href:
                continue
            full_url = urljoin(BASE_URL, href)
            listing_id = self._extract_listing_id(full_url)
            location_text = location_el.get_text(' ', strip=True) if location_el else None
            city, state = self._split_location(location_text)
            flags = _extract_flags(title)

            listings.append(
                ListingData(
                    source='craigslist',
                    source_listing_id=listing_id,
                    title=title,
                    description=None,
                    category='Pets',
                    species=_infer_species(title, None),
                    breed=None,
                    sex=None,
                    age_text=None,
                    color=None,
                    price=_parse_price(price_el.get_text(strip=True) if price_el else None),
                    currency='USD',
                    city=city,
                    state=state,
                    zip_code=None,
                    listing_url=full_url,
                    image_url=img_el.get('src') if img_el else None,
                    health_status=None,
                    is_vaccinated=flags['is_vaccinated'],
                    is_microchipped=flags['is_microchipped'],
                    is_spayed_neutered=flags['is_spayed_neutered'],
                )
            )
        return listings

    @staticmethod
    def _extract_listing_id(url: str) -> str:
        match = re.search(r'/(\d+)\.html', url)
        return match.group(1) if match else url

    @staticmethod
    def _split_location(location_text: Optional[str]):
        if not location_text:
            return None, None
        cleaned = location_text.strip(' ()')
        parts = [p.strip() for p in cleaned.split(',') if p.strip()]
        if len(parts) >= 2:
            return parts[0], parts[1]
        return cleaned, None


if __name__ == '__main__':
    scraper = CraigslistScraper()
    html = scraper.fetch_search_page(limit=10)
    rows = scraper.parse_search_results(html, limit=10)
    for row in rows[:5]:
        print(asdict(row))
