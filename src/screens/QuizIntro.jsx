import { StatusBar, Button } from '../components/Chrome';
import SplitText from '../components/reactbits/SplitText';
import GradientText from '../components/reactbits/GradientText';

export default function QuizIntro({ onStart }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body">
        <div className="pad stack" style={{ height: '100%', paddingTop: 18 }}>
          <div className="row" style={{ gap: 10 }}>
            <GradientText
              colors={['#ec8a66', '#b85c7c', '#ec8a66']}
              animationSpeed={7}
              className="wordmark"
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>
                ease
              </span>
            </GradientText>
          </div>

          <div style={{ marginTop: 34 }}>
            <p className="eyebrow">Your 2-minute check-in</p>
            <div style={{ marginTop: 14 }}>
              <SplitText
                text="Let’s understand what menopause is doing to you."
                tag="h1"
                className="display"
                trigger="load"
                effect="rise"
                textAlign="left"
                duration={0.9}
                color="var(--ink)"
              />
            </div>
            <p className="lead" style={{ marginTop: 18 }}>
              Around <b>20 quick questions</b> about your body, sleep and mood.
              We’ll turn your answers into a personal <b>Symptom Score</b> and a plan.
            </p>
          </div>

          <div className="stack gap-12" style={{ marginTop: 28 }}>
            {[
              ['🔒', 'Private', 'Your answers stay yours. No judgement.'],
              ['🧠', 'Evidence-based', 'Built on CBT and clinical menopause care.'],
              ['⏱️', 'Just 2 minutes', 'No sign-up needed to see your score.'],
            ].map(([emoji, title, sub]) => (
              <div className="row" key={title} style={{ gap: 13 }}>
                <div className="feature-row-ic" style={{
                  width: 42, height: 42, borderRadius: 13, background: 'var(--coral-soft)',
                  display: 'grid', placeItems: 'center', fontSize: 20, flex: '0 0 auto',
                }}>{emoji}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 15.5 }}>{title}</h4>
                  <p className="tiny" style={{ marginTop: 1 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-foot">
        <Button onClick={onStart} className="btn-lg">Begin my check-in</Button>
        <p className="tiny center" style={{ marginTop: 10 }}>
          Not a medical diagnosis. For guidance and support.
        </p>
      </div>
    </div>
  );
}
