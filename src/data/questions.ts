import type { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    scene: '状态',
    text: '现在的你，更接近哪种状态？',
    options: [
      { text: '正在一段关系里', vector: [null, null, null, null, null] },
      { text: '有一个正在暧昧的人', vector: [null, null, null, null, null] },
      { text: '有喜欢的人，但关系还没有开始', vector: [null, null, null, null, null] },
      { text: '目前没有具体对象', vector: [null, null, null, null, null] },
    ],
  },
  {
    scene: '信号 01',
    text: '一个原本每天都会联系你的人，最近两三天明显话少了。',
    options: [
      { text: '第一反应是最近可能比较忙', vector: [2, null, 2, null, null] },
      { text: '会感觉到变化，但先观察', vector: [4, null, 4, null, null] },
      { text: '会开始想是不是自己哪里做得不对', vector: [8, null, 8, null, 6] },
      { text: '很想尽快确认 TA 是不是态度变了', vector: [10, null, 9, 8, 2] },
    ],
  },
  {
    scene: '信号 02',
    text: '你们聊到下个月一起做某件事，对方只说：“到时候再看看吧。”',
    options: [
      { text: '很正常，本来就还有很久', vector: [2, null, 2, null, null] },
      { text: '会稍微在意，但不会想太多', vector: [4, null, 4, null, null] },
      { text: '会怀疑 TA 是不是根本没把这件事放在心上', vector: [7, null, 8, null, null] },
      { text: '很容易进一步想到 TA 是不是没那么想继续发展', vector: [10, null, 10, null, null] },
    ],
  },
  {
    scene: '信号 03',
    text: '前一天你们相处得特别好，第二天 TA 却明显平淡很多。',
    options: [
      { text: '两天状态不一样很正常', vector: [2, null, 2, null, null] },
      { text: '会留意，但不急着定义', vector: [4, null, 4, null, null] },
      { text: '会反复想昨天是不是有什么地方出了问题', vector: [8, null, 8, null, 6] },
      { text: '很难不怀疑昨天的感觉是不是只有自己觉得很好', vector: [10, null, 9, null, 7] },
    ],
  },
  {
    scene: '信号 04',
    text: '你第一次跟 TA 说了一件对你比较重要、比较脆弱的事情，TA 过了很久才回复。',
    options: [
      { text: '回复速度不能说明什么', vector: [2, 2, 2, null, null] },
      { text: '会有一点期待落空', vector: [4, 3, 4, null, null] },
      { text: '会后悔自己是不是说太多了', vector: [7, 7, 7, null, 7] },
      { text: '容易觉得 TA 可能根本没那么在意自己', vector: [10, 6, 10, null, 8] },
    ],
  },
  {
    scene: '信号 05',
    text: '如果一段关系突然进入一个“说不清到底算什么”的阶段，你更容易？',
    options: [
      { text: '正常相处，等事情自然清晰', vector: [2, null, 2, 4, null] },
      { text: '偶尔想，但不影响生活', vector: [4, null, 4, 4, null] },
      { text: '会越来越想知道 TA 到底怎么想', vector: [8, null, 7, 6, null] },
      { text: '这种不确定本身就会让我很难受', vector: [10, null, 8, 7, null] },
    ],
  },
  {
    scene: '靠近 01',
    text: '一个你本来很喜欢的人开始每天和你分享：吃了什么、去了哪、今天心情怎么样。',
    options: [
      { text: '我会喜欢这种越来越进入彼此生活的感觉', vector: [null, 1, null, null, null] },
      { text: '可以，但不用所有事情都说', vector: [null, 4, null, null, null] },
      { text: '时间久了可能会觉得有点累', vector: [null, 7, null, null, null] },
      { text: '这种密度很容易让我产生想躲开的感觉', vector: [null, 10, null, null, null] },
    ],
  },
  {
    scene: '靠近 02',
    text: 'TA 状态不好，越来越习惯第一时间来找你。',
    options: [
      { text: '会觉得这是关系变亲近的表现', vector: [null, 2, null, null, null] },
      { text: '愿意陪，但也需要各自处理自己的事情', vector: [null, 4, null, null, null] },
      { text: '偶尔会产生“怎么又找我”的压力', vector: [null, 7, null, null, null] },
      { text: '别人太依赖我，会让我明显想拉开一点距离', vector: [null, 10, null, null, null] },
    ],
  },
  {
    scene: '靠近 03',
    text: 'TA 开始带你认识朋友，并逐渐把你放进自己的生活计划里。',
    options: [
      { text: '会觉得关系正在变得认真', vector: [null, 2, null, null, null] },
      { text: '开心，但我还是会按自己的节奏来', vector: [null, 4, null, null, null] },
      { text: '会开始意识到“这好像越来越正式了”', vector: [null, 7, null, null, null] },
      { text: '越正式反而越容易让我产生退后的冲动', vector: [null, 10, null, null, 6] },
    ],
  },
  {
    scene: '靠近 04',
    text: 'TA 认真问你：“你真正需要我怎么对你？”',
    options: [
      { text: '能比较直接地说自己的需要', vector: [null, 2, null, null, 1] },
      { text: '要想一下，但能慢慢说', vector: [null, 3, null, null, 4] },
      { text: '经常不知道怎么回答', vector: [null, 6, null, null, 7] },
      { text: '比起说出自己的需要，我更习惯自己解决', vector: [null, 8, null, null, 10] },
    ],
  },
  {
    scene: '靠近 05',
    text: '一段原本充满刺激和不确定的关系，突然变得非常稳定。',
    options: [
      { text: '会明显更安心', vector: [2, 1, null, null, null] },
      { text: '不会觉得无聊，只是感觉变了', vector: [3, 3, null, null, null] },
      { text: '有时候反而会觉得少了点什么', vector: [4, 7, null, null, null] },
      { text: '我确实容易在关系真正稳定以后兴趣下降', vector: [4, 10, null, null, null] },
    ],
  },
  {
    scene: '解读 01',
    text: '你主动约 TA 周末出去，TA 回复：“这周可能不行，到时候看看。”',
    options: [
      { text: 'TA 真的还不能确定时间', vector: [null, null, 1, 6, null] },
      { text: '有点失落，但信息还不够', vector: [null, null, 4, 5, null] },
      { text: '这大概率就是委婉拒绝', vector: [null, null, 8, 3, null] },
      { text: '基本会认为 TA 不想见我，也不会再主动问', vector: [null, null, 10, 1, 7] },
    ],
  },
  {
    scene: '解读 02',
    text: '你给 TA 发了一段自己觉得挺有意思的话，TA 只回：“哈哈哈。”',
    options: [
      { text: '没什么特别感觉', vector: [null, null, 1, 6, null] },
      { text: '会觉得 TA 今天好像没什么聊天状态', vector: [null, null, 4, 5, null] },
      { text: '会觉得 TA 是不是不太想继续聊', vector: [null, null, 8, 3, null] },
      { text: '我大概率会顺势结束，不再往下接', vector: [null, null, 10, 1, 7] },
    ],
  },
  {
    scene: '解读 03',
    text: 'TA 取消了一次约会，但没有马上提出下一次时间。',
    options: [
      { text: '等 TA 有空再说', vector: [null, null, 2, 5, null] },
      { text: '会有点在意 TA 为什么没有重新约', vector: [null, null, 5, 4, null] },
      { text: '会开始怀疑这段关系是不是还值得继续投入', vector: [null, null, 8, 3, null] },
      { text: '基本不会再由我提出第二次', vector: [null, null, 10, 1, 7] },
    ],
  },
  {
    scene: '解读 04',
    text: '一个朋友见过你和 TA 相处后随口说：“我感觉 TA 好像没有你那么投入。”',
    options: [
      { text: '别人的观察不一定准', vector: [2, null, 2, null, null] },
      { text: '会让我稍微注意一下', vector: [4, null, 4, null, null] },
      { text: '之后会开始特别注意 TA 是不是确实不够投入', vector: [7, null, 8, null, null] },
      { text: '很可能一下子动摇我对这段关系的信心', vector: [10, null, 10, null, null] },
    ],
  },
  {
    scene: '解读 05',
    text: '你们刚有一点小矛盾，之后 TA 回复明显变短。',
    options: [
      { text: '可能只是还需要一点时间', vector: [2, null, 2, null, null] },
      { text: '说明 TA 确实还不高兴', vector: [4, null, 5, null, null] },
      { text: 'TA 是不是开始对我失望了', vector: [8, null, 8, null, null] },
      { text: '我会担心这件小事正在改变整段关系', vector: [10, null, 10, null, null] },
    ],
  },
  {
    scene: '靠近行动 01',
    text: '你已经基本确定：你喜欢 TA，而且 TA 对你应该也有感觉。',
    options: [
      { text: '主动制造进一步发展的机会', vector: [3, null, null, 10, null] },
      { text: '比以前明显多给一些信号', vector: [4, null, null, 7, null] },
      { text: '继续观察，等 TA 再明确一点', vector: [7, null, null, 3, null] },
      { text: '越到这种时候我反而越容易停住', vector: [8, 5, null, 1, null] },
    ],
  },
  {
    scene: '靠近行动 02',
    text: 'TA 过几天要离开一段时间。如果这次不见，可能很久见不到。',
    options: [
      { text: '会主动约', vector: [null, null, null, 10, 2] },
      { text: '会给一个比较明显的暗示', vector: [null, null, null, 7, 4] },
      { text: '希望 TA 主动提出', vector: [null, null, null, 3, 6] },
      { text: '如果 TA 没有提，我大概率就算了', vector: [null, null, null, 1, 8] },
    ],
  },
  {
    scene: '靠近行动 03',
    text: '你很想给 TA 发一条消息，但又找不到什么“正经理由”。',
    options: [
      { text: '想发就发', vector: [null, null, null, 10, 1] },
      { text: '会随便找个自然的话题', vector: [null, null, null, 7, 3] },
      { text: '会等有合适理由再说', vector: [null, null, null, 4, 6] },
      { text: '想了很久，最后还是没发出去', vector: [null, null, null, 1, 8] },
    ],
  },
  {
    scene: '靠近行动 04',
    text: '你意识到：如果谁都不主动，这段关系可能就慢慢没了。',
    options: [
      { text: '那我会往前一步', vector: [3, null, null, 10, 2] },
      { text: '至少会试一次', vector: [4, null, null, 7, 3] },
      { text: '我还是希望 TA 先表示', vector: [7, null, null, 3, 6] },
      { text: '宁愿留下遗憾，我也很难先把心意露出来', vector: [9, 5, 7, 1, 9] },
    ],
  },
  {
    scene: '表达 01',
    text: 'TA 当着别人开了一个让你有点不舒服的玩笑。',
    options: [
      { text: '当场告诉 TA 这个玩笑我不喜欢', vector: [null, null, null, 8, 1] },
      { text: '当时不说，之后会私下告诉 TA', vector: [null, null, null, 6, 3] },
      { text: '会先自己消化，看下次还会不会发生', vector: [null, null, null, 3, 7] },
      { text: '多半不会说，但心里会记住', vector: [null, null, null, 1, 10] },
    ],
  },
  {
    scene: '表达 02',
    text: 'TA 和另一个人走得很近，你确实有一点在意。',
    options: [
      { text: '会坦白说自己有点介意', vector: [4, null, null, 7, 1] },
      { text: '会先观察，再找合适机会说', vector: [5, null, null, 5, 4] },
      { text: '通常不会承认自己在意', vector: [7, null, null, 3, 8] },
      { text: '会表现得更冷一点，但不太愿意直接说原因', vector: [8, 6, null, 1, 10] },
    ],
  },
  {
    scene: '表达 03',
    text: '一个对你很重要的日子，TA 明显没有你期待得那么上心。',
    options: [
      { text: '会直接表达失望', vector: [null, null, null, 7, 1] },
      { text: '会说，但等自己情绪平一点', vector: [null, null, null, 6, 3] },
      { text: '更容易告诉自己“算了，也没什么”', vector: [null, null, null, 3, 7] },
      { text: '嘴上不会说什么，但之后对 TA 的感觉可能会变', vector: [null, null, 6, 1, 10] },
    ],
  },
  {
    scene: '表达 04',
    text: '你需要 TA 给你一点安慰或确定感。',
    options: [
      { text: '直接说“我现在确实需要你陪陪我”', vector: [3, 2, null, 8, 1] },
      { text: '会用比较委婉的方式表达', vector: [4, 3, null, 6, 4] },
      { text: '希望 TA 自己看出来', vector: [7, 5, null, 3, 7] },
      { text: '如果 TA 看不出来，我通常也不会主动开口', vector: [8, 8, null, 1, 10] },
    ],
  },
  {
    scene: '冲突 01',
    text: '你们因为一件双方都很在意的事情意见完全不同。',
    options: [
      { text: '把各自到底在意什么弄清楚，再找折中办法', vector: [3, 2, null, 7, 2] },
      { text: '会不停解释，希望 TA 最终理解我的立场', vector: [7, 2, null, 9, 2] },
      { text: '如果继续争下去太累，我可能会先顺着 TA', vector: [6, 5, null, 2, 8] },
      { text: '很可能直接不想说了，等自己平静下来', vector: [5, 7, null, 2, 9] },
    ],
  },
  {
    scene: '冲突 02',
    text: '发生矛盾以后，TA 说：“我现在真的不想聊，明天再说。”',
    options: [
      { text: '可以，明天再认真解决', vector: [2, 2, null, 6, 2] },
      { text: '可以，但我需要确定明天真的会谈', vector: [6, 2, null, 6, 3] },
      { text: '会很想现在就解决，不然这一晚很难熬', vector: [10, 2, null, 10, 2] },
      { text: 'TA 既然不说，那我也不会再主动提', vector: [6, 8, 7, 1, 10] },
    ],
  },
  {
    scene: '边界',
    text: 'TA 已经是第三次临时取消原本答应你的事情。',
    options: [
      { text: '直接说清楚，这已经影响到我对关系的判断', vector: [3, null, 4, 8, 2] },
      { text: '会问清楚到底发生了什么，再决定', vector: [4, null, 4, 6, 3] },
      { text: '会很失望，但可能还是说“没关系”', vector: [7, null, 6, 2, 9] },
      { text: '不太想争，我会开始慢慢减少投入', vector: [6, 7, 9, 1, 9] },
    ],
  },
  {
    scene: '脆弱',
    text: '你有一件一直不太愿意让别人知道的事情。关系越来越近以后，你更可能？',
    options: [
      { text: '我会主动告诉 TA', vector: [null, 1, null, 7, 1] },
      { text: '等确定足够信任以后说', vector: [null, 3, null, 5, 4] },
      { text: '即使关系不错，我也可能拖很久', vector: [null, 7, null, 2, 8] },
      { text: '我不太喜欢任何人真正进入这一部分', vector: [null, 10, null, 1, 10] },
    ],
  },
  {
    scene: '暧昧',
    text: '你们已经做了很多明显超过普通朋友的事情，但始终没人提“我们到底算什么”。',
    options: [
      { text: '我会找机会主动谈清楚', vector: [4, null, null, 9, 2] },
      { text: '会释放更明确的信号，等 TA 接住', vector: [5, null, null, 7, 4] },
      { text: '会继续相处，但心里越来越在意', vector: [8, null, null, 3, 7] },
      { text: '如果一直这样，我可能先把自己撤回来', vector: [7, 7, 8, 1, 8] },
    ],
  },
  {
    scene: '修复',
    text: '你们昨天吵得挺凶，但今天双方都冷静很多。',
    options: [
      { text: '我会主动重新开启对话，把问题解决掉', vector: [3, 2, null, 9, 2] },
      { text: '等一个合适时机，再慢慢谈', vector: [4, 3, null, 6, 4] },
      { text: '我希望 TA 先来找我', vector: [6, 5, null, 3, 7] },
      { text: '如果 TA 一直不提，我也能一直不提', vector: [6, 8, null, 1, 10] },
    ],
  },
  {
    scene: '退场',
    text: '某一天，你明显感觉到 TA 对这段关系的投入正在下降。',
    options: [
      { text: '直接确认到底发生了什么', vector: [7, null, 5, 9, 2] },
      { text: '先观察一段时间再判断', vector: [5, null, 5, 4, 5] },
      { text: '会更努力一点，看能不能把关系拉回来', vector: [10, null, 7, 10, 3] },
      { text: '会开始提前把自己从这段关系里撤出来', vector: [7, 7, 10, 1, 9] },
    ],
  },
  {
    scene: '结尾',
    text: '如果一段你认真过的关系没有得到一个很清楚的结尾，你更接近？',
    options: [
      { text: '关系结束这件事本身就是答案', vector: [2, 3, 2, null, 2] },
      { text: '会遗憾，但慢慢也能往前走', vector: [4, 3, 4, null, 4] },
      { text: '很长时间以后，我可能还会想知道到底为什么', vector: [7, 4, 7, null, 8] },
      { text: '如果有机会，我确实很想从 TA 那里得到一个真正的解释', vector: [9, 4, 8, 6, 9] },
    ],
  },
];
