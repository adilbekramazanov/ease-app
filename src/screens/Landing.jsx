import { StatusBar } from '../components/Chrome';
import Logo from '../components/Logo';

// Лендинг ease (/): промо продукта на той же дизайн-системе. Нижний CTA и
// ссылка в шапке ведут в воронку (/funnel) через onStartFunnel.

const FEATURES = [
  ['🧘‍♀️', '10 minutes a day of CBT', 'Guided, clinically-backed sessions that calm hot flashes, sleep and mood — in just 10 minutes.'],
  ['📈', 'Symptom tracking', 'Watch your Symptom Score ease week over week, with a plan that adapts as you go.'],
  ['🩺', 'HRT reviews by users', 'Real reviews from women like you, plus menopause-trained clinicians when you want them.'],
  ['🗓️', 'Your 28-day plan', 'A focused month built around your worst symptom first — then it widens with you.'],
];

const CREDS = ['🏅 Apple Editors’ Choice', '🇬🇧 ORCHA-certified (NHS)', '🔬 Evidence-based'];

export default function Landing({ onStartFunnel }) {
  const go = (e) => { e?.preventDefault?.(); onStartFunnel?.(); };

  return (
    <div className="lp">
      {/* шапка */}
      <header className="lp-nav">
        <Logo variant="horizontal-dark" height={38} />
        <nav className="lp-nav-right">
          <a href="/funnel" className="lp-link" onClick={go}>Take the 2-min quiz →</a>
          <button className="btn btn-primary lp-nav-cta" onClick={go}>Start</button>
        </nav>
      </header>

      {/* герой */}
      <section className="lp-hero">
        <div className="lp-hero-copy">
          <p className="eyebrow">For perimenopause &amp; menopause</p>
          <h1 className="lp-h1">Sleep through the night again.</h1>
          <p className="lp-sub">
            A <b>28-day hot-flash plan</b> that fits real life — just <b>10 minutes a day</b> of
            guided CBT, tracking and support.
          </p>
          <div className="lp-cta-row">
            <button className="btn btn-primary btn-lg lp-hero-btn" onClick={go}>Start my plan →</button>
            <a href="/funnel" className="lp-link" onClick={go}>Take the 2-minute quiz</a>
          </div>
          <p className="tiny" style={{ marginTop: 12 }}>No sign-up needed to see your Symptom Score.</p>
          <div className="lp-badges">
            {CREDS.map((c) => <span className="cred" key={c}>{c}</span>)}
          </div>
        </div>

        <div className="lp-device">
          <MiniApp />
        </div>
      </section>

      {/* строка доверия */}
      <section className="lp-trust">
        <p>
          Evidence-based content, symptom tracking and HRT reviews by users.
          <b> Apple Editors’ Choice</b> · <b>ORCHA-certified for NHS libraries.</b>
        </p>
      </section>

      {/* фичи */}
      <section className="lp-section">
        <p className="eyebrow center">Everything in one calm place</p>
        <h2 className="lp-h2 center">Menopause support that actually fits your day.</h2>
        <div className="lp-features">
          {FEATURES.map(([ic, title, body]) => (
            <div className="lp-feature" key={title}>
              <div className="lp-feature-ic">{ic}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* наука / почему CBT (dusk) */}
      <section className="lp-science">
        <div className="lp-science-inner">
          <p className="eyebrow" style={{ color: '#f3c6b4' }}>Why it works</p>
          <h2 className="lp-h2" style={{ color: '#fff', marginTop: 12 }}>
            CBT is proven to ease the distress of hot flashes.
          </h2>
          <p className="lp-science-p">
            Cognitive behavioural therapy doesn’t just help you cope — it’s clinically shown to
            reduce how much hot flashes, broken sleep and low mood interfere with your life.
            ease turns that into a daily 10-minute practice: notice the thought, reframe it,
            and settle your body.
          </p>
          <div className="lp-steps">
            {[['👁️', 'Notice'], ['🔄', 'Reframe'], ['🫧', 'Soothe']].map(([ic, t]) => (
              <div className="lp-step" key={t}>
                <span className="lp-step-ic">{ic}</span>
                <b>{t}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* отзыв */}
      <section className="lp-section">
        <div className="lp-quote">
          <p className="lp-quote-text">
            “I slept through the night for the first time in two years. The daily CBT actually works.”
          </p>
          <p className="tiny" style={{ marginTop: 12 }}>— Marianne, 53 · 6 weeks on ease</p>
        </div>
      </section>

      {/* нижний CTA покупки → воронка */}
      <section className="lp-final">
        <div className="lp-final-inner">
          <h2 className="lp-h2 center" style={{ maxWidth: 560, marginInline: 'auto' }}>
            Your 28-day plan is a 2-minute quiz away.
          </h2>
          <p className="lp-sub center" style={{ marginTop: 14, marginInline: 'auto', maxWidth: 460 }}>
            Answer a few questions, see your Symptom Score, and start easing tonight.
          </p>
          <button className="btn btn-primary btn-lg lp-final-btn" onClick={go}>Start my plan →</button>
          <p className="tiny center" style={{ marginTop: 12 }}>
            Intro plans from <b>$0.71 / day</b> · cancel anytime · no free trial.
          </p>
          <div className="lp-badges center" style={{ justifyContent: 'center', marginTop: 20 }}>
            {CREDS.map((c) => <span className="cred" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      <footer className="lp-foot">
        <Logo variant="horizontal-dark" height={20} />
        <p className="tiny" style={{ marginTop: 10, maxWidth: 420 }}>
          ease is a supportive menopause tool, not a medical diagnosis. For guidance and support.
        </p>
        <a href="/funnel" className="lp-link" onClick={go} style={{ marginTop: 10, display: 'inline-block' }}>
          Take the quiz →
        </a>
        <p className="lp-creators">Created by Akniyet · Nursoltan · Adilbek</p>
      </footer>
    </div>
  );
}

// Статичное превью приложения в «телефоне» (день 7) — для герой-секции.
function MiniApp() {
  const TABS = [['🏠', 'Today', true], ['🧘‍♀️', 'CBT', false], ['📈', 'Track', false], ['🩺', 'Clinic', false], ['👥', 'Community', false]];
  return (
    <div className="phone lp-phone">
      <div className="screen">
        <StatusBar />
        <div className="home">
          <div className="screen-body">
            <div className="pad" style={{ paddingTop: 10 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <Logo variant="horizontal-dark" height={17} />
                <span className="daychip">🔥 Day 7</span>
              </div>
              <p className="tiny" style={{ marginTop: 14 }}>Good morning</p>
              <h2 className="title" style={{ marginTop: 4, fontSize: 21 }}>Let’s ease into today.</h2>

              <div className="row gap-12" style={{ marginTop: 14, gap: 10 }}>
                <div className="card" style={{ flex: 1, padding: 14 }}>
                  <p className="tiny">Symptom Score</p>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 25, marginTop: 2 }}>46</div>
                  <p className="tiny" style={{ color: 'var(--sage)' }}>▼ easing</p>
                </div>
                <div className="card" style={{ flex: 1, padding: 14 }}>
                  <p className="tiny">Today’s CBT</p>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 25, marginTop: 2 }}>10:00</div>
                  <p className="tiny" style={{ color: 'var(--coral-deep)' }}>Start →</p>
                </div>
              </div>

              <div className="center" style={{ marginTop: 20 }}>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
                  <div className="sos-halo" />
                  <div className="sos-btn" style={{ width: 140, height: 140, fontSize: 24, cursor: 'default' }}>
                    SOS<small>Tap to ease</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tabbar">
            {TABS.map(([ic, label, on]) => (
              <div className={`tab${on ? ' on' : ''}`} key={label}>
                <span className="ti">{ic}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
