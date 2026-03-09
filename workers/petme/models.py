from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class Seller(Base):
    __tablename__ = 'sellers'

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), nullable=False, index=True)
    source_seller_id = Column(String(255), nullable=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    city = Column(String(120), nullable=True, index=True)
    state = Column(String(50), nullable=True, index=True)
    profile_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    listings = relationship('PetListing', back_populates='seller', cascade='all, delete-orphan')


class PetListing(Base):
    __tablename__ = 'pet_listings'
    __table_args__ = (
        UniqueConstraint('source', 'source_listing_id', name='uq_source_listing'),
    )

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), nullable=False, index=True)
    source_listing_id = Column(String(255), nullable=False, index=True)
    seller_id = Column(Integer, ForeignKey('sellers.id'), nullable=True, index=True)

    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(120), nullable=True, index=True)
    species = Column(String(120), nullable=True, index=True)
    breed = Column(String(120), nullable=True, index=True)
    sex = Column(String(20), nullable=True, index=True)
    age_text = Column(String(80), nullable=True)
    color = Column(String(80), nullable=True)
    price = Column(Numeric(10, 2), nullable=True, index=True)
    currency = Column(String(10), default='USD', nullable=False)
    city = Column(String(120), nullable=True, index=True)
    state = Column(String(50), nullable=True, index=True)
    zip_code = Column(String(20), nullable=True)
    listing_url = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    health_status = Column(String(120), nullable=True)
    is_vaccinated = Column(Boolean, default=False, nullable=False)
    is_microchipped = Column(Boolean, default=False, nullable=False)
    is_spayed_neutered = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    posted_at = Column(DateTime, nullable=True, index=True)
    scraped_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    seller = relationship('Seller', back_populates='listings')
    health_records = relationship('HealthRecord', back_populates='listing', cascade='all, delete-orphan')


class HealthRecord(Base):
    __tablename__ = 'health_records'

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey('pet_listings.id'), nullable=False, index=True)
    record_type = Column(String(100), nullable=False, index=True)
    provider_name = Column(String(255), nullable=True)
    note = Column(Text, nullable=True)
    document_url = Column(Text, nullable=True)
    issued_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    listing = relationship('PetListing', back_populates='health_records')


class ScrapeRun(Base):
    __tablename__ = 'scrape_runs'

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    finished_at = Column(DateTime, nullable=True)
    status = Column(String(40), nullable=False, default='running', index=True)
    records_found = Column(Integer, nullable=False, default=0)
    records_inserted = Column(Integer, nullable=False, default=0)
    records_updated = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)
