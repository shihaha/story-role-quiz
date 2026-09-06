export type Vec5 = [number | null, number | null, number | null, number | null, number | null];
export type ScoreVec5 = [number, number, number, number, number];

export interface Option {
  text: string;
  vector: Vec5;
}

export interface Question {
  text: string;
  scene?: string;
  options: Option[];
}

export interface Role {
  id: string;
  name: string;
  coords: ScoreVec5;
  accent: string;
  tagline: string;
  summary: string;
  story: string;
  relation: string;
  reversal: string;
  quote: string;
  tags: string[];
}

export const DIMENSIONS = [
  { label: '关系警觉', low: '放松', high: '容易警觉' },
  { label: '亲密距离', low: '愿意靠近', high: '需要空间' },
  { label: '信号敏感', low: '不易多想', high: '容易捕捉变化' },
  { label: '靠近行动', low: '等回应', high: '会往前走' },
  { label: '情绪表达', low: '说出来', high: '藏起来' },
] as const;

export type Stage = 'intro' | 'quiz' | 'results';
