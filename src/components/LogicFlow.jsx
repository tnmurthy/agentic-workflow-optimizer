import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import styled from 'styled-components';
import { AlertTriangle, GitBranch, TrendingDown, Split, Activity, ArrowRight } from 'lucide-react';

const Container = styled.div`
    margin-top: var(--spacing-lg);
`;

const ConceptSection = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--spacing-md);
    align-items: center;
    margin-bottom: var(--spacing-xl);
    background: var(--bg-tertiary);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        text-align: center;
    }
`;

const ConceptBox = styled.div`
    text-align: center;
    padding: var(--spacing-md);
    background: var(--bg-card);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h4 {
        color: var(--accent-primary);
        margin-bottom: 0.5rem;
    }

    p {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0;
    }

    .icon {
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
    }
`;

const Connector = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;

    span {
        background: var(--bg-primary);
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-full);
        border: 1px solid var(--glass-border);
        margin-bottom: 0.5rem;
    }
`;

const CardsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
`;

const LogicCard = styled.div`
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    position: relative;
    transition: all var(--transition-base);

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--accent-primary);
    }

    .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--spacing-md);
        font-size: 1.5rem;
    }

    h4 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    p {
        font-size: 0.9rem;
        margin-bottom: 0;
        color: var(--text-secondary);
    }
`;

const DiagramContainer = styled.div`
    background: white;
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-md);
    overflow-x: auto;
    display: flex;
    justify-content: center;

    /* Mermaid specific overrides for clean look */
    .node rect, .node circle, .node ellipse, .node polygon, .node path {
        fill: var(--bg-tertiary);
        stroke: var(--accent-primary);
        stroke-width: 2px;
    }
    
    .node .label {
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
    }

    .edgePath .path {
        stroke: var(--text-secondary);
        stroke-width: 1.5px;
    }

    .cluster rect {
        fill: rgba(2, 132, 199, 0.05);
        stroke: var(--accent-primary);
        stroke-dasharray: 4;
    }
`;

const LogicFlow = () => {
    const chartRef = useRef(null);

    const diagramDefinition = `
flowchart TB
  P["Prompt (User input)"] --> T["Tokenization (tokenize to t001..t120)"]
  T --> TOK["Tokens Pool (t001..t120)"]

  %% Distribution
  TOK --> A1["Agent 1 (t001..t040)"]
  TOK --> A2["Agent 2 (t041..t080)"]
  TOK --> A3["Agent 3 (t081..t120)"]

  %% Agent processing outputs
  A1 --> AP1["Agent 1 Processing (consumes t001..t040)"]
  A2 --> AP2["Agent 2 Processing (consumes t041..t080)"]
  A3 --> AP3["Agent 3 Processing (consumes t081..t120)"]

  %% Optional feedback loops
  AP1 -->|"Feedback if confidence is low"| TOK
  AP2 -->|"Cost-optimize / truncate"| TOK

  %% Aggregation and finalization
  AP1 --> AGG["Aggregation & Recomposition"]
  AP2 --> AGG
  AP3 --> AGG

  AGG --> FINAL["Final Response Assembly"]
  FINAL --> OUT["Output to user (30 tokens)"]
    `;

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                primaryColor: '#F1F5F9',
                primaryTextColor: '#0F172A',
                primaryBorderColor: '#0284C7',
                lineColor: '#475569',
                secondaryColor: '#F8FAFC',
                tertiaryColor: '#FFFFFF',
            },
            fontFamily: 'Inter'
        });

        const renderChart = async () => {
            if (chartRef.current) {
                try {
                    chartRef.current.innerHTML = '';
                    const uniqueId = `mermaid-chart-${Math.floor(Math.random() * 100000)}`;
                    const { svg } = await mermaid.render(uniqueId, diagramDefinition);
                    if (chartRef.current) {
                        chartRef.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error('Failed to render mermaid chart:', error);
                }
            }
        };

        renderChart();
    }, [diagramDefinition]);

    return (
        <Container>
            {/* Concept Map: Breakdown vs Pipeline */}
            <ConceptSection>
                <ConceptBox>
                    <Split size={32} className="icon" />
                    <h4>Agentic Breakdown</h4>
                    <p><strong>The Structure (Static)</strong><br />Decomposing a complex task into specialized roles.</p>
                </ConceptBox>

                <Connector>
                    <span>activates</span>
                    <ArrowRight size={24} />
                </Connector>

                <ConceptBox>
                    <Activity size={32} className="icon" />
                    <h4>Workflow Pipeline</h4>
                    <p><strong>The Flow (Dynamic)</strong><br />Orchestrating data movement between those roles.</p>
                </ConceptBox>
            </ConceptSection>

            {/* High Level Cards */}
            <CardsContainer>
                <LogicCard>
                    <div className="icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <h4>The Problem (Cause)</h4>
                    <p>Monolithic prompts send massive context windows to expensive models for every small request, burning budget inefficiently.</p>
                </LogicCard>

                <LogicCard>
                    <div className="icon-wrapper" style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-primary)' }}>
                        <GitBranch size={24} />
                    </div>
                    <h4>The Method (Process)</h4>
                    <p>We decompose tasks. Specialized "Agents" only see the context they need, routed intelligently based on token type.</p>
                </LogicCard>

                <LogicCard>
                    <div className="icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>
                        <TrendingDown size={24} />
                    </div>
                    <h4>The Result (Benefit)</h4>
                    <p>Drastically lower costs (60%+), faster processing, and easier debugging through granular control.</p>
                </LogicCard>
            </CardsContainer>

            {/* Detailed Diagram */}
            <h3 className="text-center mb-md">Visualizing the Pipeline</h3>
            <DiagramContainer ref={chartRef} />
        </Container>
    );
};

export default LogicFlow;
