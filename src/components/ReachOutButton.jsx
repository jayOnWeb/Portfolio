import { useState } from "react";

export default function ReachOutButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap');

        .reach-btn-wrap {
          font-family: 'Syne', sans-serif;
        }

        .reach-btn {
          position: relative;
          display: inline-flex;
          overflow: hidden;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          text-decoration: none;
          box-shadow:
            0 0 0 0 rgba(255,255,255,0),
            inset 0 1px 0 rgba(255,255,255,0.1);
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .reach-btn:hover {
          border-color: rgba(255, 255, 255, 0.38);
          box-shadow:
            0 0 24px rgba(255, 255, 255, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* The white fill that expands on hover via clip-path */
        .reach-btn-fill {
          position: absolute;
          inset: 0;
          background: #ffffff;
          transition: clip-path 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          clip-path: circle(0% at 44px 50%);
        }

        .reach-btn-fill.expanded {
          clip-path: circle(150% at 44px 50%);
        }

        /* Content layer */
        .reach-btn-content {
          position: relative;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 22px 11px 14px;
        }

        /* Icon pill */
        .reach-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255,255,255,0.15);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          flex-shrink: 0;
        }

        .reach-btn:hover .reach-btn-icon {
          background: rgba(0, 0, 0, 0.08);
          border-color: rgba(0,0,0,0.12);
          transform: rotate(-12deg) scale(1.05);
        }

        .reach-btn-icon img {
          width: 18px;
          height: 18px;
          object-fit: contain;
        }

        /* Label */
        .reach-btn-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .reach-btn:hover .reach-btn-label {
          color: #0a0a0e;
        }

        /* tiny shimmer line on top edge */
        .reach-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          border-radius: 999px;
          z-index: 20;
          pointer-events: none;
        }
      `}</style>

      <div className="reach-btn-wrap hidden lg:block">
        <a
          href="#contact"
          className="reach-btn"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Reach Out"
        >
          {/* Circular clip-path fill */}
          <span className={`reach-btn-fill ${hovered ? "expanded" : ""}`} />

          {/* Content */}
          <span className="reach-btn-content">
            <span className="reach-btn-icon">
            </span>
            <span className="reach-btn-label">Reach Out</span>
          </span>
        </a>
      </div>
    </>
  );
}