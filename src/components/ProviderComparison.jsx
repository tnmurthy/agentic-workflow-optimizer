import React, { useState } from 'react';
import { Building2, Check } from 'lucide-react';
import { llmProviders, getModel } from '../data/llmProviders';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateCost, calculateSavings, formatCurrency } from '../utils/calculations';

const ProviderComparison = () => {
    const [selectedProvider, setSelectedProvider] = useState('openai');
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

    const currentProvider = llmProviders.find(p => p.id === selectedProvider);
    const currentModel = getModel(selectedProvider, selectedModel);

    // Calculate costs (assuming 50/50 input/output split)
    const monolithicInputTokens = monolithicTokens * 0.5;
    const monolithicOutputTokens = monolithicTokens * 0.5;
    const agenticInputTokens = agenticTotalTokens * 0.5;
    const agenticOutputTokens = agenticTotalTokens * 0.5;

    const monolithicCost = calculateCost(monolithicInputTokens, currentModel.inputCostPer1M / 1000) +
        calculateCost(monolithicOutputTokens, currentModel.outputCostPer1M / 1000);
    const agenticCost = calculateCost(agenticInputTokens, currentModel.inputCostPer1M / 1000) +
        calculateCost(agenticOutputTokens, currentModel.outputCostPer1M / 1000);

    const savings = calculateSavings(monolithicCost, agenticCost);

    // All models comparison
    const allModels = llmProviders.flatMap(provider =>
        provider.models.map(model => ({
            ...model,
            providerId: provider.id,
            providerName: provider.name,
            providerLogo: provider.logo
        }))
    );

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Building2 size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>LLM Provider Comparison</h2>
                        <p>Compare costs across different models and providers</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Provider Selector */}
                <div className="input-group">
                    <label className="input-label">Select Provider</label>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        {llmProviders.map(provider => (
                            <button
                                key={provider.id}
                                className={`btn ${selectedProvider === provider.id ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => {
                                    setSelectedProvider(provider.id);
                                    setSelectedModel(provider.models[0].id);
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{provider.logo}</span>
                                {provider.name}
                                {selectedProvider === provider.id && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Model Cards */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <label className="input-label">Select Model</label>
                    <div className="grid grid-3 gap-md">
                        {currentProvider.models.map(model => (
                            <div
                                key={model.id}
                                className="card"
                                onClick={() => setSelectedModel(model.id)}
                                style={{
                                    cursor: 'pointer',
                                    border: selectedModel === model.id
                                        ? '2px solid var(--accent-primary)'
                                        : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: selectedModel === model.id
                                        ? 'var(--gradient-accent)'
                                        : 'var(--bg-card)',
                                    position: 'relative'
                                }}
                            >
                                {selectedModel === model.id && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        background: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Check size={16} style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                )}

                                <h4 style={{
                                    fontSize: '1rem',
                                    marginBottom: '0.5rem',
                                    color: selectedModel === model.id ? 'white' : 'var(--text-primary)'
                                }}>
                                    {model.name}
                                </h4>
                                <p style={{
                                    fontSize: '0.875rem',
                                    marginBottom: '0.75rem',
                                    color: selectedModel === model.id ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'
                                }}>
                                    {model.description}
                                </p>

                                <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.25rem',
                                        color: selectedModel === model.id ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
                                    }}>
                                        <span>Input:</span>
                                        <span style={{ fontWeight: 'bold' }}>${model.inputCostPer1M}/1M</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        color: selectedModel === model.id ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
                                    }}>
                                        <span>Output:</span>
                                        <span style={{ fontWeight: 'bold' }}>${model.outputCostPer1M}/1M</span>
                                    </div>
                                </div>

                                <div className="badge badge-primary" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    {(model.contextWindow / 1000).toFixed(0)}K context
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cost Breakdown for Selected Model */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>
                        Cost Analysis: {currentModel.name}
                    </h3>

                    <div className="grid grid-2 gap-md">
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '2px solid var(--accent-danger)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Monolithic Cost</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-danger)', marginBottom: '0.5rem' }}>
                                {formatCurrency(monolithicCost)}
                            </p>
                            <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>per request</p>
                        </div>

                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '2px solid var(--accent-success)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Agentic Cost</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: '0.5rem' }}>
                                {formatCurrency(agenticCost)}
                            </p>
                            <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>per request</p>
                        </div>
                    </div>

                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-lg)',
                        background: 'var(--gradient-success)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                            Cost Savings with {currentModel.name}
                        </h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                            {formatCurrency(savings.amount)}
                        </p>
                        <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                            {savings.percentage.toFixed(1)}% savings per request
                        </p>
                    </div>
                </div>

                {/* Quick Comparison Table */}
                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>
                        All Models Comparison
                    </h3>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.875rem'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>Provider</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>Model</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right' }}>Monolithic</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right' }}>Agentic</th>
                                    <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right' }}>Savings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allModels.map((model, idx) => {
                                    const mCost = calculateCost(monolithicInputTokens, model.inputCostPer1M / 1000) +
                                        calculateCost(monolithicOutputTokens, model.outputCostPer1M / 1000);
                                    const aCost = calculateCost(agenticInputTokens, model.inputCostPer1M / 1000) +
                                        calculateCost(agenticOutputTokens, model.outputCostPer1M / 1000);
                                    const saved = calculateSavings(mCost, aCost);

                                    return (
                                        <tr
                                            key={`${model.providerId}-${model.id}`}
                                            style={{
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                background: selectedProvider === model.providerId && selectedModel === model.id
                                                    ? 'rgba(99, 102, 241, 0.1)'
                                                    : 'transparent'
                                            }}
                                        >
                                            <td style={{ padding: 'var(--spacing-sm)' }}>
                                                <span style={{ marginRight: '0.5rem' }}>{model.providerLogo}</span>
                                                {model.providerName}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-sm)' }}>{model.name}</td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--accent-danger)' }}>
                                                {formatCurrency(mCost)}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--accent-success)' }}>
                                                {formatCurrency(aCost)}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', fontWeight: 'bold' }}>
                                                {formatCurrency(saved.amount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderComparison;
