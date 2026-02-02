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
                    Project Overview
                </h2>
            </div>

            <div className="card-body">
                {/* 1. Executive Summary */}
                <Section>
                    <Heading className="flex items-center gap-sm">
                        <Target size={20} /> Executive Summary
                    </Heading>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        <strong>The Challenge:</strong> As enterprises scale AI adoption, operational costs from "monolithic" (single-prompt) workflows are becoming unsustainable.
                        <br />
                        <strong>The Solution:</strong> "Agentic Workflows"—breaking complex tasks into specialized, smaller steps—can reduce token consumption by over 60% while improving accuracy.
                        <br />
                        <strong>The Value:</strong> This tool provides a quantifiable framework to visualize these savings, model different architectural scenarios, and justify the ROI of moving to agentic systems.
                    </p>
                </Section>

                {/* 2. The Logic: Visual Flow */}
                <Section>
                    <Heading className="flex items-center gap-sm">
                        <Layers size={20} /> The Logic
                    </Heading>
                    <LogicFlow />
                </Section>

                <div className="grid grid-2 gap-lg">
                    {/* 3. Strategic Recommendations */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <Users size={20} /> Strategic Recommendations
                        </Heading>
                        <List>
                            <li><strong>Start Small:</strong> Pilot agentic workflows on high-volume, low-complexity tasks first.</li>
                            <li><strong>Measure Everything:</strong> Use our "Cost Calculator" to establish a baseline before migrating.</li>
                            <li><strong>Optimize Continuously:</strong> Re-evaluate your agent definitions as model pricing evolves.</li>
                        </List>
                    </div>

                    {/* 4. Key Capabilities */}
                    <div>
                        <Heading className="flex items-center gap-sm">
                            <ZapIcon size={20} /> The Toolkit
                        </Heading>
                        <div className="grid grid-2 gap-md">
                            {[
                                "Interactive Workflow Engine",
                                "Real-time Cost Analysis",
                                "Multi-Model Pricing",
                                "Strategic Scenario Builder",
                                "Performance Benchmarks",
                                "ROI Projection Engine",
                                "Token Flow Sankey Charts",
                                "Prompt Breakdown Widget"
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
