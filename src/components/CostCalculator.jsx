import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateCost, calculateSavings, formatCurrency } from '../utils/calculations';

const CostCalculator = ({ pricePerThousand, onPriceChange }) => {
    const monolithicCost = calculateCost(monolithicTokens, pricePerThousand);
    const agenticCost = calculateCost(agenticTotalTokens, pricePerThousand);
    const savings = calculateSavings(monolithicCost, agenticCost);

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <h2>Cost Analysis</h2>
                <p>Real-time cost comparison per request</p>
            </div>

            <div className="card-body">
                {/* Price Configuration */}
                <div className="input-group">
                    <label className="input-label">
                        <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Price per 1,000 Tokens
                    </label>
                    <input
                        type="number"
                        className="input"
                        value={pricePerThousand}
                        onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                        step="0.0001"
                        min="0"
                        placeholder="0.002"
                    />
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
                        Adjust based on your LLM provider pricing (e.g., OpenAI, Anthropic, Google)
                    </p>
                </div>

                {/* Cost Comparison */}
                <div className="grid grid-2 gap-md mt-lg">
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

                {/* Savings Highlight */}
                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    padding: 'var(--spacing-lg)',
                    background: 'var(--gradient-success)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                }}>
                    <div className="flex items-center justify-center gap-sm mb-sm">
                        <TrendingUp size={32} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: 0, color: 'white' }}>Cost Savings</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                        {formatCurrency(savings.amount)}
                    </p>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                        {savings.percentage.toFixed(1)}% savings per request
                    </p>
                </div>

                {/* Info Box */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--accent-primary)'
                }}>
                    <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>
                        💡 <strong>Tip:</strong> These savings compound at scale. See the projection charts below to understand the impact across millions of requests.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CostCalculator;
