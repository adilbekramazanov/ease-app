import { useRef, useState } from 'react';
import { StatusBar, Button } from '../components/Chrome';
import { useLenis } from '../lib/smoothScroll';

const PLANS = [
  { id: '1w', name: '1 week', sub: 'Dip a toe in', price: '$9.99', per: '$1.43 / day' },
  { id: '4w', name: '4 weeks', sub: 'Build the habit', price: '$29.99', per: '$1.07 / day', badge: 'Most popular' },
  { id: '12w', name: '12 weeks', sub: 'Full reset', price: '$59.99', per: '$0.71 / day', badge: 'Best value' },
];

const FEATURES = [
  ['🧘‍♀️', '15 minutes a day of CBT', 'Guided, clinically-backed sessions that calm hot flashes, sleep and mood.'],
  ['📈', 'Symptom tracking', 'Watch your Symptom Score improve week over week.'],
  ['🩺', 'Online clinic & HRT', 'Menopause-trained clinicians can prescribe HRT, with a plan to match.'],
  ['🥗', '12-week body plan', 'Meal plans, 3,000+ recipes, wall pilates, chair yoga & an AI calorie coach.'],
  ['💬', 'Reviews & community', 'HRT reviews by real users and a 30,000-member support group.'],
];

const CREDS = ['🏅 Apple Editors’ Choice', '🇬🇧 ORCHA-certified (NHS)', '🔬 Evidence-based'];

export default function Paywall({ onPurchase, onBack, goal }) {
  const bodyRef = useRef(null);
  const [sel, setSel] = useState('4w');
  useLenis(bodyRef, []);

  const plan = PLANS.find((p) => p.id === sel);

  return (
    <div className="screen">
      <StatusBar dark />
      {/* статус-бар поверх тёмного героя — поэтому absolute-кнопка закрытия */}
      <button
        onClick={onBack}
        aria-label="Close"
        style={{
          position: 'absolute', top: 52, right: 20, zIndex: 10,
          width: 34, height: 34, borderRadius: '50%', border: 'none',
          background: 'rgba(255,255,255,0.16)', color: '#fff', fontSize: 18,
        }}
      >
        ✕
      </button>

      <div className="screen-body" ref={bodyRef} style={{ marginTop: -50 }}>
        <div className="paywall-hero" style={{ paddingTop: 64 }}>
          <p className="eyebrow" style={{ color: '#f3c6b4' }}>Your plan is ready</p>
          <h1 className="display" style={{ color: '#fff', marginTop: 12 }}>
            Menopause, eased in 15 minutes a day.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', marginTop: 14, fontSize: 16, lineHeight: 1.5 }}>
            {goalLine(goal)} ease brings CBT, tracking and real clinical care into one calm place.
          </p>
        </div>

        <div className="pad" style={{ paddingTop: 22 }}>
          <div className="credsrow">
            {CREDS.map((c) => <span className="cred" key={c}>{c}</span>)}
          </div>

          <div style={{ marginTop: 22 }}>
            {FEATURES.map(([ic, title, body]) => (
              <div className="feature-row" key={title}>
                <div className="fi">{ic}</div>
                <div>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 14, background: 'var(--plum-soft)', border: 'none' }}>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 18, lineHeight: 1.4, color: 'var(--plum-deep)' }}>
              “I slept through the night for the first time in two years. The daily CBT
              actually works.”
            </p>
            <p className="tiny" style={{ marginTop: 10 }}>— Marianne, 53 · 6 weeks on ease</p>
          </div>

          <h3 className="title" style={{ marginTop: 28 }}>Choose your intro plan</h3>
          <p className="tiny" style={{ marginTop: 6, marginBottom: 14 }}>
            Intro pricing · no free trial · cancel anytime.
          </p>

          <div className="stack gap-12">
            {PLANS.map((p) => (
              <button
                key={p.id}
                className={`plan${sel === p.id ? ' on' : ''}`}
                onClick={() => setSel(p.id)}
              >
                {p.badge && <span className="badge">{p.badge}</span>}
                <span className="plan-radio" />
                <span className="plan-main">
                  <span className="plan-name">{p.name}</span>
                  <span className="plan-sub">{p.sub}</span>
                </span>
                <span className="plan-price">
                  <b>{p.price}</b>
                  <span>{p.per}</span>
                </span>
              </button>
            ))}
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <div className="screen-foot">
        <Button onClick={() => onPurchase(plan)} className="btn-lg">
          Start ease — {plan.price}
        </Button>
        <p className="tiny center" style={{ marginTop: 10 }}>
          You’ll be charged {plan.price} for {plan.name.toLowerCase()}. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

function goalLine(goal) {
  const map = {
    sleep: 'To help you sleep through the night,',
    flashes: 'To cool down those hot flashes,',
    mood: 'To steady your mood,',
    focus: 'To clear the brain fog,',
    self: 'To help you feel like yourself again,',
  };
  return map[goal] || 'Built around what you told us,';
}
