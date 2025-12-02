import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Info } from 'lucide-react';

const Container = styled.div`
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
    
    h4 {
        font-size: 0.95rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

const TokenContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    line-height: 1.6;
    font-family: 'Inter', monospace; /* Monospace for token feel */
    font-size: 0.9rem;
`;

const Token = styled.span`
    padding: 2px 4px;
    border-radius: 4px;
    cursor: help;
    transition: all 0.2s ease;
    position: relative;
    background-color: ${props => props.$color};
    color: var(--text-primary);
    border: 1px solid transparent;

    &:hover {
        border-color: var(--accent-primary);
        transform: translateY(-1px);
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Tooltip Logic */
    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        box-shadow: var(--shadow-lg);
        white-space: pre;
        font-size: 0.75rem;
        pointer-events: none;
        min-width: 150px;
        z-index: 20;
        margin-bottom: 5px;
    }
`;

const Legend = styled.div`
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-sm);
    font-size: 0.8rem;
    color: var(--text-secondary);
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    span {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: ${props => props.$color};
    }
`;

// Mock Logic for Token Analysis
const analyzeTokens = (text) => {
    if (!text) return [];

    // Simple split by space/punctuation for demo
    const rawTokens = text.split(/(\s+|[.,!?;])/).filter(t => t.length > 0);

    return rawTokens.map((token, index) => {
        // Randomly assign agents for visualization
        const rand = Math.random();
        let agent = 'General';
        let type = 'Text';
        let color = 'transparent';

        if (token.match(/\s+/)) {
            type = 'Whitespace';
        } else if (token.length > 7 || ['contract', 'agreement', 'clause'].includes(token.toLowerCase())) {
            agent = 'Legal Agent';
            type = 'Entity';
            color = 'rgba(239, 68, 68, 0.15)'; // Red tint
        } else if (['launch', 'strategy', 'market', 'nebula'].includes(token.toLowerCase())) {
            agent = 'Marketing Agent';
            type = 'Keyword';
            color = 'rgba(2, 132, 199, 0.15)'; // Blue tint
        } else if (['api', 'microservices', 'database', 'migration'].includes(token.toLowerCase())) {
            agent = 'Technical Agent';
            type = 'Technical Term';
            color = 'rgba(16, 185, 129, 0.15)'; // Green tint
        }

        // Mock embedding vector
        const vector = `[${Math.random().toFixed(2)}, ${Math.random().toFixed(2)}, ...]`;

        return {
            id: `t_${index + 100}`,
            text: token,
            agent,
            type,
            color,
            vector
        };
    });
};

const PromptBreakdown = ({ text }) => {
    const tokens = useMemo(() => analyzeTokens(text), [text]);

    if (!text) return null;

    return (
        <Container>
            <Header>
                <h4><Info size={16} /> Token Analysis & Agent Mapping</h4>
            </Header>

            <TokenContainer>
                {tokens.map((t, i) => (
                    <Token
                        key={i}
                        $color={t.color}
                        data-tooltip={`ID: ${t.id}\nType: ${t.type}\nAgent: ${t.agent}\nVector: ${t.vector}`}
                    >
                        {t.text}
                    </Token>
                ))}
            </TokenContainer>

            <Legend>
                <LegendItem $color="rgba(239, 68, 68, 0.15)"><span></span> Legal</LegendItem>
                <LegendItem $color="rgba(2, 132, 199, 0.15)"><span></span> Marketing</LegendItem>
                <LegendItem $color="rgba(16, 185, 129, 0.15)"><span></span> Technical</LegendItem>
            </Legend>
        </Container>
    );
};

export default PromptBreakdown;
