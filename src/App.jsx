import React, { useState } from 'react';
import styled from 'styled-components';
import { BookOpen } from 'lucide-react';
import Header from './components/Header';
import WorkflowDiagram from './components/WorkflowDiagram';
import TokenComparison from './components/TokenComparison';
import CostCalculator from './components/CostCalculator';
import ProjectionCharts from './components/ProjectionCharts';
import ScenarioInput from './components/ScenarioInput';
import TokenizerInput from './components/TokenizerInput';
import ProviderComparison from './components/ProviderComparison';
import ExportTools from './components/ExportTools';
import ScenarioBuilder from './components/ScenarioBuilder';
import BenchmarkMode from './components/BenchmarkMode';
import Gamification from './components/Gamification';
import AboutModal from './components/AboutModal';
import ProjectInfo from './components/ProjectInfo';
import TokenFlowSankey from './components/TokenFlowSankey';
import CostBreakdownSankey from './components/CostBreakdownSankey';
import { defaultPricing } from './data/workflowData';

const AppContainer = styled.div`
    // No specific styles needed here as .container handles it
`;

const Section = styled.div`
    margin-top: var(--spacing-xl);
`;

const GridSection = styled.div`
    margin-top: var(--spacing-xl);
`;

const Footer = styled.footer`
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterHeading = styled.p`
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text-primary);
`;

const FooterText = styled.p`
    margin-bottom: 0;
    opacity: 0.7;
`;


function App() {
    const [pricePerThousand, setPricePerThousand] = useState(defaultPricing.pricePerThousandTokens);
    const [monthlyRequests, setMonthlyRequests] = useState(100000);
    const [monthlyTokens, setMonthlyTokens] = useState(10000000);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [tokenAnalysis, setTokenAnalysis] = useState(null); // Lifted state for token analysis

    return (
        <AppContainer className="container">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            {/* Header */}
            <Header onAboutClick={() => setIsAboutOpen(true)} />

            {/* 1. Context: Project Info */}
            <ProjectInfo />

            {/* 2. Interactive Learning: What is a Token? */}
            <Section>
                <TokenizerInput
                    analysis={tokenAnalysis}
                    onAnalysisChange={setTokenAnalysis}
                />
            </Section>

            {/* 2.5. Token Flow Visualization */}
            <Section>
                <TokenFlowSankey tokenAnalysis={tokenAnalysis} />
            </Section>

            {/* 3. The Concept: Visualizing the Workflow */}
            <WorkflowDiagram />

            {/* 4. The Proof: Token Comparison */}
            <Section>
                <TokenComparison />
            </Section>

            {/* 5. Real Examples: Benchmark Mode */}
            <Section>
                <BenchmarkMode />
            </Section>

            {/* 6. Deep Dive: Scenario Builder */}
            <Section>
                <ScenarioBuilder />
            </Section>

            {/* 7. Economics: Provider Comparison */}
            <Section>
                <ProviderComparison />
            </Section>

            {/* 8. Business Case: Cost Calculator */}
            <GridSection className="grid grid-2 gap-lg">
                <CostCalculator
                    pricePerThousand={pricePerThousand}
                    onPriceChange={setPricePerThousand}
                />
                <ScenarioInput
                    monthlyRequests={monthlyRequests}
                    onMonthlyRequestsChange={setMonthlyRequests}
                    monthlyTokens={monthlyTokens}
                    onMonthlyTokensChange={setMonthlyTokens}
                />
            </GridSection>

            {/* 9. Long-term Value: Projections */}
            <Section>
                <ProjectionCharts pricePerThousand={pricePerThousand} />
            </Section>

            {/* 9.5. Cost Flow Analysis */}
            <Section>
                <CostBreakdownSankey />
            </Section>

            {/* 10. Engagement: Gamification */}
            <Section>
                <Gamification
                    monthlyTokens={monthlyTokens}
                    monthlyRequests={monthlyRequests}
                    pricePerThousand={pricePerThousand}
                />
            </Section>

            {/* 11. Action: Export */}
            <Section>
                <ExportTools pricePerThousand={pricePerThousand} />
            </Section>

            {/* Footer */}
            <Footer>
                <FooterHeading>
                    Ready to Deploy Your Future?
                </FooterHeading>
                <FooterText>
                    Built to demonstrate the efficiency gains of agentic workflows in AI applications
                </FooterText>
            </Footer>
        </AppContainer>
    );
}

export default App;
