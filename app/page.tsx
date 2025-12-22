export default function Home() {
  return (
    <main className="min-h-screen bg-gate text-white flex items-center justify-center">
      <section className="text-center space-y-8 px-6">

        {/* Holographic Gateway */}
        <div className="gateway-container mx-auto">
          <div className="gateway-ring">
            <div className="gateway-core" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight glow-text">
          PoWERPiN
        </h1>

        {/* Subheading */}
        <p className="text-sm uppercase tracking-widest text-cyan-300">
          Gateway to Proof • Intent • Trust
        </p>

        {/* AI Guide Line (THIS IS THE LINE) */}
        <p className="text-base text-slate-300 max-w-md mx-auto">
          The system is live. Entry is intentional.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center pt-6">
          <button className="btn-primary">
            Enter Gateway
          </button>
          <button className="btn-secondary">
            Observe the System
          </button>
        </div>

      </section>
		{/* Guided Path */}
	<section className="guided-path">
	<div className="path-item">
		<h2>Proof</h2>
		<p>Signals verified. Reality anchored.</p>
	</div>

	<div className="path-item">
		<h2>Intent</h2>
		<p>Purpose measured before action.</p>
	</div>

	<div className="path-item">
		<h2>Trust</h2>
		<p>Access earned, not assumed.</p>
	</div>
	</section>
	{/* System Console */}
	<section className="system-console">
	<div className="console-header">
		<span className="console-dot green" />
		<span className="console-dot yellow" />
		<span className="console-dot red" />
		<span className="console-title">SYSTEM STATUS</span>
	</div>

	<div className="console-body">
		<div className="console-line">
		<span className="label">Proof Engine</span>
		<span className="value active">ACTIVE</span>
    </div>

    <div className="console-line">
      <span className="label">Intent Signal</span>
      <span className="value monitoring">MONITORING</span>
    </div>

    <div className="console-line">
      <span className="label">Trust Graph</span>
      <span className="value init">INITIALIZING</span>
    </div>

    <div className="console-line subtle">
      <span className="label">Last Verification</span>
      <span className="value">moments ago</span>
    </div>
	</div>

	<div className="console-actions">
	  <button
		className="btn-secondary"
		onClick={() =>
		document.getElementById("proof-logs")?.scrollIntoView({ behavior: "smooth" })
	  }
	>
	  View Proof Logs
	</button>

	 <Link href="/system" className="btn-secondary">
		System Architecture
	 </Link>
		</div>
	</section>
		{/* Proof Logs Reveal */}
	<section id="proof-logs" className="proof-logs">
		<h3>Proof Logs</h3>

		 <ul>
		  <li>✔ Signal integrity verified</li>
		  <li>✔ Intent classification completed</li>
		  <li>✔ Trust state propagated</li>
		  <li className="dim">↻ Continuous verification active</li>
		 </ul>
	</section>


    </main>
  );
}
