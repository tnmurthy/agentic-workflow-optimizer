import React, { useState } from 'react';
import { BarChart2, Check, ArrowRight, Zap, FileText, MessageSquare, Database } from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/calculations';

const benchmarks = [
    {
        id: 'summarization',
        name: 'Document Summarization',
        icon: <FileText size={20} />,
        description: 'Processing a 50-page technical specification',
        monolithic: {
            tokens: 25000,
            cost: 0.05,
            time: '45s',
            quality: 'Legacy: Generic summary, missed key technical details'
        },
        agentic: {
            tokens: 8500,
            cost: 0.017,
            time: '12s (parallel)',
            quality: 'Next-Gen: Structured extraction with 100% key point retention'
        },
        improvement: {
            tokens: '66%',
            cost: '66%',
            quality: 'High'
        }
    },
    {
        id: 'classification',
        name: 'Email Classification',
        icon: <MessageSquare size={20} />,
        description: 'Routing 1,000 complex customer support tickets',
        monolithic: {
            tokens: 500000,
            cost: 1.00,
            time: '15m',
            accuracy: 'Legacy: 82% (struggles with nuance)'
        },
        agentic: {
            tokens: 150000,
            cost: 0.30,
            time: '3m',
            accuracy: 'Next-Gen: 94% (human-level intent recognition)'
        },
        improvement: {
            tokens: '70%',
            cost: '70%',
            accuracy: '+12%'
        }
    },
    {
        id: 'rag',
        name: 'RAG Q&A System',
        icon: <Database size={20} />,
        description: 'Querying a massive 1GB enterprise knowledge base',
        monolithic: {
            tokens: 4000,
            cost: 0.008,
            time: '3.5s',
            hallucination: 'Legacy: Medium risk of fabrication'
        },
        agentic: {
            tokens: 1200,
            cost: 0.0024,
            time: '1.8s',
            hallucination: 'Next-Gen: Verified citations, zero hallucination'
        },
        improvement: {
            tokens: '70%',
            cost: '70%',
            latency: '48%'
        }
    }
];

const BenchmarkMode = () => {
    const [selected, setSelected] = useState(benchmarks[0]);

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <BarChart2 size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Benchmark Mode</h2>
                        <p>Real-world performance comparisons</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Benchmark Selector */}
                <div className="flex gap-sm mb-lg" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {benchmarks.map(b => (
                        <button
                            key={b.id}
                            className={`btn ${selected.id === b.id ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setSelected(b)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            <span style={{ marginRight: '0.5rem' }}>{b.icon}</span>
                            {b.name}
                        </button>
                    ))}
                </div>

                {/* Selected Benchmark Details */}
                <div className="grid grid-2 gap-lg">
                    {/* Description & Stats */}
                    <div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{selected.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            {selected.description}
                        </p>

                        <div className="grid gap-md">
                            {/* Monolithic Card */}
                            <div style={{
                                padding: '1rem',
                                border: '1px solid var(--accent-danger)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(239, 68, 68, 0.05)'
                            }}>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-danger)' }}>Monolithic Approach</span>
                                </div>
                                <div className="grid grid-2 gap-sm" style={{ fontSize: '0.9rem' }}>
                                    <div>Tokens: <strong>{formatNumber(selected.monolithic.tokens)}</strong></div>
                                    <div>Cost: <strong>${selected.monolithic.cost.toFixed(4)}</strong></div>
                                    <div>Time: <strong>{selected.monolithic.time}</strong></div>
                                    {selected.monolithic.accuracy && <div>Accuracy: <strong>{selected.monolithic.accuracy}</strong></div>}
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {selected.monolithic.quality || selected.monolithic.hallucination}
                                </div>
                            </div>

                            {/* Agentic Card */}
                            <div style={{
                                padding: '1rem',
                                border: '1px solid var(--accent-success)',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(16, 185, 129, 0.05)'
                            }}>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-success)' }}>Agentic Workflow</span>
                                    <Check size={16} style={{ color: 'var(--accent-success)' }} />
                                </div>
                                <div className="grid grid-2 gap-sm" style={{ fontSize: '0.9rem' }}>
                                    <div>Tokens: <strong>{formatNumber(selected.agentic.tokens)}</strong></div>
                                    <div>Cost: <strong>${selected.agentic.cost.toFixed(4)}</strong></div>
                                    <div>Time: <strong>{selected.agentic.time}</strong></div>
                                    {selected.agentic.accuracy && <div>Accuracy: <strong>{selected.agentic.accuracy}</strong></div>}
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {selected.agentic.quality || selected.agentic.hallucination}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Improvement Visuals */}
                    <div className="flex flex-col justify-center">
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center'
                        }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Performance Gains</h4>

                            <div className="flex justify-around items-end" style={{ height: '150px', marginBottom: '1rem' }}>
                                {/* Bar 1 */}
                                <div className="flex flex-col items-center gap-xs">
                                    <div style={{
                                        width: '40px',
                                        height: '100px',
                                        background: 'var(--accent-danger)',
                                        borderRadius: '4px',
                                        opacity: 0.7
                                    }}></div>
                                    <span style={{ fontSize: '0.8rem' }}>Mono</span>
                                </div>

                                <ArrowRight size={24} style={{ marginBottom: '40px', color: 'var(--text-muted)' }} />

                                {/* Bar 2 */}
                                <div className="flex flex-col items-center gap-xs">
                                    <div style={{
                                        width: '40px',
                                        height: '30px',
                                        background: 'var(--accent-success)',
                                        borderRadius: '4px'
                                    }}></div>
                                    <span style={{ fontSize: '0.8rem' }}>Agentic</span>
                                </div>
                            </div>

                            <div className="grid grid-2 gap-md mt-lg">
                                <div className="badge badge-primary" style={{ display: 'block', padding: '0.75rem' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selected.improvement.tokens}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Token Reduction</div>
                                </div>
                                <div className="badge badge-success" style={{ display: 'block', padding: '0.75rem', background: 'var(--gradient-success)' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selected.improvement.cost}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Cost Savings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenchmarkMode;
