import React from 'react';
import { Workflow } from 'lucide-react';

const Header = () => {
    return (
        <header className="card" style={{ background: 'var(--gradient-primary)', marginBottom: 'var(--spacing-xl)' }}>
            <div className="flex items-center gap-md mb-md">
                <Workflow size={48} />
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Agentic Workflow Token Optimizer</h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                        Reduce AI Costs by up to 60% with Modular Agent Pipelines
                    </p>
                </div>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', marginBottom: 0 }}>
                Discover how breaking down monolithic prompts into specialized agents can dramatically reduce token usage and operational costs for your AI applications.
            </p>
        </header>
    );
};

export default Header;
