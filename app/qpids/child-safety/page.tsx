import Link from "next/link";
import LegalDoc, { Contact, Section, WhoWeAre } from "../legal/LegalDoc";
import { qp } from "../lib/paths";

export const metadata = { title: "Child Safety Standards · Qpids Place" };

// Google Play asks every dating app for a public page like this one. Keep it
// reachable without signing in, and keep it true: if how we handle reports
// changes, change this page.
export default function ChildSafety() {
  return (
    <LegalDoc title="Child Safety Standards">
      <WhoWeAre />
      <Section title="Our standard">
        <p>Qpids Place, on the web and in the Qpids Place app, is for adults aged 18 and over only. We do not allow child sexual abuse material or any content or behaviour that sexualises, grooms, exploits or endangers a child. This covers photos, profiles, messages, posts, meetups and live video.</p>
      </Section>
      <Section title="What we do">
        <ul>
          <li>Everyone confirms they are 18 or older when they join. Accounts that appear to belong to someone under 18 are removed.</li>
          <li>A person reviews the photos members add.</li>
          <li>Accounts that share or ask for child sexual abuse material, or that try to contact or exploit a child, are banned permanently.</li>
          <li>When we confirm child sexual abuse material, we report it to the National Center for Missing &amp; Exploited Children (NCMEC), keep what the law requires us to keep, and cooperate with law enforcement.</li>
        </ul>
      </Section>
      <Section title="How to report">
        <p>Use the Report button on any profile, in the app or on the site, and say what you saw. You can also write to <Contact />. We review child safety reports first, ahead of everything else.</p>
        <p>If a child is in immediate danger, call 911 or your local emergency number. In the United States you can also report to NCMEC at CyberTipline.org or 1-800-843-5678.</p>
      </Section>
      <Section title="Contact">
        <p>Questions about these standards: <Contact />. See also our <Link href={qp("guidelines")} className="font-semibold underline">Community Guidelines</Link>.</p>
      </Section>
    </LegalDoc>
  );
}
