export type Vec5 = [number, number, number, number, number];

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
  coords: Vec5;
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
  { label: '掌控感', low: '随势', high: '控场' },
  { label: '情绪张力', low: '内收', high: '外显' },
  { label: '行动欲', low: '观望', high: '先手' },
  { label: '规则感', low: '反骨', high: '守序' },
  { label: '人群位置', low: '边缘', high: '中心' },
] as const;

export type Stage = 'intro' | 'quiz' | 'results';
