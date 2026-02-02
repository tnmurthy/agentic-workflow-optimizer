import React from 'react';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';
import { TrendingDown, Info } from 'lucide-react';

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

const InfoBox = styled.div`
    background: rgba(2, 132, 199, 0.1);
    border-left: 4px solid var(--accent-primary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: start;
    gap: var(--spacing-sm);

    p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
`;

const StatCard = styled.div`
    background: ${props => props.$bgColor || 'var(--bg-tertiary)'};
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    text-align: center;

    .label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
    }

    .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: ${props => props.$color || 'var(--text-primary)'};
        margin: 0;
    }
`;

const TokenFlowSankey = ({ tokenAnalysis }) => {
    // Calculate dynamic data from tokenAnalysis or use defaults
    const data = React.useMemo(() => {
        if (!tokenAnalysis) {
            // Default data when no analysis is available
            return {
                inputTokens: 120,
                agents: [
                    { name: 'Legal Agent', tokens: 40, color: '#EF4444' },
                    { name: 'Marketing Agent', tokens: 35, color: '#0284C7' },
                    { name: 'Technical Agent', tokens: 45, color: '#10B981' }
                ],
                processingTokens: 120,
                aggregationTokens: 45,
                outputTokens: 30
            };
        }

        // Use actual token analysis data
        const inputTokens = tokenAnalysis.monolithicTokens;
        const agentsData = tokenAnalysis.agenticBreakdown.map(agent => ({
            name: agent.name,
            tokens: agent.actualTokens,
            color: agent.color
        }));

        const processingTokens = inputTokens;
        const aggregationTokens = tokenAnalysis.agenticTokens;
        const outputTokens = Math.floor(aggregationTokens * 0.67); // Simulated final reduction

        return {
            inputTokens,
            agents: agentsData,
            processingTokens,
            aggregationTokens,
            outputTokens
        };
    }, [tokenAnalysis]);

    // Prepare Sankey data
    const sankeyData = [
        ['From', 'To', 'Token Count'],
        // Input to Agents
        ...data.agents.map(agent => [
            `Input\n(${data.inputTokens} tokens)`,
            agent.name,
            agent.tokens
        ]),
        // Agents to Processing
        ...data.agents.map(agent => [
            agent.name,
            'Processing',
            agent.tokens
        ]),
        // Processing to Aggregation (showing reduction)
        ['Processing', 'Aggregation', data.aggregationTokens],
        // Aggregation to Output
        ['Aggregation', `Final Output\n(${data.outputTokens} tokens)`, data.outputTokens]
    ];

    const options = {
        sankey: {
            node: {
                colors: [
                    '#64748B', // Input
                    '#EF4444', // Legal
                    '#0284C7', // Marketing
                    '#10B981', // Technical
                    '#8B5CF6', // Processing
                    '#F59E0B', // Aggregation
                    '#10B981'  // Output
                ],
                label: {
                    fontName: 'Inter',
                    fontSize: 13,
                    color: '#0F172A',
                    bold: true
                },
                nodePadding: 20,
                width: 8
            },
            link: {
                colorMode: 'gradient',
                color: {
                    fill: '#CBD5E1',
                    fillOpacity: 0.4
                }
            }
        },
        tooltip: {
            textStyle: {
                fontName: 'Inter',
                fontSize: 12
            }
        },
        backgroundColor: 'transparent'
    };

    const reduction = ((data.inputTokens - data.outputTokens) / data.inputTokens * 100).toFixed(1);

    return (
        <Container>
            <Card className="animate-fadeIn">
                <Header>
                    <TrendingDown size={28} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                        <h3>Step 1.5: Token Flow Visualization</h3>
                        <p>See how tokens move through the agentic pipeline</p>
                    </div>
                </Header>

                <InfoBox>
                    <Info size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <p>
                        This diagram shows the journey of tokens from your input prompt through specialized agents,
                        processing, and aggregation to the final optimized output. Width represents token volume.
                    </p>
                </InfoBox>

                <Chart
                    chartType="Sankey"
                    width="100%"
                    height="400px"
                    data={sankeyData}
                    options={options}
                />

                <StatsGrid>
                    <StatCard $bgColor="rgba(100, 116, 139, 0.1)">
                        <div className="label">Input Tokens</div>
                        <div className="value" style={{ color: '#64748B' }}>{data.inputTokens}</div>
                    </StatCard>
                    <StatCard $bgColor="rgba(139, 92, 246, 0.1)">
                        <div className="label">Processing</div>
                        <div className="value" style={{ color: '#8B5CF6' }}>{data.processingTokens}</div>
                    </StatCard>
                    <StatCard $bgColor="rgba(245, 158, 11, 0.1)">
                        <div className="label">Aggregation</div>
                        <div className="value" style={{ color: '#F59E0B' }}>{data.aggregationTokens}</div>
                    </StatCard>
                    <StatCard $bgColor="rgba(16, 185, 129, 0.1)">
                        <div className="label">Final Output</div>
                        <div className="value" style={{ color: '#10B981' }}>{data.outputTokens}</div>
                    </StatCard>
                    <StatCard $bgColor="var(--gradient-success)">
                        <div className="label" style={{ color: 'white' }}>Reduction</div>
                        <div className="value" style={{ color: 'white' }}>{reduction}%</div>
                    </StatCard>
                </StatsGrid>
            </Card>
        </Container>
    );
};

export default TokenFlowSankey;
