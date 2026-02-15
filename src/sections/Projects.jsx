import { useRef, useState } from "react";
import { gsap } from "gsap";

// ── SVG mock-UI images ────────────────────────────────────────────────────────

const DevConnectImg = () => (
  <svg
    viewBox="0 0 520 320"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", display: "block" }}
  >
    <rect width="520" height="320" fill="#060f0f" />
    <rect x="0" y="0" width="72" height="320" fill="#091818" />
    <circle cx="36" cy="32" r="14" fill="#1cd8d2" opacity="0.9" />
    <text
      x="36"
      y="37"
      textAnchor="middle"
      fill="#000"
      fontSize="11"
      fontWeight="800"
      fontFamily="monospace"
    >
      J
    </text>
    {[72, 112, 152, 192, 232].map((y, i) => (
      <rect
        key={i}
        x="16"
        y={y}
        width="40"
        height="8"
        rx="4"
        fill={i === 0 ? "#1cd8d2" : "#1a3535"}
        opacity={i === 0 ? 0.9 : 0.5}
      />
    ))}
    <rect x="72" y="0" width="448" height="44" fill="#091a1a" />
    <text
      x="96"
      y="26"
      fill="#1cd8d2"
      fontSize="10"
      fontFamily="monospace"
      opacity="0.9"
    >
      DevConnect
    </text>
    <circle cx="472" cy="22" r="6" fill="#1cd8d2" opacity="0.6" />
    <rect x="72" y="44" width="148" height="276" fill="#071515" />
    <text
      x="88"
      y="68"
      fill="#1cd8d2"
      fontSize="9"
      fontFamily="monospace"
      opacity="0.6"
    >
      ONLINE — 3
    </text>
    {[
      ["Alex", "A", "#1cd8d2"],
      ["Sam", "S", "#00bf8f"],
      ["Mia", "M", "#38BDF8"],
    ].map(([name, l, c], i) => (
      <g key={i} transform={`translate(0,${i * 52})`}>
        <rect
          x="80"
          y="80"
          width="124"
          height="38"
          rx="8"
          fill={i === 0 ? "#0d2828" : "transparent"}
          opacity="0.7"
        />
        <circle cx="100" cy="99" r="12" fill={c} opacity="0.2" />
        <text
          x="100"
          y="103"
          textAnchor="middle"
          fill={c}
          fontSize="9"
          fontWeight="700"
          fontFamily="monospace"
        >
          {l}
        </text>
        <rect
          x="118"
          y="92"
          width="60"
          height="7"
          rx="3"
          fill="#1a3535"
          opacity="0.8"
        />
        <rect
          x="118"
          y="104"
          width="40"
          height="5"
          rx="2"
          fill="#1a3535"
          opacity="0.5"
        />
        <circle
          cx="204"
          cy="99"
          r="4"
          fill={i === 0 ? "#1cd8d2" : "#1a3535"}
          opacity="0.8"
        />
      </g>
    ))}
    <rect x="220" y="44" width="300" height="180" fill="#060e0e" />
    <rect x="220" y="44" width="300" height="24" fill="#091a1a" />
    {["main.js", "utils.js", "api.js"].map((f, i) => (
      <g key={i}>
        <rect
          x={232 + i * 72}
          y="52"
          width="64"
          height="14"
          rx="3"
          fill={i === 0 ? "#0d2828" : "transparent"}
        />
        <text
          x={264 + i * 72}
          y="63"
          textAnchor="middle"
          fill={i === 0 ? "#1cd8d2" : "#2a4a4a"}
          fontSize="8"
          fontFamily="monospace"
        >
          {f}
        </text>
      </g>
    ))}
    {[
      ["#1cd8d2", "const ", "#fff", "socket = io(url)"],
      ["#0d2020", "", "#00bf8f", "socket.on('msg', cb)"],
      ["#0d2020", "", "#38BDF8", "const room = await"],
      ["#0d2020", "", "#1cd8d2", "  joinRoom(id)"],
      ["#0d2020", "", "#a8e6cf", "socket.emit('join')"],
    ].map(([bg, a, c, t], i) => (
      <g key={i}>
        <rect
          x="220"
          y={68 + i * 18}
          width="300"
          height="18"
          fill={bg}
          opacity={i === 0 ? 0.35 : 0.2}
        />
        <text
          x="256"
          y={81 + i * 18}
          fill={c}
          fontSize="9"
          fontFamily="monospace"
        >
          {t}
        </text>
      </g>
    ))}
    <rect x="220" y="224" width="300" height="96" fill="#071515" />
    <rect x="220" y="224" width="300" height="18" fill="#091a1a" />
    <text
      x="232"
      y="237"
      fill="#1cd8d2"
      fontSize="8"
      fontFamily="monospace"
      opacity="0.6"
    >
      LIVE CHAT
    </text>
    {[
      ["Alex", "Let's start code review", "#1cd8d2", true],
      ["Sam", "Ready! I pushed the fix", "#00bf8f", false],
    ].map(([u, m, c, r], i) => (
      <g key={i}>
        <rect
          x={r ? 234 : 300}
          y={246 + i * 28}
          width="180"
          height="18"
          rx="6"
          fill={r ? "#0d2828" : "#091a1a"}
          opacity="0.9"
        />
        <text
          x={r ? 244 : 310}
          y={259 + i * 28}
          fill={c}
          fontSize="8"
          fontFamily="monospace"
        >
          {u}: {m}
        </text>
      </g>
    ))}
  </svg>
);

const ShopFlowImg = () => (
  <svg
    viewBox="0 0 520 320"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", display: "block" }}
  >
    <rect width="520" height="320" fill="#060f09" />
    <rect width="520" height="48" fill="#091a10" />
    <text
      x="24"
      y="30"
      fill="#00bf8f"
      fontSize="14"
      fontWeight="800"
      fontFamily="monospace"
    >
      ShopFlow
    </text>
    {["Home", "Products", "Orders", "Analytics"].map((t, i) => (
      <text
        key={i}
        x={160 + i * 72}
        y="30"
        fill={i === 0 ? "#00bf8f" : "#1a4028"}
        fontSize="9"
        fontFamily="monospace"
        opacity={i === 0 ? 1 : 0.7}
      >
        {t}
      </text>
    ))}
    <rect
      x="448"
      y="12"
      width="52"
      height="24"
      rx="12"
      fill="#00bf8f"
      opacity="0.9"
    />
    <text
      x="474"
      y="28"
      textAnchor="middle"
      fill="#000"
      fontSize="9"
      fontWeight="700"
      fontFamily="monospace"
    >
      Cart 3
    </text>
    {[
      ["$12,480", "Revenue", "#00bf8f"],
      ["284", "Orders", "#1cd8d2"],
      ["4.8★", "Rating", "#38BDF8"],
      ["98%", "Uptime", "#a8e6cf"],
    ].map(([v, l, c], i) => (
      <g key={i}>
        <rect
          x={16 + i * 124}
          y="60"
          width="112"
          height="56"
          rx="10"
          fill="#091a10"
          stroke="#0d2a18"
          strokeWidth="1"
        />
        <text
          x={72 + i * 124}
          y="84"
          textAnchor="middle"
          fill={c}
          fontSize="14"
          fontWeight="800"
          fontFamily="monospace"
        >
          {v}
        </text>
        <text
          x={72 + i * 124}
          y="100"
          textAnchor="middle"
          fill="#1a4028"
          fontSize="8"
          fontFamily="monospace"
        >
          {l}
        </text>
      </g>
    ))}
    <text
      x="16"
      y="136"
      fill="#00bf8f"
      fontSize="9"
      fontFamily="monospace"
      opacity="0.6"
    >
      FEATURED PRODUCTS
    </text>
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect
          x={16 + i * 124}
          y="144"
          width="112"
          height="128"
          rx="10"
          fill="#091a10"
          stroke="#0d2a18"
          strokeWidth="1"
        />
        <rect
          x={24 + i * 124}
          y="152"
          width="96"
          height="64"
          rx="6"
          fill="#0d2a18"
        />
        <circle
          cx={72 + i * 124}
          cy="184"
          r="20"
          fill="#00bf8f"
          opacity="0.1"
        />
        <rect
          x={48 + i * 124}
          y="174"
          width="48"
          height="6"
          rx="3"
          fill="#00bf8f"
          opacity="0.3"
        />
        <rect
          x={56 + i * 124}
          y="184"
          width="32"
          height="6"
          rx="3"
          fill="#00bf8f"
          opacity="0.2"
        />
        <rect
          x={24 + i * 124}
          y="224"
          width="64"
          height="7"
          rx="3"
          fill="#1a4028"
          opacity="0.8"
        />
        <text
          x={24 + i * 124}
          y="246"
          fill="#00bf8f"
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
        >
          ${29 + i * 15}
        </text>
        <rect
          x={96 + i * 124}
          y="236"
          width="24"
          height="16"
          rx="8"
          fill="#00bf8f"
          opacity="0.8"
        />
        <text
          x={108 + i * 124}
          y="248"
          textAnchor="middle"
          fill="#000"
          fontSize="10"
          fontFamily="monospace"
        >
          +
        </text>
      </g>
    ))}
    <rect
      x="16"
      y="278"
      width="488"
      height="34"
      rx="8"
      fill="#091a10"
      stroke="#0d2a18"
      strokeWidth="1"
    />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((p, i) => {
      const h = [12, 18, 14, 22, 16, 28, 20, 24, 18, 30, 22, 26][i];
      return (
        <rect
          key={i}
          x={24 + i * 38}
          y={306 - h}
          width="28"
          height={h}
          rx="3"
          fill="#00bf8f"
          opacity={i === 11 ? 0.9 : 0.35}
        />
      );
    })}
  </svg>
);

const TaskBoardImg = () => (
  <svg
    viewBox="0 0 520 320"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", display: "block" }}
  >
    <rect width="520" height="320" fill="#06090f" />
    <rect width="520" height="48" fill="#090f1a" />
    <text
      x="24"
      y="30"
      fill="#38BDF8"
      fontSize="14"
      fontWeight="800"
      fontFamily="monospace"
    >
      TaskBoard
    </text>
    <rect
      x="380"
      y="12"
      width="64"
      height="24"
      rx="12"
      fill="#38BDF8"
      opacity="0.15"
      stroke="#38BDF8"
      strokeWidth="1"
      strokeOpacity="0.3"
    />
    <text
      x="412"
      y="28"
      textAnchor="middle"
      fill="#38BDF8"
      fontSize="8"
      fontFamily="monospace"
    >
      + New Task
    </text>
    <rect
      x="452"
      y="12"
      width="52"
      height="24"
      rx="12"
      fill="#38BDF8"
      opacity="0.9"
    />
    <text
      x="478"
      y="28"
      textAnchor="middle"
      fill="#000"
      fontSize="9"
      fontWeight="700"
      fontFamily="monospace"
    >
      Sprint 4
    </text>
    {[
      [
        "TO DO",
        "#1a2a3a",
        ["Build auth", "Add dark mode", "Write tests"],
        ["#38BDF8", "#1a3a5a", "#1a3a5a"],
      ],
      [
        "IN PROGRESS",
        "#1a2a1a",
        ["API integration", "Dashboard UI"],
        ["#00bf8f", "#00bf8f"],
      ],
      [
        "REVIEW",
        "#2a2a1a",
        ["Landing page", "Payment flow"],
        ["#F59E0B", "#F59E0B"],
      ],
      [
        "DONE",
        "#1a1a2a",
        ["User auth", "DB schema", "Routing"],
        ["#38BDF8", "#38BDF8", "#38BDF8"],
      ],
    ].map(([col, colBg, tasks, colors], ci) => (
      <g key={ci}>
        <rect
          x={14 + ci * 124}
          y="54"
          width="118"
          height="260"
          rx="10"
          fill={colBg}
          opacity="0.4"
        />
        <rect
          x={14 + ci * 124}
          y="54"
          width="118"
          height="28"
          rx="10"
          fill={colBg}
          opacity="0.6"
        />
        <text
          x={73 + ci * 124}
          y="73"
          textAnchor="middle"
          fill={colors[0]}
          fontSize="8"
          fontWeight="700"
          fontFamily="monospace"
          opacity="0.9"
        >
          {col}
        </text>
        {tasks.map((task, ti) => (
          <g key={ti}>
            <rect
              x={20 + ci * 124}
              y={90 + ti * 56}
              width="106"
              height="46"
              rx="8"
              fill="#0a0f1a"
              stroke={colors[ti] || "#1a2a3a"}
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <rect
              x={28 + ci * 124}
              y={97 + ti * 56}
              width="50"
              height="5"
              rx="2"
              fill={colors[ti]}
              opacity="0.3"
            />
            <rect
              x={28 + ci * 124}
              y={106 + ti * 56}
              width="80"
              height="6"
              rx="3"
              fill="#1a2a3a"
              opacity="0.7"
            />
            <rect
              x={28 + ci * 124}
              y={116 + ti * 56}
              width="55"
              height="5"
              rx="2"
              fill="#1a2a3a"
              opacity="0.5"
            />
          </g>
        ))}
      </g>
    ))}
    <rect x="0" y="292" width="520" height="28" fill="#090f1a" />
    {["3 tasks due today", "Sprint ends Friday", "Team: 4 members"].map(
      (t, i) => (
        <text
          key={i}
          x={20 + i * 170}
          y="310"
          fill="#1a3a5a"
          fontSize="8"
          fontFamily="monospace"
          opacity="0.7"
        >
          • {t}
        </text>
      ),
    )}
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    num: "01",
    title: "DevConnect",
    tag: "Full Stack",
    year: "2024",
    desc: "Real-time developer collaboration with live code sharing, rooms, and GitHub OAuth.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    accentColor: "#1cd8d2",
    link: "#",
    github: "#",
    Image: DevConnectImg,
  },
  {
    id: 2,
    num: "02",
    title: "ShopFlow",
    tag: "E-Commerce",
    year: "2024",
    desc: "Modern e-commerce storefront with Stripe payments and a full admin analytics dashboard.",
    tech: ["Next.js", "Tailwind", "Stripe", "MongoDB"],
    accentColor: "#00bf8f",
    link: "#",
    github: "#",
    Image: ShopFlowImg,
  },
  {
    id: 3,
    num: "03",
    title: "TaskBoard",
    tag: "Productivity",
    year: "2023",
    desc: "Kanban task management with drag & drop, labels, deadlines, and real-time team collaboration.",
    tech: ["React", "Express", "MongoDB", "DnD Kit"],
    accentColor: "#38BDF8",
    link: "#",
    github: "#",
    Image: TaskBoardImg,
  },
];

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);
const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C8.552 9.773 7.76 9.404 7.76 9.404c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function Projects() {
  const [hovered, setHovered] = useState(null);
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const miniRefs = useRef([]);
  const expRefs = useRef([]);
  const tlRef = useRef(null);
  const debounceRef = useRef(null);
  const activeRef = useRef(null); // track which idx is active

  const D = 0.3; // base duration

  const animateIn = (idx) => {
    if (activeRef.current === idx) return;
    activeRef.current = idx;
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: D },
    });
    tlRef.current = tl;

    PROJECTS.forEach((_, i) => {
      const card = cardRefs.current[i];
      const mini = miniRefs.current[i];
      const exp = expRefs.current[i];

      if (i === idx) {
        tl.to(
          card,
          {
            flexGrow: 3.5,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: D,
          },
          0,
        )
          .to(mini, { opacity: 0, y: -10, duration: D * 0.6 }, 0)
          .fromTo(
            exp,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: D, ease: "power3.out" },
            D * 0.35,
          );
      } else {
        tl.to(
          card,
          {
            flexGrow: 0.65,
            opacity: 0.35,
            scale: 1,
            filter: "blur(3px)",
            duration: D,
          },
          0,
        )
          .to(mini, { opacity: 0, duration: D * 0.5 }, 0)
          .to(exp, { opacity: 0, duration: D * 0.3 }, 0);
      }
    });
  };

  const animateOut = () => {
    if (activeRef.current === null) return;
    activeRef.current = null;
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: D },
    });
    tlRef.current = tl;

    PROJECTS.forEach((_, i) => {
      const card = cardRefs.current[i];
      const mini = miniRefs.current[i];
      const exp = expRefs.current[i];
      tl.to(
        card,
        { flexGrow: 1, opacity: 1, scale: 1, filter: "blur(0px)", duration: D },
        0,
      )
        .to(exp, { opacity: 0, duration: D * 0.4 }, 0)
        .to(mini, { opacity: 1, y: 0, duration: D * 0.7, delay: D * 0.25 }, 0);
    });
  };

  const handleEnter = (idx) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setHovered(idx);
      animateIn(idx);
    }, 55);
  };

  const handleLeave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setHovered(null);
    animateOut();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #projects {
          font-family: 'DM Sans', sans-serif;
          background: #000;
          width: 100%;
          min-height: 100vh;
          padding: 100px 48px;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 640px) { #projects { padding: 80px 20px; } }

        .pj-inner { max-width: 1200px; margin: 0 auto; }

        .pj-tag {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: #1cd8d2;
          display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
        }
        .pj-tag::before { content:''; width:28px; height:1px; background:#1cd8d2; }

        .pj-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 800; color: #fff;
          letter-spacing: -0.04em; line-height: 1; margin-bottom: 52px;
        }
        .pj-heading span {
          background: linear-gradient(135deg,#00bf8f,#1cd8d2);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── Row — NO CSS transitions, GSAP owns everything ── */
        .pj-row {
          display: flex;
          gap: 12px;
          height: 520px;
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .pj-row { flex-direction: column; height: auto; }
          .pj-card { min-height: 240px !important; }
        }

        /* ── Card — NO CSS transition on flex/transform ── */
        .pj-card {
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: 0;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          /* ONLY border-color transition in CSS — everything else via GSAP */
          transition: border-color 0.3s;
          will-change: flex-grow, opacity, filter;
        }
        .pj-card:hover { border-color: rgba(28,216,210,0.22); }

        /* image — always visible, fades on non-hovered cards via parent opacity */
        .pj-img {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          border-radius: 20px;
        }
        .pj-img svg { width: 100%; height: 100%; display: block; }

        /* gradient overlay so text is readable on top of image */
        .pj-scrim {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.45) 0%,
            rgba(0,0,0,0.15) 40%,
            rgba(0,0,0,0.75) 70%,
            rgba(0,0,0,0.96) 100%
          );
        }

        /* accent top line */
        .pj-accent {
          position: absolute; top:0; left:0; right:0; height:2px;
          z-index: 4; opacity: 0; transition: opacity 0.25s;
        }
        .pj-card:hover .pj-accent { opacity: 1; }

        /* ghost number */
        .pj-bignum {
          position: absolute; bottom:-8px; right:10px;
          font-family: 'Syne', sans-serif; font-size: 8rem; font-weight: 800;
          line-height: 1; color: rgba(255,255,255,0.055);
          pointer-events: none; z-index: 3;
          letter-spacing: -0.06em; user-select: none;
        }

        /* ── Mini idle label ── */
        .pj-mini {
          position: absolute; bottom:0; left:0; right:0;
          z-index: 5; padding: 22px 20px;
        }
        .pj-mini-num {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.22em; color: rgba(255,255,255,0.3); margin-bottom: 5px;
        }
        .pj-mini-title {
          font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800;
          color: #fff; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 7px;
        }
        .pj-mini-tag {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.5); display: inline-block;
        }

        /* ── Expanded content (hover) ── */
        .pj-exp {
          position: absolute; inset: 0; z-index: 6;
          padding: 24px 26px;
          display: flex; flex-direction: column; justify-content: space-between;
          opacity: 0; pointer-events: none;
        }
        .pj-card.is-hovered .pj-exp { pointer-events: all; }

        .pj-exp-top {
          display: flex; align-items: center; justify-content: space-between;
        }
        .pj-exp-tag {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.13); background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.55);
        }
        .pj-exp-year {
          font-family: 'Syne', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.18em; color: rgba(255,255,255,0.2);
        }

        .pj-exp-body { display: flex; flex-direction: column; gap: 11px; }

        .pj-exp-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.5rem, 2.1vw, 2.4rem);
          font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1;
        }
        .pj-exp-desc {
          font-size: 0.82rem; color: rgba(255,255,255,0.48); line-height: 1.65; max-width: 300px;
        }
        .pj-exp-techs { display: flex; flex-wrap: wrap; gap: 5px; }
        .pj-exp-tech {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
        }
        .pj-exp-links { display: flex; gap: 8px; }
        .pj-exp-btn {
          display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px;
          border-radius: 999px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.18s ease; border: 1px solid transparent;
        }
        .pj-exp-btn.primary { background: #fff; color: #000; }
        .pj-exp-btn.primary:hover { background: rgba(255,255,255,0.88); }
        .pj-exp-btn.ghost {
          background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.13); color: rgba(255,255,255,0.65);
        }
        .pj-exp-btn.ghost:hover { background: rgba(255,255,255,0.12); color: #fff; }

        /* ambient */
        .pj-glow {
          position: absolute; width:40vw; height:40vw; border-radius:50%;
          filter:blur(110px); opacity:0.055; pointer-events:none;
          bottom:0; right:0;
          background: radial-gradient(circle,#1cd8d2,#00bf8f);
        }
        .pj-topline {
          position:absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg,transparent,rgba(28,216,210,0.18),transparent);
        }
        .pj-hint {
          margin-top:16px; font-size:0.66rem; font-weight:500;
          letter-spacing:0.14em; text-transform:uppercase;
          color:rgba(255,255,255,0.14);
          display:flex; align-items:center; gap:8px;
        }
        .pj-hint::before { content:''; width:16px; height:1px; background:rgba(255,255,255,0.14); }

        /* ── WIP badge ── */
        .pj-wip-row {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pj-wip-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid rgba(28,216,210,0.32);
          background: rgba(28,216,210,0.07);
          backdrop-filter: blur(10px);
          animation: wip-breathe 2.6s ease-in-out infinite;
          cursor: default;
        }
        .pj-wip-badge:hover {
          border-color: rgba(28,216,210,0.6);
          background: rgba(28,216,210,0.12);
          animation: none;
          box-shadow: 0 0 22px rgba(28,216,210,0.16);
        }
        @keyframes wip-breathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(28,216,210,0); }
          50%      { box-shadow: 0 0 18px 3px rgba(28,216,210,0.13); }
        }
        .pj-wip-spinner {
          width: 13px; height: 13px;
          border-radius: 50%;
          border: 2px solid rgba(28,216,210,0.25);
          border-top-color: #1cd8d2;
          animation: wip-spin 0.9s linear infinite;
          flex-shrink: 0;
        }
        @keyframes wip-spin { to { transform: rotate(360deg); } }
        .pj-wip-text {
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1cd8d2;
        }
        .pj-wip-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.15); flex-shrink: 0;
        }
        .pj-wip-chip {
          font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.32);
          animation: wip-fadein 0.5s ease forwards;
          opacity: 0;
        }
        .pj-wip-chip:nth-child(1) { animation-delay: 0.1s; }
        .pj-wip-chip:nth-child(2) { animation-delay: 0.2s; }
        .pj-wip-chip:nth-child(3) { animation-delay: 0.3s; }
        @keyframes wip-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section id="projects">
        <div className="pj-glow" />
        <div className="pj-topline" />
        <div className="pj-inner">
          <p className="pj-tag">Selected Work</p>
          <h2 className="pj-heading">
            My <span>Projects</span>
          </h2>

          <div className="pj-row" ref={wrapRef} onMouseLeave={handleLeave}>
            {PROJECTS.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`pj-card${hovered === i ? " is-hovered" : ""}`}
                onMouseEnter={() => handleEnter(i)}
              >
                {/* SVG image — always visible */}
                <div className="pj-img">
                  <p.Image />
                </div>

                {/* gradient scrim over image */}
                <div className="pj-scrim" />

                {/* accent line */}
                <div
                  className="pj-accent"
                  style={{
                    background: `linear-gradient(90deg,transparent,${p.accentColor},transparent)`,
                  }}
                />

                {/* ghost number */}
                <span className="pj-bignum">{p.num}</span>

                {/* mini idle label */}
                <div
                  className="pj-mini"
                  ref={(el) => (miniRefs.current[i] = el)}
                >
                  <p className="pj-mini-num">{p.num}</p>
                  <h3 className="pj-mini-title">{p.title}</h3>
                  <span className="pj-mini-tag">{p.tag}</span>
                </div>

                {/* expanded hover info */}
                <div className="pj-exp" ref={(el) => (expRefs.current[i] = el)}>
                  <div className="pj-exp-top">
                    <span className="pj-exp-tag">{p.tag}</span>
                    <span className="pj-exp-year">{p.year}</span>
                  </div>
                  <div className="pj-exp-body">
                    <h3 className="pj-exp-title">{p.title}</h3>
                    <p className="pj-exp-desc">{p.desc}</p>
                    <div className="pj-exp-techs">
                      {p.tech.map((t) => (
                        <span key={t} className="pj-exp-tech">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="pj-exp-links">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(
                            "Sorry Darling Currently Building It 🚧",
                          );
                        }}
                        className="pj-exp-btn primary"
                      >
                        <ArrowIcon /> Live
                      </a>
                      <a
                        href="https://github.com/jayOnWeb"
                        target="_blank"
                        className="pj-exp-btn ghost"
                      >
                        <GithubIcon /> GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── WIP badge ── */}
          <div className="pj-wip-row">
            <div className="pj-wip-badge">
              <span className="pj-wip-spinner" />
              <span className="pj-wip-text">
                Currently building all of these
              </span>
            </div>
            <span className="pj-wip-dot" />
            <span className="pj-wip-chip">In Progress</span>
            <span className="pj-wip-chip">Live Soon</span>
            <span className="pj-wip-chip">Open Source</span>
          </div>
          <p className="pj-hint">Hover a project to expand</p>
        </div>
      </section>
    </>
  );
}
