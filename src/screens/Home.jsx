import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StatusBar } from '../components/Chrome';
import Logo from '../components/Logo';
import Track from './Track';
import CbtSession from './CbtSession';
import { STREAK_DAY } from '../lib/progress';

// Оболочка приложения: рабочий таб-бар (Today / CBT / Track / Clinic / Community).
// Тап по CBT открывает гид-сессию на весь экран; Track — экран трекинга.
const TABS = [
  ['🏠', 'Today', 'today'],
  ['🧘‍♀️', 'CBT', 'cbt'],
  ['📈', 'Track', 'track'],
  ['🩺', 'Clinic', 'clinic'],
  ['👥', 'Community', 'community'],
];

export default function Home({ score, name, email }) {
  const overall = typeof score === 'object' && score ? score.overall ?? 0 : score ?? 0;
  const [tab, setTab] = useState('today');
  const [sos, setSos] = useState(false);

  // CBT-таб → полноэкранная сессия (без таб-бара), выход возвращает на Today.
  if (tab === 'cbt') {
    return (
      <CbtSession
        name={name}
        streakDay={STREAK_DAY}
        onExit={() => setTab('today')}
        onComplete={() => setTab('today')}
      />
    );
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="home">
        <div className="screen-body">
          {tab === 'today' && <Today overall={overall} onStartCbt={() => setTab('cbt')} onSos={() => setSos(true)} />}
          {tab === 'track' && <Track score={typeof score === 'object' ? score : { overall }} />}
          {(tab === 'clinic' || tab === 'community') && <ComingSoon tab={tab} />}
        </div>

        <nav className="tabbar">
          {TABS.map(([ic, label, key]) => (
            <button className={`tab${tab === key ? ' on' : ''}`} key={key} onClick={() => setTab(key)}>
              <span className="ti">{ic}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {sos && <Breathe onClose={() => setSos(false)} />}
    </div>
  );
}

// ── Today ────────────────────────────────────────────────────────────────────
function Today({ overall, onStartCbt, onSos }) {
  const haloRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !haloRef.current) return undefined;
    const tw = gsap.to(haloRef.current, { scale: 1.18, opacity: 0, duration: 2.2, ease: 'sine.out', repeat: -1 });
    return () => tw.kill();
  }, []);

  return (
    <div className="pad" style={{ paddingTop: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Logo variant="horizontal-dark" height={20} />
        <span className="daychip">🔥 Day {STREAK_DAY}</span>
      </div>
      <p className="tiny" style={{ marginTop: 18 }}>Good morning</p>
      <h2 className="title" style={{ marginTop: 4 }}>Let’s ease into today.</h2>

      <div className="row gap-12" style={{ marginTop: 18, gap: 12 }}>
        <div className="card" style={{ flex: 1 }}>
          <p className="tiny">Symptom Score</p>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 30, marginTop: 4 }}>{overall}</div>
          <p className="tiny" style={{ color: 'var(--sage)' }}>▼ easing this week</p>
        </div>
        <button className="card card-btn" style={{ flex: 1, textAlign: 'left' }} onClick={onStartCbt}>
          <p className="tiny">Today’s CBT</p>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 30, marginTop: 4 }}>10:00</div>
          <p className="tiny" style={{ color: 'var(--coral-deep)' }}>Start session →</p>
        </button>
      </div>

      <button className="session-cta" onClick={onStartCbt}>
        <span className="session-ic">🧘‍♀️</span>
        <span className="session-main">
          <b>Begin your day-{STREAK_DAY} session</b>
          <span className="tiny">Notice · Reframe · Soothe — 10 min</span>
        </span>
        <span className="session-arrow">→</span>
      </button>

      <div className="center" style={{ marginTop: 26 }}>
        <p className="tiny" style={{ marginBottom: 16 }}>Feeling a flash or a wave of anxiety?</p>
        <div style={{ position: 'relative', width: 190, height: 190, margin: '0 auto' }}>
          <div className="sos-halo" ref={haloRef} />
          <button className="sos-btn" onClick={onSos}>
            SOS
            <small>Tap to ease</small>
          </button>
        </div>
        <p className="tiny" style={{ marginTop: 18, maxWidth: 240, marginInline: 'auto' }}>
          A 60-second guided breath to ride out the moment.
        </p>
      </div>
    </div>
  );
}

// ── Заглушки для ещё не готовых табов ────────────────────────────────────────
function ComingSoon({ tab }) {
  const data = {
    clinic: ['🩺', 'Online clinic', 'Book a menopause-trained clinician and review HRT options — arriving soon.'],
    community: ['👥', 'Community', 'A 30,000-member support group and real HRT reviews — arriving soon.'],
  }[tab];
  return (
    <div className="pad coming" style={{ paddingTop: 40 }}>
      <div className="coming-ic">{data[0]}</div>
      <h2 className="title center" style={{ marginTop: 18 }}>{data[1]}</h2>
      <p className="lead center" style={{ marginTop: 10 }}>{data[2]}</p>
      <span className="coming-pill">Coming soon</span>
    </div>
  );
}

// ── Дыхательный оверлей (SOS) ────────────────────────────────────────────────
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
      tl.to(orbRef.current, { scale: 1.6, duration: 4, ease: 'sine.inOut' })
        .to(orbRef.current, { scale: 1.6, duration: 2 })
        .to(orbRef.current, { scale: 1.0, duration: 6, ease: 'sine.inOut' });
    });

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
