import { ROLES } from '../data/roles';
import type { Role, ScoreVec5, Vec5 } from '../data/types';

export interface RankedMatch {
  role: Role;
  score: number;
  distance: number;
}

export interface MatchResult {
  role: Role;
  score: number;
  userCoords: ScoreVec5;
  ranking: RankedMatch[];
}

const MAX_DIST = Math.sqrt(5 * 10 * 10);

function answerValue(answers: Vec5[], questionIndex: number, dimensionIndex: number) {
  return answers[questionIndex]?.[dimensionIndex] ?? null;
}

function atLeast(value: number | null, threshold: number) {
  return value !== null && value >= threshold;
}

function atMost(value: number | null, threshold: number) {
  return value !== null && value <= threshold;
}

function averageAnswerDimension(answers: Vec5[], start: number, end: number, dimensionIndex: number) {
  const values: number[] = [];
  for (let i = start; i <= end; i += 1) {
    const value = answerValue(answers, i, dimensionIndex);
    if (value !== null) values.push(value);
  }
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Diagnostic questions refine a close match, but never replace the whole test.
 * The bonus is deliberately small compared with five-dimensional distance.
 */
function diagnosticBonus(roleId: string, coords: ScoreVec5, answers: Vec5[]) {
  const [uncertainty, closeness, rejection, approach, suppression] = coords;
  const q26U = answerValue(answers, 25, 0);
  const q26A = answerValue(answers, 25, 3);
  const q26S = answerValue(answers, 25, 4);
  const q28C = answerValue(answers, 27, 1);
  const q28A = answerValue(answers, 27, 3);
  const q28S = answerValue(answers, 27, 4);
  const q29U = answerValue(answers, 28, 0);
  const q29R = answerValue(answers, 28, 2);
  const q29A = answerValue(answers, 28, 3);
  const q29S = answerValue(answers, 28, 4);
  const q30C = answerValue(answers, 29, 1);
  const q30A = answerValue(answers, 29, 3);
  const q30S = answerValue(answers, 29, 4);
  const q31R = answerValue(answers, 30, 2);
  const q31A = answerValue(answers, 30, 3);
  const q31S = answerValue(answers, 30, 4);
  const q32U = answerValue(answers, 31, 0);
  const q32R = answerValue(answers, 31, 2);
  const q32S = answerValue(answers, 31, 4);
  const signalUncertainty = averageAnswerDimension(answers, 1, 5, 0);
  const closenessPressure = averageAnswerDimension(answers, 6, 10, 1);
  const rejectionReading = averageAnswerDimension(answers, 11, 15, 2);
  const approachAction = averageAnswerDimension(answers, 16, 19, 3);

  switch (roleId) {
    case 'steady-after-mutual':
      return (uncertainty <= 4 && rejection <= 4.5 && closeness <= 4.5 && approach >= 5.5 && suppression <= 4.5 ? 0.55 : 0)
        + (atMost(q30C, 3) && atLeast(q30A, 6) && atMost(q30S, 4) ? 0.25 : 0)
        + (atMost(q32U, 4) && atMost(q32R, 4) ? 0.2 : 0);
    case 'slow-to-start':
      return (approach >= 3.2 && approach <= 5.2 && uncertainty <= 5.5 && rejection <= 5.5 ? 0.35 : 0)
        + (atMost(q28C, 4) && q28A !== null && q28A >= 4 && q28A <= 6 ? 0.2 : 0);
    case 'keep-self':
      return (uncertainty <= 4.8 && rejection <= 4.8 && closeness <= 4.8 && approach >= 5.3 && suppression <= 5 ? 0.5 : 0)
        + (q29A !== null && q29A >= 6 && q29A <= 8 && (q29S === null || q29S <= 5) ? 0.2 : 0);
    case 'need-to-know':
      return (uncertainty >= 6 && approach >= 5.2 && closeness <= 5.3 ? 0.4 : 0)
        + (atLeast(q26U, 6) && atLeast(q26A, 6) ? 0.2 : 0)
        + (atLeast(q31A, 8) && !atLeast(q31R, 9) ? 0.2 : 0);
    case 'cooling-means-something':
      return (rejection >= 6.5 && uncertainty >= 5.5 && approach >= 3.4 && approach <= 5.6 ? 0.45 : 0)
        + (rejectionReading !== null && rejectionReading >= 6.2 && approachAction !== null && approachAction >= 3.4 ? 0.34 : 0)
        + (atLeast(q29R, 7) && q29A !== null && q29A <= 4 ? 0.12 : 0)
        + (q31A !== null && q31A >= 3 && q31A <= 5 ? 0.12 : 0);
    case 'wait-for-clearer-signal':
      return (uncertainty >= 6 && rejection >= 5.5 && approach <= 3.8 && closeness <= 5.2 ? 0.42 : 0)
        + (signalUncertainty !== null && signalUncertainty >= 6 && approachAction !== null && approachAction <= 3.3 ? 0.36 : 0)
        + (atLeast(q29U, 7) && atMost(q29A, 4) ? 0.24 : 0);
    case 'best-in-ambiguity':
      return (closeness >= 5.7 && closeness <= 7.6 && approach >= 4 && approach <= 6.4 ? 0.45 : 0)
        + (closenessPressure !== null && closenessPressure >= 5.9 && approachAction !== null && approachAction >= 3.8 && approachAction <= 6.5 ? 0.75 : 0)
        + (q28C !== null && q28C >= 6 && q28C <= 8 && q28A !== null && q28A >= 2 && q28A <= 4 ? 0.18 : 0);
    case 'pull-away-when-chased':
      return (closeness >= 6.3 && approach <= 3.6 && suppression >= 5.5 ? 0.55 : 0)
        + (atLeast(q28C, 7) && atMost(q28A, 2) && atLeast(q28S, 8) ? 0.3 : 0);
    case 'leave-before-rejection':
      return (rejection >= 7 && approach <= 3.5 && suppression >= 6 ? 0.45 : 0)
        + (atLeast(q31R, 9) && atMost(q31A, 2) && atLeast(q31S, 8) && approach <= 3.8 ? 0.45 : 0);
    case 'fine-but-not-fine':
      return (suppression >= 6.7 && rejection <= 6.5 && closeness <= 6.2 ? 0.45 : 0)
        + (atLeast(q30S, 7) && atMost(q30A, 3) ? 0.25 : 0)
        + (atLeast(q29S, 6) && !atLeast(q29R, 8) ? 0.15 : 0);
    case 'solve-it-now':
      return (approach >= 6.2 && suppression <= 4 && closeness <= 4.5 ? 0.45 : 0)
        + (atLeast(q26U, 9) && atLeast(q26A, 9) && atMost(q26S, 3) ? 0.3 : 0)
        + (atLeast(q30A, 8) && atMost(q30S, 3) ? 0.2 : 0);
    case 'need-a-real-ending':
      return (uncertainty >= 5.8 && rejection >= 5.8 && suppression >= 6.4 && closeness >= 4.2 ? 0.22 : 0)
        + (atLeast(q32U, 9) && atLeast(q32R, 8) && atLeast(q32S, 9) && suppression >= 6.2 ? 1.05 : 0);
    default:
      return 0;
  }
}

export function averageVectors(vectors: Vec5[]): ScoreVec5 {
  if (!vectors.length) return [5, 5, 5, 5, 5];
  const sums = [0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0];
  vectors.forEach((v) => v.forEach((n, i) => {
    if (n === null) return;
    sums[i] += n;
    counts[i] += 1;
  }));
  return sums.map((n, i) => counts[i] ? Math.round((n / counts[i]) * 10) / 10 : 5) as ScoreVec5;
}

export function buildResult(userCoords: ScoreVec5, answers: Vec5[] = []): MatchResult {
  const ranking = ROLES
    .map((role) => {
      const distance = Math.sqrt(
        role.coords.reduce((acc, c, i) => acc + Math.pow(userCoords[i] - c, 2), 0)
      );
      const bonus = answers.length ? diagnosticBonus(role.id, userCoords, answers) : 0;
      const adjustedDistance = Math.max(0, distance - bonus);
      const score = Math.max(0, Math.min(99, Math.round((1 - adjustedDistance / MAX_DIST) * 100)));
      return {
        role,
        score,
        distance: Math.round(adjustedDistance * 100) / 100,
      };
    })
    .sort((a, b) => a.distance - b.distance || b.score - a.score);

  return {
    role: ranking[0].role,
    score: ranking[0].score,
    userCoords,
    ranking,
  };
}
