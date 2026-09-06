import { ROLES } from '../data/roles';
import type { Role, Vec5 } from '../data/types';

export interface RankedMatch {
  role: Role;
  score: number;
  distance: number;
}

export interface MatchResult {
  role: Role;
  score: number;
  userCoords: Vec5;
  ranking: RankedMatch[];
}

const MAX_DIST = Math.sqrt(5 * 10 * 10);

export function averageVectors(vectors: Vec5[]): Vec5 {
  if (!vectors.length) return [5, 5, 5, 5, 5];
  const sums = [0, 0, 0, 0, 0];
  vectors.forEach((v) => v.forEach((n, i) => { sums[i] += n; }));
  return sums.map((n) => Math.round((n / vectors.length) * 10) / 10) as Vec5;
}

export function buildResult(userCoords: Vec5): MatchResult {
  const ranking = ROLES
    .map((role) => {
      const distance = Math.sqrt(
        role.coords.reduce((acc, c, i) => acc + Math.pow(userCoords[i] - c, 2), 0)
      );
      const score = Math.max(0, Math.round((1 - distance / MAX_DIST) * 100));
      return { role, score, distance: Math.round(distance * 100) / 100 };
    })
    .sort((a, b) => a.distance - b.distance);

  return {
    role: ranking[0].role,
    score: ranking[0].score,
    userCoords,
    ranking,
  };
}
