import Link from "next/link";
import { qp } from "../lib/paths";
import { LEGAL_UPDATED, OPERATOR } from "../lib/legal";

export function Contact() {
  return OPERATOR.email ? (
    <a href={`mailto:${OPERATOR.email}`} className="font-semibold underline">{OPERATOR.email}</a>
  ) : (
    <span>the Report button on any profile</span>
  );
}

// Who "we" are, in one sentence, for the top of each page.
export function WhoWeAre() {
  return (
    <p>
      Qpids Place{OPERATOR.name ? ` is run by ${OPERATOR.name}` : " is the service at this site"}
      {OPERATOR.address ? `, ${OPERATOR.address}` : ""}. In these pages “we” and “us” mean {OPERATOR.name || "Qpids Place"}.
    </p>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function LegalDoc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="qp-muted text-sm">Last updated {LEGAL_UPDATED}</p>
      </div>
      <div className="qp-card space-y-6 p-6 sm:p-8 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
      <p className="qp-muted text-sm">
        <Link href={qp("terms")} className="underline">Terms</Link> ·{" "}
        <Link href={qp("privacy")} className="underline">Privacy</Link> ·{" "}
        <Link href={qp("guidelines")} className="underline">Community Guidelines</Link> ·{" "}
        <Link href={qp("safety")} className="underline">Safety</Link>
      </p>
    </div>
  );
}
