import React, { useState } from 'react';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { encode } from 'gpt-tokenizer';
import { agents, monolithicTokens } from '../data/workflowData';
import { formatNumber } from '../utils/calculations';

const TokenizerInput = () => {
    const [prompt, setPrompt] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const analyzePrompt = () => {
        if (!prompt.trim()) return;

        try {
            // Tokenize the prompt
            const tokens = encode(prompt);
            const tokenCount = tokens.length;

            // Simulate agentic breakdown (proportional to actual agents)
            const totalAgenticTokens = agents.reduce((sum, a) => sum + a.tokens, 0);
            const agenticBreakdown = agents.map(agent => ({
                ...agent,
                actualTokens: Math.floor((agent.tokens / totalAgenticTokens) * tokenCount)
            }));

            const agenticTotal = agenticBreakdown.reduce((sum, a) => sum + a.actualTokens, 0);
            const reduction = ((tokenCount - agenticTotal) / tokenCount) * 100;

            setAnalysis({
                original: prompt,
                monolithicTokens: tokenCount,
                agenticTokens: agenticTotal,
                agenticBreakdown,
                reduction: reduction > 0 ? reduction : 0,
                tokensSaved: tokenCount > agenticTotal ? tokenCount - agenticTotal : 0
            });
        } catch (error) {
            console.error('Tokenization error:', error);
            // Fallback to character-based estimation
            const estimatedTokens = Math.ceil(prompt.length / 4);
            setAnalysis({
                original: prompt,
                monolithicTokens: estimatedTokens,
                agenticTokens: Math.floor(estimatedTokens * 0.425),
                agenticBreakdown: agents.map(a => ({ ...a, actualTokens: 0 })),
                reduction: 57.5,
                tokensSaved: Math.floor(estimatedTokens * 0.575),
                isEstimate: true
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            analyzePrompt();
        }
    };

    const examplePrompts = [
        `CONFIDENTIALITY AGREEMENT

This Agreement is entered into as of [Date] by and between [Party A] ("Disclosing Party") and [Party B] ("Receiving Party").

1. Definition of Confidential Information. "Confidential Information" shall mean any and all technical and non-technical information provided by the Disclosing Party to the Receiving Party, including but not limited to: (a) patent and patent applications; (b) trade secrets; (c) proprietary information, ideas, techniques, sketches, drawings, works of authorship, models, inventions, know-how, processes, apparatuses, equipment, algorithms, software programs, software source documents, and formulae related to the current, future, and proposed products and services of the Disclosing Party.

2. Obligations of Receiving Party. The Receiving Party agrees that it will not make use of, disseminate, or in any way disclose any Confidential Information of the Disclosing Party to any person, firm, or business, except to the extent necessary for negotiations, discussions, and consultations with personnel or authorized representatives of the Receiving Party.

3. Exclusions. Confidential Information shall not include information that: (a) is or becomes publicly known through no act or omission of the Receiving Party; (b) was in the Receiving Party's lawful possession prior to the disclosure; (c) is lawfully disclosed to the Receiving Party by a third party without restriction on disclosure; or (d) is independently developed by the Receiving Party.`,
        "Analyze this customer feedback and categorize it by sentiment, extract key issues, prioritize them by urgency, and suggest actionable solutions.",
        "Review this code for bugs, suggest performance optimizations, ensure it follows best practices, and generate comprehensive unit tests."
    ];

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Sparkles size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Interactive Tokenizer</h2>
                        <p>Paste your prompt to see real-time token analysis</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Input Area */}
                <div className="input-group">
                    <label className="input-label">Your Prompt</label>
                    <textarea
                        className="input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Paste your prompt here... or try an example below"
                        rows={6}
                        style={{
                            resize: 'vertical',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}
                    />
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
                        💡 Press <kbd style={{ padding: '0.2rem 0.4rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Ctrl + Enter</kbd> to analyze
                    </p>
                </div>

                {/* Quick Examples */}
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' }}>
                        Try an example:
                    </p>
                    <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                        {examplePrompts.map((example, idx) => (
                            <button
                                key={idx}
                                className="btn btn-secondary"
                                onClick={() => setPrompt(example)}
                                style={{ fontSize: '0.875rem' }}
                            >
                                Example {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analyze Button */}
                <button
                    className="btn btn-primary mt-md"
                    onClick={analyzePrompt}
                    disabled={!prompt.trim()}
                    style={{ width: '100%' }}
                >
                    <Sparkles size={18} />
                    Analyze Tokens
                    <ArrowRight size={18} />
                </button>

                {/* Analysis Results */}
                {analysis && (
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        {analysis.isEstimate && (
                            <div style={{
                                padding: 'var(--spacing-sm)',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid var(--accent-warning)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)'
                            }}>
                                <Info size={16} style={{ color: 'var(--accent-warning)' }} />
                                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                                    Using character-based estimation. Install dependencies for accurate tokenization.
                                </p>
                            </div>
                        )}

                        {/* Summary Cards */}
                        <div className="grid grid-3 gap-md">
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '2px solid var(--accent-danger)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Monolithic Tokens</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-danger)', marginBottom: 0 }}>
                                    {formatNumber(analysis.monolithicTokens)}
                                </p>
                            </div>

                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '2px solid var(--accent-success)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Agentic Tokens</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: 0 }}>
                                    {formatNumber(analysis.agenticTokens)}
                                </p>
                            </div>

                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--gradient-success)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'white' }}>Tokens Saved</p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                                    {formatNumber(analysis.tokensSaved)}
                                </p>
                            </div>
                        </div>

                        {/* Reduction Badge */}
                        <div style={{
                            marginTop: 'var(--spacing-md)',
                            padding: 'var(--spacing-lg)',
                            background: 'var(--gradient-accent)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                                Token Reduction
                            </h3>
                            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                                {analysis.reduction.toFixed(1)}%
                            </p>
                        </div>

                        {/* Agent Breakdown */}
                        {!analysis.isEstimate && (
                            <div style={{ marginTop: 'var(--spacing-lg)' }}>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>
                                    Agentic Breakdown
                                </h3>
                                <div className="grid gap-sm">
                                    {analysis.agenticBreakdown.map((agent, idx) => (
                                        <div
                                            key={agent.id}
                                            style={{
                                                padding: 'var(--spacing-md)',
                                                background: `linear-gradient(90deg, ${agent.color}22 0%, ${agent.color}11 100%)`,
                                                borderLeft: `4px solid ${agent.color}`,
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                                    {agent.name}
                                                </h4>
                                                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                                                    {agent.role}
                                                </p>
                                            </div>
                                            <div className="badge badge-primary">
                                                {formatNumber(agent.actualTokens)} tokens
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default TokenizerInput;
