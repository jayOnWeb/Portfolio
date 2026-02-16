import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Home",     href: "#home" },
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/jayOnWeb",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jay-kacha-186722362/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const bigTextRef  = useRef(null);
  const lineRef     = useRef(null);

  // Marquee big name scrolls as page scrolls
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bigTextRef.current, {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: "footer",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // top line draws in
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "footer",
            start: "top 90%",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  const fadeUp = (delay = 0) => ({
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] } },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        footer {
          font-family: 'DM Sans', sans-serif;
          background: #000;
          position: relative;
          overflow: hidden;
          padding-bottom: 0;
        }

        /* ── top rule ── */
        .ft-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(28,216,210,0.4), rgba(0,191,143,0.4), transparent);
          transform-origin: left;
        }

        /* ── big scrolling name ── */
        .ft-marquee-wrap {
          overflow: hidden;
          pointer-events: none;
          user-select: none;
          padding: 28px 0 0;
          position: relative;
        }

        .ft-big-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(5rem, 18vw, 18rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 0.88;
          white-space: nowrap;
          /* gradient stroke */
          color: transparent;
          -webkit-text-stroke: 1px rgba(28,216,210,0.12);
          will-change: transform;
          display: block;
          padding-left: 48px;
        }

        /* ── main footer content ── */
        .ft-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 48px 40px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .ft-body {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 36px 24px 36px;
            gap: 28px;
          }
          .ft-nav { justify-content: center; }
          .ft-right { align-items: center; }
          .ft-big-name { -webkit-text-stroke: 1px rgba(28,216,210,0.1); }
        }

        /* left — logo + copy */
        .ft-left {}

        .ft-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          display: inline-block;
          margin-bottom: 8px;
        }

        .ft-copy {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.04em;
          line-height: 1.6;
        }

        .ft-copy span {
          color: #1cd8d2;
        }

        /* center — nav links */
        .ft-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 4px;
          justify-content: center;
        }

        .ft-nav-link {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid transparent;
          transition: color 0.22s, border-color 0.22s, background 0.22s;
          position: relative;
          overflow: hidden;
        }

        .ft-nav-link::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(28,216,210,0.07);
          border-radius: 999px;
          opacity: 0;
          transition: opacity 0.22s;
        }

        .ft-nav-link:hover {
          color: #1cd8d2;
          border-color: rgba(28,216,210,0.25);
        }
        .ft-nav-link:hover::before { opacity: 1; }

        /* right — socials + status */
        .ft-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
        }

        .ft-socials {
          display: flex;
          gap: 8px;
        }

        .ft-social {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.22s, border-color 0.22s, background 0.22s, transform 0.22s;
        }

        .ft-social:hover {
          color: #1cd8d2;
          border-color: rgba(28,216,210,0.3);
          background: rgba(28,216,210,0.06);
          transform: translateY(-3px);
        }

        /* availability dot */
        .ft-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
        }

        .ft-status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #00bf8f;
          box-shadow: 0 0 6px #00bf8f;
          animation: ft-pulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes ft-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* ── bottom strip ── */
        .ft-strip {
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 48px;
          gap: 6px;
        }

        .ft-strip-text {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.12);
          letter-spacing: 0.1em;
          text-align: center;
        }

        .ft-strip-heart {
          color: #1cd8d2;
          animation: ft-beat 1.6s ease-in-out infinite;
          display: inline-block;
          font-size: 0.7rem;
        }

        @keyframes ft-beat {
          0%, 100% { transform: scale(1); }
          30%       { transform: scale(1.35); }
          60%       { transform: scale(0.9); }
        }

        /* ambient glow */
        .ft-glow {
          position: absolute;
          bottom: 0; left: 50%; transform: translateX(-50%);
          width: 60vw; height: 30vw;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.04;
          pointer-events: none;
          background: radial-gradient(ellipse, #1cd8d2, #00bf8f, transparent);
        }
      `}</style>

      <footer>
        <div className="ft-glow"/>

        {/* top draw-in line */}
        <div ref={lineRef} className="ft-line"/>

        {/* big scrolling name */}
        <div className="ft-marquee-wrap">
          <span ref={bigTextRef} className="ft-big-name">
            Jay Kacha — Jay Kacha — Jay Kacha —
          </span>
        </div>

        {/* main grid */}
        <div className="ft-body">

          {/* left */}
          <motion.div
            className="ft-left"
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="ft-logo">Jay.</div>
            <p className="ft-copy">
              Crafting digital experiences.<br/>
              Built with <span>React</span> & <span>Node.js</span>.<br/>
              © {year} Jay Kacha
            </p>
          </motion.div>

          {/* center nav */}
          <motion.nav
            className="ft-nav"
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="ft-nav-link">
                {l.label}
              </a>
            ))}
          </motion.nav>

          {/* right */}
          <motion.div
            className="ft-right"
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="ft-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className="ft-social" aria-label={s.label}
                   target="_blank" rel="noopener noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="ft-status">
              <span className="ft-status-dot"/>
              Available for work
            </div>
          </motion.div>

        </div>

        {/* bottom strip */}
        <div className="ft-strip">
          <span className="ft-strip-text">
            Designed & built with <span className="ft-strip-heart">♥</span> by Jay Kacha
          </span>
        </div>
      </footer>
    </>
  );
}