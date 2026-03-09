type HealthRecord = {
  id: number;
  record_type: string;
  provider_name?: string | null;
  note?: string | null;
  document_url?: string | null;
  issued_at?: string | null;
};

export default function HealthRecordList({
  records,
}: {
  records: HealthRecord[];
}) {
  if (!records.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-500">
        No health records available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
        >
          <h3 className="text-lg font-semibold text-green-400 capitalize">
            {record.record_type}
          </h3>

          <p className="mt-2 text-zinc-300">
            {record.provider_name || "Unknown provider"}
          </p>

          {record.issued_at ? (
            <p className="mt-1 text-sm text-zinc-500">
              Issued: {new Date(record.issued_at).toLocaleDateString()}
            </p>
          ) : null}

          <p className="mt-3 text-sm text-zinc-300">
            {record.note || "No notes added."}
          </p>

          {record.document_url ? (
            <a
              href={record.document_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500/10 transition"
            >
              View Document
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}