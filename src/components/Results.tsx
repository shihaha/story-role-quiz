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
    high: '你不太喜欢把关键走向完全交给运气。越重要的事，你越会下意识去判断局面、留后手、把能控制的部分抓回来。',
    mid: '你会在“掌控”和“顺势”之间切换。能管的事会管，但发现继续硬控没有意义时，也能放手。',
    low: '你对“必须掌控一切”的需求不高。很多时候你更相信现场感觉，愿意让事情自己长出下一步。',
  },
  {
    high: '你的情绪并不轻。真正重要的人和事很容易在你心里留下后劲，只是你未必每次都直接说出来。',
    mid: '你既不是完全冷处理，也不会让情绪接管所有判断。多数时候，你能感受到，也能继续做事。',
    low: '你更习惯把情绪压缩成信息：发生了什么、接下来怎么办。别人可能会觉得你比实际更冷静。',
  },
  {
    high: '你的人物推动力很强。很多剧情不是等来的，而是你先发消息、先试、先改、先迈出去之后才真正开始。',
    mid: '你不是纯冲动派，也不是纯观望派。你通常需要一个足够明确的触发点，到了那个点就会动。',
    low: '你更像观察后出手的人。没看清之前不急着行动，一旦决定，往往比别人以为的更坚定。',
  },
  {
    high: '你需要一定的秩序感。不是死守规则，而是希望事情讲基本逻辑、关系有边界、承诺最好算数。',
    mid: '你会尊重规则，但不会把规则当答案。多数时候你先看它有没有道理，再决定要不要照做。',
    low: '你天然会对“大家都这么做”多问一句为什么。越是只剩标准答案的地方，你越想自己试出另一条路。',
  },
  {
    high: '你很容易进入人群中心：不一定是最吵的，但你会影响现场气氛、关系流动，别人也更容易注意到你。',
    mid: '你在人群里的存在感是可调的。熟悉时能进入中心，不熟或没兴趣时也能迅速退回自己的位置。',
    low: '你更习惯给自己留一点边缘位置。不是排斥别人，而是你需要先确认这个场域值不值得自己真正进入。',
  },
];

function dimensionCopy(index: number, value: number) {
  const set = DIMENSION_COPY[index];
  if (value >= 7) return set.high;
  if (value <= 4) return set.low;
  return set.mid;
}

function firstImpression(coords: number[]) {
  const social = coords[4];
  const emotion = coords[1];
  if (social >= 7 && emotion >= 7) return '别人很容易先记住你的存在感和情绪反应，你通常不是“完全没印象”的那类人。';
  if (social <= 4 && emotion <= 4) return '第一眼你可能显得安静、克制、甚至有点难读，真正的信息通常藏在相处之后。';
  if (social >= 7) return '别人容易觉得你会接住场面、能融进人群，但未必马上知道你真正的底线在哪。';
  return '别人最先看到的通常不是你的全部。你会留一点距离，让关系慢慢决定你展示多少。';
}

function pressureMode(coords: number[]) {
  if (coords[0] >= 7 && coords[2] >= 7) return '越到关键时刻，你越容易从情绪里切回行动：先处理、先救场、先把局面重新抓住。';
  if (coords[1] >= 8) return '压力真正击中你时，最先放大的往往不是任务本身，而是“这件事对我意味着什么”。';
  if (coords[3] <= 3) return '压力一大，你反而更容易推翻原方案。别人忙着守计划时，你可能已经在找出口。';
  return '你在压力下通常先确认边界和可控部分，再决定是稳住还是换路。';
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
    ctx.fillStyle = 'rgba(255,255,255,.30)';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(`隐藏副角色：${secondaryRole?.name ?? '—'}`, 86, 1260);
    ctx.fillText(role.tags.map((t) => `#${t}`).join('   '), 86, 1322);
    ctx.fillText('28幕剧本角色测试 · 娱乐互动结果', 86, 1362);

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

        <section className="dossier-grid">
          <article className="dossier-card">
            <span>别人第一眼</span>
            <p>{firstImpression(userCoords)}</p>
          </article>
          <article className="dossier-card">
            <span>压力一上来</span>
            <p>{pressureMode(userCoords)}</p>
          </article>
          <article className="dossier-card accent-card">
            <span>你最亮的一条线</span>
            <strong>{DIMENSIONS[strongestIndex].label}</strong>
            <p>{dimensionCopy(strongestIndex, userCoords[strongestIndex])}</p>
          </article>
          <article className="dossier-card">
            <span>别人最容易看错</span>
            <p>{role.reversal}</p>
          </article>
        </section>

        <section className="story-section">
          <div className="section-kicker">你的五维角色图</div>
          <RadarChart values={userCoords} accent={role.accent} />
        </section>

        <section className="story-section dimension-story-section">
          <div className="section-kicker">把五维翻译成人话</div>
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

        {secondaryRole && (
          <section className="secondary-role-card">
            <div className="secondary-role-topline">HIDDEN ROUTE · 你的另一条剧情线</div>
            <div className="secondary-role-name">{secondaryRole.name}</div>
            <p>{secondaryRole.tagline}</p>
            <small>
              你和它的距离也很近。也就是说，在不同环境、不同关系或压力状态下，你可能会从「{role.name}」切到「{secondaryRole.name}」。
            </small>
          </section>
        )}

        <section className="story-section">
          <div className="section-kicker">你的角色候选席</div>
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
