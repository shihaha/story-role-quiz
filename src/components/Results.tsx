import { useState, type CSSProperties } from 'react';
import RadarChart from './RadarChart';
import { DIMENSIONS } from '../data/types';
import type { MatchResult } from '../utils/matching';

interface ResultsProps {
  result: MatchResult;
  onRestart: () => void;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 5,
) {
  const chars = [...text];
  let line = '';
  let lineCount = 0;
  for (let i = 0; i < chars.length; i += 1) {
    const test = line + chars[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      lineCount += 1;
      line = chars[i];
      if (lineCount >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (line && lineCount < maxLines) ctx.fillText(line, x, y);
  return y + lineHeight;
}

export default function Results({ result, onRestart }: ResultsProps) {
  const { role, score, userCoords, ranking } = result;
  const [copied, setCopied] = useState(false);
  const top3 = ranking.slice(0, 3);

  const resultText = `如果把我写进一部剧里，我拿到的是【${role.name}】。\n${role.tagline}\n\n“${role.quote}”`;

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
    bg.addColorStop(0, '#101116');
    bg.addColorStop(1, '#06070A');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1350);

    const glow = ctx.createRadialGradient(850, 220, 0, 850, 220, 620);
    glow.addColorStop(0, `${role.accent}55`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1080, 900);

    ctx.strokeStyle = 'rgba(255,255,255,.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, 972, 1242);

    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('STORY ROLE TEST', 86, 120);

    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = '34px system-ui, sans-serif';
    ctx.fillText('如果把你写进一部剧里', 86, 205);

    ctx.fillStyle = role.accent;
    ctx.font = 'bold 92px system-ui, sans-serif';
    ctx.fillText(role.name, 86, 345);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '36px system-ui, sans-serif';
    let y = wrapCanvasText(ctx, role.tagline, 86, 420, 860, 56, 3);

    ctx.fillStyle = 'rgba(255,255,255,.50)';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText(`角色匹配度 ${score}%`, 86, y + 10);
    y += 82;

    DIMENSIONS.forEach((dim, i) => {
      ctx.fillStyle = 'rgba(255,255,255,.72)';
      ctx.font = '25px system-ui, sans-serif';
      ctx.fillText(dim.label, 86, y);
      ctx.fillStyle = 'rgba(255,255,255,.12)';
      ctx.fillRect(260, y - 20, 610, 18);
      ctx.fillStyle = role.accent;
      ctx.fillRect(260, y - 20, 610 * (userCoords[i] / 10), 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText(String(userCoords[i]), 900, y);
      y += 58;
    });

    y += 30;
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('角色台词', 86, y);
    y += 58;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 39px system-ui, sans-serif';
    y = wrapCanvasText(ctx, `“${role.quote}”`, 86, y, 870, 58, 3);

    ctx.fillStyle = 'rgba(255,255,255,.40)';
    ctx.font = '23px system-ui, sans-serif';
    ctx.fillText(role.tags.map((t) => `#${t}`).join('   '), 86, 1228);
    ctx.fillText('娱乐型互动测试 · 结果仅用于自我观察与分享', 86, 1270);

    const link = document.createElement('a');
    link.download = `剧本角色测试-${role.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="results-screen" style={{ '--accent': role.accent } as CSSProperties}>
      <div className="result-hero">
        <div className="result-eyebrow">YOUR STORY ROLE</div>
        <div className="result-score">匹配度 {score}%</div>
        <h1>{role.name}</h1>
        <p className="result-tagline">{role.tagline}</p>
        <div className="tag-row">{role.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>

      <div className="result-content">
        <section className="story-section lead-section">
          <div className="section-kicker">你这个角色，为什么像你</div>
          <p>{role.summary}</p>
        </section>

        <section className="story-section">
          <div className="section-kicker">你的五维角色图</div>
          <RadarChart values={userCoords} accent={role.accent} />
        </section>

        <section className="story-grid">
          <article className="story-section">
            <div className="section-kicker">放进剧本里</div>
            <p>{role.story}</p>
          </article>
          <article className="story-section">
            <div className="section-kicker">关系线</div>
            <p>{role.relation}</p>
          </article>
          <article className="story-section">
            <div className="section-kicker">人物反转</div>
            <p>{role.reversal}</p>
          </article>
        </section>

        <blockquote className="role-quote">“{role.quote}”</blockquote>

        <section className="story-section">
          <div className="section-kicker">另外两个你也很像的角色</div>
          <div className="top-three">
            {top3.map((item, i) => (
              <div className={`rank-card ${i === 0 ? 'current' : ''}`} key={item.role.id}>
                <span className="rank-number">0{i + 1}</span>
                <div><strong>{item.role.name}</strong><small>{item.role.tagline}</small></div>
                <em>{item.score}%</em>
              </div>
            ))}
          </div>
        </section>

        <div className="result-actions">
          <button className="primary-button" onClick={downloadCard}>保存小红书角色卡</button>
          <button className="secondary-button" onClick={copyResult}>{copied ? '已复制' : '复制结果文案'}</button>
          <button className="text-button" onClick={onRestart}>重新测一次</button>
        </div>

        <p className="disclaimer">这是娱乐型互动角色测试，不用于心理诊断或专业人格评估。</p>
      </div>
    </section>
  );
}
