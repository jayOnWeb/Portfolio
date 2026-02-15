import React, { useMemo, useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Spline from "@splinetool/react-spline";
import "./home.css";

export default function Home() {
  const roles = useMemo(() => ["Web Developer", "MERN Stack Developer"], []);

  const [index, setIndex]       = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [hireHovered, setHireHovered]         = useState(false);
  const [projectsHovered, setProjectsHovered] = useState(false);

  React.useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setSubIndex((prev) => prev + 1);
        if (subIndex === current.length) setDeleting(true);
      } else {
        setSubIndex((prev) => prev - 1);
        if (subIndex === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, roles]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #home { font-family: 'DM Sans', sans-serif; }

        /* ── Typewriter role ── */
        .home-role {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1cd8d2;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 1.4em;
        }
        .home-role::before {
          content: '';
          display: inline-block;
          width: 28px; height: 1px;
          background: #1cd8d2;
          flex-shrink: 0;
        }
        .home-cursor {
          display: inline-block;
          width: 2px; height: 1em;
          background: #1cd8d2;
          border-radius: 1px;
          margin-left: 2px;
          vertical-align: middle;
          animation: home-blink 0.9s step-end infinite;
        }
        @keyframes home-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Main heading ── */
        .home-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.04em;
          margin-bottom: 22px;
        }
        .home-heading .greeting {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1rem, 1.8vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 4px;
          text-transform: none;
        }
        .home-heading .name {
          background: linear-gradient(135deg, #00bf8f 0%, #1cd8d2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        /* ── Bio ── */
        .home-bio {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          color: rgba(255,255,255,0.38);
          line-height: 1.8;
          max-width: 440px;
          margin-bottom: 36px;
          letter-spacing: 0.01em;
        }

        /* ── HIRE ME button ── */
        .btn-hire {
          position: relative; display: inline-flex; overflow: hidden;
          border-radius: 999px;
          border: 1px solid rgba(28,216,210,0.35);
          background: rgba(28,216,210,0.08);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          text-decoration: none; cursor: pointer;
          box-shadow: 0 0 20px rgba(28,216,210,0.1);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .btn-hire:hover {
          border-color: rgba(28,216,210,0.7);
          box-shadow: 0 0 30px rgba(28,216,210,0.22);
        }
        .btn-hire-fill {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #302b63, #00bf8f, #1cd8d2);
          transition: clip-path 0.55s cubic-bezier(0.16,1,0.3,1);
          clip-path: circle(0% at 50% 50%);
        }
        .btn-hire-fill.expanded { clip-path: circle(150% at 50% 50%); }
        .btn-hire-content {
          position: relative; z-index: 10;
          padding: 12px 28px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.9); transition: color 0.3s; white-space: nowrap;
        }
        .btn-hire:hover .btn-hire-content { color: #fff; }
        .btn-hire::before {
          content: ''; position: absolute; top:0; left:12%; right:12%; height:1px;
          background: linear-gradient(90deg,transparent,rgba(28,216,210,0.5),transparent);
          border-radius: 999px; z-index: 20; pointer-events: none;
        }

        /* ── VIEW PROJECTS button ── */
        .btn-projects {
          position: relative; display: inline-flex; overflow: hidden;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          text-decoration: none; cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .btn-projects:hover {
          border-color: rgba(255,255,255,0.4);
          box-shadow: 0 0 24px rgba(255,255,255,0.07);
        }
        .btn-projects-fill {
          position: absolute; inset: 0;
          background: #ffffff;
          transition: clip-path 0.55s cubic-bezier(0.16,1,0.3,1);
          clip-path: circle(0% at 50% 50%);
        }
        .btn-projects-fill.expanded { clip-path: circle(150% at 50% 50%); }
        .btn-projects-content {
          position: relative; z-index: 10;
          padding: 12px 28px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.8); transition: color 0.3s; white-space: nowrap;
        }
        .btn-projects:hover .btn-projects-content { color: #0a0a0e; }
        .btn-projects::before {
          content: ''; position: absolute; top:0; left:12%; right:12%; height:1px;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
          border-radius: 999px; z-index: 20; pointer-events: none;
        }

        /* ── Social icons ── */
        .home-socials {
          display: flex; align-items: center; gap: 10px; margin-top: 36px;
        }
        .home-social {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.38); text-decoration: none; font-size: 1rem;
          transition: color 0.22s, border-color 0.22s, background 0.22s, transform 0.22s;
        }
        .home-social:hover {
          color: #1cd8d2;
          border-color: rgba(28,216,210,0.3);
          background: rgba(28,216,210,0.06);
          transform: translateY(-3px);
        }

        /* ── Scroll indicator ── */
        .home-scroll {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.18);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          z-index: 20;
        }
        .home-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(28,216,210,0.6), transparent);
          animation: home-scroll-drop 1.8s ease-in-out infinite;
        }
        @keyframes home-scroll-drop {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
      `}</style>

      <section id="home" className="w-full h-screen relative bg-black overflow-hidden">
        <ParticlesBackground />

        {/* ambient blob */}
        <div className="absolute inset-0">
          <div className="absolute bottom-0 right-0
            w-[60vw] md:w-[35vw] h-[60vw] md:h-[35vw]
            rounded-full bg-linear-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2]
            opacity-20 blur-[130px] animate-pulse"
          />
        </div>

        <div className="relative z-10 h-full w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">

          {/* ── LEFT ── */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Typewriter */}
              <p className="home-role justify-center lg:justify-start">
                {roles[index].substring(0, subIndex)}
                <span className="home-cursor" />
              </p>

              {/* Heading */}
              <h1 className="home-heading">
                <span className="greeting">Hello, I'm</span>
                <span className="name">Jay Kacha</span>
              </h1>

              {/* Bio */}
              <p className="home-bio mx-auto lg:mx-0">
                Passionate developer focused on building clean, scalable and
                performance-driven web applications using modern technologies.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a
                  href="#contact"
                  className="btn-hire"
                  onMouseEnter={() => setHireHovered(true)}
                  onMouseLeave={() => setHireHovered(false)}
                >
                  <span className={`btn-hire-fill ${hireHovered ? "expanded" : ""}`} />
                  <span className="btn-hire-content">Hire Me</span>
                </a>

                <a
                  href="#projects"
                  className="btn-projects"
                  onMouseEnter={() => setProjectsHovered(true)}
                  onMouseLeave={() => setProjectsHovered(false)}
                >
                  <span className={`btn-projects-fill ${projectsHovered ? "expanded" : ""}`} />
                  <span className="btn-projects-content">View Projects</span>
                </a>
              </div>

              {/* Socials */}
              <div className="home-socials justify-center lg:justify-start">
                <a href="https://github.com/jayOnWeb" target="_blank" className="home-social" aria-label="GitHub">   <FaGithub />   </a>
                <a href="https://www.linkedin.com/in/jay-kacha-186722362/" className="home-social" target="_blank" aria-label="LinkedIn"> <FaLinkedin /> </a>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="w-150 h-150">
              <Spline scene="https://prod.spline.design/EiK4eA3SVTD4lbCK/scene.splinecode" />
            </div>
          </div>

        </div>

        {/* scroll indicator */}
        <div className="home-scroll">
          <div className="home-scroll-line" />
          <span>scroll</span>
        </div>
      </section>
    </>
  );
}