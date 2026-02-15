import { useEffect, useState } from "react";
import OverlayMenu from "./OverlayMenu";
import { FiMenu } from "react-icons/fi";
import ReachOutButton from "./ReachOutButton";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const homeSection = document.querySelector("#home");
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(homeSection);
    return () => observer.unobserve(homeSection);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400&display=swap');

        .navbar-root {
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-glass {
          background: rgba(10, 10, 14, 0.45);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
        }

        .navbar-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.6rem;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.55));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          user-select: none;
          cursor: default;
          transition: opacity 0.2s ease;
        }

        .navbar-logo:hover {
          opacity: 0.8;
        }

        .menu-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.28);
          color: #fff;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.07);
        }

        .menu-btn svg {
          font-size: 1rem;
        }
      `}</style>

      <nav
        className="navbar-root navbar-glass fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: visible
            ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 0.35s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <span className="navbar-logo">Jay</span>
        </div>

        {/* Center menu button */}
        <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <button
            onClick={() => setMenuOpen(true)}
            className="menu-btn"
            aria-label="Open Menu"
          >
            <FiMenu />
            <span>Menu</span>
          </button>
        </div>

        {/* Right action */}
        <ReachOutButton />
      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}