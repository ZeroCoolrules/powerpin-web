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

    </main>
  );
}
