import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { TrendingDown } from 'lucide-react';
import { agents, monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateTokenReduction } from '../utils/calculations';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Badge = styled.div`
    font-size: 1.25rem;
    padding: 0.75rem 1.5rem;
`;

const ChartContainer = styled.div`
    height: 300px;
`;

const Stat = styled.div`
    text-align: center;
    padding: var(--spacing-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
`;

const SavedStat = styled(Stat)`
    background: var(--gradient-success);
`;

const StatLabel = styled.p`
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
`;

const SavedStatLabel = styled(StatLabel)`
    color: white;
`;

const StatValue = styled.p`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0;
`;

const MonolithicStatValue = styled(StatValue)`
    color: var(--accent-danger);
`;

const AgenticStatValue = styled(StatValue)`
    color: var(--accent-success);
`;

const SavedStatValue = styled(StatValue)`
    color: white;
`;

const TokenComparison = () => {
    const tokenReduction = calculateTokenReduction(monolithicTokens, agenticTotalTokens);

    // Chart for monolithic vs agentic total
    const comparisonData = {
        labels: ['Monolithic Prompt', 'Agentic Pipeline'],
        datasets: [
            {
                label: 'Token Usage',
                data: [monolithicTokens, agenticTotalTokens],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(16, 185, 129, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Chart for agent breakdown
    const agentBreakdownData = {
        labels: agents.map(a => a.name),
        datasets: [
            {
                label: 'Tokens per Agent',
                data: agents.map(a => a.tokens),
                backgroundColor: agents.map(a => `${a.color}99`),
                borderColor: agents.map(a => a.color),
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(26, 34, 53, 0.95)',
                titleColor: '#fff',
                bodyColor: '#a0aec0',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#a0aec0',
                },
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#a0aec0',
                },
            },
        },
    };

    return (
        <div className="card animate-fadeIn">
            <div className="card-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h2>Token Usage Comparison</h2>
                        <p>See how agentic workflows reduce token consumption</p>
                    </div>
                    <Badge className="badge badge-success">
                        <TrendingDown size={20} />
                        {tokenReduction.percentage.toFixed(1)}% Reduction
                    </Badge>
                </div>
            </div>

            <div className="card-body">
                <div className="grid grid-2 gap-lg">
                    {/* Comparison Chart */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>
                            Overall Comparison
                        </h3>
                        <ChartContainer>
                            <Bar data={comparisonData} options={chartOptions} />
                        </ChartContainer>
                    </div>

                    {/* Agent Breakdown Chart */}
                    <div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-md)' }}>
                            Agentic Pipeline Breakdown
                        </h3>
                        <ChartContainer>
                            <Bar data={agentBreakdownData} options={chartOptions} />
                        </ChartContainer>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-3 gap-md mt-lg">
                    <Stat>
                        <StatLabel>Monolithic</StatLabel>
                        <MonolithicStatValue>
                            {monolithicTokens}
                        </MonolithicStatValue>
                    </Stat>

                    <Stat>
                        <StatLabel>Agentic</StatLabel>
                        <AgenticStatValue>
                            {agenticTotalTokens}
                        </AgenticStatValue>
                    </Stat>

                    <SavedStat>
                        <SavedStatLabel>Tokens Saved</SavedStatLabel>
                        <SavedStatValue>
                            {tokenReduction.amount}
                        </SavedStatValue>
                    </SavedStat>
                </div>
            </div>
        </div>
    );
};

export default TokenComparison;
