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

function pickPrimaryId(userCoords: ScoreVec5, answers: Vec5[]) {
  const [uncertainty, closeness, rejection, approach, suppression] = userCoords;
  const q26Uncertainty = answerValue(answers, 25, 0);
  const q26Approach = answerValue(answers, 25, 3);
  const q30Approach = answerValue(answers, 29, 3);
  const q30Suppression = answerValue(answers, 29, 4);
  const q31Rejection = answerValue(answers, 30, 2);
  const q31Approach = answerValue(answers, 30, 3);
  const q32Suppression = answerValue(answers, 31, 4);

  if (q31Rejection !== null && q31Rejection >= 9 && q31Approach !== null && q31Approach <= 2) {
    return 'leave-before-rejection';
  }
  if (closeness >= 6.7 && approach <= 3.6) return 'pull-away-when-chased';
  if (closeness >= 6.3 && approach > 3.6) return 'best-in-ambiguity';
  if (
    (uncertainty >= 6 && approach >= 6.3 && suppression <= 4)
    || (q26Uncertainty !== null && q26Uncertainty >= 9 && q26Approach !== null && q26Approach >= 9)
    || (q30Approach !== null && q30Approach >= 8 && q30Suppression !== null && q30Suppression <= 3)
  ) {
    return 'solve-it-now';
  }
  if (q32Suppression !== null && q32Suppression >= 8 && uncertainty >= 6.2) return 'need-a-real-ending';
  if (suppression >= 7.2 && uncertainty < 6.8) return 'fine-but-not-fine';
  if (uncertainty >= 6.5 && approach <= 3.6) return 'wait-for-clearer-signal';
  if (rejection >= 7.2 && approach < 5.5) return 'cooling-means-something';
  if (uncertainty >= 6.5 && approach >= 5) return 'need-to-know';
  if (uncertainty <= 4.2 && closeness <= 4.3 && rejection <= 4.5 && approach >= 5.8 && suppression <= 4.5) {
    return 'steady-after-mutual';
  }
  if (approach >= 5.5 && uncertainty < 5.5 && rejection < 5.5) return 'keep-self';
  if (approach <= 5.1) return 'slow-to-start';
  return null;
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
  let ranking = ROLES
    .map((role) => {
      const distance = Math.sqrt(
        role.coords.reduce((acc, c, i) => acc + Math.pow(userCoords[i] - c, 2), 0)
      );
      const score = Math.max(0, Math.round((1 - distance / MAX_DIST) * 100));
      return { role, score, distance: Math.round(distance * 100) / 100 };
    })
    .sort((a, b) => a.distance - b.distance);

  const primaryId = pickPrimaryId(userCoords, answers);
  if (primaryId) {
    const primaryIndex = ranking.findIndex((item) => item.role.id === primaryId);
    if (primaryIndex > 0) {
      const [primary] = ranking.splice(primaryIndex, 1);
      primary.score = Math.max(primary.score, 68);
      ranking = [primary, ...ranking];
    }
  }

  return {
    role: ranking[0].role,
    score: ranking[0].score,
    userCoords,
    ranking,
  };
}
