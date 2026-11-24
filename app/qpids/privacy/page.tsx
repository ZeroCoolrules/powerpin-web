import Link from "next/link";
import LegalDoc, { Contact, Section, WhoWeAre } from "../legal/LegalDoc";
import { qp } from "../lib/paths";

export const metadata = { title: "Privacy Policy · Qpids Place" };

export default function Privacy() {
  return (
    <LegalDoc title="Privacy Policy">
      <WhoWeAre />
      <Section title="What we collect">
        <ul>
          <li><b>Account details:</b> username, a scrambled (hashed) password, your age, and the date you agreed to our terms.</li>
          <li><b>Your profile:</b> first name, gender, who you are looking for, city, bio, interests, prompts, answers to profile questions and to the compatibility quiz (with how much each one matters to you), and your photos with their captions.</li>
          <li><b>What you do here:</b> likes, passes, winks, matches, messages, posts and comments, meetups you post (including the private exact place) or ask to join and any note you send the host, gifts, reports and blocks, invites, the state page you joined through, and when you were last active.</li>
          <li><b>Verification selfies,</b> only if you choose to verify. A person compares the selfie with your profile photo. We do not use face recognition software.</li>
          <li><b>Purchases:</b> Stripe handles payments. We receive a record of what you bought. We never see or store your card number.</li>
          <li><b>Coach calls:</b> if you buy a phone session with Cupid, our voice provider handles the call audio so the AI can answer you.</li>
          <li><b>Technical data:</b> your IP address, used briefly to limit abuse, and a sign-in token kept in your browser. We do not use advertising cookies or trackers.</li>
        </ul>
        <p>If your account came over from one of our earlier dating sites, we hold the profile and email address you gave that site.</p>
      </Section>
      <Section title="How we use it">
        <p>To run Qpids Place: show your profile to other members, suggest people you may fit with, deliver messages, run meetups, keep the community safe, review photos and reports, and process purchases. We do not sell your personal information, and we do not share it for advertising.</p>
      </Section>
      <Section title="What other members see">
        <p>Other signed-in members can see your profile, approved photos, and what you post. The meetup board shows a general area only. The exact place of a meetup is shown only to the host and the people the host accepts. Your username is visible; your password, email address and purchases are not.</p>
      </Section>
      <Section title="Who else handles it">
        <ul>
          <li>Our hosting providers, which store the database and photos and serve the site.</li>
          <li>Stream, for chat and video.</li>
          <li>Stripe, for payments.</li>
          <li>An AI provider, for messages you send to Cupid and for the voice on coach calls.</li>
        </ul>
        <p>They may use your information only to provide their service to us. We may also disclose information when the law requires it, or to protect someone from harm.</p>
      </Section>
      <Section title="Sensitive information">
        <p>What you share about your gender, orientation and dating life is sensitive. Share only what you are comfortable with other members seeing.</p>
        <p>The compatibility quiz is optional. Some of its questions touch on faith, politics, children, money and intimacy. We use your answers only to work out how well you fit with other members. Other members never see your answers. They see a fit percentage and the topics where the two of you line up or differ, which can hint at how you answered. You can change your answers at any time, and they are deleted with your account.</p>
      </Section>
      <Section title="How long we keep it">
        <p>We keep your information while you have an account. When you delete your account we remove your profile, photos, matches and messages from our database. Verification selfies are deleted after review. Copies may remain in backups for a short time, and we keep payment records as long as tax and accounting rules require.</p>
      </Section>
      <Section title="Your choices and rights">
        <p>You can edit your profile at any time, block people, and delete your account from your profile page. You can ask us for a copy of your information, or ask us to correct or delete it, by writing to <Contact />. We answer within 45 days. We will not treat you differently for making a request. Depending on where you live, you may have further rights under your state’s privacy law, and you can use the same contact to exercise them.</p>
      </Section>
      <Section title="Security">
        <p>Passwords are stored hashed, the site is served over an encrypted connection, and access to member data is limited to the people who run the service. No system is perfectly secure, so please use a password you do not use anywhere else.</p>
      </Section>
      <Section title="Adults only">
        <p>Qpids Place is for people 18 and older. We do not knowingly collect information from anyone under 18, and we delete such accounts when we find them. Please report anyone who seems under 18.</p>
      </Section>
      <Section title="Changes and contact">
        <p>We will change the date above when this policy changes, and tell members on the site if a change is significant. For privacy questions or requests: <Contact />. See also our <Link href={qp("terms")} className="font-semibold underline">Terms</Link>.</p>
      </Section>
    </LegalDoc>
  );
}
