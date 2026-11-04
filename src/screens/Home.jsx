import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StatusBar } from '../components/Chrome';

// Домашний экран приложения: ядро — большая кнопка SOS (быстрое CBT-дыхание
// в момент прилива / тревоги). Плюс лёгкий дашборд и таб-бар.
export default function Home({ score = 0, email }) {
  const [sos, setSos] = useState(false);
  const haloRef = useRef(null);

  useEffect(() => {
    if (sos) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !haloRef.current) return undefined;
    const tw = gsap.to(haloRef.current, {
      scale: 1.18,
      opacity: 0,
      duration: 2.2,
      ease: 'sine.out',
      repeat: -1,
    });
    return () => tw.kill();
  }, [sos]);

  return (
    <div className="screen">
      <StatusBar />
      <div className="home">
        <div className="screen-body">
          <div className="pad" style={{ paddingTop: 10 }}>
            <p className="tiny">Good morning 🌤️</p>
            <h2 className="title" style={{ marginTop: 4 }}>Let’s ease into today.</h2>

            <div className="row gap-12" style={{ marginTop: 18, gap: 12 }}>
              <div className="card" style={{ flex: 1 }}>
                <p className="tiny">Symptom Score</p>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 30, marginTop: 4 }}>{score}</div>
                <p className="tiny" style={{ color: 'var(--sage)' }}>▼ tracking weekly</p>
              </div>
              <div className="card" style={{ flex: 1 }}>
                <p className="tiny">Today’s CBT</p>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 30, marginTop: 4 }}>15:00</div>
                <p className="tiny">Calm & sleep</p>
              </div>
            </div>

            <div className="center" style={{ marginTop: 34 }}>
              <p className="tiny" style={{ marginBottom: 16 }}>Feeling a flash or a wave of anxiety?</p>
              <div style={{ position: 'relative', width: 190, height: 190, margin: '0 auto' }}>
                <div className="sos-halo" ref={haloRef} />
                <button className="sos-btn" onClick={() => setSos(true)}>
                  SOS
                  <small>Tap to ease</small>
                </button>
              </div>
              <p className="tiny" style={{ marginTop: 18, maxWidth: 240, marginInline: 'auto' }}>
                A 60-second guided breath to ride out the moment.
              </p>
            </div>
          </div>
        </div>

        <div className="tabbar">
          {[['🏠', 'Today', true], ['🧘‍♀️', 'CBT', false], ['📈', 'Track', false], ['🩺', 'Clinic', false], ['👥', 'Community', false]].map(
            ([ic, label, on]) => (
              <button className={`tab${on ? ' on' : ''}`} key={label}>
                <span className="ti">{ic}</span>
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {sos && <Breathe onClose={() => setSos(false)} />}
    </div>
  );
}

const CYCLE = [
  ['Breathe in', 4000],
  ['Hold', 2000],
  ['Breathe out', 6000],
];

function Breathe({ onClose }) {
  const orbRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      if (reduce) return;
      // вдох — орб растёт, выдох — сжимается
      tl.to(orbRef.current, { scale: 1.6, duration: 4, ease: 'sine.inOut' })
        .to(orbRef.current, { scale: 1.6, duration: 2 })
        .to(orbRef.current, { scale: 1.0, duration: 6, ease: 'sine.inOut' });
    });

    // смена подписи синхронно с циклом
    let idx = 0;
    const setWord = () => {
      if (wordRef.current) wordRef.current.textContent = CYCLE[idx][0];
      const dur = CYCLE[idx][1];
      idx = (idx + 1) % CYCLE.length;
      return dur;
    };
    let timer;
    const loop = () => {
      const dur = setWord();
      timer = setTimeout(loop, dur);
    };
    loop();

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="breathe">
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute', top: 54, right: 22, width: 36, height: 36, borderRadius: '50%',
          border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', fontSize: 18,
        }}
      >
        ✕
      </button>
      <div className="breathe-orb" ref={orbRef} />
      <div className="breathe-word" ref={wordRef}>Breathe in</div>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 14 }}>Follow the orb · 60 seconds</p>
    </div>
  );
}
