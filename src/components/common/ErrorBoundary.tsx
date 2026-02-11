import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-20 glass-card bg-red-950/20 border-red-500/20">
                    <h2 className="text-xl font-bold mb-4">Visual Interface Error</h2>
                    <p className="text-white/40 mb-6 text-center">We encountered a problem initializing the 3D system for this product.</p>
                    <button
                        className="btn-primary-shop px-6 py-2"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Retry Initialization
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
