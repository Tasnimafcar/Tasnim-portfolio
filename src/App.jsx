import React, { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink, Mail, Phone, Terminal, GitCommit, Menu, X } from "lucide-react";
import emailjs from "@emailjs/browser";
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiExpress,
  SiVite,
  SiSupabase,
  SiGit,
} from "react-icons/si";

const COLORS = {
  ink: "#0B1120",
  surface: "#121A2E",
  surfaceAlt: "#182238",
  paper: "#EDEAE2",
  muted: "#8992A9",
  mutedDim: "#5B6478",
  signal: "#E0483F",
  accent: "#45C7A6",
  line: "#232D45",
};

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
@keyframes spin-border {
  to { transform: rotate(360deg); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
.skill-stagger-1 { margin-top: 0; }
.skill-stagger-2 { margin-top: 0; }
@media (min-width: 640px) {
  .skill-stagger-1 { margin-top: 48px; }
  .skill-stagger-2 { margin-top: 96px; }
}
`;

const SKILLS = {
  "frontend/": ["React", "Vite", "Tailwind CSS", "Framer Motion", "JavaScript"],
  "backend/": ["Node.js", "Express.js", "MongoDB", "REST APIs"],
  "tools/": ["Supabase", "Git & GitHub", "Vercel"],
};

const PROJECTS = [
  {
    hash: "a3f9c2d",
    name: "Feni Blood Donors Society",
    desc: "A real-time blood donor finder built for my home district. Handles donor registration, authentication, session management, and live filtering so people can find a match fast when it matters most.",
    tags: ["React", "Supabase", "Vercel", "Auth"],
    live: "https://feni-blood-donors-society-26.vercel.app/",
    status: "deployed",
    image: "/feni blood donners society.png",
  },
  {
    hash: "f18b6e4",
    name: "AI Model Hub",
    desc: "A subscription-style AI model marketplace with an animated cart, portal-based mobile navigation, and a typewriter hero. Built to practice production-grade UI patterns end to end.",
    tags: ["React", "Tailwind v4", "Framer Motion", "DaisyUI"],
    live: "https://ai-model-hub-4l76.vercel.app/",
    status: "deployed",
    image: "/Ai model hub.png",
  },
];

/* ---------------- INTRO BALL-BLAST ANIMATION ---------------- */

const INTRO_BALLS = [
  { label: "React", Icon: SiReact, color: "#45C7A6" },
  { label: "Node.js", Icon: SiNodedotjs, color: "#E0483F" },
  { label: "MongoDB", Icon: SiMongodb, color: "#45C7A6" },
  { label: "Tailwind", Icon: SiTailwindcss, color: "#E0483F" },
  { label: "Express", Icon: SiExpress, color: "#45C7A6" },
  { label: "Vite", Icon: SiVite, color: "#E0483F" },
  { label: "Supabase", Icon: SiSupabase, color: "#45C7A6" },
  { label: "Git", Icon: SiGit, color: "#E0483F" },
];

const RING_RADIUS = 130;

function useIntroPositions(count) {
  return useRef(
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const restX = Math.cos(angle) * RING_RADIUS;
      const restY = Math.sin(angle) * RING_RADIUS;
      const startDist = 500 + Math.random() * 260;
      const jitter = (Math.random() - 0.5) * 0.6;
      const startAngle = angle + jitter;
      const startX = Math.cos(startAngle) * startDist;
      const startY = Math.sin(startAngle) * startDist;
      const delay = Math.round(Math.random() * 250);
      return { startX, startY, restX, restY, delay };
    })
  ).current;
}

function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState("start");
  const positions = useIntroPositions(INTRO_BALLS.length);
  const skippedRef = useRef(false);

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("enter"), 40);
    const t1 = setTimeout(() => setPhase("converge"), 40 + 2000);
    const t2 = setTimeout(() => setPhase("blast"), 40 + 2000 + 600);
    const t3 = setTimeout(() => setPhase("exit"), 40 + 2000 + 600 + 850);
    const t4 = setTimeout(() => {
      if (!skippedRef.current) onComplete();
    }, 40 + 2000 + 600 + 850 + 650);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    skippedRef.current = true;
    onComplete();
  };

  const entered = phase !== "start";
  const converged = phase === "converge" || phase === "blast" || phase === "exit";
  const blasting = phase === "blast" || phase === "exit";
  const exiting = phase === "exit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: COLORS.ink,
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.55s ease",
        pointerEvents: exiting ? "none" : "auto",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: "100%",
        margin: 0,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative w-0 h-0 flex items-center justify-center">
        {INTRO_BALLS.map((b, i) => {
          const pos = positions[i];
          const tx = !entered ? pos.startX : converged ? 0 : pos.restX;
          const ty = !entered ? pos.startY : converged ? 0 : pos.restY;
          const scale = !entered ? 0.3 : converged ? 0 : 1;
          const opacity = !entered ? 0 : converged ? 0 : 1;
          const Icon = b.Icon;
          return (
            <div
              key={b.label}
              className="absolute w-16 h-16 md:w-20 md:h-20 -ml-8 -mt-8 md:-ml-10 md:-mt-10 rounded-full flex items-center justify-center"
              style={{
                background: b.color + "22",
                border: `1.5px solid ${b.color}`,
                boxShadow: `0 0 18px ${b.color}33`,
                transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                opacity,
                transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${entered && phase === "enter" ? pos.delay : 0
                  }ms, opacity 0.8s ease ${entered && phase === "enter" ? pos.delay : 0}ms`,
              }}
            >
              <Icon size={30} color={b.color} />
            </div>
          );
        })}

        <div
          className="absolute rounded-full -ml-6 -mt-6"
          style={{
            width: 48,
            height: 48,
            background: COLORS.accent,
            filter: "blur(10px)",
            opacity: phase === "converge" ? 0.9 : 0,
            transform: phase === "converge" ? "scale(1.6)" : "scale(0.3)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        />

        <div
          className="absolute rounded-full"
          style={{
            top: 0,
            left: 0,
            width: "150vmax",
            height: "150vmax",
            marginLeft: "-75vmax",
            marginTop: "-75vmax",
            background: COLORS.paper,
            transform: blasting ? "scale(1)" : "scale(0)",
            opacity: blasting ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: 0,
            left: 0,
            width: "150vmax",
            height: "150vmax",
            marginLeft: "-75vmax",
            marginTop: "-75vmax",
            background: COLORS.ink,
            transform: exiting ? "scale(1)" : "scale(0)",
            opacity: exiting ? 1 : 0,
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.03s, opacity 0.1s ease",
          }}
        />
      </div>

      <button
        onClick={handleSkip}
        className="absolute bottom-6 right-6 text-xs tracking-wide px-3 py-1.5 rounded-md"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: COLORS.muted,
          border: `1px solid ${COLORS.line}`,
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.3s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.paper)}
        onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.muted)}
      >
        Skip →
      </button>
    </div>
  );
}

/* ---------------- END INTRO ---------------- */

function useTypewriter(lines, speed = 32, pause = 550, start = true) {
  const [out, setOut] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    let cancelled = false;
    async function run() {
      for (let i = 0; i < lines.length; i++) {
        const full = lines[i];
        for (let c = 1; c <= full.length; c++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, speed));
          setOut((prev) => {
            const next = [...prev];
            next[i] = full.slice(0, c);
            return next;
          });
        }
        await new Promise((r) => setTimeout(r, pause));
      }
      if (!cancelled) setDone(true);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [start]);

  return { out, done };
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function useActiveHighlight() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.intersectionRatio > 0.55);
      },
      { threshold: [0, 0.25, 0.5, 0.55, 0.75, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, active];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0)" : "translateY(18px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [navOpen, setNavOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [siteRevealed, setSiteRevealed] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | sent | error

  const [isCallTime, setIsCallTime] = useState(true);

  useEffect(() => {
    const checkTime = () => {
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        hour12: false,
      }).format(new Date());
      const hour = parseInt(hourStr, 10); // 0-23, Bangladesh local hour
      const blocked = hour >= 0 && hour < 10;
      setIsCallTime(!blocked);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus("sending");

    emailjs
      .send(
        "service_2t10d7s",
        "template_7xhcs4g",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: new Date().toLocaleString(),
        },
        "AojApm9y5hb3BVGXc"
      )
      .then(() => {
        setFormStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setFormStatus("error");
      });
  };

  const bootLines = [
    "$ whoami",
    "> Tasnim — MERN Stack Developer, Feni, Bangladesh",
    "$ cat mission.txt",
    "> Building fast, clean full-stack apps — and shipping them.",
  ];

  const { out, done } = useTypewriter(bootLines, 32, 550, siteRevealed);

  const navLink = "text-sm tracking-wide transition-colors";

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setNavOpen(false);
  };

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    requestAnimationFrame(() => setSiteRevealed(true));
  }, []);

  return (
    <div
      style={{ background: COLORS.ink, color: COLORS.paper, fontFamily: "Inter, sans-serif" }}
      className="min-h-screen w-full"
    >
      <style>{FONT_IMPORT}</style>

      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}

      <div
        style={{
          opacity: siteRevealed ? 1 : 0,
          transform: siteRevealed ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* NAV */}
        <header
          style={{ borderBottom: `1px solid ${COLORS.line}`, background: "rgba(11,17,32,0.85)" }}
          className="sticky top-0 z-30 backdrop-blur"
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.paper }}
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Terminal size={16} style={{ color: COLORS.accent }} />
              tasnim<span style={{ color: COLORS.signal }}>.</span>dev
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {["Work", "Skills", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item.toLowerCase())}
                  className={navLink}
                  style={{ color: COLORS.muted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.paper)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.muted)}
                >
                  {item}
                </a>
              ))}
            </nav>

            <button
              className="md:hidden"
              style={{ color: COLORS.paper }}
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {navOpen && (
            <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ borderTop: `1px solid ${COLORS.line}` }}>
              {["Work", "Skills", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm pt-3"
                  style={{ color: COLORS.muted }}
                  onClick={(e) => handleNavClick(e, item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

          <div
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
            style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full"
                style={{ background: COLORS.accent, animation: "pulse-dot 2s ease-in-out infinite" }}
              />
            </span>

            <span
              className="text-xs"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.muted }}
            >
              Available for freelance work
            </span>
          </div>

          <div
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}
            className="rounded-lg overflow-hidden max-w-2xl"
          >
            <div
              style={{ background: COLORS.surfaceAlt, borderBottom: `1px solid ${COLORS.line}` }}
              className="flex items-center gap-1.5 px-4 py-2.5"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5B6478" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5B6478" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5B6478" }} />
              <span
                className="ml-3 text-xs"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.mutedDim }}
              >
                tasnim — bash
              </span>
            </div>
            <div
              className="p-5 md:p-6 min-h-42 text-sm md:text-base leading-relaxed"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {bootLines.map((line, i) => (
                <div key={i} style={{ color: line.startsWith("$") ? COLORS.accent : COLORS.paper }} className="whitespace-pre-wrap min-h-[1.6em]">
                  {out[i]}
                  {i === out.length - 1 && !done && (
                    <span
                      style={{ background: COLORS.paper }}
                      className="inline-block w-1.75 h-[1em] ml-0.5 align-middle animate-pulse"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <h1
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="mt-10 text-4xl md:text-6xl font-semibold leading-[1.08] max-w-3xl"
            >
              I build web apps that ship,
              <br />
              not just <span style={{ color: COLORS.accent }}>prototypes</span>.
            </h1>
            <p className="mt-6 max-w-lg text-base md:text-lg" style={{ color: COLORS.muted }}>
              MERN stack developer from Feni, Bangladesh. React on the front,
              Node on the back, and a habit of actually deploying what I build.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="relative rounded-md p-[2.5px] overflow-hidden">
                <div
                  className="absolute inset-[-60%]"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, #B45309 40deg, #F59E0B 55deg, #B45309 70deg, transparent 100deg)`,
                    animation: "spin-border 2.5s linear infinite",
                    filter: "drop-shadow(0 0 4px #F59E0B)",
                  }}
                />
                <a
                  href="#work"
                  onClick={(e) => handleNavClick(e, "work")}
                  style={{ background: COLORS.paper, color: COLORS.ink }}
                  className="relative z-10 block px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  See my work
                </a>
              </div>

              <div className="relative rounded-md p-[2.5px] overflow-hidden">
                <div
                  className="absolute inset-[-60%]"
                  style={{
                    background: `conic-gradient(from 180deg, transparent 0deg, #A8281F 40deg, ${COLORS.signal} 55deg, #A8281F 70deg, transparent 100deg)`,
                    animation: "spin-border 2.5s linear infinite",
                    filter: "drop-shadow(0 0 4px #E0483F)",
                  }}
                />
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  style={{ background: COLORS.ink, color: COLORS.paper }}
                  className="relative z-10 block px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-24 max-w-5xl mx-auto px-6 py-20 border-t" style={{ borderColor: COLORS.line }}>
          <Reveal>
            <div className="flex items-baseline gap-3 mb-10">
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.mutedDim }} className="text-sm">
                $
              </span>
              <h2 style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-lg md:text-xl">
                ls skills/
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-start gap-5 sm:gap-6">
            {Object.entries(SKILLS).map(([category, items], idx) => (
              <Reveal key={category} delay={idx * 120}>
                <div
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.line}`,
                  }}
                  className={`rounded-lg p-5 w-full max-w-sm mx-auto sm:max-w-none sm:mx-0 sm:w-64 skill-stagger-${idx}`}
                >
                  <div
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.signal }}
                    className="text-sm mb-4 text-center"
                  >
                    {category}
                  </div>
                  <div className="flex justify-center">
                    <ul className="space-y-2.5 w-40">
                      {items.map((s) => (
                        <li key={s} className="text-sm flex items-center justify-center gap-2" style={{ color: COLORS.paper }}>
                          <span style={{ color: COLORS.accent }}>—</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="work" className="max-w-5xl scroll-mt-24 mx-auto px-6 py-20 border-t" style={{ borderColor: COLORS.line }}>
          <Reveal>
            <div className="flex items-baseline gap-3 mb-12">
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.mutedDim }} className="text-sm">
                $
              </span>
              <h2 style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-lg md:text-xl">
                git log --oneline
              </h2>
            </div>
          </Reveal>

          <div className="relative pl-8">
            <div className="absolute left-1.75 top-2 bottom-2 w-px" style={{ background: COLORS.line }} />
            <div className="space-y-14" style={{ perspective: "1200px" }}>
              {PROJECTS.map((p, idx) => {
                const [activeRef, active] = useActiveHighlight();
                return (
                  <Reveal key={p.hash} delay={idx * 120}>
                    <div
                      ref={activeRef}
                      className="relative"
                      style={{
                        opacity: active ? 1 : 0.45,
                        transform: active ? "scale(1.03)" : "scale(1)",
                        filter: active ? "brightness(1.1)" : "brightness(0.85)",
                        transition: "opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease",
                      }}
                    >
                      <div
                        className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full ring-4"
                        style={{ background: COLORS.accent, ["--tw-ring-color"]: COLORS.ink }}
                      />
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span
                          style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.signal }}
                          className="text-xs"
                        >
                          {p.hash}
                        </span>
                        <span
                          style={{ background: COLORS.surfaceAlt, color: COLORS.accent, fontFamily: "'IBM Plex Mono', monospace" }}
                          className="text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wide"
                        >
                          {p.status}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl md:text-3xl font-semibold mb-3">
                        {p.name}
                      </h3>
                      <div
                        className="mb-4 rounded-lg overflow-hidden max-w-xl"
                        style={{ border: `1px solid ${COLORS.line}` }}
                      >
                        <img
                          src={p.image}
                          alt={`${p.name} screenshot`}
                          className="w-full h-auto block"
                          loading="lazy"
                          style={{ background: COLORS.surfaceAlt }}
                        />
                      </div>
                      <p className="text-sm md:text-base max-w-xl mb-4" style={{ color: COLORS.muted }}>
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{ border: `1px solid ${COLORS.line}`, color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace" }}
                            className="text-xs px-2.5 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-5">
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm flex items-center gap-1.5 hover:opacity-80"
                          style={{ color: COLORS.paper }}
                        >
                          <ExternalLink size={14} /> Live
                        </a>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-5xl scroll-mt-24 mx-auto px-6 py-24 border-t" style={{ borderColor: COLORS.line }}>
          <Reveal>
            <div
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}
              className="rounded-lg p-10 md:p-14 text-center"
            >
              <GitCommit size={22} style={{ color: COLORS.signal, margin: "0 auto 20px" }} />
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl md:text-4xl font-semibold mb-4">
                Let's ship something.
              </h2>
              <p className="max-w-md mx-auto mb-8 text-sm md:text-base" style={{ color: COLORS.muted }}>
                Have a project in mind? I'm currently open for freelance and
                contract work.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:tasnimafsar123@gmail.com"
                  style={{ background: COLORS.paper, color: COLORS.ink }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Mail size={16} /> tasnimafsar123@gmail.com
                </a>

                {isCallTime ? (
                  <a
                    href="tel:+8801585045382"
                    style={{ border: `1px solid ${COLORS.line}`, color: COLORS.paper }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium hover:border-[#45C7A6] transition-colors"
                  >
                    <Phone size={16} /> Call me
                  </a>
                ) : (
                  <div
                    style={{ border: `1px solid ${COLORS.line}`, color: COLORS.mutedDim }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium cursor-not-allowed opacity-50"
                    title="Available 10 AM – 12 AM (Bangladesh Time, GMT+6)"
                  >
                    <Phone size={16} /> Call me (10 AM–12 AM BDT)
                  </div>
                )}

                <a
                  href="/Tasnim_Afsar_Resume.pdf"
                  download
                  style={{ border: `1px solid ${COLORS.line}`, color: COLORS.paper }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium hover:border-[#45C7A6] transition-colors"
                >
                  Download Resume
                </a>
              </div>
              <form onSubmit={handleFormSubmit} className="mt-10 max-w-md mx-auto text-left space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-md text-sm"
                  style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.paper }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 rounded-md text-sm"
                  style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.paper }}
                />
                <textarea
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-md text-sm resize-none"
                  style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.line}`, color: COLORS.paper }}
                />
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  style={{ background: COLORS.paper, color: COLORS.ink }}
                  className="w-full px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {formStatus === "sending" ? "Sending..." : "Send message"}
                </button>

                {formStatus === "sent" && (
                  <p className="text-sm text-center" style={{ color: COLORS.accent }}>
                    Message sent — I'll get back to you soon.
                  </p>
                )}
                {formStatus === "error" && (
                  <p className="text-sm text-center" style={{ color: COLORS.signal }}>
                    Something went wrong. Try emailing me directly.
                  </p>
                )}
              </form>
            </div>
          </Reveal >
        </section >

        <footer className="max-w-5xl mx-auto px-6 pb-10 text-center text-xs" style={{ color: COLORS.mutedDim }}>
          Built with React & Tailwind — Tasnim, {new Date().getFullYear()}
        </footer>
      </div >
    </div >
  );
}