import { useMemo, useState } from 'react';
import QuizIntro from './screens/QuizIntro';
import Quiz from './screens/Quiz';
import Analyzing from './screens/Analyzing';
import SymptomScore from './screens/SymptomScore';
import Email from './screens/Email';
import Paywall from './screens/Paywall';
import Home from './screens/Home';
import { computeScore } from './lib/score';

// Воронка ease (без лендинга):
// intro → quiz → analyzing → score → email → paywall → home(SOS)
export default function App() {
  const [step, setStep] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');

  const score = useMemo(() => computeScore(answers), [answers]);

  // Сброс воронки в начало — управление для презентации (вне «телефона»).
  const restart = () => {
    setAnswers({});
    setEmail('');
    setStep('intro');
  };

  const screen = (() => {
    switch (step) {
      case 'intro':
        return <QuizIntro onStart={() => setStep('quiz')} />;
      case 'quiz':
        return (
          <Quiz
            onExit={() => setStep('intro')}
            onComplete={(a) => {
              setAnswers(a);
              setStep('analyzing');
            }}
          />
        );
      case 'analyzing':
        return <Analyzing onDone={() => setStep('score')} />;
      case 'score':
        return <SymptomScore answers={answers} onContinue={() => setStep('email')} />;
      case 'email':
        return (
          <Email
            onBack={() => setStep('score')}
            onSubmit={(e) => {
              setEmail(e);
              setStep('paywall');
            }}
          />
        );
      case 'paywall':
        return (
          <Paywall
            goal={answers.goal}
            onBack={() => setStep('email')}
            onPurchase={() => setStep('home')}
          />
        );
      case 'home':
        return <Home score={score.overall} email={email} />;
      default:
        return null;
    }
  })();

  return (
    <div className="stage">
      <div className="stage-brand"><b>ease</b></div>

      {/* Презентационное управление — вне «телефона», не часть приложения */}
      <button className="stage-restart" onClick={restart} disabled={step === 'intro'}>
        <span className="stage-restart-ic" aria-hidden="true">↺</span>
        Start over
      </button>

      <div className="phone">
        {/* key=step → мягкий fade при каждой смене шага воронки */}
        <div key={step} className="fade-step" style={{ height: '100%' }}>
          {screen}
        </div>
      </div>
      <div className="stage-hint">Prototype · click through the funnel</div>
    </div>
  );
}
