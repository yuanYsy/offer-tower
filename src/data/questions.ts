import type { Question } from '../types';

// 题库：8 层共 77 题（由用户提供的题库数据合并生成；2F ms-* 重命名为 dist-*，5F proj-edu/proj-food 重命名为 proj-01..13）
export const questions: Question[] = [
  {
    id: 'java-01', floorId: 'floor-1', order: 1,
    title: '说一下 HashMap 的底层结构，JDK1.7 和 1.8 有什么区别？扩容的完整流程是怎样的？',
    interviewerLine: '坐。第一个问题，HashMap 底层结构说一下，1.7 和 1.8 差在哪。',
    standardAnswer: `HashMap 底层是哈希表结构。JDK1.7 是数组+链表，头插法，扩容时会反转链表，多线程下可能死循环。JDK1.8 改成数组+链表+红黑树，链表长度超过 8 且数组长度 ≥64 时树化，查询复杂度从 O(n) 降到 O(logn)，同时插入改成尾插法，避免多线程扩容死循环。

扩容流程：默认初始容量 16，负载因子 0.75，元素数超过容量×负载因子时触发扩容，容量翻倍，重新计算索引。JDK1.8 优化了 rehash：不用重新算 hash，而是用 hash 值与旧容量做与运算，判断元素留在原位置还是移到"原位置+旧容量"，提升扩容效率。`,
    keyPoints: [
      { id: 'kp1', label: 'JDK1.7 数组+链表，头插法，多线程扩容可能死循环', weight: 20 },
      { id: 'kp2', label: 'JDK1.8 数组+链表+红黑树，尾插法', weight: 20 },
      { id: 'kp3', label: '链表长度>8 且数组长度≥64 才树化', weight: 20 },
      { id: 'kp4', label: '默认容量 16，负载因子 0.75，超阈值扩容翻倍', weight: 20 },
      { id: 'kp5', label: 'JDK1.8 rehash 用 hash 与旧容量做与运算，判断留原位或移原位+旧容量', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'JDK1.8 在链表长度超过 8 且数组长度≥64 时树化', correct: true },
      { id: 'c2', text: 'JDK1.7 使用尾插法，JDK1.8 使用头插法', correct: false, explain: '反了，1.7 头插，1.8 尾插' },
      { id: 'c3', text: '负载因子默认 0.5，容量默认 32', correct: false, explain: '默认容量 16，负载因子 0.75' },
      { id: 'c4', text: '扩容时会重新计算每个 key 的 hash 值', correct: false, explain: '1.8 不重新算 hash，用与运算判断位置' }
    ],
    tags: ['Java', 'HashMap', '集合'], difficulty: 2, isBoss: false
  },
  {
    id: 'java-02', floorId: 'floor-1', order: 2,
    title: 'ConcurrentHashMap 是怎么保证线程安全的？和 Hashtable、SynchronizedMap 有什么本质区别？',
    interviewerLine: 'ConcurrentHashMap 怎么保证线程安全？和 Hashtable 的本质区别是什么？',
    standardAnswer: `ConcurrentHashMap 通过分段锁思想保证线程安全。JDK1.7 分成多个 Segment，每个 Segment 是独立哈希表，操作只锁当前 Segment，不同段可并发。JDK1.8 摒弃 Segment，改成 CAS + synchronized，只锁链表或红黑树的头节点，无冲突时用 CAS，进一步提升并发性能。

本质区别在锁粒度：Hashtable 给整个方法加 synchronized，锁整张表，所有操作互斥，并发最差。SynchronizedMap 包装 HashMap，用对象锁锁整个 map，也是全表锁。ConcurrentHashMap 锁的粒度是节点级，只有操作同一个哈希桶才互斥，不同桶完全并发，高并发下性能好很多。`,
    keyPoints: [
      { id: 'kp1', label: 'JDK1.7 分段锁 Segment，只锁当前段', weight: 20 },
      { id: 'kp2', label: 'JDK1.8 改成 CAS + synchronized，只锁头节点', weight: 25 },
      { id: 'kp3', label: 'Hashtable 锁整个方法，全表锁，并发最差', weight: 20 },
      { id: 'kp4', label: 'SynchronizedMap 用对象锁锁整个 map', weight: 15 },
      { id: 'kp5', label: 'ConcurrentHashMap 锁粒度是节点级，不同桶可并发', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'JDK1.8 使用 CAS + synchronized，只锁头节点', correct: true },
      { id: 'c2', text: 'JDK1.8 仍然使用 Segment 分段锁', correct: false, explain: '1.8 已摒弃 Segment' },
      { id: 'c3', text: 'Hashtable 的并发性能比 ConcurrentHashMap 好', correct: false, explain: '反了，Hashtable 是全表锁' },
      { id: 'c4', text: 'SynchronizedMap 的锁粒度是节点级', correct: false, explain: 'SynchronizedMap 是对象锁，锁整个 map' }
    ],
    tags: ['Java', '并发', 'ConcurrentHashMap'], difficulty: 2, isBoss: false
  },
  {
    id: 'java-03', floorId: 'floor-1', order: 3,
    title: '线程池的 7 个核心参数是什么？你项目里配置线程池的依据是什么？',
    interviewerLine: '线程池 7 个参数说一下，你项目里怎么配的？',
    standardAnswer: `7 个核心参数：核心线程数、最大线程数、空闲线程存活时间、时间单位、工作队列、线程工厂、拒绝策略。核心线程长期保留；线程数超核心后，空闲线程等待新任务的最长时间是存活时间；工作队列存放等待任务；线程工厂创建线程可自定义名称；拒绝策略在队列满且线程达最大时触发，默认四种：中止、丢弃、丢弃最老、调用者执行。

项目里根据业务场景配置：IO 密集型（远程调用、数据库操作）核心线程数设为 CPU 核心数×2 左右，因为 IO 阻塞时间长；CPU 密集型设为 CPU 核心数+1，避免上下文切换。同时根据压测结果调整队列大小和最大线程数，避免 OOM 或请求被拒。`,
    keyPoints: [
      { id: 'kp1', label: '7 参数：核心线程数、最大线程数、存活时间、时间单位、工作队列、线程工厂、拒绝策略', weight: 30 },
      { id: 'kp2', label: 'IO 密集型：核心线程数 ≈ CPU 核数×2', weight: 20 },
      { id: 'kp3', label: 'CPU 密集型：核心线程数 = CPU 核数+1', weight: 20 },
      { id: 'kp4', label: '拒绝策略四种：中止、丢弃、丢弃最老、调用者执行', weight: 15 },
      { id: 'kp5', label: '根据压测结果调整队列大小和最大线程数', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'IO 密集型任务核心线程数一般设为 CPU 核数×2 左右', correct: true },
      { id: 'c2', text: 'CPU 密集型任务核心线程数应设为 CPU 核数×4', correct: false, explain: 'CPU 密集型设为核数+1，避免上下文切换' },
      { id: 'c3', text: '线程池的 7 个参数不包括线程工厂', correct: false, explain: '线程工厂是 7 参数之一' },
      { id: 'c4', text: '默认拒绝策略是丢弃最老的任务', correct: false, explain: '默认是 AbortPolicy 中止策略' }
    ],
    tags: ['Java', '线程池', '并发'], difficulty: 2, isBoss: false
  },
  {
    id: 'java-04', floorId: 'floor-1', order: 4,
    title: 'synchronized 和 ReentrantLock 的区别？分别的底层实现原理是什么？',
    interviewerLine: 'synchronized 和 ReentrantLock 有什么区别？底层怎么实现的？',
    standardAnswer: `区别：① synchronized 是 JVM 关键字，ReentrantLock 是 JDK API 类；② synchronized 非公平，ReentrantLock 可选公平/非公平；③ synchronized 自动释放，ReentrantLock 需手动 lock/unlock，配合 try-finally；④ ReentrantLock 支持可中断、超时获取、绑定多个 Condition 分组唤醒，synchronized 只能随机或全部唤醒。

底层：synchronized 通过对象头 monitor 实现，进入同步块执行 monitorenter，退出执行 monitorexit，依赖操作系统互斥原语，属重量级锁；JDK1.6 后优化出偏向锁、轻量级锁、自旋锁、自适应自旋。ReentrantLock 基于 AQS，内部 state 变量 + CAS 修改 state 获取锁，失败线程进入双向队列等待，纯 Java 实现。`,
    keyPoints: [
      { id: 'kp1', label: 'synchronized 是 JVM 关键字，ReentrantLock 是 API 类', weight: 15 },
      { id: 'kp2', label: 'ReentrantLock 支持公平锁、可中断、超时、多 Condition', weight: 25 },
      { id: 'kp3', label: 'synchronized 自动释放，ReentrantLock 需手动 unlock', weight: 15 },
      { id: 'kp4', label: 'synchronized 底层是对象头 monitor + monitorenter/exit', weight: 20 },
      { id: 'kp5', label: 'ReentrantLock 基于 AQS，state + CAS + 双向队列', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'ReentrantLock 基于 AQS，通过 CAS 修改 state 获取锁', correct: true },
      { id: 'c2', text: 'synchronized 是 API 层面的锁，ReentrantLock 是 JVM 关键字', correct: false, explain: '反了' },
      { id: 'c3', text: 'ReentrantLock 不支持可中断获取锁', correct: false, explain: 'ReentrantLock 支持可中断' },
      { id: 'c4', text: 'synchronized 底层依赖 AQS 实现', correct: false, explain: 'synchronized 依赖 monitor，ReentrantLock 才用 AQS' }
    ],
    tags: ['Java', '锁', 'AQS'], difficulty: 3, isBoss: false
  },
  {
    id: 'java-05', floorId: 'floor-1', order: 5,
    title: '什么是 IoC 控制反转？Spring IoC 容器的初始化流程分为哪几步？',
    interviewerLine: 'IoC 是什么？Spring IoC 容器初始化分几步？',
    standardAnswer: `IoC 即控制反转，是一种设计思想：把对象的创建、管理、依赖注入的控制权从程序员手里反转交给 Spring 容器。原来自己 new 对象、维护依赖，现在只需通过注解或配置告诉 Spring 要创建哪些 bean、依赖关系是什么，容器自动创建并注入，降低耦合。

初始化流程三步：① 定位加载配置：扫描配置类、XML 或注解，找到需要 Spring 管理的 bean 定义，封装成 BeanDefinition；② BeanDefinition 注册：把定义注册到 BeanDefinitionRegistry（一个 Map，key 是 bean 名，value 是 BeanDefinition）；③ 实例化和初始化：容器根据 BeanDefinition 创建对象，完成依赖注入、属性赋值，执行初始化方法（afterPropertiesSet、init-method），生成可用 bean。`,
    keyPoints: [
      { id: 'kp1', label: 'IoC 是把对象创建和依赖管理的控制权交给容器', weight: 20 },
      { id: 'kp2', label: '第一步：定位加载配置，封装成 BeanDefinition', weight: 20 },
      { id: 'kp3', label: '第二步：BeanDefinition 注册到 Registry（Map）', weight: 20 },
      { id: 'kp4', label: '第三步：实例化 + 依赖注入 + 初始化方法', weight: 25 },
      { id: 'kp5', label: '降低代码耦合度', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'IoC 容器初始化第一步是定位加载配置，封装 BeanDefinition', correct: true },
      { id: 'c2', text: 'BeanDefinition 注册的容器是一个 List 集合', correct: false, explain: '是 Map，key 是 bean 名' },
      { id: 'c3', text: 'IoC 初始化流程只有实例化和依赖注入两步', correct: false, explain: '还有 BeanDefinition 注册' },
      { id: 'c4', text: 'IoC 会增加代码耦合度', correct: false, explain: 'IoC 是为了降低耦合' }
    ],
    tags: ['Spring', 'IoC'], difficulty: 1, isBoss: false
  },
  {
    id: 'java-06', floorId: 'floor-1', order: 6,
    title: '什么是 AOP 面向切面编程？底层是怎么实现的？你项目里哪些场景用到了 AOP？',
    interviewerLine: 'AOP 是什么？底层怎么实现的？你项目里用在哪？',
    standardAnswer: `AOP 面向切面编程，是对 OOP 的补充，能在不修改原有业务代码的情况下，对某一类方法统一增强，比如日志、事务、权限、性能监控，实现业务逻辑和通用功能解耦，提高复用性和可维护性。

底层通过动态代理实现：目标类实现接口用 JDK 动态代理，生成实现目标接口的代理类；没实现接口用 CGLIB，生成目标类的子类作为代理。调用目标方法时，代理类先执行切面逻辑，再调目标方法，最后执行后置逻辑。

项目里主要用 AOP 做接口操作日志记录和性能耗时统计，分布式事务注解、事务注解本质上也是 AOP 实现。比如操作日志，自定义日志注解 + 切面拦截，方法执行后记录操作人、方法、请求参数、返回结果，统一保存到日志表，不用每个接口写重复代码。`,
    keyPoints: [
      { id: 'kp1', label: 'AOP 是不修改业务代码，对方法统一增强', weight: 20 },
      { id: 'kp2', label: '底层是动态代理：JDK 动态代理 + CGLIB', weight: 25 },
      { id: 'kp3', label: '实现接口用 JDK 动态代理，否则用 CGLIB', weight: 20 },
      { id: 'kp4', label: '项目应用：操作日志、性能监控、事务', weight: 20 },
      { id: 'kp5', label: '实现业务逻辑和通用功能解耦', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '目标类没实现接口时，Spring 用 CGLIB 生成子类代理', correct: true },
      { id: 'c2', text: 'AOP 底层只能通过 CGLIB 实现', correct: false, explain: '还有 JDK 动态代理' },
      { id: 'c3', text: 'AOP 必须修改原有业务代码才能增强', correct: false, explain: 'AOP 不修改业务代码' },
      { id: 'c4', text: '事务注解不是 AOP 实现的', correct: false, explain: '事务注解本质就是 AOP' }
    ],
    tags: ['Spring', 'AOP', '动态代理'], difficulty: 2, isBoss: false
  },
  {
    id: 'java-07', floorId: 'floor-1', order: 7,
    title: '完整描述 Spring Bean 的生命周期，有哪些关键的扩展点？',
    interviewerLine: 'Spring Bean 生命周期完整说一下，有哪些扩展点？',
    standardAnswer: `生命周期五阶段：① 实例化：根据 BeanDefinition 调构造方法创建 bean，此时是空对象；② 属性注入：依赖注入，给属性赋值；③ 初始化：依次执行 Aware 接口（BeanNameAware、BeanFactoryAware、ApplicationContextAware）→ BeanPostProcessor.postProcessBeforeInitialization → InitializingBean.afterPropertiesSet → init-method → BeanPostProcessor.postProcessAfterInitialization（AOP 代理在这里生成）；④ 使用：从容器获取 bean 调用方法；⑤ 销毁：容器关闭时执行 DisposableBean.destroy → destroy-method。

关键扩展点：BeanPostProcessor（初始化前后增强，最重要）、各种 Aware 接口、InitializingBean、DisposableBean。`,
    keyPoints: [
      { id: 'kp1', label: '五阶段：实例化 → 属性注入 → 初始化 → 使用 → 销毁', weight: 30 },
      { id: 'kp2', label: '初始化依次执行 Aware → BeanPostProcessor 前置 → afterPropertiesSet → init-method → BeanPostProcessor 后置', weight: 30 },
      { id: 'kp3', label: 'AOP 代理在 BeanPostProcessor.postProcessAfterInitialization 生成', weight: 15 },
      { id: 'kp4', label: 'BeanPostProcessor 是最重要的扩展点', weight: 15 },
      { id: 'kp5', label: '销毁阶段执行 DisposableBean 和 destroy-method', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'AOP 代理在 BeanPostProcessor 的 postProcessAfterInitialization 中生成', correct: true },
      { id: 'c2', text: 'Bean 的生命周期第一步是属性注入', correct: false, explain: '第一步是实例化' },
      { id: 'c3', text: 'InitializingBean 在 BeanPostProcessor 前置之后执行', correct: false, explain: '顺序是前置 → afterPropertiesSet → init-method → 后置' },
      { id: 'c4', text: 'BeanPostProcessor 不是扩展点', correct: false, explain: '它是最重要的扩展点' }
    ],
    tags: ['Spring', 'Bean生命周期'], difficulty: 3, isBoss: false
  },
  {
    id: 'java-08', floorId: 'floor-1', order: 8,
    title: 'MyBatis 的一级缓存和二级缓存分别是什么？有什么区别？',
    interviewerLine: 'MyBatis 一级二级缓存说一下，区别是什么？',
    standardAnswer: `一级缓存是 SqlSession 级别的缓存，同一个会话内有效，默认开启。执行查询先查缓存，相同 SQL 和参数直接返回；增删改或 clearCache、close 会清空。不同 SqlSession 之间缓存不共享。

二级缓存是 Mapper 级别的缓存，同一 namespace 下所有 SqlSession 共享，需手动开启。作用范围更大，可配置缓存实现（如 Redis）、过期时间、刷新策略。

区别：① 作用范围：一级会话级，二级 Mapper 级；② 开启方式：一级默认开启，二级手动配置；③ 存储位置：一级在 SqlSession 内，会话关闭就没了，二级跨会话持久化程度更高。项目里很少用原生二级缓存，因为容易脏数据，更多用 Redis 做业务层缓存。`,
    keyPoints: [
      { id: 'kp1', label: '一级缓存是 SqlSession 级，默认开启', weight: 20 },
      { id: 'kp2', label: '二级缓存是 Mapper/namespace 级，需手动开启', weight: 25 },
      { id: 'kp3', label: '一级缓存增删改或 close 会清空', weight: 15 },
      { id: 'kp4', label: '二级缓存可配置 Redis 实现、过期时间', weight: 20 },
      { id: 'kp5', label: '原生二级缓存易脏数据，项目多用 Redis', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '一级缓存是 SqlSession 级别，默认开启', correct: true },
      { id: 'c2', text: '二级缓存默认开启，无需配置', correct: false, explain: '二级缓存需手动开启' },
      { id: 'c3', text: '一级缓存跨 SqlSession 共享', correct: false, explain: '一级缓存只在当前 SqlSession 内有效' },
      { id: 'c4', text: '二级缓存作用范围比一级缓存小', correct: false, explain: '二级缓存作用范围更大' }
    ],
    tags: ['MyBatis', '缓存'], difficulty: 2, isBoss: false
  },
  {
    id: 'java-09', floorId: 'floor-1', order: 9,
    title: 'MyBatis 中 #{} 和 ${} 的区别是什么？为什么 #{} 可以防止 SQL 注入？',
    interviewerLine: '#{} 和 ${} 有什么区别？为什么 #{} 能防注入？',
    standardAnswer: `#{} 是预编译处理，MyBatis 会把 #{} 替换成问号占位符，调用 JDBC PreparedStatement 的 set 方法设置参数，参数被当字符串处理，自动加引号，不直接拼接到 SQL，所以能防 SQL 注入。\${} 是字符串替换，直接把参数值原样拼接到 SQL 里，相当于字符串拼接，有 SQL 注入风险，比如参数带 or 1=1 会改变原 SQL 语义。

\${} 也不是完全没用，动态替换表名、列名、排序字段时必须用 \${}，因为这些位置不能用预编译占位符，这时需要自己做参数校验防注入。`,
    keyPoints: [
      { id: 'kp1', label: '#{} 是预编译，替换成问号占位符，用 PreparedStatement.set', weight: 30 },
      { id: 'kp2', label: '${} 是字符串替换，直接拼接到 SQL，有注入风险', weight: 25 },
      { id: 'kp3', label: '#{} 参数被当字符串处理，自动加引号', weight: 20 },
      { id: 'kp4', label: '表名、列名、排序字段必须用 ${}，需自己校验', weight: 15 },
      { id: 'kp5', label: '${} 遇到 or 1=1 会改变 SQL 语义', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: '#{} 使用 PreparedStatement 预编译，能防 SQL 注入', correct: true },
      { id: 'c2', text: '${} 也是预编译处理', correct: false, explain: '${} 是字符串替换' },
      { id: 'c3', text: '表名和排序字段应该用 #{}', correct: false, explain: '这些位置必须用 ${}' },
      { id: 'c4', text: '#{} 会把参数直接拼接到 SQL 中', correct: false, explain: '那是 ${} 的行为' }
    ],
    tags: ['MyBatis', 'SQL注入'], difficulty: 1, isBoss: false
  },
  {
    id: 'java-10', floorId: 'floor-1', order: 10,
    title: '你项目里用了 MyBatis-Plus，它和原生 MyBatis 相比有什么优势？',
    interviewerLine: 'MyBatis-Plus 相比原生 MyBatis 有什么优势？',
    standardAnswer: `MyBatis-Plus 在 MyBatis 基础上做增强，只做增强不做改变，最大优势是提升开发效率。① 封装通用 CRUD、批量操作、分页查询，不用写重复 XML 和接口方法；② 强大的条件构造器 QueryWrapper / LambdaQueryWrapper，链式调用拼查询条件，Lambda 写法避免字段名写错；③ 代码生成器一键生成实体、mapper、service、controller；④ 分页插件、乐观锁、逻辑删除、自动填充等开箱即用；⑤ 完全兼容原生 MyBatis，原代码无缝迁移，学习成本低。`,
    keyPoints: [
      { id: 'kp1', label: '封装通用 CRUD、批量、分页，减少重复代码', weight: 25 },
      { id: 'kp2', label: '条件构造器 QueryWrapper / LambdaQueryWrapper 链式调用', weight: 25 },
      { id: 'kp3', label: '代码生成器一键生成各层代码', weight: 15 },
      { id: 'kp4', label: '分页插件、乐观锁、逻辑删除、自动填充开箱即用', weight: 20 },
      { id: 'kp5', label: '完全兼容原生 MyBatis，无缝迁移', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'MyBatis-Plus 完全兼容原生 MyBatis，可无缝迁移', correct: true },
      { id: 'c2', text: 'MyBatis-Plus 是不兼容 MyBatis 的新框架', correct: false, explain: '它只做增强不做改变' },
      { id: 'c3', text: 'MyBatis-Plus 不支持条件构造器', correct: false, explain: '条件构造器是它的核心优势' },
      { id: 'c4', text: 'MyBatis-Plus 需要手写所有 CRUD 的 XML', correct: false, explain: '它封装了通用 CRUD，不用重复写 XML' }
    ],
    tags: ['MyBatis-Plus', 'ORM'], difficulty: 1, isBoss: true
  },
  {
    id: 'dist-01', floorId: 'floor-2', order: 1,
    title: '你项目用了 Spring Cloud Alibaba，说一下你用到了哪些组件？分别承担什么作用？',
    interviewerLine: 'Spring Cloud Alibaba 你用了哪些组件？各自什么作用？',
    standardAnswer: `用到 5 个核心组件：① Nacos：注册中心 + 配置中心，服务注册发现、配置统一管理、动态刷新；② Spring Cloud Gateway：统一网关入口，路由转发、统一鉴权、限流、跨域；③ OpenFeign：声明式远程调用，写接口加注解就能调其他服务，像调本地方法；④ Sentinel：流量控制和服务熔断降级，保护系统不被高并发打垮，避免服务雪崩；⑤ Seata：分布式事务，保证跨服务调用数据一致性。`,
    keyPoints: [
      { id: 'kp1', label: 'Nacos：注册中心 + 配置中心', weight: 20 },
      { id: 'kp2', label: 'Gateway：统一网关，路由、鉴权、限流、跨域', weight: 20 },
      { id: 'kp3', label: 'OpenFeign：声明式远程调用', weight: 20 },
      { id: 'kp4', label: 'Sentinel：流量控制、熔断降级', weight: 20 },
      { id: 'kp5', label: 'Seata：分布式事务', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Nacos 同时承担注册中心和配置中心', correct: true },
      { id: 'c2', text: 'Sentinel 是注册中心', correct: false, explain: 'Sentinel 是流量控制组件' },
      { id: 'c3', text: 'Seata 用于网关路由', correct: false, explain: 'Seata 用于分布式事务' },
      { id: 'c4', text: 'OpenFeign 用于配置管理', correct: false, explain: 'OpenFeign 是远程调用' }
    ],
    tags: ['微服务', 'SpringCloudAlibaba'], difficulty: 2, isBoss: false
  },
  {
    id: 'dist-02', floorId: 'floor-2', order: 2,
    title: 'Nacos 的服务发现原理是什么？和 Eureka 相比有什么优势？',
    interviewerLine: 'Nacos 服务发现原理说一下，和 Eureka 比优势在哪？',
    standardAnswer: `Nacos 服务发现原理：① 服务提供者启动时把 IP、端口、服务名注册到 Nacos 服务端；② 消费者启动时从 Nacos 拉取实例列表缓存到本地；③ 调用时根据本地实例列表做负载均衡；④ 提供者定期发心跳，长时间没收到就剔除实例；⑤ 实例列表变化时 Nacos 主动推送变更给消费者更新本地缓存。

相比 Eureka 优势：① 功能更全，Nacos 同时支持注册中心和配置中心，Eureka 只做注册；② Nacos 支持 AP/CP 模式切换，Eureka 只支持 AP；③ Nacos 性能更好，支持更多实例，有可视化控制台；④ Eureka 已停止维护，Nacos 持续迭代，国内生态更好。`,
    keyPoints: [
      { id: 'kp1', label: '提供者注册，消费者拉取并本地缓存', weight: 20 },
      { id: 'kp2', label: '心跳机制，超时剔除实例', weight: 15 },
      { id: 'kp3', label: 'Nacos 主动推送变更给消费者', weight: 15 },
      { id: 'kp4', label: 'Nacos 同时支持注册中心和配置中心', weight: 20 },
      { id: 'kp5', label: 'Nacos 支持 AP/CP 切换，Eureka 只支持 AP', weight: 20 },
      { id: 'kp6', label: 'Eureka 停止维护，Nacos 持续迭代', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'Nacos 支持 AP 和 CP 两种模式切换', correct: true },
      { id: 'c2', text: 'Eureka 同时支持注册中心和配置中心', correct: false, explain: 'Eureka 只做注册中心' },
      { id: 'c3', text: 'Nacos 只能通过消费者主动拉取，不支持推送', correct: false, explain: 'Nacos 支持主动推送' },
      { id: 'c4', text: 'Eureka 仍在持续迭代更新', correct: false, explain: 'Eureka 已停止维护' }
    ],
    tags: ['Nacos', '服务发现', 'Eureka'], difficulty: 2, isBoss: false
  },
  {
    id: 'dist-03', floorId: 'floor-2', order: 3,
    title: 'Spring Cloud Gateway 的执行流程是什么？你项目里配置了哪些过滤器？',
    interviewerLine: 'Gateway 执行流程说一下，你配了哪些过滤器？',
    standardAnswer: `执行流程：① 客户端请求先到 DispatcherHandler，匹配路由；② 根据 Predicate 断言判断请求是否符合路由规则；③ 匹配成功后经过过滤器链，全局过滤器和路由过滤器按顺序执行，处理鉴权、限流、参数修改、路径重写；④ 转发到后端微服务；⑤ 后端返回响应，再依次经过过滤器后置逻辑，最后返回客户端。

项目配置的过滤器：① 全局鉴权过滤器，校验 token 和权限；② 跨域过滤器；③ 请求路径重写过滤器；④ Sentinel 限流过滤器；⑤ 全局日志过滤器，记录路径、参数、耗时。`,
    keyPoints: [
      { id: 'kp1', label: '请求先到 DispatcherHandler 匹配路由', weight: 15 },
      { id: 'kp2', label: 'Predicate 断言判断请求是否符合路由规则', weight: 20 },
      { id: 'kp3', label: '过滤器链：全局过滤器 + 路由过滤器按顺序执行', weight: 20 },
      { id: 'kp4', label: '转发到后端服务，响应再经过过滤器后置逻辑', weight: 15 },
      { id: 'kp5', label: '项目过滤器：鉴权、跨域、路径重写、限流、日志', weight: 30 }
    ],
    choices: [
      { id: 'c1', text: 'Gateway 通过 Predicate 断言匹配路由', correct: true },
      { id: 'c2', text: 'Gateway 只有路由过滤器，没有全局过滤器', correct: false, explain: '两者都有' },
      { id: 'c3', text: '过滤器只在请求转发前执行', correct: false, explain: '响应返回时也经过后置逻辑' },
      { id: 'c4', text: 'Gateway 不支持下限流', correct: false, explain: '可配 Sentinel 限流过滤器' }
    ],
    tags: ['Gateway', '网关', '过滤器'], difficulty: 2, isBoss: false
  },
  {
    id: 'dist-04', floorId: 'floor-2', order: 4,
    title: '你在网关层做了统一鉴权，用了 Sa-Token+JWT，两者有什么区别？怎么实现跨服务的鉴权传递？',
    interviewerLine: 'Sa-Token 和 JWT 有什么区别？跨服务鉴权怎么传递？',
    standardAnswer: `JWT 是一种令牌格式规范，把用户信息加密到 token 字符串，服务端不用存 session，校验时解析 token 即可，无状态。Sa-Token 是完整权限认证框架，封装登录认证、权限校验、踢人下线、token 刷新，底层可选 JWT 或 session。JWT 是工具，只解决 token 生成校验；Sa-Token 是一整套权限方案，开箱即用 API 多，开发效率高。

跨服务鉴权传递：网关鉴权通过后，把用户 ID、权限信息放请求头转发给后端服务。服务间用 OpenFeign 调用时，配置 Feign 请求拦截器，自动把当前请求的用户信息从请求头取出放到下一个调用的请求头，整个链路都能获取用户信息，不用重复鉴权。`,
    keyPoints: [
      { id: 'kp1', label: 'JWT 是令牌格式规范，无状态，只解决生成校验', weight: 20 },
      { id: 'kp2', label: 'Sa-Token 是完整权限框架，封装登录、权限、踢人、刷新', weight: 25 },
      { id: 'kp3', label: '网关鉴权后把用户信息放请求头转发', weight: 20 },
      { id: 'kp4', label: 'Feign 请求拦截器自动传递用户信息到下游', weight: 25 },
      { id: 'kp5', label: 'Sa-Token 底层可选 JWT 或 session', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'Sa-Token 是完整权限框架，JWT 是令牌格式规范', correct: true },
      { id: 'c2', text: 'JWT 封装了登录、权限校验、踢人下线等完整功能', correct: false, explain: '这是 Sa-Token 的能力' },
      { id: 'c3', text: '跨服务鉴权传递只能用 session 共享', correct: false, explain: '可以用 Feign 拦截器传递请求头' },
      { id: 'c4', text: '网关鉴权后不需要传递用户信息给下游服务', correct: false, explain: '需要传递，否则下游无法获取用户' }
    ],
    tags: ['Sa-Token', 'JWT', '鉴权'], difficulty: 3, isBoss: false
  },
  {
    id: 'dist-05', floorId: 'floor-2', order: 5,
    title: 'OpenFeign 的远程调用原理是什么？怎么配置超时、重试和降级？',
    interviewerLine: 'OpenFeign 底层原理说一下，超时重试降级怎么配？',
    standardAnswer: `OpenFeign 底层基于动态代理。定义 Feign 接口加 @FeignClient 注解，OpenFeign 为接口生成动态代理对象；调用接口方法时，代理对象把方法名、参数、请求路径封装成 HTTP 请求，根据服务名去注册中心找到实例，通过 HTTP 客户端发送请求，收到响应解析成 Java 对象返回，像调本地方法一样。

配置：① 超时：配置文件设置 connectTimeout 连接超时和 readTimeout 读取超时；② 重试：配置 Spring Retry，设置重试次数、间隔、异常类型，注意只有查询类幂等接口才适合重试，写操作不能随便重试；③ 降级：配合 Sentinel 或 Hystrix，给 Feign 接口配置降级类，调用失败、超时或限流时执行降级方法返回兜底数据。`,
    keyPoints: [
      { id: 'kp1', label: '底层基于动态代理，为接口生成代理对象', weight: 20 },
      { id: 'kp2', label: '代理对象封装 HTTP 请求，根据服务名找实例', weight: 20 },
      { id: 'kp3', label: '超时：connectTimeout 和 readTimeout', weight: 20 },
      { id: 'kp4', label: '重试：Spring Retry，只有查询类幂等接口适合重试', weight: 20 },
      { id: 'kp5', label: '降级：配合 Sentinel/Hystrix，配置降级类返回兜底数据', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'OpenFeign 底层基于动态代理生成接口实现', correct: true },
      { id: 'c2', text: '写操作接口也适合配置自动重试', correct: false, explain: '写操作不幂等，不能随便重试' },
      { id: 'c3', text: 'OpenFeign 需要手写 HTTP 请求代码', correct: false, explain: '它封装了 HTTP 调用，像本地方法' },
      { id: 'c4', text: 'OpenFeign 不支持降级', correct: false, explain: '可配合 Sentinel/Hystrix 降级' }
    ],
    tags: ['OpenFeign', '远程调用'], difficulty: 2, isBoss: false
  },
  {
    id: 'dist-06', floorId: 'floor-2', order: 6,
    title: 'RabbitMQ 怎么保证消息不丢失？怎么处理消息重复消费的问题？',
    interviewerLine: 'RabbitMQ 消息不丢失怎么保证？重复消费怎么处理？',
    standardAnswer: `保证不丢失从三环节入手：① 生产者端：开启 publisher confirm 确认机制，消息到交换机后 MQ 返回确认回调，失败可重发；开启消息退回机制，交换机没找到队列时退回给生产者。② MQ 服务端：开启队列持久化和消息持久化，队列声明 durable=true，消息投递模式设为持久化，宕机重启也不丢。③ 消费者端：关闭自动 ack，改手动确认，处理成功再手动 ack，失败 nack，可重回队列或丢弃。

重复消费不可避免，网络延迟、确认失败都会导致重复投递，核心是保证接口幂等。项目用两种方式：① 消息唯一 ID + Redis，处理前查 ID 是否处理过，处理过跳过，没处理过执行业务并存 ID 设过期时间；② 基于业务唯一标识，如订单号，处理前查数据库有没有处理记录。`,
    keyPoints: [
      { id: 'kp1', label: '生产者：publisher confirm 确认 + 消息退回机制', weight: 20 },
      { id: 'kp2', label: 'MQ 服务端：队列持久化 + 消息持久化', weight: 20 },
      { id: 'kp3', label: '消费者：关闭自动 ack，改手动确认', weight: 20 },
      { id: 'kp4', label: '重复消费核心是保证接口幂等', weight: 20 },
      { id: 'kp5', label: '方案：消息唯一 ID + Redis 去重；业务唯一标识查库', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '消费者应关闭自动 ack，改手动确认', correct: true },
      { id: 'c2', text: '消息持久化只需设置队列 durable=true 即可', correct: false, explain: '消息本身也要设持久化投递模式' },
      { id: 'c3', text: '重复消费无法避免，只能靠幂等处理', correct: false },
      { id: 'c4', text: 'publisher confirm 是消费者端的机制', correct: false, explain: '它是生产者端的确认机制' }
    ],
    tags: ['RabbitMQ', '消息可靠性', '幂等'], difficulty: 3, isBoss: false
  },
  {
    id: 'dist-07', floorId: 'floor-2', order: 7,
    title: '你项目里用了 RabbitMQ 延迟队列，是怎么实现的？用在什么业务场景？',
    interviewerLine: '延迟队列怎么实现的？用在哪？',
    standardAnswer: `RabbitMQ 本身没有延迟队列，通过死信队列 + TTL 实现：① 创建普通业务队列，设置消息过期时间 TTL，绑定死信交换机和死信路由键；② 创建死信队列，和死信交换机绑定；③ 生产者发消息到普通队列，消息不被消费，到期后变成死信自动转发到死信队列；④ 消费者监听死信队列拿到延迟后的消息。不同延迟时间可创建多个 TTL 队列，或用延迟队列插件，插件更灵活可单独设每条消息延迟。

项目用在教育平台两个场景：① 学习进度异步同步，用户看视频进度不用实时更新数据库，延迟几秒批量处理，减少数据库压力；② 订单超时自动取消，下单后 30 分钟未支付自动取消释放库存，用延迟队列不用定时任务轮询，性能更好时效更准。`,
    keyPoints: [
      { id: 'kp1', label: '通过死信队列 + TTL 实现延迟队列', weight: 25 },
      { id: 'kp2', label: '普通队列设 TTL 和死信交换机，消息到期转死信队列', weight: 25 },
      { id: 'kp3', label: '可用延迟队列插件，支持单独设每条消息延迟', weight: 15 },
      { id: 'kp4', label: '场景一：学习进度异步同步，延迟批量处理', weight: 20 },
      { id: 'kp5', label: '场景二：订单超时自动取消，释放库存', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'RabbitMQ 延迟队列可通过死信队列 + TTL 实现', correct: true },
      { id: 'c2', text: 'RabbitMQ 原生直接支持延迟队列', correct: false, explain: '需要死信队列 + TTL 或插件' },
      { id: 'c3', text: '订单超时取消只能用定时任务轮询', correct: false, explain: '延迟队列性能更好' },
      { id: 'c4', text: '延迟队列插件不支持单独设置每条消息延迟', correct: false, explain: '插件支持单独设置' }
    ],
    tags: ['RabbitMQ', '延迟队列', '死信队列'], difficulty: 3, isBoss: false
  },
  {
    id: 'dist-08', floorId: 'floor-2', order: 8,
    title: '消息队列出现大量消息堆积，你的排查和解决思路是什么？',
    interviewerLine: '消息堆积了，你怎么排查和解决？',
    standardAnswer: `先排查原因：① 看消费者是否挂了或消费异常，检查服务状态、报错、是否卡住；② 看消费能力是否跟不上，消费者太少或单条处理耗时太长（慢 SQL、同步调第三方）；③ 看生产者是否流量激增，如活动、秒杀短时间产生大量消息。

解决分紧急和长期：紧急处理：① 快速扩容消费者，增加实例数或消费线程数；② 临时把不重要消息转到其他队列或存储，先保证核心业务消息正常消费。长期优化：① 优化消费逻辑，慢操作改异步，优化 SQL，减少单条处理时间；② 消息分区，增加队列并发消费能力；③ 生产者端限流，控制发送速率；④ 做好监控，设置堆积告警阈值提前发现。`,
    keyPoints: [
      { id: 'kp1', label: '排查：消费者是否挂了/异常', weight: 15 },
      { id: 'kp2', label: '排查：消费能力跟不上（消费者少、单条耗时长）', weight: 20 },
      { id: 'kp3', label: '排查：生产者流量激增', weight: 15 },
      { id: 'kp4', label: '紧急：扩容消费者，转存非核心消息', weight: 25 },
      { id: 'kp5', label: '长期：优化消费逻辑、消息分区、生产者限流、监控告警', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '紧急处理可以先扩容消费者实例数量', correct: true },
      { id: 'c2', text: '消息堆积只需要清空队列即可', correct: false, explain: '清空会丢消息' },
      { id: 'c3', text: '长期优化应优化消费逻辑，把慢操作改异步', correct: false },
      { id: 'c4', text: '生产者端不需要限流', correct: false, explain: '生产者限流是长期优化手段之一' }
    ],
    tags: ['RabbitMQ', '消息堆积', '排查'], difficulty: 3, isBoss: false
  },
  {
    id: 'dist-09', floorId: 'floor-2', order: 9,
    title: '分布式事务有哪些常见解决方案？你项目里为什么用 Seata AT+TCC 双模式？两者的区别和适用场景分别是什么？',
    interviewerLine: '分布式事务方案有哪些？为什么用 Seata AT+TCC 双模式？',
    standardAnswer: `常见方案：2PC 两阶段提交、TCC、可靠消息最终一致性、最大努力通知、Seata AT。2PC 强一致但性能差同步阻塞；TCC 补偿型，Try/Confirm/Cancel 三阶段，性能好但业务侵入大；可靠消息最终一致通过 MQ 实现，适合实时一致性要求不高的场景；Seata AT 是对 2PC 优化，自动生成回滚日志，业务零侵入。

项目用双模式因为场景不同：AT 模式业务侵入低、开发快，适合常规业务如课程下单、订单支付，加注解即可；TCC 适合高并发核心场景如库存扣减、优惠券核销，Try 阶段预留资源，Confirm 正式提交，Cancel 释放资源，能精准控制并发避免超卖，性能比 AT 好。简单说 AT 保效率，TCC 保性能。`,
    keyPoints: [
      { id: 'kp1', label: '常见方案：2PC、TCC、可靠消息、最大努力通知、Seata AT', weight: 20 },
      { id: 'kp2', label: 'AT 模式业务零侵入，自动生成回滚日志，适合常规业务', weight: 25 },
      { id: 'kp3', label: 'TCC 分 Try/Confirm/Cancel 三阶段，业务侵入大', weight: 20 },
      { id: 'kp4', label: 'TCC 适合高并发核心场景，Try 预留资源避免超卖', weight: 20 },
      { id: 'kp5', label: 'AT 保效率，TCC 保性能，结合使用性价比最高', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'Seata AT 模式业务零侵入，自动生成回滚日志', correct: true },
      { id: 'c2', text: 'TCC 模式业务侵入比 AT 模式小', correct: false, explain: 'TCC 需要写三个方法，侵入更大' },
      { id: 'c3', text: 'TCC 的 Try 阶段就正式提交资源', correct: false, explain: 'Try 是预留资源，Confirm 才提交' },
      { id: 'c4', text: 'AT 模式适合所有高并发核心场景', correct: false, explain: '高并发核心场景更适合 TCC' }
    ],
    tags: ['Seata', '分布式事务', 'TCC'], difficulty: 3, isBoss: false
  },
  {
    id: 'dist-10', floorId: 'floor-2', order: 10,
    title: '什么是接口幂等性？你项目里用了哪些方案保证幂等？分别对应什么场景？',
    interviewerLine: '接口幂等性是什么？你项目用了哪些方案？',
    standardAnswer: `接口幂等性指同一个请求调用一次和多次效果一样，不会因重复调用产生副作用，如重复下单、重复扣库存、重复支付。分布式系统中网络重试、消息重复消费、前端重复提交都会导致重复请求，必须保证幂等。

项目四种方案：① 唯一 ID + Redis 防重：请求生成唯一 ID，先查 Redis 是否处理过，适合前端重复提交、消息重复消费；② 数据库唯一索引：给订单号加唯一索引，重复插入报错，适合有唯一业务标识的写操作；③ 状态机幂等：订单状态流转，必须上一状态才能更新下一状态，适合订单状态流转；④ 乐观锁版本号：更新带版本号，匹配才更新，适合库存扣减、积分更新。`,
    keyPoints: [
      { id: 'kp1', label: '幂等性：同一请求调用一次和多次效果一样', weight: 15 },
      { id: 'kp2', label: '方案一：唯一 ID + Redis 防重', weight: 20 },
      { id: 'kp3', label: '方案二：数据库唯一索引', weight: 15 },
      { id: 'kp4', label: '方案三：状态机幂等，状态流转校验', weight: 20 },
      { id: 'kp5', label: '方案四：乐观锁版本号', weight: 15 },
      { id: 'kp6', label: '网络重试、消息重复、前端重复提交都会导致重复请求', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '唯一 ID + Redis 防重适合前端重复提交场景', correct: true },
      { id: 'c2', text: '数据库唯一索引适合所有幂等场景', correct: false, explain: '只适合有唯一业务标识的写操作' },
      { id: 'c3', text: '状态机幂等要求必须上一状态才能流转到下一状态', correct: false },
      { id: 'c4', text: '乐观锁版本号适合查询类接口', correct: false, explain: '适合更新类操作' }
    ],
    tags: ['幂等性', '分布式'], difficulty: 2, isBoss: false
  },
  {
    id: 'dist-11', floorId: 'floor-2', order: 11,
    title: 'Sentinel 流量控制的核心原理是什么？和 Hystrix 相比有什么优势？',
    interviewerLine: 'Sentinel 原理说一下，和 Hystrix 比优势在哪？',
    standardAnswer: `Sentinel 核心原理：通过滑动窗口算法统计请求 QPS、响应时间、异常数等指标，根据预设规则做流量控制。把时间分成小窗口，每个窗口记录请求计数，随时间滑动，旧窗口过期新窗口加入，统计当前窗口指标判断是否触发限流、熔断。

相比 Hystrix 优势：① 功能更丰富，不仅熔断降级，还支持流量控制、系统自适应保护、热点参数限流，维度更多；② 性能更好，资源消耗比 Hystrix 小；③ 有可视化控制台，动态修改规则、实时查看监控；④ Hystrix 已停止维护，Sentinel 持续更新，阿里开源，国内生态更好，对 Spring Cloud Alibaba 适配更原生。`,
    keyPoints: [
      { id: 'kp1', label: '滑动窗口算法统计 QPS、响应时间、异常数', weight: 25 },
      { id: 'kp2', label: '时间分小窗口，旧窗口过期新窗口加入', weight: 20 },
      { id: 'kp3', label: '功能更丰富：流量控制、系统自适应、热点参数限流', weight: 20 },
      { id: 'kp4', label: '有可视化控制台，动态修改规则', weight: 20 },
      { id: 'kp5', label: 'Hystrix 停止维护，Sentinel 持续更新', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'Sentinel 通过滑动窗口算法统计指标', correct: true },
      { id: 'c2', text: 'Sentinel 只支持熔断降级，不支持流量控制', correct: false, explain: '它功能更丰富' },
      { id: 'c3', text: 'Hystrix 仍在持续更新维护', correct: false, explain: 'Hystrix 已停止维护' },
      { id: 'c4', text: 'Sentinel 没有可视化控制台', correct: false, explain: '它有可视化控制台' }
    ],
    tags: ['Sentinel', 'Hystrix', '限流'], difficulty: 2, isBoss: true
  },
  {
    id: 'db-01', floorId: 'floor-3', order: 1,
    title: 'MySQL 索引为什么选择 B+ 树？和 B 树、哈希索引相比有什么优势？',
    interviewerLine: 'MySQL 为什么用 B+ 树做索引？B 树和哈希差在哪？',
    standardAnswer: `MySQL 选择 B+ 树主要是适配磁盘 IO 特性。和 B 树相比：B+ 树非叶子节点不存数据只存索引键，同样大小的节点能存更多索引键，树高更低，一般两三百万数据只有三四层，磁盘 IO 次数更少；B+ 树所有数据都在叶子节点，叶子节点用双向链表连接，范围查询只需找到起始位置顺着链表遍历，而 B 树范围查询需中序遍历，还要来回遍历节点，效率低很多。

和哈希索引相比：哈希索引等值查询极快，但不支持范围查询、排序、分组，哈希冲突时性能下降，最关键是不能用最左前缀原则，联合索引用不了。而 B+ 树支持等值、范围、排序、分组，还能利用最左前缀优化，适用场景更多。`,
    keyPoints: [
      { id: 'kp1', label: '非叶子节点不存数据，树更矮，磁盘 IO 更少', weight: 25 },
      { id: 'kp2', label: '叶子节点双向链表，范围查询高效', weight: 25 },
      { id: 'kp3', label: '哈希索引不支持范围查询/排序/最左前缀', weight: 25 },
      { id: 'kp4', label: 'B 树范围查询需中序遍历，效率低', weight: 15 },
      { id: 'kp5', label: '两三百万数据只有三四层树高', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'B+ 树非叶子节点不存数据，树更矮，磁盘 IO 更少', correct: true },
      { id: 'c2', text: 'B+ 树每个节点都存储完整数据行，查询更快', correct: false, explain: '只有叶子节点存数据' },
      { id: 'c3', text: '哈希索引支持范围查询，但不支持等值查询', correct: false, explain: '哈希索引等值快，范围不支持' },
      { id: 'c4', text: 'B 树的所有数据都在叶子节点，范围查询更方便', correct: false, explain: '这是 B+ 树的特性' }
    ],
    tags: ['MySQL', '索引', 'B+树'], difficulty: 2, isBoss: false
  },
  {
    id: 'db-02', floorId: 'floor-3', order: 2,
    title: '什么是最左前缀原则？你平时怎么优化慢 SQL？explain 执行计划主要看哪些字段？',
    interviewerLine: '最左前缀原则说一下，慢 SQL 怎么优化？explain 看哪些字段？',
    standardAnswer: `最左前缀原则：联合索引查询从最左边字段开始匹配，依次往右，遇到范围查询停止匹配。比如 (a,b,c) 联合索引，查询条件有 a 就能用索引，只有 b 和 c 用不到；a=1 and b>2 and c=3 时只有 a 和 b 用到索引，c 用不到，因为 b 是范围查询。建联合索引时等值字段放左边，范围字段放右边。

慢 SQL 优化：先用 explain 看是否走索引、是否全表扫描；分析 SQL 写法，不用 select *，避免在索引列上用函数、运算、隐式类型转换；根据查询场景建合适的联合索引；单表数据量大考虑分库分表或冷热分离；关联查询多就适当冗余减少 join；深分页用子查询或游标分页。

explain 主要看：type（访问类型，至少 range，最好 ref，ALL 必须优化）、key（实际用的索引）、rows（预估扫描行数）、Extra（Using filesort、Using temporary 需优化）、possible_keys（可能用到的索引）。`,
    keyPoints: [
      { id: 'kp1', label: '最左前缀：从最左字段开始匹配，遇范围查询停止', weight: 20 },
      { id: 'kp2', label: '建联合索引：等值字段放左，范围字段放右', weight: 15 },
      { id: 'kp3', label: '避免索引列上用函数、运算、隐式类型转换', weight: 15 },
      { id: 'kp4', label: 'explain 看 type、key、rows、Extra', weight: 25 },
      { id: 'kp5', label: 'type 至少 range，ALL 必须优化；Extra 有 filesort/temporary 要优化', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '联合索引 (a,b,c) 中查询条件只有 b 和 c 时能用索引', correct: false, explain: '不满足最左前缀，用不到' },
      { id: 'c2', text: 'explain 的 type 列 ALL 表示全表扫描，必须优化', correct: true },
      { id: 'c3', text: '在索引列上使用函数不会导致索引失效', correct: false, explain: '会导致索引失效' },
      { id: 'c4', text: 'Extra 列出现 Using filesort 说明性能很好', correct: false, explain: '文件排序影响性能，需优化' }
    ],
    tags: ['MySQL', '索引优化', 'explain'], difficulty: 2, isBoss: false
  },
  {
    id: 'db-03', floorId: 'floor-3', order: 3,
    title: 'MySQL 的 4 种事务隔离级别是什么？默认级别是哪个？分别解决了什么问题？',
    interviewerLine: '事务隔离级别说一下，默认是哪个？各解决什么问题？',
    standardAnswer: `从低到高：① 读未提交：一个事务能读到另一个事务未提交的数据，会出现脏读、不可重复读、幻读；② 读已提交：只能读到已提交数据，解决脏读，仍有不可重复读和幻读；③ 可重复读：MySQL 默认级别，保证同一事务多次读取同一数据结果一致，解决脏读和不可重复读，理论上还有幻读，但 InnoDB 通过 MVCC 和间隙锁在可重复读级别下很大程度解决了幻读；④ 串行化：最高级别，所有事务串行执行，解决脏读、不可重复读、幻读，但性能最差，并发极低。`,
    keyPoints: [
      { id: 'kp1', label: '四种级别：读未提交、读已提交、可重复读、串行化', weight: 25 },
      { id: 'kp2', label: 'MySQL 默认是可重复读', weight: 20 },
      { id: 'kp3', label: '读已提交解决脏读，仍有不可重复读和幻读', weight: 20 },
      { id: 'kp4', label: '可重复读解决脏读和不可重复读', weight: 20 },
      { id: 'kp5', label: 'InnoDB 通过 MVCC + 间隙锁在可重复读下解决幻读', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'MySQL 默认隔离级别是可重复读', correct: true },
      { id: 'c2', text: '读已提交能解决幻读问题', correct: false, explain: '读已提交仍有幻读' },
      { id: 'c3', text: '串行化隔离级别性能最好', correct: false, explain: '串行化性能最差' },
      { id: 'c4', text: '读未提交能解决脏读', correct: false, explain: '读未提交会出现脏读' }
    ],
    tags: ['MySQL', '事务', '隔离级别'], difficulty: 2, isBoss: false
  },
  {
    id: 'db-04', floorId: 'floor-3', order: 4,
    title: '详细说一下 MVCC（多版本并发控制）的实现原理。',
    interviewerLine: 'MVCC 实现原理详细说一下。',
    standardAnswer: `MVCC 是 InnoDB 实现事务隔离的核心机制，作用是读写不加锁，实现读写不冲突，提升并发性能。依赖三个东西：① 隐藏字段：每行数据有 trx_id（最后修改这行的事务 ID）和 roll_pointer（回滚指针，指向上一个版本）；② undo log：保存数据历史版本链，每次修改把旧版本存 undo log，通过回滚指针连成链表；③ read view：事务开启查询时生成的读视图，包含当前活跃事务 ID 列表、最小事务 ID、最大事务 ID。

查询时拿数据行 trx_id 和 read view 比较：小于最小活跃事务 ID 说明已提交，可见；大于最大事务 ID 说明是之后才开启的事务修改的，不可见；在中间就看 trx_id 是否在活跃列表里，在说明未提交不可见，不在说明已提交可见。不可见就顺着回滚指针找上个版本。可重复读和读已提交的区别在 read view 生成时机：读已提交每次查询生成新的，可重复读只在第一次查询生成一次。`,
    keyPoints: [
      { id: 'kp1', label: 'MVCC 实现读写不加锁，读写不冲突', weight: 15 },
      { id: 'kp2', label: '隐藏字段 trx_id 和 roll_pointer', weight: 20 },
      { id: 'kp3', label: 'undo log 保存历史版本链', weight: 20 },
      { id: 'kp4', label: 'read view 包含活跃事务列表、最小/最大事务 ID', weight: 20 },
      { id: 'kp5', label: '读已提交每次查询生成 read view，可重复读只生成一次', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'MVCC 通过 undo log 保存数据历史版本', correct: true },
      { id: 'c2', text: '可重复读每次查询都生成新的 read view', correct: false, explain: '可重复读只在第一次查询生成一次' },
      { id: 'c3', text: 'MVCC 需要给读操作加锁', correct: false, explain: 'MVCC 实现读写不加锁' },
      { id: 'c4', text: 'roll_pointer 指向下一个版本', correct: false, explain: '指向上一个版本' }
    ],
    tags: ['MySQL', 'MVCC', '事务'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-05', floorId: 'floor-3', order: 5,
    title: 'MySQL 的行锁和表锁分别在什么情况下触发？死锁怎么排查和解决？',
    interviewerLine: '行锁和表锁什么时候触发？死锁怎么排查？',
    standardAnswer: `InnoDB 默认行锁，但行锁加在索引上，查询没用到索引就升级成表锁。表锁情况：查询条件没走索引全表扫描时锁全表；DDL 如 alter table、drop table 加表锁；lock table 命令。行锁：查询条件用到唯一索引或普通索引，给对应索引行加行锁；唯一索引等值查询命中记录是行锁，没命中加间隙锁；范围查询除行锁还加间隙锁防幻读。

死锁：两个事务互相持有对方需要的锁都不释放。排查用 show engine innodb status 查看死锁日志，显示哪个事务、哪条 SQL 导致死锁、锁类型。也可开启死锁日志记录到错误日志。解决从根源避免：① 所有事务按相同顺序访问资源；② 优化 SQL 和索引减少锁范围；③ 用短事务减少锁持有时间；④ 避免长事务。InnoDB 有死锁检测，会自动回滚代价小的事务。`,
    keyPoints: [
      { id: 'kp1', label: '行锁加在索引上，没走索引会升级成表锁', weight: 20 },
      { id: 'kp2', label: '表锁：全表扫描、DDL、lock table', weight: 15 },
      { id: 'kp3', label: '唯一索引等值查询命中是行锁，没命中加间隙锁', weight: 20 },
      { id: 'kp4', label: '排查：show engine innodb status 看死锁日志', weight: 20 },
      { id: 'kp5', label: '解决：相同顺序访问、优化索引、短事务、避免长事务', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '行锁是加在索引上的，没走索引会升级为表锁', correct: true },
      { id: 'c2', text: '唯一索引等值查询没命中记录时不会加锁', correct: false, explain: '没命中会加间隙锁' },
      { id: 'c3', text: '死锁只能用 show engine innodb status 排查', correct: false, explain: '也可开启死锁日志' },
      { id: 'c4', text: '长事务有助于减少死锁', correct: false, explain: '长事务持有锁时间长，容易死锁' }
    ],
    tags: ['MySQL', '锁', '死锁'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-06', floorId: 'floor-3', order: 6,
    title: 'Redis 的 5 种基本数据结构是什么？分别说一下你项目里的使用场景。',
    interviewerLine: 'Redis 5 种基本结构说一下，项目里用在哪？',
    standardAnswer: `5 种：String、List、Set、Hash、ZSet。① String：最基础，value 可以是字符串、数字、二进制，最大 512M。项目用来存用户 token、验证码、计数器（浏览量、点赞数），分布式锁也用 String 实现。② List：双向链表，有序可重复，两端插入删除。用来做简单消息队列、用户浏览历史。③ Set：无序不可重复，支持交并差。用来做标签系统、共同好友、点赞关注去重。④ Hash：键值对集合，适合存对象，字段可单独更新。用来存用户基本信息、商品详情。⑤ ZSet：有序不可重复，每个元素有 score 分值。用来做课程排行榜、热门课程排名、延时任务。`,
    keyPoints: [
      { id: 'kp1', label: 'String：token、验证码、计数器、分布式锁', weight: 20 },
      { id: 'kp2', label: 'List：消息队列、浏览历史', weight: 15 },
      { id: 'kp3', label: 'Set：标签、共同好友、点赞去重', weight: 20 },
      { id: 'kp4', label: 'Hash：用户信息、商品详情，字段可单独更新', weight: 20 },
      { id: 'kp5', label: 'ZSet：排行榜、延时任务，按 score 排序', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'ZSet 适合做排行榜，按 score 排序', correct: true },
      { id: 'c2', text: 'Set 是有序可重复的集合', correct: false, explain: 'Set 无序不可重复' },
      { id: 'c3', text: 'Hash 适合存对象，字段可单独更新', correct: false },
      { id: 'c4', text: 'List 是无序不可重复的集合', correct: false, explain: 'List 有序可重复' }
    ],
    tags: ['Redis', '数据结构'], difficulty: 1, isBoss: false
  },
  {
    id: 'db-07', floorId: 'floor-3', order: 7,
    title: '你用 Redis ZSet 实现排行榜，ZSet 的底层结构是什么？怎么处理同分排名的问题？',
    interviewerLine: 'ZSet 底层是什么？同分排名怎么处理？',
    standardAnswer: `ZSet 底层由跳表和哈希表共同实现：哈希表存元素和 score 的映射，O(1) 查到元素分值；跳表实现按分值排序，查找、插入、删除都是 O(logn)。元素少时用压缩列表节省空间，元素多了自动转跳表。

同分排名处理：默认 ZSet 按字典序排序，但业务上一般同分同名次或按时间先后。同分同名次：查询时先拿当前元素分数，统计分数大于等于这个分数的元素个数就是排名，比如两人都是 90 分都是第 2 名，下一个 85 分是第 4 名，跳跃式排名。同分按时间：把时间戳拼到 score 里，分数是整数部分，时间戳是小数部分，分数高的排前面，分数相同时间早的小数部分小排前面。拼接时注意时间戳精度，避免影响分数比较。`,
    keyPoints: [
      { id: 'kp1', label: '底层：跳表 + 哈希表', weight: 20 },
      { id: 'kp2', label: '哈希表 O(1) 查 score，跳表 O(logn) 排序', weight: 20 },
      { id: 'kp3', label: '元素少用压缩列表，多了转跳表', weight: 15 },
      { id: 'kp4', label: '同分同名次：统计分数≥当前分数的元素个数', weight: 25 },
      { id: 'kp5', label: '同分按时间：score 整数部分分数，小数部分时间戳', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'ZSet 底层由跳表和哈希表共同实现', correct: true },
      { id: 'c2', text: 'ZSet 底层只用红黑树', correct: false, explain: '是跳表 + 哈希表' },
      { id: 'c3', text: '同分按时间排序可把时间戳拼到 score 的小数部分', correct: false },
      { id: 'c4', text: 'ZSet 元素少时用跳表，元素多了转压缩列表', correct: false, explain: '反了' }
    ],
    tags: ['Redis', 'ZSet', '跳表'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-08', floorId: 'floor-3', order: 8,
    title: '什么是缓存穿透、缓存击穿、缓存雪崩？分别怎么解决？你项目里用了哪些方案？',
    interviewerLine: '缓存穿透、击穿、雪崩说一下，怎么解决？',
    standardAnswer: `缓存穿透：查询数据库和缓存都不存在的数据，请求每次都打到数据库，如恶意攻击用不存在 ID 频繁查询。方案：① 布隆过滤器，存在的 ID 存进去，查询先过滤；② 缓存空值，不存在的数据也缓存空值设短过期时间。项目用缓存空值，实现简单。

缓存击穿：热点 key 在缓存过期瞬间大量请求没命中直接打到数据库。方案：① 热点数据永不过期，后台异步更新；② 加互斥锁，缓存失效时只有一个请求拿锁查数据库更新缓存。项目对热点课程详情用互斥锁。

缓存雪崩：大量 key 同一时间集体过期或 Redis 宕机，大量请求打到数据库。方案：① 过期时间加随机值打散；② 缓存集群保证高可用；③ 服务降级和限流。项目给缓存过期时间加随机偏移，用 Sentinel 限流降级。`,
    keyPoints: [
      { id: 'kp1', label: '穿透：查不存在数据，方案布隆过滤器/缓存空值', weight: 20 },
      { id: 'kp2', label: '击穿：热点 key 过期，方案永不过期/互斥锁', weight: 20 },
      { id: 'kp3', label: '雪崩：大量 key 同时过期或 Redis 宕机', weight: 20 },
      { id: 'kp4', label: '雪崩方案：过期时间加随机值、集群、降级限流', weight: 20 },
      { id: 'kp5', label: '项目方案：缓存空值、互斥锁、随机过期、Sentinel 限流', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '缓存穿透可用布隆过滤器或缓存空值解决', correct: true },
      { id: 'c2', text: '缓存击穿是大量 key 同时过期导致的', correct: false, explain: '那是缓存雪崩' },
      { id: 'c3', text: '缓存雪崩可给过期时间加随机值打散', correct: false },
      { id: 'c4', text: '缓存击穿适合用布隆过滤器解决', correct: false, explain: '布隆过滤器用于穿透' }
    ],
    tags: ['Redis', '缓存穿透', '缓存雪崩'], difficulty: 2, isBoss: false
  },
  {
    id: 'db-09', floorId: 'floor-3', order: 9,
    title: '缓存和数据库的一致性怎么保证？你项目里用了什么更新策略？',
    interviewerLine: '缓存和数据库一致性怎么保证？你项目用什么策略？',
    standardAnswer: `常见更新策略四种：先更数据库再删缓存、先删缓存再更数据库、先更数据库再更缓存、先更缓存再更数据库。最推荐先更新数据库再删除缓存（Cache Aside 旁路缓存模式）。因为更新缓存并发下容易脏数据，删除更简单，下次查询再从数据库加载。但有极端并发问题：读请求缓存失效去查数据库，写请求更新数据库删缓存，读请求把旧数据写回缓存，出现脏数据。概率低，因为数据库更新一般比缓存写入快，且缓存有过期时间兜底。要求更高一致性可用延迟双删：更新数据库后先删一次缓存，延迟几百毫秒再删一次。

项目用 Cache Aside：读先读缓存，没有读数据库写入缓存；写先更新数据库再删缓存。一致性要求高的场景如库存、订单状态加延迟双删，设合理过期时间兜底。更新和删除缓存失败通过 MQ 异步重试保证最终一致性。`,
    keyPoints: [
      { id: 'kp1', label: '推荐策略：先更新数据库，再删除缓存', weight: 25 },
      { id: 'kp2', label: '删除比更新缓存更简单可靠', weight: 15 },
      { id: 'kp3', label: '极端并发问题：读请求把旧数据写回缓存', weight: 20 },
      { id: 'kp4', label: '延迟双删：更新数据库后先删，延迟再删一次', weight: 20 },
      { id: 'kp5', label: '项目用 Cache Aside + 延迟双删 + MQ 异步重试', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '推荐先更新数据库再删除缓存', correct: true },
      { id: 'c2', text: '先删缓存再更数据库是最佳策略', correct: false, explain: '并发下容易脏数据' },
      { id: 'c3', text: '延迟双删是为了解决并发读写导致的脏数据', correct: false },
      { id: 'c4', text: '缓存和数据库强一致很容易实现', correct: false, explain: '只能保证最终一致' }
    ],
    tags: ['Redis', '缓存一致性', 'CacheAside'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-10', floorId: 'floor-3', order: 10,
    title: '分布式锁有哪些实现方式？Redisson 分布式锁的原理是什么？怎么解决锁过期和续期问题？',
    interviewerLine: '分布式锁有哪些实现？Redisson 原理是什么？锁续期怎么解决？',
    standardAnswer: `三种实现：① 数据库：加唯一索引或悲观锁，简单但性能差，适合低并发；② ZooKeeper：基于临时节点，可靠性高但性能一般；③ Redis：性能好，高并发场景用得最多，Redisson 是最成熟的实现。

Redisson 原理：底层用 Lua 脚本保证加锁、设置过期时间的原子性。加锁时先判断锁 key 是否存在，不存在就设置锁并记录线程标识、设过期时间返回成功；已存在就判断是不是当前线程加的，是就把重入次数加 1 实现可重入；不是就加锁失败。释放锁也用 Lua，判断是当前线程的锁就把重入次数减 1，减到 0 删除锁 key。

锁过期：Redisson 用看门狗机制。加锁没指定过期时间默认 30 秒，开启看门狗线程每 10 秒检查，当前线程还持有锁就重新续成 30 秒，业务没执行完锁不会过期，避免业务没做完锁被释放。业务执行完或服务宕机看门狗停了，锁到时间自动释放，不会死锁。`,
    keyPoints: [
      { id: 'kp1', label: '三种实现：数据库、ZooKeeper、Redis', weight: 15 },
      { id: 'kp2', label: 'Redisson 用 Lua 脚本保证加锁原子性', weight: 20 },
      { id: 'kp3', label: '可重入：判断是当前线程就把重入次数加 1', weight: 20 },
      { id: 'kp4', label: '看门狗机制：默认 30 秒，每 10 秒续期', weight: 25 },
      { id: 'kp5', label: '业务执行完或宕机，看门狗停止，锁自动释放', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Redisson 用 Lua 脚本保证加锁和设过期的原子性', correct: true },
      { id: 'c2', text: 'Redisson 看门狗默认每 30 秒续期一次', correct: false, explain: '默认 30 秒过期，每 10 秒续期一次' },
      { id: 'c3', text: 'ZooKeeper 分布式锁性能比 Redis 好', correct: false, explain: 'ZooKeeper 可靠性高但性能一般' },
      { id: 'c4', text: 'Redisson 不支持可重入锁', correct: false, explain: '它支持可重入' }
    ],
    tags: ['Redis', '分布式锁', 'Redisson'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-11', floorId: 'floor-3', order: 11,
    title: '你用 Redis BitMap 实现签到功能，BitMap 的原理是什么？内存占用比 String 降低 90% 是怎么测算的？',
    interviewerLine: 'BitMap 原理说一下，内存降低 90% 怎么算的？',
    standardAnswer: `BitMap 即位图，底层本质还是 String，但按位存储，每位只能是 0 或 1，0 代表未签到，1 代表已签到。Redis String 最大 512M 即 2^32 位，可存 40 多亿位。存储用户一天签到，用用户 ID 当偏移量，一天一个 key，第 N 个用户签到就把第 N 位设为 1。100 万用户签到一天只需 100 万 bit 约 125KB，非常省空间。

降低 90% 测算：传统 String 每个用户存一条签到记录，key 是用户 ID+日期，value 是 1，一个 key-value 约几十字节，按 50 字节算，100 万用户约 50MB。BitMap 100 万位 = 1000000/8/1024 ≈ 122KB，和 50MB 比只有 0.2% 左右，远低于 90% 降低比例。即使算上 key 本身内存也能省 90% 以上。且 BitMap 支持位运算，统计连续签到、签到人数速度极快。`,
    keyPoints: [
      { id: 'kp1', label: 'BitMap 底层是 String，按位存储，0/1 表示未签/已签', weight: 20 },
      { id: 'kp2', label: '用户 ID 当偏移量，一天一个 key', weight: 20 },
      { id: 'kp3', label: '100 万用户一天约 125KB', weight: 20 },
      { id: 'kp4', label: 'String 方案 100 万用户约 50MB，BitMap 约 122KB', weight: 25 },
      { id: 'kp5', label: 'BitMap 支持位运算，统计连续签到速度极快', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'BitMap 底层本质是 String 类型，按位存储', correct: true },
      { id: 'c2', text: 'BitMap 每个用户需要存一个完整的字符串', correct: false, explain: '按位存储，极省空间' },
      { id: 'c3', text: '100 万用户一天签到 BitMap 约 125KB', correct: false },
      { id: 'c4', text: 'BitMap 不支持统计连续签到', correct: false, explain: '支持位运算，统计很快' }
    ],
    tags: ['Redis', 'BitMap', '签到'], difficulty: 3, isBoss: false
  },
  {
    id: 'db-12', floorId: 'floor-3', order: 12,
    title: '你做了 Caffeine 本地缓存 + Redis 二级缓存，为什么要设计二级缓存？各自的作用是什么？',
    interviewerLine: '为什么设计二级缓存？Caffeine 和 Redis 各自作用是什么？',
    standardAnswer: `设计二级缓存是为兼顾性能和数据一致性，同时减轻 Redis 压力。一级 Caffeine 本地缓存是 JVM 内部缓存，优点是速度极快，内存级访问无网络开销，性能比 Redis 高很多；缺点是不能跨服务共享，每个实例有自己的本地缓存，一致性差，受 JVM 内存限制。二级 Redis 分布式缓存优点是跨服务共享，一致性相对好，容量大；缺点是有网络开销，高并发下 Redis 压力大。

工作流程：查询先查 Caffeine，命中直接返回；没命中查 Redis，命中就写本地缓存再返回；Redis 也没命中查数据库，依次写入 Redis 和本地缓存再返回。更新数据先更新数据库，删 Redis 缓存，同时通过 MQ 广播通知所有实例删本地缓存，保证各实例本地缓存失效避免脏数据。热点数据在本地缓存访问最快，大量请求不打到 Redis，减轻 Redis 压力；Redis 作为二级缓存保证共享和相对一致性。`,
    keyPoints: [
      { id: 'kp1', label: '一级 Caffeine：JVM 本地缓存，速度极快无网络开销', weight: 20 },
      { id: 'kp2', label: '一级缺点：不能跨服务共享，一致性差', weight: 15 },
      { id: 'kp3', label: '二级 Redis：跨服务共享，容量大，有一致性优势', weight: 20 },
      { id: 'kp4', label: '查询顺序：Caffeine → Redis → 数据库', weight: 20 },
      { id: 'kp5', label: '更新：更数据库 + 删 Redis + MQ 广播删本地缓存', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'Caffeine 本地缓存速度比 Redis 快，但一致性差', correct: true },
      { id: 'c2', text: '查询顺序应该是 Redis → Caffeine → 数据库', correct: false, explain: '先查本地 Caffeine' },
      { id: 'c3', text: '更新数据时需要 MQ 广播通知所有实例删本地缓存', correct: false },
      { id: 'c4', text: '二级缓存设计会加重 Redis 压力', correct: false, explain: '本地缓存挡住了大量请求，减轻 Redis 压力' }
    ],
    tags: ['Redis', 'Caffeine', '多级缓存'], difficulty: 3, isBoss: true
  },
  {
    id: 'ai-01', floorId: 'floor-4', order: 1,
    title: '什么是 RAG 检索增强生成？为什么选择 RAG 而不是大模型微调？两者有什么区别？',
    interviewerLine: 'RAG 是什么？为什么不用微调？两者区别在哪？',
    standardAnswer: `RAG 即检索增强生成，结合信息检索和大语言模型生成。用户提问时先去知识库检索相关文档片段，把检索内容和问题整理成提示词传给大模型，大模型基于检索内容生成答案，回答基于私有数据，准确可靠，减少幻觉。

选择 RAG 而非微调：① 成本低：微调需大量标注数据和算力，RAG 只需文档向量化，开发运维成本低；② 时效好：知识库更新只需新文档切片向量化存向量库，实时生效，微调要重新训练周期长；③ 数据安全：私有数据存自己向量库，不用传给大模型训练；④ 可解释性强：答案可溯源到文档片段，微调是黑盒。

本质区别：RAG 是"外挂知识库"，大模型本身没变，只是给它提供外部参考资料；微调是"调整模型本身"，通过训练数据改变模型参数。RAG 适合知识更新快、数据量大、需准确回答的场景；微调适合风格对齐、特定任务优化。`,
    keyPoints: [
      { id: 'kp1', label: 'RAG：检索相关文档 + 问题组装 Prompt 传给大模型', weight: 20 },
      { id: 'kp2', label: '成本低：RAG 只需向量化，微调需标注和算力', weight: 20 },
      { id: 'kp3', label: '时效好：RAG 更新知识库实时生效，微调要重训', weight: 20 },
      { id: 'kp4', label: '数据安全：RAG 私有数据不外传', weight: 15 },
      { id: 'kp5', label: '本质区别：RAG 外挂知识库，微调改模型参数', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'RAG 是外挂知识库，不改变大模型本身', correct: true },
      { id: 'c2', text: 'RAG 需要大量标注数据训练模型', correct: false, explain: 'RAG 不需要训练' },
      { id: 'c3', text: '微调的时效性比 RAG 好', correct: false, explain: 'RAG 更新知识库实时生效，微调要重训' },
      { id: 'c4', text: 'RAG 生成的答案无法溯源', correct: false, explain: 'RAG 可溯源到文档片段' }
    ],
    tags: ['RAG', '大模型', '微调'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-02', floorId: 'floor-4', order: 2,
    title: '完整描述 RAG 的全流程，从用户提问到返回答案分为哪几个核心步骤？',
    interviewerLine: 'RAG 全流程说一下，从提问到返回答案几步？',
    standardAnswer: `RAG 分离线处理和在线查询两阶段。离线处理（知识库构建）四步：① 文档加载：PDF、Word、Markdown、网页等解析成纯文本；② 文档切片：长文本切成固定大小 Chunk，几百到上千字符，设重叠避免切断上下文；③ 向量嵌入：调 Embedding 模型把每个 Chunk 转成向量；④ 向量存储：Chunk 和向量一起存向量数据库建索引。

在线查询五步：① 用户输入问题，调 Embedding 模型转成向量；② 向量检索：用问题向量去向量库做相似度匹配，找 Top N 最相关 Chunk；③ 重排序 Rerank：用重排序模型对检索结果二次排序，筛出最相关几个；④ Prompt 组装：问题和相关文档片段按模板组装，加指令约束如"只根据以下内容回答"；⑤ 大模型生成：把 Prompt 传给大模型，生成答案返回用户。流式输出就是一个字一个字返回。`,
    keyPoints: [
      { id: 'kp1', label: '离线四步：文档加载 → 切片 → 向量嵌入 → 向量存储', weight: 30 },
      { id: 'kp2', label: '在线五步：问题向量化 → 向量检索 → Rerank → Prompt 组装 → 生成', weight: 35 },
      { id: 'kp3', label: '切片要设重叠避免上下文切断', weight: 15 },
      { id: 'kp4', label: 'Rerank 对检索结果二次精准排序', weight: 10 },
      { id: 'kp5', label: 'Prompt 加指令约束减少幻觉', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'RAG 离线阶段包括文档加载、切片、向量嵌入、向量存储', correct: true },
      { id: 'c2', text: 'RAG 在线查询第一步是直接调大模型生成答案', correct: false, explain: '先把问题向量化' },
      { id: 'c3', text: 'Rerank 是对检索结果二次排序，提升相关性', correct: false },
      { id: 'c4', text: '文档切片不需要设置重叠', correct: false, explain: '要设重叠避免上下文切断' }
    ],
    tags: ['RAG', '向量检索', 'Rerank'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-03', floorId: 'floor-4', order: 3,
    title: '什么是 Function Calling（函数调用）？底层原理是什么？',
    interviewerLine: 'Function Calling 是什么？底层原理说一下。',
    standardAnswer: `Function Calling 是大模型的能力：大模型根据用户问题自动判断需要调用哪个外部工具函数，生成符合格式的参数，我们拿参数调实际业务接口，结果返回给大模型，大模型根据结果回答用户。相当于给大模型装上"手脚"，它不用自己知道所有数据，可通过调用业务接口获取实时数据、执行业务操作，解决大模型知识过时、不能和外部系统交互的问题。

底层原理：① 把系统可调用的函数信息（函数名、功能描述、参数名、参数类型、参数描述）按大模型要求格式传给它；② 用户提问时大模型判断是否需调函数，需要就按指定 JSON 格式输出要调用的函数名和参数，不直接回答；③ 我们拿到函数调用信息后解析出函数名和参数，执行对应业务函数，拿到结果；④ 把结果和对话历史一起发给大模型，大模型根据结果生成自然语言回答。本质上大模型没真的调函数，只是识别该调哪个函数、生成正确参数格式，真正执行是业务代码做的。`,
    keyPoints: [
      { id: 'kp1', label: '大模型判断该调哪个函数，生成参数格式', weight: 25 },
      { id: 'kp2', label: '相当于给大模型装"手脚"，可调业务接口', weight: 15 },
      { id: 'kp3', label: '把函数名、描述、参数格式传给大模型', weight: 20 },
      { id: 'kp4', label: '大模型输出 JSON 格式的函数名和参数', weight: 20 },
      { id: 'kp5', label: '真正执行函数是业务代码，大模型没真的调', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Function Calling 中真正执行函数的是业务代码', correct: true },
      { id: 'c2', text: '大模型会直接执行函数并拿到结果', correct: false, explain: '大模型只生成调用指令，执行是业务代码' },
      { id: 'c3', text: '需要把函数名、描述、参数格式传给大模型', correct: false },
      { id: 'c4', text: 'Function Calling 不能解决大模型知识过时问题', correct: false, explain: '它可获取实时数据' }
    ],
    tags: ['FunctionCalling', '大模型', 'Agent'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-04', floorId: 'floor-4', order: 4,
    title: '什么是 Embedding 向量？向量数据库的作用是什么？',
    interviewerLine: 'Embedding 向量是什么？向量数据库有什么用？',
    standardAnswer: `Embedding 向量即嵌入向量，把文本、图片、音频等非结构化数据转换成计算机可处理的低维稠密数值向量，一串浮点数。向量代表原始数据语义信息，语义越相近的内容向量在空间里距离越近，相似度越高。比如"苹果手机"和"iPhone"字面不一样但语义相近，向量相似度很高；"苹果手机"和"苹果水果"字面像但语义不同，向量相似度低。

向量数据库作用：专门存储和管理向量数据。和传统数据库不同，传统是精确匹配，向量库做相似度检索。作用：① 存储向量和对应原始文本、元数据；② 高效相似度检索，支持百万亿级向量，快速找 Top N 最相似向量，是 RAG 核心基础；③ 支持 HNSW、IVF 等索引算法优化检索速度；④ 支持元数据过滤，按条件缩小检索范围。简单说向量数据库是 RAG 的"知识库仓库"，负责存知识、找相关知识。`,
    keyPoints: [
      { id: 'kp1', label: 'Embedding 把非结构化数据转成低维稠密向量', weight: 20 },
      { id: 'kp2', label: '语义越相近，向量空间距离越近', weight: 20 },
      { id: 'kp3', label: '向量数据库做相似度检索，不是精确匹配', weight: 20 },
      { id: 'kp4', label: '支持 HNSW、IVF 等索引算法', weight: 20 },
      { id: 'kp5', label: '支持元数据过滤，缩小检索范围', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Embedding 把文本转成低维稠密向量，代表语义', correct: true },
      { id: 'c2', text: '向量数据库做精确匹配查询', correct: false, explain: '向量库做相似度检索' },
      { id: 'c3', text: '语义相近的内容向量空间距离更近', correct: false },
      { id: 'c4', text: '向量数据库不支持元数据过滤', correct: false, explain: '支持元数据过滤' }
    ],
    tags: ['Embedding', '向量数据库', 'RAG'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-05', floorId: 'floor-4', order: 5,
    title: 'SSE 流式输出是什么？和 WebSocket 相比有什么区别和优势？',
    interviewerLine: 'SSE 是什么？和 WebSocket 比有什么区别和优势？',
    standardAnswer: `SSE 即 Server-Sent Events，服务器推送事件，基于 HTTP 的单向通信技术，服务器可主动向客户端推送数据。AI 对话场景中大模型逐字生成答案，用 SSE 生成一个字就推给前端一个字，用户边看边生成，不用等全部生成完，体验更好。

和 WebSocket 区别：① 通信方向：SSE 单向，只服务器推客户端，客户端只发一次请求；WebSocket 全双工双向；② 协议：SSE 基于 HTTP 长连接，不需协议升级，兼容性好；WebSocket 是独立 WS 协议，需握手升级；③ 功能：SSE 天生支持断线重连，支持事件类型，使用简单；WebSocket 功能强但断线重连、心跳要自己实现；④ 资源：SSE 更轻量，服务器资源消耗小；WebSocket 更重，并发连接多了压力大。

AI 对话场景 SSE 更有优势，因为主要是服务器向客户端推生成内容，客户端不需频繁发消息，SSE 完全够用，实现简单兼容性好，自带断线重连。`,
    keyPoints: [
      { id: 'kp1', label: 'SSE 基于 HTTP 的单向通信，服务器推客户端', weight: 20 },
      { id: 'kp2', label: 'AI 对话逐字推送，边生成边显示', weight: 20 },
      { id: 'kp3', label: 'WebSocket 是全双工双向通信，SSE 单向', weight: 20 },
      { id: 'kp4', label: 'SSE 基于 HTTP，WebSocket 是独立 WS 协议', weight: 20 },
      { id: 'kp5', label: 'SSE 更轻量，自带断线重连，AI 场景更有优势', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'SSE 基于 HTTP 协议，单向通信', correct: true },
      { id: 'c2', text: 'WebSocket 比 SSE 更轻量', correct: false, explain: 'SSE 更轻量' },
      { id: 'c3', text: 'SSE 天生支持断线重连', correct: false },
      { id: 'c4', text: 'AI 对话场景 WebSocket 比 SSE 更合适', correct: false, explain: 'SSE 更适合' }
    ],
    tags: ['SSE', 'WebSocket', '流式输出'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-06', floorId: 'floor-4', order: 6,
    title: 'LangChain4j 和 Spring AI 你都使用过，说一下两者的区别和你的选型理由。',
    interviewerLine: 'LangChain4j 和 Spring AI 有什么区别？你怎么选型？',
    standardAnswer: `LangChain4j 是 Java 版 LangChain，专门做 LLM 应用开发，功能全面，覆盖 RAG、Agent、工具调用、记忆、Prompt 模板等完整能力，生态丰富，支持各种大模型、向量数据库、Embedding 模型，组件多，可定制化程度高。Spring AI 是 Spring 官方推出的 AI 框架，优势是和 Spring 生态无缝集成，和 Spring Boot、Spring Cloud 完美整合，配置和编程风格都是 Spring 风格，Java 开发者上手快，提供统一抽象，切换大模型不用改代码。但功能相对 LangChain4j 少，高级功能不如它丰富。

选型根据项目复杂度和技术栈：智汇 AI 餐饮 SaaS 是 Spring Boot 单体架构，功能相对简单，主要智能客服和 RAG 问答，用 Spring AI，和 Spring 技术栈契合，接入快学习成本低。云观 AI 在线教育是微服务架构，AI 功能复杂，有智能推荐、智能答疑、课程大纲生成，需要更灵活的 RAG 编排、复杂工具调用链，选 LangChain4j，组件丰富可定制性强。简单说，简单场景、Spring 技术栈选 Spring AI，复杂场景、需高度定制选 LangChain4j。`,
    keyPoints: [
      { id: 'kp1', label: 'LangChain4j 功能全面，RAG/Agent/工具调用/记忆都覆盖', weight: 20 },
      { id: 'kp2', label: 'Spring AI 和 Spring 生态无缝集成，上手快', weight: 20 },
      { id: 'kp3', label: 'Spring AI 提供统一抽象，切换大模型不改代码', weight: 15 },
      { id: 'kp4', label: '餐饮 SaaS 用 Spring AI，单体架构简单场景', weight: 20 },
      { id: 'kp5', label: '教育平台用 LangChain4j，微服务复杂场景需高度定制', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: 'LangChain4j 组件更丰富，可定制化程度更高', correct: true },
      { id: 'c2', text: 'Spring AI 和 Spring 生态无缝集成', correct: false },
      { id: 'c3', text: '简单 Spring 项目应该选 LangChain4j', correct: false, explain: '简单场景选 Spring AI' },
      { id: 'c4', text: 'LangChain4j 不能做 RAG', correct: false, explain: '它覆盖 RAG 等完整能力' }
    ],
    tags: ['LangChain4j', 'SpringAI', '选型'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-07', floorId: 'floor-4', order: 7,
    title: '教育平台里的 AI 智能推荐是怎么实现的？怎么结合用户行为数据和大模型生成个性化推荐理由？',
    interviewerLine: 'AI 智能推荐怎么实现的？怎么结合行为数据和大模型？',
    standardAnswer: `智能课程推荐是协同过滤 + AI 生成结合，分两步：① 召回阶段：用协同过滤初筛。基于用户学习历史、浏览记录、收藏点赞算兴趣标签，用基于用户的协同过滤找兴趣相似用户群体，把他们学过评分高的课程挑出来；再加基于内容的协同过滤，推荐和已学课程相似的课程，两部分合起来得到几十门候选课程池。② 排序和生成推荐理由：用大模型精细化排序和个性化生成。把候选课程信息、用户学习数据、标签偏好、推荐指令模板一起传给大模型，让大模型从候选课中选最适合的几门，结合用户学习情况生成个性化推荐理由。比如用户学了 Java 基础就推荐 Java 进阶，理由写"你已完成 Java 基础，推荐学习 Java 进阶深入并发编程和框架知识"。同时加实时行为反馈，用户点击收藏学习推荐课程会实时更新偏好标签优化下次推荐。协同过滤保证效率和基础相关性，大模型提升精准度和个性化，推荐理由更自然更有说服力。`,
    keyPoints: [
      { id: 'kp1', label: '两阶段：协同过滤召回 + 大模型精排生成', weight: 25 },
      { id: 'kp2', label: '基于用户和基于内容两种协同过滤结合', weight: 20 },
      { id: 'kp3', label: '候选课程信息 + 用户数据 + 指令一起传给大模型', weight: 20 },
      { id: 'kp4', label: '大模型生成个性化推荐理由，结合学习进度', weight: 20 },
      { id: 'kp5', label: '实时行为反馈更新偏好标签优化下次推荐', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '协同过滤做召回，大模型做精排和生成推荐理由', correct: true },
      { id: 'c2', text: '智能推荐只用大模型，不用协同过滤', correct: false, explain: '两者结合' },
      { id: 'c3', text: '实时行为反馈可优化下一次推荐', correct: false },
      { id: 'c4', text: '推荐理由不需要结合用户学习进度', correct: false, explain: '要结合学习进度生成个性化理由' }
    ],
    tags: ['AI推荐', '协同过滤', '大模型'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-08', floorId: 'floor-4', order: 8,
    title: '餐饮项目里的智能客服"小慧"，怎么通过 Function Calling 调用订单查询、取消等业务接口？',
    interviewerLine: '智能客服怎么通过 Function Calling 调订单接口？',
    standardAnswer: `实现流程：① 把系统可开放给客服调用的业务接口封装成符合大模型要求的函数，如查询订单、取消订单、查询优惠券、推荐菜品，每个函数定义函数名、功能描述、参数名、参数类型、参数描述。比如查询订单函数参数是订单号，描述是"根据订单号查询用户订单详情"。② 用户提问时，如"帮我查一下我昨天的订单"，大模型判断需调查询订单函数，生成函数调用指令包含函数名和参数（订单时间是昨天）。③ 业务代码拿到函数调用结果，解析参数，调实际订单查询接口，拿到订单数据。④ 把订单数据和用户问题、对话历史一起再传给大模型，大模型根据订单数据用自然语言整理成通顺回答返回用户，如"你昨天 18:30 有一笔订单，点了麻辣香锅和米饭，一共 38 元，状态已完成"。取消订单这种操作还会加一层确认，大模型先和用户确认是否取消，用户确认后再调取消订单函数执行，最后反馈结果。整个过程用户只需自然语言对话，不用自己找功能入口，体验更好，也减轻人工客服压力。`,
    keyPoints: [
      { id: 'kp1', label: '把业务接口封装成函数，定义函数名、描述、参数', weight: 20 },
      { id: 'kp2', label: '大模型判断需调哪个函数，生成参数', weight: 20 },
      { id: 'kp3', label: '业务代码解析参数，调实际业务接口', weight: 20 },
      { id: 'kp4', label: '订单数据 + 对话历史再传给大模型生成自然语言回答', weight: 20 },
      { id: 'kp5', label: '取消订单等操作加用户确认，防误操作', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '大模型生成函数调用指令，业务代码执行实际接口', correct: true },
      { id: 'c2', text: '大模型直接执行订单查询接口', correct: false, explain: '大模型只生成指令，业务代码执行' },
      { id: 'c3', text: '取消订单等敏感操作应加用户确认', correct: false },
      { id: 'c4', text: '函数不需要定义参数类型和描述', correct: false, explain: '要定义完整函数信息' }
    ],
    tags: ['FunctionCalling', '智能客服', '餐饮SaaS'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-09', floorId: 'floor-4', order: 9,
    title: '你项目里 RAG 做了哪些优化？怎么提升召回的准确率和相关性？',
    interviewerLine: 'RAG 做了哪些优化？怎么提升召回准确率？',
    standardAnswer: `从检索前、中、后三阶段优化。检索前（知识库优化）：① 按语义块切片，按标题段落拆分，保证 Chunk 语义完整，设 20% 重叠率避免上下文断裂；② 给文档块加元数据如课程分类、文档类型、更新时间，方便过滤检索；③ 选中文效果好的 Embedding 模型，提升向量语义表达。

检索中：① 多路召回，向量相似度 + 关键词 BM25 检索融合，兼顾语义和关键词匹配，解决专业术语召回不准；② 元数据过滤，问 Java 课程问题只检索 Java 分类文档，缩小范围；③ 调整 TopN 数量，平衡召回率和准确率。

检索后：① Rerank 重排序，用专门重排序模型二次排序，比向量相似度更精准，只取 Top3 给大模型；② 内容去重精简，去重复无关内容；③ 优化 Prompt 模板，明确告诉大模型只根据参考内容回答，减少幻觉。经优化后准确率提升很多，答非所问明显减少。`,
    keyPoints: [
      { id: 'kp1', label: '检索前：语义切片 + 20% 重叠 + 元数据 + 好 Embedding 模型', weight: 25 },
      { id: 'kp2', label: '检索中：向量 + BM25 多路召回', weight: 20 },
      { id: 'kp3', label: '检索中：元数据过滤 + 调整 TopN', weight: 15 },
      { id: 'kp4', label: '检索后：Rerank 二次排序，只取 Top3', weight: 25 },
      { id: 'kp5', label: '检索后：Prompt 约束只根据参考内容回答', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '多路召回结合向量检索和 BM25 关键词检索', correct: true },
      { id: 'c2', text: 'Rerank 是在向量检索之前做的', correct: false, explain: 'Rerank 是检索后二次排序' },
      { id: 'c3', text: '文档切片设置重叠率可避免上下文断裂', correct: false },
      { id: 'c4', text: '给大模型的参考内容越多越好', correct: false, explain: '太多无关内容会干扰，只取 Top3' }
    ],
    tags: ['RAG', '召回优化', 'Rerank'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-10', floorId: 'floor-4', order: 10,
    title: '你说智能客服首字响应 < 350ms，做了哪些优化来降低延迟？',
    interviewerLine: '首字响应 <350ms 怎么做到的？做了哪些优化？',
    standardAnswer: `首字响应是从用户发完问题到收到第一个字的时间，从五方面优化：① 流式输出：用 SSE，大模型生成第一个 token 就立刻推给前端，不用等全部生成完，这是最核心优化，把等待从几秒降到几百毫秒。② 检索阶段：优化向量数据库索引用 HNSW 提升检索速度；控制检索数量减少耗时；热点问题和答案做缓存，常见问题直接返回不走 RAG 全流程。③ Prompt 优化：精简 Prompt 长度，去掉不必要指令和冗余，减少大模型处理 token 数；参考内容精简只留核心信息，缩短处理时间。④ 网络和模型：选和服务器同区域的大模型接口减少网络延迟；用速度更快的轻量版模型；连接池优化复用 HTTP 连接减少建连时间。⑤ 前端：做打字机效果，收到字符立刻渲染，不用等整句。经优化简单问题首字响应 200 多毫秒，复杂问题也能控制在 350ms 内。`,
    keyPoints: [
      { id: 'kp1', label: 'SSE 流式输出，第一个 token 就推给前端（最核心）', weight: 25 },
      { id: 'kp2', label: '向量库 HNSW 索引 + 控制检索数量', weight: 20 },
      { id: 'kp3', label: '热点问题答案缓存，不走 RAG 全流程', weight: 15 },
      { id: 'kp4', label: '精简 Prompt 和参考内容，减少 token', weight: 20 },
      { id: 'kp5', label: '同区域大模型接口 + 轻量模型 + 连接池优化', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'SSE 流式输出是降低首字响应最核心的优化', correct: true },
      { id: 'c2', text: '把所有参考内容都传给大模型能降低延迟', correct: false, explain: '要精简参考内容减少 token' },
      { id: 'c3', text: '热点问题答案缓存可不走 RAG 全流程', correct: false },
      { id: 'c4', text: '选择跨区域的大模型接口能降低延迟', correct: false, explain: '要选同区域减少网络延迟' }
    ],
    tags: ['AI性能优化', 'SSE', '延迟优化'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-11', floorId: 'floor-4', order: 11,
    title: 'Prompt 工程你做了哪些优化？怎么约束大模型返回的内容符合业务规范？',
    interviewerLine: 'Prompt 工程做了哪些优化？怎么约束大模型输出？',
    standardAnswer: `六方面优化：① 明确角色设定（System Prompt）：给大模型清晰身份，如"你是餐饮平台智能客服小慧，语气亲切专业，只回答和餐饮、订单、菜品相关的问题"。② 明确指令约束：一条条列清楚，如"必须只根据提供的参考内容回答，参考内容没有就说抱歉无法解答，不要编造"；"回答简洁明了，分点说明"；禁止回答无关问题、输出敏感内容。③ 优化参考内容格式：用 <context> 标签包裹检索内容，让大模型清楚哪些是参考资料哪些是问题。④ 输出格式约束：需结构化输出如 JSON 就明确指定字段格式，如"以 JSON 返回包含 code、message、data"。⑤ 少样本示例（Few-shot）：给 1-2 个正确回答例子，大模型照着格式和风格回答，比纯文字描述效果好。⑥ 迭代优化：根据 bad case 不断调整 Prompt，出现幻觉加强"不要编造"，回答太长加强"简洁"，持续调优。通过这些方式保证大模型回答符合业务规范。`,
    keyPoints: [
      { id: 'kp1', label: 'System Prompt 明确角色设定', weight: 15 },
      { id: 'kp2', label: '明确指令约束：只根据参考内容回答、不编造', weight: 20 },
      { id: 'kp3', label: '用标签包裹参考内容，区分资料和问题', weight: 15 },
      { id: 'kp4', label: '输出格式约束，如指定 JSON 字段', weight: 20 },
      { id: 'kp5', label: 'Few-shot 少样本示例引导格式和风格', weight: 15 },
      { id: 'kp6', label: '根据 bad case 迭代优化 Prompt', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'System Prompt 用于设定大模型的角色和基调', correct: true },
      { id: 'c2', text: 'Few-shot 示例比纯文字描述效果差', correct: false, explain: 'Few-shot 效果更好' },
      { id: 'c3', text: '用标签包裹参考内容可避免大模型混淆资料和问题', correct: false },
      { id: 'c4', text: 'Prompt 一次写好就不用再调整', correct: false, explain: '要根据 bad case 持续迭代' }
    ],
    tags: ['Prompt工程', '大模型'], difficulty: 2, isBoss: false
  },
  {
    id: 'ai-12', floorId: 'floor-4', order: 12,
    title: '项目中 AI 功能遇到的最大技术难点是什么？你是怎么解决的？',
    interviewerLine: 'AI 功能最大技术难点是什么？怎么解决的？',
    standardAnswer: `最大难点是 RAG 回答准确率不高，经常答非所问或幻觉，尤其专业课程知识答错影响不好。一开始只是简单向量检索，很多问题召回文档不相关，或大模型不按参考内容回答自己瞎编。分步解决：① 排查召回阶段，发现文档切片有问题，固定长度切片把很多语义切断了，向量相似度对专业术语匹配不好。改成按语义段落切片，优化切片大小和重叠率，加上 BM25 关键词检索做混合召回，解决专业内容召回不准。② 召回结果多了但无关内容也多，大模型容易被干扰。加 Rerank 重排序，二次排序只取最相关前 3 个给大模型，减少干扰。③ 生成阶段优化 Prompt 模板，加明确约束指令和少样本示例，告诉大模型必须严格按参考内容回答，不知道就说不知道，要求回答标注参考来源，减少幻觉也方便溯源。④ 做效果评估，整理标准问题和标准答案，每次优化后测准确率量化效果。经优化准确率从 70% 提升到 90% 以上，幻觉大幅减少。`,
    keyPoints: [
      { id: 'kp1', label: '难点：RAG 准确率不高，答非所问和幻觉', weight: 20 },
      { id: 'kp2', label: '改按语义段落切片，优化大小和重叠率', weight: 20 },
      { id: 'kp3', label: '加 BM25 关键词检索做混合召回', weight: 20 },
      { id: 'kp4', label: '加 Rerank 重排序，只取 Top3 减少干扰', weight: 20 },
      { id: 'kp5', label: '优化 Prompt 约束 + 少样本示例 + 效果评估闭环', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '固定长度切片会切断语义，改按语义段落切片', correct: true },
      { id: 'c2', text: 'Rerank 会增加干扰内容', correct: false, explain: 'Rerank 是减少干扰' },
      { id: 'c3', text: 'BM25 关键词检索可解决专业术语召回不准', correct: false },
      { id: 'c4', text: 'RAG 优化不需要效果评估', correct: false, explain: '要建评估集量化效果' }
    ],
    tags: ['RAG', 'AI难点', '优化'], difficulty: 3, isBoss: false
  },
  {
    id: 'ai-13', floorId: 'floor-4', order: 13,
    title: '如果大模型调用超时或者返回错误，你的系统怎么做降级和容错？',
    interviewerLine: '大模型超时或报错，你怎么降级容错？',
    standardAnswer: `四层降级容错：① 超时重试：设合理超时时间如 10 秒，调用超时或网络异常、服务不可用自动重试 2-3 次，重试间隔递增，解决临时网络波动。注意只有查询类幂等请求才重试，写操作不重试。② 降级方案：重试后还失败走降级。问答类如智能客服返回预设兜底回复"抱歉，当前咨询量较大，请稍后再试或联系人工客服"；推荐类降级成传统协同过滤推荐，不用大模型生成理由，只返回推荐课程，保证核心功能可用。③ 熔断机制：用 Sentinel 做限流熔断，大模型接口错误率或响应时间超阈值就自动熔断，一段时间不再调用直接走降级，避免大量请求卡住拖垮系统，恢复后自动半开探测。④ 限流：控制大模型并发调用量，超阈值就排队或直接降级，保护大模型接口不被打垮，也控制调用成本。另外加监控告警，统计调用量、成功率、响应时间、错误率，异常及时告警。通过这几层保证大模型出问题系统也不崩，核心业务还能运行。`,
    keyPoints: [
      { id: 'kp1', label: '超时重试：查询类幂等请求重试 2-3 次，写操作不重试', weight: 20 },
      { id: 'kp2', label: '降级：问答类返回兜底回复，推荐类降级协同过滤', weight: 25 },
      { id: 'kp3', label: '熔断：Sentinel 错误率/响应时间超阈值自动熔断', weight: 25 },
      { id: 'kp4', label: '限流：控制大模型并发调用量，保护接口和成本', weight: 15 },
      { id: 'kp5', label: '监控告警：统计调用量、成功率、响应时间、错误率', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '写操作也适合配置自动重试', correct: false, explain: '写操作不幂等，不重试' },
      { id: 'c2', text: '推荐类降级可改用传统协同过滤推荐', correct: true },
      { id: 'c3', text: 'Sentinel 熔断后永远不会恢复', correct: false, explain: '恢复后自动半开探测' },
      { id: 'c4', text: '大模型降级不需要监控告警', correct: false, explain: '监控告警很重要' }
    ],
    tags: ['AI容错', '降级', 'Sentinel'], difficulty: 3, isBoss: true
  },
  // ============ 项目一：云观 AI 在线教育微服务平台 ============
  {
    id: 'proj-01', floorId: 'floor-5', order: 1,
    title: '简单介绍一下这个项目的背景和整体架构，你在里面负责哪些核心模块？',
    interviewerLine: '介绍一下云观 AI 教育平台的背景、架构和你负责的模块。',
    standardAnswer: `项目是面向职业教育的在线学习平台，涵盖课程售卖、视频学习、社区互动、AI 辅助学习四大核心功能，目标是给学员提供一站式学习服务，解决传统线上学习效率低、个性化不足的问题。

整体采用前后端分离微服务架构，后端 Spring Boot 3 + Spring Cloud Alibaba，前端 Vue3 + 通义千问。最外层 Spring Cloud Gateway 做统一网关，路由转发、鉴权、限流；注册和配置中心用 Nacos；业务层按领域拆分课程服务、订单服务、用户服务、学习服务、AI 服务五个核心微服务；数据层 MySQL 持久化，Redis 缓存，RabbitMQ 异步解耦，分布式事务 Seata，流量保护 Sentinel。AI 服务单独拆分，统一封装 RAG 检索、智能推荐、智能答疑，供各业务服务调用避免重复建设。

我负责后端微服务设计与开发，主导课程、订单、用户三个核心服务拆分与实现，牵头 AI 学习助手模块全流程开发，包括智能课程推荐、学习进度异步处理、互动模块高并发存储、分布式事务方案设计，还负责整体性能优化如多级缓存设计、接口压测调优，核心写入接口 TPS 提升 3 倍。`,
    keyPoints: [
      { id: 'kp1', label: '职业教育在线学习平台，四大核心功能', weight: 15 },
      { id: 'kp2', label: 'Spring Boot 3 + Spring Cloud Alibaba 微服务架构', weight: 20 },
      { id: 'kp3', label: '五大微服务：课程、订单、用户、学习、AI', weight: 20 },
      { id: 'kp4', label: '技术栈：Nacos、Gateway、Redis、RabbitMQ、Seata、Sentinel', weight: 25 },
      { id: 'kp5', label: '负责课程/订单/用户服务拆分 + AI 学习助手 + 性能优化', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '项目按领域拆分了课程、订单、用户、学习、AI 五个微服务', correct: true },
      { id: 'c2', text: 'AI 服务没有单独拆分，混在业务服务里', correct: false, explain: 'AI 服务单独拆分为公共能力层' },
      { id: 'c3', text: '我负责了核心服务拆分和 AI 学习助手模块开发', correct: false },
      { id: 'c4', text: '项目没有做性能优化', correct: false, explain: '核心写入接口 TPS 提升 3 倍' }
    ],
    tags: ['项目介绍', '云观教育', '微服务'], difficulty: 2, isBoss: false
  },
  {
    id: 'proj-02', floorId: 'floor-5', order: 2,
    title: '你做了课程、订单、用户服务拆分，是怎么划分服务边界的？拆分的依据是什么？',
    interviewerLine: '服务边界怎么划分的？拆分依据是什么？',
    standardAnswer: `按领域驱动设计 DDD 思想划分服务边界，核心依据是业务域的独立性，即单一职责原则。先梳理整个平台核心业务域：用户相关的注册、登录、个人信息、权限归到用户服务，这是基础支撑域；课程相关的课程管理、分类、搜索、详情归到课程服务，核心商品域；订单相关的下单、支付、退款、订单状态流转归到订单服务，交易域；学习进度、笔记、评论等学习行为归到学习服务；AI 能力单独抽成 AI 服务，作为公共能力层。

拆分考虑几个点：① 业务内聚性：同一业务领域功能放一起，关联性强的放一起，避免跨服务频繁调用；② 数据独立性：每个服务对应自己数据库，服务间不能直接连对方库，只能通过接口调用；③ 变更频率：变更频繁的功能单独拆，如 AI 功能迭代快单独拆服务不影响其他稳定业务；④ 团队协作：不同小组负责不同服务互不干扰，开发并行度高。也不是拆得越细越好，初期业务量不大时拆到合适粒度，避免过度拆分带来运维复杂度上升。`,
    keyPoints: [
      { id: 'kp1', label: '按 DDD 领域驱动设计划分，单一职责原则', weight: 20 },
      { id: 'kp2', label: '业务内聚性：同领域功能放一起', weight: 20 },
      { id: 'kp3', label: '数据独立性：每个服务自己数据库，不直接连对方库', weight: 20 },
      { id: 'kp4', label: '变更频率：变更频繁的单独拆', weight: 20 },
      { id: 'kp5', label: '避免过度拆分，拆到合适粒度', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '按 DDD 领域驱动设计划分服务边界', correct: true },
      { id: 'c2', text: '服务之间可以直接连对方的数据库', correct: false, explain: '不能直接连，只能通过接口调用' },
      { id: 'c3', text: '拆分时只考虑业务内聚性，不考虑数据独立性', correct: false, explain: '数据独立性也很重要' },
      { id: 'c4', text: '服务拆得越细越好', correct: false, explain: '避免过度拆分带来运维复杂度' }
    ],
    tags: ['DDD', '服务拆分', '云观教育'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-03', floorId: 'floor-5', order: 3,
    title: '学习进度为什么要用 Redis+RabbitMQ 异步处理？同步实现会有什么问题？',
    interviewerLine: '学习进度为什么用 Redis+RabbitMQ 异步？同步会怎样？',
    standardAnswer: `学习进度场景特点是写入非常频繁，用户看视频每隔几秒就上报一次进度，并发量高，高峰时段很多人同时学习。同步实现问题明显：① 数据库压力巨大：频繁更新占用大量数据库连接，不仅进度更新慢还影响其他业务数据库操作，拖垮系统；② 用户体验差：每次上报都要等数据库写入完成，接口响应慢前端卡顿；③ 峰值抗不住：晚八点学习高峰并发量突增，数据库容易打满导致服务不可用。

用 Redis+RabbitMQ 异步处理解决：用户上报进度时先直接写 Redis 立刻返回成功，用户无感知响应极快；然后通过 RabbitMQ 异步消费，批量把进度同步到 MySQL，把高频实时写入变成低频批量写入，大幅降低数据库压力；还有削峰填谷作用，高峰时段消息存队列慢慢消费，不会直接冲到数据库，抗峰值能力强很多；解耦后后续要加学习行为统计、时长计算直接消费队列就行，不用改上报主逻辑，扩展性更好。`,
    keyPoints: [
      { id: 'kp1', label: '进度写入频繁、并发高，同步会打满数据库', weight: 20 },
      { id: 'kp2', label: '同步会导致接口响应慢，用户体验差', weight: 15 },
      { id: 'kp3', label: '先写 Redis 立刻返回，用户无感知', weight: 20 },
      { id: 'kp4', label: 'RabbitMQ 异步消费批量同步到 MySQL，降数据库压力', weight: 25 },
      { id: 'kp5', label: '削峰填谷 + 解耦扩展性好', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '同步实现会导致数据库压力巨大，高峰扛不住', correct: true },
      { id: 'c2', text: '先写 Redis 立刻返回，用户体验好', correct: false },
      { id: 'c3', text: '异步处理会增加接口响应时间', correct: false, explain: '异步反而响应更快' },
      { id: 'c4', text: 'RabbitMQ 异步消费无法削峰填谷', correct: false, explain: '可以削峰填谷' }
    ],
    tags: ['异步处理', 'RabbitMQ', '学习进度'], difficulty: 2, isBoss: false
  },
  {
    id: 'proj-04', floorId: 'floor-5', order: 4,
    title: '核心写入接口 TPS 提升 3 倍，这个数据是怎么测试出来的？具体优化了哪些点？',
    interviewerLine: 'TPS 提升 3 倍怎么测的？优化了哪些点？',
    standardAnswer: `用 JMeter 压测工具测，压测学习进度上报和订单创建两个核心写入接口，用 1000 并发线程持续压测，取稳定后平均 TPS，优化前约 300 多，优化后约 1000，提升 3 倍左右。

优化点：① 架构异步化：学习进度从同步写数据库改成 Redis+RabbitMQ 异步写入，同步 IO 变异步，这是提升最大的点。② 缓存优化：引入多级缓存，热点数据如课程详情、用户信息放 Redis 减少数据库查询；用 Caffeine 做本地一级缓存，热点请求直接读本地，连 Redis 网络开销都省了。③ 数据库优化：给常用查询字段建合适联合索引，优化慢 SQL，多表关联查询改成适当数据冗余减少 join；批量写入用批量插入提升写入效率。④ 连接池和线程池优化：调整数据库连接池大小、Tomcat 线程池、业务线程池参数，根据压测调到最优值，避免线程阻塞和资源不足。⑤ 接口层面优化：非核心逻辑从主流程剥离，如操作日志、统计埋点改异步执行，不影响主接口响应时间。`,
    keyPoints: [
      { id: 'kp1', label: 'JMeter 1000 并发压测，取稳定后平均 TPS', weight: 20 },
      { id: 'kp2', label: '架构异步化：Redis+RabbitMQ 异步写入（提升最大）', weight: 20 },
      { id: 'kp3', label: '多级缓存：Caffeine 本地 + Redis 分布式', weight: 20 },
      { id: 'kp4', label: '数据库优化：联合索引、慢 SQL、批量插入、数据冗余', weight: 20 },
      { id: 'kp5', label: '连接池/线程池调优 + 非核心逻辑异步剥离', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '用 JMeter 1000 并发压测，取稳定后平均 TPS', correct: true },
      { id: 'c2', text: '异步化改造是提升 TPS 最大的优化点', correct: false },
      { id: 'c3', text: 'TPS 提升只靠加索引', correct: false, explain: '是多方面综合优化' },
      { id: 'c4', text: '操作日志、统计埋点应放在主流程同步执行', correct: false, explain: '应异步剥离' }
    ],
    tags: ['性能优化', 'TPS', 'JMeter'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-05', floorId: 'floor-5', order: 5,
    title: '分布式事务 Seata AT 和 TCC 分别用在什么业务场景？为什么不用同一种模式？',
    interviewerLine: 'Seata AT 和 TCC 分别用在哪？为什么不用同一种？',
    standardAnswer: `没用同一种是因为不同业务场景对性能、一致性、开发成本要求不一样，两种模式互补。AT 模式主要用在常规业务如课程下单、用户信息更新、学习记录同步。AT 优点业务零侵入，不用写额外补偿代码，只加一个注解就能用，开发成本低效率高；自动生成回滚日志，异常时自动回滚，对业务代码无影响。缺点性能比 TCC 差，基于全局锁，高并发场景锁冲突多。常规业务并发量不特别高，追求开发效率，AT 完全够用。

TCC 主要用在高并发核心交易场景如库存扣减、优惠券核销、支付回调。TCC 分 Try、Confirm、Cancel 三阶段，Try 预留资源，Confirm 正式提交，Cancel 释放资源。优点性能好，锁粒度小并发能力强，资源提前预留不会超卖；缺点业务侵入大，每个业务写三个方法，开发成本高逻辑复杂。核心高并发交易场景性能和数据准确性更重要，所以用 TCC。简单说常规业务用 AT 保效率，核心高并发场景用 TCC 保性能，结合性价比最高。`,
    keyPoints: [
      { id: 'kp1', label: 'AT 适合常规业务：业务零侵入，加注解即用', weight: 20 },
      { id: 'kp2', label: 'AT 缺点：性能比 TCC 差，基于全局锁', weight: 15 },
      { id: 'kp3', label: 'TCC 适合高并发核心场景：库存扣减、优惠券核销', weight: 20 },
      { id: 'kp4', label: 'TCC 三阶段：Try 预留、Confirm 提交、Cancel 释放', weight: 25 },
      { id: 'kp5', label: 'AT 保效率，TCC 保性能，结合性价比最高', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'AT 模式业务零侵入，加注解即用', correct: true },
      { id: 'c2', text: 'TCC 的业务侵入比 AT 小', correct: false, explain: 'TCC 需写三个方法，侵入更大' },
      { id: 'c3', text: 'TCC 的 Try 阶段预留资源，Confirm 正式提交', correct: false },
      { id: 'c4', text: '所有场景都应该用 TCC', correct: false, explain: '常规业务用 AT 更合适' }
    ],
    tags: ['Seata', 'AT', 'TCC', '分布式事务'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-06', floorId: 'floor-5', order: 6,
    title: '你实现的智能课程推荐，协同过滤算法是怎么做的？怎么和大模型能力结合？',
    interviewerLine: '智能课程推荐的协同过滤怎么做的？怎么和大模型结合？',
    standardAnswer: `两阶段方案，协同过滤做召回，大模型做精排和个性化生成。第一阶段召回，两种协同过滤结合：① 基于用户的协同过滤：根据用户学习历史、收藏、点赞、停留时长算兴趣标签，找和当前用户兴趣最相似的 Top N 用户，把他们学过评分高的课程挑出来；② 基于内容的协同过滤：计算课程间相似度，推荐和用户已学课程标签、难度、方向相似的课程。两部分去重后形成几十门课的候选池，保证召回覆盖率和基础相关性。

第二阶段精排和生成，大模型发挥作用：把候选课程详细信息、用户学习数据、兴趣标签、推荐指令一起传给大模型。首先让大模型从候选池选最适合用户的 5 门课做精细化排序，比传统公式排序更智能，能考虑用户学习进度、知识衔接、学习目标等复杂因素；然后让大模型给每门课生成个性化推荐理由，结合用户学习情况，比如用户刚学完 Java 基础就推荐进阶课程，理由点明知识衔接性，而不是千篇一律的推荐语。协同过滤保证推荐效率和基础效果，大模型提升精准度和用户体验。`,
    keyPoints: [
      { id: 'kp1', label: '两阶段：协同过滤召回 + 大模型精排生成', weight: 20 },
      { id: 'kp2', label: '基于用户的协同过滤：找相似用户，推荐他们学过的课', weight: 20 },
      { id: 'kp3', label: '基于内容的协同过滤：推荐和已学课程相似的课', weight: 20 },
      { id: 'kp4', label: '大模型从候选池选 5 门做精细化排序', weight: 20 },
      { id: 'kp5', label: '大模型生成个性化推荐理由，结合学习进度', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '协同过滤做召回，大模型做精排和个性化生成', correct: true },
      { id: 'c2', text: '智能推荐只用协同过滤，不用大模型', correct: false, explain: '两者结合' },
      { id: 'c3', text: '大模型能考虑用户学习进度、知识衔接等复杂因素', correct: false },
      { id: 'c4', text: '推荐理由应该是千篇一律的模板', correct: false, explain: '要个性化生成' }
    ],
    tags: ['AI推荐', '协同过滤', '大模型'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-07', floorId: 'floor-5', order: 7,
    title: '项目上线后遇到过最棘手的线上问题是什么？你的排查和解决思路是什么？',
    interviewerLine: '最棘手的线上问题是什么？怎么排查解决的？',
    standardAnswer: `印象最深是一次晚高峰，学习进度上报接口突然响应变慢，用户反馈视频卡顿，数据库 CPU 冲到 90% 以上。排查思路：① 先看监控，发现数据库 CPU 升，慢 SQL 数量暴增，定位到学习进度更新 SQL 执行特别慢；② 看数据库进程列表，发现大量更新语句在等待行锁，出现很多锁等待；③ 查日志，发现当晚有运营活动上线热门新课，同时在线学习人数翻几倍，很多人学同一门课，更新同一条课程学习人数统计，导致行锁冲突严重，大量事务阻塞，数据库 CPU 打满。

紧急处理：先把学习进度同步统计逻辑关掉改成异步统计，让主流程恢复；临时扩容数据库连接池，增加消费者数量快速消化堆积的进度消息，先恢复用户正常使用。事后根治优化：① 把课程统计字段从课程表拆出来单独做统计表，用 Redis 做计数器先更新 Redis 异步同步到数据库，避免更新同一行造成锁冲突；② 优化消息队列消费逻辑，合并批量更新，把多条进度更新合并成一次数据库操作减少写入次数；③ 加流量监控和告警，热门课程上线提前做容量评估。之后高峰再没出现过类似问题。`,
    keyPoints: [
      { id: 'kp1', label: '晚高峰进度上报接口变慢，数据库 CPU 90%+', weight: 15 },
      { id: 'kp2', label: '排查：看监控→看锁等待→查日志定位热门课程锁冲突', weight: 25 },
      { id: 'kp3', label: '紧急处理：关统计逻辑改异步，扩容连接池和消费者', weight: 20 },
      { id: 'kp4', label: '根治：统计字段拆表 + Redis 计数器 + 异步同步', weight: 25 },
      { id: 'kp5', label: '加流量监控告警，热门课程提前容量评估', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '根因是热门课程上线，大量用户更新同一行造成行锁冲突', correct: true },
      { id: 'c2', text: '紧急处理可以先把非核心统计逻辑关掉改异步', correct: false },
      { id: 'c3', text: '根治方案是把统计字段拆出来用 Redis 计数器', correct: false },
      { id: 'c4', text: '线上问题不需要加监控告警', correct: false, explain: '监控告警很重要' }
    ],
    tags: ['线上问题', '锁冲突', '排查'], difficulty: 3, isBoss: false
  },

  // ============ 项目二：智汇 AI 餐饮 SaaS ============
  {
    id: 'proj-08', floorId: 'floor-5', order: 8,
    title: '介绍一下这个餐饮 SaaS 平台的定位，你独立负责了哪些后端功能？',
    interviewerLine: '介绍餐饮 SaaS 平台定位，你独立负责了哪些功能？',
    standardAnswer: `项目是面向中小餐饮商家的一体化 SaaS 平台，覆盖外卖点餐、堂食扫码点餐、订单管理、优惠券营销、会员管理、智能客服等核心功能，目标是帮中小商家低成本实现数字化经营，不用自己开发系统。技术栈 Spring Boot + MyBatis-Plus + Redis + Spring AI + Qwen，前端 Vue3 + uni-app，同时支持小程序和 H5。

我独立负责后端 AI 相关模块和核心交易模块开发：① AI 智能客服"小慧"全链路开发，基于 RAG + Function Calling 实现，支持订单查询、取消、菜品推荐、常见问题解答；② 秒杀优惠券功能，用 Redis + Lua 脚本实现高并发秒杀保证不超卖；③ 订单系统幂等性设计，用策略模式实现多种幂等方案保证各种场景订单不重复；④ 整体缓存架构设计，包括菜品详情页二级缓存、库存缓存、订单缓存；还有 AI 菜品推荐、优惠券发放等功能后端实现。从 AI 能力到核心交易的后端功能都是我独立完成设计和开发的。`,
    keyPoints: [
      { id: 'kp1', label: '面向中小餐饮商家的一体化 SaaS 平台', weight: 15 },
      { id: 'kp2', label: '技术栈：Spring Boot + MyBatis-Plus + Redis + Spring AI + Qwen', weight: 20 },
      { id: 'kp3', label: 'AI 智能客服"小慧"全链路开发（RAG + Function Calling）', weight: 25 },
      { id: 'kp4', label: '秒杀优惠券（Redis + Lua）+ 订单幂等性（策略模式）', weight: 25 },
      { id: 'kp5', label: '整体缓存架构设计（二级缓存）', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '面向中小餐饮商家的一体化 SaaS 平台', correct: true },
      { id: 'c2', text: '我独立负责了 AI 智能客服、秒杀优惠券、订单幂等等核心功能', correct: false },
      { id: 'c3', text: '项目只用 Spring AI，没有用 RAG 和 Function Calling', correct: false, explain: '智能客服基于 RAG + Function Calling' },
      { id: 'c4', text: '秒杀优惠券用数据库悲观锁实现', correct: false, explain: '用 Redis + Lua 脚本' }
    ],
    tags: ['项目介绍', '智汇餐饮', 'SaaS'], difficulty: 2, isBoss: false
  },
  {
    id: 'proj-09', floorId: 'floor-5', order: 9,
    title: '秒杀优惠券用了 Redis+Lua 脚本，为什么要用 Lua 脚本？怎么保证操作的原子性？',
    interviewerLine: '秒杀为什么用 Lua 脚本？怎么保证原子性？',
    standardAnswer: `秒杀优惠券核心是高并发下库存扣减，要保证不超卖同时性能高。不用 Lua 需要先查库存、再判断够不够、再扣库存，三步操作在 Redis 里分开，并发场景有线程安全问题，多个线程同时查到库存还有然后都去扣就会超卖。虽然 Redis 有事务但事务功能弱，不能做逻辑判断，满足不了复杂秒杀逻辑。Lua 脚本可把多个 Redis 命令写到一个脚本里，Redis 执行 Lua 脚本是原子性的，整个脚本执行不会被其他命令打断，相当于把多步操作变成原子操作，完美解决并发安全问题。

具体实现：把查询库存、判断库存、扣减库存、记录用户领取记录这些逻辑都写在一个 Lua 脚本里，参数传优惠券 ID 和用户 ID。脚本执行时先查这个用户有没有领过，领过直接返回失败；没领过查库存，库存不足返回失败；库存够就扣减库存，然后记录用户领取记录返回成功。整个过程在一次 Lua 执行里完成全程原子，不会并发问题，性能极高，单 Redis 实例就能扛几万 QPS，完全满足秒杀高并发需求。同时加接口限流、一人一张限制层层防护保证不超卖。`,
    keyPoints: [
      { id: 'kp1', label: '不用 Lua 需分三步，并发下会超卖', weight: 20 },
      { id: 'kp2', label: 'Redis 事务功能弱，不能做逻辑判断', weight: 15 },
      { id: 'kp3', label: 'Lua 脚本原子性，执行中不会被打断', weight: 25 },
      { id: 'kp4', label: '脚本内：查用户是否领过 → 查库存 → 扣库存 → 记录', weight: 25 },
      { id: 'kp5', label: '单 Redis 实例可扛几万 QPS，加限流一人一张层层防护', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'Lua 脚本执行是原子性的，不会被其他命令打断', correct: true },
      { id: 'c2', text: 'Redis 事务功能很强，能直接做秒杀逻辑', correct: false, explain: 'Redis 事务功能弱，不能做逻辑判断' },
      { id: 'c3', text: '脚本内先查用户是否领过，再查库存扣库存', correct: false },
      { id: 'c4', text: '秒杀不需要一人一张的限制', correct: false, explain: '需要加限制防刷' }
    ],
    tags: ['秒杀', 'Lua', 'Redis'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-10', floorId: 'floor-5', order: 10,
    title: '订单幂等性你用策略模式拆分实现，设计了哪几种幂等策略？分别对应什么场景？',
    interviewerLine: '订单幂等用了哪几种策略？分别对应什么场景？',
    standardAnswer: `用策略模式是为了不同业务场景灵活选用不同幂等方案，不用写一堆 if else，扩展性好，加新策略不用改原有代码，符合开闭原则。设计了四种策略：

① 唯一请求 ID 策略：每次请求生成唯一 requestId，请求先查 Redis 是否处理过，没处理过执行业务，执行完存 ID 设过期时间。适合前端重复提交、消息重复消费场景，如创建订单接口防用户重复点击下单，还有 MQ 消费者幂等。

② 状态机幂等策略：给订单设计状态流转如待支付、已支付、已取消、已完成，每个状态只能流转到下一个状态。更新订单状态时必须校验上一状态对不对，如只有待支付订单才能改成已支付，重复更新时状态已变就会执行失败。适合订单状态流转场景，如支付回调、发货、取消。

③ 乐观锁策略：给数据库表加 version 版本号字段，更新数据时带版本号，版本号匹配才更新成功并加一。适合更新类操作，如库存扣减、用户积分更新防重复扣减。

④ 唯一索引策略：给业务唯一标识加数据库唯一索引，如订单号、支付流水号，重复插入数据库报错不会插多条。适合有唯一业务标识的写操作，如支付流水记录、退款记录。使用时通过注解指定用哪种策略，策略工厂自动选择对应实现，非常灵活。`,
    keyPoints: [
      { id: 'kp1', label: '策略模式灵活选用，避免 if else，符合开闭原则', weight: 15 },
      { id: 'kp2', label: '唯一请求 ID + Redis：前端重复提交、消息重复消费', weight: 20 },
      { id: 'kp3', label: '状态机幂等：订单状态流转，必须上一状态才能流转', weight: 20 },
      { id: 'kp4', label: '乐观锁版本号：库存扣减、积分更新', weight: 20 },
      { id: 'kp5', label: '唯一索引：订单号、支付流水号', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '唯一请求 ID + Redis 适合前端重复提交和消息重复消费', correct: true },
      { id: 'c2', text: '状态机幂等要求必须上一状态才能流转到下一状态', correct: false },
      { id: 'c3', text: '乐观锁版本号适合查询类接口', correct: false, explain: '适合更新类操作' },
      { id: 'c4', text: '唯一索引适合所有幂等场景', correct: false, explain: '只适合有唯一业务标识的写操作' }
    ],
    tags: ['幂等性', '策略模式', '订单'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-11', floorId: 'floor-5', order: 11,
    title: '菜品详情页用了 Redis+Spring Cache 二级缓存，Cache-Aside 模式怎么保证数据一致性？',
    interviewerLine: '二级缓存怎么保证一致性？Cache-Aside 怎么用？',
    standardAnswer: `Cache-Aside 旁路缓存模式核心原则：读时先读缓存，没有就读数据库再写入缓存；写时先更新数据库再删除缓存。具体到二级缓存（Caffeine 本地 + Redis 分布式），一致性保证分几层：

① Redis 和数据库一致性：采用先更新数据库再删除 Redis 缓存方案。为什么删不是更？因为更新缓存并发场景容易脏数据，删除更简单可靠，下次查询自动加载最新数据。同时加延迟双删：更新数据库后先删一次缓存，延迟几百毫秒再删一次，防止并发场景下读请求把旧数据写回缓存。

② 本地缓存和 Redis 一致性：每个服务实例有自己的本地 Caffeine 缓存，更新数据时只删 Redis，本地缓存还在就会出现脏数据。解决方案：更新数据删除 Redis 缓存后，发一条广播消息到 MQ，所有服务实例收到消息后删除自己的本地缓存，保证各实例本地缓存都能失效。

③ 兜底机制：所有缓存设过期时间，即使前面机制都出问题，最多过期时间内脏数据，不会一直错下去。通过这几层保证基本不会出现缓存和数据库不一致。`,
    keyPoints: [
      { id: 'kp1', label: 'Cache-Aside：读先读缓存，写先更数据库再删缓存', weight: 25 },
      { id: 'kp2', label: '删缓存比更缓存更可靠，避免并发脏数据', weight: 20 },
      { id: 'kp3', label: '延迟双删：更新后先删，延迟再删一次', weight: 20 },
      { id: 'kp4', label: '本地缓存通过 MQ 广播通知所有实例删除', weight: 25 },
      { id: 'kp5', label: '所有缓存设过期时间作为兜底', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: 'Cache-Aside 模式推荐先更新数据库再删除缓存', correct: true },
      { id: 'c2', text: '延迟双删是为了防止并发下读请求把旧数据写回缓存', correct: false },
      { id: 'c3', text: '更新数据只需删 Redis，不用管本地缓存', correct: false, explain: '要通过 MQ 广播删本地缓存' },
      { id: 'c4', text: '缓存不需要设置过期时间', correct: false, explain: '过期时间是兜底机制' }
    ],
    tags: ['缓存一致性', 'CacheAside', '二级缓存'], difficulty: 3, isBoss: false
  },
  {
    id: 'proj-12', floorId: 'floor-5', order: 12,
    title: '这个项目里，你觉得自己做得最好的一个技术设计是什么？为什么？',
    interviewerLine: '你觉得自己做得最好的技术设计是什么？为什么？',
    standardAnswer: `我觉得做得最好的是基于 Function Calling 的智能客服设计，这个设计不仅解决业务问题，还体现技术和业务的结合。① 它解决了传统客服痛点：之前商家需专门人工客服处理订单查询、退款、菜品咨询，人力成本高响应慢。智能客服上线后 80% 常见问题能自动处理，不用人工介入，大幅降低商家运营成本。

② 技术上设计合理的地方：它不是纯 AI 对话，而是把 AI 能力和业务系统无缝打通。通过 Function Calling，大模型可调用真实业务接口，不是只会说空话，而是能真的帮用户查订单、取消订单、推荐菜品，是能落地的实用功能，不是花架子。③ 架构上做了很好封装：把大模型调用、函数管理、对话记忆、容错降级都封装在 AI 模块里，业务层只需调统一接口，后续加新函数、换大模型都不用改业务代码，扩展性很好。④ 容错机制完善：大模型出问题自动降级，不会影响正常点餐下单流程。功能上线后用户反馈很好，商家客服咨询量下降 70%，是真正用技术创造业务价值。`,
    keyPoints: [
      { id: 'kp1', label: '基于 Function Calling 的智能客服设计', weight: 20 },
      { id: 'kp2', label: '解决传统客服痛点，80% 常见问题自动处理', weight: 20 },
      { id: 'kp3', label: 'AI 能力和业务系统无缝打通，能真正调业务接口', weight: 25 },
      { id: 'kp4', label: '架构封装好，业务层只需调统一接口，扩展性强', weight: 20 },
      { id: 'kp5', label: '容错机制完善，大模型出问题自动降级', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '智能客服通过 Function Calling 能真正调业务接口', correct: true },
      { id: 'c2', text: '智能客服只是纯 AI 对话，不能调业务接口', correct: false, explain: '它通过 Function Calling 调业务接口' },
      { id: 'c3', text: 'AI 模块封装好，业务层只需调统一接口', correct: false },
      { id: 'c4', text: '大模型出问题会影响正常点餐下单', correct: false, explain: '有降级机制，不影响核心业务' }
    ],
    tags: ['项目亮点', 'FunctionCalling', '智能客服'], difficulty: 2, isBoss: false
  },
  {
    id: 'proj-13', floorId: 'floor-5', order: 13,
    title: '如果让你重构这个项目，你会在哪些地方做优化？',
    interviewerLine: '如果重构这个项目，你会优化哪些地方？',
    standardAnswer: `从架构、性能、可维护性三方面优化。① 架构层面：现在是单体架构，随商家数量增多扩展性不够。会拆成微服务架构，按领域拆成订单服务、菜品服务、用户服务、AI 服务，各服务独立部署独立扩展，不会因一个功能出问题影响整个系统。AI 服务单独拆出来可独立扩容，更好应对 AI 调用流量波动。

② 性能和数据层面：现在单库单表，订单数据量大了查询变慢。会做分库分表，按商家 ID 分库，订单表按时间分表，提升大数据量下查询性能。引入 Elasticsearch 做菜品搜索和订单搜索，替代数据库模糊查询，提升搜索性能和体验。引入消息队列做更多异步解耦，如订单通知、统计报表改成异步，提升主流程性能。

③ 可维护性和运维层面：现在监控体系简单，重构时会完善全链路监控，接口耗时、错误率、数据库慢 SQL、大模型调用指标都做监控和告警，问题能更早发现。完善自动化测试和 CI/CD 流水线，提升发布效率降低线上 bug。④ AI 能力层面：优化 RAG 效果，加入多模态能力支持图片识别菜品，还有更智能的营销推荐，进一步提升产品竞争力。`,
    keyPoints: [
      { id: 'kp1', label: '架构：单体拆微服务，按领域拆分，AI 服务独立扩容', weight: 25 },
      { id: 'kp2', label: '数据：分库分表 + Elasticsearch 搜索', weight: 20 },
      { id: 'kp3', label: '性能：引入 MQ 做更多异步解耦', weight: 15 },
      { id: 'kp4', label: '运维：全链路监控 + CI/CD 流水线', weight: 20 },
      { id: 'kp5', label: 'AI：优化 RAG + 多模态 + 智能营销推荐', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '架构上从单体拆成微服务，AI 服务独立扩容', correct: true },
      { id: 'c2', text: '数据层面做分库分表 + 引入 Elasticsearch', correct: false },
      { id: 'c3', text: '重构不需要完善监控体系', correct: false, explain: '要完善全链路监控' },
      { id: 'c4', text: 'AI 能力层面不需要优化 RAG', correct: false, explain: '要优化 RAG 效果' }
    ],
    tags: ['项目重构', '架构优化', '智汇餐饮'], difficulty: 3, isBoss: true
  },
  {
    id: 'ops-01', floorId: 'floor-6', order: 1,
    title: '说几个你最常用的 Linux 命令？怎么查看服务日志？怎么排查进程 CPU 占用过高？',
    interviewerLine: '常用 Linux 命令说一下，怎么看日志、排查 CPU 高？',
    standardAnswer: `常用命令分几类：文件操作 ls、cd、cat、tail、less、grep；进程查看 ps、top、jps；网络 netstat、curl、ping；权限 chmod、chown；还有 vim、tar 等。

查看服务日志：最常用 tail，如 tail -f server.log 实时查看输出，tail -n 200 server.log 看最后 200 行。搜索特定内容用 grep，如 grep "Exception" server.log 找异常，grep "订单号" server.log 搜特定请求。日志量大用 less 可翻页搜索。可配合管道，如 tail -f server.log | grep "ERROR" 只看错误日志。

排查 CPU 占用过高：① top 命令按 P 键按 CPU 排序，找到 CPU 占比最高的进程，拿进程 ID；② top -Hp 进程ID 看进程里所有线程，找到 CPU 最高的线程 ID；③ 把线程 ID 转十六进制，用 printf "%x\\n" 线程ID；④ jstack 进程ID | grep 十六进制线程ID -A 30 打印线程堆栈，看代码卡在哪个方法，定位哪段代码导致 CPU 过高。更复杂的问题用 Arthas 诊断工具，更方便直接看方法耗时、堆栈、热点代码。`,
    keyPoints: [
      { id: 'kp1', label: 'tail -f 实时看日志，grep 搜索内容', weight: 20 },
      { id: 'kp2', label: 'top 按 P 排序找 CPU 最高进程', weight: 20 },
      { id: 'kp3', label: 'top -Hp 进程ID 找到 CPU 最高的线程', weight: 20 },
      { id: 'kp4', label: '线程 ID 转十六进制，jstack 打印线程堆栈', weight: 25 },
      { id: 'kp5', label: '复杂问题用 Arthas 诊断工具', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'tail -f 可实时查看服务日志输出', correct: true },
      { id: 'c2', text: '排查 CPU 高直接用 jstack 进程 ID 即可，不用转十六进制', correct: false, explain: '要先找到 CPU 最高的线程 ID 转十六进制' },
      { id: 'c3', text: 'top -Hp 可查看进程内所有线程的 CPU 占用', correct: false },
      { id: 'c4', text: 'Arthas 不能用于线上问题诊断', correct: false, explain: 'Arthas 是常用的线上诊断工具' }
    ],
    tags: ['Linux', 'CPU排查', '日志'], difficulty: 2, isBoss: false
  },
  {
    id: 'ops-02', floorId: 'floor-6', order: 2,
    title: 'Git 的 merge 和 rebase 有什么区别？你们项目的 Git 分支管理规范是什么？',
    interviewerLine: 'merge 和 rebase 有什么区别？你们 Git 分支规范是什么？',
    standardAnswer: `merge 和 rebase 都是合并分支命令，核心区别是提交历史不一样。merge 把两个分支提交合并，生成一个新的合并提交，原来两个分支的提交历史完整保留，是分叉的。优点安全，不会修改原有提交历史，什么时候合并都有记录，出问题好回溯。缺点提交历史比较乱，多次合并会有很多分叉，看起来不清晰。

rebase 变基，把当前分支的提交移到目标分支最新提交后面，变成一条直线没有分叉。优点提交历史干净整洁，一条直线看起来清晰。缺点会修改提交历史，合并时有冲突解决麻烦，多人协作改公共分支历史会出问题。简单说，个人功能分支合并到公共分支用 merge 更安全；自己的分支同步主分支更新可以用 rebase 保持历史干净。

我们项目用标准 Git Flow 规范：master 主分支存线上正式代码，只能合并不能直接提交，打标签对应线上版本；develop 开发分支存最新开发代码，功能开发完合并到这里；feature 功能分支从 develop 拉出，开发新功能完合并回 develop；release 发布分支版本发布时从 develop 拉出，做测试和 bug 修复，发布完合并到 master 和 develop；hotfix 热修复分支线上出 bug 时从 master 拉出，修复完合并回 master 和 develop。`,
    keyPoints: [
      { id: 'kp1', label: 'merge 生成新合并提交，保留原有历史，安全但历史分叉', weight: 25 },
      { id: 'kp2', label: 'rebase 变基，提交变成一条直线，历史干净但会改历史', weight: 25 },
      { id: 'kp3', label: 'master 存线上代码，develop 存开发代码', weight: 15 },
      { id: 'kp4', label: 'feature 从 develop 拉出，release 做发布', weight: 20 },
      { id: 'kp5', label: 'hotfix 从 master 拉出修复线上 bug', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: 'merge 会生成新的合并提交，保留原有分支历史', correct: true },
      { id: 'c2', text: 'rebase 会修改提交历史，多人协作公共分支慎用', correct: false },
      { id: 'c3', text: 'master 分支可以直接提交代码', correct: false, explain: 'master 只能合并，不能直接提交' },
      { id: 'c4', text: 'hotfix 分支从 develop 拉出', correct: false, explain: 'hotfix 从 master 拉出' }
    ],
    tags: ['Git', 'merge', 'rebase'], difficulty: 2, isBoss: false
  },
  {
    id: 'ops-03', floorId: 'floor-6', order: 3,
    title: 'Docker 的镜像和容器是什么关系？你项目里是怎么用 Docker 做部署的？',
    interviewerLine: 'Docker 镜像和容器什么关系？项目怎么用 Docker 部署？',
    standardAnswer: `镜像和容器关系类比成程序和进程。镜像是一个只读模板，包含程序运行需要的代码、环境、依赖、配置，相当于一个安装包，是静态的。容器是镜像运行起来的实例，是动态的，有自己的生命周期，可以启动、停止、删除。同一个镜像可以启动多个容器，互相隔离互不影响。简单说镜像是模板，容器是模板运行的实例。

项目里 Docker 使用：① 每个服务写一个 Dockerfile，定义基础镜像、代码打包、启动命令；② 用 Maven 打包时自动构建成 Docker 镜像，推送到私有镜像仓库；③ 部署时开发测试环境用 Docker Compose 编排，把所有服务、MySQL、Redis、Nacos 等中间件都定义在 compose 文件里，一键启动所有环境，部署方便，新人搭环境也快；④ 生产环境配合 CI/CD 流水线，代码提交后自动构建镜像，然后部署到 K8s 集群做弹性伸缩和高可用。我主要负责开发环境和测试环境的 Docker 部署，生产环境有运维同学负责。`,
    keyPoints: [
      { id: 'kp1', label: '镜像类比程序，是只读模板；容器类比进程，是运行实例', weight: 25 },
      { id: 'kp2', label: '同一镜像可启动多个容器，互相隔离', weight: 15 },
      { id: 'kp3', label: '每个服务写 Dockerfile，Maven 打包自动构建镜像', weight: 20 },
      { id: 'kp4', label: '开发测试环境用 Docker Compose 一键启动', weight: 20 },
      { id: 'kp5', label: '生产环境配合 CI/CD 部署到 K8s', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '镜像是只读模板，容器是镜像运行起来的实例', correct: true },
      { id: 'c2', text: '一个镜像只能启动一个容器', correct: false, explain: '可启动多个容器' },
      { id: 'c3', text: '开发测试环境用 Docker Compose 编排', correct: false },
      { id: 'c4', text: '生产环境不需要 CI/CD 流水线', correct: false, explain: '生产环境配合 CI/CD' }
    ],
    tags: ['Docker', '镜像', '容器'], difficulty: 1, isBoss: false
  },
  {
    id: 'ops-04', floorId: 'floor-6', order: 4,
    title: 'Maven 的三大生命周期是什么？遇到依赖冲突你怎么解决？',
    interviewerLine: 'Maven 三大生命周期是什么？依赖冲突怎么解决？',
    standardAnswer: `Maven 有三套相互独立的生命周期：① clean：清理项目，清理上一次构建生成的文件，核心阶段是 clean；② default：构建项目，最核心，包含编译、测试、打包、安装、部署等阶段，如 compile 编译、test 测试、package 打包、install 安装到本地仓库、deploy 部署到远程仓库；③ site：生成项目站点文档，一般用得少。

依赖冲突即同一依赖有多个版本，导致类找不到、方法不存在等问题。解决：① 先用 mvn dependency:tree 打印依赖树，看冲突依赖从哪个包引进来、分别什么版本；② 排除法：在不需要的依赖上用 exclusion 排除冲突包，保留需要的版本；③ 统一版本：在 dependencyManagement 里指定依赖版本，所有地方用同一个版本，最彻底；④ 就近原则：在项目 pom 里显式声明需要的版本，Maven 依赖调节是就近优先，直接声明优先级最高。一般优先用 dependencyManagement 统一管理版本从根源避免冲突，个别冲突用排除法解决。`,
    keyPoints: [
      { id: 'kp1', label: '三大生命周期：clean、default、site', weight: 25 },
      { id: 'kp2', label: 'default 包含 compile、test、package、install、deploy', weight: 20 },
      { id: 'kp3', label: 'mvn dependency:tree 定位冲突', weight: 20 },
      { id: 'kp4', label: '排除法：exclusion 排除冲突包', weight: 15 },
      { id: 'kp5', label: 'dependencyManagement 统一版本，从根源避免冲突', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Maven 三大生命周期是 clean、default、site', correct: true },
      { id: 'c2', text: 'default 生命周期包含 compile、test、package、install、deploy', correct: false },
      { id: 'c3', text: 'mvn dependency:tree 可以查看依赖树定位冲突', correct: false },
      { id: 'c4', text: 'dependencyManagement 不能统一版本', correct: false, explain: '它可统一管理版本' }
    ],
    tags: ['Maven', '生命周期', '依赖冲突'], difficulty: 2, isBoss: true
  },
  {
    id: 'scene-01', floorId: 'floor-7', order: 1,
    title: '如果让你从零设计一个用户签到系统，兼顾性能和存储成本，你会怎么设计？',
    interviewerLine: '从零设计用户签到系统，兼顾性能和存储成本，你怎么设计？',
    standardAnswer: `用 Redis BitMap 为核心设计，兼顾高性能和极低存储成本，分缓存层和持久化层两层。

核心存储用 Redis BitMap，按天存签到数据，每天一个 key 如 sign:20240101，用户 ID 作为位图偏移量，用户签到就把对应位置设为 1，没签到就是 0。这样存 100 万用户一天签到数据只需 125KB 左右，存储成本极低，位操作性能极高，O(1) 时间就能完成签到和查询。

功能层面：① 签到：用户当天签到用 SETBIT 命令把当天位图对应用户 ID 的位置设为 1，同时记录连续签到天数更新签到统计；② 签到查询：查某天有没有签到用 GETBIT；查当月签到情况遍历当月位图或用 BITCOUNT 统计签到总天数；③ 连续签到计算：用位运算把最近 N 天的位图做与运算，结果中用户对应的位 1 就是连续签到，性能非常高；④ 补签：直接设置对应日期的位为 1，重新计算连续天数。

持久化层：签到数据属于流水数据量大，用 MySQL 做归档，每天凌晨异步把前一天签到数据统计后落库，存用户的月签到统计、连续签到记录，不用存每条明细，降低数据库压力。Redis 只保留近 3 个月数据，历史数据归档，平衡性能和成本。另外做幂等处理重复签到不会重复计数，加防刷限制保证接口安全。`,
    keyPoints: [
      { id: 'kp1', label: 'Redis BitMap 按天存，用户 ID 作偏移量', weight: 20 },
      { id: 'kp2', label: '100 万用户一天约 125KB，O(1) 签到和查询', weight: 20 },
      { id: 'kp3', label: 'SETBIT 签到、GETBIT 查询、BITCOUNT 统计', weight: 20 },
      { id: 'kp4', label: '连续签到用位运算与运算，性能极高', weight: 20 },
      { id: 'kp5', label: 'MySQL 异步归档统计，Redis 只保留近 3 个月', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '用 Redis BitMap 按天存签到，用户 ID 作偏移量', correct: true },
      { id: 'c2', text: '连续签到用位运算与运算，性能极高', correct: false },
      { id: 'c3', text: '签到明细全部实时落 MySQL', correct: false, explain: '异步归档统计，不存明细' },
      { id: 'c4', text: 'BitMap 存储 100 万用户一天签到需要几十 MB', correct: false, explain: '只需约 125KB' }
    ],
    tags: ['场景设计', '签到系统', 'BitMap'], difficulty: 3, isBoss: false
  },
  {
    id: 'scene-02', floorId: 'floor-7', order: 2,
    title: '设计一个高并发秒杀系统，核心要解决哪些问题？怎么防止超卖、保证高可用？',
    interviewerLine: '设计高并发秒杀系统，核心解决什么问题？怎么防超卖？',
    standardAnswer: `核心解决四个问题：超卖、高并发流量冲击、接口幂等性、服务可用性。

防止超卖做多层防护：① 库存预扣：库存放 Redis，用 Lua 脚本做原子性库存查询和扣减，请求先到 Redis 扣库存，扣成功才走后续流程，扣失败直接返回已抢完，从根源防超卖；② 数据库乐观锁：最终订单写数据库时用版本号做乐观锁，更新库存校验版本，保证数据库层也不超卖，作为兜底；③ 用户限流：一个用户只能抢一次，用 Redis 记录用户抢购记录，重复请求直接拦截。

保证高可用和抗高并发：① 流量削峰：前端加倒计时、验证码分散请求；网关层限流，限制总请求量，超过直接返回，保护后端系统；② 异步下单：Redis 扣完库存后不同步创建订单，把订单信息发到消息队列，后端异步消费创建订单，同步写操作变异步大幅提升吞吐量，同时削峰填谷；③ 服务降级熔断：用 Sentinel 做限流熔断，秒杀高峰时非核心功能直接降级如用户详情、积分查询，保证秒杀核心功能可用；某个服务挂了快速失败不影响整体；④ 多级缓存：商品详情、库存信息做静态化和多级缓存，大部分请求在缓存层挡住，不打到数据库和后端服务；⑤ 集群部署：所有服务集群，Redis 集群，数据库主从，避免单点故障。`,
    keyPoints: [
      { id: 'kp1', label: '四问题：超卖、流量冲击、幂等、可用性', weight: 15 },
      { id: 'kp2', label: 'Redis + Lua 原子扣库存，从根源防超卖', weight: 25 },
      { id: 'kp3', label: '数据库乐观锁兜底 + 用户限流一人一单', weight: 20 },
      { id: 'kp4', label: '网关限流 + 异步下单削峰填谷', weight: 20 },
      { id: 'kp5', label: 'Sentinel 降级熔断 + 多级缓存 + 集群部署', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: 'Redis + Lua 脚本原子扣库存从根源防超卖', correct: true },
      { id: 'c2', text: '数据库乐观锁作为防超卖兜底', correct: false },
      { id: 'c3', text: '秒杀下单应该同步创建订单', correct: false, explain: '应异步下单削峰填谷' },
      { id: 'c4', text: '秒杀高峰时非核心功能不需要降级', correct: false, explain: '要降级非核心功能保核心' }
    ],
    tags: ['秒杀', '高并发', '防超卖'], difficulty: 3, isBoss: false
  },
  {
    id: 'scene-03', floorId: 'floor-7', order: 3,
    title: '线上接口突然响应变慢，说出你的完整排查思路。',
    interviewerLine: '线上接口突然变慢，完整排查思路说一下。',
    standardAnswer: `从外到内、从上到下逐层排查，先定位问题层级再定位具体原因。

① 网关和接入层：查网关监控，看是不是流量突增触发限流，或网关本身性能瓶颈如连接数满、CPU 高。流量突增先看是不是正常流量，不正常先限流拦截。

② 应用服务层：看服务监控指标 CPU、内存、GC 情况。CPU 高用 jstack 看线程堆栈，定位是不是死循环、密集计算；内存高看是不是内存泄漏或 GC 频繁导致停顿，用 jmap、jstat 分析。看接口耗时监控定位哪个接口变慢，有没有报错异常增多。看日志有没有大量错误日志、超时日志，有没有调第三方接口超时。

③ 缓存和消息队列：看 Redis 监控，命中率怎么样，有没有变慢，是不是大 key、热 key 导致，有没有连接池耗尽。看消息队列有没有消息堆积，消费者是不是卡住导致异步流程阻塞。

④ 数据库层（最常见瓶颈）：看数据库 CPU、连接数是不是打满；看慢 SQL，有没有突然出现的慢查询，是不是索引失效或锁等待、死锁。用 explain 分析慢 SQL 看执行计划。还要看网络问题，服务间调用、服务和数据库、Redis 之间有没有延迟丢包。

定位到原因后先紧急处理恢复业务，如扩容、限流、重启、临时降级，然后根因分析彻底修复，最后加监控告警避免再发生。`,
    keyPoints: [
      { id: 'kp1', label: '网关层：流量突增、限流、连接数、CPU', weight: 15 },
      { id: 'kp2', label: '应用层：CPU/内存/GC、jstack、接口耗时、日志', weight: 25 },
      { id: 'kp3', label: '缓存和 MQ：Redis 命中率、大 key、消息堆积', weight: 20 },
      { id: 'kp4', label: '数据库层：CPU、连接数、慢 SQL、锁等待、explain', weight: 25 },
      { id: 'kp5', label: '紧急处理恢复 + 根因分析 + 加监控告警', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '排查顺序应从外到内：网关→应用→缓存→数据库', correct: true },
      { id: 'c2', text: '数据库层是最常见的瓶颈，要看慢 SQL 和锁等待', correct: false },
      { id: 'c3', text: '排查只需要看应用层即可', correct: false, explain: '要逐层排查' },
      { id: 'c4', text: '定位原因后直接根治，不用紧急处理', correct: false, explain: '要先紧急恢复业务' }
    ],
    tags: ['排查思路', '线上问题', '性能'], difficulty: 3, isBoss: false
  },
  {
    id: 'scene-04', floorId: 'floor-7', order: 4,
    title: '如果大模型调用量突增，成本飙升，你有哪些优化和降级方案？',
    interviewerLine: '大模型调用量突增成本飙升，你怎么优化和降级？',
    standardAnswer: `从成本优化和服务降级两个层面处理，先优化再降级，平衡成本和用户体验。

成本优化（能优化就先优化）：① 缓存复用：常见问题和答案做缓存，相同问题直接返回缓存结果不用调大模型。高频问题、常见 FAQ 缓存起来命中率能到 30%-50%，成本直接降一半；② Prompt 优化：精简 Prompt 去掉冗余指令和无关参考内容，减少输入 token；控制输出长度不生成不必要内容，减少输出 token，大模型按 token 收费；③ 语义路由：简单问题用便宜轻量模型，复杂问题才用贵的高级模型，如简单问答用轻量版，复杂推理生成用完整版，分层调用整体成本降很多体验差别不大；④ 批量调用：非实时请求如批量生成内容合并成批量调用，提升效率降低成本；⑤ 优化 RAG：减少每次传给大模型的参考文档数量，只传最相关的，减少 token 消耗。

如果优化后成本还高或流量继续涨，做分级降级：一级降级，非核心场景禁用 AI，如推荐场景降级成传统算法推荐，不用大模型生成理由，只保留智能客服核心功能；二级降级，智能客服限制并发，超出的请求排队或返回兜底回复，引导用户稍后再试或转人工；三级降级，临时关闭 AI 功能全部走传统方案，保证核心业务可用。同时加监控告警，成本超阈值自动触发降级，恢复后自动回升。`,
    keyPoints: [
      { id: 'kp1', label: '缓存复用：常见问题答案缓存，命中率 30%-50%', weight: 20 },
      { id: 'kp2', label: 'Prompt 优化：精简输入，控制输出长度', weight: 20 },
      { id: 'kp3', label: '语义路由：简单问题用轻量模型，复杂用高级模型', weight: 20 },
      { id: 'kp4', label: '批量调用 + 优化 RAG 减少参考文档', weight: 15 },
      { id: 'kp5', label: '分级降级：非核心禁用 AI → 限并发 → 关闭 AI', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '常见问题答案缓存可直接降低成本', correct: true },
      { id: 'c2', text: '语义路由：简单问题用轻量模型，复杂问题用高级模型', correct: false },
      { id: 'c3', text: 'Prompt 越长越好，不用精简', correct: false, explain: '要精简减少 token' },
      { id: 'c4', text: '成本飙升时只能直接关闭 AI', correct: false, explain: '先优化，再分级降级' }
    ],
    tags: ['AI成本优化', '降级', '大模型'], difficulty: 3, isBoss: false
  },
  {
    id: 'scene-05', floorId: 'floor-7', order: 5,
    title: '怎么系统性地提升 RAG 的回答准确率？说出你知道的所有优化手段。',
    interviewerLine: '系统性提升 RAG 准确率，有哪些优化手段？',
    standardAnswer: `从数据层、检索层、生成层三层面全链路优化。

数据层（知识库质量，基础）：① 文档预处理：清洗文档里无关内容、格式噪音，保证内容干净准确；② 切片策略：不固定长度切片，按语义块切如标题、段落、章节，保证 Chunk 语义完整；设合理重叠率一般 15%-20% 避免上下文断裂；控制 Chunk 大小，不是越大越好，根据场景调整一般 512-1024 token；③ 元数据优化：给每个 Chunk 加分类、来源、时间、标签等元数据，方便后续过滤检索提升精准度；④ 选合适 Embedding 模型：用中文效果好的模型，或针对业务领域微调 Embedding，让向量更贴合业务语义。

检索层（核心，召回不准后面再怎么调都没用）：① 多路召回：向量检索 + 关键词检索 BM25 结合，兼顾语义匹配和字面匹配，解决专业术语、专有名词召回不准；② 元数据过滤：检索时先按分类、标签过滤缩小检索范围减少无关结果；③ 重排序 Rerank：用专门 Rerank 模型对召回结果二次排序，比向量相似度排序精准很多，把最相关的排前面，只取 Top3-5 给大模型减少干扰；④ 查询改写：把用户问题先交给大模型改写优化再去检索，提升召回效果。

生成层：① 优化 Prompt：明确指令要求必须基于参考内容回答，不知道就说不知道不要编造；加少样本示例引导按要求回答；② 引用溯源：让大模型回答时标注参考来源，既可验证准确性也能倒逼大模型不乱编；③ 迭代优化：建立评估集定期测试准确率，根据 bad case 反向优化切片、检索、Prompt 形成闭环。`,
    keyPoints: [
      { id: 'kp1', label: '数据层：语义切片 + 15%-20% 重叠 + Chunk 512-1024 token', weight: 20 },
      { id: 'kp2', label: '数据层：元数据 + 选中文好的 Embedding 模型', weight: 15 },
      { id: 'kp3', label: '检索层：向量 + BM25 多路召回', weight: 20 },
      { id: 'kp4', label: '检索层：Rerank 二次排序 + 查询改写', weight: 20 },
      { id: 'kp5', label: '生成层：Prompt 约束 + 引用溯源 + 评估集迭代', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '按语义块切片并设 15%-20% 重叠率', correct: true },
      { id: 'c2', text: '向量检索 + BM25 关键词检索做多路召回', correct: false },
      { id: 'c3', text: 'Chunk 越大越好', correct: false, explain: '不是越大越好，一般 512-1024 token' },
      { id: 'c4', text: 'RAG 优化不需要评估集', correct: false, explain: '要建评估集定期测试' }
    ],
    tags: ['RAG', '准确率优化', '全链路'], difficulty: 3, isBoss: false
  },
  {
    id: 'scene-06', floorId: 'floor-7', order: 6,
    title: '线上出现缓存和数据库数据不一致的情况，你怎么排查原因并修复？',
    interviewerLine: '缓存和数据库不一致，怎么排查和修复？',
    standardAnswer: `先紧急处理：先把有问题的缓存删掉，让流量先回数据库恢复数据正确，避免影响更多用户，然后再排查原因。

排查原因按从常见到少见顺序：① 先查更新流程是不是错了：是不是有人写成先删缓存再更数据库，或先更缓存再更数据库，这两种写法并发场景很容易脏数据。正确应该是先更数据库再删缓存。② 查缓存删除是不是失败了：更新数据库后删缓存时网络波动或 Redis 超时、报错导致缓存没删掉，就会一直是旧数据。看日志有没有删除缓存的错误记录。③ 查并发读写场景：是不是有读请求在缓存失效时查了数据库拿到旧数据，这时写请求更新了数据库删了缓存，然后读请求把旧数据写回缓存，就出现脏数据。概率很低，一般出现在高并发场景。④ 如果有本地缓存，查是不是本地缓存没同步失效，更新数据后只删了 Redis 没删本地缓存，导致各实例数据不一致。⑤ 兜底查缓存过期时间：是不是过期时间设太长或没设过期，导致脏数据一直存在。

修复和根治：① 修正更新策略，统一用先更数据库再删缓存的 Cache-Aside 模式；② 加延迟双删，更新数据库后先删一次，延迟几百毫秒再删一次，把并发导致的脏缓存删掉；③ 删除缓存失败加重试机制，如发消息到 MQ 异步重试删除保证最终删除成功；④ 有本地缓存的话更新后广播消息所有实例都删本地缓存；⑤ 所有缓存设合理过期时间作为最终兜底。`,
    keyPoints: [
      { id: 'kp1', label: '紧急处理：先删有问题的缓存恢复正确', weight: 15 },
      { id: 'kp2', label: '排查更新流程是否先删缓存再更数据库', weight: 20 },
      { id: 'kp3', label: '排查缓存删除是否失败、并发读写脏数据', weight: 20 },
      { id: 'kp4', label: '排查本地缓存是否同步失效、过期时间是否合理', weight: 20 },
      { id: 'kp5', label: '修复：Cache-Aside + 延迟双删 + MQ 重试 + 过期兜底', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '紧急处理先删有问题的缓存恢复数据正确', correct: true },
      { id: 'c2', text: '正确策略是先更新数据库再删缓存', correct: false },
      { id: 'c3', text: '先删缓存再更数据库是最佳策略', correct: false, explain: '并发下容易脏数据' },
      { id: 'c4', text: '缓存不需要设过期时间', correct: false, explain: '过期时间是兜底机制' }
    ],
    tags: ['缓存一致性', '排查', '修复'], difficulty: 3, isBoss: true
  },
  {
    id: 'hr-01', floorId: 'floor-8', order: 1,
    title: '做一个 1-2 分钟的自我介绍，重点突出你的技术优势和项目亮点。',
    interviewerLine: '先做个自我介绍吧，1-2 分钟，突出技术优势和项目亮点。',
    standardAnswer: `面试官你好，我叫 XXX，是湖南软件职业技术大学人工智能工程技术专业的大三学生，专业排名前 3%。我主要做 Java 后端开发，同时有 AI 应用开发的项目经验，技术栈覆盖 Java 基础、Spring 全家桶、微服务、分布式缓存、消息队列，也熟悉 RAG、Function Calling 这些 AI 应用落地技术。在校期间我担任过 WPS 计算机二级课程助教负责人，统筹 3 个平行班的教学辅导，也锻炼了我的沟通和协调能力。

项目方面，我做过两个完整的后端项目：一个是云观 AI 在线教育微服务平台，用 Spring Cloud Alibaba 做微服务架构，负责核心服务拆分和 AI 学习助手模块开发，通过异步化和多级缓存优化，把核心接口 TPS 提升了 3 倍；另一个是智汇 AI 餐饮 SaaS，独立负责智能客服、秒杀优惠券、订单幂等等核心功能，基于 RAG + Function Calling 实现的智能客服，首字响应控制在 350 毫秒以内。我学习能力比较强，对技术也很感兴趣，希望能加入贵公司实习，贡献自己的能力，同时也学习更多的实战经验。谢谢。`,
    keyPoints: [
      { id: 'kp1', label: '基本信息：学校、专业、排名前 3%', weight: 15 },
      { id: 'kp2', label: '技术栈：Java 后端 + AI 应用（RAG、Function Calling）', weight: 20 },
      { id: 'kp3', label: '助教经历：WPS 计算机二级课程助教负责人', weight: 15 },
      { id: 'kp4', label: '项目一：云观 AI 教育，TPS 提升 3 倍', weight: 25 },
      { id: 'kp5', label: '项目二：智汇 AI 餐饮，智能客服首字响应 <350ms', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '自我介绍要突出技术栈和两个项目的亮点数据', correct: true },
      { id: 'c2', text: '自我介绍应该详细讲家庭背景', correct: false, explain: '要突出技术和项目' },
      { id: 'c3', text: '提到 TPS 提升 3 倍、首字响应 <350ms 等具体数据更有说服力', correct: false },
      { id: 'c4', text: '自我介绍越长越好', correct: false, explain: '控制在 1-2 分钟' }
    ],
    tags: ['HR面', '自我介绍'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-02', floorId: 'floor-8', order: 2,
    title: '你担任 WPS 计算机二级课程助教期间，遇到的最大挑战是什么？怎么解决的？',
    interviewerLine: '当助教时最大挑战是什么？怎么解决的？',
    standardAnswer: `最大挑战是刚接手时，学员基础参差不齐，问题特别多，尤其临考试前一周答疑量暴增，我们几个助教根本忙不过来，很多问题回复不及时，学员反馈不好。分析发现两个问题：一是大家问题很多都是重复的，反复问同样知识点效率低；二是答疑没章法，大家都在群里乱问，助教东答一个西答一个遗漏很多问题。

然后我牵头做了两个优化：① 设计「定点巡视 + 高峰答疑」辅导机制：平时上课助教分班定点巡视，学员有问题当场解决不用都攒到课后；考前高峰每天固定两个时间段集中答疑，提前收集问题整理成共性问题和一个性问题，共性问题统一在群里发讲解，个性问题单独辅导，避免重复回答效率提升很多。② 整理高频错题库和知识点总结：把大家常错的题、易混淆知识点整理出来配上详细解析发在群里，很多问题学员自己就能找到答案不用再问助教。另外建立问题跟踪机制，每个问题都记录解决了才闭环不会遗漏。经过调整后答疑效率提升一倍多，学员考试通过率也提高不少，最后班级整体通过率稳居前列。`,
    keyPoints: [
      { id: 'kp1', label: '挑战：学员基础参差不齐，考前答疑量暴增', weight: 20 },
      { id: 'kp2', label: '问题：重复问题多，答疑没章法遗漏多', weight: 20 },
      { id: 'kp3', label: '优化一：定点巡视 + 高峰答疑机制', weight: 25 },
      { id: 'kp4', label: '优化二：整理高频错题库和知识点总结', weight: 20 },
      { id: 'kp5', label: '结果：答疑效率提升一倍多，通过率提高', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '最大挑战是考前答疑量暴增，学员基础参差不齐', correct: true },
      { id: 'c2', text: '优化了答疑机制和整理了高频错题库', correct: false },
      { id: 'c3', text: '助教经历只讲了困难，没有讲解决', correct: false, explain: '要讲解决方法和结果' },
      { id: 'c4', text: '结果不需要量化', correct: false, explain: '要量化结果如效率提升一倍多' }
    ],
    tags: ['HR面', '助教经历', 'STAR'], difficulty: 2, isBoss: false
  },
  {
    id: 'hr-03', floorId: 'floor-8', order: 3,
    title: '你为什么选择做后端开发+AI 应用这个方向？',
    interviewerLine: '为什么选择后端开发 + AI 应用这个方向？',
    standardAnswer: `主要有两方面考虑：首先，后端开发是工程的基础，所有业务落地最终都要靠后端支撑，它涉及架构、性能、数据、稳定性这些非常核心的能力，能把基础打扎实。我本身对编程和系统设计很感兴趣，喜欢研究架构和性能优化这些东西，所以选择了后端方向。

然后，AI 是未来的趋势，现在大模型发展很快，纯 AI 算法门槛很高，但 AI 和业务结合的应用开发缺口很大，也就是把 AI 能力落地到真实业务场景里，这恰恰需要懂后端开发、又懂 AI 应用的人。我本身是人工智能专业，有专业基础，同时又有后端开发的技术积累，两者结合起来，不管是技术竞争力还是业务价值都会更大，也能做更多有价值的事情。而且我自己也在这个方向做了两个项目，把 RAG、函数调用这些 AI 技术落地到教育和餐饮场景里，确实感受到了 AI 给业务带来的价值，也更加坚定了走这个方向的想法。`,
    keyPoints: [
      { id: 'kp1', label: '后端是工程基础，涉及架构、性能、数据、稳定性', weight: 25 },
      { id: 'kp2', label: '对编程和系统设计感兴趣，喜欢架构和性能优化', weight: 15 },
      { id: 'kp3', label: 'AI 是趋势，AI + 业务落地缺口大', weight: 25 },
      { id: 'kp4', label: '人工智能专业背景 + 后端技术积累，复合竞争力', weight: 20 },
      { id: 'kp5', label: '两个项目实践感受到 AI 业务价值，坚定方向', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '后端是工程基础，AI + 业务落地缺口大', correct: true },
      { id: 'c2', text: '人工智能专业背景 + 后端技术积累是复合优势', correct: false },
      { id: 'c3', text: '选择方向只是因为薪资高', correct: false, explain: '要讲兴趣和趋势' },
      { id: 'c4', text: '不需要结合自己的项目实践', correct: false, explain: '要结合项目实践谈感受' }
    ],
    tags: ['HR面', '职业方向'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-04', floorId: 'floor-8', order: 4,
    title: '你觉得自己最大的优势是什么？目前还有哪些不足？',
    interviewerLine: '你最大优势是什么？还有哪些不足？',
    standardAnswer: `我觉得自己最大的优势有三点：① 技术栈比较全面，不仅有扎实的 Java 后端基础，熟悉微服务、分布式这些主流技术，还有 AI 应用落地的项目经验，做过 RAG、智能客服、智能推荐这些功能，是后端+AI 的复合背景，能适配现在很多业务的需求。② 学习能力和动手能力比较强，专业成绩排名前 3%，新技术我能快速上手，而且喜欢自己做项目实践，不是只停留在理论层面。遇到问题也会主动钻研，想办法解决，不会等着别人教。③ 做事比较认真负责，有始有终，做项目的时候会考虑到性能、容错、边界情况这些细节，不是能跑就行。另外沟通协调能力也还可以，做过助教负责人，也和前端、产品同学配合过项目，沟通起来比较顺畅。

不足的话，我觉得自己大型分布式系统的实战经验还不够多，毕竟都是学生项目，用户量和并发量和企业级的还是有差距。另外在中间件的底层原理、深度调优方面，还有欠缺。现在我也在看相关的源码和资料，多做实战和压测，希望能尽快弥补这些不足。`,
    keyPoints: [
      { id: 'kp1', label: '优势一：Java 后端 + AI 应用复合背景', weight: 25 },
      { id: 'kp2', label: '优势二：学习能力强，专业前 3%，动手实践多', weight: 20 },
      { id: 'kp3', label: '优势三：认真负责，考虑性能、容错、边界', weight: 20 },
      { id: 'kp4', label: '不足：大型分布式系统实战经验不够', weight: 20 },
      { id: 'kp5', label: '正在弥补：看源码、多做实战和压测', weight: 15 }
    ],
    choices: [
      { id: 'c1', text: '优势要讲技术复合背景 + 学习能力 + 做事态度', correct: true },
      { id: 'c2', text: '不足要讲真实短板并说明正在改进', correct: false },
      { id: 'c3', text: '讲不足时说"我没有不足"', correct: false, explain: '要讲真实短板并说明改进' },
      { id: 'c4', text: '优势不需要结合具体数据', correct: false, explain: '结合数据更有说服力' }
    ],
    tags: ['HR面', '优势不足'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-05', floorId: 'floor-8', order: 5,
    title: '你对我们公司有什么了解？为什么想来我们这里实习？',
    interviewerLine: '你对我们公司有什么了解？为什么想来实习？',
    standardAnswer: `我了解到咱们公司是做 XXX 方向的，在行业内很有影响力，技术氛围很好，而且在 AI 应用这一块也有很多布局和实践，我非常认同公司的发展方向。想来这里实习主要有三个原因：① 技术栈非常匹配，咱们公司用的 Java 后端、微服务、还有 AI 应用这些，都是我一直在学习和做项目的方向，我可以很快上手，也能把我之前的项目经验用起来，贡献自己的价值。② 我很看好咱们公司的业务和发展，希望能在真实的企业项目里锻炼自己，学习大厂的开发规范、架构设计和项目管理经验，这些都是学生项目里学不到的。③ 我希望能跟着优秀的团队和前辈学习，提升自己的技术能力和工程能力，积累真实的项目经验，为以后的职业发展打好基础。我也特别希望能有这个机会加入咱们团队。`,
    keyPoints: [
      { id: 'kp1', label: '表达对公司的了解：方向、影响力、技术氛围、AI 布局', weight: 20 },
      { id: 'kp2', label: '原因一：技术栈匹配，能快速上手贡献价值', weight: 25 },
      { id: 'kp3', label: '原因二：想在真实企业项目锻炼，学习大厂规范', weight: 25 },
      { id: 'kp4', label: '原因三：希望跟优秀团队学习，打好职业基础', weight: 20 },
      { id: 'kp5', label: '表达加入意愿', weight: 10 }
    ],
    choices: [
      { id: 'c1', text: '要表达对公司的了解和认同', correct: true },
      { id: 'c2', text: '技术栈匹配、想学企业规范、想跟优秀团队学习是三个好理由', correct: false },
      { id: 'c3', text: '只需要说"想找个实习"', correct: false, explain: '要表达对公司的了解和真实动机' },
      { id: 'c4', text: '不需要表达加入意愿', correct: false, explain: '要表达加入意愿' }
    ],
    tags: ['HR面', '公司了解', '求职动机'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-06', floorId: 'floor-8', order: 6,
    title: '你的职业规划是什么？希望通过这段实习获得什么成长？',
    interviewerLine: '你的职业规划是什么？希望从实习获得什么？',
    standardAnswer: `我的职业规划分阶段：短期（实习和毕业一两年），希望能扎实后端开发功底，熟练掌握企业级开发规范和技术栈，积累真实项目经验，成为一名合格的后端开发工程师。中期（3-5 年），希望能深入研究分布式架构和 AI 应用落地，成为高级后端开发工程师，能独立负责核心模块和系统设计，在后端+AI 这个方向上深耕，成为有复合能力的技术人员。长期，希望能成长为技术专家，在自己的领域做深做透，能主导复杂的系统设计和技术选型，解决复杂的技术问题。

对于这段实习，我最希望获得三点成长：① 学习企业级的开发规范和流程，比如代码规范、版本管理、发布流程，养成良好的工程习惯。② 在真实业务场景里锻炼技术，提升自己的系统设计、性能优化、问题排查的能力，积累实战经验。③ 了解团队协作的方式，学习前辈们的经验，提升自己的沟通和协作能力，更好地融入团队。`,
    keyPoints: [
      { id: 'kp1', label: '短期：扎实后端功底，成为合格后端工程师', weight: 20 },
      { id: 'kp2', label: '中期：深入研究分布式和 AI 应用，成为高级工程师', weight: 20 },
      { id: 'kp3', label: '长期：成长为技术专家，主导系统设计和技术选型', weight: 20 },
      { id: 'kp4', label: '实习成长一：学企业开发规范和流程', weight: 20 },
      { id: 'kp5', label: '实习成长二/三：真实业务锻炼 + 团队协作能力', weight: 20 }
    ],
    choices: [
      { id: 'c1', text: '职业规划要分短期、中期、长期来讲', correct: true },
      { id: 'c2', text: '实习成长要讲学习规范、锻炼技术、提升协作', correct: false },
      { id: 'c3', text: '职业规划只需要讲短期', correct: false, explain: '要分阶段讲' },
      { id: 'c4', text: '实习只想拿工资，不想学东西', correct: false, explain: '要表达学习成长意愿' }
    ],
    tags: ['HR面', '职业规划'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-07', floorId: 'floor-8', order: 7,
    title: '你能实习多久？每周可以到岗几天？最快什么时候可以入职？',
    interviewerLine: '能实习多久？每周到岗几天？最快什么时候入职？',
    standardAnswer: `我可以长期实习，至少能实习 6 个月，每周可以全职到岗 5 天，周末也可以配合项目进度。因为我现在大三，课程已经不多了，时间比较充裕，最快一周之内就可以入职，我可以提前处理好学校的事情，随时准备入职。`,
    keyPoints: [
      { id: 'kp1', label: '至少实习 6 个月', weight: 25 },
      { id: 'kp2', label: '每周全职到岗 5 天，周末可配合', weight: 25 },
      { id: 'kp3', label: '大三课程不多，时间充裕', weight: 25 },
      { id: 'kp4', label: '最快一周内入职，可提前处理学校事务', weight: 25 }
    ],
    choices: [
      { id: 'c1', text: '回答要明确实习时长、每周到岗天数、入职时间', correct: true },
      { id: 'c2', text: '可以表达时间充裕、随时准备入职', correct: false },
      { id: 'c3', text: '回答"看情况吧"', correct: false, explain: '要给明确答复' },
      { id: 'c4', text: '不需要说明学校课程情况', correct: false, explain: '说明课程不多能佐证时间充裕' }
    ],
    tags: ['HR面', '实习时间'], difficulty: 1, isBoss: false
  },
  {
    id: 'hr-08', floorId: 'floor-8', order: 8,
    title: '你还有什么想问我的吗？',
    interviewerLine: '你还有什么想问我的吗？',
    standardAnswer: `我想请教一下，咱们团队现在主要的技术栈是什么样的？还有我如果入职的话，主要会负责哪个方向的工作，有没有相关的培养计划呀？`,
    keyPoints: [
      { id: 'kp1', label: '问团队技术栈', weight: 35 },
      { id: 'kp2', label: '问入职后负责方向', weight: 35 },
      { id: 'kp3', label: '问是否有培养计划', weight: 30 }
    ],
    choices: [
      { id: 'c1', text: '可以问团队技术栈、负责方向、培养计划', correct: true },
      { id: 'c2', text: '回答"没有了"', correct: false, explain: '要表现出对岗位的兴趣' },
      { id: 'c3', text: '可以问薪资福利等敏感问题', correct: false, explain: '实习面试阶段问技术成长更合适' },
      { id: 'c4', text: '问的问题要体现对岗位的兴趣和成长意愿', correct: false }
    ],
    tags: ['HR面', '反问'], difficulty: 1, isBoss: true
  },
];

export const getQuestion = (qid: string) => questions.find((q) => q.id === qid);
