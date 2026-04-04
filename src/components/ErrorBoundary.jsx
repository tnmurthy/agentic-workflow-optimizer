import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div
                    style={{
                        padding: 'var(--spacing-lg)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--accent-danger)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        marginTop: 'var(--spacing-md)',
                    }}
                >
                    <p style={{ fontWeight: 'bold', color: 'var(--accent-danger)', marginBottom: '0.5rem' }}>
                        Something went wrong loading this section.
                    </p>
                    <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: 'var(--spacing-md)' }}>
                        {this.state.error?.message ?? 'An unexpected error occurred.'}
                    </p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
