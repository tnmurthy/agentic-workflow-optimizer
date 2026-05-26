import React from 'react';
import styled, { css } from 'styled-components';
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
import { calculateCostWithEngine, calculateCapEx, calculateOpEx, formatCurrency, formatNumber } from '../utils/calculations';

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

const commonCardStyles = css`
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-align: center;
`;

const ChartContainer = styled.div`
    height: 400px;
`;

const Stat = styled.div`
    ${commonCardStyles}
    background: var(--bg-tertiary);
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
    ${commonCardStyles}
    margin-top: var(--spacing-lg);
    background: var(--gradient-success);
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

    @media (max-width: 480px) {
        font-size: 2.25rem;
    }
`;

const ProjectionCharts = ({
    pricePerThousand = 0.002,
    monthlyRequests = 100000,
    monthlyTokens = 10000000,
    laborRate = 45,
    auditTime = 15,
    monoError = 15,
    agenticError = 3,
    implCost = 50000,
    cacheHitRate = 30,
    frontierMix = 40,
    contractDiscount = 15,
    maintenancePercent = 15,
    compact = false
}) => {
    // 1. Calculate per-request costs
    // Monolithic: no caching, no model mixing (100% frontier price)
    const monolithicTokenCost = calculateCostWithEngine(monolithicTokens, pricePerThousand, 0, contractDiscount);
    const monolithicLaborCost = (monoError / 100) * (auditTime / 60) * laborRate;
    const totalMonolithicCostPerReq = monolithicTokenCost + monolithicLaborCost;

    // Agentic: receives cache hit rate benefits and blended pricing
    const utilityPricePerThousand = pricePerThousand / 8;
    const blendedPricePerThousand = (frontierMix / 100) * pricePerThousand + (1 - frontierMix / 100) * utilityPricePerThousand;
    const agenticTokenCost = calculateCostWithEngine(agenticTotalTokens, blendedPricePerThousand, cacheHitRate, contractDiscount);
    const agenticLaborCost = (agenticError / 100) * (auditTime / 60) * laborRate;
    const totalAgenticCostPerReq = agenticTokenCost + agenticLaborCost;

    const monthlyMaintenanceOpEx = calculateOpEx(implCost, maintenancePercent);

    // 2. Define scaling factors for monthly projection chart (Pilot, Target, Expansion)
    const scaleFactors = [
        { label: `Pilot (20% Vol)`, multiplier: 0.2 },
        { label: `Target (Current Vol)`, multiplier: 1.0 },
        { label: `Expansion (5x Vol)`, multiplier: 5.0 }
    ];

    const monthlyProjections = scaleFactors.map(scale => {
        const reqs = Math.max(1, Math.round(monthlyRequests * scale.multiplier));
        const monolithicCost = totalMonolithicCostPerReq * reqs;
        
        // Agentic cost includes monthly maintenance OpEx!
        const agenticCost = totalAgenticCostPerReq * reqs + monthlyMaintenanceOpEx;
        const savings = monolithicCost - agenticCost;

        return {
            label: scale.label,
            requests: reqs,
            monolithicCost,
            agenticCost,
            savings
        };
    });

    const monthlyData = {
        labels: monthlyProjections.map(p => p.label),
        datasets: [
            {
                label: 'Monolithic TCO (Tokens + Labor)',
                data: monthlyProjections.map(p => p.monolithicCost),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
            },
            {
                label: 'Agentic TCO (Tokens + Labor + OpEx)',
                data: monthlyProjections.map(p => p.agenticCost),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
            },
        ],
    };

    // 3. Multi-year J-Curve Cash Flow (Start CapEx, Year 1, 2, 3, 4, 5)
    const timelineLabels = ['Start (CapEx)', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    
    // Monthly gross savings
    const monthlyGrossSavings = (totalMonolithicCostPerReq - totalAgenticCostPerReq) * monthlyRequests;
    const monthlyNetSavings = monthlyGrossSavings - monthlyMaintenanceOpEx;
    const annualNetSavings = monthlyNetSavings * 12;

    const timelineData = [
        -implCost, // Start CapEx
        (annualNetSavings * 1) - implCost,
        (annualNetSavings * 2) - implCost,
        (annualNetSavings * 3) - implCost,
        (annualNetSavings * 4) - implCost,
        (annualNetSavings * 5) - implCost
    ];

    const multiYearChartData = {
        labels: timelineLabels,
        datasets: [
            {
                label: 'Cumulative Net Benefit (J-Curve)',
                data: timelineData,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 3,
                tension: 0.3,
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
                    color: '#A7B3C6',
                    font: {
                        size: 11,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 14, 28, 0.95)',
                titleColor: '#fff',
                bodyColor: '#A7B3C6',
                borderColor: 'rgba(129, 140, 248, 0.4)',
                borderWidth: 1,
                padding: 10,
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
                    color: 'rgba(255, 255, 255, 0.08)',
                },
                ticks: {
                    color: '#A7B3C6',
                    font: {
                        size: 10,
                    },
                    callback: function (value) {
                        if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                        if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                        return '$' + value;
                    }
                },
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)',
                },
                ticks: {
                    color: '#A7B3C6',
                    font: {
                        size: 10,
                    },
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
                    color: '#A7B3C6',
                    font: {
                        size: 11,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 14, 28, 0.95)',
                titleColor: '#fff',
                bodyColor: '#A7B3C6',
                borderColor: 'rgba(129, 140, 248, 0.4)',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: function (context) {
                        return 'Net Position: ' + formatCurrency(context.parsed.y);
                    }
                }
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)',
                },
                ticks: {
                    color: '#A7B3C6',
                    font: {
                        size: 10,
                    },
                    callback: function (value) {
                        if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                        if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                        if (value < 0) {
                            const positiveVal = Math.abs(value);
                            if (positiveVal >= 1000000) return '-$' + (positiveVal / 1000000).toFixed(1) + 'M';
                            if (positiveVal >= 1000) return '-$' + (positiveVal / 1000).toFixed(0) + 'k';
                            return '-$' + positiveVal;
                        }
                        return '$' + value;
                    }
                },
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.08)',
                },
                ticks: {
                    color: '#A7B3C6',
                    font: {
                        size: 10,
                    },
                },
            },
        },
    };

    if (compact) {
        return (
            <div className="card animate-fadeIn" style={{ padding: '0.75rem var(--spacing-sm)', marginBottom: 0 }}>
                <div className="card-header" style={{ paddingBottom: '0.4rem', marginBottom: '0.6rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <div className="flex items-center gap-sm">
                        <LineChartIcon size={18} style={{ color: 'var(--accent-primary)' }} />
                        <div>
                            <h2 style={{ fontSize: '0.95rem', marginBottom: 0 }}>5-Year J-Curve ROI Projection</h2>
                            <p style={{ fontSize: '0.75rem', margin: 0 }}>Cumulative Net Value factoring in setup CapEx & monthly maintenance OpEx</p>
                        </div>
                    </div>
                </div>

                <div className="card-body" style={{ padding: 0 }}>
                    <ChartContainer style={{ height: '220px' }}>
                        <Line data={multiYearChartData} options={lineChartOptions} />
                    </ChartContainer>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-lg">
            {/* Monthly Projections */}
            <div className="card animate-fadeIn">
                <div className="card-header">
                    <div className="flex items-center gap-sm">
                        <BarChart3 size={24} />
                        <div>
                            <h2>Monthly Cost Projections</h2>
                            <p>Monthly Total Cost of Ownership (TCO) compared across scale points (including OpEx maintenance)</p>
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
                                    {proj.label} ({formatNumber(proj.requests)} reqs/mo)
                                </StatLabel>
                                <StatValue>
                                    {formatCurrency(proj.savings)}
                                </StatValue>
                                <StatUnit>net savings / month</StatUnit>
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
                            <h2>5-Year J-Curve ROI Projection</h2>
                            <p>Cumulative Net Business Value factoring in the initial {formatCurrency(implCost)} setup CapEx and {formatCurrency(monthlyMaintenanceOpEx)}/mo OpEx</p>
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
                            5-Year Cumulative Net Economic Benefit
                        </TotalSavingsLabel>
                        <TotalSavingsValue>
                            {formatCurrency(timelineData[5])}
                        </TotalSavingsValue>
                    </TotalSavings>
                </div>
            </div>
        </div>
    );
};

export default ProjectionCharts;
