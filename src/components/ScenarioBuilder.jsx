import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { formatNumber } from '../utils/calculations';

const ScenarioBuilder = () => {
    const [scenarioName, setScenarioName] = useState('My Custom Workflow');
    const [agents, setAgents] = useState([
        { id: 1, name: 'Retriever Agent', tokens: 300, role: 'Data Fetching', color: '#6366f1' },
        { id: 2, name: 'Summarizer Agent', tokens: 250, role: 'Content Compression', color: '#8b5cf6' },
        { id: 3, name: 'Classifier Agent', tokens: 150, role: 'Intent Analysis', color: '#10b981' },
        { id: 4, name: 'Insight Agent', tokens: 100, role: 'Pattern Recognition', color: '#f59e0b' },
        { id: 5, name: 'Final Output Agent', tokens: 50, role: 'Response Generation', color: '#ef4444' }
    ]);

    const [nextId, setNextId] = useState(6);

    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

    const totalTokens = agents.reduce((sum, agent) => sum + agent.tokens, 0);
    const monolithicTokens = 2000;
    const reduction = ((monolithicTokens - totalTokens) / monolithicTokens) * 100;

    const addAgent = () => {
        const newAgent = {
            id: nextId,
            name: `Agent ${nextId}`,
            tokens: 100,
            role: 'Custom Role',
            color: colors[nextId % colors.length]
        };
        setAgents([...agents, newAgent]);
        setNextId(nextId + 1);
    };

    const updateAgent = (id, field, value) => {
        setAgents(agents.map(agent =>
            agent.id === id ? { ...agent, [field]: value } : agent
        ));
    };

    const deleteAgent = (id) => {
        if (agents.length > 1) {
            setAgents(agents.filter(agent => agent.id !== id));
        } else {
            alert('You must have at least one agent!');
        }
    };

    const resetToDefault = () => {
        if (confirm('Reset to default configuration?')) {
            setAgents([
                { id: 1, name: 'Retriever Agent', tokens: 300, role: 'Data Fetching', color: '#6366f1' },
                { id: 2, name: 'Summarizer Agent', tokens: 250, role: 'Content Compression', color: '#8b5cf6' },
                { id: 3, name: 'Classifier Agent', tokens: 150, role: 'Intent Analysis', color: '#10b981' },
                { id: 4, name: 'Insight Agent', tokens: 100, role: 'Pattern Recognition', color: '#f59e0b' },
                { id: 5, name: 'Final Output Agent', tokens: 50, role: 'Response Generation', color: '#ef4444' }
            ]);
            setScenarioName('My Custom Workflow');
            setNextId(6);
        }
    };

    const saveScenario = () => {
        const scenario = {
            name: scenarioName,
            agents: agents,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const savedScenarios = JSON.parse(localStorage.getItem('agentic-scenarios') || '[]');
        savedScenarios.push(scenario);
        localStorage.setItem('agentic-scenarios', JSON.stringify(savedScenarios));

        alert(`Scenario "${scenarioName}" saved successfully!`);
    };

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Settings size={24} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h2>Scenario Builder</h2>
                        <p>Create custom agent configurations for your workflow</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Scenario Name */}
                <div className="input-group">
                    <label className="input-label">Scenario Name</label>
                    <input
                        type="text"
                        className="input"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        placeholder="e.g., Customer Support Pipeline"
                    />
                </div>

                {/* Summary Stats */}
                <div className="grid grid-3 gap-md mt-md">
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Agents</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: 0 }}>
                            {agents.length}
                        </p>
                    </div>

                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Tokens</p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: 0 }}>
                            {formatNumber(totalTokens)}
                        </p>
                    </div>

                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: reduction > 0 ? 'var(--gradient-success)' : 'rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: reduction > 0 ? 'white' : 'var(--text-secondary)' }}>
                            vs Monolithic
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: reduction > 0 ? 'white' : 'var(--accent-danger)', marginBottom: 0 }}>
                            {reduction > 0 ? '-' : '+'}{Math.abs(reduction).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Agent List */}
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <div className="flex justify-between items-center mb-md">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: 0 }}>Configure Agents</h3>
                        <button className="btn btn-secondary" onClick={addAgent}>
                            <Plus size={16} />
                            Add Agent
                        </button>
                    </div>

                    <div className="grid gap-md">
                        {agents.map((agent, index) => (
                            <div
                                key={agent.id}
                                className="card"
                                style={{
                                    borderLeft: `4px solid ${agent.color}`,
                                    padding: 'var(--spacing-md)'
                                }}
                            >
                                <div className="grid grid-2 gap-md">
                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Agent Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={agent.name}
                                            onChange={(e) => updateAgent(agent.id, 'name', e.target.value)}
                                            style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Role</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={agent.role}
                                            onChange={(e) => updateAgent(agent.id, 'role', e.target.value)}
                                            style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-md items-end mt-sm">
                                    <div style={{ flex: 1 }}>
                                        <label className="input-label" style={{ fontSize: '0.75rem' }}>
                                            Token Allocation: {agent.tokens}
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="500"
                                            step="10"
                                            value={agent.tokens}
                                            onChange={(e) => updateAgent(agent.id, 'tokens', parseInt(e.target.value))}
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="input-label" style={{ fontSize: '0.75rem' }}>Color</label>
                                        <input
                                            type="color"
                                            value={agent.color}
                                            onChange={(e) => updateAgent(agent.id, 'color', e.target.value)}
                                            style={{
                                                width: '50px',
                                                height: '38px',
                                                border: 'none',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </div>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => deleteAgent(agent.id)}
                                        style={{
                                            padding: '0.5rem 0.75rem',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid var(--accent-danger)'
                                        }}
                                    >
                                        <Trash2 size={16} style={{ color: 'var(--accent-danger)' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-md mt-lg">
                    <button
                        className="btn btn-primary"
                        onClick={saveScenario}
                        style={{ flex: 1 }}
                    >
                        <Save size={18} />
                        Save Scenario
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={resetToDefault}
                    >
                        <RotateCcw size={18} />
                        Reset to Default
                    </button>
                </div>

                {/* Info Box */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid var(--accent-primary)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        💡 <strong>Tip:</strong> Build custom scenarios to model different workflow architectures.
                        Scenarios are saved to your browser's local storage and persist across sessions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScenarioBuilder;
