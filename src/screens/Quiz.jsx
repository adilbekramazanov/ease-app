import { useRef, useState } from 'react';
import { QUIZ } from '../data/quiz';
import { Button, StatusBar } from '../components/Chrome';

export default function Quiz({ onComplete, onExit }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [unit, setUnit] = useState('kg');
  const [num, setNum] = useState('');
  const advancing = useRef(false);

  const item = QUIZ[i];
  const progress = ((i + 1) / QUIZ.length) * 100;

  const goNext = (patch) => {
    const next = { ...answers, ...patch };
    setAnswers(next);
    if (i + 1 >= QUIZ.length) {
      onComplete(next);
    } else {
      setI(i + 1);
      setNum('');
    }
  };

  const back = () => {
    if (i === 0) return onExit?.();
    setI(i - 1);
    setNum('');
  };

  // Выбор варианта: лёгкая задержка для обратной связи, затем авто-переход.
  const choose = (value) => {
    if (advancing.current) return;
    advancing.current = true;
    setAnswers((a) => ({ ...a, [item.id]: value }));
    setTimeout(() => {
      advancing.current = false;
      goNext({ [item.id]: value });
    }, 240);
  };

  const selected = answers[item.id];

  return (
    <div className="screen">
      <StatusBar />
      <div className="quiz-top">
        <button className="iconbtn" onClick={back} aria-label="Back">‹</button>
        <div className="progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <span className="progress-count">{i + 1}/{QUIZ.length}</span>
      </div>

      <div className="screen-body">
        {/* key=item.id перезапускает fade при каждом шаге */}
        <div className="pad fade-step" key={item.id} style={{ paddingTop: 18 }}>
          {item.type === 'promo' ? (
            <Promo item={item} />
          ) : (
            <>
              <h2 className="title">{item.question}</h2>
              {item.subtitle && <p className="lead" style={{ marginTop: 10 }}>{item.subtitle}</p>}

              <div style={{ marginTop: 24 }}>
                {(item.type === 'single' || item.type === 'scale') && (
                  <div className="choices">
                    {item.options.map((o) => (
                      <button
                        key={String(o.value)}
                        className={`choice${selected === o.value ? ' selected' : ''}`}
                        onClick={() => choose(o.value)}
                      >
                        {o.emoji && <span className="emoji">{o.emoji}</span>}
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{o.label}</span>
                          {o.sub && <span className="tiny" style={{ marginTop: 1 }}>{o.sub}</span>}
                        </span>
                        <span className="check">{selected === o.value ? '✓' : ''}</span>
                      </button>
                    ))}
                  </div>
                )}

                {item.type === 'number' && (
                  <div className="stack gap-16">
                    <div className="seg">
                      {item.unit.map((u) => (
                        <button key={u} className={unit === u ? 'on' : ''} onClick={() => setUnit(u)}>{u}</button>
                      ))}
                    </div>
                    <input
                      className="field"
                      type="number"
                      inputMode="decimal"
                      placeholder={item.placeholder}
                      value={num}
                      onChange={(e) => setNum(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Нижняя кнопка нужна только для promo и number (у choice авто-переход) */}
      {(item.type === 'promo' || item.type === 'number') && (
        <div className="screen-foot">
          <Button
            disabled={item.type === 'number' && !num}
            onClick={() =>
              goNext(item.type === 'number' ? { [item.id]: { value: Number(num), unit } } : {})
            }
          >
            {item.type === 'promo' ? 'Continue' : 'Continue'}
          </Button>
        </div>
      )}
    </div>
  );
}

function Promo({ item }) {
  return (
    <div className="promo">
      <div className="promo-emoji">{item.emoji}</div>
      {item.stat && <div className="stat" style={{ marginTop: 10 }}>{item.stat}</div>}
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </div>
  );
}
