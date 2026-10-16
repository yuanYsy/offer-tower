import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// 全局错误边界：单个页面崩溃时显示全息故障面板，避免整站白屏/闪烁
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[OfferTower] 页面异常:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-[#050A14] px-6 text-center">
          <div
            className="font-display text-2xl font-bold tracking-widest text-neon-cyan"
            style={{ textShadow: '0 0 24px rgba(34,211,238,0.6)' }}
          >
            系统短暂故障
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-txt-secondary">
            星塔能量波动导致本页渲染异常，你的存档保存在本地不会丢失。点击下方按钮重新校准。
          </p>
          <button
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
            className="rounded-full border border-neon-cyan/50 bg-neon-cyan/10 px-8 py-3 text-sm font-semibold text-neon-cyan transition-all hover:scale-105 active:scale-95"
          >
            重新校准 · Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
