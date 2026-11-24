import SafetyNotice from "../SafetyNotice";

export const metadata = { title: "Staying safe · Qpids Place" };

export default function Safety() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Staying safe</h1>
      <p className="qp-muted">
        Most people here are who they say they are. A few are not, on any dating site. Please read this before you chat or meet.
      </p>
      <SafetyNotice full />
      <p className="qp-muted text-sm">
        Every profile has Report and Block. Use them. We read every report.
      </p>
    </div>
  );
}
