import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Typography } from '@mui/material';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Satellite, Map, Drill, FlaskConical, Truck, Train, Ship, Warehouse, Factory,
  Leaf, Droplets, HardHat, Users, Sun, ShieldCheck, Globe2, Award, Clock,
  Building2, Hammer, Gem, Zap, FlaskRound, Landmark, ArrowUpRight, ChevronDown, Menu, X,
} from 'lucide-react';
import { gsap } from 'gsap';
import { Toaster } from 'sonner';
import Seo from '@/components/Seo';
import ContactFormModal from '@/components/contact/ContactFormModal';
import {
  SectionLabel, Heading, Rise, ParallaxImage, Counter, MagneticButton, Particles,
} from '@/components/mining/Atoms';
import { Globe, ProductShowcase, Certifications } from '@/components/mining/Interactive';
import GlobeScene from '@/components/mining/GlobeScene';
import WindScene from '@/components/mining/WindScene';
import HeroTextAnimation from '@/components/mining/HeroTextAnimation';
import GoldDustScene from '@/components/mining/GoldDustScene';
import coal_mining from '../assests/coal_mining.webp';
import mineView from '../assests/mine_view.webp';
import HeroBannerBg from '../assests/HeroBannerBg.jpg';
import machine from '../assests/machine.png';
import goldStone from '../assests/minarals.png';
import coal from '../assests/coal.webp';
import tunel from '../assests/tunel.webp';
import port from '../assests/port.webp';
import wind from '../assests/wind.webp';
import goldBar from '../assests/gold_bar.webp';
import sandCloseup from '../assests/sand_closeup.webp';
import workers from '../assests/workers.webp';
import miningSunset from '../assests/mining_sunset.webp';
import logo from "../assests/LogoWhite.png";

const IMG = {
  hero: mineView,
  heroBannerBg: HeroBannerBg,
  strata: sandCloseup,
  rig: workers,
  goldVein: tunel,
  coal: coal,
  plant: machine,
  port: port,
  green: wind,
  bars: goldBar,
  cokingCoal: coal,
  ore: goldStone,
  sunset: miningSunset,
};

/* ===================================================================== */
/* 🎚️  PARALLAX + SCROLL EFFECTS — CENTRAL CONTROL PANEL                   */
/*                                                                         */
/*  HOW TO USE: Just change the NUMBER VALUES below and save.               */
/*  Higher number = STRONGER effect.                                       */
/*  All sections update AUTOMATICALLY from this one place.                 */
/* ===================================================================== */

const PARALLAX = {

  /* ── GLOBAL MASTER CONTROLS (affects ALL sections at once) ───────────── */

  GLOBAL_SCROLL_DRIFT_MULTIPLIER: 1.5,
  /* ↑↑↑ How far images slide UP/DOWN while you scroll.
     1.0 = normal (original default) |  1.5 = 50% stronger  |  2.0 = twice as far  |  0.5 = half as far  */

  GLOBAL_SCROLL_ZOOM_MULTIPLIER: 1.5,
  /* ↑↑↑ How much images GROW (zoom in) while you scroll through the section.
     1.0 = normal (original default) |  1.5 = 50% more zoom  |  2.0 = twice as much zoom  |  0 = no zoom at all  */

  GLOBAL_DEFAULT_IMAGE_ZOOM_PERCENT: 118,
  /* ↑↑↑ How zoomed-IN images are BY DEFAULT (when section first enters view).
     118 = 118% of screen (standard)  |  130 = more zoomed in  |  110 = more zoomed out  */

  GLOBAL_DEFAULT_IMAGE_SHIFT_UP_PERCENT: 9,
  /* ↑↑↑ How much the default-zoomed image is shifted UP (to keep it centered).
     Keep this about HALF of GLOBAL_DEFAULT_IMAGE_ZOOM_PERCENT minus 50.
     Example: 118 zoom → shift = 9  (good)  */

  /* ── PER-SECTION OVERRIDES (leave as 1.0 to use global, or customize) ── */

  SECTION_HERO: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_01_OPERATIONS_JOURNEY: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_02_EXPLORATION: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_03_GOLD_MINING: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_04_COAL_MINING: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_05_MINERAL_PROCESSING: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_06_GLOBAL_TRADING: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_07_LOGISTICS: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_08_SUSTAINABILITY: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_13_CERTIFICATIONS_AND_14_GLOBAL_PRESENCE: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },

  SECTION_FINALE_CONTACT: {
    scrollDriftMultiplier: 1.0,
    scrollZoomMultiplier: 1.0,
  },
};

/* ===================================================================== */
/*  END OF PARALLAX CONTROL PANEL — everything below uses the values above   */
/* ===================================================================== */

/*
 * 🛠️  Helper: Calculate the FINAL parallax settings for any section.
 *     It combines GLOBAL multipliers × PER-SECTION multipliers × base defaults.
 *     (You don't need to touch this — it's the "engine" for the control panel above.)
 */
function _getParallax(sectionCfg, baseStrength = 90, baseScaleTo = 1.12) {
  const drift = baseStrength
    * PARALLAX.GLOBAL_SCROLL_DRIFT_MULTIPLIER
    * (sectionCfg?.scrollDriftMultiplier ?? 1.0);
  const zoom = 1
    + (baseScaleTo - 1)
    * PARALLAX.GLOBAL_SCROLL_ZOOM_MULTIPLIER
    * (sectionCfg?.scrollZoomMultiplier ?? 1.0);
  return {
    strength: drift,
    scaleTo: zoom,
    defaultZoomPct: PARALLAX.GLOBAL_DEFAULT_IMAGE_ZOOM_PERCENT,
    defaultShiftUpPct: PARALLAX.GLOBAL_DEFAULT_IMAGE_SHIFT_UP_PERCENT,
  };
}

const NAV = [
  ['Operations', '#operations'],
  ['Trading', '#trading'],
  ['Sustainability', '#sustainability'],
  ['Products', '#products'],
  ['Presence', '#presence'],
];

/* ============================ HEADER ============================ */
function Header({ openContactModal }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV.map(([, href]) => href.replace('#', ''));
    sectionIds.push('contact');

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (href) => activeSection === href.replace('#', '');

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'bg-[#0D0D0D]/85 backdrop-blur-xl border-b border-white/[0.06]' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-14 sm:h-16 md:h-20 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="#top" className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="
  font-display
  text-[15px]
  sm:text-[18px]
  md:text-[30px]
  lg:text-[35px]
  tracking-[0.12em]
  sm:tracking-[0.16em]
  md:tracking-[0.20em]
  text-white
">
            Kubera
          </span>
          <span className="
  font-mono2
  text-[6px]
  sm:text-[10px]
  md:text-[12px]
  lg:text-[13px]
  tracking-[0.15em]
  sm:tracking-[0.22em]
  md:tracking-[0.3em]
  text-[#D4AF37]
">
            RESOURCES
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:gap-8 lg:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className={`group relative font-mono2 text-[10px] md:text-[11px] uppercase tracking-[0.22em] transition-colors ${isActive(href) ? 'text-white' : 'text-white/60 hover:text-white'}`}>
              {label}
              <span className={`absolute -bottom-1.5 left-0 h-px bg-[#D4AF37] transition-all duration-300 ${isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <MagneticButton variant="ghost" onClick={() => openContactModal?.('Partner With Us')}>Partner With Us</MagneticButton>
        </div>
        <button className="lg:hidden text-white p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#0D0D0D]/97 px-4 sm:px-6 pb-6 sm:pb-8 pt-3 sm:pt-4 lg:hidden">
          {NAV.concat([['Contact', '#contact']]).map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className={`block border-b border-white/[0.06] py-3.5 sm:py-4 font-mono2 text-[11px] sm:text-xs uppercase tracking-[0.25em] transition-colors ${isActive(href) ? 'text-[#D4AF37]' : 'text-white/70'}`}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ============================ HERO ============================ */
function Hero({ openContactModal }) {
  const ref = useRef(null);
  const heroBgLayerRef = useRef(null);
  const reduce = false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* Mouse parallax state — lerped normalized ±1 position */
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, active: false });
  const [, forceTick] = useState(0);

  useEffect(() => {
    let rafId;
    function tick() {
      const m = mouseRef.current;
      let changed = false;
      const dx = m.tx - m.cx;
      const dy = m.ty - m.cy;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        m.cx += dx * 0.1;
        m.cy += dy * 0.1;
        changed = true;
      }
      if (!m.active) {
        const dx2 = 0 - m.cx;
        const dy2 = 0 - m.cy;
        if (Math.abs(dx2) > 0.001 || Math.abs(dy2) > 0.001) {
          m.cx += dx2 * 0.05;
          m.cy += dy2 * 0.05;
          changed = true;
        }
      }
      if (changed) forceTick((t) => (t + 1) % 1000000);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const m = mouseRef.current;
    m.tx = nx;
    m.ty = ny;
    m.active = true;
  }
  function handleEnter() { mouseRef.current.active = true; }
  function handleLeave() { mouseRef.current.active = false; }

  const m = mouseRef.current;
  /* Depth-layered strengths (px) — smaller = closer to viewer = less movement */
  const TAGLINE_X = m.cx * 10;
  const TAGLINE_Y = m.cy * 8;
  const HEADING_X = m.cx * 24;
  const HEADING_Y = m.cy * 18;
  const SUB_X = m.cx * 16;
  const SUB_Y = m.cy * 12;
  const BTN_X = m.cx * 30;
  const BTN_Y = m.cy * 22;

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100dvh] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ willChange: 'transform' }}
    >
      {/* Parallax bg image — same treatment as Section 8 */}
      <div ref={heroBgLayerRef} className="hero-bg-layer">
        <ParallaxImage
          src={IMG.heroBannerBg}
          alt="Aerial dusk view of a mining processing plant with lit conveyors and haul roads"
          {..._getParallax(PARALLAX.SECTION_HERO, 80, 1.12)}
          overlay="bg-gradient-to-b from-[#0D0D0D]/80 via-[#0D0D0D]/20 to-[#0D0D0D]"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(184,115,51,0.22),transparent_60%)]" />

      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="hero-content-layer relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-end px-6 pb-24 pt-32 lg:px-10 lg:pb-28"
      >
        <Rise>
          <div style={{ transform: `translate3d(${TAGLINE_X}px, ${TAGLINE_Y}px, 0)`, willChange: 'transform' }}>
            <p className="font-mono2 text-[10px] uppercase tracking-[0.4em] text-[#fffff  ]">Est. 1994 — Operating across 18 countries</p>
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div style={{ transform: `translate3d(${HEADING_X}px, ${HEADING_Y}px, 0)`, willChange: 'transform' }}>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.6rem,7.4vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
              From the Earth&apos;s Riches to <span className="gold-text">Global Markets</span>
            </h1>
          </div>
        </Rise>
        <Rise delay={0.2}>
          <div style={{ transform: `translate3d(${SUB_X}px, ${SUB_Y}px, 0)`, willChange: 'transform' }}>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/60">
              Responsible Mining <span className="text-[#B87333]">•</span> Sustainable Growth <span className="text-[#B87333]">•</span> Global Commodity Trading
            </p>
          </div>
        </Rise>
        <Rise delay={0.3}>
          <div
            className="mt-11 flex flex-wrap items-center gap-4"
            style={{ transform: `translate3d(${BTN_X}px, ${BTN_Y}px, 0)`, willChange: 'transform' }}
          >
            <MagneticButton onClick={() => { window.location.hash = '#operations'; }}>Explore Operations</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => openContactModal?.('Partner With Us')}>Partner With Us</MagneticButton>
          </div>
        </Rise>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-white/35">
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.2} />
      </div>
    </section>
  );
}

/* ============================ SCENE 1 — STRATA ============================ */
const LAYERS = [
  {
    name: 'Top Soil',
    depth: '0 – 4 m',
    note: 'Stripped, catalogued and stored for post-closure rehabilitation.',
    color: '#5C3820',          // warm brown
    accent: '#B87333',
  },
  {
    name: 'Rock Formation',
    depth: '4 – 60 m',
    note: 'Overburden benched in 10 m lifts with controlled blasting.',
    color: '#2A2A2A',          // dark grey
    accent: '#888888',
  },
  {
    name: 'Mineral Deposits',
    depth: '60 – 180 m',
    note: 'Polymetallic zones assayed every 1.5 m of drill core.',
    color: '#1A1A2E',          // deep blue-grey
    accent: '#6688AA',
  },
  {
    name: 'Gold Veins',
    depth: '180 – 410 m',
    note: 'Quartz-hosted reefs averaging 4.2 g/t across strike.',
    color: '#1A1000',          // near-black with gold tint
    accent: '#D4AF37',
  },
  {
    name: 'Coal Seams',
    depth: '410 – 620 m',
    note: 'Low-ash bituminous seams, 6,300 kcal/kg gross calorific value.',
    color: '#080808',          // pitch black
    accent: '#444444',
  },
];

/* Depth counter — reads a MotionValue and displays it as formatted text */
function DepthCounter({ depthNum }) {
  const [display, setDisplay] = useState('0 m');
  useEffect(() => {
    const unsub = depthNum.onChange((v) => setDisplay(`${Math.round(v)} m`));
    return unsub;
  }, [depthNum]);
  return (
    <span className="font-mono2 text-[11px] text-[#D4AF37] tabular-nums">{display}</span>
  );
}

/*
 * Layer depth values (metres):
 *   Top Soil        0  –   4
 *   Rock Formation  4  –  60
 *   Mineral Dep.   60  – 180
 *   Gold Veins    180  – 410
 *   Coal Seams    410  – 620
 * Total range: 620 m
 * Each layer's tick position = its START depth / 620
 */
const TOTAL_DEPTH = 620;
const RULER_TICKS = [
  { depth: 0, label: '0 m' },
  { depth: 4, label: '4 m' },
  { depth: 60, label: '60 m' },
  { depth: 180, label: '180 m' },
  { depth: 410, label: '410 m' },
  { depth: 620, label: '620 m' },
];

function SceneStrata() {
  const sectionRef = useRef(null);
  const layerListRef = useRef(null);
  const reduce = false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /* Active layer index — matches actual depth boundaries (m):
   *   Top Soil:       0 –   4
   *   Rock Formation:  4 –  60
   *   Mineral Dep.:   60 – 180
   *   Gold Veins:    180 – 410
   *   Coal Seams:    410 – 620
   */
  const LAYER_STARTS = [0, 4, 60, 180, 410];
  const [activeLayer, setActiveLayer] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.onChange((v) => {
      const depth = v * TOTAL_DEPTH;
      let idx = 0;
      for (let i = LAYER_STARTS.length - 1; i >= 0; i--) {
        if (depth >= LAYER_STARTS[i]) { idx = i; break; }
      }
      setActiveLayer(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  /*
   * Ruler indicator:
   * Maps scroll 0→1 to depth 0→620 m.
   * Then maps depth to a percentage of the ruler track height
   * using proportional positioning (not equal spacing).
   * rulerPct = depth / 620  →  0% to 100% of the ruler track.
   */
  const depthNum = useTransform(scrollYProgress, [0, 1], [0, TOTAL_DEPTH]);
  const rulerPct = useTransform(depthNum, (d) => `${(d / TOTAL_DEPTH) * 100}%`);

  return (
    <section
      ref={sectionRef}
      id="operations"
      style={{ height: '600vh' }}
      className="relative"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-[#0D0D0D] to-transparent" />
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background */}
        <ParallaxImage
          src={IMG.strata}
          alt="Geological strata"
          {..._getParallax(PARALLAX.SECTION_01_OPERATIONS_JOURNEY, 40, 1.12)}
          overlay="bg-[#0D0D0D]/80"
        />

        {/* Layer tint */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ backgroundColor: LAYERS[activeLayer].color + '44' }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#0D0D0D] to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D]" />

        {/* ── Main content ── */}
        <div className="relative flex h-full flex-col justify-center max-w-[90rem] mx-auto px-6 lg:px-10">

          {/* Heading */}
          <div className="mb-8">
            <SectionLabel index="01">Journey Beneath the Earth</SectionLabel>
            <Heading>Six hundred metres<br />of measured descent.</Heading>
          </div>

          {/*
           * Layer list + ruler side by side.
           * Ruler is a narrow column (w-14) placed IMMEDIATELY to the left
           * of the layer rows, not at the screen edge.
           */}
          <div className="flex items-stretch gap-0 border-t border-white/[0.08]">

            {/* ── Depth ruler — sits right next to the layer list ── */}
            <div
              ref={layerListRef}
              className="block relative flex-shrink-0"
              style={{ width: '3.25rem' }}
            >
              {/* Track line */}
              <div className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: '1.625rem' }} />

              {/* Gold fill — grows proportionally with depth */}
              <motion.div
                className="absolute w-px origin-top"
                style={{
                  left: '1.625rem',
                  top: 0,
                  height: rulerPct,
                  background: 'linear-gradient(to bottom, #D4AF3766, #D4AF37)',
                }}
              />

              {/* Proportional tick marks — spaced by actual metre values */}
              {RULER_TICKS.map(({ depth, label }) => {
                const pct = (depth / TOTAL_DEPTH) * 100;
                return (
                  <div
                    key={label}
                    className="absolute flex items-center"
                    style={{ top: `${pct}%`, left: '1.25rem' }}
                  >
                    {/* tick line */}
                    <div className="w-1.5 h-px bg-white/25" />
                    {/* label */}
                    <span className="ml-1 font-mono2 text-[7px] sm:text-[8px] tracking-[0.1em] text-white/35 whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                );
              })}

              {/* Gold travelling indicator dot */}
              <motion.div
                className="absolute flex flex-col items-center"
                style={{ left: '1.15rem', top: rulerPct, transform: 'translateY(-50%)' }}
              >
                {/* dot */}
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full z-10"
                  style={{
                    background: '#D4AF37',
                    boxShadow: '0 0 0 3px rgba(212,175,55,0.2), 0 0 12px rgba(212,175,55,0.7)',
                  }}
                />
                {/* depth badge — below dot, not overlapping content */}
                <div className="mt-1 rounded-sm border border-[#D4AF37]/40 bg-[#0D0D0D]/90 px-1.5 py-0.5 whitespace-nowrap">
                  <DepthCounter depthNum={depthNum} />
                </div>
              </motion.div>
            </div>

            {/* ── Layer rows ── */}
            <div className="flex-1 pl-3 sm:pl-4 md:pl-6">
              {LAYERS.map((l, i) => {
                const isActive = i === activeLayer;
                const isPast = i < activeLayer;
                return (
                  <motion.div
                    key={l.name}
                    animate={{
                      opacity: isPast ? 0.38 : isActive ? 1 : 0.18,
                      y: isActive ? 0 : isPast ? 0 : 6,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative grid gap-3 border-b border-white/[0.06] py-6
                               md:grid-cols-[9rem_14rem_1fr] md:items-baseline"
                  >
                    {/* Active accent bar on left edge of row */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute -left-1 top-0 bottom-0 w-0.5 rounded-full"
                        style={{ background: l.accent }}
                      />
                    )}

                    {/* Depth range */}
                    <span
                      className="font-mono2 text-[11px] tracking-[0.22em]"
                      style={{ color: isActive ? l.accent : '#ffffff33' }}
                    >
                      {l.depth}
                    </span>

                    {/* Layer name */}
                    <span
                      className="font-display text-2xl"
                      style={{ color: isActive ? '#ffffff' : '#ffffff44' }}
                    >
                      {l.name}
                    </span>

                    {/* Note */}
                    <span className="text-sm leading-relaxed text-white/38">
                      {l.note}
                    </span>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 2 — EXPLORATION ============================ */
const EXPLORE = [
  { icon: Satellite, title: 'Satellite Survey', body: 'Multispectral and hyperspectral passes narrow 40,000 km² of tenement into ranked anomalies.', stat: '40,000 km² screened' },
  { icon: Map, title: 'Geological Mapping', body: 'Field teams and airborne magnetics build 3D structural models of every prospect.', stat: '3D structural models' },
  { icon: Drill, title: 'Core Drilling', body: 'Diamond and RC rigs run continuous programmes with 98.4% core recovery.', stat: '412 km drilled' },
  { icon: FlaskConical, title: 'Resource Analysis', body: 'JORC-compliant estimation, independently audited before any capital commitment.', stat: 'JORC 2012 compliant' },
];

function SceneExploration() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduce = false;
  const Active = EXPLORE[active].icon;

  /* ---------- Scroll-driven parallax & reveal progress ---------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const entryProgress = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const explorationParallax = _getParallax(PARALLAX.SECTION_02_EXPLORATION, 60, 1.18);
  const bgY = useTransform(scrollYProgress, [0, 1], [explorationParallax.strength, -explorationParallax.strength]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, explorationParallax.scaleTo]);

  /* ---------- Mouse parallax state (lerped) ---------- */
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let rafId;
    function tick() {
      const m = mouseRef.current;
      let changed = false;
      const dx = m.tx - m.cx;
      const dy = m.ty - m.cy;
      if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
        m.cx += dx * 0.07;
        m.cy += dy * 0.07;
        changed = true;
      }
      if (changed) forceTick((t) => (t + 1) % 1000000);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce]);

  function handleMouseMove(e) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.tx = nx;
    mouseRef.current.ty = ny;
  }
  const m = mouseRef.current;

  /* Heading split into words for stagger mask reveal */
  const HEADING_WORDS = ['We', 'know', 'the', 'ground', 'before', 'we', 'break', 'it.'];
  const HEADING_LINES = [
    ['We', 'know', 'the', 'ground'],
    ['before', 'we', 'break', 'it.'],
  ];

  return (
    <section
      id="exploration"
      ref={sectionRef}
      className="relative overflow-hidden py-32 lg:py-44"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform' }}
    >
      {/* ──────── Enhanced parallax background with stronger depth ──────── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={IMG.rig}
          alt="Core drilling rig at dusk"
          loading="lazy"
          style={reduce ? undefined : {
            y: bgY,
            scale: bgScale,
            opacity: 0.9,
            height: `${explorationParallax.defaultZoomPct}%`,
            width: '106%',
            transform: `translateY(-${explorationParallax.defaultShiftUpPct}%) translateX(-3%)`,
            objectFit: 'cover',
          }}
          className="absolute inset-0"
        />
        {/* Multi-stop gradient overlay for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/70 via-[#0D0D0D]/55 to-[#0D0D0D]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]" />
        {/* Radial warm vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 82% 50%, rgba(184,115,51,0.18), transparent 62%)' }} />
        {/* Cool counter-vignette on the left */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 70% at 10% 40%, rgba(20,30,50,0.28), transparent 60%)' }} />
      </div>

      {/* ──────── Decorative accent lines (reveal on scroll entry) ──────── */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), rgba(184,115,51,0.1), transparent)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-px origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.28), transparent)',
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ──────── Ambient gold particle drift ──────── */}
      <Particles count={22} tone="#D4AF37" />

      {/* ──────── Main content ──────── */}
      <div
        className="relative mx-auto grid max-w-[90rem] gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10"
        style={{ willChange: 'transform' }}
      >
        {/* ════════ LEFT COLUMN ════════ */}
        <div
          className="relative"
          style={reduce ? undefined : {
            transform: `translate3d(${m.cx * -14}px, ${m.cy * -10}px, 0)`,
            willChange: 'transform',
          }}
        >
          {/* ── Section Label with animated gold line sweep ── */}
          <motion.div
            className="mb-6 flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-14% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              02
            </motion.span>
            <span className="relative h-px w-10 overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-[#D4AF37]/40 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.span
                className="absolute inset-0 origin-left"
                style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <motion.span
              className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50"
              initial={{ opacity: 0, letterSpacing: '0.55em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              Exploration
            </motion.span>
          </motion.div>

          {/* ── Heading: GOLD GLOW SWEEP-REVEAL using MUI ── */}
          <HeroTextAnimation reduce={reduce} />

          {/* ── Sub-paragraph with soft clip-reveal (single driver + nested inherit, NO nested whileInView) ── */}
          <div className="mt-7 max-w-md overflow-hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.95, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] leading-relaxed text-white/50"
              style={reduce ? undefined : {
                transform: `translate3d(${m.cx * -6}px, ${m.cy * -4}px, 0)`,
                willChange: 'transform',
              }}
            >
              <motion.p
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={undefined}
                transition={{ duration: 1.1, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, margin: '-10% 0px' }}
              >
                Four disciplines, sequenced. Nothing enters development until the orebody has been modelled, drilled and independently verified.
              </motion.p>
            </motion.div>
          </div>

          {/* ── Tab Buttons: staggered reveal from offset left ── */}
          <div className="mt-10 flex flex-wrap gap-2">
            {EXPLORE.map((e, i) => (
              <motion.button
                key={e.title}
                onClick={() => setActive(i)}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: -26, rotateX: -12, filter: 'blur(4px)' }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, rotateX: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{
                  duration: 0.75,
                  delay: 0.72 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className={`relative overflow-hidden rounded-sm border px-4 py-2.5 font-mono2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${i === active
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-white/12 text-white/45 hover:border-white/30 hover:text-white/80'
                  }`}
                style={{ transformPerspective: 600, willChange: 'transform, opacity' }}
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 origin-left"
                  style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.18), transparent 65%)' }}
                  animate={{
                    x: i === active ? '0%' : '-105%',
                    opacity: i === active ? 1 : 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                />
                <span className="relative">{e.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ════════ RIGHT COLUMN — Glass Card ════════ */}
        <motion.div
          className="relative"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.94, rotateX: 6, filter: 'blur(10px)' }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{
            duration: 1.1,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={reduce ? undefined : {
            transform: `translate3d(${m.cx * 18}px, ${m.cy * 14}px, 0) perspective(1200px) rotateX(${m.cy * -2}deg) rotateY(${m.cx * 2.5}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Glow halo behind the card that pulses with active state */}
          <motion.div
            className="pointer-events-none absolute -inset-6 -z-10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(212,175,55,0.22), transparent 70%)',
              filter: 'blur(24px)',
            }}
          />

          <motion.div
            key={active}
            initial={reduce ? { opacity: 0 } : {
              opacity: 0,
              y: 22,
              scale: 0.985,
              rotateZ: 0.3,
            }}
            animate={reduce ? { opacity: 1 } : {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateZ: 0,
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="glass relative rounded-sm p-10 overflow-hidden"
          >
            {/* Top hairline with sweep-in */}
            <motion.div
              className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
              style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.25), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Icon with 360° spin on change + gold pulse ring */}
            <div className="relative inline-flex">
              <motion.div
                key={`icon-${active}`}
                initial={{ rotateZ: -90, scale: 0.4, opacity: 0 }}
                animate={{ rotateZ: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Active className="h-7 w-7 text-[#D4AF37]" strokeWidth={1.2} />
                <motion.div
                  className="pointer-events-none absolute -inset-3 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(212,175,55,0.0)',
                      '0 0 0 8px rgba(212,175,55,0.12)',
                      '0 0 0 0 rgba(212,175,55,0.0)',
                    ],
                  }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                />
              </motion.div>
            </div>

            {/* Title with letter stagger (variants + staggerChildren, synced with mask-wipe) */}
            <div className="mt-6 overflow-hidden">
              <motion.div
                key={`title-${active}`}
                variants={reduce ? undefined : {
                  hidden: { y: '110%' },
                  visible: {
                    y: '0%',
                    transition: {
                      duration: 0.75,
                      delay: 0.08,
                      ease: [0.76, 0, 0.24, 1],
                      staggerChildren: 0.018,
                      delayChildren: 0.02,
                    },
                  },
                }}
                initial={reduce ? undefined : 'hidden'}
                animate={reduce ? undefined : 'visible'}
              >
                <h3 className="font-display text-3xl text-white">
                  {EXPLORE[active].title.split('').map((ch, ci) => (
                    <motion.span
                      key={ci}
                      variants={reduce ? undefined : {
                        hidden: { opacity: 0, y: 12 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                      }}
                      className="inline-block"
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </motion.span>
                  ))}
                </h3>
              </motion.div>
            </div>

            {/* Body with soft fade + clip reveal */}
            <motion.p
              key={`body-${active}`}
              initial={{ opacity: 0, y: 14, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              transition={{
                duration: 0.75,
                delay: 0.22,
                ease: [0.16, 1, 0.3, 1],
                clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
              }}
              className="mt-4 leading-relaxed text-white/55"
            >
              {EXPLORE[active].body}
            </motion.p>

            {/* Stat divider with draw-in border + stat label stagger */}
            <div className="mt-8 relative">
              <motion.div
                className="h-px w-full origin-left"
                style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.14), rgba(212,175,55,0.28), transparent)' }}
                key={`divider-${active}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.85, delay: 0.32, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.p
                key={`stat-${active}`}
                initial={{ opacity: 0, x: -14, letterSpacing: '0.45em' }}
                animate={{ opacity: 1, x: 0, letterSpacing: '0.25em' }}
                transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="pt-5 font-mono2 text-[11px] uppercase tracking-[0.25em] text-[#B87333]"
              >
                {EXPLORE[active].stat}
              </motion.p>
            </div>

            {/* Bottom-right corner gold tick */}
            <motion.div
              className="pointer-events-none absolute right-0 bottom-0"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="h-4 w-px bg-[#D4AF37]/60 absolute right-0 bottom-0" />
              <div className="h-px w-4 bg-[#D4AF37]/60 absolute right-0 bottom-0" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================ SCENE 3 — GOLD ============================ */

function GoldSweepText() {
  return (
    <div className="relative mx-auto mt-8 max-w-4xl">

      {/* Ambient soft glow behind the whole headline */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(ellipse 80% 120% at 50% 50%, #D4AF37 0%, transparent 70%)',
        }}
      />

      {/* The actual headline — structure kept exactly as original */}
      <h2 className="font-display text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[1] tracking-[-0.025em]">
        <span className="gold-text gold-sweep-text">Light finds it</span>
        {' '}
        <span className="text-white gold-sweep-text">before we do.</span>
      </h2>

      {/* Circular travelling spotlight — pure overlay, no layout effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[26%]"
        style={{ mixBlendMode: 'normal' }}
      >
        <div className="gold-beam-spot" />
        <div className="gold-beam-soft" />
      </div>

      <style>{`
        /* Spotlight circle travelling left to right */
        .gold-beam-spot {
          position : absolute;
          top      : 50%;
          width    : 340px;
          height   : 340px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 248, 180, 0.48) 0%,
            rgba(212, 175,  55, 0.30) 24%,
            rgba(184, 115,  51, 0.12) 58%,
            transparent 88%
          );
          filter   : blur(24px);
          animation: goldSpotMove 5.5s cubic-bezier(0.42, 0.02, 0.28, 1) infinite;
          will-change: left, opacity;
        }

        .gold-beam-soft {
          position : absolute;
          top      : 50%;
          width    : 560px;
          height   : 420px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(212, 175, 55, 0.20) 0%,
            rgba(212, 175, 55, 0.10) 36%,
            transparent 84%
          );
          filter   : blur(34px);
          animation: goldSpotMove 5.8s cubic-bezier(0.42, 0.02, 0.28, 1) infinite;
          will-change: left, opacity;
        }

        @keyframes goldSpotMove {
          0%   { left: -3%;  opacity: 0; }
          10%  { opacity: 0.38; }
          24%  { opacity: 0.70; }
          60%  { left: 106%; opacity: 0.66; }
          78%  { opacity: 0.16; }
          100% { left: 116%; opacity: 0; }
        }

        /* Text shimmer — word-by-word brighten as spot passes */
        .gold-sweep-text {
          display          : inline;
          position         : relative;
          background-size  : 200% 100%;
          animation        : goldTextShimmer 5s cubic-bezier(0.45, 0, 0.35, 1) infinite;
        }

        @keyframes goldTextShimmer {
          0%   { filter: brightness(1); }
          15%  { filter: brightness(1.8) drop-shadow(0 0 8px #D4AF37); }
          55%  { filter: brightness(1.6) drop-shadow(0 0 6px #B87333); }
          70%  { filter: brightness(1); }
          100% { filter: brightness(1); }
        }
      `}</style>
    </div>
  );
}

function SceneGold() {
  return (
    <section id="gold-mining" className="relative overflow-hidden py-32 lg:py-48">
      <ParallaxImage
        src={IMG.goldVein}
        alt="Illuminated gold vein underground"
        {..._getParallax(PARALLAX.SECTION_03_GOLD_MINING, 100, 1.12)}
        overlay="bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/70 to-[#0D0D0D]"
      />
      <Particles count={34} />
      <div className="relative mx-auto max-w-[72rem] px-6 text-center lg:px-10">
        <Rise>
          <p className="font-mono2 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">03 — Gold Mining</p>
          <GoldSweepText />
        </Rise>
        <Rise delay={0.15}>
          <div className="mt-16 grid gap-px overflow-hidden rounded-sm bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Gold Ore', 'Free-milling oxide & sulphide'],
              ['Ore Grade', '4.2 g/t average reserve'],
              ['Mining Capacity', '12.4 Mtpa run-of-mine'],
              ['Processing', 'CIL + gravity recovery, 94.6%'],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#111111]/90 p-8 text-left">
                <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-white/35">{k}</p>
                <p className="mt-3 font-display text-xl text-white">{v}</p>
              </div>
            ))}
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* ============================ SCENE 4 — COAL ============================ */

/* Wraps one stat column — observes viewport entry to intensify gold dust */
function StatColumn({ v, s, l }) {
  const ref = useRef(null);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHit(true); },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="font-display text-[clamp(2.6rem,5vw,4rem)] leading-none text-white">
        <Counter value={v} decimals={v % 1 ? 1 : 0} suffix={s} />
      </p>
      <p className="mt-3 font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#B87333]">{l}</p>
      <GoldDustScene active={hit} />
    </div>
  );
}

function SceneCoal() {
  return (
    <section id="coal-mining" className="relative overflow-hidden py-20 lg:py-34">
      <ParallaxImage
        src={IMG.coal}
        alt="Open-cut coal mine with haul trucks"
        {..._getParallax(PARALLAX.SECTION_04_COAL_MINING, 90, 1.12)}
        overlay="bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/78 to-[#0D0D0D]/90"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0D0D0D] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="04">Coal Mining</SectionLabel>
          <div className="flex flex-col">
            <Heading>Scale, moved<br />one bench at a time.</Heading>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/50">
              Continuous truck-and-shovel operations across four open-cut pits, feeding washeries and rail load-out around the clock under a single integrated control room.
            </p>
          </div>
        </Rise>
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/[0.08] pt-12 sm:gap-x-12 sm:gap-y-12 lg:grid-cols-4">
          {[
            { v: 18.6, s: ' Mt', l: 'Annual Production' },
            { v: 24, s: ' Mtpa', l: 'Mining Capacity' },
            { v: 11, s: '', l: 'Operating Mines' },
            { v: 99, s: '%', l: 'Safety Compliance' },
          ].map((m) => (
            <StatColumn key={m.l} v={m.v} s={m.s} l={m.l} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 5 — PROCESSING ============================ */
const PIPELINE = ['Ore Extraction', 'Crushing', 'Grinding', 'Separation', 'Refining', 'Quality Testing', 'Storage', 'Transportation'];

function SceneProcessing() {
  return (
    <section id="processing" className="relative overflow-hidden py-32 lg:py-44">
      <ParallaxImage src={IMG.plant} alt="Mineral processing facility interior" {..._getParallax(PARALLAX.SECTION_05_MINERAL_PROCESSING, 70, 1.12)} overlay="bg-[#0D0D0D]/60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0D0D0D] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="05">Mineral Processing</SectionLabel>
          <Heading className="max-w-3xl">Eight stages between rock and market.</Heading>
        </Rise>
      </div>
      <div className="relative mx-auto mt-16 max-w-[90rem] overflow-hidden px-6 lg:px-10">
        <div className="py-4">
          <div className="flex w-max animate-marquee gap-4">
            {[...PIPELINE, ...PIPELINE].map((s, i) => (
              <span key={`${s}-${i}`} className="flex items-center gap-4 whitespace-nowrap rounded-sm border border-[#D4AF37]/15 bg-[#141414]/70 px-7 py-4 font-mono2 text-[11px] uppercase tracking-[0.24em] text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />{s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto mt-16 grid max-w-[72rem] gap-px overflow-hidden rounded-sm bg-white/[0.07] px-0 sm:grid-cols-3">
        {[
          ['Throughput', '3,200 t/h'],
          ['Recovery rate', '94.6%'],
          ['Assay turnaround', 'Under 6 hours'],
        ].map(([k, v]) => (
          <div key={k} className="bg-[#111111]/90 p-8">
            <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-white/35">{k}</p>
            <p className="mt-3 font-display text-2xl text-[#D4AF37]">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ SCENE 6 & 7 — TRADING + LOGISTICS ============================ */
const CHAIN = [
  { icon: Hammer, label: 'Mine' }, { icon: Train, label: 'Railway' }, { icon: Warehouse, label: 'Warehouse' },
  { icon: Building2, label: 'Port' }, { icon: Ship, label: 'Cargo Ship' }, { icon: Globe2, label: 'Global Customer' },
];

function SceneTrading() {
  const sectionRef = useRef(null);
  const reduce = false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const entryProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const exitProgress = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const tradingParallax = _getParallax(PARALLAX.SECTION_06_GLOBAL_TRADING, 50, 1.16);
  const bgY = useTransform(scrollYProgress, [0, 1], [tradingParallax.strength, -tradingParallax.strength]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, tradingParallax.scaleTo]);

  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let rafId;
    function tick() {
      const m = mouseRef.current;
      let changed = false;
      const dx = m.tx - m.cx;
      const dy = m.ty - m.cy;
      if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
        m.cx += dx * 0.07;
        m.cy += dy * 0.07;
        changed = true;
      }
      if (changed) forceTick((t) => (t + 1) % 1000000);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce]);

  function handleMouseMove(e) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.tx = nx;
    mouseRef.current.ty = ny;
  }
  const m = mouseRef.current;

  return (
    <section
      ref={sectionRef}
      id="trading"
      className="relative overflow-hidden py-32 lg:py-44"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={IMG.port}
          alt="Bulk commodity port operations"
          loading="lazy"
          style={reduce ? undefined : {
            y: bgY,
            scale: bgScale,
            opacity: 0.2,
            height: `${tradingParallax.defaultZoomPct}%`,
            width: '106%',
            transform: `translateY(-${tradingParallax.defaultShiftUpPct}%) translateX(-3%)`,
            objectFit: 'cover',
          }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/88 to-[#0D0D0D]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/50 via-transparent to-[#0D0D0D]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 70% 20%, rgba(212,175,55,0.14), transparent 62%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 70% at 15% 80%, rgba(20,40,60,0.25), transparent 60%)' }} />
      </div>

      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), rgba(184,115,51,0.1), transparent)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-px origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.28), transparent)',
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
      />

      <Particles count={24} tone="#D4AF37" />

      <div className="relative mx-auto grid max-w-[90rem] gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10"
        style={{ willChange: 'transform' }}>
        <div
          className="relative"
          style={reduce ? undefined : {
            transform: `translate3d(${m.cx * -14}px, ${m.cy * -10}px, 0)`,
            willChange: 'transform',
          }}
        >
          <motion.div
            className="mb-6 flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-14% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              06
            </motion.span>
            <span className="relative h-px w-10 overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-[#D4AF37]/40 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.span
                className="absolute inset-0 origin-left"
                style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <motion.span
              className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50"
              initial={{ opacity: 0, letterSpacing: '0.55em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              Global Trading
            </motion.span>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-14% 0px' }}
            transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroTextAnimation reduce={reduce} textLines={["Eighteen countries,", "one desk."]} />
          </motion.div>

          <div className="mt-7 max-w-md overflow-hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.95, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] leading-relaxed text-white/50"
              style={reduce ? undefined : {
                transform: `translate3d(${m.cx * -6}px, ${m.cy * -4}px, 0)`,
                willChange: 'transform',
              }}
            >
              <motion.p
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={undefined}
                transition={{ duration: 1.1, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                viewport={{ once: true, margin: '-10% 0px' }}
              >
                Physical commodity trading backed by our own tonnes. Domestic supply contracts, seaborne exports, structured imports and last-mile distribution settled under one counterparty.
              </motion.p>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-white/[0.07] sm:grid-cols-2">
            {[
              ['Domestic Trading', '2.1 Mt / yr contracted'],
              ['International Exports', '18 destination markets'],
              ['Import Operations', 'Coking coal & concentrates'],
              ['Global Distribution', '9 bonded warehouses'],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={reduce ? undefined : { y: -4, backgroundColor: 'rgba(20,20,20,1)' }}
                className="bg-[#111111] p-6 relative overflow-hidden"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 origin-left"
                  style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.08), transparent 70%)' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.08, ease: [0.76, 0, 0.24, 1] }}
                />
                <p className="font-display text-lg text-white relative">{k}</p>
                <p className="mt-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[#B87333] relative">{v}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.94, rotateX: 6, filter: 'blur(10px)' }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{
            duration: 1.1,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={reduce ? undefined : {
            transform: `translate3d(${m.cx * 18}px, ${m.cy * 14}px, 0) perspective(1200px) rotateX(${m.cy * -2}deg) rotateY(${m.cx * 2.5}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <motion.div
            className="pointer-events-none absolute -inset-6 -z-10"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(212,175,55,0.20), transparent 70%)',
              filter: 'blur(28px)',
            }}
          />

          <div className="glass relative rounded-sm p-4 overflow-hidden">
            <motion.div
              className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
              style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.25), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
            />
            <GlobeScene />
            <motion.div
              className="pointer-events-none absolute right-0 bottom-0"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="h-4 w-px bg-[#D4AF37]/60 absolute right-0 bottom-0" />
              <div className="h-px w-4 bg-[#D4AF37]/60 absolute right-0 bottom-0" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Logistics chain */}
      <div className="relative mx-auto mt-28 max-w-[90rem] px-6 lg:px-10">
        <motion.div
          className="mb-6 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-14% 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            07
          </motion.span>
          <span className="relative h-px w-10 overflow-hidden">
            <motion.span
              className="absolute inset-0 bg-[#D4AF37]/40 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.span
              className="absolute inset-0 origin-left"
              style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0))' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          <motion.span
            className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50"
            initial={{ opacity: 0, letterSpacing: '0.55em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            Logistics
          </motion.span>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-14% 0px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading className="max-w-2xl">Every tonne, tracked end to end.</Heading>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <motion.div
            className="relative overflow-hidden rounded-sm border border-white/[0.08]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -40, scale: 0.97, filter: 'blur(8px)' }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: 1.0,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={reduce ? undefined : {
              transform: `translate3d(${m.cx * 10}px, ${m.cy * 8}px, 0)`,
              willChange: 'transform',
            }}
          >
            <motion.img
              src={IMG.port}
              alt="Bulk commodity port at blue hour"
              loading="lazy"
              className="h-full w-full object-cover opacity-70"
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/25 to-transparent" />
            <motion.div
              className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
              style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.25), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.76, 0, 0.24, 1] }}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-8 gap-y-3 p-7">
              {CHAIN.map((c, i) => (
                <motion.span
                  key={c.label}
                  initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.75 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/70"
                >
                  <motion.div
                    initial={{ rotateZ: -45, scale: 0 }}
                    whileInView={{ rotateZ: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.72 + i * 0.1, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <c.icon className="h-3.5 w-3.5 text-[#D4AF37]" strokeWidth={1.4} />
                  </motion.div>
                  {c.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-sm p-8 relative"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.95, rotateX: -5, filter: 'blur(10px)' }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: 1.05,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={reduce ? undefined : {
              transform: `translate3d(${m.cx * -12}px, ${m.cy * -10}px, 0) perspective(1000px) rotateX(${m.cy * 1.5}deg) rotateY(${m.cx * -1.8}deg)`,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <motion.div
              className="pointer-events-none absolute -inset-4 -z-10 opacity-40"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212,175,55,0.15), transparent 70%)',
                filter: 'blur(18px)',
              }}
            />
            <motion.div
              className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
              style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.25), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.85, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.p
              initial={{ opacity: 0, y: 10, letterSpacing: '0.5em' }}
              whileInView={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]"
            >
              Fleet & network
            </motion.p>
            <ul className="mt-6 divide-y divide-white/[0.08]">
              {[
                [Truck, 'Heavy Trucks', '640 units'],
                [Train, 'Rail Transport', '11 rakes / week'],
                [Ship, 'Cargo Ships', '38 voyages / yr'],
                [Building2, 'Container Ports', '6 terminals'],
                [Warehouse, 'Warehouses', '9 facilities'],
              ].map(([Icon, label, value], i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between py-4"
                  whileHover={reduce ? undefined : { x: 4, backgroundColor: 'rgba(255,255,255,0.015)' }}
                >
                  <span className="flex items-center gap-3 text-sm text-white/75">
                    <motion.span
                      initial={{ rotateZ: -20, scale: 0.5, opacity: 0 }}
                      whileInView={{ rotateZ: 0, scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.18 + i * 0.08, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <Icon className="h-4 w-4 text-[#B87333]" strokeWidth={1.4} />
                    </motion.span>
                    {label}
                  </span>
                  <span className="font-mono2 text-[11px] text-white/45">{value}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="pointer-events-none absolute right-0 bottom-0"
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="h-4 w-px bg-[#D4AF37]/60 absolute right-0 bottom-0" />
              <div className="h-px w-4 bg-[#D4AF37]/60 absolute right-0 bottom-0" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 8 — SUSTAINABILITY ============================ */
function SceneSustainability() {
  const hoverRef = useRef(false);

  /* Pass hover state down into WindScene via a shared ref object */
  const hoverCallbacks = useRef({
    onEnter: () => { },
    onLeave: () => { },
  });

  /* Mouse parallax — lerped normalized position (0,0) = center, (-1..1, -1..1) edges */
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, active: false });
  const [, forceTick] = useState(0);

  /* Single animation frame driver for smooth parallax */
  useEffect(() => {
    let rafId;
    function tick() {
      const m = mouseRef.current;
      let changed = false;
      const dx = m.tx - m.cx;
      const dy = m.ty - m.cy;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        m.cx += dx * 0.12;
        m.cy += dy * 0.12;
        changed = true;
      }
      if (!m.active) {
        const dx2 = 0 - m.cx;
        const dy2 = 0 - m.cy;
        if (Math.abs(dx2) > 0.001 || Math.abs(dy2) > 0.001) {
          m.cx += dx2 * 0.06;
          m.cy += dy2 * 0.06;
          changed = true;
        }
      }
      if (changed) forceTick((t) => (t + 1) % 1000000);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 4 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 4 - 1;
    const m = mouseRef.current;
    m.tx = nx;
    m.ty = ny;
    m.active = true;
  }
  function handleMouseEnter() {
    mouseRef.current.active = true;
    hoverCallbacks.current.onEnter();
  }
  function handleMouseLeave() {
    mouseRef.current.active = false;
    hoverCallbacks.current.onLeave();
  }

  const m = mouseRef.current;
  /* Strengths are in px — deeper layers move more = classic parallax */
  const HEADING_X = m.cx * 18;
  const HEADING_Y = m.cy * 14;
  const LABEL_X = m.cx * 8;
  const LABEL_Y = m.cy * 6;
  /* 6 cards — staggered strengths so the grid visibly "bends" in 3D */
  const CARD_DEPTHS = [
    { x: 26, y: 22 }, { x: 34, y: 28 }, { x: 42, y: 34 },
    { x: 30, y: 26 }, { x: 38, y: 32 }, { x: 46, y: 38 },
  ];

  return (
    <section
      id="sustainability"
      className="relative overflow-hidden py-25 lg:py-35"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {/* Background photo */}
      <ParallaxImage src={IMG.green} alt="Rehabilitated mine site with forest, lake and wind turbines" {..._getParallax(PARALLAX.SECTION_08_SUSTAINABILITY, 80, 1.12)} overlay="bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(20,83,45,0.35),transparent_60%)]" />

      {/* ── Three.js wind/smoke effect — z-1, behind content ── */}
      <WindScene callbacksRef={hoverCallbacks} />

      {/* Content */}
      <div className="relative z-[2] mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <div style={{ transform: `translate3d(${LABEL_X}px, ${LABEL_Y}px, 0)`, willChange: 'transform' }}>
            <SectionLabel index="08">Sustainability</SectionLabel>
          </div>
          <div style={{ transform: `translate3d(${HEADING_X}px, ${HEADING_Y}px, 0)`, willChange: 'transform' }}>
            <Heading className="max-w-3xl">We are measured by what we leave behind.</Heading>
          </div>
        </Rise>
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-3">
          {[
            [Leaf, 'Environmental Protection', '4,120 hectares rehabilitated and handed back to state forestry.'],
            [Sun, 'Carbon Reduction', '38% Scope 1 & 2 reduction since 2018; 46 MW of on-site solar and wind.'],
            [Droplets, 'Water Management', '91% of process water recycled in closed circuit.'],
            [HardHat, 'Worker Safety', 'Zero-harm framework, 99% compliance across 11 sites.'],
            [Users, 'CSR Activities', 'Health, schooling and skills programmes for 74 host villages.'],
            [Building2, 'Community Development', 'Local procurement at 62% of non-capital spend.'],
          ].map(([Icon, title, body], i) => {
            const d = CARD_DEPTHS[i] || CARD_DEPTHS[0];
            return (
              <Rise key={title} delay={(i % 3) * 0.08}>
                <div
                  className="border-t border-white/[0.1] pr-8 pt-7"
                  style={{
                    transform: `translate3d(${m.cx * d.x}px, ${m.cy * d.y}px, 0)`,
                    willChange: 'transform',
                    transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
                  }}
                >
                  <Icon className="h-6 w-6 text-[#7fae8e]" strokeWidth={1.2} />
                  <h3 className="mt-5 font-display text-2xl text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{body}</p>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 9 — STATS ============================ */
function SceneStats() {
  const stats = [
    { v: 25, s: '+', l: 'Mining Sites' },
    { v: 50, s: '+', l: 'Global Clients' },
    { v: 18, s: '+', l: 'Export Countries' },
    { v: 5, s: 'M+', l: 'Metric Tons Delivered' },
    { v: 99, s: '%', l: 'Safety Compliance' },
  ];
  return (
    <section className="relative border-y border-white/[0.08] bg-[#101010] py-40">
      <div className="mx-auto grid grid-cols-2 max-w-[90rem] gap-x-8 gap-y-10 px-6 sm:gap-x-14 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-5 lg:px-10">
        {stats.map((s, i) => (
          <Rise key={s.l} delay={i * 0.06}>
            <p className="font-display text-[clamp(2.8rem,4.6vw,4.2rem)] leading-none gold-text">
              <Counter value={s.v} suffix={s.s} />
            </p>
            <p className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.25em] text-white/45">{s.l}</p>
          </Rise>
        ))}
      </div>
    </section>
  );
}

/* ============================ SCENE 10 — WHY US ============================ */
function SceneWhyUs() {
  const reduce = false;
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false); // Reset animation when scrolling away so it replay next time
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [reduce]);

  const items = [
    [Leaf, 'Responsible Mining'], [Ship, 'Global Logistics'], [ShieldCheck, 'Quality Assurance'],
    [Globe2, 'International Trade'], [Users, 'Experienced Team'], [Landmark, 'Government Compliance'], [Clock, '24×7 Support'],
  ];

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{ position: 'relative', py: { xs: 16, lg: 20 } }}
    >
      <Box sx={{ mx: 'auto', maxWidth: '90rem', px: { xs: 3, lg: 5 } }}>
        {/* Section Header Intro Animation (Pure MUI) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0px)' : 'translateY(28px)',
            transition: reduce ? 'none' : 'opacity 850ms cubic-bezier(0.16, 1, 0.3, 1), transform 850ms cubic-bezier(0.16, 1, 0.3, 1)',
            mb: -2
          }}
        >
          <SectionLabel index="10">Why Choose Us</SectionLabel>
          <Box sx={{ mt: 2, ml: -1 }}>
            {["Seven reasons buyers", "stay for decades."].map((line, index) => (
              <Box key={index} sx={{ display: 'block', mb: 1, width: '100%' }}>
                <Typography
                  variant="h2"
                  className="font-display"
                  sx={{
                    fontFamily: 'inherit',
                    fontSize: 'clamp(1.6rem, 6.5vw, 4.6rem)',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(100deg, #FFFFFF 0%, #E9E2CC 33%, #FFF8C4 46%, #D4AF37 50%, #FFFFFF 54%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.05) 100%)',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    // Sweep animation
                    backgroundPosition: inView ? '0% 0%' : '100% 0%',
                    transition: reduce ? 'none' : `background-position 2.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.35}s`,
                    // Glow drop shadow pulse
                    animation: (inView && !reduce) ? `muiGlowPulse${index} 2.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + index * 0.35}s forwards` : 'none',
                    [`@keyframes muiGlowPulse${index}`]: {
                      '0%': { filter: 'drop-shadow(0 0 0px transparent)' },
                      '50%': { filter: 'drop-shadow(0 0 14px rgba(212,175,55,0.65))' },
                      '100%': { filter: 'drop-shadow(0 0 0px transparent)' }
                    }
                  }}
                >
                  {line}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Section Cards Intro Animation (Pure MUI with staggered delay) */}
        <Box
          sx={{
            mt: 7,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          }}
        >
          {items.map(([Icon, label], i) => {
            const delay = reduce ? 0 : 0.6 + (i % 4) * 0.12;
            return (
              <Box
                key={label}
                sx={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0px)' : 'translateY(28px)',
                  transition: reduce
                    ? 'none'
                    : `opacity 850ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 850ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, border-color 400ms ease, background-color 400ms ease, box-shadow 400ms ease`,
                  height: '100%',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  bgcolor: '#121212',
                  p: 3.5,
                  '&:hover': {
                    transform: 'translateY(-4px) !important',
                    borderColor: 'rgba(212,175,55,0.35)',
                    boxShadow: '0 28px 60px -40px rgba(212,175,55,0.6)',
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                      color: '#D4AF37',
                    }
                  }
                }}
              >
                <Icon className="h-5 w-5 text-[#D4AF37]" strokeWidth={1.3} />
                <Typography
                  variant="h6"
                  className="font-display"
                  sx={{ mt: 4, fontSize: '1.25rem', color: 'white', fontFamily: 'inherit' }}
                >
                  {label}
                </Typography>
                <ArrowUpRight
                  className="arrow-icon transition-all duration-300 h-4 w-4 text-white/25 mt-4"
                  strokeWidth={1.4}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* ============================ SCENE 11 & 12 ============================ */
const PRODUCTS = [
  { slug: 'gold-bars', name: 'Gold Bars', purity: '99.99% LBMA good delivery', spec: '1 kg / 400 oz', image: IMG.bars, model: 'gold_bar' },
  { slug: 'gold-ore', name: 'Gold Ore', purity: 'Run-of-mine, 4.2 g/t', spec: 'Bulk / containerised', image: IMG.ore, model: 'gold_stone' },
  { slug: 'gold-dust', name: 'Gold Dust', purity: '92–96% fineness', spec: 'Sealed consignment', image: IMG.bars, model: 'gold_dust' },
  { slug: 'steam-coal', name: 'Steam Coal', purity: '6,300 kcal/kg GAR', spec: '50,000 t cargoes', image: IMG.cokingCoal, model: 'coal' },
  { slug: 'coking-coal', name: 'Coking Coal', purity: 'Low-ash, CSR 62', spec: 'Panamax shipments', image: IMG.cokingCoal, model: 'cocking_coal' },
  { slug: 'industrial-coal', name: 'Industrial Coal', purity: '4,800 kcal/kg', spec: 'Rail-delivered', image: IMG.coal_mining, model: 'industrialCoal' },
  { slug: 'pipeline-metals', name: 'Copper, Iron Ore, Lithium, Nickel', purity: 'Pipeline — from 2027', spec: 'Offtake enquiries open', image: IMG.ore },
];

function SceneProducts() {
  const industries = [
    [Zap, 'Power Plants'], [Factory, 'Steel Industries'], [Hammer, 'Construction'], [Building2, 'Infrastructure'],
    [Gem, 'Jewelry'], [Factory, 'Manufacturing'], [Landmark, 'Government'], [Sun, 'Energy'], [FlaskRound, 'Chemicals'],
  ];
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      const slug = e.detail?.slug;
      if (!slug) return;
      const i = PRODUCTS.findIndex((p) => p.slug === slug);
      if (i !== -1) setActiveIdx(i);
    };
    window.addEventListener('kubera:select-product', handler);
    return () => window.removeEventListener('kubera:select-product', handler);
  }, []);

  return (
    <section id="products" className="relative py-25 lg:py-30">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="11">Products</SectionLabel>
          <Heading className="max-w-2xl">Traded in grades, not adjectives.</Heading>
        </Rise>
        <div className="mt-14"><ProductShowcase products={PRODUCTS} activeIdx={activeIdx} setActiveIdx={setActiveIdx} /></div>

        <Rise>
          <div className="mt-28">
            <SectionLabel index="12">Industries We Serve</SectionLabel>
          </div>
        </Rise>
        <div className="mt-8 flex flex-wrap gap-3">
          {industries.map(([Icon, label], i) => (
            <Rise key={label} delay={i * 0.04}>
              <span className="flex items-center gap-3 rounded-full border border-white/[0.1] px-5 py-3 text-sm text-white/70 transition-colors duration-300 hover:border-[#D4AF37]/40 hover:text-white">
                <Icon className="h-4 w-4 text-[#B87333]" strokeWidth={1.4} />{label}
              </span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 13 & 14 ============================ */
const CERTS = [
  { code: 'ML-2201', title: 'Mining Licenses', summary: 'Eleven active leases across three jurisdictions.', detail: 'All operating leases are held directly by group subsidiaries, with annual production returns filed to state mining departments and reserve statements re-audited every second year.', issuer: 'State Directorates of Mining', valid: 'Rolling, to 2041' },
  { code: 'ISO', title: 'ISO Certifications', summary: 'ISO 9001, 14001 and 45001 certified.', detail: 'Quality, environmental and occupational health & safety management systems are certified group-wide and surveilled annually by an accredited third-party registrar.', issuer: 'Accredited registrar', valid: 'March 2028' },
  { code: 'ENV', title: 'Environmental Compliance', summary: 'Consent to operate at every site.', detail: 'Environmental clearance, consent to establish and consent to operate maintained at all sites, with quarterly ambient air, noise and effluent monitoring published to the regulator.', issuer: 'Pollution Control Boards', valid: 'December 2029' },
  { code: 'EXP', title: 'Export License', summary: 'Bulk mineral and bullion export authority.', detail: 'Authorised for seaborne export of bulk minerals and refined bullion, including customs-bonded handling at six terminals.', issuer: 'Directorate General of Foreign Trade', valid: 'Perpetual' },
  { code: 'IEC', title: 'Import Export Code', summary: 'Registered trading entity.', detail: 'Group trading arm registered for both import and export operations, with AEO-accredited customs status enabling deferred duty and priority clearance.', issuer: 'Customs authority', valid: 'Perpetual' },
  { code: 'QA', title: 'Quality Assurance', summary: 'Independent assay at load port and discharge.', detail: 'Every cargo is sampled and assayed by an independent inspectorate at both load and discharge port, with certificates issued before title transfer.', issuer: 'Independent inspectorate', valid: 'Per shipment' },
];

function SceneCertsAndPresence() {
  const sectionRef = useRef(null);
  const reduce = false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const certsPresenceParallax = _getParallax(PARALLAX.SECTION_13_CERTIFICATIONS_AND_14_GLOBAL_PRESENCE, 40, 1.14);
  const bgY = useTransform(scrollYProgress, [0, 1], [certsPresenceParallax.strength, -certsPresenceParallax.strength]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, certsPresenceParallax.scaleTo]);

  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let rafId;
    function tick() {
      const m = mouseRef.current;
      let changed = false;
      const dx = m.tx - m.cx;
      const dy = m.ty - m.cy;
      if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
        m.cx += dx * 0.08;
        m.cy += dy * 0.08;
        changed = true;
      }
      if (changed) forceTick((t) => (t + 1) % 1000000);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce]);

  function handleMouseMove(e) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current.tx = nx;
    mouseRef.current.ty = ny;
  }
  const m = mouseRef.current;

  return (
    <section
      ref={sectionRef}
      id="presence"
      className="relative overflow-hidden py-32 lg:py-40"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={IMG.sunset}
          alt="Global mining operations at sunset"
          loading="lazy"
          style={reduce ? undefined : {
            y: bgY,
            scale: bgScale,
            opacity: 0.12,
            height: `${certsPresenceParallax.defaultZoomPct}%`,
            width: '106%',
            transform: `translateY(-${certsPresenceParallax.defaultShiftUpPct}%) translateX(-3%)`,
            objectFit: 'cover',
          }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/85 to-[#0D0D0D]" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 45% at 30% 18%, rgba(184,115,51,0.10), transparent 62%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 45% 55% at 75% 82%, rgba(100,80,40,0.16), transparent 60%)' }} />
      </div>

      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), rgba(184,115,51,0.1), transparent)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-px origin-top"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.28), transparent)',
        }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.6, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
      />

      <Particles count={22} tone="#D4AF37" />

      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        {/* SECTION 13: CERTIFICATIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-14% 0px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="mb-6 flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-14% 0px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              13
            </motion.span>
            <span className="relative h-px w-10 overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-[#D4AF37]/40 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.span
                className="absolute inset-0 origin-left"
                style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <motion.span
              className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50"
              initial={{ opacity: 0, letterSpacing: '0.55em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              Certifications
            </motion.span>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, filter: 'blur(6px)' }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-14% 0px' }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Heading className="max-w-2xl">Documented, audited, open to review.</Heading>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(8px)' }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-1"
        >
          <Certifications items={CERTS} />
        </motion.div>

        {/* SECTION 14: GLOBAL PRESENCE */}
        <div className="mt-28 grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* LEFT COLUMN - Section 14 Content */}
          <div
            className="relative"
            style={reduce ? undefined : {
              transform: `translate3d(${m.cx * -14}px, ${m.cy * -10}px, 0)`,
              willChange: 'transform',
            }}
          >
            <motion.div
              className="mb-6 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-14% 0px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                14
              </motion.span>
              <span className="relative h-px w-10 overflow-hidden">
                <motion.span
                  className="absolute inset-0 bg-[#D4AF37]/40 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
                />
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0))' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <motion.span
                className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50"
                initial={{ opacity: 0, letterSpacing: '0.55em' }}
                whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                Global Presence
              </motion.span>
            </motion.div>

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-14% 0px' }}
              transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroTextAnimation reduce={reduce} textLines={["From the pit head", "to the discharge port."]} />
            </motion.div>

            <motion.ul
              className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08] relative overflow-hidden"
              initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            >
              {[
                ['Corporate Office', 'Singapore', Globe2],
                ['Mining Locations', '11 sites, 3 jurisdictions', Drill],
                ['Export Ports', '6 bulk terminals', Ship],
                ['Distribution Centres', '9 bonded warehouses', Warehouse],
                ['International Clients', '50+ across 18 markets', Users],
              ].map(([k, v, Icon], i) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20% 0px' }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between py-4 relative"
                  whileHover={reduce ? undefined : { x: 6, backgroundColor: 'rgba(255,255,255,0.015)' }}
                >
                  <span className="flex items-center gap-3">
                    <motion.span
                      initial={{ rotateZ: -30, scale: 0.4, opacity: 0 }}
                      whileInView={{ rotateZ: 0, scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-20% 0px' }}
                      transition={{ delay: i * 0.05, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-8 h-8 rounded-sm border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-center justify-center"
                    >
                      <Icon className="h-4 w-4 text-[#D4AF37]" strokeWidth={1.3} />
                    </motion.span>
                    <span className="font-display text-lg text-white">{k}</span>
                  </span>
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/45"
                  >
                    {v}
                  </motion.span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT COLUMN - Globe */}
          <motion.div
            className="relative"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.92, rotateX: 8, filter: 'blur(12px)' }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{
              duration: 1.15,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={reduce ? undefined : {
              transform: `translate3d(${m.cx * 20}px, ${m.cy * 16}px, 0) perspective(1200px) rotateX(${m.cy * -2.5}deg) rotateY(${m.cx * 3}deg)`,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <motion.div
              className="pointer-events-none absolute -inset-8 -z-10"
              animate={{
                opacity: [0.35, 0.65, 0.35],
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'radial-gradient(ellipse 55% 50% at 50% 48%, rgba(212,175,55,0.22), transparent 70%)',
                filter: 'blur(32px)',
              }}
            />

            <div className="glass relative rounded-sm p-6 overflow-hidden">
              <motion.div
                className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left"
                style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.25), transparent)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, delay: 0.75, ease: [0.76, 0, 0.24, 1] }}
              />
              <Globe pins={[
                { label: 'Singapore HQ', x: '62%', y: '58%' },
                { label: 'Pit head', x: '32%', y: '38%' },
                { label: 'Export port', x: '72%', y: '32%' },
                { label: 'Distribution', x: '44%', y: '74%' },
              ]} />
              <motion.div
                className="pointer-events-none absolute right-0 bottom-0"
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="h-4 w-px bg-[#D4AF37]/60 absolute right-0 bottom-0" />
                <div className="h-px w-4 bg-[#D4AF37]/60 absolute right-0 bottom-0" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 15 — NEWS ============================ */
const NEWS = [
  { tag: 'Project', date: 'Feb 2026', title: 'Third washery commissioned at the northern coal complex' },
  { tag: 'Award', date: 'Jan 2026', title: 'Recognised for mine rehabilitation at the regional resources awards' },
  { tag: 'Industry', date: 'Dec 2025', title: 'Seaborne thermal spreads narrow as Asian restocking begins' },
  { tag: 'CSR', date: 'Nov 2025', title: 'Skills academy opens for 480 students in host communities' },
];

function SceneNews() {
  return (
    <section id="news" className="relative border-t border-white/[0.08] py-28">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="15">News & Media</SectionLabel>
          <Heading className="max-w-2xl">From the operations.</Heading>
        </Rise>
        <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {NEWS.map((n, i) => (
            <Rise key={n.title} delay={i * 0.06}>
              <a href="#contact" className="group grid gap-3 py-7 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-[7rem_7rem_1fr_2rem] md:items-center">
                <span className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">{n.tag}</span>
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/35">{n.date}</span>
                <span className="font-display text-xl text-white/85 transition-colors group-hover:text-white">{n.title}</span>
                {/* <ArrowUpRight className="h-4 w-4 text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]" strokeWidth={1.4} /> */}
              </a>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ FINALE + FOOTER ============================ */
/* ============================ FINALE + FOOTER ============================ */
function Finale({ openContactModal }) {
  const reduce = false;
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative min-h-[92vh]">
        <ParallaxImage src={IMG.sunset} alt="Sunset over a mining landscape" {..._getParallax(PARALLAX.SECTION_FINALE_CONTACT, 70, 1.12)} overlay="bg-gradient-to-b from-[#0D0D0D]/70 via-[#0D0D0D]/55 to-[#0D0D0D]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[72rem] flex-col items-center justify-center px-6 py-28 text-center lg:px-10">
          <div className="flex flex-col items-center justify-center text-center">
            <HeroTextAnimation
              reduce={reduce}
              textLines={["Building Tomorrow Through", "Responsible Mining"]}
            />
          </div>
          <Rise delay={0.12}>
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-white/60">
              Partner with us for sustainable mining and global commodity trading solutions.
            </p>
          </Rise>
          <Rise delay={0.22}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton onClick={() => openContactModal?.('Contact Us')}>Contact Us</MagneticButton>
              <MagneticButton variant="ghost" onClick={() => openContactModal?.('Request Business Proposal')}>Request Business Proposal</MagneticButton>
              <MagneticButton variant="ghost" onClick={() => openContactModal?.('Become a Trading Partner')}>Become a Trading Partner</MagneticButton>
            </div>
          </Rise>
        </div>
      </div>

      <footer className="border-t border-white/[0.08] bg-[#0B0B0B]">
        <div className="mx-auto grid max-w-[90rem] gap-x-10 gap-y-10 sm:gap-y-12 px-6 py-14 sm:py-16 grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] lg:px-10">
          <div className="col-span-2 lg:col-span-1">
            <p className="font-display text-xl tracking-[0.14em] text-white">Kubera RESOURCES</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Integrated mining, mineral processing and physical commodity trading across 18 markets.
            </p>
            <p className="mt-6 flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[#B87333]">
              <Award className="h-3.5 w-3.5" strokeWidth={1.4} /> ISO 9001 · 14001 · 45001
            </p>
          </div>
          {[
            ['Operations', [
              ['Gold Mining', '#gold-mining'],
              ['Coal Mining', '#coal-mining'],
              ['Mineral Exploration', '#exploration'],
              ['Processing', '#processing'],
            ]],
            ['Products', [
              ['Gold Bars', '#products--gold-bars'],
              ['Gold Ore', '#products--gold-ore'],
              ['Gold Dust', '#products--gold-dust'],
              ['Steam Coal', '#products--steam-coal'],
              ['Coking Coal', '#products--coking-coal'],
              ['Industrial Coal', '#products--industrial-coal'],
              ['Copper, Iron Ore & more', '#products--pipeline-metals'],
            ]],
            ['Trading', [
              ['Domestic Trading', '#trading'],
              ['International Exports', '#trading'],
              ['Import Operations', '#trading'],
              ['Logistics', '#trading'],
            ]],
            ['Company', [
              ['Sustainability', '#sustainability'],
              ['Certifications', '#presence'],
              ['News & Media', '#news'],
              ['Contact', '#contact'],
            ]],
          ].map(([title, links]) => (
            <div key={title}>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.28em] text-white/35">{title}</p>
              <ul className="mt-5 space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}><a href={href} className="text-sm text-white/60 transition-colors hover:text-[#D4AF37]">{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] px-6 py-6 lg:px-10">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-3 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Kubera Resources Group. All rights reserved.</p>
            <p className="font-mono2 tracking-[0.2em]">SINGAPORE · JAKARTA · DUBAI · ROTTERDAM</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

/* ============================ PAGE ============================ */
export default function HomePage() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Contact Us');

  function openContactModal(title = 'Contact Us') {
    setModalTitle(title);
    setContactModalOpen(true);
  }

  useEffect(() => {
    const HEADER_OFFSET = 112;
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      e.preventDefault();

      const rawHash = href.slice(1);
      const dashIdx = rawHash.indexOf('--');
      const sectionId = dashIdx === -1 ? rawHash : rawHash.slice(0, dashIdx);
      const productSlug = dashIdx === -1 ? null : rawHash.slice(dashIdx + 2);

      const target = document.getElementById(sectionId);
      if (!target) return;

      if (productSlug && sectionId === 'products') {
        window.dispatchEvent(new CustomEvent('kubera:select-product', { detail: { slug: productSlug } }));
      }

      const rect = target.getBoundingClientRect();
      let top;
      if (rect.height > window.innerHeight) {
        top = window.scrollY + rect.top - HEADER_OFFSET;
      } else {
        top = window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2);
      }
      const startY = window.scrollY;
      const distance = top - startY;
      const duration = 800; // ms
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        // easeInOutCubic curve
        const easeInOutCubic = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
        window.scrollTo(0, startY + distance * easeInOutCubic);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      requestAnimationFrame(animation);

      try {
        if (window.history.pushState) {
          window.history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }
      } catch (_) { /* noop */ }
    };

    document.addEventListener('click', onClick, { passive: false });
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="grain relative bg-[#0D0D0D]">
      <Helmet>

        <title>Kubera Resources — Global Gold &amp; Coal Mining, Commodity Trading</title>
        <meta name="description" content="Kubera Resources is an integrated gold and coal mining, mineral processing and global commodity trading group operating across 18 markets with certified, sustainable operations." />
        <link rel="icon" type="image/png" href={logo} />
        <meta property="og:image" content={logo} />
        <meta property="og:image:alt" content="Kubera Resources logo" />
      </Helmet>
      <Seo
        title="Kubera Resources — Global Mining & Commodity Trading"
        description="Integrated gold and coal mining, mineral exploration, processing, logistics and international commodity trading."
        image={IMG.hero}
        siteName="Kubera Resources"
      />
      <Header openContactModal={openContactModal} />
      <main>
        <Hero openContactModal={openContactModal} />
        <SceneStrata />
        <SceneExploration />
        <SceneGold />
        <SceneCoal />
        <SceneProcessing />
        <SceneTrading />
        <SceneSustainability />
        <SceneStats />
        <SceneWhyUs />
        <SceneProducts />
        <SceneCertsAndPresence />
        <SceneNews />
        <Finale openContactModal={openContactModal} />
      </main>
      <ContactFormModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        title={modalTitle}
      />
      <Toaster
        position="bottom-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: '#0F0F0F',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
