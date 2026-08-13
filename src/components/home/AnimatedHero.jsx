import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Search, MapPin, Sparkles, ShieldCheck, Flame } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    title: 'THE SNOW ADVENTURER',
    subtitle: 'Majestic Alpine Trails & Powder Peaks',
  },
  {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    title: 'THE FOREST HIKER',
    subtitle: 'Canadian Banff National Park Wilderness',
  },
  {
    image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=80',
    title: 'THE NORTHERN LIGHTS',
    subtitle: 'Aurora Borealis Spectacles in Yellowknife',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    title: 'THE SEA EXPLORER',
    subtitle: 'US East Coast Coastal Kayaking & Sailing',
  },
];

const AnimatedHero = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickSearch, setQuickSearch] = useState('');

  // Auto transition background slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Canvas interactive particle + topographic contour animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const numParticles = 45;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let step = 0;
    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw animated topographic wave contours
      ctx.strokeStyle = 'rgba(247, 244, 236, 0.08)';
      ctx.lineWidth = 1.5;

      for (let y = 50; y < canvas.height; y += 70) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 15) {
          const waveY = y + Math.sin(x * 0.008 + step + y * 0.02) * 18 + Math.cos(x * 0.004 + step * 0.8) * 12;
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      // Draw moving ambient particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/tours?difficulty=${encodeURIComponent(quickSearch.toLowerCase())}`);
    } else {
      navigate('/tours');
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-[#1F3D2B] text-white overflow-hidden border-b-4 border-[#A8541F]">
      {/* Background Ken-Burns slideshow images */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '2000ms' }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark gradient & topo overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B] via-[#1F3D2B]/50 to-black/40"></div>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Floating Rotated Passport Stamp Badges */}
      <div className="hidden lg:block absolute top-12 left-12 z-20 animate-bounce" style={{ animationDuration: '6s' }}>
        <div className="passport-stamp border-[#F7F4EC] text-[#F7F4EC] bg-[#1F3D2B]/80 backdrop-blur">
          <span className="text-[9px] font-mono tracking-widest">WILDERNESS</span>
          <span className="text-xs font-bold font-mono">100% VERIFIED</span>
        </div>
      </div>

      <div className="hidden lg:block absolute bottom-16 right-12 z-20 animate-bounce" style={{ animationDuration: '8s' }}>
        <div className="passport-stamp border-amber-300 text-amber-300 bg-[#1F3D2B]/80 backdrop-blur">
          <span className="text-[9px] font-mono tracking-widest">RAZORPAY</span>
          <span className="text-xs font-bold font-mono">INSTANT SEAT</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto text-center px-4 py-20 space-y-8">
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2E5940]/90 border border-amber-300/40 backdrop-blur text-amber-200 font-mono text-xs uppercase tracking-widest shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>OUTDOOR EXPEDITION PLATFORM</span>
        </div>

        {/* Dynamic Title */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight text-[#F7F4EC] drop-shadow-lg">
            OUT IN THE WILD IS WHERE YOU FEEL <span className="text-amber-400 italic font-normal">TRULY ALIVE</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-amber-200 uppercase tracking-widest transition-all">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>
        </div>

        {/* Quick Explorer Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border-2 border-dashed border-[#A8541F] flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
            <Search className="w-5 h-5 text-[#1F3D2B]" />
            <input
              type="text"
              placeholder="Search by difficulty (e.g. easy, medium, difficult)..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full text-sm font-sans bg-transparent text-[#1B1B18] placeholder-[#8E8A7E] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1F3D2B] hover:bg-[#2E5940] text-white px-6 py-3.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider shadow transition-transform hover:scale-105"
          >
            <span>Search Trails</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </form>

        {/* Hero Quick Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/tours?difficulty=easy"
            className="px-4 py-1.5 rounded-full bg-[#1F3D2B]/80 hover:bg-[#A8541F] border border-amber-300/30 text-xs font-mono text-amber-200 transition-colors"
          >
            🌿 Easy Trails
          </Link>
          <Link
            to="/tours?difficulty=medium"
            className="px-4 py-1.5 rounded-full bg-[#1F3D2B]/80 hover:bg-[#A8541F] border border-amber-300/30 text-xs font-mono text-amber-200 transition-colors"
          >
            🏔️ Medium Hikes
          </Link>
          <Link
            to="/tours?difficulty=difficult"
            className="px-4 py-1.5 rounded-full bg-[#1F3D2B]/80 hover:bg-[#A8541F] border border-amber-300/30 text-xs font-mono text-amber-200 transition-colors"
          >
            🔥 Extreme Expeditions
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
