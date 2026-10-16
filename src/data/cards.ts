import type { Card } from '../types';
import { projectCards } from './projectCards';

// 每层 6 张（2 基础考点 + 2 高级考点 + 1 话术卡 + 1 剧情卡，共 48 张）
// + 80 张面试逐字稿话术卡（card-speech-*，由「Java 后端面试逐字稿话术」导入）
export const cards: Card[] = [
  // ===== 1F 语法回廊 =====
  { id: 'card-java-1', type: 'basic', rarity: 'N', title: 'HashMap 扩容机制', module: '语法回廊', content: '容量默认 16，负载因子 0.75。超过阈值扩容为 2 倍，JDK8 用高低位链表优化 rehash，避免 JDK7 头插法造成的环形链表。' },
  { id: 'card-java-2', type: 'basic', rarity: 'N', title: 'JVM 内存区域速记', module: '语法回廊', content: '堆（对象实例）+ 方法区/元空间（类信息）+ 虚拟机栈（栈帧）+ 本地方法栈 + 程序计数器。只有计数器不会 OOM。' },
  { id: 'card-java-3', type: 'advanced', rarity: 'SR', title: 'G1 收集器核心思想', module: '语法回廊', content: 'Region 化堆内存，可预测停顿模型，优先回收价值最大的 Region（Garbage First）。Mixed GC 同时清理年轻代和老年代垃圾。' },
  { id: 'card-java-4', type: 'advanced', rarity: 'R', title: '三级缓存解循环依赖', module: '语法回廊', content: '一级：成品 Bean；二级：早期半成品；三级：ObjectFactory  lambda。三级缓存的意义是支持 AOP 代理对象的早期暴露，且只能解决 setter/field 注入的循环依赖。' },
  { id: 'card-java-5', type: 'script', rarity: 'SR', title: '话术：被问源码怎么答', module: '语法回廊', content: '先讲整体结构，再讲一个核心流程（put/get），最后讲设计取舍（为什么用红黑树、为什么扩容 2 倍）。结论先行，细节递进。' },
  { id: 'card-java-6', type: 'story', rarity: 'SSR', title: '剧情：陆沉的过去', module: '语法回廊', content: '陆沉曾是某大厂最年轻的首席架构师，因一次线上事故重写整个网关。他说：基础不是课本，是你凌晨三点唯一能依赖的东西。' },

  // ===== 2F 分布式迷城 =====
  { id: 'card-dist-1', type: 'basic', rarity: 'N', title: 'CAP 一句话版', module: '分布式迷城', content: '分区容忍 P 必须保证，剩下在 C 和 A 之间取舍：CP 如 Zookeeper/Nacos 持久节点，AP 如 Eureka/Nacos 临时节点。' },
  { id: 'card-dist-2', type: 'basic', rarity: 'N', title: '熔断 vs 降级 vs 限流', module: '分布式迷城', content: '限流是入口保护（QPS 阈值），熔断是出口保护（下游故障快速失败），降级是资源不足时的有损方案（返回兜底数据）。' },
  { id: 'card-dist-3', type: 'advanced', rarity: 'SR', title: 'Seata AT 模式原理', module: '分布式迷城', content: '一阶段：业务 SQL 直接提交，undo_log 记录前后镜像；二阶段：全局提交则异步删日志，回滚则用镜像恢复。全局锁避免脏写。' },
  { id: 'card-dist-4', type: 'advanced', rarity: 'R', title: 'Kafka 高吞吐四板斧', module: '分布式迷城', content: '顺序写磁盘 + PageCache 零拷贝 + 批量压缩发送 + 分区并行消费。瓶颈不在磁盘，在你的设计。' },
  { id: 'card-dist-5', type: 'script', rarity: 'SR', title: '话术：选型题怎么答', module: '分布式迷城', content: '公式：场景特征 → 候选方案对比表 → 我的取舍 → 落地后的验证数据。让面试官看到你做过权衡，而不是看过推文。' },
  { id: 'card-dist-6', type: 'story', rarity: 'SSR', title: '剧情：守夜人的链路图', module: '分布式迷城', content: '夜航的墙上贴着一张 2019 年全链路雪崩事故的手绘架构图，每条断掉的链路都用红笔标出。他说迷城里没有路，只有你记得的路。' },

  // ===== 3F 数据深渊 =====
  { id: 'card-db-1', type: 'basic', rarity: 'N', title: '最左前缀原则', module: '数据深渊', content: '联合索引 (a,b,c)：能用上 a / a,b / a,b,c。跳过 a 直接查 b 无法走索引（MySQL 8 的索引跳跃扫描是特例，别当饭吃）。' },
  { id: 'card-db-2', type: 'basic', rarity: 'N', title: '三大缓存问题速记', module: '数据深渊', content: '穿透：查不存在的数据 → 布隆过滤器/空值缓存；击穿：热点 Key 过期 → 互斥锁/逻辑过期；雪崩：大面积过期 → 随机 TTL + 多级缓存。' },
  { id: 'card-db-3', type: 'advanced', rarity: 'SR', title: 'MVCC 实现三要素', module: '数据深渊', content: '隐藏列（trx_id、roll_pointer）+ undo log 版本链 + ReadView（活跃事务数组）。RC 每次读生成新 ReadView，RR 事务内复用第一个。' },
  { id: 'card-db-4', type: 'advanced', rarity: 'R', title: '延迟双删为什么不靠谱', module: '数据深渊', content: '先删缓存→更新 DB→延迟再删。延迟时间难定，主从延迟下仍有脏读窗口。更稳的方案：Canal 监听 binlog 异步删缓存 + 失败重试队列。' },
  { id: 'card-db-5', type: 'script', rarity: 'SR', title: '话术：SQL 优化怎么讲', module: '数据深渊', content: '三步走：先 EXPLAIN 看执行计划（type/key/rows），再针对性加索引或改写 SQL，最后对比优化前后的耗时与扫描行数。数据说话。' },
  { id: 'card-db-6', type: 'story', rarity: 'SSR', title: '剧情：女巫的索引之书', module: '数据深渊', content: '苏黎有一本手抄的《慢 SQL 葬送名单》，每一条都记录着事故时间与责任人。据说被她约谈过的人，从此写 SQL 都会先 EXPLAIN。' },

  // ===== 4F AI 炼金工坊 =====
  { id: 'card-ai-1', type: 'basic', rarity: 'N', title: 'RAG 五步流程', module: 'AI 炼金工坊', content: '文档解析 → 切分 Chunk → Embedding 入库 → 用户提问检索 TopK → 拼接 Prompt 给 LLM 生成。检索质量决定上限。' },
  { id: 'card-ai-2', type: 'basic', rarity: 'N', title: 'Prompt 工程三件套', module: 'AI 炼金工坊', content: '角色设定 + 结构化指令（分点、给约束）+ Few-shot 示例。复杂任务先让模型输出思考过程（CoT），再给最终答案。' },
  { id: 'card-ai-3', type: 'advanced', rarity: 'SR', title: '混合召回 + Rerank', module: 'AI 炼金工坊', content: '向量召回（语义）+ BM25（关键词）双路召回，RRF 融合后交 Cross-Encoder 精排。召回率与精度可以兼得，代价是多一次推理。' },
  { id: 'card-ai-4', type: 'advanced', rarity: 'SR', title: 'ReAct 模式拆解', module: 'AI 炼金工坊', content: 'Thought（推理）→ Action（调工具）→ Observation（观察结果）循环，直到模型给出 Final Answer。Agent 的本质是一个会调工具的循环。' },
  { id: 'card-ai-5', type: 'script', rarity: 'SR', title: '话术：幻觉问题怎么答', module: 'AI 炼金工坊', content: '承认幻觉不可根除，然后给组合拳：RAG 约束知识边界 + Prompt 强约束（不知道就说不知道）+ 引用溯源 + 关键场景人工审核。' },
  { id: 'card-ai-6', type: 'story', rarity: 'SSR', title: '剧情：炼金术士的配方', module: 'AI 炼金工坊', content: '星野的工坊里烧掉了 137 版 Prompt，墙上只剩一句话：大模型不会按你想的做，只会按你说的做——所以把话说清楚，是炼金术的第一定律。' },

  // ===== 5F 项目档案室 =====
  { id: 'card-proj-1', type: 'basic', rarity: 'N', title: 'STAR 法则', module: '项目档案室', content: 'Situation 背景 → Task 任务 → Action 你的行动 → Result 量化结果。讲项目最大的忌讳是只有 S 和 T，没有 A 和 R。' },
  { id: 'card-proj-2', type: 'basic', rarity: 'N', title: '幂等设计三板斧', module: '项目档案室', content: '唯一索引兜底 + 前端防重/token 机制 + 状态机校验。重复请求不是异常，是常态。' },
  { id: 'card-proj-3', type: 'advanced', rarity: 'SR', title: '压测数据怎么说才可信', module: '项目档案室', content: '环境配置、数据量级、压测工具（JMeter/ wrk）、阶梯加压、P95/P99 延迟、瓶颈定位过程，一个都不能少。只有 QPS 数字=背简历。' },
  { id: 'card-proj-4', type: 'advanced', rarity: 'R', title: '技术选型答辩模板', module: '项目档案室', content: '候选方案 ≥2 个，对比维度：性能、生态、团队熟悉度、运维成本。最后说"如果重来我会…"——体现成长型思维。' },
  { id: 'card-proj-5', type: 'script', rarity: 'SR', title: '话术：难点问题怎么接', module: '项目档案室', content: '公式：问题的本质是什么 → 我试了哪些方案（含失败方案）→ 最终怎么解决 → 沉淀了什么方法论。失败方案是加分项，不是丢分项。' },
  { id: 'card-proj-6', type: 'story', rarity: 'SSR', title: '剧情：审讯官的档案', module: '项目档案室', content: '老K 的抽屉里有一份"注水简历黑名单"，记录着他识破的每一个包装项目。他说：我不怕你项目小，我怕你说不清楚。' },

  // ===== 6F 机械工坊 =====
  { id: 'card-ops-1', type: 'basic', rarity: 'N', title: '线上排查四步走', module: '机械工坊', content: '先止血（回滚/扩容/降级）→ 再定位（监控+日志+链路）→ 后修复 → 终复盘（写故障报告）。先恢复再查因，顺序不能反。' },
  { id: 'card-ops-2', type: 'basic', rarity: 'N', title: 'Linux 排查命令清单', module: '机械工坊', content: 'top 看负载、free -m 看内存、df -h 看磁盘、vmstat 看整体、netstat/ss 看连接、grep -C 上下文搜日志、tail -f 追实时日志。' },
  { id: 'card-ops-3', type: 'advanced', rarity: 'SR', title: 'Arthas 实战三板斧', module: '机械工坊', content: 'trace 追踪方法耗时定位慢调用、watch 观察方法入参出参、jad 反编译确认线上跑的是不是你改的代码。不改进程、不重启。' },
  { id: 'card-ops-4', type: 'advanced', rarity: 'R', title: 'Docker 核心概念', module: '机械工坊', content: '镜像=只读模板，容器=运行实例，仓库=镜像商店。联合文件系统分层存储。容器间隔离靠 namespace，资源限制靠 cgroup。' },
  { id: 'card-ops-5', type: 'script', rarity: 'SR', title: '话术：运维题答出老兵感', module: '机械工坊', content: '先说"先止血再查因"的大原则，再给具体命令和输出怎么读，最后补一个复盘动作。让面试官闻到硝烟味。' },
  { id: 'card-ops-6', type: 'story', rarity: 'SSR', title: '剧情：老兵的勋章', module: '机械工坊', content: '老张的工牌绳上挂着一枚 U 盘，里面是 2017 年双十一的故障复盘文档。他说那是他守过最长的一夜，也是他再也没犯过同样错误的原因。' },

  // ===== 7F 危机控制室 =====
  { id: 'card-scene-1', type: 'basic', rarity: 'N', title: '秒杀设计核心思路', module: '危机控制室', content: '前端限流（按钮置灰/验证码）→ 网关限流 → Redis 预减库存 → MQ 异步下单 → DB 最终兜底。核心是层层过滤，让 DB 只见有效请求。' },
  { id: 'card-scene-2', type: 'basic', rarity: 'N', title: '接口变慢排查路径', module: '危机控制室', content: '分层定位：网关层（限流/连接数）→ 应用层（CPU/内存/GC）→ 中间件（MQ 积压/Redis 慢查询）→ DB（慢 SQL/锁等待）。自顶向下，逐层排除。' },
  { id: 'card-scene-3', type: 'advanced', rarity: 'SR', title: '热 Key 治理方案', module: '危机控制室', content: '发现：监控 + 采样统计；治理：本地缓存（Caffeine）兜底 + Key 拆分成多副本（key:1~key:N 随机路由）+ 读写分离。热 Key 本质是单点问题。' },
  { id: 'card-scene-4', type: 'advanced', rarity: 'R', title: '消息积压应急', module: '危机控制室', content: '先扩容消费者 + 批量消费；不行就临时把消息转发到新 Topic（10 倍分区）用临时集群消费。事后必须查生产端为什么突增。' },
  { id: 'card-scene-5', type: 'script', rarity: 'SR', title: '话术：场景题结构化作答', module: '危机控制室', content: '万能结构：先澄清约束（量级/QPS/一致性要求）→ 给整体架构 → 逐层展开关键设计 → 说 trade-off。开口前先问清楚规模。' },
  { id: 'card-scene-6', type: 'story', rarity: 'SSR', title: '剧情：指挥官的倒计时', module: '危机控制室', content: '风暴的办公室里有一个永远停在 04:59 的倒计时钟——那是他职业生涯最严重一次事故的持续时间。他说：慌乱的人看表，冷静的人分层。' },

  // ===== 8F 最终面试厅 =====
  { id: 'card-hr-1', type: 'basic', rarity: 'N', title: '自我介绍黄金 90 秒', module: '最终面试厅', content: '学校专业一句话 → 技术栈一句话 → 最有代表性的项目/实习（带数据）→ 为什么投这个岗位。别复述简历，给面试官提问的钩子。' },
  { id: 'card-hr-2', type: 'basic', rarity: 'N', title: '反问环节问什么', module: '最终面试厅', content: '技术岗三问：团队目前在做的方向和技术栈 / 新人入职后的培养路径 / 如果我入职，前三个月最需要解决什么问题。别问加班和福利（时机不对）。' },
  { id: 'card-hr-3', type: 'advanced', rarity: 'SR', title: '缺点题的安全答法', module: '最终面试厅', content: '选一个真实的、非致命的、已经在改的缺点：例如"公开表达偏保守，所以我在逼自己每周组内做一次技术分享"。真实性 > 话术。' },
  { id: 'card-hr-4', type: 'advanced', rarity: 'R', title: '职业规划三年版', module: '最终面试厅', content: '一年：吃透业务和技术栈，成为可靠的执行者；两年：能独立负责模块，带小需求落地；三年：成为某个方向（如 AI 应用）的骨干。具体且克制。' },
  { id: 'card-hr-5', type: 'script', rarity: 'SR', title: '话术：HR 面的底层逻辑', module: '最终面试厅', content: 'HR 面考的不是技术，是稳定性（会不会跑路）、匹配度（价值观合不合）、性价比（薪资预期）。每个回答都往这三点上靠。' },
  { id: 'card-hr-6', type: 'story', rarity: 'SSR', title: '剧情：温柔刀的评分表', module: '最终面试厅', content: '温柔刀的笔记本上没有技术术语，只有两列："说了什么"和"为什么这样说"。她说：技术面决定你能不能做，我这关决定你适不适合。' },
  { id: 'card-speech-01', type: 'script', rarity: 'R', title: 'HashMap 底层原理', module: '语法回廊', content: `
面试官您好，HashMap 在 JDK 1.8 中采用的是”数组 + 链表 + 红黑树”的结构。当发生哈希冲突时，数据会以链表形式追加。为了优化查询性能，当链表长度大于等于 8，且数组总长度大于等于 64 时，链表会转化为红黑树，将查询时间复杂度从 O(n) 降到 O(log n)。在扩容机制上，默认初始容量是 16，负载因子是 0.75。当元素数量超过阈值时触发扩容，新容量变为原来的两倍。扩容时会重新计算哈希值，利用高位运算将节点均匀分散到新数组中，如果是红黑树节点且数量小于等于 6，还会退化回链表。

🎯 关键词记忆点：数组+链表+红黑树、8转树64条件、16容量0.75负载、2倍扩容、高位运算重哈希`, },
  { id: 'card-speech-02', type: 'script', rarity: 'R', title: 'ConcurrentHashMap 如何保证线程安全', module: '语法回廊', content: `
ConcurrentHashMap 在 JDK 1.8 中摒弃了 1.7 的 Segment 分段锁，采用了 CAS 加上 synchronized 来保证线程安全。在插入数据时，如果当前桶位为空，会使用 CAS 操作进行无锁插入；如果桶位正在扩容，当前线程会协助扩容；如果存在哈希冲突，则使用 synchronized 锁住链表或红黑树的头节点。这种设计将锁的粒度细化到了单个桶位，大大提高了并发度。同时，它的 size 计算也是通过 baseCount 加上 CounterCell 数组来分散统计，避免了全局锁的竞争。

🎯 关键词记忆点：CAS+synchronized、桶位粒度锁、空桶CAS插入、冲突锁头节点、CounterCell分散计数`, },
  { id: 'card-speech-03', type: 'script', rarity: 'N', title: 'ArrayList vs LinkedList 区别', module: '语法回廊', content: `
这两者的核心区别在于底层数据结构。ArrayList 基于动态数组，在内存中是连续存储的，因此支持随机访问，查询效率是 O(1)，但在中间插入或删除元素时需要移动大量数据，效率较低。LinkedList 则是基于双向链表，内存不连续，查询需要遍历，效率是 O(n)，但插入和删除只需修改指针，效率较高。在实际开发中，除非有频繁的头部或中间插入删除需求，否则我一般首选 ArrayList，因为它的 CPU 缓存命中率更高，且扩容机制在大多数场景下性能表现更好。

🎯 关键词记忆点：动态数组vs双向链表、O(1)随机访问、O(n)遍历查询、CPU缓存命中率、首选ArrayList`, },
  { id: 'card-speech-04', type: 'script', rarity: 'R', title: '线程池核心参数及工作流程', module: '语法回廊', content: `
线程池有 7 个核心参数，最关键的包括核心线程数、最大线程数、阻塞队列和拒绝策略。工作流程是这样的：提交任务时，如果当前线程数小于核心线程数，直接创建新线程执行；如果核心线程满了，任务会尝试放入阻塞队列；如果队列也满了，且当前线程数小于最大线程数，则创建非核心线程；如果都满了，就会触发拒绝策略。在我的云砚AI项目中，针对大模型推荐这种耗时任务，我配置了较大的队列和自定义的拒绝策略来记录日志，防止核心业务被阻塞。

🎯 关键词记忆点：7大核心参数、核心->队列->最大->拒绝、自定义拒绝策略、耗时任务隔离、防阻塞核心业务`, },
  { id: 'card-speech-05', type: 'script', rarity: 'R', title: 'synchronized vs ReentrantLock 区别', module: '语法回廊', content: `
它们的主要区别体现在三个方面。首先是实现层面，synchronized 是 JVM 层面的关键字，通过 Monitor 对象实现；ReentrantLock 是 JDK 的 API 层面，基于 AQS 实现。其次是功能特性，ReentrantLock 更灵活，支持公平锁、可中断等待以及通过多个 Condition 实现精确唤醒，而 synchronized 只能随机唤醒。最后是锁释放，synchronized 会自动释放，ReentrantLock 必须在 finally 中手动释放。在常规业务中我优先用 synchronized，因为 JDK 1.6 之后它做了大量优化，性能已经很好，只有在需要高级特性时才用 ReentrantLock。

🎯 关键词记忆点：JVM vs JDK API、AQS底层实现、公平锁与Condition、手动释放finally、常规首选synchronized`, },
  { id: 'card-speech-06', type: 'script', rarity: 'R', title: 'volatile 关键字原理', module: '语法回廊', content: `
volatile 主要有两个作用：保证可见性和禁止指令重排，但不保证原子性。在内存语义上，它通过插入内存屏障来实现：写操作前插入 StoreStore 屏障，写后插入 StoreLoad 屏障，强制将工作内存的值刷新回主内存；读操作前插入 LoadLoad 屏障，强制从主内存读取最新值。同时，这些屏障能防止编译器和处理器对指令进行重排序。在我的项目中，常用于修饰状态标志位，比如控制线程的优雅停机，确保一个线程修改后，其他线程能立即看到。

🎯 关键词记忆点：可见性与禁重排、不保证原子性、内存屏障机制、刷新主内存、状态标志位`, },
  { id: 'card-speech-07', type: 'script', rarity: 'R', title: 'ThreadLocal 内存泄漏问题', module: '语法回廊', content: `
ThreadLocal 内存泄漏的根本原因在于 ThreadLocalMap 的 Key 是弱引用，而 Value 是强引用。当 ThreadLocal 对象被回收后，Key 变成 null，但如果当前线程一直存活，比如在线程池中，Value 对象就永远无法被回收。为了避免这个问题，最佳实践是在每次使用完 ThreadLocal 后，务必调用 remove() 方法清理数据。在我的项目中，通常会在拦截器的 afterCompletion 阶段统一执行清理，确保请求结束后上下文数据被彻底释放，防止在线程复用场景下出现数据错乱或内存泄漏。

🎯 关键词记忆点：弱引用Key强引用Value、线程池存活导致泄漏、务必调用remove、拦截器统一清理、防数据错乱`, },
  { id: 'card-speech-08', type: 'script', rarity: 'R', title: 'AQS 原理', module: '语法回廊', content: `
AQS 全称抽象队列同步器，是 ReentrantLock 等并发组件的底层基石。它的核心是一个 volatile 的 state 变量和一个 FIFO 的双向等待队列。当线程尝试获取锁失败时，AQS 会将该线程封装成 Node 节点加入队列尾部，并调用 LockSupport.park() 使其阻塞。当持有锁的线程释放时，会唤醒队列头部的后继节点。AQS 采用了模板方法模式，子类只需要实现 state 的获取和释放逻辑即可。理解 AQS 对于深入掌握并发编程至关重要。

🎯 关键词记忆点：state变量+FIFO队列、LockSupport阻塞唤醒、模板方法模式、双向等待队列、并发组件基石`, },
  { id: 'card-speech-09', type: 'script', rarity: 'N', title: 'String/StringBuilder/StringBuffer 区别', module: '语法回廊', content: `
这三者的核心区别在于可变性和线程安全。String 是不可变的，每次修改都会生成新对象，适合少量字符串操作。StringBuilder 是可变的，且非线程安全，性能最高，适合单线程下的字符串拼接。StringBuffer 也是可变的，但方法加了 synchronized，线程安全但性能较差。在实际开发中，绝大多数场景我都使用 StringBuilder，比如在循环中拼接 SQL 或日志。只有在多线程共享字符串缓冲区的极端场景下，才会考虑 StringBuffer，或者使用线程安全的替代方案。

🎯 关键词记忆点：String不可变、StringBuilder非线程安全高性能、StringBuffer线程安全、循环拼接用StringBuilder、极少用StringBuffer`, },
  { id: 'card-speech-10', type: 'script', rarity: 'N', title: '== 和 equals 区别', module: '语法回廊', content: `
== 是比较运算符，对于基本数据类型比较的是值，对于引用类型比较的是内存地址。equals 是 Object 类的方法，默认实现也是用 == 比较地址，但像 String、Integer 等类都重写了它，用于比较对象的逻辑内容是否相等。在开发规范中，比较包装类或字符串内容时，必须使用 equals，并且推荐把常量或确定非空的值放在前面，比如 “active”.equals(status)，以防止空指针异常。这也是我在代码 Review 时经常检查的一个点。

🎯 关键词记忆点：==比地址值、equals比逻辑内容、重写equals、常量放前面防NPE、包装类比较规范`, },
  { id: 'card-speech-11', type: 'script', rarity: 'N', title: '异常体系（Exception vs Error）', module: '语法回廊', content: `
Java 异常体系的根类是 Throwable，分为 Error 和 Exception。Error 是 JVM 层面的严重错误，比如 OOM、StackOverflow，程序无法处理，也不应该尝试捕获。Exception 是程序层面的异常，分为受检异常和非受检异常。受检异常如 IOException，编译器强制要求处理；非受检异常如 NullPointerException，通常是代码逻辑问题。在我的项目中，对于业务异常我会自定义 RuntimeException 抛出，通过全局异常处理器统一返回友好提示；而对于底层 IO 异常则按需捕获处理。

🎯 关键词记忆点：Throwable根类、Error不可处理、受检vs非受检、自定义RuntimeException、全局异常处理器`, },
  { id: 'card-speech-12', type: 'script', rarity: 'N', title: '深拷贝 vs 浅拷贝', module: '语法回廊', content: `
浅拷贝只是复制了对象本身及其基本数据类型字段，对于引用类型字段，只复制了引用地址，原对象和拷贝对象共享同一个引用。深拷贝则会递归复制所有引用类型字段，创建全新的对象。在 Java 中，实现浅拷贝可以用 clone() 方法或 BeanUtils.copyProperties；深拷贝可以通过序列化与反序列化，或者手动递归复制来实现。在我的智汇AI餐饮项目中，涉及敏感词过滤规则对象在多线程间传递时，为了避免并发修改问题，我使用了深拷贝确保每个线程操作独立的对象副本，保证了数据安全。

🎯 关键词记忆点：浅拷贝共享引用、深拷贝递归创建、clone与序列化、防并发修改、独立对象副本`, },
  { id: 'card-speech-13', type: 'script', rarity: 'R', title: '什么是控制反转（IoC）？IoC 容器初始化流程？', module: '语法回廊', content: `
控制反转其实是一种设计思想，核心就是把对象的创建和依赖管理权从代码里交给了Spring容器，也就是常说的依赖注入。关于容器初始化，大致分三步：首先是准备阶段，解析配置类或XML，生成BeanDefinition；接着是注册阶段，把这些定义存到BeanDefinitionMap里；最后是实例化阶段，遍历Map，通过反射创建对象，处理依赖注入，执行初始化回调，最后放入单例池。整个过程还会触发各种BeanPostProcessor，这也是AOP等扩展的切入点。

🎯 关键词记忆点：依赖注入、BeanDefinition、单例池、BeanPostProcessor`, },
  { id: 'card-speech-14', type: 'script', rarity: 'R', title: 'AOP 底层原理（JDK 动态代理 vs CGLIB）？AOP 应用场景？', module: '语法回廊', content: `
AOP底层就是动态代理。如果目标类实现了接口，Spring默认用JDK动态代理，基于反射生成接口的代理类；如果没实现接口，就用CGLIB，通过ASM框架生成目标类的子类来重写方法。在我的云砚AI项目里，AOP主要用在三个场景：一是统一日志记录，比如记录AI对话的请求耗时；二是接口鉴权，拦截请求校验Token；三是全局异常处理，配合自定义注解做业务异常的统一捕获和响应封装。

🎯 关键词记忆点：JDK动态代理、CGLIB子类、日志鉴权、异常处理`, },
  { id: 'card-speech-15', type: 'script', rarity: 'R', title: 'Bean 完整生命周期各阶段？@PostConstruct/@PreDestroy/@Bean(initMethod, destroyMethod) 执行顺序？', module: '语法回廊', content: `
Bean生命周期可以简化为：实例化、属性填充、初始化、使用、销毁。初始化阶段最复杂，执行顺序是：先执行Aware接口回调，再执行BeanPostProcessor的前置处理，然后依次执行@PostConstruct、InitializingBean的afterPropertiesSet、以及@Bean指定的initMethod，最后执行BeanPostProcessor的后置处理（AOP代理就在这里生成）。销毁阶段类似，@PreDestroy先于DisposableBean的destroy方法，再执行自定义的destroyMethod。

🎯 关键词记忆点：实例化到销毁、@PostConstruct、BeanPostProcessor、AOP代理生成`, },
  { id: 'card-speech-16', type: 'script', rarity: 'R', title: '自动装配原理（@SpringBootApplication 如何工作）？starter 机制？Spring Boot 启动流程？', module: '语法回廊', content: `
@SpringBootApplication是个组合注解，核心是@EnableAutoConfiguration。它通过SpringFactoriesLoader加载META-INF/spring.factories里配置的自动配置类，再结合@Conditional条件注解判断是否生效。Starter机制就是把常用依赖打包，引入一个starter就自动配好相关组件。启动流程主要是：创建ApplicationContext，执行各种ApplicationContextInitializer，刷新容器触发自动装配，最后执行CommandLineRunner等启动回调。整个过程高度模块化，开箱即用。

🎯 关键词记忆点：EnableAutoConfiguration、spring.factories、@Conditional、Starter打包`, },
  { id: 'card-speech-17', type: 'script', rarity: 'R', title: '请求处理流程（DispatcherServlet → HandlerMapping → Controller → ViewResolver）？', module: '语法回廊', content: `
Spring MVC的核心是DispatcherServlet，它相当于前端控制器。请求进来后，先通过HandlerMapping找到对应的Handler执行链，包含Controller和拦截器；然后HandlerAdapter去适配并调用Controller方法，返回ModelAndView；如果是REST接口，直接通过HttpMessageConverter写响应；如果是页面渲染，才走ViewResolver解析视图。在我的餐饮SaaS项目里，基本都是前后端分离，所以主要走消息转换器那条线，ViewResolver用得很少。

🎯 关键词记忆点：DispatcherServlet、HandlerMapping、HandlerAdapter、HttpMessageConverter`, },
  { id: 'card-speech-18', type: 'script', rarity: 'R', title: '@Transactional 失效场景？传播行为有哪些？隔离级别？编程式事务 vs 声明式事务？', module: '语法回廊', content: `
@Transactional失效常见场景有：方法非public、同类内部调用、异常被catch吞掉、或者抛出的是非RuntimeException但没配rollbackFor。传播行为最常用的是REQUIRED，有事务就加入，没有就新建；还有REQUIRES_NEW会挂起当前事务开新的。隔离级别一般用默认的READ_COMMITTED就够了，避免脏读。编程式事务用TransactionTemplate手动控制，适合复杂逻辑；声明式用注解，简单场景首选。我项目中基本都是声明式，只在批量导入数据时用编程式做分批提交。

🎯 关键词记忆点：同类调用失效、REQUIRED、READ_COMMITTED、编程式vs声明式`, },
  { id: 'card-speech-19', type: 'script', rarity: 'R', title: 'MyBatis 一级缓存和二级缓存区别？为什么生产环境一般关闭二级缓存？', module: '语法回廊', content: `
一级缓存是SqlSession级别的，默认开启，同一个会话里相同查询直接返回缓存结果；二级缓存是namespace级别，跨会话共享，需要手动配置。生产环境一般关闭二级缓存，主要是因为多实例部署时缓存一致性很难保证，比如一个节点更新了数据，其他节点缓存还是旧的，容易导致脏读。而且MyBatis二级缓存是粗粒度的，一个update会清空整个namespace缓存，性能反而受影响。所以我们项目里只用一级缓存，分布式缓存交给Redis。

🎯 关键词记忆点：SqlSession级别、namespace级别、一致性难保证、Redis替代`, },
  { id: 'card-speech-20', type: 'script', rarity: 'R', title: 'MyBatis-Plus 相比 MyBatis 有哪些增强？', module: '语法回廊', content: `
MyBatis-Plus最大的优势是开箱即用的CRUD。它提供了BaseMapper和IService，单表操作基本不用写SQL；还有条件构造器Wrapper，拼接查询条件特别方便；内置分页插件、自动填充（比如createTime、updateTime）、逻辑删除、乐观锁等常用功能。在我的餐饮SaaS项目里，90%的单表查询都用MP搞定，只有复杂的多表关联统计才手写XML。另外它的代码生成器也省了不少初始化工作量，开发效率提升很明显。

🎯 关键词记忆点：BaseMapper、Wrapper条件构造、自动填充、分页插件`, },
  { id: 'card-speech-21', type: 'script', rarity: 'R', title: '分页插件底层原理？', module: '语法回廊', content: `
MyBatis-Plus的分页插件本质是个MyBatis拦截器，拦截Executor的query方法。它会解析原始SQL，自动拼接COUNT查询获取总数，再根据分页参数改写SQL加上LIMIT和OFFSET。整个过程对业务代码透明，只需要在Mapper方法里传Page对象就行。需要注意的是，复杂SQL比如带UNION或子查询的，自动COUNT可能不准确，这时候可以手动指定countSql或者关闭自动优化。我们项目里基本都依赖它，配合前端分页组件体验很好。

🎯 关键词记忆点：拦截器、自动COUNT、LIMIT改写、Page对象`, },
  { id: 'card-speech-22', type: 'script', rarity: 'N', title: '动态 SQL 常用标签有哪些？', module: '语法回廊', content: `
MyBatis动态SQL核心标签有这几个：做条件判断，最常用；//相当于switch-case；自动处理AND/OR前缀；用于update时自动处理逗号；做批量操作或IN查询；可以自定义前后缀和忽略字符。实际开发中，+组合用得最多，比如搜索接口各种可选条件拼接。在批量插入和IN查询里必不可少。掌握这几个标签，90%的动态SQL场景都能覆盖。

🎯 关键词记忆点：if/where、choose/when、foreach、set/trim`, },
  { id: 'card-speech-23', type: 'script', rarity: 'R', title: '#{} 和 \${} 的区别（SQL 注入问题）？', module: '语法回廊', content: `
#{}是预编译占位符，底层用PreparedStatement的?参数绑定，会自动转义，能防SQL注入，绝大多数场景都应该用它。是字符串直接替换，相当于拼SQL，有注入风险，一般只在动态表名、列名这种没法用占位符的地方用，而且必须自己做校验。比如我的AI项目里，用户输入的搜索关键词一律用#；但动态排序字段因为要拼到ORDERBY后面，只能用{}，这时候会在代码层做白名单校验，只允许传固定的几个字段名。

🎯 关键词记忆点：PreparedStatement、字符串替换、SQL注入、白名单校验`, },
  { id: 'card-speech-24', type: 'script', rarity: 'R', title: 'B+树为什么适合做索引？聚簇索引 vs 非聚簇索引？最左前缀原则？索引失效场景？Explain 各字段含义？', module: '数据深渊', content: `
面试官您好。首先，B+树适合做索引，是因为它非叶子节点只存键值不存数据，单页能存更多索引，降低了树高和磁盘IO；而且叶子节点通过双向链表相连，非常适合范围查询。关于聚簇和非聚簇索引，聚簇索引的叶子节点直接存放完整数据行，而非聚簇索引叶子节点只存主键值，查询时需要”回表”。最左前缀原则是指联合索引遵循B+树的排序规则，查询必须从最左列开始匹配，遇到范围查询就会停止匹配。常见的索引失效场景包括：对索引列做函数运算、使用模糊查询以%开头、隐式类型转换、违反最左前缀以及使用or连接非索引列等。最后，Explain中主要关注type字段看访问类型（如ref、range），key看实际使用的索引，rows看预估扫描行数，以及Extra字段看是否出现Using filesort或Using index等关键信息。

🎯 关键词记忆点：降低IO、回表、最左匹配、函数运算、type和Extra`, },
  { id: 'card-speech-25', type: 'script', rarity: 'R', title: 'ACID 特性？四种隔离级别及各自解决的问题（脏读/不可重复读/幻读）？MySQL 默认隔离级别？', module: '数据深渊', content: `
事务的ACID特性是指：Atomicity原子性，靠Undo Log保证；Consistency一致性，是最终目的；Isolation隔离性，靠锁和MVCC实现；Durability持久性，靠Redo Log保证。关于隔离级别，主要有四种：读未提交会引发脏读；读已提交解决了脏读，但会有不可重复读问题；可重复读解决了不可重复读，配合Next-Key Lock能很大程度上避免幻读；串行化则完全避免所有问题但性能最差。MySQL默认的隔离级别是”可重复读”（Repeatable Read）。在实际业务中，这个级别结合MVCC机制，既能保证绝大多数场景下的数据一致性，又能提供较好的并发性能，所以被作为默认标准。

🎯 关键词记忆点：Undo/Redo Log、脏读/幻读、可重复读、Next-Key Lock`, },
  { id: 'card-speech-26', type: 'script', rarity: 'R', title: 'MVCC 实现原理？Read View 何时生成？Undo Log 作用？', module: '数据深渊', content: `
MVCC的核心思想是通过保存数据的多个历史版本来实现非阻塞并发读。它主要依赖隐藏字段、Undo Log和Read View来实现。Read View的生成时机取决于隔离级别：在”读已提交”级别下，每次Select都会重新生成Read View，所以能看到其他事务已提交的修改；而在”可重复读”级别下，Read View只在事务第一次Select时生成，后续复用，从而保证了可重复读。至于Undo Log，它有两个核心作用：第一是用于事务回滚，恢复数据到修改前；第二就是配合MVCC，保存历史版本数据，让其他事务能通过版本链读取到符合其Read View规则的旧数据。

🎯 关键词记忆点：历史版本、Read View生成时机、回滚、版本链`, },
  { id: 'card-speech-27', type: 'script', rarity: 'R', title: '行锁/表锁/间隙锁/临键锁区别？死锁如何产生和排查？', module: '数据深渊', content: `
这几种锁的范围和场景不同：表锁粒度最大，开销小但并发低；行锁粒度最小，针对单行记录加锁；间隙锁（Gap Lock）锁定索引记录之间的空隙，用于防止幻读；临键锁（Next-Key Lock）则是行锁和间隙锁的组合，锁定记录本身及其右侧间隙。关于死锁，通常是两个或多个事务互相持有对方需要的锁资源，且都不释放，形成循环等待。排查死锁时，首先可以通过开启InnoDB的死锁日志（innodb_print_all_deadlocks）来查看详细的死锁信息；其次，使用SHOW ENGINE INNODB STATUS命令，查看LATEST DETECTED DEADLOCK部分，分析具体是哪两条SQL、持有什么锁导致的冲突，然后针对性地优化SQL执行顺序或缩短事务持锁时间。

🎯 关键词记忆点：锁粒度、防幻读、循环等待、INNODB STATUS`, },
  { id: 'card-speech-28', type: 'script', rarity: 'R', title: '慢 SQL 排查流程？SQL 优化手段？深分页问题怎么解决？', module: '数据深渊', content: `
排查慢SQL的标准流程是：首先开启慢查询日志定位问题SQL，然后使用Explain分析执行计划，重点看type、key、rows和Extra，找出索引失效或全表扫描的原因，最后进行针对性优化。常见的优化手段包括：合理建立联合索引、避免在索引列上做运算、优化Join查询（小表驱动大表）、以及分页优化等。针对深分页问题，比如 LIMIT 1000000, 10，由于需要扫描大量废弃数据会导致性能急剧下降。我的解决方案是”延迟关联”或”子查询优化”：先在覆盖索引中查出目标页的主键ID，然后再用这些ID去主表关联查完整数据；或者采用游标法，即记录上一页的最大ID，下次查询直接用 WHERE id > max_id LIMIT 10，这样无论翻多深都能走索引，效率极高。

🎯 关键词记忆点：Explain、小表驱动、延迟关联、游标法`, },
  { id: 'card-speech-29', type: 'script', rarity: 'N', title: '五大基础数据类型（String/List/Hash/Set/ZSet）及使用场景？', module: '数据深渊', content: `
Redis五大基础数据类型各有其适用场景：String是最基础的，常用于常规缓存、计数器、分布式锁和Session共享。List是双向链表，适用于消息队列、文章列表分页、以及最新好友列表等需要保持顺序的场景。Hash非常适合存储对象，比如用户信息、商品详情，相比String存JSON，Hash支持局部字段的修改，更省内存且灵活。Set是无序不重复集合，常用于去重、抽奖、以及交集并集运算，比如共同好友或共同关注。ZSet是有序集合，每个元素关联一个score，非常适合排行榜、带权重的任务队列、以及范围查询等场景。在我的餐饮SaaS项目中，就用了ZSet来做热门菜品排行榜，用Hash来缓存菜品详情，效果很好。

🎯 关键词记忆点：计数器/锁、消息队列、存对象、去重/交并集、排行榜`, },
  { id: 'card-speech-30', type: 'script', rarity: 'R', title: 'BitMap 底层原理？为什么比 String 省 90% 内存？适用场景？', module: '数据深渊', content: `
BitMap底层其实就是一个String类型，但它操作的是二进制位（bit）。通过SETBIT、GETBIT等命令，可以对指定偏移量的单个bit进行置1或置0操作。它之所以极其省内存，是因为一个字节有8个bit。比如记录用户签到，如果用String存日期或ID，一个用户可能占几十字节；而用BitMap，一个用户一年365天只需要365个bit，不到46个字节，相比传统方式确实能节省90%以上的内存。它的适用场景主要是海量数据下的布尔状态统计，比如我在云砚AI教育平台中，就用BitMap实现了用户的每日签到打卡和连续签到统计，利用BITCOUNT和BITOP命令可以极其高效地计算活跃人数和连续签到天数。

🎯 关键词记忆点：二进制位操作、极致省内存、签到打卡、BITCOUNT`, },
  { id: 'card-speech-31', type: 'script', rarity: 'R', title: '缓存穿透（布隆过滤器/空值缓存）？缓存击穿（分布式锁/逻辑过期）？缓存雪崩（随机TTL/多级缓存/限流）？', module: '数据深渊', content: `
缓存三大问题是面试高频点。缓存穿透是指查询不存在的数据，请求直达DB。解决方案是缓存空值（设置短TTL）或使用布隆过滤器拦截非法请求。缓存击穿是指热点Key过期瞬间，大量并发直接打到DB。解决方案是互斥锁（分布式锁）保证只有一个线程重建缓存，或者使用逻辑过期策略，由后台异步更新，不阻塞用户请求。缓存雪崩是指大量Key同时过期或Redis宕机。解决方案包括：为Key设置随机TTL避免同时失效、搭建多级缓存（Caffeine+Redis）、以及限流降级兜底。在我的项目中，针对热门课程推荐就用了逻辑过期防击穿，同时用随机TTL防雪崩，保证了高并发下的系统稳定性。

🎯 关键词记忆点：空值/布隆过滤器、互斥锁/逻辑过期、随机TTL、多级缓存`, },
  { id: 'card-speech-32', type: 'script', rarity: 'R', title: 'Cache-Aside 策略？先删缓存还是先更新数据库？延迟双删？', module: '数据深渊', content: `
Cache-Aside是最常用的缓存策略，即读时查缓存，没有则查库并回填；写时先更新数据库，再删除缓存。关于写操作的顺序，标准做法是”先更新数据库，再删除缓存”。因为如果先删缓存，在更新DB期间如果有读请求，会把旧数据重新加载到缓存，导致脏数据。而先更新DB再删缓存，即使删除失败，也只是下次读时多一次DB查询，不会导致数据不一致。为了应对极端并发下的删除失败问题，可以引入”延迟双删”：先删缓存，更新DB，休眠几百毫秒后再删一次缓存；或者更优雅的做法是订阅MySQL的Binlog，异步可靠地重试删除缓存操作，保证最终一致性。

🎯 关键词记忆点：先更新DB再删缓存、防脏数据、延迟双删、Binlog异步`, },
  { id: 'card-speech-33', type: 'script', rarity: 'R', title: 'Redisson 分布式锁原理？看门狗（WatchDog）机制？锁重入？', module: '数据深渊', content: `
Redisson分布式锁底层基于Redis的Hash结构，通过Lua脚本保证加锁和解锁的原子性。加锁时，如果Key不存在就设置值和过期时间；如果存在则检查是否是自己的锁。看门狗机制是它的核心亮点：如果加锁时不指定过期时间，Redisson会启动一个后台线程（看门狗），默认每10秒（锁超时时间的1/3）检查一次，如果当前线程仍持有锁，就自动续期，有效防止业务未完成锁就过期的问题。关于锁重入，Redisson通过Hash结构中的field记录当前线程的加锁次数来实现。每次重入计数加1，每次解锁计数减1，只有当计数归零时才真正删除Key释放锁，完美支持可重入特性。

🎯 关键词记忆点：Lua原子操作、自动续期、Hash计数、可重入`, },
  { id: 'card-speech-34', type: 'script', rarity: 'R', title: '为什么用 Lua 保证原子性？在秒杀中怎么用的？', module: '数据深渊', content: `
在Redis中，多条命令之间不是原子的，如果在执行过程中发生网络中断或其他客户端插入命令，就会导致数据错乱。而Redis执行Lua脚本是单线程且原子性的，要么全部执行，要么都不执行，这就保证了复杂业务逻辑的数据一致性。在我的智汇AI餐饮SaaS秒杀场景中，Lua脚本发挥了关键作用。我将”判断库存是否充足”、“判断用户是否重复下单”和”扣减库存”这三个操作封装在一个Lua脚本中。这样不仅避免了并发超卖问题，还将原本需要3次网络RTT的操作合并为1次，极大提升了秒杀接口的响应速度和吞吐量。

🎯 关键词记忆点：原子性、防超卖、减少网络开销、合并操作`, },
  { id: 'card-speech-35', type: 'script', rarity: 'R', title: '持久化机制（RDB vs AOF）？内存淘汰策略？', module: '数据深渊', content: `
Redis持久化主要有两种方式：RDB是快照模式，定时将内存数据生成二进制文件，恢复速度快，但可能丢失最后一次快照后的数据；AOF是追加日志模式，记录每次写操作，数据更安全，但文件较大且恢复较慢。生产环境通常采用混合持久化，兼顾恢复速度和数据安全性。关于内存淘汰策略，当内存达到maxmemory时，Redis会根据配置的策略进行淘汰。常见的有：noeviction（不淘汰，报错）、allkeys-lru（所有键中淘汰最近最少使用的）、volatile-lru（设置了过期时间的键中淘汰LRU）。在我的项目中，对于纯缓存数据通常配置allkeys-lru，确保核心业务数据不被误删。

🎯 关键词记忆点：快照vs日志、混合持久化、allkeys-lru、maxmemory`, },
  { id: 'card-speech-36', type: 'script', rarity: 'R', title: 'Nacos 注册中心原理？AP 和 CP 模式区别？服务发现流程？健康检查机制？', module: '分布式迷城', content: `
Nacos 默认采用 AP 模式，底层基于 Distro 协议实现数据同步，每个节点负责一部分服务数据，通过异步复制保证最终一致性，适合临时实例；当开启 CP 模式时，底层切换为 Raft 协议，保证强一致性，适合持久化实例。服务发现流程是：服务提供者启动后向 Nacos 注册实例信息，消费者订阅该服务，Nacos 推送实例列表变更，同时消费者本地缓存一份，后续优先读缓存。健康检查方面，临时实例由客户端主动发送心跳，Nacos 15秒未收到心跳则剔除；持久化实例由 Nacos 服务端主动探测，连续失败则标记为不健康。

🎯 关键词记忆点：AP-Distro、CP-Raft、心跳检测、本地缓存、推送机制`, },
  { id: 'card-speech-37', type: 'script', rarity: 'R', title: 'Gateway 路由匹配原理？过滤器链？', module: '分布式迷城', content: `
Gateway 的路由匹配核心是 RouteLocator，它根据配置的 Predicate（断言）判断请求是否匹配某条路由，比如 Path、Header、Method 等条件。匹配成功后，请求会进入过滤器链，过滤器分为 Global（全局）和 GatewayFilter（网关级），按 Order 排序依次执行。Pre 过滤器在转发前处理，比如鉴权、日志；Post 过滤器在响应返回后处理，比如修改响应头、记录耗时。整个流程是异步非阻塞的，基于 WebFlux 响应式编程模型，所以吞吐量很高。

🎯 关键词记忆点：Predicate断言、过滤器链Order、GlobalFilter、WebFlux异步`, },
  { id: 'card-speech-38', type: 'script', rarity: 'R', title: '远程调用原理？超时重试怎么配置的？', module: '分布式迷城', content: `
OpenFeign 底层基于动态代理，接口方法调用时，代理类会根据注解解析 URL、参数、请求方式，再通过 Ribbon 或 LoadBalancer 做负载均衡选择实例，最后用 HttpClient 或 OkHttp 发送请求。超时配置在 yml 里设置 connectTimeout 和 readTimeout，分别控制连接和读取超时。重试机制通过 Ribbon 的 retry 配置，可以设置重试次数和重试条件，比如只对 GET 请求重试，避免 POST 重复提交。生产环境一般关闭自动重试，改为业务层幂等+手动重试，更安全。

🎯 关键词记忆点：动态代理、Ribbon负载均衡、connectTimeout/readTimeout、幂等重试`, },
  { id: 'card-speech-39', type: 'script', rarity: 'R', title: 'JWT 结构？Token 如何防篡改？如何实现踢人下线？', module: '分布式迷城', content: `
JWT 由三部分组成：Header（算法和类型）、Payload（用户信息和过期时间）、Signature（签名）。防篡改靠签名机制，服务端用密钥对前两部分做 HMAC-SHA256 签名，任何内容被修改都会导致验签失败。踢人下线纯 JWT 做不到，因为无状态，我们结合 Sa-Token 实现：登录时把 Token 存 Redis，设置过期时间；踢人时直接删 Redis 中的 Token，后续请求验签通过后还会查 Redis 确认 Token 是否有效，无效则拒绝，这样就实现了主动下线。

🎯 关键词记忆点：三段结构、HMAC签名、Redis存Token、主动删除踢人`, },
  { id: 'card-speech-40', type: 'script', rarity: 'R', title: 'Seata AT 模式原理（全局锁、Undo Log）？两阶段提交？', module: '分布式迷城', content: `
Seata AT 模式是无侵入的，一阶段时，Seata 拦截业务 SQL，自动解析生成前后镜像存入 Undo Log 表，然后执行业务 SQL 并提交本地事务，同时注册全局事务并获取全局锁。二阶段如果全局提交，异步批量删除 Undo Log；如果全局回滚，根据 Undo Log 的前镜像生成反向 SQL 恢复数据。全局锁的作用是防止多个全局事务并发修改同一行数据，一阶段提交前必须拿到全局锁，否则等待或回滚，保证隔离性。

🎯 关键词记忆点：前后镜像、Undo Log、全局锁、一阶段提交、二阶段回滚`, },
  { id: 'card-speech-41', type: 'script', rarity: 'R', title: '为什么做线程池隔离？与信号量隔离的区别？', module: '分布式迷城', content: `
线程池隔离是为每个依赖分配独立线程池，当某个服务慢或挂了，只会耗尽自己的线程池，不影响其他服务，实现故障隔离。信号量隔离是用计数器限制并发数，不创建新线程，开销更小，但无法隔离慢调用，一旦达到上限直接拒绝。线程池适合对延迟敏感、需要排队等待的场景，比如核心支付接口；信号量适合对响应时间要求极高、允许快速失败的场景，比如非核心查询。我们项目中核心链路用线程池，非核心用信号量，兼顾隔离性和性能。

🎯 关键词记忆点：故障隔离、独立线程池、信号量计数、快速失败、核心vs非核心`, },
  { id: 'card-speech-42', type: 'script', rarity: 'R', title: '分布式事务常见方案（2PC/TCC/Saga/AT）对比？幂等性怎么保证？', module: '分布式迷城', content: `
2PC 强一致但阻塞严重，性能差；TCC 业务侵入大，需手写 Try/Confirm/Cancel，适合资金类高要求场景；Saga 长事务拆分，补偿机制复杂，适合流程长的业务；AT 模式无侵入，自动补偿，适合大多数 CRUD 场景，我们项目主要用 AT。幂等性保证靠唯一业务ID，比如订单号，在数据库建唯一索引，或者用 Redis + Lua 做防重表，执行前检查是否已处理过。TCC 的 Cancel 和 Saga 的补偿接口也必须幂等，防止重复补偿导致数据错乱。

🎯 关键词记忆点：AT无侵入、TCC资金场景、Saga长事务、唯一业务ID、防重表`, },
  { id: 'card-speech-43', type: 'script', rarity: 'R', title: 'Exchange 四种类型（Direct/Fanout/Topic/Headers）？RoutingKey 和 BindingKey 区别？', module: '分布式迷城', content: `
Direct 是精确匹配 RoutingKey；Fanout 是广播，忽略 RoutingKey，所有绑定队列都收到；Topic 是通配符匹配，用 * 匹配一个单词，# 匹配零或多个单词；Headers 是根据消息头属性匹配，不常用。RoutingKey 是生产者发消息时指定的路由键，BindingKey 是队列绑定 Exchange 时指定的匹配规则。Direct 和 Topic 中两者必须匹配才能路由，Fanout 和 Headers 则不看 RoutingKey。我们项目中订单通知用 Direct，全量广播用 Fanout，多条件过滤用 Topic。

🎯 关键词记忆点：Direct精确、Fanout广播、Topic通配符、RoutingKey生产、BindingKey绑定`, },
  { id: 'card-speech-44', type: 'script', rarity: 'R', title: '如何保证消息不丢失（生产者 Confirm / Broker 持久化 / 消费者手动 ACK）？', module: '分布式迷城', content: `
消息不丢要三端保障：生产者开启 Confirm 模式，消息到达 Broker 后回调确认，失败则重试或落库补偿；Broker 端 Exchange 和 Queue 都设置持久化，消息本身也标记 deliveryMode=2，确保重启不丢；消费者关闭自动 ACK，处理完业务后手动 basicAck，如果处理失败则 basicNack 并重新入队或进死信队列。我们项目中关键消息都配了本地消息表，发送前落库，Confirm 成功后更新状态，定时任务扫未确认消息重发，双重保险。

🎯 关键词记忆点：Confirm机制、持久化三要素、手动ACK、本地消息表、死信兜底`, },
  { id: 'card-speech-45', type: 'script', rarity: 'R', title: '延迟队列怎么实现的？（死信队列 TTL vs 延迟插件）？', module: '分布式迷城', content: `
传统方案是用死信队列+TTL：消息设置过期时间，到期后如果没被消费，自动转入绑定的死信队列，消费者监听死信队列实现延迟。但这种方式有缺陷，TTL 只在消费时检查，如果队列头部消息未过期，后面的过期消息也会被阻塞。我们项目用的是 rabbitmq-delayed-message-exchange 插件，在 Exchange 层直接延迟投递，消息按到期时间排序，精准触发，没有阻塞问题。插件方案配置简单、精度高，生产环境推荐优先使用。

🎯 关键词记忆点：死信队列TTL、头部阻塞问题、延迟插件、精准投递、Exchange层延迟`, },
  { id: 'card-speech-46', type: 'script', rarity: 'R', title: '消息积压怎么排查和处理？', module: '分布式迷城', content: `
排查先看监控，确认是消费者处理慢还是生产者突增。如果是消费者慢，先扩容消费者实例，同时检查是否有慢 SQL 或外部调用阻塞；如果是生产者突增，评估是否业务异常导致。临时处理可以新建一个 Topic 队列，绑定更多消费者快速消费，或者把消息转存到数据库/ES，后续异步处理。根本解决要优化消费者逻辑，比如批量处理、异步化、加缓存。我们项目中做过一次大促积压，临时扩到50个消费者，同时把非核心消息降级丢弃，核心消息转 DB 异步消费，2小时消化完。

🎯 关键词记忆点：监控定位、扩容消费者、临时Topic、转存DB、批量异步优化`, },
  { id: 'card-speech-47', type: 'script', rarity: 'R', title: '如何防止消息重复消费？', module: '分布式迷城', content: `
消息重复消费是 MQ 的 at-least-once 语义导致的，必须业务层保证幂等。我们用的是唯一业务ID+防重表：消费前用 Redis SETNX 或数据库唯一索引检查是否已处理，成功则继续，失败则直接 ACK 丢弃。对于更新操作，可以用版本号或状态机控制，比如订单状态只能从待支付到已支付，重复消息状态不变。关键原则是：不要依赖 MQ 去重，业务自己兜底。我们所有核心消费者入口都有幂等校验，非核心允许少量重复但结果一致。

🎯 关键词记忆点：幂等设计、唯一业务ID、防重表、状态机、业务层兜底`, },
  { id: 'card-speech-48', type: 'script', rarity: 'R', title: '用 RabbitMQ 做了哪些削峰？具体效果？', module: '分布式迷城', content: `
我们在云砚 AI 平台的课程推荐和智汇 AI 餐饮的订单处理中用了 MQ 削峰。比如用户签到，高峰期 QPS 上万，直接写 DB 扛不住，改为发 MQ，消费者按 500 TPS 匀速消费写 Redis BitMap，DB 异步同步。效果是 DB 负载从 90% 降到 30%，接口响应从 800ms 降到 50ms。另一个是 AI 客服对话，大模型推理慢，用 MQ 排队，前端轮询结果，避免用户等待超时。削峰核心是把瞬时流量拉平成稳定流量，保护下游服务，我们监控显示峰值 QPS 从 2万平滑到 2000，系统稳定性大幅提升。

🎯 关键词记忆点：签到削峰、匀速消费、DB降压、AI排队、流量拉平`, },
  { id: 'card-speech-49', type: 'script', rarity: 'R', title: 'RAG 完整流程', module: 'AI 炼金工坊', content: `
RAG 就是检索增强生成，简单来说就是给大模型外挂一个实时知识库。离线建库时，我们会把文档切块，通过 Embedding 模型转成向量存入向量库。在线查询时，用户提问也会先向量化，去库里检索出最相关的片段，经过重排后，把这些片段和用户问题一起拼成 Prompt 喂给大模型，最后生成回答。这样既解决了大模型知识滞后的问题，又大幅减少了幻觉。

🎯 关键词记忆点：检索增强生成、离线建库、在线查询、减少幻觉`, },
  { id: 'card-speech-50', type: 'script', rarity: 'R', title: '向量检索', module: 'AI 炼金工坊', content: `
Embedding 就是把文本或图片映射到高维向量空间，让语义相近的内容在空间距离上也近。向量库我对比过 Milvus 和 Elasticsearch，但考虑到我们项目本身重度依赖 Redis，为了降低运维成本，直接用了 Redis Stack 的向量检索模块。实现上，我们在 Hash 结构中存业务数据，用 Vector 字段存 Embedding。毫秒级检索主要靠 Redis 底层的 HNSW 索引算法，它用空间换时间，把检索复杂度降到了对数级别，实测 QPS 能轻松过千。

🎯 关键词记忆点：高维映射、Redis Stack、HNSW索引、空间换时间`, },
  { id: 'card-speech-51', type: 'script', rarity: 'R', title: 'Rerank', module: 'AI 炼金工坊', content: `
引入 Rerank 是因为向量检索是”双塔模型”，Query 和 Doc 独立编码，虽然快但语义匹配不够精准。Rerank 是”交叉编码器”，会把 Query 和 Doc 拼在一起做精细打分，精度极高但很慢。所以架构上是先用 Embedding 粗排召回 Top 50，再用 Rerank 精排挑出 Top 5 给大模型。简单说，Embedding 负责”广撒网”，Rerank 负责”精挑细选”，两者结合才能兼顾速度和准确率。

🎯 关键词记忆点：交叉编码器、粗排精排、语义精准、性能平衡`, },
  { id: 'card-speech-52', type: 'script', rarity: 'R', title: 'LangChain4j', module: 'AI 炼金工坊', content: `
LangChain4j 的核心组件包括 Model（模型接入）、PromptTemplate（提示词模板）、Memory（记忆管理）和 Tools（工具调用）。Chain 是线性的执行流，比如”检索→生成”这种固定步骤；而 Agent 是有决策能力的，它可以根据用户意图自主决定调哪个工具或走哪条路。我在项目中搭的是 RAG 链路：用户输入 → 向量检索 → Prompt 组装 → 通义千问生成，中间用 Memory 组件自动管理多轮对话的上下文窗口。

🎯 关键词记忆点：线性vs决策、RAG链路、Memory管理、工具调用`, },
  { id: 'card-speech-53', type: 'script', rarity: 'R', title: 'Function Calling', module: 'AI 炼金工坊', content: `
Function Calling 的原理是把外部工具的函数名、参数描述写成 JSON Schema 传给大模型。大模型不执行代码，而是根据用户意图输出一个包含函数名和参数的 JSON 指令，后端解析后执行并把结果回传给大模型做总结。在智汇餐饮项目里，用户说”帮我取消刚才的订单”，大模型会识别意图并调用 cancelOrder(orderId) 工具，我们后端执行完数据库操作后，把”取消成功”的结果喂回去，大模型再回复用户”您的订单已取消”。

🎯 关键词记忆点：JSON Schema、意图识别、工具执行、结果回传`, },
  { id: 'card-speech-54', type: 'script', rarity: 'R', title: 'Prompt 工程', module: 'AI 炼金工坊', content: `
常用技巧有三招：System Prompt 设定角色和边界，比如”你是餐饮客服，严禁回答政治问题”；Few-Shot 给几个问答示例让模型模仿格式和语气；CoT 思维链就是让模型”一步步思考”，提升逻辑题准确率。减少幻觉最有效的方法是：在 Prompt 里强制要求”仅根据以下参考资料回答，不知道就说不知道”，同时配合 RAG 提供事实依据，最后加上温度值调低到 0.1，限制发散。

🎯 关键词记忆点：System Prompt、Few-Shot、CoT思维链、温度控制`, },
  { id: 'card-speech-55', type: 'script', rarity: 'R', title: 'SSE 流式输出', module: 'AI 炼金工坊', content: `
SSE 是基于 HTTP 的单向服务端推送，协议简单，天然支持断线重连；WebSocket 是全双工，适合聊天室这种双向高频场景，但对我们这种”一问一答”的 AI 对话来说 SSE 更轻量。实现上，后端用 Spring WebFlux 的 Flux 返回流，大模型每生成几个 Token 就 flush 一次。前端用 EventSource 监听 onmessage，实时渲染文字。这样用户不用干等几十秒，体验像打字机一样流畅。

🎯 关键词记忆点：HTTP单向、Flux流、EventSource、打字机效果`, },
  { id: 'card-speech-56', type: 'script', rarity: 'R', title: '多轮记忆', module: 'AI 炼金工坊', content: `
多轮对话的上下文管理核心是控制 Token 消耗。我们用的是”滑动窗口 + 摘要压缩”混合策略：最近 5 轮对话原文保留，保证连贯性；更早的历史对话，异步调大模型生成一段 50 字以内的摘要存起来。每次请求时，把”摘要 + 最近5轮 + 当前问题”拼成 Prompt。如果总 Token 还是超限，就按时间戳从最旧的原文开始截断。这样既保留了关键信息，又把上下文控制在 4K Token 以内，省钱又快。

🎯 关键词记忆点：滑动窗口、摘要压缩、Token控制、混合策略`, },
  { id: 'card-speech-57', type: 'script', rarity: 'R', title: '通义千问 Qwen', module: 'AI 炼金工坊', content: `
我主要用的是 Qwen-Max 和 Qwen-Turbo 两个版本。Max 用于复杂推理和 RAG 生成，Turbo 用于简单闲聊和摘要，性价比更高。API 调用走 DashScope SDK，支持流式和非流式。成本控制上：一是按场景路由，简单问题绝不浪费 Max 的算力；二是加缓存，相似问题直接返回历史答案；三是 Prompt 精简，去掉废话，实测能把单次对话成本压到 0.01 元以内，日均调用量上来后成本完全可控。

🎯 关键词记忆点：Max/Turbo路由、DashScope、Prompt精简、成本可控`, },
  { id: 'card-speech-58', type: 'script', rarity: 'R', title: '协同过滤 + 大模型', module: 'AI 炼金工坊', content: `
协同过滤分 UserCF（找相似用户）和 ItemCF（找相似物品），核心都是基于行为矩阵算相似度。但在冷启动和语义理解上有短板。我的做法是：先用 ItemCF 基于”浏览+收藏”矩阵算出 Top 20 候选课程，然后把这些课程的标题、大纲丢给大模型，结合用户画像（比如”Java初学者”）做语义重排和个性化解释。大模型在这里不是推荐引擎，而是”推荐解释器”和”语义过滤器”，既保留了协同过滤的统计优势，又补足了语义理解。

🎯 关键词记忆点：ItemCF、语义重排、冷启动、推荐解释器`, },
  { id: 'card-speech-59', type: 'script', rarity: 'R', title: 'DFA 敏感词过滤', module: 'AI 炼金工坊', content: `
DFA 就是确定有限自动机，核心思想是把所有敏感词构建成一棵 Trie 树（前缀树），每个节点代表一个字符，边代表状态转移。匹配时，文本逐个字符走树，如果走到叶子节点就说明命中敏感词。因为每个字符只做一次状态转移，没有回溯，所以时间复杂度是 O(n)，跟敏感词库大小无关。相比正则匹配，DFA 在万级词库下性能高两个数量级，我们项目中用它做实时聊天过滤，P99 延迟控制在 2ms 以内。

🎯 关键词记忆点：Trie树、状态转移、O(n)复杂度、无回溯`, },
  { id: 'card-speech-60', type: 'script', rarity: 'SR', title: '为什么按课程/订单/用户拆分？拆分后遇到了什么问题？服务间怎么保证数据一致性？', module: '项目档案室', content: `
我们按业务边界拆分，课程服务专注内容，订单服务专注交易，用户服务专注账号，这样各团队能独立迭代。拆分后主要遇到两个问题：一是服务间调用链路变长，排查问题变难，我们引入了 SkyWalking 做全链路追踪；二是跨服务数据一致性，比如用户下单要扣减课程库存，我们核心交易链路用 Seata AT 模式保证强一致，非核心场景比如积分发放用 RabbitMQ 做最终一致性。

🎯 关键词记忆点：业务边界、SkyWalking、Seata AT、RabbitMQ最终一致`, },
  { id: 'card-speech-61', type: 'script', rarity: 'SR', title: 'Sa-Token + JWT 具体怎么落地的？权限颗粒度到哪一层？', module: '项目档案室', content: `
用户登录时，Sa-Token 生成 JWT 返回给前端，后续请求在 Header 里带上 Token。我们在网关层做统一鉴权，解析 Token 拿到 userId 和角色信息，再通过 OpenFeign 拦截器透传给下游微服务。权限颗粒度做到了接口级，用 @SaCheckPermission(“course:edit”) 这种注解控制，数据级权限通过 SQL 拦截器根据用户部门 ID 自动拼接 where 条件，防止越权查数据。

🎯 关键词记忆点：网关统一鉴权、OpenFeign透传、接口级注解、数据级SQL拦截`, },
  { id: 'card-speech-62', type: 'script', rarity: 'SR', title: '视频播放进度为什么用 Redis 缓存？RabbitMQ 延迟队列怎么触发写库？TPS 提升 3 倍的数据怎么得出的？', module: '项目档案室', content: `
视频进度上报频率很高，直接写库会把 MySQL 打挂，所以我们先写 Redis，用 Hash 结构存 userId:courseId -> progress。RabbitMQ 延迟队列用来做定时刷盘，每 30 秒消费一批进度数据批量写入 MySQL，避免频繁 IO。TPS 提升 3 倍是压测出来的，之前同步写库 TPS 大概 500，改成异步批量写后能到 1500 左右，而且数据库 CPU 利用率从 80% 降到了 30%。

🎯 关键词记忆点：Redis Hash、延迟队列批量刷盘、压测对比、数据库CPU下降`, },
  { id: 'card-speech-63', type: 'script', rarity: 'SR', title: 'BitMap 具体存储结构？怎么计算连续签到？ZSet 排行榜的 score 怎么设计的？万级 QPS 怎么压测验证的？', module: '项目档案室', content: `
BitMap 本质是 String 类型的位数组，我们用 SETBIT user:sign:202610:{userId} {dayOfMonth} 1 来记录签到。连续签到用 BITCOUNT 统计最近 N 天的 1 的个数，或者用 BITPOS 找最后一个 0 的位置来算断签天数。ZSet 排行榜的 score 用”时间戳 + 签到天数”组合，这样同天数按时间排序。万级 QPS 是用 JMeter 压测的，单节点 BitMap 操作基本在微秒级，瓶颈主要在网卡，我们加了集群分片后轻松扛住。

🎯 关键词记忆点：SETBIT记录、BITCOUNT连续、score=时间戳+天数、JMeter压测`, },
  { id: 'card-speech-64', type: 'script', rarity: 'SR', title: 'Seata AT 模式在你的订单扣减场景中具体流程？如果回滚失败怎么办？', module: '项目档案室', content: `
AT 模式是一阶段提交本地事务，同时记录 undo_log，二阶段如果全局成功就异步清理日志，失败就根据 undo_log 反向补偿。订单扣减场景里，一阶段会锁住库存行并记录修改前后的快照。如果回滚失败，通常是网络或数据库宕机，Seata 会重试 3 次，还失败就进人工告警，我们配了钉钉机器人通知值班同学手动处理，同时有定时对账任务兜底。

🎯 关键词记忆点：undo_log、反向补偿、重试3次、人工告警+对账兜底`, },
  { id: 'card-speech-65', type: 'script', rarity: 'SR', title: 'Caffeine + Redis 二级缓存的缓存一致性怎么保证？缓存命中率 >95% 是怎么测出来的？', module: '项目档案室', content: `
我们用的是 Cache-Aside 策略，读请求先查 Caffeine，miss 再查 Redis，再 miss 查 DB 并回填两级缓存。写请求先删 Caffeine 再删 Redis，最后更新 DB，用消息队列异步双删防止并发脏数据。命中率是通过 Micrometer 埋点统计的，Prometheus + Grafana 看板实时显示，上线后观察了一周，Caffeine 命中率 85%，Redis 命中率 90%，综合下来整体 >95%。

🎯 关键词记忆点：Cache-Aside、异步双删、Micrometer埋点、Grafana监控`, },
  { id: 'card-speech-66', type: 'script', rarity: 'SR', title: '协同过滤的冷启动问题怎么解决？大模型生成推荐理由的 Prompt 怎么写的？首页推荐 <200ms 怎么优化的？', module: '项目档案室', content: `
冷启动用户我们用热门课程 + 注册时选的标签做兜底推荐。大模型 Prompt 是：“基于用户标签[编程,Python]和历史行为[看了3门AI课]，从候选课程[课A,课B]中选1门，用一句话说明推荐理由，不超过30字”。首页 <200ms 靠三点：推荐结果预计算存 Redis、Caffeine 缓存热门推荐、大模型异步生成理由不阻塞主链路。

🎯 关键词记忆点：标签兜底、精简Prompt、预计算+异步生成、Caffeine缓存`, },
  { id: 'card-speech-67', type: 'script', rarity: 'SR', title: '整个对话链路（用户输入→意图识别→Function Calling→工具执行→流式返回）详细讲一遍？响应 <3s 怎么保障的？', module: '项目档案室', content: `
用户输入后先过 DFA 敏感词过滤，然后调通义千问做意图识别，如果需要查订单就触发 Function Calling，我们后端注册了 queryOrder 工具，大模型返回函数名和参数后，我们执行查询并把结果拼回上下文，再调大模型生成最终回答，用 SSE 流式返回。响应 <3s 靠：意图识别用小模型、工具执行走 Redis 缓存、流式输出让用户体感更快。

🎯 关键词记忆点：DFA前置过滤、Function Calling、SSE流式、小模型意图识别`, },
  { id: 'card-speech-68', type: 'script', rarity: 'SR', title: 'Redis 向量库用的什么索引类型（HNSW/FLAT）？向量维度多少？召回率怎么样？', module: '项目档案室', content: `
我们用 HNSW 索引，因为数据量到了百万级，FLAT 全量扫描太慢。向量维度是 1024，用的通义千问的 text-embedding-v2 模型。召回率离线评测大概 92%，通过调整 efConstruction=200 和 M=16 参数，在召回率和查询延迟之间做了平衡，P99 延迟控制在 50ms 以内。

🎯 关键词记忆点：HNSW索引、1024维度、召回率92%、efConstruction调优`, },
  { id: 'card-speech-69', type: 'script', rarity: 'SR', title: 'DFA 字典怎么构建的？支持模糊匹配吗？词库更新怎么热加载？', module: '项目档案室', content: `
DFA 用 HashMap 嵌套构建，每个字符是一个 key，value 是下一个字符的 Map，末尾标记 isEnd=true。支持模糊匹配，我们在构建时把”微*信”这种带星号的词展开成多条路径，或者用正则预处理。词库热加载用 Nacos 配置中心，监听变更事件后异步重建 DFA 树，用 volatile 引用切换，不阻塞查询线程。

🎯 关键词记忆点：HashMap嵌套、星号展开、Nacos监听、volatile无锁切换`, },
  { id: 'card-speech-70', type: 'script', rarity: 'SR', title: 'Redis+Lua 扣减脚本具体内容？Redisson 分布式锁的锁粒度是什么（用户ID/优惠券ID）？“一人一单”怎么实现的？', module: '项目档案室', content: `
Lua 脚本里先 GET 库存判断 >0，再 SISMEMBER 判断用户是否已买，都通过才 DECR 库存并 SADD 用户 ID，整个操作原子执行。Redisson 锁粒度是 couponId:userId，这样不同用户抢同一券不互斥，同一用户不能并发抢。一人一单就是 Lua 里 SISMEMBER 那一步，如果已存在直接返回失败。

🎯 关键词记忆点：Lua原子操作、SISMEMBER判重、锁粒度couponId:userId、DECR+SADD`, },
  { id: 'card-speech-71', type: 'script', rarity: 'SR', title: '策略模式怎么设计的（外卖 vs 堂食）？开闭原则体现在哪？雪花算法的 workerId 怎么分配的？', module: '项目档案室', content: `
我们定义了 OrderStrategy 接口，外卖和堂食分别实现 createOrder 方法，通过工厂类根据订单类型获取对应策略。开闭原则体现在新增”自提”类型时，只需加一个实现类，不用改已有代码。雪花算法的 workerId 用 Redis INCR 生成，服务启动时自增拿一个唯一 ID，重启不会重复，集群环境下靠 Redis 保证全局唯一。

🎯 关键词记忆点：OrderStrategy接口、工厂模式、新增不改旧代码、Redis INCR分配workerId`, },
  { id: 'card-speech-72', type: 'script', rarity: 'SR', title: 'Redis + Spring Cache 的 Cache-Aside 策略，缓存失效时怎么避免缓存击穿？', module: '项目档案室', content: `
Cache-Aside 就是先查缓存，miss 再查 DB 回填。防击穿我们用 Redisson 分布式锁，第一个 miss 的线程拿锁去查 DB 并回填，其他线程等待或查旧缓存。热点 key 还会用逻辑过期策略，缓存不设 TTL，后台线程异步刷新，避免大量请求同时穿透到 DB。

🎯 关键词记忆点：Cache-Aside、Redisson锁、逻辑过期、异步刷新`, },
  { id: 'card-speech-73', type: 'script', rarity: 'N', title: 'Git 工作流？rebase 和 merge 区别？解决冲突流程？', module: '机械工坊', content: `
我们用 GitFlow，develop 分支日常开发，feature 分支开发完 merge 回 develop，release 分支打 tag 上线。rebase 是线性提交历史，更干净但会改写 commit；merge 保留完整分支记录，更安全。解决冲突流程是：先 git pull –rebase，冲突时手动改文件，git add 后 git rebase –continue，大冲突用 IDE 的 three-way merge 工具。

🎯 关键词记忆点：GitFlow、rebase线性历史、merge保留记录、IDE三方合并`, },
  { id: 'card-speech-74', type: 'script', rarity: 'R', title: 'Dockerfile 常用指令？镜像分层原理？Docker 和虚拟机的区别？', module: '机械工坊', content: `
常用指令有 FROM、RUN、COPY、EXPOSE、CMD。镜像分层是每条指令生成一层只读层，容器启动时加一个可写层，相同层复用，所以构建快、体积小。Docker 是进程级隔离，共享宿主机内核，轻量秒级启动；虚拟机是硬件级隔离，有完整 OS，重且启动慢。

🎯 关键词记忆点：FROM/RUN/COPY、分层复用、进程级隔离、共享内核`, },
  { id: 'card-speech-75', type: 'script', rarity: 'N', title: 'Maven 生命周期？依赖冲突怎么解决？', module: '机械工坊', content: `
Maven 生命周期是 clean、default（compile/test/package/install/deploy）、site。依赖冲突用 mvn dependency:tree 查看，解决方式有三种： 排除冲突包、 统一版本、true> 阻止传递。我们项目里用 BOM 统一管理 Spring Cloud 版本，从源头避免冲突。

🎯 关键词记忆点：clean/default/site、dependency:tree、exclusion、BOM统一版本`, },
  { id: 'card-speech-76', type: 'script', rarity: 'R', title: '常用命令（top/jstack/grep/awk/tail）？CPU 飙高怎么排查？', module: '机械工坊', content: `
top 看整体负载，jstack pid 导线程快照，grep 过滤关键字，awk 提取字段，tail -f 实时看日志。CPU 飙高排查流程：先 top -Hp pid 找高 CPU 线程，转 16 进制，jstack 里搜这个线程 ID，看它在执行什么代码。如果是死循环或频繁 GC，再结合 jstat 和 MAT 分析内存。

🎯 关键词记忆点：top -Hp、jstack、线程ID转16进制、jstat+MAT`, },
  { id: 'card-speech-77', type: 'script', rarity: 'R', title: '请用 2-3 分钟介绍你自己（突出：AI+后端复合背景、项目量化成果）', module: '最终面试厅', content: `
面试官好，我叫[姓名]，3年 Java 后端经验，专注微服务和 AI 应用开发。在云砚 AI 教育平台，我负责核心交易链路，用 Seata 保证分布式事务，Caffeine+Redis 二级缓存命中率 >95%，TPS 从 500 提升到 1500。还做了 RAG 课程推荐，协同过滤+大模型生成理由，首页推荐 <200ms。在智汇 AI 餐饮 SaaS，我设计了 AI 客服对话链路，用 Function Calling 调工具，响应 <3s；Redis+Lua 秒杀扛住万级 QPS。我有 AI 和后端复合背景，既能做高并发架构，也能落地大模型应用，希望能加入贵团队。

🎯 关键词记忆点：3年经验、AI+后端复合、TPS 3倍、命中率>95%、响应<3s`, },
  { id: 'card-speech-78', type: 'script', rarity: 'R', title: '为什么选 AI 应用开发方向？未来 3 年规划？', module: '最终面试厅', content: `
选 AI 应用开发是因为大模型正在重塑后端架构，Function Calling、RAG 这些技术让后端从 CRUD 变成 AI 的”手脚”，我觉得这是未来 5 年的核心方向。3 年规划：第一年深耕 LangChain4j 和向量检索，成为团队 AI 应用落地主力；第二年掌握模型微调和推理优化，能独立做 RAG 全链路；第三年往 AI 架构师方向走，设计企业级 AI 中台。

🎯 关键词记忆点：重塑后端架构、Function Calling、RAG全链路、AI架构师`, },
  { id: 'card-speech-79', type: 'script', rarity: 'R', title: '讲一个你主导解决的技术难题？遇到意见分歧怎么处理？', module: '最终面试厅', content: `
云砚项目里视频进度写库 TPS 太低，我提出 Redis+延迟队列方案，但 DBA 担心数据丢失。分歧点是强一致 vs 性能，我做了压测对比，列出异步方案的监控和对账兜底机制，用数据说服团队。最后上线后 TPS 提升 3 倍，没丢过一条进度。遇到分歧我习惯先做 POC 验证，用事实说话，而不是纯争论。

🎯 关键词记忆点：POC验证、数据说话、压测对比、兜底机制`, },
  { id: 'card-speech-80', type: 'script', rarity: 'R', title: '课程助教中最大的挑战是什么？如何梳理高频问题？沟通协调能力的具体体现？', module: '最终面试厅', content: `
最大挑战是学生问题重复率高，答疑效率低。我用 Notion 建了 FAQ 知识库，每周从微信群和答疑区提取高频问题，分类整理成文档，还录了 5 分钟短视频讲解。沟通上，我把复杂技术问题拆成”现象-原因-解决步骤”三段式，学生反馈说比直接丢代码好懂。后来 FAQ 覆盖了 80% 的问题，助教工作量降了一半。

🎯 关键词记忆点：FAQ知识库、高频问题分类、三段式沟通、工作量降50%`, },
  { id: 'card-speech-81', type: 'script', rarity: 'R', title: '你最大的优势是什么？最需要提升的地方？', module: '最终面试厅', content: `
最大优势是 AI+后端复合能力，既能写高并发微服务，又能落地 RAG、Function Calling 这些 AI 工程化技术，在团队里能 bridging 算法和工程。最需要提升的是模型底层原理，比如 Transformer 架构和训练细节，目前我更偏应用层，未来想深入理解模型，更好地做推理优化和微调。

🎯 关键词记忆点：AI+后端复合、bridging角色、模型底层原理、推理优化`, },
  { id: 'card-speech-82', type: 'script', rarity: 'R', title: '为什么投递我们公司？你对我们公司/岗位了解多少？', module: '最终面试厅', content: `
贵公司在 AI 教育/餐饮 SaaS 领域有深厚积累，我看到你们最近推出了 AI 助教/智能点餐功能，和我做的 RAG 和 Function Calling 高度契合。这个岗位要求 AI 应用开发，正好发挥我的复合背景。我希望能参与核心 AI 链路建设，把之前在教育/餐饮场景的经验复用过来，和团队一起把 AI 产品做到极致。

🎯 关键词记忆点：AI教育/SaaS积累、RAG/Function Calling契合、核心链路建设、经验复用`, },
  { id: 'card-speech-83', type: 'script', rarity: 'R', title: '你有什么想问我的？', module: '最终面试厅', content: `
我想了解三个问题：第一，团队目前 AI 应用落地的主要技术栈是什么，有没有自研框架？第二，这个岗位未来半年的核心目标是什么，是偏业务交付还是技术基建？第三，团队对 AI 应用开发的成长路径有什么规划，比如往架构师还是算法工程化方向？

🎯 关键词记忆点：技术栈、半年目标、成长路径、架构vs算法工程化`, },
];

// 总卡池 = 收集卡 + 项目实战映射卡
export const allCards: Card[] = [...cards, ...projectCards];

export const getCard = (cardId: string) => allCards.find((c) => c.id === cardId);
