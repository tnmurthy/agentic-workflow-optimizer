import React from 'react';
import styled from 'styled-components';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { monolithicTokens, agenticTotalTokens } from '../data/workflowData';
import { calculateMonthlyProjection, calculateMultiYearProjection, formatCurrency } from '../utils/calculations';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ChartContainer = styled.div`
    height: 400px;
`;

const Stat = styled.div`
    padding: var(--spacing-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    text-align: center;
`;

const StatLabel = styled.p`
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--accent-success);
    margin-bottom: 0.5rem;
`;

const StatUnit = styled.p`
    font-size: 0.75rem;
    margin-bottom: 0;
`;

const TotalSavings = styled.div`
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--gradient-success);
    border-radius: var(--radius-md);
    text-align: center;
`;

const TotalSavingsLabel = styled.h3`
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: white;
`;

const TotalSavingsValue = styled.p`
    font-size: 3rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0;
`;

const ProjectionCharts = ({ pricePerThousand }) => {
    // Monthly projections at different scales
    const monthlyScales = [
        { label: '1M tokens', value: 1000000 },
        { label: '10M tokens', value: 10000000 },
        { label: '100M tokens', value: 100000000 },
    ];

    const monthlyProjections = monthlyScales.map(scale =>
        calculateMonthlyProjection(scale.value, pricePerThousand, monolithicTokens, agenticTotalTokens)
    );

    const monthlyData = {
        labels: monthlyScales.map(s => s.label),
        datasets: [
            {
                label: 'Monolithic Cost',
                data: monthlyProjections.map(p => p.monolithicCost),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
            },
            {
                label: 'Agentic Cost',
                data: monthlyProjections.map(p => p.agenticCost),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
            },
        ],
    };

    // Multi-year projection
    const years = [1, 2, 3, 4, 5];
    const multiYearData = calculateMultiYearProjection(
        years,
        500000000, // 500M tokens per year
        pricePerThousand,
        monolithicTokens,
        agenticTotalTokens
    );

    const multiYearChartData = {
        labels: years.map(y => `Year ${y}`),
        datasets: [
            {
                label: 'Cumulative Savings',
                data: multiYearData.map(d => d.cumulativeSavings),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#a0aec0',
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 34, 53, 0.95)',
                titleColor: '#fff',
                bodyColor: '#a0aec0',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                    }
                }
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
                    callback: function (value) {
                        return '$' + (value / 1000).toFixed(0) + 'k';
                    }
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

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#a0aec0',
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 34, 53, 0.95)',
                titleColor: '#fff',
                bodyColor: '#a0aec0',
                borderColor: 'rgba(99, 102, 241, 0.5)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return 'Savings: ' + formatCurrency(context.parsed.y);
                    }
                }
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
                    callback: function (value) {
                        return '$' + (value / 1000).toFixed(0) + 'k';
                    }
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
        <div className="grid gap-lg">
            {/* Monthly Projections */}
            <div className="card animate-fadeIn">
                <div className="card-header">
                    <div className="flex items-center gap-sm">
                        <BarChart3 size={24} />
                        <div>
                            <h2>Monthly Cost Projections</h2>
                            <p>Compare costs at different usage scales</p>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <ChartContainer>
                        <Bar data={monthlyData} options={barChartOptions} />
                    </ChartContainer>

                    {/* Stats Grid */}
                    <div className="grid grid-3 gap-md mt-lg">
                        {monthlyProjections.map((proj, idx) => (
                            <Stat key={idx}>
                                <StatLabel>
                                    {monthlyScales[idx].label}/month
                                </StatLabel>
                                <StatValue>
                                    {formatCurrency(proj.savings)}
                                </StatValue>
                                <StatUnit>saved per month</StatUnit>
                            </Stat>
                        ))}
                    </div>
                </div>
            </div>

            {/* Multi-Year ROI */}
            <div className="card animate-fadeIn">
                <div className="card-header">
                    <div className="flex items-center gap-sm">
                        <LineChartIcon size={24} />
                        <div>
                            <h2>5-Year ROI Projection</h2>
                            <p>Cumulative savings at 500M tokens/year</p>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <ChartContainer>
                        <Line data={multiYearChartData} options={lineChartOptions} />
                    </ChartContainer>

                    {/* 5-Year Total */}
                    <TotalSavings>
                        <TotalSavingsLabel>
                            5-Year Total Savings
                        </TotalSavingsLabel>
                        <TotalSavingsValue>
                            {formatCurrency(multiYearData[4].cumulativeSavings)}
                        </TotalSavingsValue>
                    </TotalSavings>
                </div>
            </div>
        </div>
    );
};

export default ProjectionCharts;
