import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import goldStoneVideo from '@/assests/gold_stone.mp4';
import goldbarVideo from '@/assests/gold_bar.mp4';
import coalVideo from '@/assests/coal.mp4';
import goldDustVideo from '@/assests/gold_dust.mp4';
import cockingCoalVideo from '@/assests/cocking_coal.mp4';
import industrialCoal from '@/assests/IndustrialCoal.mp4';

/* ---------- Rotating wireframe globe with illuminated routes ---------- */
export function Globe({ pins = [] }) {
  const reduce = false;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[520px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(212,175,55,0.22),transparent_62%)] blur-2xl" />
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
      >
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(212,175,55,0.28)" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="78" fill="url(#gsphere)" />
        <defs>
          <radialGradient id="gsphere" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#2a2621" />
            <stop offset="100%" stopColor="#0D0D0D" />
          </radialGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={`m${i}`} cx="100" cy="100" rx={78 - i * 15} ry="78" fill="none" stroke="rgba(212,175,55,0.16)" strokeWidth="0.5" />
        ))}
        {[-52, -26, 0, 26, 52].map((o) => (
          <ellipse key={`p${o}`} cx="100" cy={100 + o} rx={Math.sqrt(Math.max(1, 78 * 78 - o * o))} ry="6" fill="none" stroke="rgba(212,175,55,0.14)" strokeWidth="0.5" />
        ))}
      </motion.svg>

      {/* route arcs */}
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 h-full w-full">
        {[
          'M40,120 Q100,30 160,92',
          'M52,72 Q108,140 168,118',
          'M36,96 Q96,166 154,70',
        ].map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(184,115,51,0.35)" strokeWidth="0.8" strokeDasharray="2 3" />
            {!reduce && (
              <circle r="2" fill="#F6E7A8">
                <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        ))}
      </svg>

      {pins.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + i * 0.18, duration: 0.5, ease: 'easeOut' }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: p.x, top: p.y }}
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_0_4px_rgba(212,175,55,0.18)]" />
          <span className="mt-2 block whitespace-nowrap font-mono2 text-[9px] uppercase tracking-[0.2em] text-white/60">{p.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Product showcase with hover specs ---------- */

const VIDEO_MAP = {
  gold_stone: { src: goldStoneVideo, key: 'gold-stone-video' },
  gold_bar: { src: goldbarVideo, key: 'gold-bar-video' },
  coal: { src: coalVideo, key: 'coal-video' },
  gold_dust: { src: goldDustVideo, key: 'gold-dust-video' },
  cocking_coal: { src: cockingCoalVideo, key: 'cocking-coal-video' },
  industrialCoal: { src: industrialCoal, key: 'industrial-coal-video' },
};

export function ProductShowcase({ products, activeIdx, setActiveIdx }) {
  const [internal, setInternal] = useState(0);
  const isControlled = activeIdx !== undefined && setActiveIdx !== undefined;
  const active = isControlled ? activeIdx : internal;
  const setActive = isControlled ? setActiveIdx : setInternal;
  const activeProduct = products[active];
  const videoEntry = activeProduct.model ? VIDEO_MAP[activeProduct.model] : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[#D4AF37]/15 bg-[#141414]">
          <AnimatePresence mode="wait">
            {videoEntry ? (
              /* ── Video product ── */
              <motion.div
                key={videoEntry.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <video
                  src={videoEntry.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ) : (
              /* ── Regular product image ── */
              <motion.img
                key={activeProduct.image}
                src={activeProduct.image}
                alt={activeProduct.name}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </AnimatePresence>

          {/* Label overlay — always on top */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6">
            <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">{activeProduct.purity}</p>
            <h3 className="font-display text-3xl text-white">{activeProduct.name}</h3>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {products.map((p, i) => (
          <li key={p.name}>
            <button
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono2 text-[10px] text-white/30">{String(i + 1).padStart(2, '0')}</span>
                <span className={`font-display text-xl transition-colors ${i === active ? 'text-[#D4AF37]' : 'text-white/70 group-hover:text-white'}`}>{p.name}</span>
              </span>
              <span className="hidden font-mono2 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:block">{p.spec}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Certification cards + fullscreen modal ---------- */
export function Certifications({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="grid gap-px overflow-hidden rounded-sm bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <motion.button
            key={c.title}
            onClick={() => setOpen(c)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#111111] p-8 text-left transition-colors duration-300 hover:bg-[#171512]"
          >
            <span className="font-mono2 text-[10px] tracking-[0.3em] text-[#B87333]">{c.code}</span>
            <h3 className="mt-4 font-display text-2xl text-white">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/45">{c.summary}</p>
            <Plus className="mt-6 h-4 w-4 text-[#D4AF37] transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.5} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" onClick={() => setOpen(null)} />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass relative w-full max-w-2xl rounded-sm p-10"
            >
              <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-5 top-5 text-white/50 hover:text-white">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <span className="font-mono2 text-[10px] tracking-[0.3em] text-[#D4AF37]">{open.code}</span>
              <h3 className="mt-4 font-display text-4xl text-white">{open.title}</h3>
              <p className="mt-5 leading-relaxed text-white/60">{open.detail}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                <div><dt className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/35">Issuing body</dt><dd className="mt-1 text-sm text-white/80">{open.issuer}</dd></div>
                <div><dt className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-white/35">Valid through</dt><dd className="mt-1 text-sm text-white/80">{open.valid}</dd></div>
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
