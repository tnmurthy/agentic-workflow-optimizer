import React, { useState, lazy, Suspense } from 'react';
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
import ScenarioBuilder from './components/ScenarioBuilder';
import BenchmarkMode from './components/BenchmarkMode';
import AboutModal from './components/AboutModal';
import ProjectInfo from './components/ProjectInfo';
import TokenFlowSankey from './components/TokenFlowSankey';
import CostBreakdownSankey from './components/CostBreakdownSankey';
import ErrorBoundary from './components/ErrorBoundary';
import { defaultPricing } from './data/workflowData';

const Gamification = lazy(() => import('./components/Gamification'));
const ExportTools = lazy(() => import('./components/ExportTools'));
const RunTrace = lazy(() => import('./components/RunTrace'));

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
            <ErrorBoundary>
                <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            </ErrorBoundary>

            {/* Header */}
            <ErrorBoundary>
                <Header onAboutClick={() => setIsAboutOpen(true)} />
            </ErrorBoundary>

            {/* 1. Context: Project Info */}
            <ErrorBoundary>
                <ProjectInfo />
            </ErrorBoundary>

            {/* 2. Interactive Learning: What is a Token? */}
            <Section>
                <ErrorBoundary>
                    <TokenizerInput
                        analysis={tokenAnalysis}
                        onAnalysisChange={setTokenAnalysis}
                    />
                </ErrorBoundary>
            </Section>

            {/* 2.5. Token Flow Visualization */}
            <Section>
                <ErrorBoundary>
                    <TokenFlowSankey tokenAnalysis={tokenAnalysis} />
                </ErrorBoundary>
            </Section>

            {/* 3. The Concept: Visualizing the Workflow */}
            <ErrorBoundary>
                <WorkflowDiagram />
            </ErrorBoundary>

            {/* 4. The Proof: Token Comparison */}
            <Section>
                <ErrorBoundary>
                    <TokenComparison />
                </ErrorBoundary>
            </Section>

            {/* 5. Real Examples: Benchmark Mode */}
            <Section>
                <ErrorBoundary>
                    <BenchmarkMode />
                </ErrorBoundary>
            </Section>

            {/* 6. Deep Dive: Scenario Builder */}
            <Section>
                <ErrorBoundary>
                    <ScenarioBuilder />
                </ErrorBoundary>
            </Section>

            {/* 7. Economics: Provider Comparison */}
            <Section>
                <ErrorBoundary>
                    <ProviderComparison />
                </ErrorBoundary>
            </Section>

            {/* 8. Business Case: Cost Calculator */}
            <GridSection className="grid grid-2 gap-lg">
                <ErrorBoundary>
                    <CostCalculator
                        pricePerThousand={pricePerThousand}
                        onPriceChange={setPricePerThousand}
                    />
                </ErrorBoundary>
                <ErrorBoundary>
                    <ScenarioInput
                        monthlyRequests={monthlyRequests}
                        onMonthlyRequestsChange={setMonthlyRequests}
                        monthlyTokens={monthlyTokens}
                        onMonthlyTokensChange={setMonthlyTokens}
                    />
                </ErrorBoundary>
            </GridSection>

            {/* 9. Long-term Value: Projections */}
            <Section>
                <ErrorBoundary>
                    <ProjectionCharts pricePerThousand={pricePerThousand} />
                </ErrorBoundary>
            </Section>

            {/* 9.5. Cost Flow Analysis */}
            <Section>
                <ErrorBoundary>
                    <CostBreakdownSankey />
                </ErrorBoundary>
            </Section>

            {/* 10. Engagement: Gamification */}
            <Section>
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <Gamification
                            monthlyTokens={monthlyTokens}
                            monthlyRequests={monthlyRequests}
                            pricePerThousand={pricePerThousand}
                        />
                    </Suspense>
                </ErrorBoundary>
            </Section>

            {/* 11. Action: Export */}
            <Section>
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <ExportTools pricePerThousand={pricePerThousand} />
                    </Suspense>
                </ErrorBoundary>
            </Section>

            {/* 12. Observability: Run Traces */}
            <Section>
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <RunTrace />
                    </Suspense>
                </ErrorBoundary>
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
