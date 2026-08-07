import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function SectionLabel({ index, children }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="font-mono2 text-[11px] tracking-[0.35em] text-[#D4AF37]">{index}</span>
      <span className="h-px w-10 bg-[#D4AF37]/40" />
      <span className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-white/50">{children}</span>
    </div>
  );
}

export function Heading({ children, className = '' }) {
  return (
    <h2 className={`font-display text-[clamp(2.2rem,5.2vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white ${className}`}>
      {children}
    </h2>
  );
}

export function Rise({ children, delay = 0, y = 28, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Parallax image layer: image drifts slower than scroll + slow zoom */
export function ParallaxImage({ src, alt, className = '', strength = 90, scaleTo = 1.12, overlay = 'bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/35 to-[#0D0D0D]' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, scaleTo]);
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y, scale }}
        className="h-[118%] w-full -translate-y-[9%] object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
}

export function Counter({ value, decimals = 0, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setN(value); return; }
    const el = ref.current;
    if (!el) return;
    let raf;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1700;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        setN(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, reduce]);
  return (
    <span ref={ref} className={className}>
      {prefix}{n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export function MagneticButton({ children, variant = 'gold', className = '', ...props }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)'; };
  const styles = {
    gold: 'bg-[#D4AF37] text-[#0D0D0D] hover:bg-[#e6c451]',
    ghost: 'border border-[#D4AF37]/40 text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10',
  }[variant];
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] transition-[background,border,color,transform] duration-300 ease-out active:scale-[0.98] ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Particles({ count = 26, tone = '#D4AF37' }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const bits = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((i) => {
        const size = 1 + (i % 3);
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size, background: tone,
              left: `${(i * 37) % 100}%`,
              bottom: `${(i * 13) % 60}%`,
              opacity: 0.5,
              animation: `drift ${9 + (i % 7)}s linear ${i * 0.42}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
