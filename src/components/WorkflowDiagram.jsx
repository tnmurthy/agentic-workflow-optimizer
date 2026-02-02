import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import { agents, monolithicTokens, agenticTotalTokens } from '../data/workflowData';

const WorkflowDiagram = () => {
    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <h2>Step 2: Workflow Pipeline (Orchestration)</h2>
                <p>Modular agents working together to process requests efficiently</p>
            </div>

            <div className="card-body">
                {/* Agent Pipeline */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {agents.map((agent, index) => (
                            <React.Fragment key={agent.id}>
                                <div
                                    className="card"
                                    style={{
                                        flex: '0 0 auto',
                                        minWidth: '200px',
                                        padding: 'var(--spacing-md)',
                                        background: `linear-gradient(135deg, ${agent.color}22 0%, ${agent.color}44 100%)`,
                                        borderLeft: `4px solid ${agent.color}`,
                                        transition: 'all var(--transition-base)',
                                        cursor: 'pointer'
                                    }}
                                    title={agent.description}
                                >
                                    <div className="flex items-center gap-sm mb-sm">
                                        <Activity size={20} color={agent.color} />
                                        <h4 style={{ fontSize: '1rem', marginBottom: 0 }}>{agent.name}</h4>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{agent.role}</p>
                                    <div className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                                        {agent.tokens} tokens
                                    </div>
                                </div>

                                {index < agents.length - 1 && (
                                    <ArrowRight size={24} style={{ color: 'var(--accent-primary)' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-md)',
                    background: 'var(--gradient-success)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Total Pipeline Tokens</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                        {agenticTotalTokens} tokens
                    </p>
                </div>

                {/* Comparison Note */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--accent-warning)'
                }}>
                    <p style={{ marginBottom: 0 }}>
                        <strong>Monolithic Approach:</strong> {monolithicTokens} tokens per request
                    </p>
                    <p style={{ marginBottom: 0, marginTop: '0.5rem' }}>
                        <strong>Agentic Pipeline:</strong> {agenticTotalTokens} tokens per request
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkflowDiagram;
