import { motion } from "framer-motion";
import {
  FaReact, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt,
} from "react-icons/fa";
import {
  SiMongodb, SiExpress, SiTailwindcss, SiJavascript, SiTypescript,
} from "react-icons/si";

const skills = [
  { icon: <SiJavascript />, label: "JavaScript", color: "#F7DF1E" },
  { icon: <SiTypescript />, label: "TypeScript", color: "#3178C6" },
  { icon: <FaReact />, label: "React", color: "#61DAFB" },
  { icon: <FaNodeJs />, label: "Node.js", color: "#68A063" },
  { icon: <SiExpress />, label: "Express", color: "#ffffff" },
  { icon: <SiMongodb />, label: "MongoDB", color: "#47A248" },
  { icon: <SiTailwindcss />, label: "Tailwind", color: "#38BDF8" },
  { icon: <FaHtml5 />, label: "HTML5", color: "#E34F26" },
  { icon: <FaCss3Alt />, label: "CSS3", color: "#1572B6" },
  { icon: <FaGitAlt />, label: "Git", color: "#F05032" },
];

const education = [
  {
    year: "2021 – 2023",
    degree: "11th and 12th",
    school: "Dholakiya(Rajkot)",
    desc: "Focused on JEE (problem solving)",
  },
  {
    year: "2023 – 2027",
    degree: "Electronics and Instrumentation with Minor in Software Engineering",
    school: "Nirma University",
    desc: "Currently pursuing electronics and instrumentation(7+cgpa) and softwrae engineering(8.5cgpa).",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        #about {
          font-family: 'DM Sans', sans-serif;
        }

        .about-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1cd8d2;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .about-tag::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #1cd8d2;
        }

        .about-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .about-heading span {
          background: linear-gradient(135deg, #00bf8f, #1cd8d2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-bio {
          color: rgba(255,255,255,0.45);
          font-size: 1rem;
          line-height: 1.8;
          max-width: 480px;
        }

        /* ── Skills ── */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-top: 32px;
        }

        .skill-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(8px);
          cursor: default;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }

        .skill-pill:hover {
          border-color: rgba(28, 216, 210, 0.3);
          background: rgba(28, 216, 210, 0.05);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(28, 216, 210, 0.08);
        }

        .skill-pill svg {
          font-size: 1.5rem;
        }

        .skill-pill span {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }

        /* ── Right panel ── */
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Education cards ── */
        .edu-card {
          position: relative;
          padding: 22px 24px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .edu-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: linear-gradient(180deg, #00bf8f, #1cd8d2);
          border-radius: 999px;
        }

        .edu-card:hover {
          border-color: rgba(28, 216, 210, 0.2);
          box-shadow: 0 8px 32px rgba(28, 216, 210, 0.07);
        }

        .edu-year {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1cd8d2;
          margin-bottom: 6px;
        }

        .edu-degree {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }

        .edu-school {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }

        .edu-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.35);
          line-height: 1.65;
        }

        /* ── Stats strip ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-box {
          padding: 18px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          text-align: center;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .stat-box:hover {
          border-color: rgba(28,216,210,0.25);
          background: rgba(28,216,210,0.04);
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          background: linear-gradient(135deg, #00bf8f, #1cd8d2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        /* glow blob */
        .about-blob {
          position: absolute;
          top: 10%;
          left: -10%;
          width: 40vw;
          height: 40vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,191,143,0.08) 0%, transparent 70%);
          pointer-events: none;
          filter: blur(60px);
        }
      `}</style>

      <section
        id="about"
        className="relative w-full min-h-screen bg-black overflow-hidden py-24 px-6"
      >
        {/* ambient blob */}
        <div className="about-blob" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT ── */}
          <div>
            <motion.p
              className="about-tag"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              About Me
            </motion.p>

            <motion.h2
              className="about-heading"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Crafting digital <br />
              <span>experiences</span>
            </motion.h2>

            <motion.p
              className="about-bio"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
            >
              I'm Jay Kacha, a MERN stack developer passionate about building
              clean, scalable, and performance-driven web applications. I love
              turning ideas into seamless digital products with modern
              technologies and thoughtful design and love problem solving.
            </motion.p>

            {/* Skills */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
            >
              <p className="about-tag mt-10">Tech Stack</p>
              <div className="skills-grid">
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill.label}
                    className="skill-pill"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i * 0.5 + 4}
                  >
                    <span style={{ color: skill.color }}>{skill.icon}</span>
                    <span>{skill.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="right-panel">

            {/* Stats strip */}
            <motion.div
              className="stats-strip"
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              {[
                { num: "Currently Gaining", label: "Years Exp." },
                { num: "2+ good", label: "Projects" },
                { num: "5+", label: "Technologies" },
              ].map((s) => (
                <div className="stat-box" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Education cards */}
            <p className="about-tag mt-2">Education</p>
            {education.map((edu, i) => (
              <motion.div
                key={edu.degree}
                className="edu-card"
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
              >
                <div className="edu-year">{edu.year}</div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-school">{edu.school}</div>
                <div className="edu-desc">{edu.desc}</div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}