import SplashFrame from "@/components/splash/SplashFrame";
import TitleBanner from "@/components/splash/TitleBanner";
import PrimaryCTA from "@/components/splash/PrimaryCTA";

export default function HouseRoomSplash() {
  return (
    <SplashFrame>
      <TitleBanner
        title="Living Room"
        subtitle="Personal space"
      />

      <p className="text-neutral-300">
        This room belongs to a private house. No transactions occur here.
      </p>

      <PrimaryCTA label="Enter Room" />
    </SplashFrame>
  );
}