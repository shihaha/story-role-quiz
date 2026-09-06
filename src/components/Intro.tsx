interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  return (
    <section className="intro-screen">
      <div className="intro-card romance-cover">
        <div className="cover-visual">
          <img src="/hero-romance.svg" alt="夜晚窗边的恋爱剧情插画" />
          <div className="cover-shade" />
          <div className="cover-brand">LOVE<br />STORY<br />TEST</div>
          <div className="cover-copy">
            <span className="cover-kicker">32 个真实关系场景</span>
            <h1>你最容易陷入<br />哪种恋爱剧情？</h1>
            <p>同样是心动，有人会回避，有人会拉扯。<br />而你，最容易把关系走成什么样？</p>
          </div>
        </div>

        <div className="cover-actions">
          <button className="primary-button hero-start" onClick={onStart}>开始测试 <span>→</span></button>
          <div className="cover-stats" aria-label="测试信息">
            <div><strong>32</strong><span>道题</span></div>
            <div><strong>12</strong><span>种剧情</span></div>
            <div><strong>≈5</strong><span>分钟</span></div>
          </div>
          <p className="privacy-note">测试结果仅供娱乐</p>
        </div>
      </div>
    </section>
  );
}
