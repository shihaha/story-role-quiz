import { DIMENSIONS } from '../data/types';
import type { ScoreVec5 } from '../data/types';

interface RadarProps {
  values: ScoreVec5;
  accent: string;
}

export default function RadarChart({ values, accent }: RadarProps) {
  const size = 280;
  const center = size / 2;
  const radius = 96;
  const point = (i: number, value: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 5;
    const r = radius * (value / 10);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };
  const outer = DIMENSIONS.map((_, i) => point(i, 10).join(',')).join(' ');
  const data = values.map((v, i) => point(i, v).join(',')).join(' ');

  return (
    <div className="radar-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg" role="img" aria-label="关系五维图">
        {[2, 4, 6, 8, 10].map((level) => (
          <polygon
            key={level}
            points={DIMENSIONS.map((_, i) => point(i, level).join(',')).join(' ')}
            fill="none"
            stroke="rgba(94,71,88,.12)"
            strokeWidth="1"
          />
        ))}
        {DIMENSIONS.map((_, i) => {
          const [x, y] = point(i, 10);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(94,71,88,.09)" />;
        })}
        <polygon points={outer} fill="none" stroke="rgba(94,71,88,.14)" />
        <polygon points={data} fill="rgba(244,102,139,.16)" stroke="#ef6688" strokeWidth="2.4" />
        {values.map((v, i) => {
          const [x, y] = point(i, v);
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#ef6688" />;
        })}
      </svg>
      <div className="dimension-list">
        {DIMENSIONS.map((dim, i) => (
          <div className="dimension-row" key={dim.label}>
            <div className="dimension-label"><span>{dim.label}</span><strong>{values[i]}</strong></div>
            <div className="dimension-bar"><span style={{ width: `${values[i] * 10}%`, background: accent }} /></div>
            <div className="dimension-poles"><span>{dim.low}</span><span>{dim.high}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
