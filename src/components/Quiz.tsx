import { useState } from 'react';
import type { Question, Vec5 } from '../data/types';

interface QuizProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (vector: Vec5) => void;
  onBack: () => void;
}

export default function Quiz({ question, index, total, onAnswer, onBack }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const progress = Math.round(((index + 1) / total) * 100);
  const chapter = index < 6 ? '开场' : index < 12 ? '关系' : index < 18 ? '转折' : index < 24 ? '深水区' : '终局';

  const choose = (optionIndex: number, vector: Vec5) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if ('vibrate' in navigator) navigator.vibrate?.(18);
    window.setTimeout(() => onAnswer(vector), 180);
  };

  return (
    <section className="quiz-screen mobile-quiz">
      <header className="mobile-quiz-header">
        <button
          className={`back-button ${index === 0 ? 'is-disabled' : ''}`}
          onClick={onBack}
          disabled={index === 0}
          aria-label="上一题"
        >
          <span>‹</span>
        </button>
        <div className="quiz-header-center">
          <span className="chapter-name">{chapter} · {question.scene}</span>
          <span className="question-counter">{String(index + 1).padStart(2, '0')} / {total}</span>
        </div>
        <span className="progress-number">{progress}%</span>
      </header>

      <div className="mobile-progress">
        <div className="mobile-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-stage-card">
        <div className="scene-stamp">SCENE {String(index + 1).padStart(2, '0')}</div>
        <div className="scene-kicker">如果这一幕真的发生在你身上</div>
        <h2>{question.text}</h2>

        <div className="option-list mobile-options">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`option-button ${selected === i ? 'is-selected' : ''} ${selected !== null && selected !== i ? 'is-muted' : ''}`}
              onClick={() => choose(i, option.vector)}
              disabled={selected !== null}
            >
              <span className="option-index">{String.fromCharCode(65 + i)}</span>
              <span className="option-copy">{option.text}</span>
              <span className="option-check">✓</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="mobile-quiz-footer">
        <div className="instinct-chip"><span>◉</span> 第一反应通常更像你</div>
        <div className="chapter-dots" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className={Math.min(4, Math.floor(index / 6)) >= item ? 'active' : ''} />
          ))}
        </div>
      </footer>
    </section>
  );
}
