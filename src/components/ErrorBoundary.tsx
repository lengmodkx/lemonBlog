'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 以便下次渲染时显示降级 UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-paper-50 dark:bg-ink-DEFAULT">
          <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-card rounded-2xl shadow-lg border border-lavender-200 dark:border-lavender-800">
            <div className="text-center">
              <div className="text-6xl mb-4">😵</div>
              <h2 className="text-xl font-bold text-ink dark:text-text-primary mb-4">
                出错了
              </h2>
              <p className="text-text-muted mb-6">
                页面加载时发生了错误，请刷新页面重试。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                刷新页面
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg overflow-auto">
                <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
