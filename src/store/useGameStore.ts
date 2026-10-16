import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BattleResult,
  Grade,
  PlayerState,
  QuestionRecord,
} from '../types';
import { questions } from '../data/questions';
import { floors, getFloor } from '../data/floors';
import { FLOOR_PROJECT_CARD } from '../data/projectCards';

// ============ 常量与工具 ============

export const MAX_HP = 5;
export const EXP_PER_LEVEL = 250;

export const getLevel = (exp: number) => Math.floor(exp / EXP_PER_LEVEL) + 1;
export const getLevelProgress = (exp: number) => (exp % EXP_PER_LEVEL) / EXP_PER_LEVEL;

const GRADE_ORDER: Record<Grade, number> = { S: 4, A: 3, B: 2, C: 1 };
export const isPassed = (g: Grade | undefined) => g === 'S' || g === 'A' || g === 'B';

const gradeFromHitRate = (hitRate: number): Grade => {
  if (hitRate >= 0.9) return 'S';
  if (hitRate >= 0.7) return 'A';
  if (hitRate >= 0.5) return 'B';
  return 'C';
};

// 页面层实时预估评级用
export const predictGrade = gradeFromHitRate;

const BASE_EXP: Record<Grade, number> = { S: 100, A: 70, B: 40, C: 0 };
const CHOICE_EXP: Record<Grade, number> = { S: 60, A: 40, B: 0, C: 0 };
const FAVOR: Record<Grade, number> = { S: 5, A: 3, B: 1, C: 0 };

function createDefaultPlayer(nickname: string, avatarId: string): PlayerState {
  const favor: Record<string, number> = {};
  floors.forEach((f) => (favor[f.interviewer.id] = 50));
  return {
    nickname,
    avatarId,
    createdAt: Date.now(),
    level: 1,
    exp: 0,
    hp: MAX_HP,
    maxHp: MAX_HP,
    unlockedFloor: 1,
    questionRecords: {},
    revengeQueue: [],
    favor,
    cards: [],
    combo: 0,
    maxCombo: 0,
    totalAnswered: 0,
    sCount: 0,
    totalStudyMs: 0,
    sessionStart: Date.now(),
    examCount: 0,
    bestExamScore: 0,
    soundOn: false,
  };
}

// ============ Store 定义 ============

interface GameStore {
  player: PlayerState | null;

  setNickname: (nickname: string) => void;
  setAvatar: (avatarId: string) => void;
  startBattle: (questionId: string) => void;
  submitSelfCheck: (questionId: string, hitKeyPointIds: string[]) => BattleResult;
  submitChoice: (questionId: string, choiceId: string, timeMs: number) => BattleResult;
  nextQuestion: (currentQid: string) => string | null;
  resetFloor: (floorId: string) => void;
  unlockCard: (cardId: string) => void;
  resetAll: () => void;
  /** 云端存档拉取：整体替换本地玩家状态（persist 自动落盘） */
  importCloudState: (player: PlayerState) => void;
  addToRevengeQueue: (questionId: string) => void;
  removeFromRevengeQueue: (questionId: string) => void;

  toggleSound: () => void;
  addStudyTime: (ms: number) => void;
  recordExam: (score: number) => void;
  markCelebrated: (clearedCount: number) => void;
  markOfferSeen: () => void;
}

// 结算一次战斗，返回结果（纯内部函数）
function settle(
  player: PlayerState,
  questionId: string,
  grade: Grade,
  hitRate: number,
  mode: 'oral' | 'choice',
): { player: PlayerState; result: BattleResult } {
  const q = questions.find((x) => x.id === questionId)!;
  const floor = getFloor(q.floorId)!;
  const p: PlayerState = JSON.parse(JSON.stringify(player));

  const passed = isPassed(grade);

  // Combo
  p.combo = passed ? p.combo + 1 : 0;
  p.maxCombo = Math.max(p.maxCombo, p.combo);

  // 经验（连击加成）
  let exp = mode === 'oral' ? BASE_EXP[grade] : CHOICE_EXP[grade];
  if (p.combo >= 5) exp = Math.round(exp * 1.5);
  else if (p.combo >= 3) exp = Math.round(exp * 1.2);
  p.exp += exp;
  p.level = getLevel(p.exp);

  // 好感度
  const favorGain = FAVOR[grade];
  p.favor[floor.interviewer.id] = Math.min(
    100,
    Math.max(0, (p.favor[floor.interviewer.id] ?? 50) + favorGain),
  );

  // HP
  const hpLost = grade === 'C';
  if (hpLost) p.hp = Math.max(0, p.hp - 1);

  // 题目记录
  const prev = p.questionRecords[questionId];
  const record: QuestionRecord = {
    questionId,
    bestGrade:
      prev && GRADE_ORDER[prev.bestGrade] > GRADE_ORDER[grade] ? prev.bestGrade : grade,
    bestHitRate: Math.max(prev?.bestHitRate ?? 0, hitRate),
    attempts: (prev?.attempts ?? 0) + 1,
    lastMode: mode,
    clearedAt: passed ? prev?.clearedAt ?? Date.now() : (prev?.clearedAt ?? 0),
  };
  p.questionRecords[questionId] = record;

  // 复仇队列
  if (grade === 'C' && !p.revengeQueue.includes(questionId)) p.revengeQueue.push(questionId);
  if (passed && p.revengeQueue.includes(questionId))
    p.revengeQueue = p.revengeQueue.filter((id) => id !== questionId);

  // 统计
  p.totalAnswered += 1;
  if (grade === 'S') p.sCount += 1;

  // 楼层通关检测：全部题目均通过 → 解锁下一层 + 回满血 + 必掉落该层项目卡
  let droppedCardId: string | null = null;
  const floorCleared = floor.questionIds.every((qid) => {
    const r = p.questionRecords[qid];
    return r && isPassed(r.bestGrade);
  });
  if (floorCleared) {
    p.unlockedFloor = Math.max(p.unlockedFloor, Math.min(8, floor.index + 1));
    p.hp = p.maxHp;
    // 通关必掉落该层绑定的项目实战映射卡（只掉一次）
    const cardId = FLOOR_PROJECT_CARD[floor.id];
    if (cardId && !p.cards.includes(cardId)) {
      p.cards.push(cardId);
      droppedCardId = cardId;
    }
  }

  return {
    player: p,
    result: {
      questionId,
      grade,
      hitRate,
      expGained: exp,
      favorGained: favorGain,
      hpLost,
      combo: p.combo,
      droppedCardId,
      floorCleared,
      mode,
    },
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      player: null,

      setNickname: (nickname) =>
        set((s) => ({
          player: s.player
            ? { ...s.player, nickname }
            : createDefaultPlayer(nickname, 'keyboard'),
        })),

      setAvatar: (avatarId) =>
        set((s) => ({
          player: s.player
            ? { ...s.player, avatarId }
            : createDefaultPlayer('无名挑战者', avatarId),
        })),

      startBattle: () => {
        // 预留：可在此埋点/校验 HP；当前由页面层处理导航
      },

      submitSelfCheck: (questionId, hitKeyPointIds) => {
        const { player } = get();
        if (!player) throw new Error('无存档');
        const q = questions.find((x) => x.id === questionId)!;
        const total = q.keyPoints.reduce((sum, kp) => sum + kp.weight, 0);
        const hit = q.keyPoints
          .filter((kp) => hitKeyPointIds.includes(kp.id))
          .reduce((sum, kp) => sum + kp.weight, 0);
        const hitRate = total === 0 ? 0 : hit / total;
        const grade = gradeFromHitRate(hitRate);
        const { player: p, result } = settle(player, questionId, grade, hitRate, 'oral');
        set({ player: p });
        return result;
      },

      submitChoice: (questionId, choiceId, timeMs) => {
        const { player } = get();
        if (!player) throw new Error('无存档');
        const q = questions.find((x) => x.id === questionId)!;
        const choice = q.choices.find((c) => c.id === choiceId);
        const correct = !!choice?.correct;
        const grade: Grade = !correct ? 'C' : timeMs < 10_000 ? 'S' : 'A';
        const hitRate = correct ? 1 : 0;
        const { player: p, result } = settle(player, questionId, grade, hitRate, 'choice');
        set({ player: p });
        return result;
      },

      nextQuestion: (currentQid) => {
        const { player } = get();
        const q = questions.find((x) => x.id === currentQid);
        if (!q || !player) return null;
        const floor = getFloor(q.floorId)!;
        const floorQuestions = floor.questionIds
          .map((id) => questions.find((x) => x.id === id))
          .filter((x): x is NonNullable<typeof x> => !!x)
          .sort((a, b) => a.order - b.order);
        const unpassed = (x: (typeof floorQuestions)[number]) => {
          const r = player.questionRecords[x.id];
          return !r || !isPassed(r.bestGrade);
        };
        const after = floorQuestions.filter((x) => x.order > q.order).find(unpassed);
        if (after) return after.id;
        return floorQuestions.find(unpassed)?.id ?? null;
      },

      resetFloor: (floorId) =>
        set((s) => {
          if (!s.player) return s;
          const floor = getFloor(floorId);
          if (!floor) return s;
          const p: PlayerState = JSON.parse(JSON.stringify(s.player));
          floor.questionIds.forEach((qid) => delete p.questionRecords[qid]);
          p.revengeQueue = p.revengeQueue.filter(
            (qid) => !floor.questionIds.includes(qid),
          );
          return { player: p };
        }),

      unlockCard: (cardId) =>
        set((s) => {
          if (!s.player || s.player.cards.includes(cardId)) return s;
          return { player: { ...s.player, cards: [...s.player.cards, cardId] } };
        }),

      resetAll: () => set({ player: null }),
      importCloudState: (player) => set({ player }),

      addToRevengeQueue: (questionId) =>
        set((s) => {
          if (!s.player || s.player.revengeQueue.includes(questionId)) return s;
          return {
            player: { ...s.player, revengeQueue: [...s.player.revengeQueue, questionId] },
          };
        }),

      removeFromRevengeQueue: (questionId) =>
        set((s) =>
          s.player
            ? {
                player: {
                  ...s.player,
                  revengeQueue: s.player.revengeQueue.filter((id) => id !== questionId),
                },
              }
            : s,
        ),

      toggleSound: () =>
        set((s) => (s.player ? { player: { ...s.player, soundOn: !s.player.soundOn } } : s)),

      addStudyTime: (ms) =>
        set((s) =>
          s.player
            ? { player: { ...s.player, totalStudyMs: s.player.totalStudyMs + ms } }
            : s,
        ),

      recordExam: (score) =>
        set((s) =>
          s.player
            ? {
                player: {
                  ...s.player,
                  examCount: s.player.examCount + 1,
                  bestExamScore: Math.max(s.player.bestExamScore, score),
                },
              }
            : s,
        ),

      markCelebrated: (clearedCount) =>
        set((s) =>
          s.player
            ? { player: { ...s.player, celebratedClears: clearedCount } }
            : s,
        ),

      markOfferSeen: () =>
        set((s) => (s.player ? { player: { ...s.player, offerSeen: true } } : s)),
    }),
    {
      name: 'offer-tower-save',
      partialize: (s) => ({ player: s.player }),
    },
  ),
);

// ============ 页面层常用选择器 ============

export const selectQuestion = (qid: string) => questions.find((q) => q.id === qid);

export const getFloorProgress = (player: PlayerState | null, floorId: string) => {
  const floor = getFloor(floorId);
  if (!floor) return { cleared: 0, total: 0 };
  const cleared = player
    ? floor.questionIds.filter((qid) => {
        const r = player.questionRecords[qid];
        return r && isPassed(r.bestGrade);
      }).length
    : 0;
  return { cleared, total: floor.questionIds.length };
};

// 楼层掌握度 0-100（S=100 A=85 B=65 C=30 未答=0 取平均）
export const getFloorMastery = (player: PlayerState | null, floorId: string): number => {
  const floor = getFloor(floorId);
  if (!floor || !player) return 0;
  const score: Record<Grade, number> = { S: 100, A: 85, B: 65, C: 30 };
  const sum = floor.questionIds.reduce((acc, qid) => {
    const g = player.questionRecords[qid]?.bestGrade;
    return acc + (g ? score[g] : 0);
  }, 0);
  return Math.round(sum / floor.questionIds.length);
};
