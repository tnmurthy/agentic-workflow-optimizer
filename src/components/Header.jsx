import React from 'react';
import styled from 'styled-components';
import { Workflow, BookOpen } from 'lucide-react';

const HeaderCard = styled.header`
    background: var(--gradient-primary);
    margin-bottom: var(--spacing-xl);
    position: relative;
    border-color: rgba(3, 105, 161, 0.3);
`;

const AboutButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    &:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
        color: white;
    }
`;

const WorkflowIcon = styled(Workflow)`
    color: rgba(255, 255, 255, 0.9);
`;

const Title = styled.h1`
    margin-bottom: 0.5rem;
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: white;
    background-clip: unset;
    color: white;
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
                className="btn"
            >
                <BookOpen size={16} />
                About Project
            </AboutButton>
            <div className="flex items-center gap-md mb-md">
                <WorkflowIcon size={48} />
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
