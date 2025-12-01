import React from 'react';
import { Target, Users, Layers, Layout, Zap } from 'lucide-react';

const ProjectInfo = () => {
    return (
        <div className="card" style={{ marginTop: 'var(--spacing-xl)', border: '1px solid var(--glass-border)' }}>
            <div className="card-header">
                <h2 className="flex items-center gap-sm">
                    <Layout size={24} style={{ color: 'var(--accent-primary)' }} />
                    Project Overview
                </h2>
            </div>

            <div className="card-body">
                {/* 1. Overview */}
                <section style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        The <strong>Agentic Workflow Token Optimization Web App</strong> is an interactive, educational tool designed to demonstrate how agentic workflows can significantly reduce LLM token usage and costs compared to monolithic prompts. It serves as a decision-support aid for teams evaluating AI architectures.
                    </p>
                </section>

                <div className="grid grid-2 gap-lg">
                    {/* 2. Goals */}
                    <div>
                        <h3 className="flex items-center gap-sm" style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)', marginBottom: 'var(--spacing-md)' }}>
                            <Target size={20} /> Goals & Objectives
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            <li><strong>Visualize Savings:</strong> Make token and cost reductions tangible and easy to understand.</li>
                            <li><strong>Realistic Modeling:</strong> Allow users to plug in their own pricing and usage assumptions.</li>
                            <li><strong>Premium Experience:</strong> Showcase modern frontend engineering with a polished, high-tech design.</li>
                        </ul>
                    </div>

                    {/* 3. Target Users */}
                    <div>
                        <h3 className="flex items-center gap-sm" style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)', marginBottom: 'var(--spacing-md)' }}>
                            <Users size={20} /> Target Users
                        </h3>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                            <li><strong>AI Product Managers:</strong> Evaluating architectures and vendor costs.</li>
                            <li><strong>LLM Engineers:</strong> Designing and tuning agentic pipelines.</li>
                            <li><strong>Finance & Ops:</strong> Modeling long-term LLM spend and ROI.</li>
                        </ul>
                    </div>
                </div>

                {/* 4. Key Features */}
                <section style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--glass-border)' }}>
                    <h3 className="flex items-center gap-sm" style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)', marginBottom: 'var(--spacing-md)' }}>
                        <Layers size={20} /> Key Capabilities
                    </h3>
                    <div className="grid grid-3 gap-md">
                        {[
                            "Interactive Workflow Diagram",
                            "Real-time Token Comparison",
                            "Multi-Provider Pricing",
                            "Custom Scenario Builder",
                            "Benchmark Scenarios",
                            "ROI & Cost Projections"
                        ].map((feature, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-tertiary)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.95rem'
                            }}>
                                <Zap size={14} style={{ color: 'var(--accent-success)' }} />
                                {feature}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProjectInfo;
