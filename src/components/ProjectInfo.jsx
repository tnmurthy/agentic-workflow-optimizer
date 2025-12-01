import React from 'react';
import styled from 'styled-components';
import { Target, Users, Layers, Layout, Zap } from 'lucide-react';

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
                    Project Overview
                </h2>
            </div>

            <div className="card-body">
                {/* 1. Overview */}
                <Section>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        The <strong>Agentic Workflow Token Optimization Web App</strong> is an interactive, educational tool designed to demonstrate how agentic workflows can significantly reduce LLM token usage and costs compared to monolithic prompts. It serves as a decision-support aid for teams evaluating AI architectures.
                    </p>
                </Section>

                <div className="grid grid-2 gap-lg">
                    {/* 2. Goals */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <Target size={20} /> Goals & Objectives
                        </Heading>
                        <List>
                            <li><strong>Visualize Savings:</strong> Make token and cost reductions tangible and easy to understand.</li>
                            <li><strong>Realistic Modeling:</strong> Allow users to plug in their own pricing and usage assumptions.</li>
                            <li><strong>Premium Experience:</strong> Showcase modern frontend engineering with a polished, high-tech design.</li>
                        </List>
                    </div>

                    {/* 3. Target Users */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <Users size={20} /> Target Users
                        </Heading>
                        <List>
                            <li><strong>AI Product Managers:</strong> Evaluating architectures and vendor costs.</li>
                            <li><strong>LLM Engineers:</strong> Designing and tuning agentic pipelines.</li>
                            <li><strong>Finance & Ops:</strong> Modeling long-term LLM spend and ROI.</li>
                        </List>
                    </div>
                </div>

                {/* 4. Key Features */}
                <KeyFeaturesSection>
                    <Heading className="flex items-center gap-sm">
                        <Layers size={20} /> Key Capabilities
                    </Heading>
                    <div className="grid grid-3 gap-md">
                        {[
                            "Interactive Workflow Diagram",
                            "Real-time Token Comparison",
                            "Multi-Provider Pricing",
                            "Custom Scenario Builder",
                            "Benchmark Scenarios",
                            "ROI & Cost Projections"
                        ].map((feature, i) => (
                            <Feature key={i}>
                                <ZapIcon size={14} />
                                {feature}
                            </Feature>
                        ))}
                    </div>
                </KeyFeaturesSection>
            </div>
        </Card>
    );
};

export default ProjectInfo;
