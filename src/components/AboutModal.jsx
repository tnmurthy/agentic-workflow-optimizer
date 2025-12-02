import React from 'react';
import styled from 'styled-components';
import { X, BookOpen, Zap, Layout, AlertTriangle, CheckCircle, ListTree, BarChart, Code, Users, Briefcase } from 'lucide-react';

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
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
`;

const List = styled.ul`
    padding-left: 1.5rem;
    color: var(--text-secondary);
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

                <ModalHeader>
                    <div className="flex items-center gap-sm">
                        <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Agentic Workflow Token Optimizer</h2>
                    </div>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </ModalHeader>

                <div style={{ padding: 'var(--spacing-lg)' }}>

                    <Section>
                        <SectionTitle><Layout size={20} /> Executive Summary</SectionTitle>
                        <p>This document outlines a solution for reducing AI operational costs by optimizing token usage in agentic workflows. By strategically minimizing and compressing token usage at each step, we can significantly cut expenses while maintaining high-quality outputs, making AI applications more efficient and scalable.</p>
                    </Section>

                    <Section>
                        <SectionTitle><AlertTriangle size={20} /> The Problem: Rising AI Operational Costs</SectionTitle>
                        <p>AI workflows, especially those using multiple AI agents (an "agentic workflow"), often waste resources by passing redundant or overly detailed information between steps. This inefficiency leads to higher operational costs and slower performance, creating a barrier to scalable AI adoption.</p>
                        <p><strong>What is an Agentic Workflow?</strong> An agentic workflow is a process where multiple specialized AI agents collaborate to solve a complex problem. Each agent handles a specific sub-task, passing its output to the next, creating a chain of operations.</p>
                    </Section>

                    <Section>
                        <SectionTitle><CheckCircle size={20} /> The Solution: Strategic Token Optimization</SectionTitle>
                        <p>The core of the solution is to minimize and compress token usage at every agent interaction while preserving essential context. This is accomplished through a clear, logical process:</p>
                        <List>
                            <li><strong>Input Analysis:</strong> Parse prompts and outputs to find and eliminate verbose or repetitive segments.</li>
                            <li><strong>Token Minimization:</strong> Use algorithms to remove unnecessary metadata and compress large context windows.</li>
                            <li><strong>State Caching:</strong> Maintain a lightweight cache to inject only the most relevant information into each agent's step.</li>
                            <li><strong>Dynamic Optimization:</strong> Adjust token allocation based on the specific needs of each agent and input type.</li>
                            <li><strong>Cost Logging:</strong> Track tokens used versus tokens saved to provide clear, measurable results.</li>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle><BarChart size={20} /> Quantified Impact & Benefits</SectionTitle>
                        <p>This optimization process can reduce token usage by <strong>30-60%</strong>, depending on the workflow's complexity. This reduction directly translates to significant cost savings, improved performance, and a more sustainable and scalable AI infrastructure.</p>
                        <p><strong>Interactive Visualizations:</strong> This tool now includes advanced visual analytics:</p>
                        <List>
                            <li><strong>Prompt Breakdown Widget:</strong> Real-time token analysis with agent mapping and hover tooltips showing token details.</li>
                            <li><strong>Token Flow Sankey:</strong> Visual representation of token movement through the agentic pipeline, showing reduction at each stage.</li>
                            <li><strong>Cost Breakdown Sankey:</strong> Side-by-side comparison of monolithic vs agentic cost flows, highlighting savings.</li>
                            <li><strong>Interactive Charts:</strong> Projection charts, comparison graphs, and benchmark scenarios for comprehensive analysis.</li>
                        </List>
                    </Section>

                    <Section>
                        <SectionTitle><ListTree size={20} /> High-Level Workflow Logic</SectionTitle>
                        <pre style={{ background: 'var(--bg-tertiary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}><code>
                            For each agent step in workflow:
                            1. Analyze the current input to identify redundancies.
                            2. Compress or prune unnecessary tokens.
                            3. Inject only critical context from the state cache.
                            4. Pass the optimized input to the next agent.
                            5. Track and log the tokens saved.
                        </code></pre>
                    </Section>

                    <Section>
                        <SectionTitle><Users size={20} /> Developer Recommendations</SectionTitle>
                        <List>
                            <li>Build a modular token optimization middleware that can plug into any agentic chain.</li>
                            <li>Provide configuration options for setting compression levels and token budgets.</li>
                            <li>Use dashboards and logging to report savings and monitor performance.</li>
                            <li>Include fallback strategies for edge cases where minimal context might risk degrading output quality.</li>
                        </List>
                    </Section>

                    <FutureNote>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            <Zap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            <strong>Future Directions:</strong> Future enhancements will explore advanced compression techniques, prompt fine-tuning, and the use of smaller, specialized models for even greater efficiency.
                        </p>
                    </FutureNote>

                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AboutModal;
