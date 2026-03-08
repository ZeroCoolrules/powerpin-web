import Link from "next/link";

type PetListing = {
  id: number;
  title: string;
  description?: string | null;
  species?: string | null;
  breed?: string | null;
  price?: number | null;
  city?: string | null;
  state?: string | null;
  image_url?: string | null;
  listing_url: string;
  seller_uid?: string | null;
};

export default function PetListingCard({ listing }: { listing: PetListing }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg">
      <div className="h-56 bg-zinc-900">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            No image
          </div>
        )}
      </div>

      <div className="p-5">
        <Link href={`/petme-baby/listings/${listing.id}`}>
          <h3 className="text-xl font-semibold text-white hover:text-green-400 transition cursor-pointer">
            {listing.title}
          </h3>
        </Link>

        <p className="mt-2 text-green-400 font-medium">
          {listing.price ? `$${listing.price}` : "Price on request"}
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          {[listing.species, listing.breed].filter(Boolean).join(" • ") || "Unknown type"}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {[listing.city, listing.state].filter(Boolean).join(", ") || "Location unknown"}
        </p>

        <p className="mt-4 text-sm text-zinc-300 line-clamp-4">
          {listing.description || "No description available."}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/petme-baby/listings/${listing.id}`}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-white hover:bg-zinc-900 transition"
          >
            Details
          </Link>

          <a
            href={listing.listing_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
          >
            View Source
          </a>

          {listing.seller_uid ? (
            <Link
              href={`/petme-baby/profile/${listing.seller_uid}`}
              className="px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition"
            >
              Seller
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}