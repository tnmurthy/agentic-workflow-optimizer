import React from 'react';
import styled from 'styled-components';
import { Target, Users, Layers, Layout, Zap } from 'lucide-react';
import LogicFlow from './LogicFlow';

const Card = styled.div`
    margin-top: var(--spacing-xl);
    border: 1px solid var(--glass-border);
`;

const Section = styled.section`
    margin-bottom: var(--spacing-lg);
`;

const KeyFeaturesSection = styled.section`
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--glass-border);
`;

const Heading = styled.h3`
    font-size: 1.25rem;
    color: var(--accent-secondary);
    margin-bottom: var(--spacing-md);
`;

const Feature = styled.div`
    background: var(--bg-tertiary);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
`;

const ZapIcon = styled(Zap)`
    color: var(--accent-success);
`;

const List = styled.ul`
    padding-left: 1.5rem;
    color: var(--text-secondary);
    line-height: 1.8;
`

const ProjectInfo = () => {
    return (
        <Card className="card">
            <div className="card-header">
                <h2 className="flex items-center gap-sm">
                    <Layout size={24} style={{ color: 'var(--accent-primary)' }} />
                    Project Overview: Strategic Objectives & Logic
                </h2>
            </div>

            <div className="card-body">
                {/* 1. Executive Summary */}
                <Section>
                    <Heading className="flex items-center gap-sm">
                        <Target size={20} /> Strategic Executive Summary
                    </Heading>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                        <strong>The Strategic Challenge:</strong> Monolithic, single-prompt enterprise AI applications suffer from systemic token inflation, high API transaction costs, and output instability. These issues force organizations to maintain costly human-in-the-loop manual review teams to correct formatting and quality errors.
                        <br />
                        <strong>The Agentic Solution:</strong> Decomposing complex, monolithic tasks into specialized, sequential agent steps reduces token consumption by over 60%, isolates contexts, and embeds automated validation layers.
                        <br />
                        <strong>The Business Case:</strong> This application models the direct API cost compression and indirect operational labor savings realized by migrating to self-healing agentic workflows, providing a defensible ROI framework for senior leadership.
                    </p>
                </Section>

                {/* 2. The Logic: Visual Flow */}
                <Section>
                    <Heading className="flex items-center gap-sm">
                        <Layers size={20} /> Process Architecture: Monolithic vs. Agentic Workflow
                    </Heading>
                    <LogicFlow />
                </Section>

                <div className="grid grid-2 gap-lg">
                    {/* 3. Strategic Recommendations */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <Users size={20} /> Strategic Implementation Guidelines
                        </Heading>
                        <List>
                            <li><strong>Prioritize High-Frequency Baselines:</strong> Target early migrations on high-volume pipelines with elevated error rates to capture immediate ROI.</li>
                            <li><strong>Establish Automated Schema Validation:</strong> Deploy real-time self-healing validators to reduce downstream human-in-the-loop dependencies from day one.</li>
                            <li><strong>Deconstruct for Multi-Model Routing:</strong> Route low-complexity agent tasks (retrieval, basic parsing) to cost-effective models, reserving premium frontier models for orchestration.</li>
                        </List>
                    </div>

                    {/* 4. Key Capabilities */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <ZapIcon size={20} /> Executive Optimization Suite
                        </Heading>
                        <div className="grid grid-2 gap-md">
                            {[
                                "Agentic Workflow Simulator",
                                "Real-Time Economic Modeler",
                                "Multi-Vendor Cost Optimizer",
                                "Enterprise Scenario Simulator",
                                "Industry Performance Benchmarks",
                                "Five-Year ROI Projection Engine",
                                "Token Payload Visualization",
                                "Context-Window Analyzer"
                            ].map((feature, i) => (
                                <Feature key={i}>
                                    <ZapIcon size={14} />
                                    {feature}
                                </Feature>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectInfo;
