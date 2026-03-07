from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from craigslist_scraper import CraigslistScraper
from database import Base, engine, get_db
from hoobly_scraper import HooblyScraper
from models import HealthRecord, PetListing, ScrapeRun, Seller

Base.metadata.create_all(bind=engine)

app = FastAPI(title='PetMe.Baby API', version='0.1.0')


class ListingOut(BaseModel):
    id: int
    source: str
    source_listing_id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    sex: Optional[str] = None
    age_text: Optional[str] = None
    color: Optional[str] = None
    price: Optional[Decimal] = None
    currency: str
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    listing_url: str
    image_url: Optional[str] = None
    health_status: Optional[str] = None
    is_vaccinated: bool
    is_microchipped: bool
    is_spayed_neutered: bool
    is_active: bool
    posted_at: Optional[datetime] = None
    scraped_at: datetime

    model_config = ConfigDict(from_attributes=True)


@app.get('/health')
def healthcheck():
    return {'status': 'ok', 'service': 'petme-baby-api'}


@app.get('/listings', response_model=list[ListingOut])
def get_listings(
    source: Optional[str] = None,
    species: Optional[str] = None,
    city: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(PetListing).filter(PetListing.is_active.is_(True))
    if source:
        query = query.filter(PetListing.source == source)
    if species:
        query = query.filter(PetListing.species == species)
    if city:
        query = query.filter(PetListing.city.ilike(f'%{city}%'))
    return query.order_by(PetListing.scraped_at.desc()).limit(limit).all()


@app.post('/scrape/craigslist')
def scrape_craigslist(
    query: Optional[str] = None,
    limit: int = Query(default=25, le=100),
    db: Session = Depends(get_db),
):
    run = ScrapeRun(source='craigslist', status='running')
    db.add(run)
    db.commit()
    db.refresh(run)

    scraper = CraigslistScraper()
    try:
        html = scraper.fetch_search_page(query=query, limit=limit)
        rows = scraper.parse_search_results(html, limit=limit)
        inserted, updated = _upsert_listings(db, rows)
        run.status = 'success'
        run.records_found = len(rows)
        run.records_inserted = inserted
        run.records_updated = updated
        run.finished_at = datetime.utcnow()
        db.commit()
        return {
            'source': 'craigslist',
            'records_found': len(rows),
            'records_inserted': inserted,
            'records_updated': updated,
        }
    except Exception as exc:
        run.status = 'failed'
        run.finished_at = datetime.utcnow()
        run.error_message = str(exc)
        db.commit()
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post('/scrape/hoobly')
def scrape_hoobly(
    path: str = '/pets-and-animals',
    limit: int = Query(default=25, le=100),
    db: Session = Depends(get_db),
):
    run = ScrapeRun(source='hoobly', status='running')
    db.add(run)
    db.commit()
    db.refresh(run)

    scraper = HooblyScraper()
    try:
        html = scraper.fetch_category_page(path=path)
        rows = scraper.parse_category_page(html, limit=limit)
        inserted, updated = _upsert_listings(db, rows)
        run.status = 'success'
        run.records_found = len(rows)
        run.records_inserted = inserted
        run.records_updated = updated
        run.finished_at = datetime.utcnow()
        db.commit()
        return {
            'source': 'hoobly',
            'records_found': len(rows),
            'records_inserted': inserted,
            'records_updated': updated,
        }
    except Exception as exc:
        run.status = 'failed'
        run.finished_at = datetime.utcnow()
        run.error_message = str(exc)
        db.commit()
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def _upsert_listings(db: Session, rows) -> tuple[int, int]:
    inserted = 0
    updated = 0
    for row in rows:
        existing = (
            db.query(PetListing)
            .filter(
                PetListing.source == row.source,
                PetListing.source_listing_id == row.source_listing_id,
            )
            .first()
        )
        if existing:
            existing.title = row.title
            existing.description = row.description
            existing.category = row.category
            existing.species = row.species
            existing.breed = row.breed
            existing.sex = row.sex
            existing.age_text = row.age_text
            existing.color = row.color
            existing.price = row.price
            existing.city = row.city
            existing.state = row.state
            existing.zip_code = row.zip_code
            existing.listing_url = row.listing_url
            existing.image_url = row.image_url
            existing.health_status = row.health_status
            existing.is_vaccinated = row.is_vaccinated
            existing.is_microchipped = row.is_microchipped
            existing.is_spayed_neutered = row.is_spayed_neutered
            existing.scraped_at = datetime.utcnow()
            updated += 1
        else:
            db.add(
                PetListing(
                    source=row.source,
                    source_listing_id=row.source_listing_id,
                    title=row.title,
                    description=row.description,
                    category=row.category,
                    species=row.species,
                    breed=row.breed,
                    sex=row.sex,
                    age_text=row.age_text,
                    color=row.color,
                    price=row.price,
                    currency=row.currency,
                    city=row.city,
                    state=row.state,
                    zip_code=row.zip_code,
                    listing_url=row.listing_url,
                    image_url=row.image_url,
                    health_status=row.health_status,
                    is_vaccinated=row.is_vaccinated,
                    is_microchipped=row.is_microchipped,
                    is_spayed_neutered=row.is_spayed_neutered,
                )
            )
            inserted += 1
    db.commit()
    return inserted, updated
