import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  FaReact, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt,
} from "react-icons/fa";
import {
  SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiTypescript,
  SiNextdotjs, SiFirebase, SiPostman,
} from "react-icons/si";

const categories = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend",
    sub: "What users see & feel",
    skills: [
      { icon: <SiJavascript />,  label: "JavaScript", color: "#F7DF1E" },
      { icon: <SiTypescript />,  label: "TypeScript", color: "#3178C6" },
      { icon: <FaReact />,       label: "React",      color: "#61DAFB" },
      { icon: <SiNextdotjs />,   label: "Next.js",    color: "#ffffff" },
      { icon: <SiTailwindcss />, label: "Tailwind",   color: "#38BDF8" },
      { icon: <FaHtml5 />,       label: "HTML5",      color: "#E34F26" },
      { icon: <FaCss3Alt />,     label: "CSS3",       color: "#1572B6" },
    ],
  },
  {
    id: "backend",
    index: "02",
    label: "Backend",
    sub: "Logic, data & APIs",
    skills: [
      { icon: <FaNodeJs />,   label: "Node.js",  color: "#68A063" },
      { icon: <SiExpress />,  label: "Express",  color: "#ffffff" },
      { icon: <SiMongodb />,  label: "MongoDB",  color: "#47A248" },
      { icon: <SiFirebase />, label: "Firebase", color: "#FFCA28" },
      { icon: <FaGitAlt />,   label: "Git",      color: "#F05032" },
      { icon: <SiPostman />,  label: "Postman",  color: "#FF6C37" },
    ],
  },
];

const LAYER_COLORS = [
  "#020e0e",
  "#041a1a",
  "#062828",
  "#093535",
  "#0c4242",
  "linear-gradient(135deg,#00bf8f,#1cd8d2)",
];

const CLIP_HIDDEN  = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_VISIBLE = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_GONE    = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

export default function Skills() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const layerEls = useRef([]);
  const titleRef = useRef(null);
  const subRef   = useRef(null);
  const indexRef = useRef(null);
  const gridRef  = useRef(null);
  const hintRef  = useRef(null);

  const active  = categories[activeIdx];
  const nextIdx = (activeIdx + 1) % categories.length;

  // ── KEY FIX: force all layers to hidden clip-path on first render ──────────
  useEffect(() => {
    gsap.set(layerEls.current, {
      clipPath: CLIP_HIDDEN,
      autoAlpha: 1,
    });
  }, []);

  const runWipe = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const layers = layerEls.current;
    const last   = layers[layers.length - 1];

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power3.inOut" },
      onComplete: () => setIsAnimating(false),
    });

    // 1 — layers wipe up from bottom, staggered
    tl.fromTo(
      layers,
      { clipPath: CLIP_HIDDEN },
      {
        clipPath: CLIP_VISIBLE,
        stagger: {
          each: 0.07,
          onComplete() {
            const el  = this.targets()[0];
            const idx = layers.indexOf(el);
            if (idx > 0) gsap.set(layers[idx - 1], { autoAlpha: 0 });
          },
        },
      },
      0
    )

    // 2 — content exits upward
    .to(
      [indexRef.current, titleRef.current, subRef.current, gridRef.current],
      { yPercent: -50, autoAlpha: 0, stagger: 0.03, duration: 0.45, ease: "power2.in" },
      0
    )

    // 3 — swap data
    .add(() => setActiveIdx(nextIdx), 0.42)

    // 4 — new content enters from below
    .fromTo(
      [indexRef.current, titleRef.current, subRef.current, gridRef.current],
      { yPercent: 40, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 0.65, ease: "expo.out" },
      0.5
    )

    // 5 — last layer peels off upward, then reset all layers
    .to(
      last,
      {
        clipPath: CLIP_GONE,
        duration: 0.65,
        ease: "power4.inOut",
        onComplete: () =>
          gsap.set(layers, { autoAlpha: 1, clipPath: CLIP_HIDDEN }),
      },
      "<+=0.05"
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #skills {
          font-family: 'DM Sans', sans-serif;
          background: #000;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .sk-wipe-layer {
          position: absolute;
          inset: 0;
          will-change: clip-path;
          pointer-events: none;
          z-index: 5;
        }

        .sk-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 48px 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
        }

        .sk-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 64px;
        }

        .sk-index {
          font-family: 'Syne', sans-serif;
          font-size: clamp(5rem, 12vw, 10rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.05em;
          color: rgba(255,255,255,0.06);
          pointer-events: none;
        }

        .sk-header-right { text-align: right; }

        .sk-tag {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: #1cd8d2; margin-bottom: 10px;
          display: flex; align-items: center; justify-content: flex-end; gap: 8px;
        }
        .sk-tag::after { content: ''; width: 28px; height: 1px; background: #1cd8d2; }

        .sk-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 7vw, 6.5rem);
          font-weight: 800; color: #fff;
          line-height: 1; letter-spacing: -0.04em; margin: 0;
        }

        .sk-sub {
          font-size: 0.88rem; font-weight: 400; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.3); margin-top: 10px; text-transform: uppercase;
        }

        .sk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          flex: 1;
        }

        @media (max-width: 640px) {
          .sk-grid { grid-template-columns: repeat(2, 1fr); }
          .sk-inner { padding: 80px 24px 60px; }
          .sk-top { flex-direction: column; align-items: flex-start; gap: 20px; }
          .sk-header-right { text-align: left; }
          .sk-tag { justify-content: flex-start; }
          .sk-tag::after { display: none; }
          .sk-tag::before { content: ''; width: 28px; height: 1px; background: #1cd8d2; }
        }

        .sk-card {
          position: relative; overflow: hidden; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03); backdrop-filter: blur(4px);
          padding: 28px 20px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          aspect-ratio: 1;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .sk-card:hover {
          border-color: rgba(28,216,210,0.3); transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 30px rgba(28,216,210,0.08);
        }
        .sk-card::before {
          content: ''; position: absolute; top: 12px; right: 12px;
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(28,216,210,0.3); transition: background 0.3s;
        }
        .sk-card:hover::before { background: #1cd8d2; }

        .sk-card-icon { font-size: 2.4rem; line-height: 1; transition: transform 0.3s ease; }
        .sk-card:hover .sk-card-icon { transform: scale(1.15) rotate(-5deg); }

        .sk-card-label {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.5); transition: color 0.3s;
        }
        .sk-card:hover .sk-card-label { color: rgba(255,255,255,0.9); }

        .sk-bottom {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 60px; padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Hint pill — always visible, pulses to draw attention ── */
        .sk-hint {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px 12px 12px;
          border-radius: 999px;
          border: 1px solid rgba(28,216,210,0.28);
          background: rgba(28,216,210,0.06);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s;
          animation: sk-hint-breathe 2.8s ease-in-out infinite;
        }

        @keyframes sk-hint-breathe {
          0%, 100% { box-shadow: 0 0 0 0 rgba(28,216,210,0); }
          50%       { box-shadow: 0 0 18px 2px rgba(28,216,210,0.14); }
        }

        #skills:hover .sk-hint,
        .sk-hint:hover {
          background: rgba(28,216,210,0.12);
          border-color: rgba(28,216,210,0.55);
          color: #fff;
          box-shadow: 0 0 24px rgba(28,216,210,0.18);
          animation: none;
        }

        .sk-hint-ring {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(28,216,210,0.12);
          border: 1px solid rgba(28,216,210,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          color: #1cd8d2;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
          flex-shrink: 0;
        }

        .sk-hint:hover .sk-hint-ring {
          transform: rotate(180deg);
        }

        .sk-counter {
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.3);
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
        }
        .sk-counter span {
          color: #1cd8d2;
          font-size: 1rem;
        }

        .sk-glow {
          position: absolute; width: 50vw; height: 50vw; border-radius: 50%;
          filter: blur(120px); opacity: 0.07; pointer-events: none; z-index: 1;
          bottom: -10%; left: -10%;
          background: radial-gradient(circle, #1cd8d2, #00bf8f); transition: opacity 0.6s;
        }
        #skills:hover .sk-glow { opacity: 0.12; }

        .sk-topline {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(28,216,210,0.2), transparent);
          z-index: 20;
        }
      `}</style>

      <section id="skills" onClick={runWipe}>
        <div className="sk-glow" />
        <div className="sk-topline" />

        {LAYER_COLORS.map((bg, i) => (
          <div
            key={i}
            ref={(el) => (layerEls.current[i] = el)}
            className="sk-wipe-layer"
            style={{ background: bg }}
          />
        ))}

        <div className="sk-inner">
          <div className="sk-top">
            <div ref={indexRef} className="sk-index">{active.index}</div>
            <div className="sk-header-right">
              <p className="sk-tag">Tech Stack</p>
              <h2 ref={titleRef} className="sk-title">{active.label}</h2>
              <p ref={subRef} className="sk-sub">{active.sub}</p>
            </div>
          </div>

          <div ref={gridRef} className="sk-grid">
            {active.skills.map((s) => (
              <div key={s.label} className="sk-card">
                <span className="sk-card-icon" style={{ color: s.color }}>{s.icon}</span>
                <span className="sk-card-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="sk-bottom">
            <div ref={hintRef} className="sk-hint">
              <span className="sk-hint-ring">↻</span>
              Click to switch stack
            </div>
            <div className="sk-counter">
              <span>{active.index}</span> / {String(categories.length).padStart(2, "0")}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}