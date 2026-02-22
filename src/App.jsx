import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUp, ChevronRight, Layout, RefreshCw, Wrench, CheckCircle, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis';
import apexLogo from './assets/logo.svg';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- CURSOR ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [hoverState, setHoverState] = useState('');

  useEffect(() => {
    // Hide default cursor completely for fine pointers
    if (window.matchMedia('(pointer: fine)').matches) {
      document.body.style.cursor = 'none';
    }

    const updateCursor = (e) => {
      // Use smooth gsap set for zero delay, lenis handles smoothing
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });

      const target = e.target;

      // Check if cursor is over a gold/accent background by looking for bg-accent class or gold background color
      let isOverGold = false;
      let parent = target;
      while (parent && parent !== document.body) {
        const classList = parent.className || '';
        const style = window.getComputedStyle(parent);
        const bgColor = style.backgroundColor;

        // Check for bg-accent class or gold color (C9A84C = rgb(201, 168, 76))
        if (classList.includes('bg-accent') || bgColor === 'rgb(201, 168, 76)') {
          isOverGold = true;
          break;
        }
        parent = parent.parentElement;
      }

      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.magnetic-btn') ||
        target.closest('.interactive-nav')
      ) {
        setHoverState('hovering-link');
      } else if (target.closest('.portfolio-item')) {
        setHoverState('hovering-portfolio');
      } else {
        setHoverState(isOverGold ? 'over-gold' : '');
      }
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  // Only render on desktop
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  if (!isDesktop) return null;

  return <div ref={cursorRef} className={`custom-cursor hidden md:block ${hoverState}`} />;
};

// --- SHARED COMPONENTS ---

const SectionHeading = ({ children, subtitle }) => (
  <div className="mb-16 md:mb-24">
    {subtitle && <div className="font-data text-accent text-sm md:text-base uppercase tracking-widest mb-4">{subtitle}</div>}
    <h2 className="font-heading font-bold text-4xl md:text-6xl text-foreground max-w-3xl leading-tight">
      {children}
    </h2>
  </div>
);

// --- SECTIONS ---

// 0. NAVBAR
const Navbar = () => {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background blur when scrolled past hero
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: {
          className: 'nav-scrolled',
          targets: navRef.current
        }
      });
    }, navRef);

    // Hide on scroll down, show on scroll up (desktop only)
    let isHidden = false;
    let hideTimeout = null;

    const handleWheel = (e) => {
      if (menuOpen) return; // Don't hide when mobile menu is open
      const scrollY = window.scrollY;

      if (scrollY < 200) {
        if (isHidden) {
          isHidden = false;
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
        }
        return;
      }

      if (e.deltaY > 0) {
        if (!isHidden && !hideTimeout) {
          hideTimeout = setTimeout(() => {
            isHidden = true;
            gsap.to(navRef.current, { y: -120, duration: 0.4, ease: 'power2.in', overwrite: true });
            hideTimeout = null;
          }, 150);
        }
      } else if (e.deltaY < 0) {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        if (isHidden) {
          isHidden = false;
          gsap.to(navRef.current, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('wheel', handleWheel);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [menuOpen]);

  // Animate mobile menu links on open
  useEffect(() => {
    if (menuOpen) {
      gsap.from('.mobile-nav-link', {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1
      });
    }
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 md:px-8 py-4 rounded-[2rem] transition-all duration-500 w-[92%] max-w-5xl text-foreground
        [&.nav-scrolled]:bg-background/80 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:border [&.nav-scrolled]:border-white/10 [&.nav-scrolled]:py-3"
      >
        <img src={apexLogo} alt="Apex Digital" className="h-9" />
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="hover:text-accent transition-colors duration-300">Services</a>
          <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }} className="hover:text-accent transition-colors duration-300">Work</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }} className="hover:text-accent transition-colors duration-300">Pricing</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }} className="hover:text-accent transition-colors duration-300">FAQ</a>
        </div>
        <button onClick={() => scrollTo('cta')} className="hidden md:flex magnetic-btn bg-accent text-background px-6 py-2.5 rounded-full font-semibold text-sm items-center gap-2 group cursor-pointer border-none appearance-none">
          <span className="relative z-10">Consultation</span>
        </button>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer bg-transparent border-none appearance-none text-foreground"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-2">
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="mobile-nav-link font-heading text-3xl font-bold text-foreground hover:text-accent transition-colors py-4">Services</a>
          <a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollTo('portfolio'); }} className="mobile-nav-link font-heading text-3xl font-bold text-foreground hover:text-accent transition-colors py-4">Work</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }} className="mobile-nav-link font-heading text-3xl font-bold text-foreground hover:text-accent transition-colors py-4">Pricing</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }} className="mobile-nav-link font-heading text-3xl font-bold text-foreground hover:text-accent transition-colors py-4">FAQ</a>
          <button onClick={() => scrollTo('cta')} className="mobile-nav-link magnetic-btn mt-6 bg-accent text-background px-8 py-4 rounded-full font-bold text-lg cursor-pointer border-none appearance-none">
            Book a Consultation
          </button>
        </div>
      )}
    </>
  );
};

// 1. HERO
// INTRO OVERLAY — Branded curtain reveal on page load
const IntroOverlay = () => {
  const overlayRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Text fades in
      tl.from(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.1,
      });

      // Brief hold, then curtain slides up
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.2,
      });

      // Remove from flow after animation
      tl.set(overlayRef.current, { display: 'none' });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-accent flex items-center justify-center"
    >
      <div ref={textRef} className="flex flex-col items-center gap-4">
        <img
          src={apexLogo}
          alt="Apex Digital"
          className="h-16 md:h-20 brightness-0"
        />
        <span className="font-data text-background text-sm md:text-base font-bold tracking-[0.35em] uppercase">
          Apex Digital
        </span>
      </div>
    </div>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const bgImgRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation — entire hero content rises in as one unified block
      gsap.from('.hero-content', {
        y: 60,
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
        delay: 1.0
      });

      // Parallax Background
      gsap.to(bgImgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-[100dvh] flex items-center pt-24 md:pt-32 pb-24 px-8 md:px-16 overflow-hidden bg-background">
      {/* Mountain peak background with parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <img
          ref={bgImgRef}
          src="/mountain.peak.avif"
          alt="Mountain peak"
          className="relative -top-[10%] w-full h-[120%] object-cover opacity-25 grayscale sepia-[0.3] origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="hero-content relative z-10 flex flex-col items-start gap-6 max-w-4xl w-full">
        <div className="inline-block font-data text-accent uppercase tracking-widest text-sm font-semibold border border-accent/20 px-4 py-1.5 rounded-full bg-accent/5 backdrop-blur-sm">
          Precision Digital Systems
        </div>
        <h1 className="flex flex-col text-left leading-[1.05]">
          <span className="font-heading font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-foreground">
            Growth meets
          </span>
          <span className="font-drama italic text-5xl md:text-[6.5rem] lg:text-[8rem] text-accent tracking-tight pr-4 mt-2">
            Precision.
          </span>
        </h1>
        <p className="text-foreground/70 font-data text-base md:text-lg max-w-xl leading-relaxed mt-4">
          We build growth systems and websites for small businesses that turn casual visitors into dedicated clients.
        </p>
        <button onClick={() => { document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="magnetic-btn inline-flex bg-accent text-background px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg items-center gap-3 group cursor-pointer border-none appearance-none mt-8">
          <span className="relative z-10">Book a Free Consultation</span>
          <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-8 md:left-16 flex flex-col items-center gap-4 z-10">
        <span className="font-data text-xs tracking-widest text-foreground/40 uppercase rotate-90 translate-y-4">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-background/50 animate-[slideDown_2s_infinite]"></div>
        </div>
      </div>
    </section>
  );
};

// 2. PROBLEM / PAIN POINT
const Problem = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.problem-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: '100%',
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-20 md:py-40 px-8 md:px-16 bg-dark/20">
      <div className="max-w-4xl mx-auto">
        <div ref={headingRef}>
          <div className="mask-wrapper block-mask drama-mask">
            <p className="problem-text inline-block font-drama italic text-4xl md:text-6xl lg:text-7xl leading-tight text-foreground/90">
              Your current website isn't just sitting there.
            </p>
          </div>
          <div className="mask-wrapper block-mask drama-mask mt-2">
            <p className="problem-text inline-block font-drama italic text-4xl md:text-6xl lg:text-7xl leading-tight text-accent">
              It's costing you customers.
            </p>
          </div>
        </div>
        <div ref={subtextRef} className="mask-wrapper block-mask mt-8">
          <p className="problem-text inline-block font-data text-foreground/60 max-w-2xl leading-relaxed text-sm md:text-base">
            Outdated templates, slow load times, and confusing navigation tell potential clients that your business isn't ready for them. We fix the leaks in your digital foundation.
          </p>
        </div>
      </div>
    </section>
  );
};

// 2.5 STATS BANNER
const StatsBanner = () => {
  const sectionRef = useRef(null);

  const stats = [
    { value: "< 2s", label: "Load Time", desc: "Speed that keeps visitors engaged" },
    { value: "Mobile-First", label: "Design Approach", desc: "Every pixel optimized for phones first" },
    { value: "24hr", label: "Response Time", desc: "We get back to you within a day" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto w-full py-16 md:py-24 px-8 md:px-16 bg-dark/20 border-y border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-item text-center md:text-left">
            <div className="font-heading font-bold text-3xl md:text-4xl text-accent mb-2">{stat.value}</div>
            <div className="font-data text-foreground text-sm font-semibold uppercase tracking-widest mb-2">{stat.label}</div>
            <p className="font-data text-foreground/50 text-sm">{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ServiceCard = ({ svc }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotationY: (x / rect.width) * 15,
      rotationX: -(y / rect.height) * 15,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="service-card-enter tilt-card group bg-dark/40 border border-white/5 hover:border-accent/30 rounded-[2rem] p-6 md:p-10 transition-colors duration-500"
    >
      <div className="tilt-content">
        <div className="w-14 h-14 rounded-full bg-background border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-500">
          {svc.icon}
        </div>
        <div className="relative mb-4">
          <h3 className="font-heading font-bold text-2xl">{svc.title}</h3>
          <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent group-hover:w-full transition-all duration-500 ease-out"></span>
        </div>
        <p className="text-foreground/70 group-hover:text-foreground/90 font-data text-sm leading-relaxed transition-colors duration-500">
          {svc.desc}
        </p>
      </div>
    </div>
  );
};

// 3. SERVICES
const Services = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  const services = [
    {
      icon: <Layout size={24} className="text-accent" />,
      title: "Website Design",
      desc: "From the ground up. Custom, high-fidelity landing pages built to establish trust immediately and convert traffic reliably."
    },
    {
      icon: <RefreshCw size={24} className="text-accent" />,
      title: "Website Redesign",
      desc: "Tear down the legacy templates. We reconstruct your existing digital presence into a modern, performance-driven system."
    },
    {
      icon: <Wrench size={24} className="text-accent" />,
      title: "Ongoing Maintenance",
      desc: "Stress-free longevity. We provide continuous support, updates, and optimization so your site never falls behind again."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from('.service-card-enter', {
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        y: 50, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full" style={{ perspective: '1000px' }}>
      <div ref={headingRef}>
        <SectionHeading subtitle="01 // Capabilities">Architecture for scale</SectionHeading>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((svc, i) => (
          <ServiceCard key={i} svc={svc} />
        ))}
      </div>
    </section>
  );
};

// 4. PROCESS / HOW IT WORKS
const ProcessCard = ({ step }) => {
  const cardRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const target = parseInt(step.num, 10);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          let current = 0;
          const interval = setInterval(() => {
            current++;
            el.textContent = current.toString().padStart(2, '0');
            if (current >= target) clearInterval(interval);
          }, 80);
        }
      });
    });
    return () => ctx.revert();
  }, [step.num]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotationY: (x / rect.width) * 15,
      rotationX: -(y / rect.height) * 15,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="process-card-enter tilt-card group bg-dark/40 border border-white/5 hover:border-accent/30 rounded-[2rem] p-6 md:p-10 transition-colors duration-500"
    >
      <div className="tilt-content">
        <div ref={numRef} className="font-data text-accent text-5xl opacity-40 group-hover:opacity-60 mb-6 font-bold tracking-tighter transition-opacity duration-500">00</div>
        <div className="relative mb-3">
          <h3 className="font-heading font-bold text-xl text-foreground">{step.title}</h3>
          <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent group-hover:w-full transition-all duration-500 ease-out"></span>
        </div>
        <p className="text-foreground/60 group-hover:text-foreground/80 font-data text-sm leading-relaxed transition-colors duration-500">{step.desc}</p>
      </div>
    </div>
  );
};

const Process = () => {
  const sectionRef = useRef(null);
  const gradientRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  const steps = [
    { num: "01", title: "Consultation", desc: "We map your goals and locate the current digital bottlenecks." },
    { num: "02", title: "Design", desc: "Bespoke architecture and high-contrast aesthetics are drafted." },
    { num: "03", title: "Launch", desc: "Pixel-perfect development and rigorous performance deployment." },
    { num: "04", title: "Support", desc: "Ongoing tuning and optimization to ensure long-term scale." }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from('.process-card-enter', {
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        y: 50, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full relative overflow-hidden">
      <div ref={gradientRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-transparent pointer-events-none"></div>

      <div className="relative z-10" style={{ perspective: '1000px' }}>
        <div ref={headingRef}>
          <SectionHeading subtitle="02 // The Process">Stress-free deployment.</SectionHeading>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ProcessCard key={i} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. PORTFOLIO / WORK
const Portfolio = () => {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-heading-enter', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from('.portfolio-demo-enter', {
        scrollTrigger: { trigger: '.portfolio-demo-enter', start: 'top 85%' },
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const demoContainer = sectionRef.current?.querySelector('.portfolio-demo-enter');
    if (!demoContainer) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    demoContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => demoContainer.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section ref={sectionRef} id="portfolio" className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div className="portfolio-heading-enter flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
        <div>
          <div className="font-data text-accent text-sm md:text-base uppercase tracking-widest mb-4">03 // Field Operations</div>
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-foreground max-w-2xl leading-tight">
            Proof of precision.
          </h2>
        </div>
        <p className="font-data text-foreground/60 text-sm max-w-sm">
          We don't deal in hypotheticals. Every system we build is engineered directly for conversion.
        </p>
      </div>

      <div className="portfolio-demo-enter max-w-6xl mx-auto">
        <div className="rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl" style={{ pointerEvents: 'auto', contain: 'layout style paint' }}>
          <iframe
            ref={iframeRef}
            src="https://cell-clinic-mock-up.vercel.app/"
            title="Cell Clinic — Phone Repair Website"
            className="w-full bg-background"
            style={{ height: '700px', display: 'block', border: 'none', pointerEvents: 'auto', contain: 'layout style paint' }}
            allowFullScreen
            onWheel={(e) => {
              e.preventDefault();
            }}
          />
        </div>
        <p className="font-data text-foreground/50 text-sm text-center mt-8">
          Explore the live Cell Clinic website. Built for conversion, designed for mobile.
        </p>
      </div>
    </section>
  );
};

// 6. MISSION STATEMENT
const Mission = () => {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const quoteRef = useRef(null);
  const subtextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(labelRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.6, ease: 'power3.out'
      });
      gsap.from(quoteRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2
      });
      gsap.from(subtextRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-8 md:px-16 bg-accent text-background overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div ref={labelRef} className="font-data text-background/60 text-sm uppercase tracking-widest mb-8">Our Mission</div>
        <p ref={quoteRef} className="font-drama italic text-3xl md:text-5xl leading-tight">
          Every small business deserves a website that works as hard as they do. Not a template. Not a brochure. A precision-built system designed to turn visitors into customers.
        </p>
        <p ref={subtextRef} className="font-data mt-10 text-background/70 text-sm md:text-base max-w-2xl leading-relaxed">
          We exist to close the gap between enterprise-quality web design and small business budgets. Your growth is our benchmark.
        </p>
      </div>
    </section>
  );
};

// 7. ABOUT / WHY APEX
const About = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from(bodyRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div ref={headingRef}>
        <SectionHeading subtitle="04 // The Directive">Built for small business scale.</SectionHeading>
      </div>
      <div ref={bodyRef} className="font-data text-foreground/80 leading-loose text-base md:text-lg max-w-3xl">
        <p>
          Small businesses form the absolute core of the economy, yet are continually forced into generic, low-conversion website templates.
        </p>
        <p className="mt-6">
          I started Apex Digital to fix that disparity. We provide the same high-tier technical fidelity and design architecture usually reserved for enterprise tech companies, scaled appropriately for your operations. If you succeed, we succeed.
        </p>
      </div>
    </section>
  );
};

// 8. PRICING
const Pricing = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardRef = useRef(null);

  const included = [
    "Custom design tailored to your brand",
    "Mobile-responsive on every device",
    "SEO-ready structure and metadata",
    "2 rounds of revisions",
    "Launch support and handoff",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from(cardRef.current, {
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' },
        y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div ref={headingRef}>
        <SectionHeading subtitle="05 // Investment">Transparent pricing.</SectionHeading>
      </div>

      <div ref={cardRef} className="max-w-3xl bg-dark/40 border border-white/5 rounded-[2rem] p-8 md:p-12 lg:p-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-data text-foreground/50 text-sm uppercase tracking-widest mb-2">Starting at</div>
            <div className="font-heading font-bold text-5xl md:text-6xl text-accent">$1,000</div>
          </div>
          <div className="font-data text-foreground/50 text-sm leading-relaxed max-w-xs">
            One-time investment for a complete, conversion-ready website built from scratch.
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mb-10">
          <div className="font-data text-foreground/70 text-xs uppercase tracking-widest mb-6">What's included</div>
          <div className="flex flex-col gap-4">
            {included.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-accent flex-shrink-0" />
                <span className="font-data text-foreground/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-data text-foreground/50 text-sm">Monthly maintenance available from</div>
            <div className="font-heading font-bold text-2xl text-accent mt-1">$50/month</div>
          </div>
          <button
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            className="magnetic-btn bg-accent text-background px-8 py-4 rounded-full font-bold text-base flex items-center gap-3 cursor-pointer border-none appearance-none"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight size={18} className="relative z-10" />
          </button>
        </div>
      </div>
    </section>
  );
};

// 9. FAQ
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  const answerRef = useRef(null);

  return (
    <div
      className={`border-b border-white/10 transition-colors duration-300 ${isOpen ? 'border-accent/30' : ''}`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer bg-transparent border-none appearance-none group"
      >
        <span className={`font-heading font-bold text-lg md:text-xl transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-foreground'}`}>
          {question}
        </span>
        <span className={`text-accent text-2xl font-light transition-transform duration-300 ml-4 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div
        ref={answerRef}
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ maxHeight: isOpen ? `${answerRef.current?.scrollHeight || 200}px` : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <p className="font-data text-foreground/60 text-sm md:text-base leading-relaxed pb-6 max-w-2xl">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const listRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long does it take?",
      answer: "Most projects are designed, built, and launched within one week. Larger or more complex sites may take two. We'll give you a clear timeline during your free consultation.",
    },
    {
      question: "What do I need to get started?",
      answer: "Just your ideas and a 15-minute conversation. We handle everything else — design, development, hosting setup, and launch. If you have existing branding (logo, colors, copy), great. If not, we'll help you figure it out.",
    },
    {
      question: "Do you handle hosting?",
      answer: "Yes. We can set up and manage your hosting so you don't have to think about it. It's included as part of our monthly maintenance plans starting at $50/month.",
    },
    {
      question: "What if I already have a website?",
      answer: "Even better. We'll audit your current site, identify what's working and what's not, and rebuild it into a high-converting system. Your existing content and branding carry over — we just make everything perform better.",
    },
    {
      question: "What happens after my site launches?",
      answer: "Your site needs ongoing care to stay fast, secure, and up to date. Our monthly maintenance plans starting at $50/month cover updates, performance monitoring, security patches, and content changes — so you can focus on running your business while we keep your site running at peak performance.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      });
      gsap.from(listRef.current, {
        scrollTrigger: { trigger: listRef.current, start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div ref={headingRef}>
        <SectionHeading subtitle="06 // Common Questions">Everything you need to know.</SectionHeading>
      </div>

      <div ref={listRef} className="border-t border-white/10">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};

// 10. CTA BANNER
const CTABanner = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="py-20 md:py-32 px-8 md:px-16 w-full mt-12 mb-24 max-w-7xl mx-auto">
      <div className="border border-white/10 rounded-[3rem] p-8 md:p-16 lg:p-24 relative overflow-hidden bg-background">
        {/* Decorative circles — more visible, larger */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] border border-accent/40 rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] border border-accent/40 rounded-full"></div>
        </div>

        <div ref={contentRef} className="relative z-10">
          {/* Two-column layout: heading left, form right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left column — messaging */}
            <div className="flex flex-col">
              <div className="font-data text-accent text-sm uppercase tracking-widest mb-4">07 // Let's Talk</div>
              <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">Ready to stand out online?</h2>
              <p className="font-data text-foreground/60 text-sm md:text-base leading-relaxed max-w-md">
                Stop losing clients to a poorly performing website. Tell us about your project and we'll get back to you within 24 hours.
              </p>
              <div className="hidden lg:flex flex-col gap-4 mt-12 font-data text-sm text-foreground/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Free consultation — no obligation
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Response within 24 hours
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Custom strategy for your business
                </div>
              </div>
            </div>

            {/* Right column — form */}
            <div>
              {submitted ? (
                <div className="w-full bg-accent/5 border border-accent/20 rounded-2xl p-10 md:p-12 text-center">
                  <CheckCircle size={48} className="text-accent mx-auto mb-6" />
                  <h3 className="font-heading font-bold text-2xl mb-3">Message received.</h3>
                  <p className="font-data text-foreground/60 text-sm max-w-sm mx-auto">We'll review your project details and get back to you within 24 hours with a custom strategy.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dark/30 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-accent/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-dark/30 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-accent/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                  />
                  <textarea
                    placeholder="Tell us about your project..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-dark/30 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-accent/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="magnetic-btn w-full md:w-auto md:self-end bg-accent text-background px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 cursor-pointer border-none appearance-none"
                  >
                    <span className="relative z-10">Send Message</span>
                    <ArrowRight size={20} className="relative z-10" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 9. FOOTER
const Footer = () => {
  return (
    <footer className="max-w-7xl mx-auto w-full border-t border-white/5 pt-16 pb-8 px-8 md:px-16 bg-background">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="max-w-xs">
          <img src={apexLogo} alt="Apex Digital" className="h-10 mb-4" />
          <p className="font-data text-sm text-foreground/50 mb-6">
            Growth systems engineered for precision.
          </p>
          <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-accent text-sm font-semibold hover:underline underline-offset-4 decoration-accent/50 transition-all">
            Book a Consultation →
          </a>
        </div>

        <div className="flex gap-16 md:gap-24 font-data text-sm">
          <div className="flex flex-col gap-3 text-foreground/60">
            <div className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">Navigation</div>
            <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-accent transition-colors">Services</a>
            <a href="#process" onClick={(e) => { e.preventDefault(); document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-accent transition-colors">Process</a>
            <a href="#portfolio" onClick={(e) => { e.preventDefault(); document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-accent transition-colors">Work</a>
          </div>
          <div className="flex flex-col gap-3 text-foreground/60">
            <div className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">Contact</div>
            <a href="mailto:david@apexdigital.com" className="hover:text-accent transition-colors">david@apexdigital.com</a>
            <a href="#cta" onClick={(e) => { e.preventDefault(); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-accent transition-colors">Free Consultation</a>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between font-data text-xs text-foreground/30">
        <div>&copy; {new Date().getFullYear()} Apex Digital. All rights reserved.</div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-foreground/30 hover:text-accent transition-colors duration-300 mt-4 md:mt-0 cursor-pointer bg-transparent border-none appearance-none"
        >
          Back to top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
};


// MAIN APP COMPONENT
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="w-full min-h-[100dvh]">
      <IntroOverlay />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Problem />
      <StatsBanner />
      <Services />
      <Process />
      <Portfolio />
      <Mission />
      <About />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}

export default App;
