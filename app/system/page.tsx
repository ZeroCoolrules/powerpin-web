export default function SystemPage() {
  return (
    <main className="min-h-screen bg-gate text-white px-6 py-24">
      <section className="max-w-3xl mx-auto space-y-10">

        <h1 className="text-4xl glow-text">PoWERPiN System Architecture</h1>

        <p className="text-slate-300">
          PoWERPiN is a verification-first system designed to evaluate intent,
          establish proof, and propagate trust before access is granted.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-cyan-300">Proof Engine</h3>
            <p className="text-slate-400">
              Aggregates signals, validates consistency, and anchors events to
              verifiable states.
            </p>
          </div>

          <div>
            <h3 className="text-cyan-300">Intent Signal</h3>
            <p className="text-slate-400">
              Evaluates action context prior to execution, reducing ambiguity
              and malicious misuse.
            </p>
          </div>

          <div>
            <h3 className="text-cyan-300">Trust Graph</h3>
            <p className="text-slate-400">
              Maintains evolving trust relationships across entities without
              relying on static credentials.
            </p>
          </div>
        </div>

      </section>
    </main>
  );
}
