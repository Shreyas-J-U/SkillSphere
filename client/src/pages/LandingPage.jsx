import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Monitor,
  Zap,
  Target,
  Eye,
  Star,
  Repeat,
  BookOpen,
  Award,
  Search,
  Menu,
  X,
  Rocket,
  Globe,
  Shield,
  Code,
  TrendingUp,
  Heart,
  BarChart3,
  Sparkles,
} from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  gradientPrimary: "from-blue-600 via-purple-600 to-pink-500",
  gradientHover: "from-blue-500 via-purple-500 to-pink-400",
  accentLime: "#84cc16", // Gen-Z energy color
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

const TYPING_SKILLS = ["Python", "Guitar", "French", "Photoshop", "Calculus"];

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

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Navbar Animation
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      // 2. Hero Animations
      const tl = gsap.timeline();

      tl.from(".hero-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .from(
          ".hero-title .word",
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-btns",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-visual",
          {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.6"
        );

      // 3. Floating Elements Animation (Continuous)
      gsap.to(".floating-card-1", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-card-2", {
        y: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // 4. Generic Section Animations
      const sections = gsap.utils.toArray(".animate-section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 5. Features Section Specific Animations
      gsap.fromTo(
        ".features-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 6. How It Works Animations
      gsap.fromTo(
        ".steps-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".steps-header",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".step-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".steps-container",
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);
  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-slate-50 bg-graph-paper font-sans selection:bg-purple-200 overflow-x-hidden relative noise-overlay"
    >
      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
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

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "How it Works", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-slate-600 hover:text-purple-600 font-medium transition-colors relative group"
                >
                  {item}
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
                <div className="flex items-center gap-4">
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
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
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

        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full">
            <div className="px-4 pt-2 pb-8 space-y-4">
              {["Features", "How it Works", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => setIsNavOpen(false)}
                  className="block text-lg font-medium text-slate-700 hover:text-purple-600 px-2 py-2"
                >
                  {item}
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
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse" />
          <div
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="hero-badge flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-100 shadow-sm text-purple-700 font-medium text-sm">
                <Sparkles size={16} />
                <span>The Future of Student Learning</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
              <span className="word inline-block">Trade</span>{" "}
              <span className="word inline-block">Skills.</span>{" "}
              <br className="hidden md:block" />
              <span className="word inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                Master
              </span>{" "}
              <span className="word inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Anything.
              </span>
            </h1>

            {/* Description */}
            <p className="hero-desc text-xl md:text-2xl text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Join the world's first decentralized skill exchange platform.
            </p>

            {/* Interactive Typing Demo */}
            <div className="hero-desc mb-10 flex items-center justify-center gap-2 text-lg md:text-xl text-slate-600">
              <span>Learn</span>
              <div
                className="relative inline-flex items-center px-4 py-2 rounded-lg bg-white border-2 border-dashed"
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
              <span>by teaching what you know</span>
            </div>

            {/* Buttons */}
            <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button
                onClick={handleGetStarted}
                className="w-full sm:w-auto text-lg px-10"
              >
                Start Swapping <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                onClick={handleExplore}
                className="w-full sm:w-auto text-lg px-10"
              >
                Explore Skills
              </Button>
            </div>

            {/* Hero Visual */}
            <div className="hero-visual relative mx-auto max-w-4xl h-[400px] hidden md:block">
              {/* Central Hub */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center z-20">
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center animate-spin-slow`}
                >
                  <Repeat className="text-white w-12 h-12" />
                </div>
              </div>

              {/* Orbiting Cards */}
              <div className="floating-card-1 absolute left-0 top-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-64 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    🎸
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Alex</div>
                    <div className="text-xs text-slate-500">Teaches Guitar</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                  "Looking for React help!"
                </div>
              </div>

              <div className="floating-card-2 absolute right-0 bottom-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-64 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    💻
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Sarah</div>
                    <div className="text-xs text-slate-500">Teaches Coding</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                  "I want to learn Guitar!"
                </div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                style={{ overflow: "visible" }}
              >
                <path
                  d="M 200 100 Q 400 200 600 300"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="animate-section py-10 border-y border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Learners", value: "10K+", icon: Users },
              { label: "Skills Shared", value: "500+", icon: BookOpen },
              { label: "Money Saved", value: "$2M+", icon: TrendingUp },
              { label: "Campuses", value: "50+", icon: Award },
            ].map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex justify-center mb-2 text-slate-400 group-hover:text-purple-600 transition-colors">
                  <stat.icon size={24} />
                </div>
                <div
                  className={`text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${COLORS.gradientPrimary}`}
                >
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Swaps Ticker */}
      <section className="py-6 bg-gradient-to-r from-slate-100 to-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 mb-3 justify-center">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: COLORS.accentLime }}
          />
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Live Swaps Happening Now
          </span>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...LIVE_SWAPS, ...LIVE_SWAPS].map((swap, i) => (
              <div
                key={i}
                className="mx-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200"
              >
                <span className="font-semibold text-slate-700">
                  {swap.from}
                </span>
                <span className="text-lg">{swap.emoji}</span>
                <span className="text-slate-500 text-sm">
                  {swap.skill1} ↔ {swap.skill2}
                </span>
              </div>
            ))}
          </div>
          <div
            className="absolute top-0 flex animate-marquee whitespace-nowrap"
            style={{ animationDelay: "15s" }}
          >
            {[...LIVE_SWAPS, ...LIVE_SWAPS].map((swap, i) => (
              <div
                key={i}
                className="mx-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200"
              >
                <span className="font-semibold text-slate-700">
                  {swap.from}
                </span>
                <span className="text-lg">{swap.emoji}</span>
                <span className="text-slate-500 text-sm">
                  {swap.skill1} ↔ {swap.skill2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="features-header text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose SkillSphere?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Break free from expensive courses. Experience a community-driven
              way to master new skills.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="features-grid grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Large Feature - Smart Matching (2x2) */}
            <div className="feature-card md:col-span-4 md:row-span-2 bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-3xl shadow-xl border-2 border-purple-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6`}
                >
                  <Zap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Smart Matching
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Our AI connects you with learners who need your skills and
                  have the skills you want. Get matched based on skill level,
                  availability, and learning goals.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["AI-Powered", "Instant Match", "Compatibility Score"].map(
                    (tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed"
                        style={{
                          borderColor: COLORS.accentLime,
                          color: COLORS.accentLime,
                        }}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Medium Feature - Verified Community */}
            <div className="feature-card md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6`}
              >
                <Shield className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Verified Community
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Student ID verification ensures a safe, trusted environment for
                all exchanges.
              </p>
            </div>

            {/* Medium Feature - Structured Learning */}
            <div className="feature-card md:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center mb-6`}
              >
                <Target className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Structured Learning
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Built-in roadmaps and session trackers ensure you reach your
                goals.
              </p>
            </div>
          </div>

          {/* University Badges */}
          <div className="mt-16 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Trusted by students at 50+ Universities
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {[
                "🎓 Harvard",
                "🎓 MIT",
                "🎓 Stanford",
                "🎓 Berkeley",
                "🎓 Yale",
              ].map((uni, i) => (
                <div key={i} className="text-2xl font-bold text-slate-400">
                  {uni}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-slate-50/50 skew-y-3 transform origin-top-left scale-110" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="steps-header text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How Bartering Works
            </h2>
            <p className="text-xl text-slate-600">
              It's as simple as 1-2-3. No hidden fees, just pure knowledge
              exchange.
            </p>
          </div>

          <div className="steps-container space-y-20">
            {[
              {
                step: "01",
                title: "List Your Skills",
                desc: "Create a profile highlighting what you're good at (e.g., Math, Photoshop) and what you want to learn.",
                image:
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80",
                alt: "Students collaborating and sharing skills",
                align: "left",
              },
              {
                step: "02",
                title: "Find Your Match",
                desc: "Browse profiles or let our algorithm suggest perfect barter partners based on compatibility.",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&q=80",
                alt: "Person searching and connecting with others",
                align: "right",
              },
              {
                step: "03",
                title: "Connect & Swap",
                desc: "Schedule a session using our integrated calendar. Teach your session, then become the student.",
                image:
                  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&q=80",
                alt: "Students teaching and learning together",
                align: "left",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`step-card flex flex-col md:flex-row items-center gap-12 ${
                  item.align === "right" ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mb-4">
                    STEP {item.step}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${COLORS.gradientPrimary} blur-2xl opacity-20 rounded-3xl group-hover:opacity-30 transition-opacity`}
                    />
                    <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden aspect-video">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="animate-section py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Student Stories
            </h2>
            <p className="text-xl text-slate-600">
              See how SkillSphere is changing the way students learn on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "CS Major",
                content:
                  "I was failing Calculus but good at Java. Found a Math major who wanted to learn coding. We both got A's!",
                avatar: "MC",
              },
              {
                name: "Priya Patel",
                role: "Design Student",
                content:
                  "Taught Photoshop to a Marketing student who helped me with my resume. Best trade ever.",
                avatar: "PP",
              },
            ].map((story, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} fill="currentColor" size={20} />
                  ))}
                </div>
                <p className="text-slate-700 text-lg italic mb-6">
                  "{story.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${COLORS.gradientPrimary} text-white flex items-center justify-center font-bold`}
                  >
                    {story.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{story.name}</div>
                    <div className="text-slate-500 text-sm">{story.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="animate-section py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className={`relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${COLORS.gradientPrimary}`}
            />

            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="relative z-10 text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Skill Up?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
                Join thousands of students saving money and mastering new skills
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="white"
                  onClick={handleGetStarted}
                  className="text-lg px-10 py-4 font-bold text-purple-600"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Join Now - It's Free"}
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/70">
                No credit card required. Free for students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COLORS.gradientPrimary} flex items-center justify-center`}
                >
                  <Repeat className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-2xl">SkillSphere</span>
              </div>
              <p className="text-slate-400 max-w-xs">
                The world's first decentralized skill exchange platform built
                exclusively for the student community.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Skills
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trust & Safety
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2025 SkillSphere Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Twitter
              </a>
              <a href="#" className="hover:text-white">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
