import { useState, type CSSProperties } from 'react';
import RadarChart from './RadarChart';
import { DIMENSIONS } from '../data/types';
import type { MatchResult } from '../utils/matching';

interface ResultsProps {
  result: MatchResult;
  onRestart: () => void;
}

const DIMENSION_COPY = [
  {
    high: '关系里只要出现明显变化，你很容易马上注意到。真正让你难受的往往不是坏答案，而是长时间不知道答案。',
    mid: '你会留意关系里的变化，但通常不会因为一个小信号马上推翻之前的判断。',
    low: '你对短期波动比较放松。一次回复慢、一次状态差，通常不足以让你重新判断整段关系。',
  },
  {
    high: '关系真正靠近以后，你会更需要自己的空间。太密、太快、太早进入彼此全部生活，都可能让你产生压力。',
    mid: '你既需要亲密，也需要自己的节奏。关系靠近并不会让你天然抗拒，但太快时你会想慢一点。',
    low: '你对真正的靠近通常比较舒服。分享生活、表达需要、进入彼此计划，对你来说更像关系自然往前走。',
  },
  {
    high: '你对关系里的细微信号很敏感。模糊回复、临时取消、语气变化，都很容易被你放进“这是不是在拒绝我”的判断里。',
    mid: '你能察觉不对劲，但通常还会给事实一点时间。你不会完全忽略信号，也不太愿意只凭一个细节定结论。',
    low: '你比较少从模糊信号里直接读出拒绝。除非对方表现得足够明确，否则你更愿意把事情继续放在观察区。',
  },
  {
    high: '有感觉时你更容易真的往前走：发消息、约见面、把问题说开，很多剧情会因为你先动一步才继续。',
    mid: '你通常需要一个足够明确的信号才会行动。不是完全被动，但也不会什么都没看清就冲进去。',
    low: '你更习惯等对方给出足够明确的回应。即使心里已经有感觉，你也可能因为不想先暴露自己而停在原地。',
  },
  {
    high: '很多在意和失望你更习惯先自己处理。你不一定会当场说，但没说出口的东西并不代表没有留下。',
    mid: '你会看事情和时机决定说不说。真正重要的问题通常还是会表达，只是不一定当下马上说。',
    low: '你的情绪比较容易被对方看见。喜欢、介意、失望、需要安慰时，你更愿意直接让关系知道发生了什么。',
  },
];

function dimensionCopy(index: number, value: number) {
  const set = DIMENSION_COPY[index];
  if (value >= 7) return set.high;
  if (value <= 4) return set.low;
  return set.mid;
}

function firstImpression(coords: number[]) {
  const approach = coords[3];
  const suppress = coords[4];
  if (approach >= 7 && suppress <= 4) return '刚开始有感觉时，你通常不会一直装没事。只要判断值得，你会给对方比较明确的回应。';
  if (approach <= 4 && suppress >= 7) return '你很容易出现“心里已经有感觉，表面还像什么都没发生”的状态。';
  if (approach >= 7) return '你不是纯等对方的人。真正喜欢时，你会想办法让关系往前一点，只是未必把全部情绪都说出来。';
  return '你刚开始喜欢一个人时更偏观察。不是没有感觉，而是通常要等关系给你更多信号。';
}

function pressureMode(coords: number[]) {
  if (coords[0] >= 8 && coords[3] >= 7) return '关系一变模糊，你更容易主动确认。对你来说，尽快知道发生了什么，比长时间悬着更好受。';
  if (coords[2] >= 8 && coords[3] <= 3) return '一旦你觉得自己可能被拒绝，最自然的保护方式往往不是追问，而是先减少投入。';
  if (coords[1] >= 8) return '关系越近、推进越快，你越需要重新找回自己的空间。压力大时，后退一点会让你重新舒服。';
  if (coords[4] >= 8) return '关系出现问题时，你第一反应更容易先自己消化。真正的风险是，对方可能根本不知道你已经开始不舒服。';
  return '关系出现波动时，你通常会先观察一下，再决定是谈、等，还是调整自己的投入。';
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
  const secondaryRole = ranking[1]?.role;
  const strongestIndex = userCoords.indexOf(Math.max(...userCoords));
  const quietestIndex = userCoords.indexOf(Math.min(...userCoords));

  const resultText = `我最容易陷入的恋爱剧情是：\n【${role.name}】\n${role.tagline}\n\n“${role.quote}”`;

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
    canvas.height = 1440;
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
    ctx.strokeRect(54, 54, 972, 1332);

    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText('LOVE STORY TEST', 86, 120);

    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = '34px system-ui, sans-serif';
    ctx.fillText('你最容易陷入哪种恋爱剧情？', 86, 205);

    ctx.fillStyle = role.accent;
    ctx.font = 'bold 58px system-ui, sans-serif';
    let y = wrapCanvasText(ctx, role.name, 86, 315, 900, 72, 3);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px system-ui, sans-serif';
    y = wrapCanvasText(ctx, role.tagline, 86, y + 18, 880, 46, 3);

    ctx.fillStyle = 'rgba(255,255,255,.50)';
    ctx.font = '26px system-ui, sans-serif';
    ctx.fillText(`剧情匹配度 ${score}%`, 86, y + 10);
    y += 62;

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
      y += 48;
    });

    y += 18;
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('这一条剧情里的你', 86, y);
    y += 44;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px system-ui, sans-serif';
    y = wrapCanvasText(ctx, `“${role.quote}”`, 86, y, 870, 48, 3);

    ctx.fillStyle = 'rgba(255,255,255,.40)';
    ctx.font = '23px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.30)';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('另一条接近的剧情：', 86, 1236);
    ctx.font = '24px system-ui, sans-serif';
    wrapCanvasText(ctx, secondaryRole?.name ?? '—', 86, 1274, 860, 34, 2);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(role.tags.map((t) => `#${t}`).join('   '), 86, 1322);
    ctx.fillText('32题恋爱剧情测试 · 测试结果仅供娱乐', 86, 1362);

    const link = document.createElement('a');
    link.download = `恋爱剧情测试-${role.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="results-screen" style={{ '--accent': role.accent } as CSSProperties}>
      <div className="result-hero">
        <div className="result-hero-inner">
          <div className="result-eyebrow">你的恋爱剧情是</div>
          <div className="result-score">匹配度 {score}%</div>
          <h1>{role.name}</h1>
          <p className="result-tagline">“{role.tagline}”</p>
          <div className="result-art-card">
            <img src="/result-romance.svg" alt="恋爱剧情结果插画" />
          </div>
          <div className="tag-row">{role.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>

      <div className="result-content">
        <section className="story-section lead-section">
          <div className="section-kicker">你的剧情关键词</div>
          <div className="result-keyword-row">
            {role.tags.map((tag) => <span key={`key-${tag}`}>{tag}</span>)}
          </div>
          <div className="section-kicker section-kicker-spaced">为什么你最容易走进这条剧情</div>
          <p>{role.summary}</p>
        </section>

        <section className="dossier-grid">
          <article className="dossier-card">
            <span>刚开始喜欢时</span>
            <p>{firstImpression(userCoords)}</p>
          </article>
          <article className="dossier-card">
            <span>关系一变模糊</span>
            <p>{pressureMode(userCoords)}</p>
          </article>
          <article className="dossier-card accent-card">
            <span>你最明显的一条线</span>
            <strong>{DIMENSIONS[strongestIndex].label}</strong>
            <p>{dimensionCopy(strongestIndex, userCoords[strongestIndex])}</p>
          </article>
          <article className="dossier-card">
            <span>你最容易忽略</span>
            <p>{role.reversal}</p>
          </article>
        </section>

        <section className="story-section">
          <div className="section-kicker">你的关系五维图</div>
          <RadarChart values={userCoords} accent={role.accent} />
        </section>

        <section className="story-section dimension-story-section">
          <div className="section-kicker">这五条线放进关系里是什么样</div>
          <div className="dimension-story-list">
            {DIMENSIONS.map((dimension, i) => (
              <article key={dimension.label} className={i === strongestIndex ? 'is-strongest' : i === quietestIndex ? 'is-quietest' : ''}>
                <div>
                  <strong>{dimension.label}</strong>
                  <span>{userCoords[i]} / 10</span>
                </div>
                <p>{dimensionCopy(i, userCoords[i])}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="story-grid">
          <article className="story-section">
            <div className="section-kicker">这条剧情通常怎么开始</div>
            <p>{role.story}</p>
          </article>
          <article className="story-section">
            <div className="section-kicker">什么样的关系更适合你</div>
            <p>{role.relation}</p>
          </article>
          <article className="story-section">
            <div className="section-kicker">最容易踩的坑</div>
            <p>{role.reversal}</p>
          </article>
        </section>

        <blockquote className="role-quote">“{role.quote}”</blockquote>

        {secondaryRole && (
          <section className="secondary-role-card">
            <div className="secondary-role-topline">SECOND ROUTE · 你也很接近这条剧情</div>
            <div className="secondary-role-name">{secondaryRole.name}</div>
            <p>{secondaryRole.tagline}</p>
            <small>
              你的答案和这条剧情也很接近。换一个人、换一个关系阶段，或者当下状态不同，你的表现可能会更像这一条。
            </small>
          </section>
        )}

        <section className="story-section">
          <div className="section-kicker">最接近你的三条剧情</div>
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
          <button className="primary-button" onClick={downloadCard}>保存小红书结果卡</button>
          <button className="secondary-button" onClick={copyResult}>{copied ? '已复制' : '复制结果文案'}</button>
          <button className="text-button" onClick={onRestart}>重新测一次</button>
        </div>

        <p className="disclaimer">测试结果仅供娱乐</p>
      </div>
    </section>
  );
}
