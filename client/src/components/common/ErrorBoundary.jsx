import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface">
          <AlertTriangle className="w-14 h-14 text-error mb-4" />
          <h1 className="text-2xl font-bold text-dark mb-2">Something went wrong</h1>
          <p className="text-muted text-center max-w-md">
            Please refresh the page or return to the dashboard.
          </p>
          <button
            type="button"
            className="mt-6 px-6 py-3 rounded-xl bg-primary text-navy font-semibold transition-all hover:brightness-110"
            onClick={() => window.location.assign('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
