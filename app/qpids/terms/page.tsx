import Link from "next/link";
import LegalDoc, { Contact, Section, WhoWeAre } from "../legal/LegalDoc";
import { ScreeningStatement } from "../SafetyNotice";
import { OPERATOR } from "../lib/legal";
import { qp } from "../lib/paths";

export const metadata = { title: "Terms of Service · Qpids Place" };

export default function Terms() {
  return (
    <LegalDoc title="Terms of Service">
      <WhoWeAre />
      <Section title="Who can use Qpids Place">
        <p>You must be at least 18 years old. By creating an account you confirm that you are 18 or older and that you can legally agree to these terms. One account per person. You may not use Qpids Place if we have banned you before, or if you are required to register as a sex offender.</p>
      </Section>
      <Section title="Your account">
        <p>Keep your password private. You are responsible for what happens on your account. Give accurate information about yourself, including your age, and use photos that show you.</p>
      </Section>
      <Section title="How to behave">
        <p>Follow the <Link href={qp("guidelines")} className="font-semibold underline">Community Guidelines</Link>. We can remove content and suspend or delete accounts that break them, with or without notice.</p>
      </Section>
      <Section title="Your safety">
        <ScreeningStatement />
        <p>We do not check who members are beyond reviewing photos. A verified badge only means a selfie matched the profile photo. You are responsible for your own safety when you talk to or meet anyone you find here. Read our <Link href={qp("safety")} className="font-semibold underline">safety advice</Link> before you meet.</p>
      </Section>
      <Section title="Meetups">
        <p>Members post and host meetups themselves. We do not organise, attend or supervise them. The host chooses who joins. Meet in public places.</p>
      </Section>
      <Section title="Sparks, Premium and gifts">
        <p>Sparks are a virtual currency for use on Qpids Place only. They have no cash value, cannot be exchanged for money and cannot be moved to another person or service. Premium is bought with sparks and lasts for the period shown when you unlock it. It does not renew by itself and you are never charged again automatically. Purchases of sparks are final except where the law requires a refund.</p>
        <p>Founding member and invite rewards are gifts from us. We may end or change an offer for people who have not yet claimed it, and we may take back rewards obtained through fake accounts or abuse.</p>
      </Section>
      <Section title="Cupid, the AI coach">
        <p>Cupid is an artificial intelligence, not a person, in chat and on the phone. Its suggestions can be wrong. It is not a counselor, therapist or lawyer and is not a substitute for professional advice. Paid coach sessions are charged in sparks at the price shown before you pay.</p>
      </Section>
      <Section title="Your content">
        <p>You own what you post. You give us permission to host it and show it to other members, and to show blog articles and public posts to visitors, so that the service works. Do not post anything you do not have the right to share. A person reviews the photos members add, and album photos are hidden until they are approved.</p>
      </Section>
      <Section title="Ending your account">
        <p>You can delete your account at any time from your profile page. Deletion is permanent and unused sparks and Premium time are lost. We may suspend or close an account that breaks these terms or the Community Guidelines.</p>
      </Section>
      <Section title="No warranty and limits on liability">
        <p>The service is provided as is. We do not promise that you will find a match or that members are who they say they are. To the extent the law allows, we are not liable for indirect or consequential losses, or for how other members behave on or off the service.</p>
      </Section>
      {OPERATOR.state && (
        <Section title="Governing law">
          <p>These terms are governed by the laws of the State of {OPERATOR.state}, without regard to its conflict of law rules. This does not take away any consumer protection you have under the law of the state where you live.</p>
        </Section>
      )}
      <Section title="Changes and contact">
        <p>We may update these terms and will change the date above when we do. If a change is significant we will tell members on the site. Questions: <Contact />.</p>
      </Section>
    </LegalDoc>
  );
}
