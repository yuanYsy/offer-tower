// ============ 核心数据结构 ============

export interface KeyPoint {
  id: string;
  label: string; // 关键点描述
  weight: number; // 权重，全部关键点 weight 之和应为 100
}

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
  explain?: string;
}

export interface Question {
  id: string; // "db-01"
  floorId: string; // "floor-3"
  order: number;
  title: string;
  interviewerLine: string; // 面试官口语化提问
  standardAnswer: string; // 标准答题话术（支持换行）
  keyPoints: KeyPoint[];
  choices: Choice[]; // 4 个选项
  tags: string[];
  difficulty: 1 | 2 | 3;
  isBoss: boolean;
}

export type CardType = 'basic' | 'advanced' | 'script' | 'story' | 'project';
export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface Card {
  id: string;
  type: CardType;
  rarity: Rarity;
  title: string;
  content: string; // 背面内容；project 卡为「项目实战话术」
  module: string; // 所属楼层名
  /** 项目卡专用 */
  frontPoint?: string; // 正面：八股考点提炼
  projectContext?: string; // 关联项目背景，如「云观教育」
  relatedModule?: string; // 关联模块（楼层名）
}

// ============ 知识图谱 ============

export type GraphLayer = 'module' | 'point' | 'project';

export interface GraphNode {
  id: string;
  label: string;
  layer: GraphLayer;
  /** module/point 节点所属楼层 id */
  floorId?: string;
  /** project 节点关联的项目卡 id */
  cardId?: string;
  desc?: string;
}

export interface GraphEdge {
  from: string; // GraphNode id
  to: string; // GraphNode id
}

export interface Interviewer {
  id: string;
  name: string;
  title: string;
  avatarSeed: string; // 用于生成抽象剪影的配色种子
  personality: string;
  lines: {
    greet: string[];
    perfect: string[];
    good: string[];
    bad: string[];
  };
}

export interface Floor {
  id: string;
  index: number; // 1-8
  name: string;
  subtitle: string;
  icon: string; // lucide 图标名或 emoji
  theme: { primary: string; secondary: string };
  interviewer: Interviewer;
  questionIds: string[];
}

// ============ 玩家状态 ============

export type Grade = 'S' | 'A' | 'B' | 'C';

export interface QuestionRecord {
  questionId: string;
  bestGrade: Grade;
  bestHitRate: number; // 0-1
  attempts: number;
  lastMode: 'oral' | 'choice';
  clearedAt: number; // 首次通关时间戳
}

export interface PlayerState {
  nickname: string;
  avatarId: string; // keyboard / coffee / backpack
  createdAt: number;

  level: number;
  exp: number;
  hp: number; // 0-5
  maxHp: number;

  // 进度
  unlockedFloor: number; // 已解锁到第几层（1-8）
  questionRecords: Record<string, QuestionRecord>;
  revengeQueue: string[]; // 复仇题 questionId
  favor: Record<string, number>; // interviewerId -> 好感度 0-100

  // 卡牌与宝箱
  cards: string[]; // 已解锁 cardId

  // 统计
  combo: number;
  maxCombo: number;
  totalAnswered: number;
  sCount: number;
  totalStudyMs: number;
  sessionStart: number; // 本次会话开始时间，用于累计时长

  // 模拟面试
  examCount: number;
  bestExamScore: number;

  // 登塔庆祝进度（已播放「更近一步」过场的通关层数）
  celebratedClears?: number;
  // 是否已看过 Offer 录用通知书
  offerSeen?: boolean;

  soundOn: boolean;
}

// ============ 战斗结算 ============

export interface BattleResult {
  questionId: string;
  grade: Grade;
  hitRate: number;
  expGained: number;
  favorGained: number;
  hpLost: boolean;
  combo: number;
  /** 通关楼层时必掉落的项目卡 id（未通关/已获得过则为 null） */
  droppedCardId: string | null;
  /** 本次作答是否使所在楼层全通关 */
  floorCleared: boolean;
  mode: 'oral' | 'choice';
}
