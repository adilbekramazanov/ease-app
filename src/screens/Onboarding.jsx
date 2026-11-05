import { useState } from 'react';
import { StatusBar, Button } from '../components/Chrome';
import SplitText from '../components/reactbits/SplitText';
import Logo from '../components/Logo';

// ── Онбординг сразу после покупки ────────────────────────────────────────────
// Тёплое «добро пожаловать» + пара настроек, финал — запуск первой сессии CBT
// (главной фичи продукта). 4 шага: welcome → ритуал → фокус → как это работает.

const GOALS = {
  sleep: { emoji: '🌙', label: 'sleeping through the night' },
  flashes: { emoji: '🔥', label: 'cooling your hot flashes' },
  mood: { emoji: '💗', label: 'steadying your mood' },
  focus: { emoji: '✨', label: 'clearing the brain fog' },
  self: { emoji: '🌸', label: 'feeling like yourself again' },
};

const TIMES = [
  { id: 'morning', emoji: '🌤️', label: 'Morning', time: '8:00' },
  { id: 'midday', emoji: '🥪', label: 'Midday', time: '13:00' },
  { id: 'evening', emoji: '🌆', label: 'Evening', time: '20:00' },
  { id: 'night', emoji: '🌙', label: 'Before bed', time: '22:00' },
];

const HOW = [
  ['👁️', 'Notice', 'Catch the anxious thought behind the moment — on the page, out of your head.'],
  ['🔄', 'Reframe', 'Trade it for something kinder and truer, the way you would for a friend.'],
  ['🫧', 'Soothe', 'Settle your body with paced breathing, so the calm actually lands.'],
];

export default function Onboarding({ name, goal, score, onLaunch }) {
  const [i, setI] = useState(0);
  const [time, setTime] = useState('evening');
  const g = GOALS[goal] || { emoji: '🌸', label: 'feeling steadier' };
  const top = score?.breakdown?.filter((d) => d.pct > 0).slice(0, 3) || [];
  const next = () => setI((v) => v + 1);

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body">
        <div className="pad fade-step" key={i} style={{ paddingTop: 16 }}>
          {i === 0 && (
            <div className="ob-welcome">
              <div className="center" style={{ marginTop: 6 }}>
                <Logo variant="stacked-dark" height={132} className="ob-logo" />
              </div>
              <p className="eyebrow center" style={{ marginTop: 24 }}>Welcome to ease</p>
              <div style={{ marginTop: 10 }}>
                <SplitText
                  text={name ? `You’re in, ${name}.` : 'You’re in.'}
                  tag="h1"
                  className="display center"
                  trigger="load"
                  effect="rise"
                  textAlign="center"
                  duration={0.8}
                  color="var(--ink)"
                />
              </div>
              <p className="lead center" style={{ marginTop: 14 }}>
                Your plan is ready and your first session is waiting. Let’s set things up —
                it takes about a minute.
              </p>
            </div>
          )}

          {i === 1 && (
            <>
              <p className="eyebrow">Your daily ritual</p>
              <h2 className="title" style={{ marginTop: 10 }}>When should ease check in?</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Pick a time for one gentle nudge a day. Consistency is what makes CBT work —
                nothing more, no noise.
              </p>
              <div className="time-grid" style={{ marginTop: 20 }}>
                {TIMES.map((t) => (
                  <button
                    key={t.id}
                    className={`time-opt${time === t.id ? ' on' : ''}`}
                    onClick={() => setTime(t.id)}
                  >
                    <span className="time-e">{t.emoji}</span>
                    <span className="time-l">{t.label}</span>
                    <span className="time-t">{t.time}</span>
                  </button>
                ))}
              </div>
              <p className="tiny" style={{ marginTop: 16, textAlign: 'center' }}>
                🔔 You can change this anytime in Settings.
              </p>
            </>
          )}

          {i === 2 && (
            <>
              <p className="eyebrow">Tuned to you</p>
              <h2 className="title" style={{ marginTop: 10 }}>
                We’ll start with {g.label}.
              </h2>
              <div className="ob-focus" style={{ marginTop: 18 }}>
                <div className="ob-focus-ic">{g.emoji}</div>
                <p>
                  Based on your answers, your plan leads with what you asked for most — then
                  widens as you track.
                </p>
              </div>
              {top.length > 0 && (
                <>
                  <p className="lead" style={{ marginTop: 22, fontSize: 15 }}>Your plan also keeps an eye on:</p>
                  <div className="chips" style={{ marginTop: 12 }}>
                    {top.map((d) => (
                      <span className="chip static" key={d.key}>{d.label}</span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {i === 3 && (
            <>
              <p className="eyebrow">How your 10 minutes work</p>
              <h2 className="title" style={{ marginTop: 10 }}>Three steps, every session.</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                This is CBT — clinically shown to ease the distress of hot flashes, sleep and
                low mood. Here’s the shape of it.
              </p>
              <div className="how-list" style={{ marginTop: 20 }}>
                {HOW.map(([ic, title, body], n) => (
                  <div className="how-step" key={title}>
                    <div className="how-num">{n + 1}</div>
                    <div className="how-ic">{ic}</div>
                    <div>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="screen-foot">
        {i < 3 ? (
          <Button className="btn-lg" onClick={next}>
            {i === 0 ? 'Set me up' : 'Continue'}
          </Button>
        ) : (
          <Button className="btn-lg" onClick={onLaunch}>Start my first session →</Button>
        )}
        <div className="ob-dots" style={{ marginTop: 14 }}>
          {[0, 1, 2, 3].map((n) => (
            <span key={n} className={`ob-dot${n === i ? ' on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
