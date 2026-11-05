import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StatusBar, Button } from '../components/Chrome';
import SplitText from '../components/reactbits/SplitText';
import { computeScore, colorForPct, summaryFor } from '../lib/score';

const R = 104;
const CIRC = 2 * Math.PI * R;

export default function SymptomScore({ answers, onContinue, ctaLabel = 'Personalise my plan →' }) {
  const { overall, breakdown, band } = useMemo(() => computeScore(answers), [answers]);
  const numRef = useRef(null);
  const ringRef = useRef(null);
  const [showBars, setShowBars] = useState(false);
  const topDomain = breakdown.find((d) => d.pct > 0) || breakdown[0];

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const offset = CIRC * (1 - overall / 100);

    if (reduce) {
      if (numRef.current) numRef.current.textContent = String(overall);
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(offset);
      setShowBars(true);
      return;
    }

    const ctx = gsap.context(() => {
      // кольцо заполняется
      gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: CIRC },
        { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out', delay: 0.25 }
      );
      // число считается вверх
      const counter = { v: 0 };
      gsap.to(counter, {
        v: overall,
        duration: 1.5,
        delay: 0.25,
        ease: 'power2.out',
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = String(Math.round(counter.v));
        },
      });
    });

    const t = setTimeout(() => setShowBars(true), 900);
    return () => {
      ctx.revert();
      clearTimeout(t);
    };
  }, [overall]);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body">
        <div className="pad" style={{ paddingTop: 14 }}>
          <p className="eyebrow center">Your Symptom Score</p>

          <div className="gauge-wrap" style={{ marginTop: 18 }}>
            <svg width="240" height="240" viewBox="0 0 240 240">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ec8a66" />
                  <stop offset="100%" stopColor="#b85c7c" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r={R} fill="none" stroke="var(--sand-2)" strokeWidth="16" />
              <circle
                ref={ringRef}
                cx="120"
                cy="120"
                r={R}
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC}
                transform="rotate(-90 120 120)"
              />
            </svg>
            <div className="gauge-num">
              <div className="gauge-score" ref={numRef}>0</div>
              <div className="gauge-of">out of 100</div>
            </div>
          </div>

          <div className="center" style={{ marginTop: 14 }}>
            <span className="sev-pill" style={{ background: 'var(--plum-soft)', color: 'var(--plum-deep)' }}>
              <span className="dot" style={{ background: band.color }} />
              {band.label} impact
            </span>
          </div>

          <div style={{ marginTop: 20 }}>
            <SplitText
              text={headlineFor(band.key)}
              tag="h2"
              className="title center"
              trigger="load"
              effect="rise"
              textAlign="center"
              duration={0.8}
              color="var(--ink)"
            />
          </div>
          <p className="lead center" style={{ marginTop: 12 }}>
            {summaryFor(band, topDomain)}
          </p>

          <div className="card" style={{ marginTop: 22 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <b style={{ fontSize: 15 }}>Where it shows up</b>
              <span className="tiny">by symptom area</span>
            </div>
            <div className="breakdown">
              {breakdown.map((d) => (
                <div className="bd-row" key={d.key}>
                  <div className="bd-head">
                    <span>{d.label}</span>
                    <b>{d.pct}</b>
                  </div>
                  <div className="bd-track">
                    <div
                      className="bd-fill"
                      style={{ width: showBars ? `${d.pct}%` : 0, background: colorForPct(d.pct) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="screen-foot">
        <Button onClick={onContinue} className="btn-lg">{ctaLabel}</Button>
      </div>
    </div>
  );
}

function headlineFor(key) {
  if (key === 'low') return 'A gentle plan keeps you here.';
  if (key === 'mid') return 'This is treatable — and you can start today.';
  return 'You deserve real relief, starting now.';
}
