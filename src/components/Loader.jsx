import { useEffect, useRef, useState } from "react";

// ── Real loading steps shown to user ─────────────────────────────────────────
const STEPS = [
  { label: "Initialising environment",  weight: 8  },
  { label: "Loading assets",            weight: 18 },
  { label: "Compiling shaders",         weight: 16 },
  { label: "Hydrating components",      weight: 14 },
  { label: "Connecting services",       weight: 12 },
  { label: "Optimising renders",        weight: 14 },
  { label: "Preparing animations",      weight: 10 },
  { label: "Almost there",              weight: 8  },
];

export default function Loader({ onComplete }) {
  const [progress, setProgress]   = useState(0);
  const [stepIdx,  setStepIdx]    = useState(0);
  const [exiting,  setExiting]    = useState(false);
  const [dots,     setDots]       = useState("");
  const rafRef  = useRef(null);
  const progRef = useRef(0);           // real float progress
  const stepRef = useRef(0);

  // ── Dot animation ──────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() =>
      setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(id);
  }, []);

  // ── Real progress: tracks actual window load events ────────────────────────
  useEffect(() => {
    let settled = false;

    // Accumulate weight per step
    const TOTAL_WEIGHT = STEPS.reduce((s, x) => s + x.weight, 0);
    const thresholds   = [];
    let cum = 0;
    STEPS.forEach(s => {
      cum += s.weight;
      thresholds.push((cum / TOTAL_WEIGHT) * 100);
    });

    // Drive progress with two speeds:
    //   - fast crawl up to ~75% immediately
    //   - then waits for real window.load event to finish
    let target   = 0;
    let finished = false;

    const crawl = () => {
      if (settled) return;

      // Advance target naturally, slowing near 75 before window loads
      if (!finished) {
        const ceiling = 75;
        const speed   = target < 40 ? 0.55
                      : target < 60 ? 0.35
                      : target < 72 ? 0.18
                      : 0.04;
        target = Math.min(ceiling, target + speed);
      } else {
        // After window.load, race to 100
        target = Math.min(100, target + 1.1);
      }

      // Smooth interpolation
      progRef.current += (target - progRef.current) * 0.07;
      const rounded = Math.floor(progRef.current);
      setProgress(rounded);

      // Update step label
      const si = thresholds.findIndex(t => progRef.current < t);
      setStepIdx(si === -1 ? STEPS.length - 1 : si);

      if (progRef.current >= 99.5 && finished) {
        setProgress(100);
        settled = true;
        // Short pause at 100, then cinematic exit
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onComplete(), 900);
        }, 320);
        return;
      }

      rafRef.current = requestAnimationFrame(crawl);
    };

    rafRef.current = requestAnimationFrame(crawl);

    // Listen for actual page load completion
    const onLoad = () => { finished = true; };
    if (document.readyState === "complete") {
      finished = true;
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("load", onLoad);
    };
  }, [onComplete]);

  const stepLabel = STEPS[Math.min(stepIdx, STEPS.length - 1)]?.label ?? "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ld-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1),
                      transform 0.7s cubic-bezier(0.16,1,0.3,1);
        }

        .ld-root.exiting {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        /* ── Background grid ── */
        .ld-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(28,216,210,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,216,210,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          animation: ld-grid-fade 0.6s ease forwards;
        }
        @keyframes ld-grid-fade {
          from { opacity: 0; } to { opacity: 1; }
        }

        /* ── Ambient glows ── */
        .ld-glow-1 {
          position: absolute;
          width: 60vw; height: 60vw; border-radius: 50%;
          background: radial-gradient(circle, rgba(28,216,210,0.12), transparent 70%);
          filter: blur(80px); pointer-events: none;
          top: -20%; left: -10%;
          animation: ld-glow-drift 6s ease-in-out infinite alternate;
        }
        .ld-glow-2 {
          position: absolute;
          width: 50vw; height: 50vw; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,191,143,0.1), transparent 70%);
          filter: blur(100px); pointer-events: none;
          bottom: -20%; right: -10%;
          animation: ld-glow-drift 8s ease-in-out infinite alternate-reverse;
        }
        @keyframes ld-glow-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(3%,4%) scale(1.08); }
        }

        /* ── Corner brackets ── */
        .ld-corner {
          position: absolute;
          width: 32px; height: 32px;
          pointer-events: none;
          opacity: 0;
          animation: ld-corner-in 0.5s ease forwards;
        }
        .ld-corner.tl { top: 32px; left: 32px; animation-delay: 0.1s; }
        .ld-corner.tr { top: 32px; right: 32px; transform: scaleX(-1); animation-delay: 0.15s; }
        .ld-corner.bl { bottom: 32px; left: 32px; transform: scaleY(-1); animation-delay: 0.2s; }
        .ld-corner.br { bottom: 32px; right: 32px; transform: scale(-1); animation-delay: 0.25s; }
        @keyframes ld-corner-in {
          from { opacity:0; transform: scale(0.7) translateY(4px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .ld-corner.tr { transform-origin: right center; }

        .ld-corner svg { width: 100%; height: 100%; }

        /* ── Center content ── */
        .ld-center {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          gap: 0; width: min(480px, 88vw);
        }

        /* Logo */
        .ld-logo {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3.2rem, 8vw, 5.5rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.15);
          line-height: 1;
          margin-bottom: 48px;
          position: relative;
          user-select: none;
        }
        /* Fill sweeps left→right with progress */
        .ld-logo-fill {
          position: absolute; inset: 0;
          font-family: 'Syne', sans-serif;
          font-size: inherit;
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1;
          background: linear-gradient(135deg, #00bf8f, #1cd8d2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          clip-path: inset(0 var(--clip-right) 0 0);
          transition: clip-path 0.08s linear;
        }

        /* Big number */
        .ld-number {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4.5rem, 14vw, 9rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.06em;
          color: #fff;
          margin-bottom: 32px;
          position: relative;
          tabular-nums: true;
        }
        .ld-number-pct {
          font-size: 0.28em;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.05em;
          vertical-align: super;
          margin-left: 4px;
        }
        /* Teal glow on number near 100 */
        .ld-number.near-done {
          text-shadow: 0 0 40px rgba(28,216,210,0.4);
          transition: text-shadow 0.4s;
        }

        /* Progress track */
        .ld-track-wrap {
          width: 100%; margin-bottom: 22px; position: relative;
        }
        .ld-track {
          width: 100%; height: 2px;
          background: rgba(255,255,255,0.07);
          border-radius: 999px;
          overflow: visible;
          position: relative;
        }
        .ld-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #00bf8f, #1cd8d2);
          position: relative;
          transition: width 0.1s linear;
          box-shadow: 0 0 12px rgba(28,216,210,0.6);
        }
        /* Glowing head dot */
        .ld-fill::after {
          content: '';
          position: absolute;
          right: -3px; top: 50%;
          transform: translateY(-50%);
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #1cd8d2;
          box-shadow: 0 0 10px #1cd8d2, 0 0 20px rgba(28,216,210,0.5);
        }

        /* Segment ticks */
        .ld-ticks {
          position: absolute; top: 0; left: 0; right: 0;
          display: flex; justify-content: space-between; pointer-events: none;
        }
        .ld-tick {
          width: 1px; height: 6px; margin-top: -2px;
          background: rgba(255,255,255,0.1);
        }

        /* Step label */
        .ld-step {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%;
        }
        .ld-step-label {
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          transition: color 0.3s;
          min-width: 0;
          overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
        }
        .ld-step-label.active { color: rgba(28,216,210,0.7); }
        .ld-step-count {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.18);
          flex-shrink: 0; margin-left: 12px;
        }
        .ld-step-count span { color: #1cd8d2; }

        /* Bottom line */
        .ld-bottom {
          position: absolute; bottom: 28px; left: 0; right: 0;
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
        }
        .ld-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #1cd8d2;
          box-shadow: 0 0 6px #1cd8d2;
          animation: ld-dot-pulse 1.2s ease-in-out infinite;
        }
        @keyframes ld-dot-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }
        .ld-status-text {
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.18);
        }

        /* scan line sweep */
        .ld-scan {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(28,216,210,0.25), transparent);
          pointer-events: none;
          animation: ld-scan-move 3s linear infinite;
        }
        @keyframes ld-scan-move {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>

      <div className={`ld-root${exiting ? " exiting" : ""}`}>
        {/* Background */}
        <div className="ld-grid"/>
        <div className="ld-glow-1"/>
        <div className="ld-glow-2"/>
        <div className="ld-scan"/>

        {/* Corner brackets */}
        {["tl","tr","bl","br"].map(pos => (
          <div key={pos} className={`ld-corner ${pos}`}>
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M0 12 L0 0 L12 0" stroke="rgba(28,216,210,0.5)" strokeWidth="1.5"/>
            </svg>
          </div>
        ))}

        {/* Center */}
        <div className="ld-center">

          {/* Logo with progress-fill sweep */}
          <div className="ld-logo">
            Jay Kacha
            <span
              className="ld-logo-fill"
              style={{ "--clip-right": `${100 - progress}%` }}
            >
              Jay Kacha
            </span>
          </div>

          {/* Big number */}
          <div className={`ld-number${progress > 88 ? " near-done" : ""}`}>
            {String(progress).padStart(2, "0")}
            <span className="ld-number-pct">%</span>
          </div>

          {/* Track */}
          <div className="ld-track-wrap">
            <div className="ld-track">
              {/* Segment ticks at every 10% */}
              <div className="ld-ticks">
                {Array.from({length:11}).map((_,i) => (
                  <div key={i} className="ld-tick" style={{
                    background: i * 10 <= progress
                      ? "rgba(28,216,210,0.35)"
                      : "rgba(255,255,255,0.08)"
                  }}/>
                ))}
              </div>
              <div className="ld-fill" style={{ width: `${progress}%` }}/>
            </div>
          </div>

          {/* Step label */}
          <div className="ld-step">
            <span className={`ld-step-label${progress < 99 ? " active" : ""}`}>
              {progress >= 100 ? "Ready" : `${stepLabel}${dots}`}
            </span>
            <span className="ld-step-count">
              <span>{Math.min(stepIdx + 1, STEPS.length)}</span>
              /{STEPS.length}
            </span>
          </div>
        </div>

        {/* Bottom status */}
        <div className="ld-bottom">
          <span className="ld-status-dot"/>
          <span className="ld-status-text">
            {progress >= 100 ? "Launching" : "Loading portfolio"}
          </span>
        </div>
      </div>
    </>
  );
}