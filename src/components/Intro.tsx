interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  return (
    <section className="intro-screen">
      <div className="grain" />
      <div className="intro-card">
        <div className="eyebrow">STORY ROLE TEST · 16 ROLES</div>
        <h1>如果把你写进一部剧里</h1>
        <h2>你会拿到什么角色？</h2>
        <p className="lead">
          16 道生活情境选择，不测你像哪个明星，也不硬套 MBTI。<br />
          看看你在一段剧情里，最容易活成哪一种角色。
        </p>
        <button className="primary-button" onClick={onStart}>进入第一幕</button>
        <div className="meta-row">
          <span>16 道情境</span><span>约 3 分钟</span><span>16 种结果</span>
        </div>
      </div>
      <div className="teaser-grid" aria-hidden="true">
        <span>白切黑女二</span><span>黑马</span><span>幕后玩家</span><span>不按剧本</span>
        <span>意难平</span><span>压轴</span><span>一身反骨</span><span>最后赢家</span>
      </div>
    </section>
  );
}
