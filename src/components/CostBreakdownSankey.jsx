import React from 'react';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';
import { DollarSign, TrendingDown } from 'lucide-react';

const Container = styled.div`
    margin: var(--spacing-xl) 0;
`;

const Card = styled.div`
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);

    h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.25rem;
    }

    p {
        margin: 0.5rem 0 0 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
`;

const StatCard = styled.div`
    background: ${props => props.$bgColor || 'var(--bg-tertiary)'};
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    text-align: center;

    .label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
    }

    .value {
        font-size: 1.75rem;
        font-weight: bold;
        color: ${props => props.$color || 'var(--text-primary)'};
        margin: 0;
    }

    .subtext {
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }
`;

const CostBreakdownSankey = ({ costData }) => {
    // Default data if none provided
    const defaultData = {
        monolithicCost: 1.20,
        agenticCost: 0.45,
        breakdown: {
            monolithic: {
                inputProcessing: 0.40,
                contextWindow: 0.50,
                outputGeneration: 0.30
            },
            agentic: {
                legalAgent: 0.15,
                marketingAgent: 0.12,
                technicalAgent: 0.18
            }
        }
    };

    const data = costData || defaultData;
    const savings = data.monolithicCost - data.agenticCost;
    const savingsPercent = ((savings / data.monolithicCost) * 100).toFixed(1);

    // Prepare Sankey data
    const sankeyData = [
        ['From', 'To', 'Cost ($)'],

        // Monolithic breakdown
        ['Monolithic\nApproach', 'Input Processing', data.breakdown.monolithic.inputProcessing],
        ['Monolithic\nApproach', 'Context Window', data.breakdown.monolithic.contextWindow],
        ['Monolithic\nApproach', 'Output Generation', data.breakdown.monolithic.outputGeneration],

        // Monolithic components to total
        ['Input Processing', 'Total\nMonolithic Cost', data.breakdown.monolithic.inputProcessing],
        ['Context Window', 'Total\nMonolithic Cost', data.breakdown.monolithic.contextWindow],
        ['Output Generation', 'Total\nMonolithic Cost', data.breakdown.monolithic.outputGeneration],

        // Agentic breakdown
        ['Agentic\nApproach', 'Legal Agent', data.breakdown.agentic.legalAgent],
        ['Agentic\nApproach', 'Marketing Agent', data.breakdown.agentic.marketingAgent],
        ['Agentic\nApproach', 'Technical Agent', data.breakdown.agentic.technicalAgent],

        // Agentic components to total
        ['Legal Agent', 'Total\nAgentic Cost', data.breakdown.agentic.legalAgent],
        ['Marketing Agent', 'Total\nAgentic Cost', data.breakdown.agentic.marketingAgent],
        ['Technical Agent', 'Total\nAgentic Cost', data.breakdown.agentic.technicalAgent],

        // Comparison to savings
        ['Total\nMonolithic Cost', 'Cost\nComparison', data.monolithicCost],
        ['Total\nAgentic Cost', 'Cost\nComparison', data.agenticCost],
        ['Cost\nComparison', `Savings\n$${savings.toFixed(2)}`, savings]
    ];

    const options = {
        sankey: {
            node: {
                colors: [
                    '#EF4444', // Monolithic Approach (red)
                    '#FCA5A5', // Input Processing (light red)
                    '#F87171', // Context Window (medium red)
                    '#DC2626', // Output Generation (dark red)
                    '#EF4444', // Total Monolithic (red)
                    '#10B981', // Agentic Approach (green)
                    '#6EE7B7', // Legal Agent (light green)
                    '#34D399', // Marketing Agent (medium green)
                    '#059669', // Technical Agent (dark green)
                    '#10B981', // Total Agentic (green)
                    '#64748B', // Comparison (gray)
                    '#10B981'  // Savings (green)
                ],
                label: {
                    fontName: 'Inter',
                    fontSize: 12,
                    color: '#0F172A',
                    bold: true
                },
                nodePadding: 15,
                width: 10
            },
            link: {
                colorMode: 'gradient',
                color: {
                    fillOpacity: 0.5
                }
            }
        },
        tooltip: {
            textStyle: {
                fontName: 'Inter',
                fontSize: 12
            },
            isHtml: false
        },
        backgroundColor: 'transparent'
    };

    return (
        <Container>
            <Card className="animate-fadeIn">
                <Header>
                    <DollarSign size={28} style={{ color: 'var(--accent-success)' }} />
                    <div>
                        <h3>Cost Flow Analysis</h3>
                        <p>Visual breakdown of cost distribution and savings</p>
                    </div>
                </Header>

                <Chart
                    chartType="Sankey"
                    width="100%"
                    height="450px"
                    data={sankeyData}
                    options={options}
                />

                <StatsRow>
                    <StatCard $bgColor="rgba(239, 68, 68, 0.1)">
                        <div className="label">Monolithic Cost</div>
                        <div className="value" style={{ color: '#EF4444' }}>
                            ${data.monolithicCost.toFixed(2)}
                        </div>
                        <div className="subtext">per 1K tokens</div>
                    </StatCard>

                    <StatCard $bgColor="rgba(16, 185, 129, 0.1)">
                        <div className="label">Agentic Cost</div>
                        <div className="value" style={{ color: '#10B981' }}>
                            ${data.agenticCost.toFixed(2)}
                        </div>
                        <div className="subtext">per 1K tokens</div>
                    </StatCard>

                    <StatCard $bgColor="var(--gradient-success)">
                        <div className="label" style={{ color: 'white' }}>Total Savings</div>
                        <div className="value" style={{ color: 'white' }}>
                            ${savings.toFixed(2)}
                        </div>
                        <div className="subtext" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {savingsPercent}% reduction
                        </div>
                    </StatCard>
                </StatsRow>
            </Card>
        </Container>
    );
};

export default CostBreakdownSankey;
