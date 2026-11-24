import Link from "next/link";
import LegalDoc, { Contact, Section } from "../legal/LegalDoc";
import { qp } from "../lib/paths";

export const metadata = { title: "Community Guidelines · Qpids Place" };

export default function Guidelines() {
  return (
    <LegalDoc title="Community Guidelines">
      <p>Qpids Place is for adults meeting other adults. If you break these rules we may remove content or suspend or close your account.</p>
      <ul>
        <li><b>18+ only.</b> Report anyone who seems to be under 18. We remove them right away. See our <Link href={qp("child-safety")} className="font-semibold underline">Child Safety Standards</Link>.</li>
        <li><b>Be yourself.</b> No fake profiles, impersonation, or photos of other people.</li>
        <li><b>Respect no.</b> No harassment, threats, hate speech, or unwanted sexual messages.</li>
        <li><b>Keep photos and posts clean.</b> No nudity or sexual content in photos, posts, meetups or public chat.</li>
        <li><b>No selling.</b> No escorting, paid dates, paid companionship, sugar arrangements, spam, scams, or asking people for money.</li>
        <li><b>Meetups are for meeting.</b> Public places, honest descriptions, and no pressure on anyone to stay or to share where they live.</li>
        <li><b>Keep it legal.</b> Nothing illegal, and never share someone’s private information.</li>
      </ul>
      <Section title="If something goes wrong">
        <p>Use Report and Block on any profile. We read every report. If you are in danger, contact local emergency services first. You can also reach us at <Contact />. Our <Link href={qp("safety")} className="font-semibold underline">safety advice</Link> is worth reading before you meet anyone.</p>
      </Section>
    </LegalDoc>
  );
}
