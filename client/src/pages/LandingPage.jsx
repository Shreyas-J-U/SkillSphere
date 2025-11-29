import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Zap,
  Target,
  Star,
  Repeat,
  BookOpen,
  Award,
  Menu,
  X,
  Shield,
  TrendingUp,
  Sparkles,
  Check,
  Clock,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  ChevronRight,
  PlayCircle,
  Cpu,
  Award as Trophy,
  Video,
  Briefcase,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  gradientPrimary: "from-blue-600 via-purple-600 to-pink-500",
  gradientHover: "from-blue-500 via-purple-500 to-pink-400",
  accentLime: "#84cc16",
};

const LIVE_SWAPS = [
  { from: "Alex", skill1: "Guitar", skill2: "React", emoji: "🎸↔️💻" },
  { from: "Sarah", skill1: "Python", skill2: "French", emoji: "🐍↔️🇫🇷" },
  { from: "Mike", skill1: "Calculus", skill2: "Photoshop", emoji: "📐↔️🎨" },
  { from: "Emma", skill1: "Spanish", skill2: "Java", emoji: "🇪🇸↔️☕" },
  { from: "David", skill1: "Piano", skill2: "Marketing", emoji: "🎹↔️📊" },
  {
    from: "Lisa",
    skill1: "Chemistry",
    skill2: "Video Editing",
    emoji: "🧪↔️🎬",
  },
];

const TYPING_SKILLS = [
  "Python",
  "UI/UX Design",
  "Guitar",
  "Data Structures",
  "Public Speaking",
  "Machine Learning",
];

const Button = ({ children, className = "", variant = "primary", onClick }) => {
  const baseStyle =
    "px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2";

  const variants = {
    primary: `bg-gradient-to-r ${COLORS.gradientPrimary} text-white hover:shadow-blue-500/25 border-none`,
    outline:
      "bg-white/80 backdrop-blur-md border-2 border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600",
    white: "bg-white text-purple-600 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-600 hover:text-purple-600 hover:bg-slate-100/50",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Refs (no TypeScript generics)
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const navRef = useRef(null);

  // Navigation Handlers
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleExplore = () => {
    navigate("/jobs");
  };

  // Typing Effect
  useEffect(() => {
    const currentSkill = TYPING_SKILLS[typingIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentSkill.length) {
        setTypingText(currentSkill.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTypingIndex((prev) => (prev + 1) % TYPING_SKILLS.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [typingIndex]);

  // Scroll Progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      // Hero
      const heroTl = gsap.timeline();
      heroTl
        .from(".hero-badge", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .from(
          ".hero-title .word",
          {
            y: 100,
            opacity: 0,
            rotationX: -90,
            duration: 1,
            stagger: 0.15,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .from(".hero-desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(
          ".hero-btns",
          { y: 30, opacity: 0, scale: 0.9, duration: 0.8 },
          "-=0.6"
        )
        .from(
          ".hero-visual",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.8"
        );

      // Floating cards
      gsap.to(".floating-card-1", {
        y: -30,
        x: 10,
        rotation: 2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-card-2", {
        y: 30,
        x: -10,
        rotation: -2,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // Stats counter animation (no TS generics)
      gsap.utils.toArray(".stat-value").forEach((el) => {
        const stat = el;
        ScrollTrigger.create({
          trigger: stat,
          start: "top 80%",
          onEnter: () => {
            const target = stat.getAttribute("data-target");
            if (!target) return;
            gsap.to(stat, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: "power2.out",
            });
          },
        });
      });

      // Feature cards
      gsap.utils.toArray(".feature-card").forEach((el, i) => {
        const card = el;
        gsap.from(card, {
          y: 100,
          opacity: 0,
          rotation: i % 2 === 0 ? -5 : 5,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.to(card, {
          y: -20,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Steps
      const steps = gsap.utils.toArray(".step-card");
      steps.forEach((el, i) => {
        const step = el;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(step.querySelector(".step-number"), {
          scale: 0,
          rotation: 360,
          duration: 0.8,
          ease: "back.out(2)",
        })
          .from(
            step.querySelector(".step-content"),
            {
              x: i % 2 === 0 ? -100 : 100,
              opacity: 0,
              duration: 0.8,
            },
            "-=0.4"
          )
          .from(
            step.querySelector(".step-image"),
            {
              scale: 0.8,
              opacity: 0,
              duration: 0.8,
            },
            "-=0.6"
          );
      });

      // Testimonials
      gsap.utils.toArray(".testimonial-card").forEach((el, i) => {
        const card = el;
        gsap.from(card, {
          scale: 0.9,
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.08,
        });
      });

      // CTA
      gsap.from(".cta-section", {
        scale: 0.9,
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        },
      });

      // Parallax backgrounds
      gsap.to(".parallax-bg-1", {
        y: 200,
        scrollTrigger: {
          trigger: ".parallax-bg-1",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".parallax-bg-2", {
        y: -150,
        scrollTrigger: {
          trigger: ".parallax-bg-2",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-slate-50 font-sans selection:bg-purple-200 overflow-x-hidden relative"
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-[100]">
        <div
          className={`h-full bg-gradient-to-r ${COLORS.gradientPrimary} transition-all duration-300`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}
              >
                <Zap className="text-white w-6 h-6" fill="currentColor" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Skill
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sphere
                </span>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { label: "Features", href: "#features" },
                { label: "How it Works", href: "#how-it-works" },
                { label: "Community", href: "#community" },
                { label: "Jobs", href: "#jobs" },
                { label: "Trust & Safety", href: "#trust" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-600 hover:text-purple-600 font-medium transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full" />
                </a>
              ))}
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2.5 text-sm"
                >
                  Dashboard <ArrowRight size={16} />
                </Button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-slate-700 font-semibold hover:text-purple-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <Button
                    variant="primary"
                    onClick={handleGetStarted}
                    className="px-6 py-2.5 text-sm"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="text-slate-800 p-2"
              >
                {isNavOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full">
            <div className="px-4 pt-2 pb-8 space-y-4">
              {[
                { label: "Features", href: "#features" },
                { label: "How it Works", href: "#how-it-works" },
                { label: "Community", href: "#community" },
                { label: "Jobs", href: "#jobs" },
                { label: "Trust & Safety", href: "#trust" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsNavOpen(false)}
                  className="block text-lg font-medium text-slate-700 hover:text-purple-600 px-2 py-2"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="w-full justify-center"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleLogin}
                      className="w-full justify-center"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleGetStarted}
                      className="w-full justify-center"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      >
        <div className="parallax-bg-1 absolute top-0 right-[-10%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px]" />
        <div className="parallax-bg-2 absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="hero-badge flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-100 shadow-lg text-purple-700 font-medium text-sm">
                <Sparkles size={16} className="animate-pulse" />
                <span>Student skill barter • No payments • Just learning</span>
              </div>
            </div>

            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
              <span className="word inline-block">Swap</span>{" "}
              <span className="word inline-block">Skills.</span>{" "}
              <br className="hidden md:block" />
              <span className="word inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                Build
              </span>{" "}
              <span className="word inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Careers.
              </span>
            </h1>

            <p className="hero-desc text-xl md:text-2xl text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              SkillSphere is a student-first barter platform where you{" "}
              <span className="font-semibold text-slate-800">
                teach what you know
              </span>{" "}
              to learn what you want — with real-time chat, GMeet sessions, and
              a skill-based job recommender.
            </p>

            <div className="hero-desc mb-10 flex items-center justify-center gap-2 text-lg md:text-xl text-slate-600 flex-wrap">
              <span>Learn</span>
              <div
                className="relative inline-flex items-center px-4 py-2 rounded-lg bg-white border-2 border-dashed shadow-lg min-w-[150px]"
                style={{ borderColor: COLORS.accentLime }}
              >
                <span
                  className="font-bold"
                  style={{ color: COLORS.accentLime }}
                >
                  {typingText}
                </span>
                <span className="animate-pulse ml-1">|</span>
              </div>
              <span>by bartering your own skills.</span>
            </div>

            <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button
                onClick={handleGetStarted}
                className="w-full sm:w-auto text-lg px-10 shadow-2xl"
              >
                Start Skill Swapping <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                onClick={handleExplore}
                className="w-full sm:w-auto text-lg px-10 group"
              >
                Explore Skill Matches{" "}
                <PlayCircle
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </Button>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual relative mx-auto max-w-4xl h-[400px] hidden md:block">
              {/* Central swap icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center z-20">
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center`}
                >
                  <Repeat
                    className="text-white w-12 h-12 animate-spin"
                    style={{ animationDuration: "8s" }}
                  />
                </div>
              </div>

              {/* Left card: Chat */}
              <div className="floating-card-1 absolute left-0 top-10 bg-white p-5 rounded-2xl shadow-2xl border-2 border-purple-100 w-64 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                    💬
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Realtime Chat
                    </div>
                    <div className="text-xs text-slate-500">
                      Break the ice instantly.
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                  <MessageCircle size={16} className="text-purple-500" />
                  "Hey! Can you help me with DSA this weekend?"
                </div>
              </div>

              {/* Right card: GMeet */}
              <div className="floating-card-2 absolute right-0 bottom-10 bg-white p-5 rounded-2xl shadow-2xl border-2 border-purple-100 w-64 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                    📅
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Scheduled GMeet
                    </div>
                    <div className="text-xs text-slate-500">
                      Auto-created session links.
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col gap-1">
                  <span className="font-semibold text-slate-800">
                    Sat • 7:00 PM
                  </span>
                  <span className="text-xs text-slate-500">
                    DSA + Resume review • 60 mins
                  </span>
                </div>
              </div>

              {/* SVG connection line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path
                  d="M 200 100 Q 400 200 600 300"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="30"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip / Stats */}
      <section className="py-10 border-y border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                label: "Verified Students",
                value: 10,
                display: "10K+",
                icon: Users,
              },
              {
                label: "Skill Swaps",
                value: 500,
                display: "500+",
                icon: BookOpen,
              },
              {
                label: "Sessions Hosted",
                value: 30,
                display: "30K+",
                icon: Video,
              },
              {
                label: "Avg. Rating",
                value: 49,
                display: "4.9/5",
                icon: Award,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex justify-center mb-3 text-slate-400 group-hover:text-purple-600 transition-colors transform group-hover:scale-110 duration-300">
                  <stat.icon size={32} />
                </div>
                <div
                  className={`text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${COLORS.gradientPrimary}`}
                >
                  <span className="stat-value" data-target={stat.value}>
                    0
                  </span>
                  <span>{stat.display.replace(/\d+/g, "")}</span>
                </div>
                <div className="text-slate-600 font-semibold text-sm mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Swaps Ticker */}
      <section className="py-8 bg-gradient-to-r from-slate-100 via-purple-50 to-slate-100 border-y border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <div className="w-3 h-3 rounded-full animate-pulse bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Live Skill Swaps Happening Now
          </span>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...LIVE_SWAPS, ...LIVE_SWAPS].map((swap, i) => (
              <div
                key={i}
                className="mx-4 inline-flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-md border-2 border-purple-100 hover:scale-105 transition-transform"
              >
                <span className="font-bold text-slate-700">{swap.from}</span>
                <span className="text-xl">{swap.emoji}</span>
                <span className="text-slate-500 text-sm font-medium">
                  {swap.skill1} ↔ {swap.skill2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        id="features"
        className="py-32 relative bg-gradient-to-b from-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="features-header text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
              FEATURES
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Built for Students. Powered by Community.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              SkillSphere brings together skill bartering, real-time
              communication, structured sessions, and career outcomes — all in
              one trusted platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Big feature card */}
            <div className="feature-card md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-12 rounded-3xl shadow-2xl border-2 border-purple-200 hover:shadow-purple-300/50 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl group-hover:bg-purple-400/20 transition-all" />
              <div className="relative z-10">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6 shadow-xl transform group-hover:rotate-12 transition-transform`}
                >
                  <Cpu className="text-white w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-4">
                  AI Skill Matching & Job Recommender
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Our engine understands what you{" "}
                  <span className="font-semibold text-slate-800">
                    know, teach, and learn
                  </span>{" "}
                  — then recommends the right peers, sessions, and job
                  opportunities tailored to your skill graph.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Skill-based role suggestions",
                    "Smart barter pairings",
                    "Portfolio-aware matches",
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm font-bold bg-white shadow-md border-2 border-purple-200 text-purple-600 hover:scale-105 transition-transform"
                    >
                      <Check size={14} className="inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Small feature cards */}
            <div className="feature-card bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 group">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}
              >
                <MessageCircle className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Realtime Chat
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Talk instantly, share resources, clarify doubts, and plan your
                next swap in a few messages.
              </p>
            </div>

            <div className="feature-card bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 group">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}
              >
                <Video className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                GMeet Sessions
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Schedule and join Google Meet sessions directly from SkillSphere
                — no messy link sharing.
              </p>
            </div>
          </div>

          {/* Secondary grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified & Safe",
                desc: "Student verification, reporting, and transparent profiles keep the community safe.",
              },
              {
                icon: Target,
                title: "Structured Skill Barter",
                desc: "Define what you teach, what you learn, and how many sessions you’re committing to.",
              },
              {
                icon: Clock,
                title: "Smart Scheduling",
                desc: "Automatic time zone handling, reminders, and session history.",
              },
              {
                icon: Heart,
                title: "Community First",
                desc: "Join topic-based communities, events, and peer circles around shared interests.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* University / Campus trust */}
          <div className="mt-20 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
              Already used by students from campuses like
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 text-sm">
              {[
                "IIT",
                "NIT",
                "BITS",
                "IIIT",
                "State Universities",
                "Global Campuses",
              ].map((uni, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-full border border-slate-200 text-gray-800 bg-white/70"
                >
                  🎓 {uni}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-32 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="steps-header text-center mb-24">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
              HOW IT WORKS
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Start Swapping in 3 Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              No payments. No negotiation headaches. Just structured,
              student-friendly skill exchanges.
            </p>
          </div>

          <div className="steps-container space-y-32">
            {[
              {
                step: "01",
                title: "Create Your Skill Card",
                desc: "Tell SkillSphere what you can teach and what you want to learn — including your level, interests, and time preferences.",
                image:
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80",
                features: [
                  "Add teach & learn skills",
                  "Set your weekly availability",
                  "Link Github, Behance, etc.",
                ],
              },
              {
                step: "02",
                title: "Match, Chat & Schedule",
                desc: "Get AI-based suggestions for barter partners. Start chatting instantly, then pick a time — SkillSphere handles the GMeet link.",
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80",
                features: [
                  "Realtime chat & notifications",
                  "GMeet links auto-generated",
                  "Session reminders & history",
                ],
              },
              {
                step: "03",
                title: "Learn, Track & Unlock Jobs",
                desc: "Complete sessions, earn badges, and build a verified skill graph that powers your job recommendations.",
                image:
                  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&q=80",
                features: [
                  "Session feedback & ratings",
                  "Progress dashboard",
                  "Skill-aligned job suggestions",
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`step-card flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-16`}
              >
                <div className="flex-1 text-center md:text-left step-content">
                  <div className="step-number inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-black text-3xl mb-6 shadow-2xl">
                    {item.step}
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  <div className="space-y-3">
                    {item.features.map((feature, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 justify-center md:justify-start"
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center flex-shrink-0`}
                        >
                          <Check className="text-white w-4 h-4" />
                        </div>
                        <span className="text-slate-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full step-image">
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${COLORS.gradientPrimary} blur-3xl opacity-20 rounded-3xl group-hover:opacity-30 transition-opacity`}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden aspect-video">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-purple-600 text-sm shadow-lg">
                        Step {item.step}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Infographic */}
          <div className="mt-32 bg-white rounded-3xl p-12 shadow-2xl border-2 border-slate-100">
            <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">
              The SkillSphere Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              {[
                {
                  icon: Users,
                  label: "Match",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: MessageCircle,
                  label: "Chat",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: BookOpen,
                  label: "Session",
                  color: "from-pink-500 to-pink-600",
                },
                {
                  icon: Lightbulb,
                  label: "Learn",
                  color: "from-orange-500 to-orange-600",
                },
                {
                  icon: Trophy,
                  label: "Opportunities",
                  color: "from-green-500 to-green-600",
                },
              ].map((item, i) => (
                <div key={i} className="text-center relative">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg transform hover:scale-110 transition-transform`}
                  >
                    <item.icon className="text-white w-10 h-10" />
                  </div>
                  <p className="font-bold text-slate-900">{item.label}</p>
                  {i < 4 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs / Recommender Highlight */}
      <section
        id="jobs"
        className="py-24 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold mb-6">
                <Briefcase size={16} />
                <span>Skill-based job recommender</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Turn every session into a future opportunity.
              </h2>
              <p className="text-lg text-white/80 mb-6">
                As you teach, learn, and get rated by peers, your SkillSphere
                profile becomes a{" "}
                <span className="font-semibold">live proof of work</span>. Our
                recommender uses that to suggest internships, freelance gigs,
                and roles that match what you actually do — not just what’s on
                your CV.
              </p>
              <ul className="space-y-3 text-sm md:text-base text-white/80 mb-8">
                {[
                  "Match with roles based on real skills, not just marks",
                  "Showcase completed swaps, feedback, and badges",
                  "Opt-in only: you control what recruiters see",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="white"
                onClick={handleExplore}
                className="text-base px-8 py-4"
              >
                View Recommended Roles <ArrowRight size={18} />
              </Button>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white/70">
                    Sample Matches for You
                  </span>
                  <span className="text-xs text-emerald-300 flex items-center gap-1">
                    <Sparkles size={14} /> Based on your Skill Card
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      role: "Frontend Intern",
                      company: "Campus Startup",
                      match: "92% skill match",
                      tags: ["React", "Tailwind", "Design Systems"],
                    },
                    {
                      role: "Content + Strategy Intern",
                      company: "EdTech Collective",
                      match: "88% skill match",
                      tags: ["Presentation", "Copywriting", "Marketing"],
                    },
                    {
                      role: "ML Research Assistant",
                      company: "University Lab",
                      match: "85% skill match",
                      tags: ["Python", "ML", "Data Structures"],
                    },
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="border border-white/10 rounded-2xl p-4 bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="font-semibold">{job.role}</div>
                          <div className="text-xs text-white/60">
                            {job.company}
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                          {job.match}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {job.tags.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full bg-white/5 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-white/50">
                  Example preview based on anonymized data. Actual matches
                  depend on your skills & activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Testimonials */}
      <section
        id="community"
        className="py-32 bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
              COMMUNITY & STORIES
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Learn with people like you.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              SkillSphere is more than 1:1 swaps. Join circles, practice
              together, and build friendships around skills and careers.
            </p>
          </div>

          {/* Community circles mini-preview */}
          <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Dev & DSA Circle",
                members: "1.2K members",
                desc: "Daily DSA doubts, mock interviews, and project reviews.",
              },
              {
                title: "Design & Portfolio Club",
                members: "800+ members",
                desc: "Live design reviews, Figma jams, and case study practice.",
              },
              {
                title: "Career Launch Lounge",
                members: "1.5K members",
                desc: "Resume reviews, referrals, job post discussions, and AMA sessions.",
              },
            ].map((circle, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-slate-900">
                    {circle.title}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <Users size={14} /> {circle.members}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{circle.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "CS • MIT",
                content:
                  "I swapped Java mentorship for Calculus help. We scheduled weekly GMeet sessions and tracked progress in SkillSphere. Both of us ended the semester with A grades.",
                avatar: "MC",
                rating: 5,
                saved: "$1,200",
              },
              {
                name: "Priya Patel",
                role: "Design • Stanford",
                content:
                  "Taught Figma and portfolio building, and in return got help with LinkedIn, cold emails, and interview prep. The barter model just makes sense for students.",
                avatar: "PP",
                rating: 5,
                saved: "$800",
              },
              {
                name: "James Wilson",
                role: "Business • Harvard",
                content:
                  "SkillSphere gives you realistic practice, not just theory. I learned Spanish from a native student and helped him with Excel and analytics.",
                avatar: "JW",
                rating: 5,
                saved: "$1,500",
              },
              {
                name: "Sofia Rodriguez",
                role: "Music • Berkeley",
                content:
                  "Swapped guitar lessons for chemistry tutoring. The structured sessions and reminders made it easy to stay consistent.",
                avatar: "SR",
                rating: 5,
                saved: "$950",
              },
              {
                name: "David Kim",
                role: "Engineering • Georgia Tech",
                content:
                  "The real-time chat plus GMeet integration is smooth. No clutter, no confusion. Found a perfect swap buddy in two days.",
                avatar: "DK",
                rating: 5,
                saved: "$2,100",
              },
              {
                name: "Emma Thompson",
                role: "Psychology • Yale",
                content:
                  "Traded French for Python. What surprised me most was how friendly and safe the community felt. The verification and rating systems really help.",
                avatar: "ET",
                rating: 5,
                saved: "$1,400",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="testimonial-card bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl shadow-xl border-2 border-slate-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-500 group"
              >
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {[...Array(story.rating)].map((_, j) => (
                    <Star
                      key={j}
                      fill="currentColor"
                      size={18}
                      className="drop-shadow-sm"
                    />
                  ))}
                </div>
                <p className="text-slate-700 text-base leading-relaxed mb-6 italic">
                  "{story.content}"
                </p>
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${COLORS.gradientPrimary} text-white flex items-center justify-center font-bold text-lg shadow-lg`}
                    >
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {story.name}
                      </div>
                      <div className="text-slate-500 text-sm">{story.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Saved</div>
                    <div className="text-lg font-bold text-green-600">
                      {story.saved}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section
        id="trust"
        className="py-24 bg-slate-50 border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                TRUST & SAFETY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Safe exchanges. Real students. Honest feedback.
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                SkillSphere is designed so you can focus on learning. We handle
                the rest — verification, ratings, and controls.
              </p>
              <div className="space-y-4 text-sm md:text-base">
                {[
                  "Student verification using institutional IDs and checks.",
                  "Session reports, blocking and abuse handling built-in.",
                  "Transparent ratings after each session, visible on profiles.",
                  "Privacy-first approach: you control your visibility and data.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Safety Snapshot
                    </div>
                    <div className="text-xs text-slate-500">
                      Last 30 days on SkillSphere
                    </div>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  99.3% positive sessions
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Sessions rated 4★ and above
                  </span>
                  <span className="font-semibold text-slate-900">96%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div className="h-full w-[96%] bg-gradient-to-r from-emerald-400 to-emerald-600" />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Issues resolved within 24h
                  </span>
                  <span className="font-semibold text-slate-900">98%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div className="h-full w-[98%] bg-gradient-to-r from-blue-400 to-blue-600" />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Users with verified status
                  </span>
                  <span className="font-semibold text-slate-900">87%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[87%] bg-gradient-to-r from-purple-400 to-purple-600" />
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                Metrics shown are representative sample values. Your campus view
                may show your own community’s stats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why SkillSphere beats traditional learning.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how the old model compares to a student-driven, barter-based
              skill network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Learning */}
            <div className="bg-slate-50 p-8 rounded-3xl shadow-lg border-2 border-red-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Traditional Tutors / Courses
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "₹500–₹2000 per hour for quality help",
                  "One-way learning — you’re always the “student”",
                  "No community or peer accountability",
                  "Rigid schedules and rescheduling chaos",
                  "No direct connection to real job opportunities",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SkillSphere */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl shadow-xl border-2 border-purple-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl" />
              <div className="text-center mb-6 relative z-10">
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${COLORS.gradientPrimary} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  SkillSphere Way
                </h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {[
                  "₹0 cost — you pay with your skills, not money",
                  "Two-way learning: you’re a student and a mentor",
                  "Realtime chat, GMeet sessions, and active communities",
                  "Flexible scheduling built for student life",
                  "Skill-based job recommender as you grow",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-700 font-medium"
                  >
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-32 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[3rem] p-16 md:p-24 text-center overflow-hidden shadow-2xl">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${COLORS.gradientPrimary}`}
            />

            <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10 text-white">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-8">
                <Rocket className="w-5 h-5" />
                <span className="font-semibold">
                  Join SkillSphere in under 2 minutes
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Ready to swap your way to success?
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
                Create your Skill Card, start a chat, schedule your first swap,
                and unlock a network that grows with you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  variant="white"
                  onClick={handleGetStarted}
                  className="text-lg px-12 py-5 font-bold text-purple-600 shadow-2xl hover:shadow-white/20"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}{" "}
                  <ArrowRight size={20} />
                </Button>
                <button
                  onClick={handleExplore}
                  className="px-12 py-5 rounded-2xl font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105"
                >
                  Browse Skills & Swaps
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-white/80 flex-wrap">
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <span>Free for students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  <span>Verified community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-white">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center`}
                >
                  <Zap className="text-white w-6 h-6" fill="currentColor" />
                </div>
                <span className="font-bold text-2xl">SkillSphere</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                SkillSphere is a student-first barter platform for skills,
                sessions, and opportunities. Learn anything, teach what you
                love, and grow your career — together.
              </p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram", "Discord"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <span className="text-xs font-bold">{social[0]}</span>
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Browse Skills",
                  "How it Works",
                  "Community Circles",
                  "Job Recommender",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Help Center",
                  "Community Guidelines",
                  "Blog",
                  "Campus Programs",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Trust & Safety",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} SkillSphere. All rights reserved.
              Built by students, for students, with{" "}
              <Heart
                size={14}
                className="inline text-red-500"
                fill="currentColor"
              />
              .
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
