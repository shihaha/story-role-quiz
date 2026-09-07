import { useState, type CSSProperties } from 'react';
import RadarChart from './RadarChart';
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

function loadRasterImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

const RESULT_IMAGE_MAP: Record<string, string> = {
  'steady-after-mutual': '/assets/results/result-01.webp',
  'slow-to-start': '/assets/results/result-02.webp',
  'keep-self': '/assets/results/result-03.webp',
  'need-to-know': '/assets/results/result-04.webp',
  'cooling-means-something': '/assets/results/result-05.webp',
  'wait-for-clearer-signal': '/assets/results/result-06.webp',
  'best-in-ambiguity': '/assets/results/result-07.webp',
  'pull-away-when-chased': '/assets/results/result-08.webp',
  'leave-before-rejection': '/assets/results/result-09.webp',
  'fine-but-not-fine': '/assets/results/result-10.webp',
  'solve-it-now': '/assets/results/result-11.webp',
  'need-a-real-ending': '/assets/results/result-12.webp',
};
const RESULT_TITLE_FOCUS: Record<string, string> = {
  'steady-after-mutual': '越谈越稳',
  'slow-to-start': '很少贸然开始',
  'keep-self': '不会把自己全搭进去',
  'need-to-know': '越想知道对方怎么想',
  'cooling-means-something': '重新判断整段关系',
  'wait-for-clearer-signal': '再确定一点',
  'best-in-ambiguity': '真的靠近以后反而开始犹豫',
  'pull-away-when-chased': '越容易想退',
  'leave-before-rejection': '比对方更早退出',
  'fine-but-not-fine': '心里其实还在记着',
  'solve-it-now': '马上把话说清楚',
  'need-a-real-ending': '一个真正的句号',
};

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (imageRatio > boxRatio) {
    sourceWidth = image.height * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / boxRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

export default function Results({ result, onRestart }: ResultsProps) {
  const { role, score, userCoords, ranking } = result;
  const [copied, setCopied] = useState(false);
  const top3 = ranking.slice(0, 3);
  const secondaryRole = ranking[1]?.role;
  const strongestIndex = userCoords.indexOf(Math.max(...userCoords));
  const resultImageSrc = RESULT_IMAGE_MAP[role.id] ?? '/assets/results/result-01.webp';
  const titleFocus = RESULT_TITLE_FOCUS[role.id] ?? '';
  const focusIndex = titleFocus ? role.name.indexOf(titleFocus) : -1;
  const titleBefore = focusIndex >= 0 ? role.name.slice(0, focusIndex) : role.name;
  const titleAfter = focusIndex >= 0 ? role.name.slice(focusIndex + titleFocus.length) : '';

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

  const downloadCard = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 1080, 1440);
    bg.addColorStop(0, '#FFF8FA');
    bg.addColorStop(0.62, '#FFFDFD');
    bg.addColorStop(1, '#F8F1FA');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1440);

    const glow = ctx.createRadialGradient(820, 160, 0, 820, 160, 620);
    glow.addColorStop(0, 'rgba(245,112,151,.22)');
    glow.addColorStop(1, 'rgba(245,112,151,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1080, 700);

    ctx.fillStyle = '#9B8795';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('LOVE STORY TEST · 32 SCENES', 72, 92);

    ctx.fillStyle = '#5F4E5B';
    ctx.font = '30px system-ui, sans-serif';
    ctx.fillText('你的恋爱剧情是', 72, 154);

    ctx.fillStyle = '#D95377';
    ctx.font = '600 62px "Kaiti SC", KaiTi, serif';
    let y = wrapCanvasText(ctx, role.name, 72, 236, 936, 76, 3);

    ctx.fillStyle = '#8D7582';
    ctx.font = '28px system-ui, sans-serif';
    y = wrapCanvasText(ctx, `“${role.tagline}”`, 72, y + 2, 920, 42, 2);

    ctx.fillStyle = '#E25D7E';
    ctx.font = 'bold 23px system-ui, sans-serif';
    ctx.fillText(`匹配度 ${score}%`, 72, y + 8);

    const imageY = y + 48;
    const imageX = 72;
    const imageWidth = 936;
    const imageHeight = 500;

    try {
      const image = await loadRasterImage(resultImageSrc);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 34);
      ctx.clip();
      drawCoverImage(ctx, image, imageX, imageY, imageWidth, imageHeight);
      ctx.restore();
    } catch {
      const fallback = ctx.createLinearGradient(imageX, imageY, imageX + imageWidth, imageY + imageHeight);
      fallback.addColorStop(0, '#E6CBE5');
      fallback.addColorStop(1, '#F5A7B6');
      ctx.fillStyle = fallback;
      ctx.beginPath();
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 34);
      ctx.fill();
    }

    const noteX = 520;
    const noteY = imageY + 390;
    ctx.save();
    ctx.translate(noteX + 210, noteY + 70);
    ctx.rotate(0.025);
    ctx.translate(-(noteX + 210), -(noteY + 70));
    ctx.fillStyle = 'rgba(255,247,242,.97)';
    ctx.beginPath();
    ctx.roundRect(noteX, noteY, 420, 150, 16);
    ctx.fill();
    ctx.fillStyle = '#865F67';
    ctx.font = '28px "Kaiti SC", KaiTi, serif';
    wrapCanvasText(ctx, role.quote, noteX + 24, noteY + 46, 372, 38, 3);
    ctx.restore();

    const tagsY = imageY + imageHeight + 72;
    let tagX = 72;
    ctx.font = '24px system-ui, sans-serif';
    role.tags.slice(0, 4).forEach((tag) => {
      const width = ctx.measureText(tag).width + 44;
      ctx.fillStyle = '#FFF0F4';
      ctx.beginPath();
      ctx.roundRect(tagX, tagsY, width, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#D65A79';
      ctx.fillText(tag, tagX + 22, tagsY + 32);
      tagX += width + 14;
    });

    ctx.fillStyle = '#5A4958';
    ctx.font = 'bold 27px system-ui, sans-serif';
    ctx.fillText('在感情里，你可能会……', 72, tagsY + 108);

    ctx.fillStyle = '#746471';
    ctx.font = '24px system-ui, sans-serif';
    const bullets = [firstImpression(userCoords), pressureMode(userCoords)];
    let bulletY = tagsY + 158;
    bullets.forEach((text) => {
      ctx.fillStyle = '#EE6788';
      ctx.beginPath();
      ctx.arc(82, bulletY - 7, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#746471';
      bulletY = wrapCanvasText(ctx, text, 106, bulletY, 860, 36, 2) + 10;
    });

    ctx.fillStyle = '#B3A2AE';
    ctx.font = '21px system-ui, sans-serif';
    ctx.fillText('测试结果仅供娱乐', 72, 1378);
    ctx.textAlign = 'right';
    ctx.fillText('你最容易陷入哪种恋爱剧情？', 1008, 1378);
    ctx.textAlign = 'left';

    const link = document.createElement('a');
    link.download = `恋爱剧情测试-${role.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="results-screen" style={{ '--accent': role.accent } as CSSProperties}>
      <div className="result-hero">
        <div className="result-hero-inner">
          <div className="result-meta-row">
            <div className="result-eyebrow">你的恋爱剧情</div>
            <div className="result-score">匹配度 {score}%</div>
          </div>
          <div className="result-keyword">{role.tags[0]}</div>
          <h1>
            {titleBefore}
            {focusIndex >= 0 && <span className="result-title-focus">{titleFocus}</span>}
            {titleAfter}
          </h1>
          <p className="result-tagline">“{role.tagline}”</p>
          <div className="result-art-card">
            <img
              className="result-story-art"
              src={resultImageSrc}
              alt={`${role.name}的专属剧情插画`}
            />
            <div className="result-photo-note">{role.quote}</div>
          </div>
          <div className="tag-row">{role.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>

      <div className="result-content">
        <section className="result-quick-summary">
          <div className="section-kicker">在感情里，你可能会……</div>
          <ul className="result-bullets">
            <li>{firstImpression(userCoords)}</li>
            <li>{pressureMode(userCoords)}</li>
            <li>{dimensionCopy(strongestIndex, userCoords[strongestIndex])}</li>
          </ul>
        </section>

        <div className="result-actions result-actions-primary">
          <button className="primary-button" onClick={downloadCard}>分享我的结果</button>
          <button className="secondary-button" onClick={onRestart}>重新测试</button>
        </div>

        <div className="detail-heading">
          <span>更了解你</span>
          <p>下面是你的关系倾向和更具体的解释</p>
        </div>

        <section className="story-section tendency-section">
          <div className="section-kicker">你的恋爱倾向</div>
          <RadarChart values={userCoords} accent={role.accent} />
        </section>

        <section className="advice-card">
          <div className="advice-title"><span>♥</span> 给你的一个小建议</div>
          <p>{role.reversal}</p>
        </section>

        <section className="story-section lead-section">
          <div className="section-kicker">为什么你最容易走进这条剧情</div>
          <p>{role.summary}</p>
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

        <div className="result-actions result-actions-secondary">
          <button className="secondary-button" onClick={copyResult}>{copied ? '已复制' : '复制结果文案'}</button>
        </div>

        <p className="disclaimer">测试结果仅供娱乐</p>
      </div>
    </section>
  );
}
