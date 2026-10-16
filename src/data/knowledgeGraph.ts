import type { GraphEdge, GraphNode } from '../types';

// ============ 知识图谱数据 ============
// 三层结构：底层模块 → 中层知识点 → 顶层项目实战
export const graphNodes: GraphNode[] = [
  // 底层：模块
  { id: 'm-java', label: 'Java 基础', layer: 'module', floorId: 'floor-1', desc: '语法回廊' },
  { id: 'm-dist', label: '微服务分布式', layer: 'module', floorId: 'floor-2', desc: '分布式迷城' },
  { id: 'm-db', label: '数据库缓存', layer: 'module', floorId: 'floor-3', desc: '数据深渊' },
  { id: 'm-ai', label: 'AI 应用', layer: 'module', floorId: 'floor-4', desc: 'AI 炼金工坊' },

  // 中层：知识点
  { id: 'p-hashmap', label: 'HashMap', layer: 'point', floorId: 'floor-1' },
  { id: 'p-chm', label: 'ConcurrentHashMap', layer: 'point', floorId: 'floor-1' },
  { id: 'p-threadlocal', label: 'ThreadLocal', layer: 'point', floorId: 'floor-1' },
  { id: 'p-seata', label: 'Seata AT', layer: 'point', floorId: 'floor-2' },
  { id: 'p-sentinel', label: 'Sentinel 限流', layer: 'point', floorId: 'floor-2' },
  { id: 'p-mq', label: '消息队列削峰', layer: 'point', floorId: 'floor-2' },
  { id: 'p-redis-lua', label: 'Redis+Lua 原子', layer: 'point', floorId: 'floor-3' },
  { id: 'p-mvcc', label: 'MVCC', layer: 'point', floorId: 'floor-3' },
  { id: 'p-index', label: '索引优化', layer: 'point', floorId: 'floor-3' },
  { id: 'p-rag', label: 'RAG 检索', layer: 'point', floorId: 'floor-4' },
  { id: 'p-rerank', label: '混合召回 Rerank', layer: 'point', floorId: 'floor-4' },
  { id: 'p-stream', label: '流式输出', layer: 'point', floorId: 'floor-4' },

  // 顶层：项目实战
  { id: 'proj-yunguan', label: '云观教育', layer: 'project', cardId: 'projcard-4f', desc: 'AI + 在线教育平台' },
  { id: 'proj-zhihui', label: '智汇餐饮', layer: 'project', cardId: 'projcard-3f', desc: '高并发餐饮下单系统' },
];

export const graphEdges: GraphEdge[] = [
  // 模块 → 知识点
  { from: 'm-java', to: 'p-hashmap' },
  { from: 'm-java', to: 'p-chm' },
  { from: 'm-java', to: 'p-threadlocal' },
  { from: 'm-dist', to: 'p-seata' },
  { from: 'm-dist', to: 'p-sentinel' },
  { from: 'm-dist', to: 'p-mq' },
  { from: 'm-db', to: 'p-redis-lua' },
  { from: 'm-db', to: 'p-mvcc' },
  { from: 'm-db', to: 'p-index' },
  { from: 'm-ai', to: 'p-rag' },
  { from: 'm-ai', to: 'p-rerank' },
  { from: 'm-ai', to: 'p-stream' },

  // 知识点 → 项目（八股落地）
  { from: 'p-hashmap', to: 'proj-yunguan' },
  { from: 'p-chm', to: 'proj-yunguan' },
  { from: 'p-threadlocal', to: 'proj-yunguan' },
  { from: 'p-seata', to: 'proj-zhihui' },
  { from: 'p-sentinel', to: 'proj-zhihui' },
  { from: 'p-mq', to: 'proj-zhihui' },
  { from: 'p-redis-lua', to: 'proj-zhihui' },
  { from: 'p-index', to: 'proj-zhihui' },
  { from: 'p-mvcc', to: 'proj-zhihui' },
  { from: 'p-rag', to: 'proj-yunguan' },
  { from: 'p-rerank', to: 'proj-yunguan' },
  { from: 'p-stream', to: 'proj-yunguan' },
];
