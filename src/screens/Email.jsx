import { useState } from 'react';
import { StatusBar, Button } from '../components/Chrome';

export default function Email({ onSubmit, onBack }) {
  const [email, setEmail] = useState('');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="screen">
      <StatusBar />
      <div className="quiz-top">
        <button className="iconbtn" onClick={onBack} aria-label="Back">‹</button>
        <div className="progress"><div className="progress-fill" style={{ width: '100%' }} /></div>
        <span className="progress-count" style={{ opacity: 0 }}>·</span>
      </div>

      <div className="screen-body">
        <div className="pad" style={{ paddingTop: 22 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18, background: 'var(--coral-soft)',
            display: 'grid', placeItems: 'center', fontSize: 26,
          }}>💌</div>

          <h2 className="display" style={{ marginTop: 20 }}>Where should we send your plan?</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            We’ll save your Symptom Score and email you a personalised menopause plan —
            built around <b>10 minutes of CBT a day</b>.
          </p>

          <div style={{ marginTop: 24 }}>
            <input
              className="field"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="stack gap-12" style={{ marginTop: 22 }}>
            {[
              ['📊', 'Your results, saved for later'],
              ['🗓️', 'A plan that adapts as you track'],
              ['🔕', 'No spam. Unsubscribe anytime.'],
            ].map(([e, t]) => (
              <div className="row" key={t} style={{ gap: 11 }}>
                <span style={{ fontSize: 18 }}>{e}</span>
                <span className="tiny" style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-foot">
        <Button disabled={!valid} onClick={() => onSubmit(email)} className="btn-lg">
          Save my results
        </Button>
        <p className="tiny center" style={{ marginTop: 10 }}>
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
