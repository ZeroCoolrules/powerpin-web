import PetListingCard from "./PetListingCard";

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

export default function PetListingGrid({ listings }: { listings: PetListing[] }) {
  if (!listings.length) {
    return <div className="text-zinc-500">No listings found yet.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <PetListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}