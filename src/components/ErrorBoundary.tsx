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
        <div className="min-h-screen flex items-center justify-center bg-paper">
          <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-paper-dark rounded-hand border border-border">
            <div className="text-center">
              <div className="text-6xl mb-4">😵</div>
              <h2 className="font-hand text-2xl text-ink mb-4">
                出错了
              </h2>
              <p className="text-ink-light mb-6">
                页面加载时发生了错误，请刷新页面重试。
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-accent text-white rounded-sm hover:bg-accent-muted transition-colors"
              >
                刷新页面
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-paper-dark rounded-sm overflow-auto border border-border">
                <p className="text-sm text-accent font-mono">
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
