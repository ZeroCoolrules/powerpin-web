import SplashFrame from "@/components/splash/SplashFrame";
import TitleBanner from "@/components/splash/TitleBanner";
import PrimaryCTA from "@/components/splash/PrimaryCTA";

export default function StreetSplash() {
  return (
    <SplashFrame>
      <TitleBanner
        title="Alpha Endless Street"
        subtitle="A public place of play, trade, and connection."
      />

      <p className="text-neutral-300">
        Streets are public, discoverable spaces that host storefronts and private houses.
      </p>

      <div className="flex gap-4 mt-6">
        <PrimaryCTA label="Browse Storefronts" />
        <PrimaryCTA label="Enter Houses" />
      </div>
    </SplashFrame>
  );
}
