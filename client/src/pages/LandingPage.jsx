import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Users, MessageCircle, Monitor, Zap, Target, Eye, Star, Check, TrendingUp, Award, Globe, Sparkles, BarChart3, Shield, Rocket, Clock, Code, Briefcase, GraduationCap, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    [statsRef, aboutRef, missionRef, featuresRef, reviewsRef].forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 6);
    }, 5000);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Advanced Cursor Glow Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-all duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.12), transparent 70%)`
        }}
      />

      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-gradient-slow"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation with Glass Morphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/70 backdrop-blur-2xl shadow-lg shadow-indigo-500/5 border-b border-white/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                  <Zap className="text-white" size={24} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  SkillSphere
                </span>
                <div className="text-[10px] font-semibold text-gray-500 -mt-1">LEARN • TRADE • GROW</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'About', 'Reviews'].map((item, i) => (
                <a 
                  key={i}
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-gray-700 hover:text-blue-600 transition-colors font-semibold text-sm group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="relative px-6 py-2.5 rounded-xl font-semibold overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <span className="relative text-white font-bold flex items-center space-x-2">
                    <span>Dashboard</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-700 hover:text-blue-600 transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="relative px-6 py-2.5 rounded-xl font-semibold overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                    <span className="relative text-white font-bold">Get Started</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div 
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full border border-blue-200/50 shadow-lg shadow-blue-500/10 animate-slide-up"
                style={{ animationDelay: '0s' }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  10,000+ Active Learners Online
                </span>
              </div>
              
              <h1 
                className="text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                Trade Skills,
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Transform Lives
                </span>
              </h1>
              
              <p 
                className="text-xl text-gray-600 leading-relaxed max-w-xl animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                Join the revolutionary platform where knowledge flows freely. Exchange expertise, 
                build genuine connections, and unlock exponential growth through peer-to-peer learning.
              </p>
              
              <div 
                className="flex flex-wrap gap-4 animate-slide-up"
                style={{ animationDelay: '0.3s' }}
              >
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => navigate('/dashboard')} 
                      className="group relative px-8 py-4 rounded-2xl font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center space-x-2 text-white">
                        <span>Go to Dashboard</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                      </div>
                    </button>
                    <button 
                      onClick={() => navigate('/skills')} 
                      className="px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
                    >
                      Explore Skills
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/register')} 
                      className="group relative px-8 py-4 rounded-2xl font-bold overflow-hidden shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center space-x-2 text-white">
                        <span>Start Free Today</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                      </div>
                    </button>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 rounded-2xl font-bold border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div 
                className="flex items-center space-x-8 pt-4 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="flex -space-x-4">
                  {['bg-gradient-to-br from-blue-400 to-blue-600', 'bg-gradient-to-br from-purple-400 to-purple-600', 'bg-gradient-to-br from-pink-400 to-pink-600', 'bg-gradient-to-br from-indigo-400 to-indigo-600', 'bg-gradient-to-br from-cyan-400 to-cyan-600'].map((color, i) => (
                    <div key={i} className={`w-14 h-14 rounded-full ${color} border-4 border-white flex items-center justify-center text-white font-bold shadow-xl transform hover:scale-125 hover:z-10 transition-all duration-300 cursor-pointer`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">4.9/5 from 2,500+ reviews</p>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Card Grid */}
            <div className="relative perspective-1000">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Users, title: 'Connect', desc: 'Network globally', color: 'from-blue-500 to-cyan-400', delay: '0s', rotate: 'hover:rotate-y-12' },
                  { icon: Monitor, title: 'Learn Live', desc: 'HD video sessions', color: 'from-purple-500 to-pink-400', delay: '0.1s', rotate: 'hover:-rotate-y-12' },
                  { icon: MessageCircle, title: 'Chat', desc: 'Instant messaging', color: 'from-indigo-500 to-purple-400', delay: '0.2s', rotate: 'hover:rotate-y-12' },
                  { icon: Award, title: 'Certify', desc: 'Earn credentials', color: 'from-pink-500 to-rose-400', delay: '0.3s', rotate: 'hover:-rotate-y-12' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={index}
                      className="group relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/30 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 animate-float"
                      style={{ animationDelay: item.delay }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      <div className={`relative w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                        <Icon className="text-white" size={32} strokeWidth={2.5} />
                      </div>
                      
                      <h3 className="relative font-black text-gray-900 text-xl mb-2">{item.title}</h3>
                      <p className="relative text-gray-600 text-sm font-medium">{item.desc}</p>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center p-2">
              <div className="w-1.5 h-3 bg-blue-500 rounded-full animate-scroll-down"></div>
            </div>
            <span className="text-xs font-semibold text-gray-500">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Animated Stats Counter */}
      <section ref={statsRef} id="stats" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid md:grid-cols-4 gap-8 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {[
              { number: '10K+', label: 'Active Users', icon: Users, color: 'from-blue-500 via-cyan-400 to-blue-600', bg: 'from-blue-500/20 to-cyan-500/20' },
              { number: '500+', label: 'Skills', icon: Code, color: 'from-purple-500 via-pink-400 to-purple-600', bg: 'from-purple-500/20 to-pink-500/20' },
              { number: '25K+', label: 'Exchanges', icon: TrendingUp, color: 'from-indigo-500 via-purple-400 to-indigo-600', bg: 'from-indigo-500/20 to-purple-500/20' },
              { number: '98%', label: 'Satisfaction', icon: Heart, color: 'from-pink-500 via-rose-400 to-pink-600', bg: 'from-pink-500/20 to-rose-500/20' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white/70 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 text-center transform hover:scale-105 hover:-translate-y-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                  
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <Icon className="text-white" size={36} strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="relative text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">{stat.number}</h3>
                  <p className="relative text-gray-600 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section with Bento Grid */}
      <section ref={aboutRef} id="about" className="relative py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-100/80 backdrop-blur-sm text-blue-600 rounded-full text-sm font-bold mb-6 border border-blue-200 shadow-lg">
                <Sparkles size={16} />
                <span>ABOUT SKILLSPHERE</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                Revolutionizing How We
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Learn Together
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                More than a platform—it's a movement. We're creating a collaborative ecosystem where knowledge flows freely and growth is mutual.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large Feature Card */}
              <div className="lg:col-span-2 lg:row-span-2 group relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="relative h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                      <Users className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Community-Driven Learning</h3>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Built by learners, for learners. Every member contributes to our thriving ecosystem of shared knowledge and collective growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* Small Feature Cards */}
              {[
                { icon: Zap, title: 'Instant Match', desc: 'AI-powered skill matching', color: 'from-yellow-400 to-orange-500' },
                { icon: Globe, title: 'Global Reach', desc: '150+ countries', color: 'from-blue-400 to-cyan-500' },
                { icon: Shield, title: 'Secure', desc: 'End-to-end encrypted', color: 'from-green-400 to-emerald-500' },
                { icon: Rocket, title: 'Fast Growth', desc: '3x faster learning', color: 'from-purple-400 to-pink-500' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="group relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="text-white" size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black text-gray-900 text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Parallax Cards */}
      <section ref={missionRef} id="mission" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-100/80 backdrop-blur-sm text-purple-600 rounded-full text-sm font-bold mb-6 border border-purple-200 shadow-lg">
              <Target size={16} />
              <span>OUR PURPOSE</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900">
              Driving the Future of
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Collaborative Learning
              </span>
            </h2>
          </div>

          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                icon: Target,
                title: 'Our Mission',
                desc: 'To democratize learning by creating a global platform where knowledge is freely exchanged, barriers are broken, and every individual can unlock their full potential through meaningful collaboration.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
                color: 'from-blue-500 to-cyan-400',
                gradient: 'from-blue-900/90 to-cyan-900/80'
              },
              {
                icon: Eye,
                title: 'Our Vision',
                desc: 'A world where learning knows no boundaries, where curiosity drives progress, and where collaborative growth transforms communities into thriving ecosystems of shared innovation.',
                image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop',
                color: 'from-purple-500 to-pink-400',
                gradient: 'from-purple-900/90 to-pink-900/80'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient}`}></div>
                    <div className="absolute top-8 left-8 w-18 h-18 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl p-4">
                      <Icon className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} size={40} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-3xl font-black text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features with Advanced Cards */}
      <section ref={featuresRef} id="features" className="relative py-24 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-100/80 backdrop-blur-sm text-indigo-600 rounded-full text-sm font-bold mb-6 border border-indigo-200 shadow-lg">
              <Rocket size={16} />
              <span>FEATURES</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Seamless Skill Exchange
              </span>
            </h2>
          </div>

          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${isVisible.features ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {[
              {
                icon: Users,
                title: 'Barter Skill Exchange',
                desc: 'Trade your expertise with others in our global community. Share what you know, gain fresh knowledge, and grow together through meaningful collaboration and mutual learning.',
                image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
                color: 'from-blue-500 to-cyan-400',
                tags: ['AI Matching', 'Smart Pairing', 'Global Network']
              },
              {
                icon: MessageCircle,
                title: 'Instant Communication',
                desc: 'Connect with peers through our advanced messaging system featuring file sharing, voice notes, video calls, and group chats for seamless real-time collaboration.',
                image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
                color: 'from-purple-500 to-pink-400',
                tags: ['Real-time', 'Encrypted', 'Multi-platform']
              },
              {
                icon: BarChart3,
                title: 'Smart Analytics Dashboard',
                desc: 'Track your learning journey with powerful analytics, detailed progress reports, and AI-powered recommendations that guide you toward achieving your goals faster.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
                color: 'from-indigo-500 to-purple-400',
                tags: ['AI Insights', 'Progress Tracking', 'Goals']
              },
              {
                icon: Monitor,
                title: 'Live Video Sessions',
                desc: 'Experience interactive learning with built-in HD video integration. Attend live classes, join expert-led workshops, and connect with mentors face-to-face in real-time.',
                image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=600&fit=crop',
                color: 'from-pink-500 to-rose-400',
                tags: ['HD Quality', 'Screen Share', 'Recording']
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                    <div className={`absolute top-6 left-6 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                      <Icon className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    
                    {/* Feature Tags */}
                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                      {feature.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews with Carousel */}
      <section ref={reviewsRef} id="reviews" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-yellow-100/80 backdrop-blur-sm text-yellow-600 rounded-full text-sm font-bold mb-6 border border-yellow-200 shadow-lg">
              <Star size={16} className="fill-yellow-600" />
              <span>TESTIMONIALS</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">See what our community has to say</p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible.reviews ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { text: "SkillSphere transformed how I learn. Trading design skills for coding knowledge was seamless and incredibly rewarding!", author: "Aisha Patel", role: "UI/UX Designer", rating: 5, avatar: "AP" },
              { text: "The live sessions are incredible. I've learned more in 3 months than I did in years of traditional learning methods.", author: "Rohan Kumar", role: "Software Developer", rating: 5, avatar: "RK" },
              { text: "Amazing platform! The community is supportive and the AI skill matching algorithm is absolutely spot-on.", author: "Sarah Chen", role: "Digital Marketer", rating: 5, avatar: "SC" },
              { text: "I've made genuine connections while learning new skills. This platform is a complete game-changer!", author: "Aarav Singh", role: "Data Scientist", rating: 5, avatar: "AS" },
              { text: "The analytics dashboard keeps me organized and motivated. Highly recommend to anyone serious about learning.", author: "Priya Sharma", role: "Product Manager", rating: 5, avatar: "PS" },
              { text: "SkillSphere's collaborative approach makes learning fun and effective. Best platform I've ever used!", author: "Kabir Ali", role: "Graphic Designer", rating: 5, avatar: "KA" }
            ].map((review, index) => (
              <div 
                key={index}
                className={`group relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${activeTestimonial === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6 italic font-medium">"{review.text}"</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-xl">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{review.author}</h4>
                      <p className="text-sm text-gray-600 font-medium">{review.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Card */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-[3rem] blur-3xl"></div>
          
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-[3rem] p-1 shadow-2xl">
            <div className="bg-white/10 backdrop-blur-xl rounded-[2.8rem] p-16">
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Ready to Transform Your Learning Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of learners who are already trading skills and building meaningful connections.
              </p>
              
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="group px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-3"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/register')} 
                  className="group px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-3"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                </button>
              )}
              
              <p className="text-blue-100 text-sm mt-6 font-medium">No credit card required • Free forever plan available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-2xl font-black">SkillSphere</span>
                  <div className="text-[9px] font-bold text-gray-400 -mt-1">LEARN • TRADE • GROW</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Empowering minds through collaborative learning. Join our global community and transform your potential into expertise.
              </p>
              <div className="flex items-center space-x-3">
                {['📱', '💼', '🐙', '🎮'].map((emoji, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className="w-11 h-11 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                  >
                    <span className="text-xl">{emoji}</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform', links: ['Discover Skills', 'Dashboard', 'Live Sessions', 'Community'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'Documentation', 'Status'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-lg font-black mb-4 text-white">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium hover:translate-x-1 inline-block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm font-medium">
                © {new Date().getFullYear()} SkillSphere. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-slow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(16px);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-slow {
          animation: gradient-slow 8s ease infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 2.5s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        html {
          scroll-behavior: smooth;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
}