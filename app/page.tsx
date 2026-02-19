import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import MilestoneAnnouncement from "@/app/components/MilestoneAnnouncement"

export default function HomePage() {
  return (
    <AppShell>
     <MilestoneAnnouncement />
       <section className="home">
        <div className="home-inner">

          <div className="badge">SHOWCASE BUILD</div>

          <h1 className="title">PoWERPiN</h1>

          <p className="tagline">
            People of Worth empowering People in Need.
          </p>

          <div className="cta-row">
            <Link href="/ghostpool" className="cta primary">
              Ghost Pool
            </Link>

            <Link href="/endless" className="cta">
              Enter Endless
            </Link>

            <Link href="/cog" className="cta">
              View COG
            </Link>
          </div>

          <div className="divider" />

          <p className="subtext">
            A unified ecosystem for value, trust, time, and opportunity.
          </p>

        </div>
      </section>
    </AppShell>
  );
}

