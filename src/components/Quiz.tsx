import type { Question, Vec5 } from '../data/types';

interface QuizProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (vector: Vec5) => void;
}

export default function Quiz({ question, index, total, onAnswer }: QuizProps) {
  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <section className="quiz-screen">
      <div className="quiz-topline">
        <span>{question.scene}</span>
        <span>{index + 1} / {total}</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="quiz-card">
        <div className="scene-kicker">这一幕，你会怎么走？</div>
        <h2>{question.text}</h2>
        <div className="option-list">
          {question.options.map((option, i) => (
            <button key={i} className="option-button" onClick={() => onAnswer(option.vector)}>
              <span className="option-index">{String.fromCharCode(65 + i)}</span>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="quiz-hint">按第一反应选，不用挑“看起来更好”的答案。</p>
    </section>
  );
}
