import React from 'react';
import { Calculator, Zap } from 'lucide-react';
import { formatNumber } from '../utils/calculations';

const ScenarioInput = ({
    monthlyRequests,
    onMonthlyRequestsChange,
    monthlyTokens,
    onMonthlyTokensChange
}) => {
    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Calculator size={24} />
                    <div>
                        <h2>Custom Scenario</h2>
                        <p>Enter your usage estimates to see personalized projections</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="grid grid-2 gap-md">
                    {/* Monthly Requests */}
                    <div className="input-group">
                        <label className="input-label">
                            <Zap size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                            Monthly Requests
                        </label>
                        <input
                            type="number"
                            className="input"
                            value={monthlyRequests}
                            onChange={(e) => onMonthlyRequestsChange(parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="100000"
                        />
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
                            Number of AI requests per month
                        </p>
                    </div>

                    {/* Monthly Tokens */}
                    <div className="input-group">
                        <label className="input-label">
                            Monthly Token Volume
                        </label>
                        <input
                            type="number"
                            className="input"
                            value={monthlyTokens}
                            onChange={(e) => onMonthlyTokensChange(parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="10000000"
                        />
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
                            Total tokens processed per month
                        </p>
                    </div>
                </div>

                {/* Quick Presets */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: 'var(--spacing-sm)' }}>
                        Quick Presets:
                    </p>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                onMonthlyRequestsChange(100000);
                                onMonthlyTokensChange(10000000);
                            }}
                        >
                            Startup (10M tokens)
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                onMonthlyRequestsChange(1000000);
                                onMonthlyTokensChange(100000000);
                            }}
                        >
                            Growth (100M tokens)
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                onMonthlyRequestsChange(10000000);
                                onMonthlyTokensChange(1000000000);
                            }}
                        >
                            Enterprise (1B tokens)
                        </button>
                    </div>
                </div>

                {/* Current Values Display */}
                {(monthlyRequests > 0 || monthlyTokens > 0) && (
                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--gradient-accent)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                            Current Scenario:
                        </p>
                        <div className="flex gap-lg" style={{ flexWrap: 'wrap' }}>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                                    {formatNumber(monthlyRequests)}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: 0 }}>
                                    requests/month
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                                    {formatNumber(monthlyTokens)}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: 0 }}>
                                    tokens/month
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScenarioInput;
