interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  return (
    <section className="intro-screen">
      <div className="grain" />
      <div className="mobile-status-pill">恋爱剧情测试 · 已解锁</div>
      <div className="intro-card">
        <div className="eyebrow">LOVE STORY TEST · 32 SCENES · 12 ROUTES</div>
        <h1>你最容易陷入</h1>
        <h2>哪种恋爱剧情？</h2>
        <p className="lead">
          不问空泛的人格题。<br />
          32 个更像真的会发生的恋爱选择，看你在暧昧、靠近、误解、冲突和退场时，最容易把关系走成什么样。
        </p>
        <div className="intro-feature-strip">
          <div><strong>暧昧线</strong><span>你会等，还是会往前走</span></div>
          <div><strong>靠近线</strong><span>关系变近以后，你会发生什么</span></div>
          <div><strong>冲突线</strong><span>一有问题，你会追、等还是退</span></div>
        </div>
        <button className="primary-button hero-start" onClick={onStart}>看看你最容易走进哪条剧情</button>
        <div className="meta-row">
          <span>32 道情境</span><span>约 5 分钟</span><span>12 种剧情</span>
        </div>
        <p className="privacy-note">无需登录 · 不收集姓名 · 测试结果仅供娱乐</p>
      </div>
      <div className="teaser-grid" aria-hidden="true">
        <span>越喜欢越想知道答案</span><span>总卡在“再确定一点”</span><span>靠近以后反而犹豫</span><span>一有问题就想说清楚</span>
        <span>对方一冷就重新判断</span><span>嘴上没事心里还记着</span><span>先退出再说</span><span>确认双向后越来越稳</span>
      </div>
    </section>
  );
}
