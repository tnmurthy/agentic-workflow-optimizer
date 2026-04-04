import React, { useState } from 'react';
import styled from 'styled-components';
import { LayoutDashboard, Cpu, FlaskConical, DollarSign, Trophy } from 'lucide-react';
import Header from './components/Header';
import ExecDashboard from './components/ExecDashboard';
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
import RunTrace from './components/RunTrace';
import { defaultPricing } from './data/workflowData';

const AppContainer = styled.div``;

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
    border-top: 1px solid var(--glass-border);
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

const TabBar = styled.nav`
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    margin-top: var(--spacing-lg);
    overflow-x: auto;
    flex-wrap: nowrap;
`;

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1.1rem;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;
    background: ${({ $active }) => $active ? 'var(--gradient-accent)' : 'transparent'};
    color: ${({ $active }) => $active ? '#fff' : 'var(--text-secondary)'};
    box-shadow: ${({ $active }) => $active ? 'var(--shadow-md)' : 'none'};

    &:hover {
        background: ${({ $active }) => $active ? 'var(--gradient-accent)' : 'var(--bg-tertiary)'};
        color: ${({ $active }) => $active ? '#fff' : 'var(--text-primary)'};
    }
`;

const TabContent = styled.div`
    display: ${({ $active }) => $active ? 'block' : 'none'};
`;

const TABS = [
    { id: 'overview',   label: 'Overview',          Icon: LayoutDashboard },
    { id: 'tokens',     label: 'Token Analysis',     Icon: Cpu },
    { id: 'benchmarks', label: 'Benchmarks',         Icon: FlaskConical },
    { id: 'costs',      label: 'Cost & Economics',   Icon: DollarSign },
    { id: 'results',    label: 'Results & Export',   Icon: Trophy },
];

function App() {
    const [pricePerThousand, setPricePerThousand] = useState(defaultPricing.pricePerThousandTokens);
    const [monthlyRequests, setMonthlyRequests] = useState(100000);
    const [monthlyTokens, setMonthlyTokens] = useState(10000000);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [tokenAnalysis, setTokenAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <AppContainer className="container">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            {/* Header */}
            <Header onAboutClick={() => setIsAboutOpen(true)} />

            {/* Tab Navigation */}
            <TabBar role="tablist" aria-label="Page sections">
                {TABS.map(({ id, label, Icon }) => (
                    <TabButton
                        key={id}
                        role="tab"
                        aria-selected={activeTab === id}
                        $active={activeTab === id}
                        onClick={() => setActiveTab(id)}
                    >
                        <Icon size={16} />
                        {label}
                    </TabButton>
                ))}
            </TabBar>

            {/* Tab: Overview */}
            <TabContent $active={activeTab === 'overview'} role="tabpanel">
                <ExecDashboard />
                <ProjectInfo />
            </TabContent>

            {/* Tab: Token Analysis */}
            <TabContent $active={activeTab === 'tokens'} role="tabpanel">
                <Section>
                    <TokenizerInput
                        analysis={tokenAnalysis}
                        onAnalysisChange={setTokenAnalysis}
                    />
                </Section>
                <Section>
                    <TokenFlowSankey tokenAnalysis={tokenAnalysis} />
                </Section>
                <WorkflowDiagram />
                <Section>
                    <TokenComparison />
                </Section>
            </TabContent>

            {/* Tab: Benchmarks */}
            <TabContent $active={activeTab === 'benchmarks'} role="tabpanel">
                <Section>
                    <BenchmarkMode />
                </Section>
                <Section>
                    <ScenarioBuilder />
                </Section>
            </TabContent>

            {/* Tab: Cost & Economics */}
            <TabContent $active={activeTab === 'costs'} role="tabpanel">
                <Section>
                    <ProviderComparison />
                </Section>
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
                <Section>
                    <ProjectionCharts pricePerThousand={pricePerThousand} />
                </Section>
                <Section>
                    <CostBreakdownSankey />
                </Section>
            </TabContent>

            {/* Tab: Results & Export */}
            <TabContent $active={activeTab === 'results'} role="tabpanel">
                <Section>
                    <Gamification
                        monthlyTokens={monthlyTokens}
                        monthlyRequests={monthlyRequests}
                        pricePerThousand={pricePerThousand}
                    />
                </Section>
                <Section>
                    <ExportTools pricePerThousand={pricePerThousand} />
                </Section>
                <Section>
                    <RunTrace />
                </Section>
            </TabContent>

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
