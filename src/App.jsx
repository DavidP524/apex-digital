import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight, Layout, RefreshCw, Wrench, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis';

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
        setHoverState('');
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        toggleClass: {
          className: 'nav-scrolled',
          targets: navRef.current
        }
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 py-4 rounded-[2rem] transition-all duration-500 w-[90%] max-w-5xl text-foreground
      [&.nav-scrolled]:bg-background/80 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:border [&.nav-scrolled]:border-white/10 [&.nav-scrolled]:py-3"
    >
      <div className="font-heading font-bold text-xl tracking-tighter">Apex Digital</div>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <a href="#services" className="hover:text-accent transition-colors duration-300">Services</a>
        <a href="#process" className="hover:text-accent transition-colors duration-300">Process</a>
        <a href="#portfolio" className="hover:text-accent transition-colors duration-300">Work</a>
      </div>
      <button onClick={() => { document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="magnetic-btn bg-accent text-background px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 group cursor-pointer border-none appearance-none">
        <span className="relative z-10">Consultation</span>
      </button>
    </nav>
  );
};

// 1. HERO
const Hero = () => {
  const containerRef = useRef(null);
  const bgImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      gsap.from('.hero-elem', {
        y: '100%',
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Parallax Background
      gsap.to(bgImgRef.current, {
        yPercent: 30, // Move the image down 30% of its size while scrolling
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
    <section ref={containerRef} className="relative w-full min-h-[100dvh] flex items-center pt-32 pb-24 px-8 md:px-16 overflow-hidden bg-background">
      {/* Abstract dark texture background with scaling to allow parallax space */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <img
          ref={bgImgRef}
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=100&w=2560&auto=format&fit=crop"
          alt="Sharp architectural geometric background"
          className="relative -top-[10%] w-full h-[120%] object-cover opacity-30 mix-blend-luminosity origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col items-start gap-6 max-w-4xl w-full">
        <div className="mask-wrapper block-mask">
          <div className="hero-elem inline-block font-data text-accent uppercase tracking-widest text-sm font-semibold border border-accent/20 px-4 py-1.5 rounded-full bg-accent/5 backdrop-blur-sm">
            Precision Digital Systems
          </div>
        </div>
        <h1 className="flex flex-col text-left leading-[1.05]">
          <div className="mask-wrapper block-mask">
            <span className="hero-elem inline-block font-heading font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-foreground">
              Growth meets
            </span>
          </div>
          <div className="mask-wrapper block-mask mt-2">
            <span className="hero-elem inline-block font-drama italic text-6xl md:text-[6.5rem] lg:text-[8rem] text-accent tracking-tight pr-4">
              Precision.
            </span>
          </div>
        </h1>
        <div className="mask-wrapper block-mask mt-4">
          <p className="hero-elem inline-block text-foreground/70 font-data text-base md:text-lg max-w-xl leading-relaxed">
            We build growth systems and websites for small businesses that turn casual visitors into dedicated clients.
          </p>
        </div>
        <div className="mask-wrapper block-mask mt-8">
          <button onClick={() => { document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }} className="hero-elem magnetic-btn inline-flex bg-accent text-background px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg items-center gap-3 group cursor-pointer border-none appearance-none">
            <span className="relative z-10">Book a Free Consultation</span>
            <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
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

  useEffect(() => {
    let ctx = gsap.context(() => {
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
    <section ref={sectionRef} className="relative w-full py-40 px-8 bg-dark/20">
      <div className="max-w-4xl mx-auto">
        <div className="mask-wrapper block-mask">
          <p className="problem-text inline-block font-drama italic text-4xl md:text-6xl lg:text-7xl leading-tight text-foreground/90">
            Your current website isn't just sitting there.
          </p>
        </div>
        <div className="mask-wrapper block-mask mt-2">
          <p className="problem-text inline-block font-drama italic text-4xl md:text-6xl lg:text-7xl leading-tight text-accent">
            It's costing you customers.
          </p>
        </div>
        <div className="mask-wrapper block-mask mt-8">
          <p className="problem-text inline-block font-data text-foreground/60 max-w-2xl leading-relaxed text-sm md:text-base">
            Outdated templates, slow load times, and confusing navigation tell potential clients that your business isn't ready for them. We fix the leaks in your digital foundation.
          </p>
        </div>
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
      className="tilt-card group bg-dark/40 border border-white/5 hover:border-accent/30 rounded-[2rem] p-10 transition-colors duration-500"
    >
      <div className="tilt-content">
        <div className="w-14 h-14 rounded-full bg-background border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
          {svc.icon}
        </div>
        <h3 className="font-heading font-bold text-2xl mb-4">{svc.title}</h3>
        <p className="text-foreground/70 font-data text-sm leading-relaxed">
          {svc.desc}
        </p>
      </div>
    </div>
  );
};

// 3. SERVICES
const Services = () => {
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

  return (
    <section id="services" className="py-32 px-8 max-w-7xl mx-auto w-full" style={{ perspective: '1000px' }}>
      <SectionHeading subtitle="01 // Capabilities">Architecture for scale</SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      className="tilt-card group bg-dark/40 border border-white/5 hover:border-accent/30 rounded-[2rem] p-10 transition-colors duration-500"
    >
      <div className="tilt-content">
        <div className="font-data text-accent text-5xl opacity-40 mb-6 font-bold tracking-tighter">{step.num}</div>
        <h3 className="font-heading font-bold text-xl mb-3 text-foreground">{step.title}</h3>
        <p className="text-foreground/60 font-data text-sm leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
};

const Process = () => {
  const steps = [
    { num: "01", title: "Consultation", desc: "We map your goals and locate the current digital bottlenecks." },
    { num: "02", title: "Design", desc: "Bespoke architecture and high-contrast aesthetics are drafted." },
    { num: "03", title: "Launch", desc: "Pixel-perfect development and rigorous performance deployment." },
    { num: "04", title: "Support", desc: "Ongoing tuning and optimization to ensure long-term scale." }
  ];

  return (
    <section id="process" className="py-32 px-8 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/30 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10" style={{ perspective: '1000px' }}>
        <SectionHeading subtitle="02 // The Process">Stress-free deployment.</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ProcessCard key={i} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PortfolioItem = ({ work }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { yPercent: -10 }, // Start slightly higher
        {
          yPercent: 10,    // Move down slightly as user scrolls (total 20% travel)
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="portfolio-item group relative overflow-hidden rounded-[2rem] border border-white/5 bg-dark">
      <div className="aspect-[4/3] overflow-hidden relative">
        {/* Dark overlay to maintain Midnight Luxe aesthetic over images */}
        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
        <img
          ref={imgRef}
          src={work.image}
          alt={work.client}
          className="absolute inset-0 w-full h-[120%] object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] grayscale group-hover:grayscale-0"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none">
        <div className="font-data text-xs text-accent uppercase tracking-widest mb-2">{work.tag}</div>
        <h3 className="font-heading font-bold text-2xl">{work.client}</h3>
      </div>
    </div>
  );
};

// 5. PORTFOLIO / WORK
const Portfolio = () => {
  // Using a stark, architectural dark image as a placeholder for a mockup device/work piece
  const works = [
    {
      client: "Nura Health",
      tag: "Biotech Landing Page",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop" // code/device abstract
    },
    {
      client: "Aether Capital",
      tag: "Fintech Rebrand",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop" // dark desk/office abstract
    }
  ];

  return (
    <section id="portfolio" className="py-32 px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {works.map((work, i) => (
          <PortfolioItem key={i} work={work} />
        ))}
      </div>
    </section>
  );
};

// 6. MISSION STATEMENT
const Mission = () => {
  return (
    <section className="py-32 px-8 bg-accent text-background">
      <div className="max-w-5xl mx-auto">
        <div className="font-data text-background/60 text-sm uppercase tracking-widest mb-8">Our Mission</div>
        <p className="font-drama italic text-3xl md:text-5xl leading-tight">
          Every small business deserves a website that works as hard as they do. Not a template. Not a brochure. A precision-built system designed to turn visitors into customers.
        </p>
        <p className="font-data mt-10 text-background/70 text-sm md:text-base max-w-2xl leading-relaxed">
          We exist to close the gap between enterprise-quality web design and small business budgets. Your growth is our benchmark.
        </p>
      </div>
    </section>
  );
};

// 7. ABOUT / WHY APEX
const About = () => {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto w-full">
      <SectionHeading subtitle="04 // The Directive">Built for small business scale.</SectionHeading>
      <div className="font-data text-foreground/80 leading-loose text-base md:text-lg max-w-3xl">
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

// 8. CTA BANNER
const CTABanner = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="cta" className="py-32 px-8 w-full mt-12 mb-24 max-w-7xl mx-auto">
      <div className="bg-dark border border-white/10 rounded-[3rem] p-12 md:p-24 relative overflow-hidden group">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 border border-accent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 border border-accent rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000 delay-100"></div>
        </div>

        <div className="relative z-10 max-w-3xl flex flex-col items-start">
          <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">Ready to stand out online?</h2>
          <p className="font-data text-foreground mb-10">
            Stop losing clients to a poorly performing website. Tell us about your project and we'll get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="w-full bg-accent/10 border border-accent/30 rounded-2xl p-10 text-center">
              <CheckCircle size={48} className="text-accent mx-auto mb-4" />
              <h3 className="font-heading font-bold text-2xl mb-2">Message received.</h3>
              <p className="font-data text-foreground/70 text-sm">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-foreground/60 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-foreground/60 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <textarea
                placeholder="Tell us about your project..."
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-background/50 border border-white/10 rounded-xl px-6 py-4 font-data text-sm text-accent placeholder:text-foreground/60 focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
              <button
                type="submit"
                className="magnetic-btn self-start bg-accent text-background px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 cursor-pointer border-none appearance-none"
              >
                <span className="relative z-10">Send Message</span>
                <ArrowRight size={20} className="relative z-10" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// 9. FOOTER
const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 pt-16 pb-8 px-8 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="max-w-xs">
          <h3 className="font-heading font-bold text-2xl tracking-tight text-white mb-4">Apex.Digital</h3>
          <p className="font-data text-sm text-foreground/50 mb-6">
            Growth systems engineered for precision.
          </p>
          <a href="#cta" className="text-accent text-sm font-semibold hover:underline underline-offset-4 decoration-accent/50 transition-all">
            Book a Consultation →
          </a>
        </div>

        <div className="flex gap-16 md:gap-24 font-data text-sm">
          <div className="flex flex-col gap-3 text-foreground/60">
            <div className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">Navigation</div>
            <a href="#services" className="hover:text-accent transition-colors">Services</a>
            <a href="#process" className="hover:text-accent transition-colors">Process</a>
            <a href="#portfolio" className="hover:text-accent transition-colors">Work</a>
          </div>
          <div className="flex flex-col gap-3 text-foreground/60">
            <div className="text-white font-semibold mb-2 uppercase tracking-wide text-xs">Contact</div>
            <a href="mailto:david@apexdigital.com" className="hover:text-accent transition-colors">david@apexdigital.com</a>
            <a href="#cta" className="hover:text-accent transition-colors">Free Consultation</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between font-data text-xs text-foreground/30">
        <div>&copy; {new Date().getFullYear()} Apex Digital. All rights reserved.</div>
      </div>
    </footer>
  );
};


// MAIN APP COMPONENT
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
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
      <CustomCursor />
      <Navbar />
      <Hero />
      <Problem />
      <Services />
      <Process />
      <Portfolio />
      <Mission />
      <About />
      <CTABanner />
      <Footer />
    </div>
  );
}

export default App;
