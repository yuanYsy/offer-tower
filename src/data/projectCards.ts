import type { Card } from '../types';

// ============ 项目实战映射卡 ============
// 每层全通关必掉落该层绑定的项目卡。
// 正面 = 八股考点提炼（frontPoint），背面 = 项目实战话术（content）。
export const projectCards: Card[] = [
  {
    id: 'projcard-1f',
    type: 'project',
    rarity: 'SR',
    title: 'HashMap 与 ConcurrentHashMap 缓存实战',
    frontPoint:
      'HashMap 数组+链表+红黑树；扩容 2 倍 rehash；ConcurrentHashMap 分段锁 / CAS+synchronized 保证并发安全。',
    projectContext: '云观教育',
    relatedModule: '语法回廊',
    module: '语法回廊',
    content:
      '在云观教育项目中，课程详情与章节目录属于高频读、低频写数据。我用 ConcurrentHashMap 做了一级本地缓存挡在 Redis 前面：读请求先命中本地，未命中再回源 Redis 并回填。选择 ConcurrentHashMap 而不是 HashMap+锁，是因为它的锁粒度更细——JDK8 后只对桶头节点加 synchronized，配合 CAS 插入，多线程并发读几乎无竞争。对读多写少的课程缓存场景，QPS 比全局锁提升了约 6 倍。',
  },
  {
    id: 'projcard-2f',
    type: 'project',
    rarity: 'SR',
    title: '微服务链路与分布式事务落地',
    frontPoint:
      'Spring Cloud Alibaba 组件选型；Seata AT 模式一阶段提交+二阶段异步回滚；全局锁避免脏写。',
    projectContext: '智汇餐饮',
    relatedModule: '分布式迷城',
    module: '分布式迷城',
    content:
      '智汇餐饮的下单链路跨三个服务：订单、库存、优惠券。我用 Nacos 做注册配置中心，Sentinel 在入口限流。下单扣库存用 Seata AT 模式保证最终一致：一阶段各服务本地 SQL 直接提交并记录 undo_log，二阶段全部成功则异步删日志，任一失败则按镜像回滚。之所以不用强一致的 XA，是因为餐饮下单对吞吐量敏感，AT 模式把全局锁的持有时间压缩到了毫秒级，压测下单接口 P99 稳定在 120ms 以内。',
  },
  {
    id: 'projcard-3f',
    type: 'project',
    rarity: 'SR',
    title: 'Redis+Lua 秒杀优惠券原子性设计',
    frontPoint:
      'Redis 单线程模型+Lua 脚本原子执行；库存预扣+消息队列削峰；防超卖与一人一单。',
    projectContext: '智汇餐饮',
    relatedModule: '数据深渊',
    module: '数据深渊',
    content:
      '在智汇餐饮的秒杀优惠券模块，我把库存预加载到 Redis，用 Lua 脚本把「判断库存 > 判断是否已领取 > 扣减库存 > 记录用户」这四步合并成一次原子执行，从根源上杜绝了超卖和一人一单问题。扣减成功后只发一条消息到 RabbitMQ 异步落库，数据库压力瞬间被削平。之所以用 Lua 而不是分布式锁，是因为 Lua 在 Redis 单线程里天然原子，省去了加锁的往返开销，单机 QPS 从 3k 拉到了 1.2w。',
  },
  {
    id: 'projcard-4f',
    type: 'project',
    rarity: 'SSR',
    title: 'RAG 全流程优化：首字响应 <350ms',
    frontPoint:
      'RAG 五步流程；混合召回+Rerank 提升检索质量；流式输出+缓存降低首字延迟。',
    projectContext: '云观教育',
    relatedModule: 'AI 炼金工坊',
    module: 'AI 炼金工坊',
    content:
      '云观教育的 AI 答疑助手最初首字响应要 1.8s。我做了三层优化把它压到 350ms 以内：第一层检索用「向量召回+BM25」双路混合召回，再交 Cross-Encoder 精排，召回质量提升后 Prompt 更短、生成更快；第二层把高频问题的答案做成结果缓存，命中直接返回；第三层全链路改流式输出，首 token 一到就立刻推给前端。最终首字响应降到 320ms，幻觉率也因为检索更准而下降了约 40%。',
  },
  {
    id: 'projcard-5f',
    type: 'project',
    rarity: 'SR',
    title: 'TPS 3 倍提升的压测与调优闭环',
    frontPoint:
      'STAR 法则；压测环境/工具/阶梯加压/P99 定位瓶颈；慢 SQL 与连接池调优。',
    projectContext: '云观教育',
    relatedModule: '项目档案室',
    module: '项目档案室',
    content:
      '被问「TPS 怎么做到 3 倍」时我这样答：在云观教育项目，我用 JMeter 阶梯加压定位到瓶颈是课程列表接口的慢 SQL 和默认连接池太小。先把一条三表联查改成覆盖索引+延迟关联，再把 HikariCP 连接池从 10 调到与 CPU 核数匹配并开启慢 SQL 监控。每改一步都重新压测对比 P95/P99，最终列表接口 TPS 从 800 提到 2600。重点是过程——我用数据说话，而不是只报一个数字。',
  },
  {
    id: 'projcard-6f',
    type: 'project',
    rarity: 'R',
    title: '线上接口排查与应急响应实战',
    frontPoint:
      '先止血再定位：回滚/扩容/降级 → 监控+日志+链路 → 修复 → 复盘报告。',
    projectContext: '智汇餐饮',
    relatedModule: '机械工坊',
    module: '机械工坊',
    content:
      '智汇餐饮上线初期遇到一次高峰期接口全慢。我第一件事不是查代码，而是先止血：把非核心的推荐接口临时降级，保住下单主链路。然后通过 SkyWalking 链路追踪定位到是库存查询走了全表扫描。加索引、灰度发布、观察监控确认恢复后，我写了一份故障复盘报告，把「监控告警阈值过低」列为根因之一并补上了告警。整个过程我用的是「先恢复再查因，最后复盘」的标准应急流程。',
  },
  {
    id: 'projcard-7f',
    type: 'project',
    rarity: 'R',
    title: '高并发场景的系统设计取舍',
    frontPoint:
      '分层应对：入口限流 → 缓存 → 异步削峰 → 兜底降级；容量评估与有损方案。',
    projectContext: '智汇餐饮',
    relatedModule: '危机控制室',
    module: '危机控制室',
    content:
      '面试被问「设计一个秒杀系统」时，我用智汇餐饮的真实经验分层作答：入口用 Sentinel 按 QPS 限流挡住超额流量；热点库存进 Redis 用 Lua 原子扣减；下单请求进消息队列异步削峰，数据库只做最终落库；万一缓存击穿，兜底方案是返回「排队中」并前端轮询，而不是直接打穿数据库。我还做了容量评估——按预估峰值 1.5w QPS 反推 Redis 分片和队列分区数。面试官想听的就是这种分层且能量化的取舍。',
  },
  {
    id: 'projcard-8f',
    type: 'project',
    rarity: 'SR',
    title: 'HR 面的项目表达与职业规划',
    frontPoint:
      '自我介绍三句话定基调；讲项目突出个人贡献与成长；职业规划与岗位匹配。',
    projectContext: '云观教育',
    relatedModule: '最终面试厅',
    module: '最终面试厅',
    content:
      'HR 面我用云观教育项目串起整个表达：自我介绍三句话——「Java 后端方向，做过一个 AI+教育的实战项目，熟悉高并发与 RAG 落地」。讲项目时我不罗列技术栈，而是讲「我负责的模块 + 遇到的坑 + 我怎么解决 + 沉淀的方法」，让 HR 看到我的思考和成长。被问职业规划，我说「先把后端基本功打扎实，往 AI 应用工程化方向深入」，正好和岗位匹配。真诚、有逻辑、有数据，是 HR 面最好的底色。',
  },
];

export const getProjectCard = (id: string) => projectCards.find((c) => c.id === id);

/** 楼层 id → 必掉落的项目卡 id */
export const FLOOR_PROJECT_CARD: Record<string, string> = {
  'floor-1': 'projcard-1f',
  'floor-2': 'projcard-2f',
  'floor-3': 'projcard-3f',
  'floor-4': 'projcard-4f',
  'floor-5': 'projcard-5f',
  'floor-6': 'projcard-6f',
  'floor-7': 'projcard-7f',
  'floor-8': 'projcard-8f',
};
