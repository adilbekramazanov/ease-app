import { useState } from 'react';
import Logo from '../components/Logo';
import { weeklyScores, DAY_LABELS, STREAK_DAY, moodOf } from '../lib/progress';
import { bandOf, colorForPct } from '../lib/score';

// Экран Track — трекинг симптомов за неделю (день 7). Контент внутри оболочки
// Home (таб-бар рисует Home), поэтому обёртки .screen здесь нет.
export default function Track({ score, sessions = [] }) {
  const overall = score?.overall ?? 0;
  const breakdown = (score?.breakdown ?? []).filter((d) => d.pct > 0).slice(0, 4);
  const series = weeklyScores(overall);
  const today = series[series.length - 1];
  const delta = today - series[0]; // отрицательное = улучшение
  const band = bandOf(today);
  const [logged, setLogged] = useState(false);

  // геометрия графика
  const W = 320, H = 140, x0 = 14, x1 = 306, yT = 12, yB = 108;
  const x = (i) => x0 + (i / (series.length - 1)) * (x1 - x0);
  const y = (v) => yT + ((100 - v) / 100) * (yB - yT);
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x1} ${yB} L${x0} ${yB} Z`;

  return (
    <div className="pad" style={{ paddingTop: 10 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Logo variant="horizontal-dark" height={20} />
        <span className="tiny">This week</span>
      </div>

      <h2 className="title" style={{ marginTop: 16 }}>Your week, trending down.</h2>
      <p className="lead" style={{ marginTop: 8, fontSize: 15 }}>
        Seven days of showing up is already moving your Symptom Score.
      </p>

      {/* текущий балл + недельная дельта */}
      <div className="card" style={{ marginTop: 18 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="tiny">Symptom Score · today</p>
            <div className="row" style={{ gap: 10, alignItems: 'baseline', marginTop: 2 }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 44, lineHeight: 1 }}>{today}</span>
              <span className="sev-pill" style={{ background: 'var(--plum-soft)', color: 'var(--plum-deep)', padding: '5px 11px' }}>
                <span className="dot" style={{ background: band.color }} />
                {band.label}
              </span>
            </div>
          </div>
          <span className={`trend-delta ${delta < 0 ? 'good' : 'flat'}`}>
            {delta < 0 ? `▼ ${Math.abs(delta)}` : delta > 0 ? `▲ ${delta}` : '—'}
            <small>7 days</small>
          </span>
        </div>

        {/* график тренда */}
        <svg className="trend" viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Symptom score trend">
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(224,120,86,0.26)" />
              <stop offset="100%" stopColor="rgba(224,120,86,0)" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((gy) => (
            <line key={gy} x1={x0} x2={x1} y1={y(gy)} y2={y(gy)} stroke="var(--line)" strokeDasharray="2 5" />
          ))}
          <path d={area} fill="url(#trendFill)" />
          <path d={line} fill="none" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {series.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={i === series.length - 1 ? 6 : 3.5}
              fill={i === series.length - 1 ? 'var(--coral)' : '#fff'}
              stroke="var(--coral)"
              strokeWidth={i === series.length - 1 ? 3 : 2}
            />
          ))}
          {DAY_LABELS.map((d, i) => (
            <text key={d} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--muted)">
              {i === series.length - 1 ? 'Today' : d}
            </text>
          ))}
        </svg>
      </div>

      {/* залогированные сегодня CBT-сессии */}
      {sessions.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <b style={{ fontSize: 15 }}>Today’s sessions</b>
            <span className="tiny">{sessions.length} logged</span>
          </div>
          <div className="stack gap-12">
            {sessions.map((s, idx) => <SessionLog key={s.ts || idx} s={s} />)}
          </div>
        </div>
      )}

      {/* стрик */}
      <div className="streak" style={{ marginTop: 16 }}>
        <span className="streak-flame">🔥</span>
        <div>
          <b>{STREAK_DAY}-day streak</b>
          <p className="tiny" style={{ marginTop: 2 }}>You’ve checked in every day this week. Keep it alive.</p>
        </div>
      </div>

      {/* недельные чек-ины */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <b style={{ fontSize: 15 }}>Daily check-ins</b>
          <span className="tiny">{STREAK_DAY} / 7</span>
        </div>
        <div className="weekdots">
          {DAY_LABELS.map((d, i) => (
            <div className="weekdot-wrap" key={d}>
              <div className={`weekdot${i < STREAK_DAY ? ' done' : ''}`}>{i < STREAK_DAY ? '✓' : ''}</div>
              <span className="tiny">{i === series.length - 1 ? 'Now' : d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* разбивка по симптомам */}
      {breakdown.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <b style={{ fontSize: 15 }}>By symptom area</b>
            <span className="tiny">easing ▼</span>
          </div>
          <div className="breakdown">
            {breakdown.map((d) => (
              <div className="bd-row" key={d.key}>
                <div className="bd-head">
                  <span>{d.label}</span>
                  <b>{d.pct}</b>
                </div>
                <div className="bd-track">
                  <div className="bd-fill" style={{ width: `${d.pct}%`, background: colorForPct(d.pct) }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className={`btn ${logged ? 'btn-ghost' : 'btn-primary'} btn-lg`}
        style={{ marginTop: 18 }}
        onClick={() => setLogged(true)}
        disabled={logged}
      >
        {logged ? 'Logged ✓ · see you tomorrow' : 'Log today’s check-in'}
      </button>
      <div style={{ height: 8 }} />
    </div>
  );
}

// Одна залогированная CBT-сессия: настроение до→после + переосмысленная мысль.
function SessionLog({ s }) {
  const before = moodOf(s.moodBefore);
  const after = moodOf(s.moodAfter);
  const delta = (s.moodAfter ?? 0) - (s.moodBefore ?? 0);
  const label = delta > 0 ? `Lifted ${delta} ${delta === 1 ? 'step' : 'steps'}` : delta < 0 ? 'Showed up' : 'Steady';
  return (
    <div className="sesslog">
      <div className="sesslog-mood">
        <span>{before?.e || '·'}</span>
        <span className="sesslog-arrow">→</span>
        <span>{after?.e || '·'}</span>
      </div>
      <div className="sesslog-body">
        <b>{label}</b>
        <p className="tiny">{s.reframe ? `“${s.reframe}”` : 'Session complete'}</p>
      </div>
      <span className="tiny sesslog-time">just now</span>
    </div>
  );
}
