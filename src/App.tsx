import { useState } from 'react';
import Intro from './components/Intro';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { QUESTIONS } from './data/questions';
import type { Stage, Vec5 } from './data/types';
import { averageVectors, buildResult } from './utils/matching';
import type { MatchResult } from './utils/matching';

export default function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Vec5[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);

  const start = () => {
    setIndex(0);
    setAnswers([]);
    setResult(null);
    setStage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const choose = (vector: Vec5) => {
    const next = [...answers, vector];
    if (index >= QUESTIONS.length - 1) {
      const coords = averageVectors(next);
      setAnswers(next);
      setResult(buildResult(coords, next));
      setStage('results');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      return;
    }
    setAnswers(next);
    setIndex((v) => v + 1);
  };

  return (
    <main className="app-shell">
      {stage === 'intro' && <Intro onStart={start} />}
      {stage === 'quiz' && (
        <Quiz
          key={index}
          question={QUESTIONS[index]}
          index={index}
          total={QUESTIONS.length}
          onAnswer={choose}
          onBack={() => {
            if (index <= 0) return;
            setAnswers((prev) => prev.slice(0, -1));
            setIndex((v) => Math.max(0, v - 1));
          }}
        />
      )}
      {stage === 'results' && result && <Results result={result} onRestart={start} />}
    </main>
  );
}
