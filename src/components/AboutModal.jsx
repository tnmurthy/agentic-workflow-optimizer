import React from 'react';
import { X, BookOpen, Target, Users, Layers, Code, Zap, Layout } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 14, 23, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-md)'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: 'var(--glass-shadow)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--bg-secondary)',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <div className="flex items-center gap-sm">
                        <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Project Documentation</h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: 'var(--spacing-xs)'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--spacing-lg)' }}>

                    {/* 1. Overview */}
                    <section style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 className="flex items-center gap-sm" style={{ color: 'var(--accent-secondary)' }}>
                            <Layout size={20} /> 1. Overview
                        </h3>
                        <p>
                            The Agentic Workflow Token Optimization Web App is an interactive, educational tool that shows how agentic workflows can reduce LLM token usage and cost compared to a single monolithic prompt. It lets users model different agent setups, compare providers, and see the business impact of optimization through clear visuals and reports.
                        </p>
                        <p>
                            The app is front-end only (React + Vite), runs entirely in the browser, and is designed to be used as a demo, exploration tool, and decision-support aid for teams working with LLM-based systems.
                        </p>
                    </section>

                    {/* 2. Goals */}
                    <section style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 className="flex items-center gap-sm" style={{ color: 'var(--accent-secondary)' }}>
                            <Target size={20} /> 2. Goals and Objectives
                        </h3>
                        <div className="grid grid-2 gap-md">
                            <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                                <h4 style={{ color: 'var(--accent-primary)' }}>Business Goals</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Help teams understand and adopt agentic workflows.</li>
                                    <li>Provide a reusable demo asset for sales and consulting.</li>
                                    <li>Showcase modern frontend engineering and AI product design.</li>
                                </ul>
                            </div>
                            <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                                <h4 style={{ color: 'var(--accent-primary)' }}>Product Objectives</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Visualize token/cost savings clearly.</li>
                                    <li>Enable realistic ROI projections with custom inputs.</li>
                                    <li>Deliver a polished, premium user experience.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. Target Users */}
                    <section style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 className="flex items-center gap-sm" style={{ color: 'var(--accent-secondary)' }}>
                            <Users size={20} /> 3. Target Users & Use Cases
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <strong>Target Users:</strong>
                                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <li>AI Product Managers / Founders</li>
                                    <li>ML / LLM Engineers</li>
                                    <li>Finance / Ops / Procurement</li>
                                    <li>Sales Engineers / Consultants</li>
                                </ul>
                            </div>
                            <div>
                                <strong>Key Use Cases:</strong>
                                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Compare monolithic vs agentic token usage.</li>
                                    <li>Experiment with agent counts and roles.</li>
                                    <li>Benchmark patterns (RAG, Summarization).</li>
                                    <li>Compare LLM providers (OpenAI, Anthropic, etc.).</li>
                                    <li>Estimate monthly/yearly ROI.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 4. Scope */}
                    <section style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 className="flex items-center gap-sm" style={{ color: 'var(--accent-secondary)' }}>
                            <Layers size={20} /> 4. Scope
                        </h3>
                        <div className="grid grid-2 gap-md">
                            <div>
                                <h4 style={{ color: 'var(--accent-success)' }}>In Scope (Initial Release)</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <li>Interactive workflow diagram</li>
                                    <li>Token & cost comparison</li>
                                    <li>Interactive tokenizer</li>
                                    <li>Provider comparison</li>
                                    <li>Scenario builder</li>
                                    <li>Benchmark mode</li>
                                    <li>ROI projection charts</li>
                                    <li>Gamification & Export (PDF/CSV)</li>
                                    <li>Dark-mode, premium design</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)' }}>Out of Scope</h4>
                                <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <li>User accounts / Cloud storage</li>
                                    <li>Live LLM API calls</li>
                                    <li>Team collaboration features</li>
                                    <li>Enterprise billing integration</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 8. Technical Stack */}
                    <section style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 className="flex items-center gap-sm" style={{ color: 'var(--accent-secondary)' }}>
                            <Code size={20} /> 8. Technical Stack
                        </h3>
                        <div className="grid grid-3 gap-sm">
                            {[
                                { label: 'Frontend', val: 'React 18 + Vite' },
                                { label: 'Charts', val: 'Chart.js' },
                                { label: 'Styling', val: 'Vanilla CSS + Variables' },
                                { label: 'Icons', val: 'Lucide React' },
                                { label: 'Animations', val: 'Framer Motion' },
                                { label: 'Tokenizer', val: 'GPT-Tokenizer' }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    background: 'var(--bg-tertiary)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</div>
                                    <div style={{ fontWeight: 'bold' }}>{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div style={{
                        marginTop: 'var(--spacing-xl)',
                        padding: 'var(--spacing-md)',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--accent-primary)',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            <Zap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            <strong>Future Enhancements:</strong> Authentication, Live API integration, and Team Collaboration are planned for future updates.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutModal;
