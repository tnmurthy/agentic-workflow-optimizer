import React from 'react';
import styled from 'styled-components';
import { X, BookOpen, Target, Users, Layers, Code, Zap, Layout } from 'lucide-react';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 14, 23, 0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md);
`;

const ModalContent = styled.div`
    background-color: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: var(--glass-shadow);
`;

const ModalHeader = styled.div`
    position: sticky;
    top: 0;
    background-color: var(--bg-secondary);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-xs);
`;

const Section = styled.section`
    margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
    color: var(--accent-secondary);
`;

const Card = styled.div`
    padding: var(--spacing-md);
`;

const CardTitle = styled.h4`
    color: var(--accent-primary);
`;

const List = styled.ul`
    padding-left: 1.5rem;
    color: var(--text-secondary);
`;

const InScopeList = styled(List)`
    font-size: 0.9rem;
`;

const OutOfScopeList = styled(List)`
    color: var(--text-muted);
    font-size: 0.9rem;
`;

const TechStackGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
`;

const TechStackItem = styled.div`
    background: var(--bg-tertiary);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    text-align: center;
`;

const TechStackLabel = styled.div`
    font-size: 0.8rem;
    color: var(--text-muted);
`;

const TechStackValue = styled.div`
    font-weight: bold;
`;

const FutureNote = styled.div`
    margin-top: var(--spacing-xl);
    padding: var(--spacing-md);
    background: rgba(139, 92, 246, 0.1);
    border-radius: var(--radius-md);
    border: 1px solid var(--accent-primary);
    text-align: center;
`;

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>

                {/* Header */}
                <ModalHeader>
                    <div className="flex items-center gap-sm">
                        <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Project Documentation</h2>
                    </div>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </ModalHeader>

                {/* Content */}
                <div style={{ padding: 'var(--spacing-lg)' }}>

                    {/* 1. Overview */}
                    <Section>
                        <SectionTitle className="flex items-center gap-sm">
                            <Layout size={20} /> 1. Overview
                        </SectionTitle>
                        <p>
                            The Agentic Workflow Token Optimization Web App is an interactive, educational tool that shows how agentic workflows can reduce LLM token usage and cost compared to a single monolithic prompt. It lets users model different agent setups, compare providers, and see the business impact of optimization through clear visuals and reports.
                        </p>
                        <p>
                            The app is front-end only (React + Vite), runs entirely in the browser, and is designed to be used as a demo, exploration tool, and decision-support aid for teams working with LLM-based systems.
                        </p>
                    </Section>

                    {/* 2. Goals */}
                    <Section>
                        <SectionTitle className="flex items-center gap-sm">
                            <Target size={20} /> 2. Goals and Objectives
                        </SectionTitle>
                        <div className="grid grid-2 gap-md">
                            <Card className="card">
                                <CardTitle>Business Goals</CardTitle>
                                <List>
                                    <li>Help teams understand and adopt agentic workflows.</li>
                                    <li>Provide a reusable demo asset for sales and consulting.</li>
                                    <li>Showcase modern frontend engineering and AI product design.</li>
                                </List>
                            </Card>
                            <Card className="card">
                                <CardTitle>Product Objectives</CardTitle>
                                <List>
                                    <li>Visualize token/cost savings clearly.</li>
                                    <li>Enable realistic ROI projections with custom inputs.</li>
                                    <li>Deliver a polished, premium user experience.</li>
                                </List>
                            </Card>
                        </div>
                    </Section>

                    {/* 3. Target Users */}
                    <Section>
                        <SectionTitle className="flex items-center gap-sm">
                            <Users size={20} /> 3. Target Users & Use Cases
                        </SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <strong>Target Users:</strong>
                                <List style={{ marginTop: '0.5rem' }}>
                                    <li>AI Product Managers / Founders</li>
                                    <li>ML / LLM Engineers</li>
                                    <li>Finance / Ops / Procurement</li>
                                    <li>Sales Engineers / Consultants</li>
                                </List>
                            </div>
                            <div>
                                <strong>Key Use Cases:</strong>
                                <List style={{ marginTop: '0.5rem' }}>
                                    <li>Compare monolithic vs agentic token usage.</li>
                                    <li>Experiment with agent counts and roles.</li>
                                    <li>Benchmark patterns (RAG, Summarization).</li>
                                    <li>Compare LLM providers (OpenAI, Anthropic, etc.).</li>
                                    <li>Estimate monthly/yearly ROI.</li>
                                </List>
                            </div>
                        </div>
                    </Section>

                    {/* 4. Scope */}
                    <Section>
                        <SectionTitle className="flex items-center gap-sm">
                            <Layers size={20} /> 4. Scope
                        </SectionTitle>
                        <div className="grid grid-2 gap-md">
                            <div>
                                <h4 style={{ color: 'var(--accent-success)' }}>In Scope (Initial Release)</h4>
                                <InScopeList>
                                    <li>Interactive workflow diagram</li>
                                    <li>Token & cost comparison</li>
                                    <li>Interactive tokenizer</li>
                                    <li>Provider comparison</li>
                                    <li>Scenario builder</li>
                                    <li>Benchmark mode</li>
                                    <li>ROI projection charts</li>
                                    <li>Gamification & Export (PDF/CSV)</li>
                                    <li>Dark-mode, premium design</li>
                                </InScopeList>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)' }}>Out of Scope</h4>
                                <OutOfScopeList>
                                    <li>User accounts / Cloud storage</li>
                                    <li>Live LLM API calls</li>
                                    <li>Team collaboration features</li>
                                    <li>Enterprise billing integration</li>
                                </OutOfScopeList>
                            </div>
                        </div>
                    </Section>

                    {/* 8. Technical Stack */}
                    <Section>
                        <SectionTitle className="flex items-center gap-sm">
                            <Code size={20} /> 8. Technical Stack
                        </SectionTitle>
                        <TechStackGrid>
                            {[
                                { label: 'Frontend', val: 'React 18 + Vite' },
                                { label: 'Charts', val: 'Chart.js' },
                                { label: 'Styling', val: 'Vanilla CSS + Variables' },
                                { label: 'Icons', val: 'Lucide React' },
                                { label: 'Animations', val: 'Framer Motion' },
                                { label: 'Tokenizer', val: 'GPT-Tokenizer' }
                            ].map((item, i) => (
                                <TechStackItem key={i}>
                                    <TechStackLabel>{item.label}</TechStackLabel>
                                    <TechStackValue>{item.val}</TechStackValue>
                                </TechStackItem>
                            ))}
                        </TechStackGrid>
                    </Section>

                    {/* Footer Note */}
                    <FutureNote>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            <Zap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            <strong>Future Enhancements:</strong> Authentication, Live API integration, and Team Collaboration are planned for future updates.
                        </p>
                    </FutureNote>

                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AboutModal;
