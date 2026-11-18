import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowDownward,
  MdArrowForward,
  MdAutoAwesome,
  MdCheckCircle,
  MdClass,
  MdClose,
  MdCoPresent,
  MdEventAvailable,
  MdExpandMore,
  MdHelpOutline,
  MdHub,
  MdInfoOutline,
  MdLayers,
  MdLockReset,
  MdLogin,
  MdMenu,
  MdMenuBook,
  MdOutlineAnalytics,
  MdPersonAdd,
  MdSchool,
  MdVerified,
  MdVisibility,
} from "react-icons/md";
import "../styles/home.css";
import EdTechIllustration from "../components/home/EdTechIllustration";
import GetStartedModal from "../components/home/GetStartedModal";
import HomeFooter from "../components/home/HomeFooter";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "support", label: "Help & Support" },
];

const STAKEHOLDER_CARDS = [
  {
    icon: MdSchool,
    accent: "cyan",
    role: "Students",
    summary:
      "Stay informed with clear daily attendance visibility, academic progress trends, coursework deadlines, study materials, and AI-assisted revision guidance.",
  },
  {
    icon: MdCoPresent,
    accent: "amethyst",
    role: "Faculty",
    summary:
      "Streamline classroom attendance tracking, publish study resources, manage assignments and evaluations, and guide students through one organized workspace.",
  },
  {
    icon: MdLayers,
    accent: "cyan",
    role: "Administrators",
    summary:
      "Coordinate academic structures across classes or university departments, oversee enrollments and faculty assignments, and maintain reliable institutional oversight.",
  },
];

const KEY_FEATURES = [
  {
    icon: MdEventAvailable,
    accent: "cyan",
    title: "Smart Attendance Tracking",
    description:
      "Monitor attendance records, track daily presence and understand attendance performance.",
  },
  {
    icon: MdOutlineAnalytics,
    accent: "amethyst",
    title: "Academic Performance",
    description:
      "Track academic progress, marks, performance trends and improvement areas.",
  },
  {
    icon: MdMenuBook,
    accent: "cyan",
    title: "Assignments & Study Resources",
    description:
      "Access assignments, learning materials, study resources and academic activities.",
  },
  {
    icon: MdAutoAwesome,
    accent: "amethyst",
    title: "AI-Powered Learning Support",
    description:
      "Get intelligent learning assistance, concept explanations, revision support and personalized study guidance.",
  },
];

const WHY_CHOOSE_PILLARS = [
  {
    icon: MdHub,
    title: "One Connected Ecosystem",
    desc: "Brings attendance, grades, assignments, study resources, and learning support together instead of scattering data across spreadsheets and disconnected tools.",
  },
  {
    icon: MdLayers,
    title: "Dedicated Role Experiences",
    desc: "Every stakeholder — Student, Faculty, and Administrator — gets focused views and tools designed specifically for their day-to-day academic responsibilities.",
  },
  {
    icon: MdVisibility,
    title: "Clear Academic Visibility",
    desc: "Presents attendance patterns, assessment progress, and upcoming coursework cleanly so learners and educators can act early and stay on track.",
  },
  {
    icon: MdAutoAwesome,
    title: "Intelligent Learning Assistance",
    desc: "Built-in AI learning support helps students break down complex concepts, plan structured revision, and stay engaged alongside faculty guidance.",
  },
];

const SUPPORT_FAQS = [
  {
    q: "How do Students, Faculty, and Administrators get started on E-Zen?",
    a: "Click Get Started or Sign In to open the institutional portal flow. You can select School or College alongside your role (Student, Faculty, or Admin) and proceed directly to authentication or student registration.",
  },
  {
    q: "Can both Schools and Colleges use E-Zen?",
    a: "Yes. E-Zen supports class-and-section structures for schools as well as department-and-semester workflows for colleges and universities within the same platform.",
  },
  {
    q: "How can I recover access if I forget my password?",
    a: "Use the Password Recovery link on the Sign In screen or in the Help & Support section below to open the existing Forgot Password workflow with your registered email.",
  },
];

const Landing = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [preferredInstitution, setPreferredInstitution] = useState("college");
  const [motionPaused, setMotionPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const mobileDialogRef = useRef(null);
  const drawerPressedOutsideRef = useRef(false);

  // Track active navigation link while scrolling
  useEffect(() => {
    const sectionIds = ["home", "about", "features", "support"];
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Control native <dialog> mobile navigation drawer
  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;

    if (mobileMenuOpen && !dialog.open) {
      dialog.showModal();
    } else if (!mobileMenuOpen && dialog.open) {
      dialog.close();
    }
  }, [mobileMenuOpen]);

  const openGetStarted = (institution = "college") => {
    setPreferredInstitution(institution);
    setMobileMenuOpen(false);
    setGetStartedOpen(true);
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    setActiveSection(sectionId);
  };

  const handleMobileNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    // Defer scroll one animation frame so dialog.close() completes focus return first
    requestAnimationFrame(() => {
      scrollToSection(sectionId);
    });
  };

  // Pointer-position check for outside click dismissal on mobile drawer dialog
  const isOutsideDrawer = (e, dialog) => {
    const panel = dialog.querySelector("[data-drawer-panel]");
    if (!panel) return false;
    const rect = panel.getBoundingClientRect();
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    );
  };

  return (
    <div className="min-h-screen bg-[#06030C] text-slate-100 selection:bg-[#00E5FF]/30 selection:text-white flex flex-col overflow-x-clip">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#06030C]/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-glow">
              <div className="w-full h-full bg-[#0D0819] rounded-[9px] sm:rounded-[10px] flex items-center justify-center font-display font-black text-base sm:text-lg text-[#00E5FF]">
                EZ
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-none">
                E-Zen
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block mt-1">
                Intelligent EdTech Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative py-2 transition whitespace-nowrap ${
                    active ? "text-[#00E5FF]" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8E4585]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons & Mobile Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/login"
              className="btn-secondary !text-xs sm:!text-sm !px-3.5 sm:!px-4 !py-2 sm:!py-2.5 min-h-[40px]"
            >
              Sign In
            </Link>
            <span className="hidden sm:inline-flex">
              <button
                type="button"
                onClick={() => openGetStarted("college")}
                className="btn-primary !text-xs sm:!text-sm !px-4 sm:!px-5 !py-2 sm:!py-2.5 min-h-[40px]"
              >
                Get Started
              </button>
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="lg:hidden w-10 h-10 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-slate-200 hover:text-[#00E5FF] flex items-center justify-center transition"
            >
              <MdMenu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (<dialog>) */}
      <dialog
        ref={mobileDialogRef}
        id="mobile-nav-drawer"
        closedby="any"
        aria-label="Mobile navigation"
        onCancel={(e) => {
          e.preventDefault();
          setMobileMenuOpen(false);
        }}
        onClose={() => setMobileMenuOpen(false)}
        onPointerDown={(e) => {
          const dialog = mobileDialogRef.current;
          if (dialog) drawerPressedOutsideRef.current = isOutsideDrawer(e, dialog);
        }}
        onPointerUp={(e) => {
          const dialog = mobileDialogRef.current;
          if (dialog && drawerPressedOutsideRef.current && isOutsideDrawer(e, dialog)) {
            setMobileMenuOpen(false);
          }
          drawerPressedOutsideRef.current = false;
        }}
        className="ezen-dialog ezen-drawer m-0 ml-auto h-[100dvh] max-h-[100dvh] w-[min(21rem,86dvw)] max-w-none p-0 bg-transparent border-0 overflow-visible"
      >
        <div
          data-drawer-panel
          className="h-full w-full bg-[#0A0614] border-l border-white/15 p-6 flex flex-col justify-between shadow-card overflow-y-auto"
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between gap-3 pb-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8E4585] p-[1.5px] shadow-glow">
                  <div className="w-full h-full bg-[#0D0819] rounded-[7px] flex items-center justify-center font-display font-black text-xs text-[#00E5FF]">
                    EZ
                  </div>
                </div>
                <span className="font-display font-extrabold text-base text-white">E-Zen Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <MdClose size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1.5">
              {NAV_LINKS.map((item) => {
                const active = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMobileNavClick(item.id);
                    }}
                    className={`min-h-[44px] px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition ${
                      active
                        ? "bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/35"
                        : "text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#00E5FF]" aria-hidden="true" />}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Drawer Bottom Auth Actions */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary w-full min-h-[46px]"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => openGetStarted("college")}
              className="btn-primary w-full min-h-[46px]"
            >
              Get Started <MdArrowForward size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </dialog>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section id="home" className="relative overflow-hidden border-b border-white/10">
          {/* Futuristic Ambient Lighting & Architectural Grid */}
          <div className="ezen-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div
            className="ezen-anim-aura pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[36rem] sm:w-[48rem] h-72 rounded-full bg-gradient-to-r from-[#8E4585]/30 via-[#00E5FF]/20 to-[#8E4585]/25 blur-[130px]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 text-center">
            {/* Official Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/35 bg-[#00E5FF]/10 text-[#00E5FF] text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-glow">
              <MdVerified size={16} aria-hidden="true" />
              <span>One Future. One Goal. A Million Dreams.</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white mb-6">
              Integrated Academic Management &amp;{" "}
              <span className="text-gradient">Intelligent Learning</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-9 sm:mb-10 leading-relaxed">
              E-Zen brings students, faculty, and administrators together through one unified platform for smart
              attendance tracking, academic performance visibility, study resources, and AI-powered learning support.
            </p>

            {/* Primary & Secondary Functional CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
              <button
                type="button"
                onClick={() => openGetStarted("college")}
                className="btn-primary text-sm sm:text-base px-7 py-3.5 min-h-[48px] shadow-glow"
              >
                <span>Get Started</span>
                <MdArrowForward size={18} aria-hidden="true" />
              </button>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                className="btn-secondary text-sm sm:text-base px-7 py-3.5 min-h-[48px]"
              >
                <span>Learn More</span>
                <MdArrowDownward size={18} aria-hidden="true" />
              </a>
            </div>

            {/* Clean Platform Scope Pills (No fake stats or internal settings) */}
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-slate-300">
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
                Students &bull; Faculty &bull; Administrators
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
                Built for Schools &amp; Colleges
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#00E5FF]">
                AI-Powered Learning Support
              </span>
            </div>
          </div>
        </section>

        {/* 3. E-Zen Introduction */}
        <section id="about" className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-3">
              About E-Zen
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Designed to Connect Every Part of the Campus
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Modern education demands clarity across classrooms, coursework, and academic progress. E-Zen replaces
              fragmented academic tools with a unified workspace tailored for every participant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STAKEHOLDER_CARDS.map(({ icon: Icon, accent, role, summary }) => (
              <article
                key={role}
                className="ezen-glass ezen-glass-hover rounded-2xl border border-white/10 p-6 sm:p-7 flex flex-col h-full"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${
                    accent === "cyan"
                      ? "bg-[#00E5FF]/15 border-[#00E5FF]/35 text-[#00E5FF]"
                      : "bg-[#8E4585]/25 border-[#8E4585]/50 text-[#C476BB]"
                  }`}
                >
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-2.5">{role}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Animated Education Technology Illustration */}
        <section
          id="platform-overview"
          className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto border-t border-white/10"
        >
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C476BB] mb-3">
              Connected EdTech Architecture
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Unifying Attendance, Performance, Resources &amp; AI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              See how E-Zen links students, faculty, academic progress, and intelligent learning guidance inside one
              cohesive digital ecosystem.
            </p>
          </div>

          <EdTechIllustration
            paused={motionPaused}
            onTogglePause={() => setMotionPaused((prev) => !prev)}
          />
        </section>

        {/* 5. Key Features */}
        <section
          id="features"
          className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto border-t border-white/10"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-3">
              Key Features
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Four Pillars of Modern Learning &amp; Tracking
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Focused capabilities crafted to keep daily attendance clear, progress measurable, study materials
              accessible, and academic support always within reach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {KEY_FEATURES.map(({ icon: Icon, accent, title, description }) => (
              <article
                key={title}
                className="ezen-glass ezen-glass-hover rounded-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between h-full"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${
                      accent === "cyan"
                        ? "bg-gradient-to-br from-[#00E5FF]/20 to-[#8E4585]/20 border-[#00E5FF]/40 text-[#00E5FF]"
                        : "bg-gradient-to-br from-[#8E4585]/30 to-[#00E5FF]/15 border-[#C476BB]/45 text-[#C476BB]"
                    }`}
                  >
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </div>

                <div
                  className={`mt-6 h-0.5 w-12 rounded-full ${
                    accent === "cyan" ? "bg-[#00E5FF]/60" : "bg-[#C476BB]/60"
                  }`}
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>
        </section>

        {/* 6. School and College Information */}
        <section
          id="institutions"
          className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto border-t border-white/10"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-3">
              Multi-Environment Support
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Built for Both Schools and Colleges
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Whether your institution follows grade-level school sections or semester-based college departments, E-Zen
              adapts cleanly to your academic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Schools */}
            <article className="ezen-glass ezen-glass-hover rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#8E4585]/25 border border-[#8E4585]/50 flex items-center justify-center text-[#C476BB]">
                    <MdSchool size={26} aria-hidden="true" />
                  </div>
                  <span className="badge badge-purple">School Environment</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                  Schools &amp; Senior Secondary
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Structured around classes, sections, daily classroom attendance, subject resources, periodic
                  assessments, and teacher-parent coordination.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-7">
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Class and section organization for students and subject teachers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Daily attendance monitoring, periodic test marks, and study materials</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Dedicated views for School Students, Faculty, and Administration</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openGetStarted("school")}
                className="btn-secondary w-full sm:w-auto self-start min-h-[44px]"
              >
                <span>Get Started for Schools</span>
                <MdArrowForward size={17} aria-hidden="true" />
              </button>
            </article>

            {/* Colleges */}
            <article className="ezen-glass ezen-glass-hover rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
                    <MdClass size={26} aria-hidden="true" />
                  </div>
                  <span className="badge badge-cyan">College Environment</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3">
                  Colleges &amp; Universities
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Designed for department-based higher education with semester courses, subject-level attendance,
                  assignments, internal assessments, and faculty mentorship.
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-7">
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Department, semester, and course catalog coordination</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Course-wise attendance tracking, assignments, and performance trends</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MdCheckCircle className="text-[#00E5FF] shrink-0 mt-0.5" size={17} aria-hidden="true" />
                    <span>Dedicated views for College Students, Faculty, and Administration</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openGetStarted("college")}
                className="btn-primary w-full sm:w-auto self-start min-h-[44px]"
              >
                <span>Get Started for Colleges</span>
                <MdArrowForward size={17} aria-hidden="true" />
              </button>
            </article>
          </div>
        </section>

        {/* 7. Why Choose E-Zen */}
        <section
          id="why-ezen"
          className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto border-t border-white/10"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C476BB] mb-3">
              Why Choose E-Zen
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Built Around Real Academic Workflows
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every part of E-Zen is structured to reduce administrative friction and give students and educators
              clearer, calmer academic days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHY_CHOOSE_PILLARS.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="ezen-glass ezen-glass-hover rounded-2xl border border-white/10 p-6 sm:p-7 flex items-start gap-4 h-full"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8E4585]/25 border border-white/15 flex items-center justify-center text-[#00E5FF] shrink-0">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 8. Help & Support */}
        <section
          id="support"
          className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto border-t border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Self-Service Portals & Common Questions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="badge badge-cyan text-xs mb-3">Help &amp; Support</span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
                  Account Access &amp; Platform Guidance
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Use the self-service links below to sign in, register a student profile, or recover your account
                  password using the existing authentication routes.
                </p>
              </div>

              {/* Working Quick Support Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  to="/login"
                  className="ezen-glass rounded-2xl border border-white/10 hover:border-[#00E5FF]/45 p-4 flex flex-col gap-2 transition"
                >
                  <MdLogin size={20} className="text-[#00E5FF]" aria-hidden="true" />
                  <span className="font-display font-semibold text-sm text-white">Portal Sign In</span>
                  <span className="text-xs text-slate-400">Student, Faculty &amp; Admin</span>
                </Link>

                <Link
                  to="/forgot-password"
                  className="ezen-glass rounded-2xl border border-white/10 hover:border-[#C476BB]/50 p-4 flex flex-col gap-2 transition"
                >
                  <MdLockReset size={20} className="text-[#C476BB]" aria-hidden="true" />
                  <span className="font-display font-semibold text-sm text-white">Reset Password</span>
                  <span className="text-xs text-slate-400">Account access recovery</span>
                </Link>

                <Link
                  to="/register/student"
                  className="ezen-glass rounded-2xl border border-white/10 hover:border-[#00E5FF]/45 p-4 flex flex-col gap-2 transition"
                >
                  <MdPersonAdd size={20} className="text-[#00E5FF]" aria-hidden="true" />
                  <span className="font-display font-semibold text-sm text-white">Student Sign Up</span>
                  <span className="text-xs text-slate-400">Register new student</span>
                </Link>
              </div>

              {/* Accessible FAQ Disclosures */}
              <div className="space-y-3 pt-2">
                {SUPPORT_FAQS.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={item.q}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-white hover:bg-white/[0.03] transition"
                      >
                        <span>{item.q}</span>
                        <MdExpandMore
                          size={20}
                          aria-hidden="true"
                          className={`shrink-0 text-[#00E5FF] transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Honest Support Configuration Status */}
            <div className="lg:col-span-6">
              <div className="ezen-glass rounded-3xl border border-white/15 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#8E4585]/25 border border-[#8E4585]/45 flex items-center justify-center text-[#C476BB]">
                      <MdHelpOutline size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Support Desk Status</h3>
                      <p className="text-xs text-slate-400">Public inquiry endpoint check</p>
                    </div>
                  </div>
                  <span className="badge bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    Configuration Required
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-xs sm:text-sm text-slate-200 flex items-start gap-3 leading-relaxed">
                  <MdInfoOutline size={20} className="text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white mb-1">
                      Direct support request submission is not yet configured.
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      This project does not currently expose a backend support-ticket API or configured public
                      helpdesk contact channel. Submitting inquiries on the Home Page is disabled so no false
                      confirmations or fake support tickets are generated.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">What you can do right now:</p>
                  <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                    <li>Sign in to your institution portal for role-specific dashboards and notices.</li>
                    <li>Use the Forgot Password flow if you need to recover account access.</li>
                    <li>Connect a backend support endpoint when deploying your institution&rsquo;s helpdesk.</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => openGetStarted("college")}
                    className="btn-primary flex-1 min-h-[44px]"
                  >
                    <span>Open Get Started Flow</span>
                    <MdArrowForward size={17} aria-hidden="true" />
                  </button>
                  <Link to="/login" className="btn-secondary flex-1 min-h-[44px]">
                    Go to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <HomeFooter onGetStarted={() => openGetStarted("college")} />

      {/* Get Started Role & Institution Selection Modal */}
      <GetStartedModal
        open={getStartedOpen}
        initialInstitution={preferredInstitution}
        onClose={() => setGetStartedOpen(false)}
      />
    </div>
  );
};

export default Landing;
