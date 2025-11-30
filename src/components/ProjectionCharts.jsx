import React from 'react';
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
    Legend
);

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
                    <div style={{ height: '400px' }}>
                        <Bar data={monthlyData} options={barChartOptions} />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-3 gap-md mt-lg">
                        {monthlyProjections.map((proj, idx) => (
                            <div key={idx} style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    {monthlyScales[idx].label}/month
                                </p>
                                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: '0.5rem' }}>
                                    {formatCurrency(proj.savings)}
                                </p>
                                <p style={{ fontSize: '0.75rem', marginBottom: 0 }}>saved per month</p>
                            </div>
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
                    <div style={{ height: '400px' }}>
                        <Line data={multiYearChartData} options={lineChartOptions} />
                    </div>

                    {/* 5-Year Total */}
                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-lg)',
                        background: 'var(--gradient-success)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>
                            5-Year Total Savings
                        </h3>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: 0 }}>
                            {formatCurrency(multiYearData[4].cumulativeSavings)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectionCharts;
