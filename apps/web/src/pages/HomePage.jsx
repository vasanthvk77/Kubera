import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  Satellite, Map, Drill, FlaskConical, Truck, Train, Ship, Warehouse, Factory,
  Leaf, Droplets, HardHat, Users, Sun, ShieldCheck, Globe2, Award, Clock,
  Building2, Hammer, Gem, Zap, FlaskRound, Landmark, ArrowUpRight, ChevronDown, Menu, X,
} from 'lucide-react';
import Seo from '@/components/Seo';
import {
  SectionLabel, Heading, Rise, ParallaxImage, Counter, MagneticButton, Particles,
} from '@/components/mining/Atoms';
import { Globe, ProductShowcase, Certifications } from '@/components/mining/Interactive';
import coal_mining from '../assests/coal_mining.webp';
import mineView from '../assests/mine_view.webp';
import machine from '../assests/machine.webp';
import goldStone from '../assests/gold_stone.webp';
import coal from '../assests/coal.webp';
import tunel from '../assests/tunel.webp';
import port from '../assests/port.webp';
import wind from '../assests/wind.webp';
import goldBar from '../assests/gold_bar.webp';
import sandCloseup from '../assests/sand_closeup.webp';
import workers from '../assests/workers.webp';
import miningSunset from '../assests/mining_sunset.webp';

const IMG = {
  hero: mineView,
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

const NAV = [
  ['Operations', '#operations'],
  ['Trading', '#trading'],
  ['Sustainability', '#sustainability'],
  ['Products', '#products'],
  ['Presence', '#presence'],
];

/* ============================ HEADER ============================ */
function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? 'bg-[#0D0D0D]/85 backdrop-blur-xl border-b border-white/[0.06]' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between px-6 lg:px-10">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-xl tracking-[0.14em] text-white">Kubera</span>
          <span className="font-mono2 text-[9px] tracking-[0.3em] text-[#D4AF37]">RESOURCES</span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="group relative font-mono2 text-[11px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white">
              {label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <MagneticButton variant="ghost" onClick={() => { window.location.hash = '#contact'; }}>Partner With Us</MagneticButton>
        </div>
        <button className="lg:hidden text-white" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#0D0D0D]/97 px-6 pb-8 pt-4 lg:hidden">
          {NAV.concat([['Contact', '#contact']]).map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-white/[0.06] py-4 font-mono2 text-xs uppercase tracking-[0.25em] text-white/70">
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ============================ HERO ============================ */
function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const dark = useTransform(scrollYProgress, [0, 1], [0.45, 0.96]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100dvh] overflow-hidden">
      <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0">
        <img src={IMG.hero} alt="Aerial view of an open-pit gold mine at sunrise" className="h-full w-full object-cover" />
      </motion.div>
      <motion.div style={reduce ? undefined : { opacity: dark }} className="absolute inset-0 bg-[#0D0D0D]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-transparent to-[#0D0D0D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(184,115,51,0.22),transparent_60%)]" />

      <motion.div style={reduce ? undefined : { opacity: fade }} className="relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-end px-6 pb-24 pt-32 lg:px-10 lg:pb-28">
        <Rise>
          <p className="font-mono2 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">Est. 1994 — Operating across 18 countries</p>
        </Rise>
        <Rise delay={0.1}>
          <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.6rem,7.4vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
            From the Earth&apos;s Riches to <span className="gold-text">Global Markets</span>
          </h1>
        </Rise>
        <Rise delay={0.2}>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/60">
            Responsible Mining <span className="text-[#B87333]">•</span> Sustainable Growth <span className="text-[#B87333]">•</span> Global Commodity Trading
          </p>
        </Rise>
        <Rise delay={0.3}>
          <div className="mt-11 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={() => { window.location.hash = '#operations'; }}>Explore Operations</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => { window.location.hash = '#contact'; }}>Partner With Us</MagneticButton>
          </div>
        </Rise>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-white/35">
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.2} />
      </div>
    </section>
  );
}

/* ============================ SCENE 1 — STRATA ============================ */
const LAYERS = [
  { name: 'Top Soil', depth: '0 – 4 m', note: 'Stripped, catalogued and stored for post-closure rehabilitation.' },
  { name: 'Rock Formation', depth: '4 – 60 m', note: 'Overburden benched in 10 m lifts with controlled blasting.' },
  { name: 'Mineral Deposits', depth: '60 – 180 m', note: 'Polymetallic zones assayed every 1.5 m of drill core.' },
  { name: 'Gold Veins', depth: '180 – 410 m', note: 'Quartz-hosted reefs averaging 4.2 g/t across strike.' },
  { name: 'Coal Seams', depth: '410 – 620 m', note: 'Low-ash bituminous seams, 6,300 kcal/kg gross calorific value.' },
];

function SceneStrata() {
  return (
    <section id="operations" className="relative overflow-hidden py-32 lg:py-44">
      <ParallaxImage src={IMG.strata} alt="Geological strata" strength={70} overlay="bg-[#0D0D0D]/82" />
      <Particles count={30} />
      <div className="relative mx-auto max-w-[72rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="01">Journey Beneath the Earth</SectionLabel>
          <Heading>Six hundred metres<br />of measured descent.</Heading>
        </Rise>
        <div className="mt-16 border-t border-white/[0.08]">
          {LAYERS.map((l, i) => (
            <Rise key={l.name} delay={i * 0.07}>
              <div className="group grid gap-3 border-b border-white/[0.08] py-7 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-[9rem_13rem_1fr] md:items-baseline">
                <span className="font-mono2 text-[11px] tracking-[0.22em] text-[#B87333]">{l.depth}</span>
                <span className="font-display text-2xl text-white">{l.name}</span>
                <span className="text-sm leading-relaxed text-white/45">{l.note}</span>
              </div>
            </Rise>
          ))}
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
  const [active, setActive] = useState(0);
  const Active = EXPLORE[active].icon;
  return (
    <section className="relative overflow-hidden py-32 lg:py-44">
      <ParallaxImage src={IMG.rig} alt="Core drilling rig at dusk" strength={80} overlay="bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/88 to-[#0D0D0D]/60" />
      <div className="relative mx-auto grid max-w-[90rem] gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10">
        <div>
          <Rise>
            <SectionLabel index="02">Exploration</SectionLabel>
            <Heading>We know the ground<br />before we break it.</Heading>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/50">
              Four disciplines, sequenced. Nothing enters development until the orebody has been modelled, drilled and independently verified.
            </p>
          </Rise>
          <div className="mt-10 flex flex-wrap gap-2">
            {EXPLORE.map((e, i) => (
              <button
                key={e.title}
                onClick={() => setActive(i)}
                className={`rounded-sm border px-4 py-2.5 font-mono2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${i === active ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/12 text-white/45 hover:border-white/30 hover:text-white/80'}`}
              >
                {e.title}
              </button>
            ))}
          </div>
        </div>
        <Rise delay={0.1}>
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="glass rounded-sm p-10">
            <Active className="h-7 w-7 text-[#D4AF37]" strokeWidth={1.2} />
            <h3 className="mt-6 font-display text-3xl text-white">{EXPLORE[active].title}</h3>
            <p className="mt-4 leading-relaxed text-white/55">{EXPLORE[active].body}</p>
            <p className="mt-8 border-t border-white/10 pt-5 font-mono2 text-[11px] uppercase tracking-[0.25em] text-[#B87333]">{EXPLORE[active].stat}</p>
          </motion.div>
        </Rise>
      </div>
    </section>
  );
}

/* ============================ SCENE 3 — GOLD ============================ */
function SceneGold() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-48">
      <ParallaxImage src={IMG.goldVein} alt="Illuminated gold vein underground" strength={100} overlay="bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/70 to-[#0D0D0D]" />
      <Particles count={34} />
      <div className="relative mx-auto max-w-[72rem] px-6 text-center lg:px-10">
        <Rise>
          <p className="font-mono2 text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">03 — Gold Mining</p>
          <h2 className="mx-auto mt-8 max-w-4xl font-display text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[1] tracking-[-0.025em]">
            <span className="gold-text">Light finds it</span> <span className="text-white">before we do.</span>
          </h2>
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
function SceneCoal() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-44">
      <ParallaxImage src={IMG.coal} alt="Open-cut coal mine with haul trucks" strength={90} overlay="bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/78 to-[#0D0D0D]/90" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="04">Coal Mining</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <Heading>Scale, moved<br />one bench at a time.</Heading>
            <p className="text-[15px] leading-relaxed text-white/50">
              Continuous truck-and-shovel operations across four open-cut pits, feeding washeries and rail load-out around the clock under a single integrated control room.
            </p>
          </div>
        </Rise>
        <div className="mt-20 grid gap-y-12 border-t border-white/[0.08] pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 18.6, s: ' Mt', l: 'Annual Production' },
            { v: 24, s: ' Mtpa', l: 'Mining Capacity' },
            { v: 11, s: '', l: 'Operating Mines' },
            { v: 99, s: '%', l: 'Safety Compliance' },
          ].map((m) => (
            <div key={m.l}>
              <p className="font-display text-[clamp(2.6rem,5vw,4rem)] leading-none text-white">
                <Counter value={m.v} decimals={m.v % 1 ? 1 : 0} suffix={m.s} />
              </p>
              <p className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#B87333]">{m.l}</p>
            </div>
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
    <section className="relative overflow-hidden py-32 lg:py-44">
      <ParallaxImage src={IMG.plant} alt="Mineral processing facility interior" strength={70} overlay="bg-[#0D0D0D]/88" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="05">Mineral Processing</SectionLabel>
          <Heading className="max-w-3xl">Eight stages between rock and market.</Heading>
        </Rise>
      </div>
      <div className="relative mt-16 overflow-hidden py-4">
        <div className="flex w-max animate-marquee gap-4">
          {[...PIPELINE, ...PIPELINE].map((s, i) => (
            <span key={`${s}-${i}`} className="flex items-center gap-4 whitespace-nowrap rounded-sm border border-[#D4AF37]/15 bg-[#141414]/70 px-7 py-4 font-mono2 text-[11px] uppercase tracking-[0.24em] text-white/65">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />{s}
            </span>
          ))}
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
  return (
    <section id="trading" className="relative overflow-hidden py-32 lg:py-44">
      <div className="absolute inset-0 bg-[#0D0D0D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(212,175,55,0.10),transparent_58%)]" />
      <div className="relative mx-auto grid max-w-[90rem] gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-10">
        <div>
          <Rise>
            <SectionLabel index="06">Global Trading</SectionLabel>
            <Heading>Eighteen countries,<br />one desk.</Heading>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/50">
              Physical commodity trading backed by our own tonnes. Domestic supply contracts, seaborne exports, structured imports and last-mile distribution settled under one counterparty.
            </p>
          </Rise>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-white/[0.07] sm:grid-cols-2">
            {[
              ['Domestic Trading', '2.1 Mt / yr contracted'],
              ['International Exports', '18 destination markets'],
              ['Import Operations', 'Coking coal & concentrates'],
              ['Global Distribution', '9 bonded warehouses'],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#111111] p-6">
                <p className="font-display text-lg text-white">{k}</p>
                <p className="mt-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[#B87333]">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <Rise delay={0.1}>
          <Globe pins={[]} />
        </Rise>
      </div>

      {/* Logistics chain */}
      <div className="relative mx-auto mt-28 max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="07">Logistics</SectionLabel>
          <Heading className="max-w-2xl">Every tonne, tracked end to end.</Heading>
        </Rise>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-sm border border-white/[0.08]">
            <img src={IMG.port} alt="Bulk commodity port at blue hour" loading="lazy" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-8 gap-y-3 p-7">
              {CHAIN.map((c, i) => (
                <motion.span
                  key={c.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/70"
                >
                  <c.icon className="h-3.5 w-3.5 text-[#D4AF37]" strokeWidth={1.4} />{c.label}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="glass rounded-sm p-8">
            <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Fleet & network</p>
            <ul className="mt-6 divide-y divide-white/[0.08]">
              {[
                [Truck, 'Heavy Trucks', '640 units'],
                [Train, 'Rail Transport', '11 rakes / week'],
                [Ship, 'Cargo Ships', '38 voyages / yr'],
                [Building2, 'Container Ports', '6 terminals'],
                [Warehouse, 'Warehouses', '9 facilities'],
              ].map(([Icon, label, value]) => (
                <li key={label} className="flex items-center justify-between py-4">
                  <span className="flex items-center gap-3 text-sm text-white/75"><Icon className="h-4 w-4 text-[#B87333]" strokeWidth={1.4} />{label}</span>
                  <span className="font-mono2 text-[11px] text-white/45">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 8 — SUSTAINABILITY ============================ */
function SceneSustainability() {
  return (
    <section id="sustainability" className="relative overflow-hidden py-32 lg:py-48">
      <ParallaxImage src={IMG.green} alt="Rehabilitated mine site with forest, lake and wind turbines" strength={80} overlay="bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(20,83,45,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="08">Sustainability</SectionLabel>
          <Heading className="max-w-3xl">We are measured by what we leave behind.</Heading>
        </Rise>
        <div className="mt-16 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [Leaf, 'Environmental Protection', '4,120 hectares rehabilitated and handed back to state forestry.'],
            [Sun, 'Carbon Reduction', '38% Scope 1 & 2 reduction since 2018; 46 MW of on-site solar and wind.'],
            [Droplets, 'Water Management', '91% of process water recycled in closed circuit.'],
            [HardHat, 'Worker Safety', 'Zero-harm framework, 99% compliance across 11 sites.'],
            [Users, 'CSR Activities', 'Health, schooling and skills programmes for 74 host villages.'],
            [Building2, 'Community Development', 'Local procurement at 62% of non-capital spend.'],
          ].map(([Icon, title, body], i) => (
            <Rise key={title} delay={(i % 3) * 0.08}>
              <div className="border-t border-white/[0.1] pr-8 pt-7">
                <Icon className="h-6 w-6 text-[#7fae8e]" strokeWidth={1.2} />
                <h3 className="mt-5 font-display text-2xl text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{body}</p>
              </div>
            </Rise>
          ))}
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
    <section className="relative border-y border-white/[0.08] bg-[#101010] py-24">
      <div className="mx-auto grid max-w-[90rem] gap-y-12 px-6 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
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
  const items = [
    [Leaf, 'Responsible Mining'], [Ship, 'Global Logistics'], [ShieldCheck, 'Quality Assurance'],
    [Globe2, 'International Trade'], [Users, 'Experienced Team'], [Landmark, 'Government Compliance'], [Clock, '24×7 Support'],
  ];
  return (
    <section className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="10">Why Choose Us</SectionLabel>
          <Heading className="max-w-2xl">Seven reasons buyers stay for decades.</Heading>
        </Rise>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, label], i) => (
            <Rise key={label} delay={(i % 4) * 0.07}>
              <div className="group h-full rounded-sm border border-white/[0.08] bg-[#121212] p-7 transition-all duration-400 hover:-translate-y-1 hover:border-[#D4AF37]/35 hover:shadow-[0_28px_60px_-40px_rgba(212,175,55,0.6)]">
                <Icon className="h-5 w-5 text-[#D4AF37]" strokeWidth={1.3} />
                <p className="mt-8 font-display text-xl text-white">{label}</p>
                <ArrowUpRight className="mt-4 h-4 w-4 text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]" strokeWidth={1.4} />
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ SCENE 11 & 12 ============================ */
const PRODUCTS = [
  { name: 'Gold Bars', purity: '99.99% LBMA good delivery', spec: '1 kg / 400 oz', image: IMG.bars },
  { name: 'Gold Ore', purity: 'Run-of-mine, 4.2 g/t', spec: 'Bulk / containerised', image: IMG.ore },
  { name: 'Gold Dust', purity: '92–96% fineness', spec: 'Sealed consignment', image: IMG.bars },
  { name: 'Steam Coal', purity: '6,300 kcal/kg GAR', spec: '50,000 t cargoes', image: IMG.cokingCoal },
  { name: 'Coking Coal', purity: 'Low-ash, CSR 62', spec: 'Panamax shipments', image: IMG.cokingCoal },
  { name: 'Industrial Coal', purity: '4,800 kcal/kg', spec: 'Rail-delivered', image: IMG.coal_mining },
  { name: 'Copper, Iron Ore, Lithium, Nickel', purity: 'Pipeline — from 2027', spec: 'Offtake enquiries open', image: IMG.ore },
];

function SceneProducts() {
  const industries = [
    [Zap, 'Power Plants'], [Factory, 'Steel Industries'], [Hammer, 'Construction'], [Building2, 'Infrastructure'],
    [Gem, 'Jewelry'], [Factory, 'Manufacturing'], [Landmark, 'Government'], [Sun, 'Energy'], [FlaskRound, 'Chemicals'],
  ];
  return (
    <section id="products" className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="11">Products</SectionLabel>
          <Heading className="max-w-2xl">Traded in grades, not adjectives.</Heading>
        </Rise>
        <div className="mt-14"><ProductShowcase products={PRODUCTS} /></div>

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
  return (
    <section id="presence" className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
        <Rise>
          <SectionLabel index="13">Certifications</SectionLabel>
          <Heading className="max-w-2xl">Documented, audited, open to review.</Heading>
        </Rise>
        <div className="mt-14"><Certifications items={CERTS} /></div>

        <div className="mt-28 grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Rise>
            <SectionLabel index="14">Global Presence</SectionLabel>
            <Heading>From the pit head<br />to the discharge port.</Heading>
            <ul className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {[
                ['Corporate Office', 'Singapore'],
                ['Mining Locations', '11 sites, 3 jurisdictions'],
                ['Export Ports', '6 bulk terminals'],
                ['Distribution Centres', '9 bonded warehouses'],
                ['International Clients', '50+ across 18 markets'],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between py-4">
                  <span className="font-display text-lg text-white">{k}</span>
                  <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/45">{v}</span>
                </li>
              ))}
            </ul>
          </Rise>
          <Rise delay={0.1}>
            <Globe pins={[
              { label: 'Singapore HQ', x: '62%', y: '58%' },
              { label: 'Pit head', x: '32%', y: '38%' },
              { label: 'Export port', x: '72%', y: '32%' },
              { label: 'Distribution', x: '44%', y: '74%' },
            ]} />
          </Rise>
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
    <section className="relative border-t border-white/[0.08] py-28">
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
                <ArrowUpRight className="h-4 w-4 text-white/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]" strokeWidth={1.4} />
              </a>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ FINALE + FOOTER ============================ */
function Finale() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative min-h-[92vh]">
        <ParallaxImage src={IMG.sunset} alt="Sunset over a mining landscape" strength={70} overlay="bg-gradient-to-b from-[#0D0D0D]/70 via-[#0D0D0D]/55 to-[#0D0D0D]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-[72rem] flex-col items-center justify-center px-6 py-28 text-center lg:px-10">
          <Rise>
            <h2 className="font-display text-[clamp(2.4rem,6.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white">
              Building Tomorrow Through<br /><span className="gold-text">Responsible Mining</span>
            </h2>
          </Rise>
          <Rise delay={0.12}>
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-white/60">
              Partner with us for sustainable mining and global commodity trading solutions.
            </p>
          </Rise>
          <Rise delay={0.22}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton>Contact Us</MagneticButton>
              <MagneticButton variant="ghost">Request Business Proposal</MagneticButton>
              <MagneticButton variant="ghost">Become a Trading Partner</MagneticButton>
            </div>
          </Rise>
        </div>
      </div>

      <footer className="border-t border-white/[0.08] bg-[#0B0B0B]">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <p className="font-display text-xl tracking-[0.14em] text-white">Kubera RESOURCES</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Integrated mining, mineral processing and physical commodity trading across 18 markets.
            </p>
            <p className="mt-6 flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[#B87333]">
              <Award className="h-3.5 w-3.5" strokeWidth={1.4} /> ISO 9001 · 14001 · 45001
            </p>
          </div>
          {[
            ['Operations', ['Gold Mining', 'Coal Mining', 'Mineral Exploration', 'Processing']],
            ['Trading', ['Domestic Trading', 'International Exports', 'Import Operations', 'Logistics']],
            ['Company', ['Sustainability', 'Certifications', 'News & Media', 'Contact']],
          ].map(([title, links]) => (
            <div key={title}>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.28em] text-white/35">{title}</p>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l}><a href="#top" className="text-sm text-white/60 transition-colors hover:text-[#D4AF37]">{l}</a></li>
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
  return (
    <div className="grain relative bg-[#0D0D0D]">
      <Helmet>
        <title>Kubera Resources — Global Gold &amp; Coal Mining, Commodity Trading</title>
        <meta name="description" content="Kubera Resources is an integrated gold and coal mining, mineral processing and global commodity trading group operating across 18 markets with certified, sustainable operations." />
      </Helmet>
      <Seo
        title="Kubera Resources — Global Mining & Commodity Trading"
        description="Integrated gold and coal mining, mineral exploration, processing, logistics and international commodity trading."
        image={IMG.hero}
        siteName="Kubera Resources"
      />
      <Header />
      <main>
        <Hero />
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
        <Finale />
      </main>
    </div>
  );
}
