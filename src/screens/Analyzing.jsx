import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { StatusBar } from '../components/Chrome';

const STEPS = [
  'Reading your answers…',
  'Comparing with 200,000 women…',
  'Mapping your symptom domains…',
  'Building your Symptom Score…',
];

export default function Analyzing({ onDone }) {
  const root = useRef(null);
  const pctRef = useRef(null);
  const stepRef = useRef(null);
  const coreRef = useRef(null);
  const ringsRef = useRef([]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      // мягкое «дыхание» ядра
      gsap.to(coreRef.current, {
        scale: 1.08,
        duration: 1.6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      // расходящиеся кольца
      ringsRef.current.forEach((r, idx) => {
        gsap.fromTo(
          r,
          { scale: 0.7, opacity: 0.5 },
          {
            scale: 1.25,
            opacity: 0,
            duration: 2.4,
            ease: 'sine.out',
            repeat: -1,
            delay: idx * 0.8,
          }
        );
      });

      const tl = gsap.timeline({ onComplete: onDone });

      // счётчик 0 → 100
      const counter = { v: 0 };
      tl.to(counter, {
        v: 100,
        duration: 3.4,
        ease: 'power1.inOut',
        onUpdate: () => {
          if (pctRef.current) pctRef.current.textContent = `${Math.round(counter.v)}%`;
        },
      }, 0);

      // смена текстовых шагов
      STEPS.forEach((label, idx) => {
        const at = (idx / STEPS.length) * 3.4;
        tl.call(() => swapStep(label), null, at);
      });

      // лёгкий финальный «вздох» перед выходом
      tl.to(root.current, { opacity: 0.0, duration: 0.45, ease: 'power2.in' }, 3.35);
    }, root);

    function swapStep(label) {
      const el = stepRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        y: -6,
        duration: 0.25,
        onComplete: () => {
          el.textContent = label;
          gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 });
        },
      });
    }

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="screen">
      <StatusBar dark />
      <div className="analyze" ref={root}>
        <div className="orb">
          <div className="orb-ring" ref={(el) => el && (ringsRef.current[0] = el)} />
          <div className="orb-ring" ref={(el) => el && (ringsRef.current[1] = el)} />
          <div className="orb-ring" ref={(el) => el && (ringsRef.current[2] = el)} />
          <div className="orb-core" ref={coreRef} />
        </div>
        <div className="analyze-pct" ref={pctRef}>0%</div>
        <div className="analyze-step" ref={stepRef}>{STEPS[0]}</div>
      </div>
    </div>
  );
}
