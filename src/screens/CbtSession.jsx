import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StatusBar, Button } from '../components/Chrome';
import { MOODS } from '../lib/progress';

// ── Главная фича ease: гид-сессия CBT на 15 минут ────────────────────────────
// Поток: Settle → Notice (момент + мысль) → Reframe → Soothe (дыхание) → Close.
// Это ядро продукта — реальная структура когнитивной работы, не заглушка.

// Пятибалльная шкала настроения (MOODS) берётся из lib/progress — общая с Track.

// Типовые менопаузальные «моменты» + заготовка автоматической мысли и
// варианты сбалансированной переоценки под каждый.
const MOMENTS = [
  {
    id: 'flash',
    emoji: '🔥',
    label: 'A hot flash caught me off guard',
    thought: 'Everyone can see me losing control — I can’t cope with this.',
    reframes: [
      'This wave will peak and pass in a few minutes — it always does.',
      'A flash is uncomfortable, not dangerous. I can breathe through it.',
      'Most people barely notice. I’m allowed to just ride this out.',
    ],
  },
  {
    id: 'sleep',
    emoji: '🌙',
    label: 'I couldn’t sleep again',
    thought: 'If I don’t sleep now, tomorrow will be completely ruined.',
    reframes: [
      'Rest still counts, even without perfect sleep. My body keeps recovering.',
      'One rough night doesn’t decide tomorrow — I’ve coped before.',
      'Lying here calmly is enough. Sleep comes easier when I stop chasing it.',
    ],
  },
  {
    id: 'snap',
    emoji: '💢',
    label: 'I snapped at someone I love',
    thought: 'I’m becoming someone awful — they’ll give up on me.',
    reframes: [
      'I reacted to how I felt, not to who they are. I can repair this.',
      'One sharp moment doesn’t erase years of love between us.',
      'My body amplified that feeling. I can name it and make it right.',
    ],
  },
  {
    id: 'self',
    emoji: '🌫️',
    label: 'I don’t feel like myself',
    thought: 'I’ve lost who I was, and I’m never getting her back.',
    reframes: [
      'I’m changing, not disappearing. This chapter has another side.',
      'The parts of me I value are still here, under the fog.',
      'Many women come through this feeling more themselves, not less.',
    ],
  },
  {
    id: 'other',
    emoji: '✍️',
    label: 'Something else is weighing on me',
    thought: '',
    reframes: [
      'This feeling is real — and it is also temporary.',
      'I can be struggling and still be doing okay.',
      'I don’t have to fix everything tonight.',
    ],
  },
];

// Когнитивные искажения — называем их, это часть психообразования CBT.
const TRAPS = [
  'Catastrophising',
  'Mind-reading',
  'All-or-nothing',
  '“Should” pressure',
  'Blaming myself',
];

// Экраны сессии и к какой «стадии» они относятся (для подписи сверху).
const STEPS = [
  { key: 'settle', stage: 'Settle' },
  { key: 'moment', stage: 'Notice' },
  { key: 'thought', stage: 'Notice' },
  { key: 'reframe', stage: 'Reframe' },
  { key: 'breath', stage: 'Soothe' },
  { key: 'close', stage: 'Close' },
];

export default function CbtSession({ name, onComplete, onExit, streakDay = 1 }) {
  const [i, setI] = useState(0);
  const [moodBefore, setMoodBefore] = useState(null);
  const [momentId, setMomentId] = useState(null);
  const [thought, setThought] = useState('');
  const [belief, setBelief] = useState(70);
  const [traps, setTraps] = useState([]);
  const [reframe, setReframe] = useState('');
  const [moodAfter, setMoodAfter] = useState(null);
  const [outro, setOutro] = useState(false);

  const step = STEPS[i];
  const moment = useMemo(() => MOMENTS.find((m) => m.id === momentId), [momentId]);
  const progress = ((i + 1) / STEPS.length) * 100;

  const next = () => setI((v) => Math.min(v + 1, STEPS.length - 1));
  const back = () => setI((v) => Math.max(v - 1, 0));

  // Выбор момента подставляет заготовку мысли (её можно переписать).
  const pickMoment = (m) => {
    setMomentId(m.id);
    setThought(m.thought);
    setI((v) => v + 1);
  };

  const toggleTrap = (t) =>
    setTraps((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  // Можно ли идти дальше с текущего экрана.
  const canContinue =
    (step.key === 'settle' && moodBefore != null) ||
    (step.key === 'thought' && thought.trim().length > 0) ||
    (step.key === 'reframe' && reframe.trim().length > 0) ||
    (step.key === 'close' && moodAfter != null) ||
    step.key === 'breath';

  // Успокаивающий финал: анимированная цитата + стрик, затем мягко отдаём на главный экран.
  if (outro) {
    return (
      <Outro
        reframe={reframe}
        streakDay={streakDay}
        onDone={() => onComplete?.({ moodBefore, moodAfter, reframe, belief })}
      />
    );
  }

  return (
    <div className="screen">
      <StatusBar />
      <div className="quiz-top">
        <button
          className="iconbtn"
          onClick={i === 0 ? () => onExit?.() : back}
          disabled={i === 0 && !onExit}
          aria-label={i === 0 ? 'Close' : 'Back'}
          style={i === 0 && !onExit ? { opacity: 0.35 } : undefined}
        >
          {i === 0 && onExit ? '✕' : '‹'}
        </button>
        <div className="progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <span className="progress-count">{step.stage}</span>
      </div>

      <div className="screen-body">
        <div className="pad fade-step" key={step.key} style={{ paddingTop: 10 }}>
          {step.key === 'settle' && (
            <Settle name={name} value={moodBefore} onPick={setMoodBefore} />
          )}

          {step.key === 'moment' && (
            <>
              <p className="eyebrow">Notice · step 1</p>
              <h2 className="title" style={{ marginTop: 10 }}>What’s weighing on you right now?</h2>
              <p className="lead" style={{ marginTop: 10 }}>Pick the moment that fits best. We’ll work through it together.</p>
              <div className="choices" style={{ marginTop: 20 }}>
                {MOMENTS.map((m) => (
                  <button key={m.id} className="choice" onClick={() => pickMoment(m)}>
                    <span className="emoji">{m.emoji}</span>
                    <span>{m.label}</span>
                    <span className="check" style={{ marginLeft: 'auto' }}>›</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step.key === 'thought' && (
            <>
              <p className="eyebrow">Notice · step 2</p>
              <h2 className="title" style={{ marginTop: 10 }}>What did your mind tell you?</h2>
              <p className="lead" style={{ marginTop: 10 }}>
                The thought that showed up in that moment — in your own words. No one else sees this.
              </p>
              <textarea
                className="field field-area"
                style={{ marginTop: 18 }}
                rows={3}
                value={thought}
                placeholder="e.g. I can’t handle this…"
                onChange={(e) => setThought(e.target.value)}
                autoFocus
              />
              <div className="belief">
                <div className="belief-head">
                  <span>How much do you believe it?</span>
                  <b>{belief}%</b>
                </div>
                <input
                  className="range"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={belief}
                  onChange={(e) => setBelief(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {step.key === 'reframe' && (
            <>
              <p className="eyebrow">Reframe</p>
              <h2 className="title" style={{ marginTop: 10 }}>Let’s find a kinder, truer thought.</h2>
              {thought && (
                <div className="quote-card" style={{ marginTop: 16 }}>
                  <span className="tiny">You noticed</span>
                  <p>“{thought}”</p>
                </div>
              )}

              <p className="lead" style={{ marginTop: 18, fontSize: 15 }}>
                Spot any thinking traps at play? Naming them loosens their grip.
              </p>
              <div className="chips" style={{ marginTop: 12 }}>
                {TRAPS.map((t) => (
                  <button
                    key={t}
                    className={`chip${traps.includes(t) ? ' on' : ''}`}
                    onClick={() => toggleTrap(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="lead" style={{ marginTop: 22, fontSize: 15 }}>
                Now a response you’d offer a dear friend. Tap one to start, then make it yours.
              </p>
              <div className="suggest" style={{ marginTop: 12 }}>
                {(moment?.reframes || []).map((r) => (
                  <button key={r} className="suggest-item" onClick={() => setReframe(r)}>
                    <span className="suggest-ic">✎</span>
                    <span>{r}</span>
                  </button>
                ))}
              </div>
              <textarea
                className="field field-area"
                style={{ marginTop: 14 }}
                rows={3}
                value={reframe}
                placeholder="A kinder, more balanced thought…"
                onChange={(e) => setReframe(e.target.value)}
              />
            </>
          )}

          {step.key === 'breath' && <Soothe />}

          {step.key === 'close' && (
            <Close
              moodBefore={moodBefore}
              moodAfter={moodAfter}
              onPick={setMoodAfter}
              reframe={reframe}
              belief={belief}
              streakDay={streakDay}
            />
          )}
        </div>
      </div>

      {step.key !== 'moment' && (
        <div className="screen-foot">
          {step.key === 'close' ? (
            <Button className="btn-lg" disabled={!canContinue} onClick={() => setOutro(true)}>
              Finish session
            </Button>
          ) : step.key === 'breath' ? (
            <Button className="btn-lg" onClick={next}>I feel steadier →</Button>
          ) : (
            <Button className="btn-lg" disabled={!canContinue} onClick={next}>
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Settle: тёплый вход + проверка настроения до работы ──────────────────────
function Settle({ name, value, onPick }) {
  return (
    <>
      <p className="eyebrow">Your 10-minute session</p>
      <h2 className="display" style={{ marginTop: 12 }}>
        {name ? `Hi ${name}. ` : ''}Let’s begin.
      </h2>
      <p className="lead" style={{ marginTop: 12 }}>
        Find a comfortable spot. Before we start, a quick check-in — there’s no wrong answer.
      </p>
      <h3 className="title" style={{ fontSize: 20, marginTop: 26 }}>How are you feeling right now?</h3>
      <MoodRow value={value} onPick={onPick} />
    </>
  );
}

// ── Soothe: размеренное дыхание 4-2-6, синхронная подпись ─────────────────────
const CYCLE = [
  ['Breathe in', 4000],
  ['Hold', 2000],
  ['Breathe out', 6000],
];

function Soothe() {
  const orbRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(orbRef.current, { scale: 1.5, duration: 4, ease: 'sine.inOut' })
        .to(orbRef.current, { scale: 1.5, duration: 2 })
        .to(orbRef.current, { scale: 1.0, duration: 6, ease: 'sine.inOut' });
    });

    let idx = 0;
    let timer;
    const tick = () => {
      if (wordRef.current) wordRef.current.textContent = CYCLE[idx][0];
      const dur = CYCLE[idx][1];
      idx = (idx + 1) % CYCLE.length;
      timer = setTimeout(tick, dur);
    };
    tick();

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="cbt-breath">
      <p className="eyebrow center" style={{ color: 'var(--plum)' }}>Soothe</p>
      <h2 className="title center" style={{ marginTop: 10 }}>Let your body catch up.</h2>
      <p className="lead center" style={{ marginTop: 8, fontSize: 15 }}>
        Follow the orb for a few rounds. Longer out-breaths settle the nervous system.
      </p>
      <div className="breath-stage">
        <div className="breath-orb-sm" ref={orbRef} />
      </div>
      <div className="breath-word" ref={wordRef}>Breathe in</div>
    </div>
  );
}

// ── Close: повторная оценка, дельта, вывод-напоминание, стрик ─────────────────
function Close({ moodBefore, moodAfter, onPick, reframe, belief, streakDay = 1 }) {
  const delta = moodAfter != null && moodBefore != null ? moodAfter - moodBefore : null;
  const first = streakDay <= 1;

  return (
    <>
      <p className="eyebrow">Close</p>
      <h2 className="title" style={{ marginTop: 10 }}>How do you feel now?</h2>
      <p className="lead" style={{ marginTop: 10 }}>Same question, one more time. Notice any shift.</p>
      <MoodRow value={moodAfter} onPick={onPick} />

      {delta != null && (
        <div className={`delta ${delta > 0 ? 'up' : delta < 0 ? 'flat' : 'flat'}`} style={{ marginTop: 20 }}>
          {delta > 0
            ? `You lifted ${delta} ${delta === 1 ? 'step' : 'steps'} in a few minutes. That’s the work paying off.`
            : delta === 0
            ? 'Steady is a win too — you showed up and stayed with it.'
            : 'Some days just holding on is enough. You still did the work.'}
        </div>
      )}

      {reframe && (
        <div className="takeaway" style={{ marginTop: 20 }}>
          <span className="tiny">Carry this with you</span>
          <p>“{reframe}”</p>
          {belief != null && <span className="tiny" style={{ marginTop: 8, display: 'block' }}>Belief in the old thought: now easier to set down.</span>}
        </div>
      )}

      <div className="streak" style={{ marginTop: 20 }}>
        <span className="streak-flame">🔥</span>
        <div>
          <b>{first ? 'Day 1 · streak started' : `Day ${streakDay} · ${streakDay}-day streak`}</b>
          <p className="tiny" style={{ marginTop: 2 }}>
            {first ? 'Come back tomorrow to keep it alive.' : 'A full week of showing up. Keep it going.'}
          </p>
        </div>
      </div>
    </>
  );
}

// ── Общий ряд выбора настроения ──────────────────────────────────────────────
function MoodRow({ value, onPick }) {
  return (
    <div className="mood-row" style={{ marginTop: 16 }}>
      {MOODS.map((m) => (
        <button
          key={m.v}
          className={`mood-opt${value === m.v ? ' on' : ''}`}
          onClick={() => onPick(m.v)}
        >
          <span className="mood-e">{m.e}</span>
          <span className="mood-l">{m.l}</span>
        </button>
      ))}
    </div>
  );
}

// ── Финальный успокаивающий экран: цитата + стрик, затем мягкое затухание ─────
function Outro({ reframe, streakDay, onDone }) {
  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const quoteRef = useRef(null);
  const streakRef = useRef(null);
  const fired = useRef(false);

  const finish = () => {
    if (!fired.current) {
      fired.current = true;
      onDone?.();
    }
  };

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      const t = setTimeout(finish, 1600);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, { scale: 1.14, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap
        .timeline()
        .from(quoteRef.current, { opacity: 0, y: 16, duration: 1.0, ease: 'power2.out', delay: 0.3 })
        .from(streakRef.current, { opacity: 0, y: 12, duration: 0.7, ease: 'power2.out' }, '-=0.15')
        .to({}, { duration: 1.1 }) // держим пару секунд
        .to(rootRef.current, { opacity: 0, duration: 0.65, ease: 'power1.inOut', onComplete: finish });
    }, rootRef);

    const safety = setTimeout(finish, 4600);
    return () => {
      ctx.revert();
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="session-outro" ref={rootRef} onClick={finish}>
      <div className="outro-orb" ref={orbRef} />
      <p className="outro-eyebrow">Session complete</p>
      <p className="outro-quote" ref={quoteRef}>
        {reframe ? `“${reframe}”` : 'You showed up for yourself today.'}
      </p>
      <div className="outro-streak" ref={streakRef}>
        <span>🔥</span>
        {streakDay > 1 ? `Day ${streakDay} · ${streakDay}-day streak` : 'Day 1 · streak started'}
      </div>
      <p className="outro-hint">Breathe out. We’ll take you home.</p>
    </div>
  );
}
