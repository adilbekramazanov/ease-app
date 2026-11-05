import { useMemo, useState } from 'react';
import QuizIntro from './QuizIntro';
import Quiz from './Quiz';
import Analyzing from './Analyzing';
import SymptomScore from './SymptomScore';
import Email from './Email';
import Paywall from './Paywall';
import Onboarding from './Onboarding';
import CbtSession from './CbtSession';
import Home from './Home';
import Logo from '../components/Logo';
import { QUIZ_PROBLEMS, QUIZ_PERSONAL } from '../data/quiz';
import { computeScore } from '../lib/score';

// Воронка ease (в «телефоне»), разделённая Score'ом на две фазы:
//   intro → quiz(проблемы) → analyzing → score
//         → quiz(личное) → email → paywall → purchase
//         → onboarding → cbt(первая сессия) → home(SOS/табы)
// Живёт на /funnel; на / — лендинг (см. App.jsx).
export default function Funnel({ onExitToLanding }) {
  const [step, setStep] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');

  const score = useMemo(() => computeScore(answers), [answers]);

  const name = useMemo(() => {
    const handle = (email.split('@')[0] || '').split(/[._\-+]/)[0];
    return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : '';
  }, [email]);

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
            questions={QUIZ_PROBLEMS}
            onExit={() => setStep('intro')}
            onComplete={(a) => {
              setAnswers((prev) => ({ ...prev, ...a }));
              setStep('analyzing');
            }}
          />
        );
      case 'analyzing':
        return <Analyzing onDone={() => setStep('score')} />;
      case 'score':
        return <SymptomScore answers={answers} onContinue={() => setStep('personal')} />;
      case 'personal':
        return (
          <Quiz
            questions={QUIZ_PERSONAL}
            onExit={() => setStep('score')}
            onComplete={(a) => {
              setAnswers((prev) => ({ ...prev, ...a }));
              setStep('email');
            }}
          />
        );
      case 'email':
        return (
          <Email
            onBack={() => setStep('personal')}
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
            onPurchase={() => setStep('onboarding')}
          />
        );
      case 'onboarding':
        return (
          <Onboarding
            name={name}
            goal={answers.goal}
            score={score}
            onLaunch={() => setStep('cbt')}
          />
        );
      case 'cbt':
        return <CbtSession name={name} onComplete={() => setStep('home')} />;
      case 'home':
        return <Home score={score} name={name} email={email} />;
      default:
        return null;
    }
  })();

  return (
    <div className="stage">
      <a
        className="stage-brand"
        href="/"
        onClick={(e) => { e.preventDefault(); onExitToLanding?.(); }}
        aria-label="ease — back to home"
      >
        <Logo variant="horizontal-dark" height={22} />
      </a>

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
