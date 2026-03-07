import re
from dataclasses import dataclass, asdict
from decimal import Decimal, InvalidOperation
from typing import List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = 'https://www.hoobly.com'
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


class HooblyScraper:
    def __init__(self, session: Optional[requests.Session] = None):
        self.session = session or requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})

    def fetch_category_page(self, path: str = '/pets-and-animals', page: int = 1) -> str:
        url = urljoin(BASE_URL, path)
        response = self.session.get(url, params={'page': page}, timeout=20)
        response.raise_for_status()
        return response.text

    def parse_category_page(self, html: str, limit: int = 25) -> List[ListingData]:
        soup = BeautifulSoup(html, 'html.parser')
        cards = soup.select('article, .listing, .item, .card')
        listings: List[ListingData] = []

        for card in cards:
            link_el = card.select_one('a[href]')
            if not link_el:
                continue
            title = link_el.get_text(' ', strip=True) or 'Untitled Listing'
            href = link_el.get('href')
            if not href:
                continue
            full_url = urljoin(BASE_URL, href)
            listing_id = self._extract_listing_id(full_url)
            price_el = card.find(string=re.compile(r'\$\s*\d'))
            location_text = None
            location_el = card.select_one('.location, .city, .region')
            if location_el:
                location_text = location_el.get_text(' ', strip=True)
            city, state = self._split_location(location_text)
            text_blob = card.get_text(' ', strip=True)

            listings.append(
                ListingData(
                    source='hoobly',
                    source_listing_id=listing_id,
                    title=title,
                    description=None,
                    category='Pets & Animals',
                    species=self._infer_species(text_blob),
                    breed=None,
                    sex=None,
                    age_text=None,
                    color=None,
                    price=_parse_price(str(price_el) if price_el else None),
                    currency='USD',
                    city=city,
                    state=state,
                    zip_code=None,
                    listing_url=full_url,
                    image_url=None,
                    health_status=None,
                    is_vaccinated='vaccinated' in text_blob.lower(),
                    is_microchipped='microchipped' in text_blob.lower(),
                    is_spayed_neutered=('spayed' in text_blob.lower() or 'neutered' in text_blob.lower()),
                )
            )
            if len(listings) >= limit:
                break
        return listings

    @staticmethod
    def _extract_listing_id(url: str) -> str:
        match = re.search(r'/(\d+)(?:\?|$)', url)
        return match.group(1) if match else url

    @staticmethod
    def _split_location(location_text: Optional[str]):
        if not location_text:
            return None, None
        parts = [p.strip() for p in location_text.split(',') if p.strip()]
        if len(parts) >= 2:
            return parts[0], parts[1]
        return location_text, None

    @staticmethod
    def _infer_species(text: str) -> Optional[str]:
        haystack = text.lower()
        mapping = {
            'dog': 'Dog',
            'puppy': 'Dog',
            'cat': 'Cat',
            'kitten': 'Cat',
            'bird': 'Bird',
            'parrot': 'Bird',
            'snake': 'Reptile',
            'reptile': 'Reptile',
            'rabbit': 'Rabbit',
            'ferret': 'Ferret',
            'fish': 'Fish',
            'horse': 'Horse',
        }
        for key, value in mapping.items():
            if key in haystack:
                return value
        return None


if __name__ == '__main__':
    scraper = HooblyScraper()
    html = scraper.fetch_category_page()
    rows = scraper.parse_category_page(html, limit=10)
    for row in rows[:5]:
        print(asdict(row))
