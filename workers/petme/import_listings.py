import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

from craigslist_scraper import scrape_craigslist
from hoobly_scraper import scrape_hoobly

load_dotenv()
load_dotenv("/mnt/data/settings.env")

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("DB_URL")
if not DATABASE_URL:
    raise RuntimeError("Missing DATABASE_URL or DB_URL")

engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_JSON = BASE_DIR / "listings.json"


def normalize_listing(raw: dict[str, Any], source: str = "import") -> dict[str, Any]:
    title = (raw.get("title") or "Untitled Listing").strip()

    source_listing_id = str(
        raw.get("source_listing_id")
        or raw.get("id")
        or raw.get("listing_id")
        or f"{source}-{abs(hash(title + str(raw.get('listing_url', ''))))}"
    )[:255]

    price = raw.get("price")
    try:
        price = float(price) if price not in (None, "", "null") else None
    except Exception:
        price = None

    return {
        "seller_uid": raw.get("seller_uid"),
        "source": (raw.get("source") or source).strip(),
        "source_listing_id": source_listing_id,
        "title": title,
        "description": raw.get("description"),
        "species": raw.get("species"),
        "breed": raw.get("breed"),
        "price": price,
        "city": raw.get("city"),
        "state": raw.get("state"),
        "image_url": raw.get("image_url"),
        "listing_url": raw.get("listing_url") or f"https://petme.baby/import/{source_listing_id}",
        "is_active": bool(raw.get("is_active", True)),
    }


UPSERT_SQL = text("""
insert into public.pet_listings (
  seller_uid,
  source,
  source_listing_id,
  title,
  description,
  species,
  breed,
  price,
  city,
  state,
  image_url,
  listing_url,
  is_active
)
values (
  :seller_uid,
  :source,
  :source_listing_id,
  :title,
  :description,
  :species,
  :breed,
  :price,
  :city,
  :state,
  :image_url,
  :listing_url,
  :is_active
)
on conflict (source, source_listing_id) do update
set
  seller_uid = excluded.seller_uid,
  title = excluded.title,
  description = excluded.description,
  species = excluded.species,
  breed = excluded.breed,
  price = excluded.price,
  city = excluded.city,
  state = excluded.state,
  image_url = excluded.image_url,
  listing_url = excluded.listing_url,
  is_active = excluded.is_active;
""")


SCRAPE_RUN_START_SQL = text("""
insert into public.scrape_runs (
  source,
  status,
  records_found,
  records_inserted,
  records_updated,
  started_at
)
values (
  :source,
  'running',
  :records_found,
  0,
  0,
  now()
)
returning id;
""")


SCRAPE_RUN_FINISH_SQL = text("""
update public.scrape_runs
set
  status = :status,
  records_inserted = :records_inserted,
  records_updated = :records_updated,
  error_message = :error_message,
  finished_at = now()
where id = :run_id;
""")


def load_json(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, list):
        return data

    if isinstance(data, dict) and "listings" in data and isinstance(data["listings"], list):
        return data["listings"]

    raise ValueError('JSON must be a list or {"listings": [...]}')

def import_rows(rows: list[dict[str, Any]], source: str) -> None:
    normalized_rows = [normalize_listing(row, source=source) for row in rows]

    inserted = 0
    updated = 0

    with engine.begin() as conn:
        run_id = conn.execute(
            SCRAPE_RUN_START_SQL,
            {"source": source, "records_found": len(normalized_rows)},
        ).scalar_one()

        try:
            for row in normalized_rows:
                before = conn.execute(
                    text("""
                    select id
                    from public.pet_listings
                    where source = :source and source_listing_id = :source_listing_id
                    """),
                    {
                        "source": row["source"],
                        "source_listing_id": row["source_listing_id"],
                    },
                ).first()

                conn.execute(UPSERT_SQL, row)

                if before:
                    updated += 1
                else:
                    inserted += 1

            conn.execute(
                SCRAPE_RUN_FINISH_SQL,
                {
                    "run_id": run_id,
                    "status": "completed",
                    "records_inserted": inserted,
                    "records_updated": updated,
                    "error_message": None,
                },
            )
        except Exception as exc:
            conn.execute(
                SCRAPE_RUN_FINISH_SQL,
                {
                    "run_id": run_id,
                    "status": "failed",
                    "records_inserted": inserted,
                    "records_updated": updated,
                    "error_message": str(exc),
                },
            )
            raise

    print(f"Imported {len(normalized_rows)} rows from {source}. Inserted={inserted}, Updated={updated}")


def import_from_json(path: Path, source: str = "json-import") -> None:
    raw_rows = load_json(path)
    import_rows(raw_rows, source=source)


def import_from_craigslist(search_url: str) -> None:
    rows = scrape_craigslist(search_url)
    import_rows(rows, source="craigslist")


def import_from_hoobly(search_url: str) -> None:
    rows = scrape_hoobly(search_url)
    import_rows(rows, source="hoobly")


if __name__ == "__main__":
    import sys

    mode = sys.argv[1] if len(sys.argv) > 1 else "json"

    if mode == "json":
        json_path = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_JSON
        source = sys.argv[3] if len(sys.argv) > 3 else "json-import"
        import_from_json(json_path, source=source)

    elif mode == "craigslist":
        if len(sys.argv) < 3:
            raise SystemExit(
                "Usage: python workers/petme/import_listings.py craigslist <search_url>"
            )
        import_from_craigslist(sys.argv[2])

    elif mode == "hoobly":
        if len(sys.argv) < 3:
            raise SystemExit(
                "Usage: python workers/petme/import_listings.py hoobly <search_url>"
            )
        import_from_hoobly(sys.argv[2])

    else:
        raise SystemExit("Modes: json | craigslist | hoobly")