import { DIMENSIONS } from '../data/types';
import type { ScoreVec5 } from '../data/types';

interface RadarProps {
  values: ScoreVec5;
  accent: string;
}

function levelText(value: number) {
  if (value >= 7) return '较高';
  if (value <= 4) return '较低';
  return '中等';
}

export default function RadarChart({ values, accent }: RadarProps) {
  return (
    <div className="tendency-bars" aria-label="你的恋爱倾向">
      {DIMENSIONS.map((dim, i) => (
        <div className="tendency-row" key={dim.label}>
          <div className="tendency-heading">
            <span>{dim.label}</span>
            <em>{levelText(values[i])}</em>
          </div>
          <div className="tendency-track" aria-hidden="true">
            <span style={{ width: `${values[i] * 10}%`, background: accent }} />
          </div>
          <div className="tendency-poles"><span>{dim.low}</span><span>{dim.high}</span></div>
        </div>
      ))}
    </div>
  );
}
