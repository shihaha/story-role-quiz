interface IntroProps {
  onStart: () => void;
}

export default function Intro({ onStart }: IntroProps) {
  return (
    <section className="intro-screen">
      <div className="grain" />
      <div className="mobile-status-pill">剧情匹配档案 · 已解锁</div>
      <div className="intro-card">
        <div className="eyebrow">STORY ROLE TEST · 28 SCENES · 16 ROLES</div>
        <h1>如果把你写进一部剧里</h1>
        <h2>你会拿到什么角色？</h2>
        <p className="lead">
          不问“你是不是内向”这种空题。<br />
          28 个更像真实生活的剧情选择，从你怎么处理关系、冲突、机会、压力和退场方式里，匹配最像你的角色。
        </p>
        <div className="intro-feature-strip">
          <div><strong>关系线</strong><span>你怎么靠近，也怎么退出</span></div>
          <div><strong>高光线</strong><span>你最容易在哪一幕翻盘</span></div>
          <div><strong>隐藏线</strong><span>别人最容易看错你的地方</span></div>
        </div>
        <button className="primary-button hero-start" onClick={onStart}>开始进入你的剧情</button>
        <div className="meta-row">
          <span>28 道情境</span><span>约 5 分钟</span><span>16 种结果</span>
        </div>
        <p className="privacy-note">无需登录 · 不收集姓名 · 结果仅保存在当前页面</p>
      </div>
      <div className="teaser-grid" aria-hidden="true">
        <span>白切黑女二</span><span>黑马</span><span>幕后玩家</span><span>不按剧本</span>
        <span>意难平</span><span>压轴</span><span>一身反骨</span><span>最后赢家</span>
      </div>
    </section>
  );
}
