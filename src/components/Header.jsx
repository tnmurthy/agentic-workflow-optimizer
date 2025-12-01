import React from 'react';
import styled from 'styled-components';
import { Workflow, BookOpen } from 'lucide-react';

const HeaderCard = styled.header`
    background: var(--gradient-primary);
    margin-bottom: var(--spacing-xl);
    position: relative;
`;

const AboutButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
`;

const Title = styled.h1`
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0;
`;

const Description = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    margin-bottom: 0;
`;


const Header = ({ onAboutClick }) => {
    return (
        <HeaderCard className="card">
            <AboutButton
                onClick={onAboutClick}
                className="btn btn-secondary"
            >
                <BookOpen size={16} />
                About Project
            </AboutButton>
            <div className="flex items-center gap-md mb-md">
                <Workflow size={48} />
                <div>
                    <Title>Agentic Workflow Token Optimizer</Title>
                    <Subtitle>
                        Reduce AI Costs by up to 60% with Modular Agent Pipelines
                    </Subtitle>
                </div>
            </div>
            <Description>
                Discover how breaking down monolithic prompts into specialized agents can dramatically reduce token usage and operational costs for your AI applications.
            </Description>
        </HeaderCard>
    );
};

export default Header;
