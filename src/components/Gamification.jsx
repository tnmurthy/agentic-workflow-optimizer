import React, { useState, useEffect } from 'react';
import { Trophy, Award, Star, TrendingUp, DollarSign } from 'lucide-react';
import { formatNumber, formatCurrency } from '../utils/calculations';

const achievementsList = [
    {
        id: 'token_novice',
        title: 'Token Novice',
        description: 'Saved your first 1,000 tokens',
        icon: <Star size={20} />,
        threshold: 1000,
        type: 'tokens'
    },
    {
        id: 'cost_cutter',
        title: 'Cost Cutter',
        description: 'Projected savings of > $100/month',
        icon: <DollarSign size={20} />,
        threshold: 100,
        type: 'savings'
    },
    {
        id: 'architect',
        title: 'Workflow Architect',
        description: 'Created a custom scenario',
        icon: <TrendingUp size={20} />,
        threshold: 1,
        type: 'scenarios'
    },
    {
        id: 'optimizer_elite',
        title: 'Optimizer Elite',
        description: 'Saved over 1 Million tokens',
        icon: <Trophy size={20} />,
        threshold: 1000000,
        type: 'tokens'
    }
];

const Gamification = ({ monthlyTokens, monthlyRequests, pricePerThousand }) => {
    const [unlocked, setUnlocked] = useState([]);

    // Calculate stats for unlocking
    const monolithicCost = (monthlyTokens / 1000) * pricePerThousand;
    // Assuming ~60% savings for calculation
    const savingsAmount = monolithicCost * 0.6;
    const tokensSaved = monthlyTokens * 0.6;

    // Check for scenarios (mocked for now, in real app would check localStorage or state)
    const hasCustomScenario = true; // Assume true if they are using the app

    useEffect(() => {
        const newUnlocked = [];
        achievementsList.forEach(ach => {
            if (ach.type === 'tokens' && tokensSaved >= ach.threshold) {
                newUnlocked.push(ach.id);
            } else if (ach.type === 'savings' && savingsAmount >= ach.threshold) {
                newUnlocked.push(ach.id);
            } else if (ach.type === 'scenarios' && hasCustomScenario) {
                newUnlocked.push(ach.id);
            }
        });
        setUnlocked(newUnlocked);
    }, [tokensSaved, savingsAmount]);

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex items-center gap-sm">
                    <Award size={24} style={{ color: 'var(--accent-warning)' }} />
                    <div>
                        <h2>Achievements</h2>
                        <p>Your optimization milestones</p>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="grid grid-2 gap-md">
                    {achievementsList.map(ach => {
                        const isUnlocked = unlocked.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={`card flex items-center gap-md ${isUnlocked ? 'unlocked' : 'locked'}`}
                                style={{
                                    padding: '1rem',
                                    background: isUnlocked ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.02)',
                                    border: isUnlocked ? '1px solid var(--accent-warning)' : '1px solid rgba(255,255,255,0.05)',
                                    opacity: isUnlocked ? 1 : 0.6,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    background: isUnlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                                    color: isUnlocked ? 'var(--accent-warning)' : 'var(--text-muted)'
                                }}>
                                    {ach.icon}
                                </div>
                                <div>
                                    <h4 style={{
                                        marginBottom: '0.25rem',
                                        color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)'
                                    }}>
                                        {ach.title}
                                    </h4>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        marginBottom: 0,
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {ach.description}
                                    </p>
                                </div>
                                {isUnlocked && (
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Check size={16} style={{ color: 'var(--accent-success)' }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Stats Summary */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'var(--gradient-accent)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, color: 'white' }}>Total Tokens Saved</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{formatNumber(tokensSaved)}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, color: 'white' }}>Monthly Savings</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{formatCurrency(savingsAmount)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component
const Check = ({ size, style }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default Gamification;
