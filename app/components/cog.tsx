"use client";

export default function Cog() {
  return (
    <div className="cog-root">
      <div className="cog">

        {/* Teeth */}
        <div className="tooth t1" title="Where stability and values are formed.">
          <span>Family · Health · Faith</span>
        </div>

        <div className="tooth t2" title="Time invested becomes future access.">
          <span>Education · Growth</span>
        </div>

        <div className="tooth t3" title="Creative output stabilizes the system.">
          <span>Arts · Music · Expression</span>
        </div>

        <div className="tooth t4" title="A healthy body slows trust decay.">
          <span>Sports · Physical</span>
        </div>

        <div className="tooth t5" title="The foundation of daily life.">
          <span>Home (Internal)</span>
        </div>

        <div className="tooth t6" title="Time spent caring multiplies trust.">
          <span>Home (Care)</span>
        </div>

        <div className="tooth t7" title="Local actions build reputation.">
          <span>Neighborhood</span>
        </div>

        <div className="tooth t8" title="Economic participation.">
          <span>City · Work</span>
        </div>

        <div className="tooth t9" title="Necessary transactions only.">
          <span>Commerce · Food</span>
        </div>

        <div className="tooth t10" title="Shared moments strengthen bonds.">
          <span>Events · Experiences</span>
        </div>

        <div className="tooth t11" title="Human connection creates vectors.">
          <span>Dating · Social</span>
        </div>

        <div className="tooth t12 ghost" title="Energy that feeds the system.">
          <span>Ghost Pool ♾️</span>
        </div>

        {/* Hub */}
        <div className="hub">
          <span>
            TRUST
            <br />×<br />
            TIME
          </span>
        </div>
      </div>

      {/* Local (non-geometry) styles only */}
      <style jsx>{`
        .cog-root {
          display: grid;
          place-items: center;
          min-height: calc(100vh - 56px);
          width: 100%;
          background: black;
        }

        .cog {
          position: relative;
          width: 420px;
          height: 420px;
          border-radius: 50%;
        }

        .hub {
          position: absolute;
          inset: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, #1a1a1a, #000);
          border: 2px solid #444;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 600;
          letter-spacing: 1px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .hub span {
          font-size: 14px;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
