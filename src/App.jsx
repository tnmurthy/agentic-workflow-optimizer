import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LayoutDashboard, Cpu, Database, MessageSquare, FileText, Sparkles, Presentation, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import Header from './components/Header';
import ExecDashboard from './components/ExecDashboard';
import WorkflowDiagram from './components/WorkflowDiagram';
import TokenComparison from './components/TokenComparison';
import CostCalculator from './components/CostCalculator';
import ProjectionCharts from './components/ProjectionCharts';
import TokenizerInput from './components/TokenizerInput';
import ProviderComparison from './components/ProviderComparison';
import ExportTools from './components/ExportTools';
import Gamification from './components/Gamification';
import AboutModal from './components/AboutModal';
import ProjectInfo from './components/ProjectInfo';
import TokenFlowSankey from './components/TokenFlowSankey';
import CostBreakdownSankey from './components/CostBreakdownSankey';
import RunTrace from './components/RunTrace';
import PresentationDeck from './components/PresentationDeck';
import BenchmarkMode from './components/BenchmarkMode';
import ScenarioBuilder from './components/ScenarioBuilder';
import { Toaster } from 'react-hot-toast';
import { defaultPricing } from './data/workflowData';
import { llmProviders as staticFallbackProviders } from './data/llmProviders';
import { fetchLatestPricing } from './utils/pricingApi';

/* ── Case Study Preset Profiles ────────────────────────── */
const caseStudies = [
    {
        id: 'credit_underwriting',
        name: 'Fortune 500 Credit Underwriting (RAG)',
        icon: 'database',
        description: 'Automating high-precision risk analysis across thousands of reports.',
        financials: {
            volume: 150000,
            tokens: 150000000,
            laborRate: 55,
            auditTime: 12,
            devFte: 3,
            buildWeeks: 6,
            builderRate: 83.33 // scales to ~$60K setup CapEx
        },
        monolithic: {
            errorRate: 14
        },
        agentic: {
            errorRate: 1.5
        }
    },
    {
        id: 'telco_routing',
        name: 'Telco Support Ticket Router (Classification)',
        icon: 'message',
        description: 'Intelligent triage and routing of support tickets and chats.',
        financials: {
            volume: 800000,
            tokens: 80000000,
            laborRate: 32,
            auditTime: 8,
            devFte: 2,
            buildWeeks: 6,
            builderRate: 93.75 // scales to $45K setup CapEx
        },
        monolithic: {
            errorRate: 20
        },
        agentic: {
            errorRate: 3.0
        }
    },
    {
        id: 'healthcare_claims',
        name: 'Healthcare Compliance (Summarization)',
        icon: 'file',
        description: 'Analyzing and validating patient documents for insurance claims.',
        financials: {
            volume: 250000,
            tokens: 300000000,
            laborRate: 65,
            auditTime: 20,
            devFte: 4,
            buildWeeks: 6,
            builderRate: 83.33 // scales to ~$80K setup CapEx
        },
        monolithic: {
            errorRate: 16
        },
        agentic: {
            errorRate: 1.0
        }
    }
];

const renderPresetIcon = (iconName) => {
    switch (iconName) {
        case 'database': return <Database size={16} />;
        case 'message': return <MessageSquare size={16} />;
        case 'file': return <FileText size={16} />;
        default: return <Database size={16} />;
    }
};

/* ── Styled Components ─────────────────────────────────── */
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
    font-size: 0.9rem;
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

const DashboardLayout = styled.div`
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
    align-items: start;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const SidebarColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
`;

const MainColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
`;

const PresetCard = styled.div`
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
`;

const PresetGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
`;

const PresetButton = styled.button`
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid ${({ $active }) => $active ? 'var(--accent-primary)' : 'transparent'};
    border-radius: var(--radius-md);
    background: ${({ $active }) => $active ? 'rgba(2, 132, 199, 0.08)' : 'transparent'};
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-base);
    text-align: left;

    &:hover {
        background: rgba(255, 255, 255, 0.03);
        border-color: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--glass-border)'};
    }

    .icon-container {
        color: ${({ $active }) => $active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.15rem;
        flex-shrink: 0;
    }

    .info-container {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 0.825rem;
        font-weight: 700;
        color: var(--text-primary);
    }

    .desc {
        font-size: 0.72rem;
        color: var(--text-secondary);
        margin-top: 0.15rem;
        line-height: 1.35;
    }
`;

const TechSection = styled.section`
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--bg-card);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
`;

const TechSectionHeader = styled.div`
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: var(--spacing-md);
    margin-bottom: var(--spacing-lg);

    h2 {
        font-size: 1.5rem;
        color: var(--accent-primary);
        margin-bottom: 0.25rem;
        margin-top: 0;
    }
    p {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
    }
`;

const TechStepBadge = styled.span`
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-sm);
    background: rgba(2, 132, 199, 0.1);
    color: var(--accent-primary);
    margin-bottom: 0.5rem;
    border: 1px solid rgba(2, 132, 199, 0.2);
`;

const NarrativeConnector = styled.div`
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background: rgba(99, 102, 241, 0.04);
    border: 1px dashed rgba(99, 102, 241, 0.25);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);

    strong {
        color: var(--accent-secondary);
    }
`;

const CommentaryCard = styled.div`
    background: rgba(129, 140, 248, 0.04);
    border: 1px solid rgba(129, 140, 248, 0.15);
    border-left: 4px solid var(--accent-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.45;

    h4 {
        color: var(--accent-primary);
        font-size: 0.95rem;
        margin-top: 0;
        margin-bottom: 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
`;

const AccordionStep = styled.div`
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    margin-bottom: var(--spacing-sm);
    overflow: hidden;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);

    &:hover {
        border-color: rgba(2, 132, 199, 0.25);
        box-shadow: var(--shadow-md);
    }
`;

const AccordionHeader = styled.button`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background var(--transition-base);

    &:hover {
        background: rgba(0, 0, 0, 0.015);
    }
`;

const AccordionTitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .title-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
    }

    h3 {
        font-size: 1.15rem;
        color: var(--text-primary);
        margin: 0;
        line-height: 1.2;
    }
    
    p {
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.4;
    }
`;

const AccordionContent = styled.div`
    padding: var(--spacing-md);
    border-top: 1px solid var(--glass-border);
    background: rgba(255, 255, 255, 0.01);
    animation: fadeIn 0.3s ease-out;
`;

const AdvanceButton = styled.button`
    margin-left: auto;
    padding: 0.4rem 0.9rem;
    font-size: 0.78rem;
    font-weight: 700;
    border-radius: var(--radius-sm);
    border: 1px solid var(--accent-primary);
    background: transparent;
    color: var(--accent-primary);
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;

    &:hover {
        background: var(--accent-primary);
        color: white;
    }
`;

const TABS = [
    { id: 'executive', label: '1. Executive ROI Dashboard', Icon: LayoutDashboard },
    { id: 'technical', label: '2. System Architecture Deep Dive', Icon: Cpu },
];

function App() {
    // LLM pricing list (dynamically updated via OpenRouter)
    const [providers, setProviders] = useState(staticFallbackProviders);
    const [pricePerThousand, setPricePerThousand] = useState(defaultPricing.pricePerThousandTokens);
    const [monthlyRequests, setMonthlyRequests] = useState(150000);
    const [monthlyTokens, setMonthlyTokens] = useState(150000000);
    
    // Executive Business Case & Enterprise ROI assumptions
    const [laborRate, setLaborRate] = useState(55); // USD/hour
    const [auditTime, setAuditTime] = useState(12); // minutes
    const [monoError, setMonoError] = useState(14); // % failure rate
    const [agenticError, setAgenticError] = useState(1.5); // % failure rate
    
    // Solutions Architect & PM ROI inputs
    const [cacheHitRate, setCacheHitRate] = useState(30); // % cache hits
    const [frontierMix, setFrontierMix] = useState(40); // % frontier models
    const [contractDiscount, setContractDiscount] = useState(15); // % contract discount
    const [devFte, setDevFte] = useState(3); // FTEs
    const [buildWeeks, setBuildWeeks] = useState(6); // Weeks
    const [builderRate, setBuilderRate] = useState(83.33); // $/hr
    const [maintenancePercent, setMaintenancePercent] = useState(15); // % CapEx

    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isPresentationOpen, setIsPresentationOpen] = useState(false);
    const [tokenAnalysis, setTokenAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('executive');
    const [selectedPresetId, setSelectedPresetId] = useState('credit_underwriting');
    const [activeTechStep, setActiveTechStep] = useState(1);

    // Fetch dynamic pricing from OpenRouter API on mount
    useEffect(() => {
        fetchLatestPricing().then(data => {
            if (data && data.length > 0) {
                setProviders(data);
                const openai = data.find(p => p.id === 'openai');
                const gpt4oMini = openai?.models.find(m => m.id === 'gpt-4o-mini');
                if (gpt4oMini) {
                    setPricePerThousand(gpt4oMini.inputCostPer1M / 1000);
                }
            }
        });
    }, []);

    // Helper to calculate custom setup CapEx based on PM inputs
    const calculatedImplCost = devFte * buildWeeks * 40 * builderRate;

    const handleApplyPreset = (presetId) => {
        const cs = caseStudies.find(c => c.id === presetId);
        if (!cs) return;
        setSelectedPresetId(cs.id);
        setMonthlyRequests(cs.financials.volume);
        setMonthlyTokens(cs.financials.tokens);
        setLaborRate(cs.financials.laborRate);
        setAuditTime(cs.financials.auditTime);
        setMonoError(cs.monolithic.errorRate);
        setAgenticError(cs.agentic.errorRate);
        
        // Match FTE parameters to preset cost
        setDevFte(cs.financials.devFte);
        setBuildWeeks(cs.financials.buildWeeks);
        setBuilderRate(cs.financials.builderRate);
    };

    return (
        <AppContainer className="container">
            <Toaster position="top-right" />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            
            {/* Presentation Mode Slideshow overlay */}
            {isPresentationOpen && (
                <PresentationDeck
                    isOpen={isPresentationOpen}
                    onClose={() => setIsPresentationOpen(false)}
                    pricePerThousand={pricePerThousand}
                    monthlyRequests={monthlyRequests}
                    monthlyTokens={monthlyTokens}
                    laborRate={laborRate}
                    auditTime={auditTime}
                    monoError={monoError}
                    agenticError={agenticError}
                    implCost={calculatedImplCost}
                    cacheHitRate={cacheHitRate}
                    frontierMix={frontierMix}
                    contractDiscount={contractDiscount}
                    maintenancePercent={maintenancePercent}
                />
            )}

            {/* Header */}
            <Header onAboutClick={() => setIsAboutOpen(true)} />

            {/* Tab Navigation */}
            <TabBar role="tablist" aria-label="Page sections">
                {TABS.map(({ id, label, Icon }) => (
                    <TabButton
                        key={id}
                        role="tab"
                        id={`tab-${id}`}
                        aria-selected={activeTab === id}
                        aria-controls={`tabpanel-${id}`}
                        $active={activeTab === id}
                        onClick={() => setActiveTab(id)}
                    >
                        <Icon size={16} />
                        {label}
                    </TabButton>
                ))}
            </TabBar>

            {/* Tab: Executive ROI Dashboard */}
            <TabContent $active={activeTab === 'executive'} role="tabpanel" id="tabpanel-executive" aria-labelledby="tab-executive" className="executive-cockpit">
                <DashboardLayout className="executive-layout">
                    <SidebarColumn>
                        {/* Compact Lever Calculator with Presets */}
                        <CostCalculator
                            pricePerThousand={pricePerThousand}
                            onPriceChange={setPricePerThousand}
                            laborRate={laborRate}
                            onLaborRateChange={setLaborRate}
                            auditTime={auditTime}
                            onAuditTimeChange={setAuditTime}
                            monoError={monoError}
                            onMonoErrorChange={setMonoError}
                            agenticError={agenticError}
                            onAgenticErrorChange={setAgenticError}
                            devFte={devFte}
                            onDevFteChange={setDevFte}
                            buildWeeks={buildWeeks}
                            onBuildWeeksChange={setBuildWeeks}
                            builderRate={builderRate}
                            onBuilderRateChange={setBuilderRate}
                            maintenancePercent={maintenancePercent}
                            onMaintenancePercentChange={setMaintenancePercent}
                            cacheHitRate={cacheHitRate}
                            onCacheHitRateChange={setCacheHitRate}
                            frontierMix={frontierMix}
                            onFrontierMixChange={setFrontierMix}
                            contractDiscount={contractDiscount}
                            onContractDiscountChange={setContractDiscount}
                            monthlyRequests={monthlyRequests}
                            onMonthlyRequestsChange={setMonthlyRequests}
                            monthlyTokens={monthlyTokens}
                            onMonthlyTokensChange={setMonthlyTokens}
                            selectedPresetId={selectedPresetId}
                            onApplyPreset={handleApplyPreset}
                        />
                    </SidebarColumn>

                    <MainColumn>
                        {/* Executive Scorecard & Slides Pitch */}
                        <ExecDashboard
                            pricePerThousand={pricePerThousand}
                            monthlyRequests={monthlyRequests}
                            monthlyTokens={monthlyTokens}
                            laborRate={laborRate}
                            auditTime={auditTime}
                            monoError={monoError}
                            agenticError={agenticError}
                            implCost={calculatedImplCost}
                            cacheHitRate={cacheHitRate}
                            frontierMix={frontierMix}
                            contractDiscount={contractDiscount}
                            maintenancePercent={maintenancePercent}
                            compact={true} // Render compact scorecard
                            onEnterPresentation={() => setIsPresentationOpen(true)}
                        />

                        {/* J-Curve projection chart */}
                        <Section style={{ marginTop: 0 }}>
                            <ProjectionCharts
                                pricePerThousand={pricePerThousand}
                                monthlyRequests={monthlyRequests}
                                monthlyTokens={monthlyTokens}
                                laborRate={laborRate}
                                auditTime={auditTime}
                                monoError={monoError}
                                agenticError={agenticError}
                                implCost={calculatedImplCost}
                                cacheHitRate={cacheHitRate}
                                frontierMix={frontierMix}
                                contractDiscount={contractDiscount}
                                maintenancePercent={maintenancePercent}
                                compact={true}
                            />
                        </Section>

                        {/* PDF / CSV Exports */}
                        <Section style={{ marginTop: 0 }}>
                            <ExportTools
                                pricePerThousand={pricePerThousand}
                                monthlyRequests={monthlyRequests}
                                monthlyTokens={monthlyTokens}
                                laborRate={laborRate}
                                auditTime={auditTime}
                                monoError={monoError}
                                agenticError={agenticError}
                                implCost={calculatedImplCost}
                                cacheHitRate={cacheHitRate}
                                frontierMix={frontierMix}
                                contractDiscount={contractDiscount}
                                maintenancePercent={maintenancePercent}
                                compact={true}
                            />
                        </Section>
                    </MainColumn>
                </DashboardLayout>
            </TabContent>

            {/* Tab: Technical deep Dive */}
            <TabContent $active={activeTab === 'technical'} role="tabpanel" id="tabpanel-technical" aria-labelledby="tab-technical" style={{ marginTop: 'var(--spacing-lg)' }}>
                {/* Step 1: Strategic Briefing */}
                <AccordionStep>
                    <AccordionHeader onClick={() => setActiveTechStep(activeTechStep === 1 ? null : 1)}>
                        <AccordionTitleBlock>
                            <div className="title-row">
                                <TechStepBadge style={{ marginBottom: 0 }}>Step 1</TechStepBadge>
                                <h3>Strategic Briefing: The Economic Case for Agentic AI</h3>
                            </div>
                            <p>Evaluating the operational leverage and cost avoidance of shifting from monolithic prompting to automated, self-healing agent pipelines.</p>
                        </AccordionTitleBlock>
                        {activeTechStep === 1 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </AccordionHeader>
                    {activeTechStep === 1 && (
                        <AccordionContent>
                            <CommentaryCard>
                                <h4><Lightbulb size={16} /> Strategic Advisor Note</h4>
                                Monolithic prompts scale costs linearly and exhibit high failure rates under volume. Shifting to an assembly line of specialized agents decouples labor costs from transaction growth, delivering a defensible path to 10x ROI.
                            </CommentaryCard>
                            <ProjectInfo />
                            <NarrativeConnector style={{ marginTop: 'var(--spacing-md)' }}>
                                <span>👉</span>
                                <span>Once the business case is established, proceed to <strong>Step 2: Technical Leverage</strong> to see how this efficiency is engineered at the token and workflow level.</span>
                                <AdvanceButton onClick={() => setActiveTechStep(2)}>Open Step 2</AdvanceButton>
                            </NarrativeConnector>
                        </AccordionContent>
                    )}
                </AccordionStep>

                {/* Step 2: Proving the Technical Leverage */}
                <AccordionStep>
                    <AccordionHeader onClick={() => setActiveTechStep(activeTechStep === 2 ? null : 2)}>
                        <AccordionTitleBlock>
                            <div className="title-row">
                                <TechStepBadge style={{ marginBottom: 0 }}>Step 2</TechStepBadge>
                                <h3>Technical Leverage: Payload Compression & Workflow Decomposition</h3>
                            </div>
                            <p>Analyzing token consumption patterns, payload flow routing, and automated self-healing execution loops.</p>
                        </AccordionTitleBlock>
                        {activeTechStep === 2 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </AccordionHeader>
                    {activeTechStep === 2 && (
                        <AccordionContent>
                            <CommentaryCard>
                                <h4><Lightbulb size={16} /> Solutions Architect Analysis</h4>
                                By isolating tasks (like schema validation or text parsing) into granular sub-agents, we achieve up to 75% token volume reduction. The self-healing loop acts as an automated triage, stopping corrupted JSON payloads before they hit downstream pipelines.
                            </CommentaryCard>
                            <WorkflowDiagram />

                            <GridSection className="grid grid-2 gap-lg" style={{ marginTop: 'var(--spacing-md)' }}>
                                <TokenizerInput
                                    analysis={tokenAnalysis}
                                    onAnalysisChange={setTokenAnalysis}
                                />
                                <TokenComparison />
                            </GridSection>

                            <GridSection className="grid grid-2 gap-lg" style={{ marginTop: 'var(--spacing-md)' }}>
                                <div>
                                    <h3 className="mb-sm" style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>
                                        Token Payload Flow (Sankey)
                                    </h3>
                                    <TokenFlowSankey tokenAnalysis={tokenAnalysis} />
                                </div>
                                <div>
                                    <h3 className="mb-sm" style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)' }}>
                                        Token Cost Flow (Sankey)
                                    </h3>
                                    <CostBreakdownSankey />
                                </div>
                            </GridSection>

                            <NarrativeConnector style={{ marginTop: 'var(--spacing-md)' }}>
                                <span>👉</span>
                                <span>With the technical leverage validated, navigate to <strong>Step 3: Architectural Scenarios</strong> to apply these principles to standard enterprise case studies.</span>
                                <AdvanceButton onClick={() => setActiveTechStep(3)}>Open Step 3</AdvanceButton>
                            </NarrativeConnector>
                        </AccordionContent>
                    )}
                </AccordionStep>

                {/* Step 3: Industry Case Studies & Custom Architecture */}
                <AccordionStep>
                    <AccordionHeader onClick={() => setActiveTechStep(activeTechStep === 3 ? null : 3)}>
                        <AccordionTitleBlock>
                            <div className="title-row">
                                <TechStepBadge style={{ marginBottom: 0 }}>Step 3</TechStepBadge>
                                <h3>Architectural Scenarios: Benchmarking Enterprise Scenarios</h3>
                            </div>
                            <p>Reviewing historical performance baselines from real-world agent deployments and tailoring the architecture to your transaction patterns.</p>
                        </AccordionTitleBlock>
                        {activeTechStep === 3 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </AccordionHeader>
                    {activeTechStep === 3 && (
                        <AccordionContent>
                            <CommentaryCard>
                                <h4><Lightbulb size={16} /> Industry Benchmarking Insight</h4>
                                Operational baselines from real-world deployments (e.g. Credit Underwriting, Telco Routing) demonstrate that standardizing on validated agent patterns resolves accuracy drift and lowers outlier correction costs from 14% to under 2%.
                            </CommentaryCard>
                            <GridSection className="grid grid-2 gap-lg" style={{ marginTop: 0 }}>
                                <BenchmarkMode
                                    setMonthlyRequests={setMonthlyRequests}
                                    setMonthlyTokens={setMonthlyTokens}
                                    setLaborRate={setLaborRate}
                                    setAuditTime={setAuditTime}
                                    setMonoError={setMonoError}
                                    setAgenticError={setAgenticError}
                                />
                                <ScenarioBuilder />
                            </GridSection>

                            <NarrativeConnector style={{ marginTop: 'var(--spacing-md)' }}>
                                <span>👉</span>
                                <span>After configuring your architectural scenario, move to <strong>Step 4: Quantifying the Financial Business Case</strong> to perform deep-dive financial modeling and cost projections.</span>
                                <AdvanceButton onClick={() => setActiveTechStep(4)}>Open Step 4</AdvanceButton>
                            </NarrativeConnector>
                        </AccordionContent>
                    )}
                </AccordionStep>

                {/* Step 4: Quantifying the Financial Business Case */}
                <AccordionStep>
                    <AccordionHeader onClick={() => setActiveTechStep(activeTechStep === 4 ? null : 4)}>
                        <AccordionTitleBlock>
                            <div className="title-row">
                                <TechStepBadge style={{ marginBottom: 0 }}>Step 4</TechStepBadge>
                                <h3>Economic Business Case: Total Cost of Ownership (TCO) & ROI</h3>
                            </div>
                            <p>Modeling long-term capital efficiency, provider pricing options, and cash flow projections to build a defensible capital appropriation request.</p>
                        </AccordionTitleBlock>
                        {activeTechStep === 4 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </AccordionHeader>
                    {activeTechStep === 4 && (
                        <AccordionContent>
                            <CommentaryCard>
                                <h4><Lightbulb size={16} /> Financial Planning Advisory</h4>
                                While token price reductions contribute to margins, the true driver of enterprise NPV is operational capacity reclamation. Reclaiming auditor hours yields up to 90% of the calculated cumulative benefit, driving payback periods to under 4 months.
                            </CommentaryCard>
                            <ProviderComparison providers={providers} />

                            <Section style={{ marginTop: 'var(--spacing-md)' }}>
                                <ExecDashboard
                                    pricePerThousand={pricePerThousand}
                                    monthlyRequests={monthlyRequests}
                                    monthlyTokens={monthlyTokens}
                                    laborRate={laborRate}
                                    auditTime={auditTime}
                                    monoError={monoError}
                                    agenticError={agenticError}
                                    implCost={calculatedImplCost}
                                    cacheHitRate={cacheHitRate}
                                    frontierMix={frontierMix}
                                    contractDiscount={contractDiscount}
                                    maintenancePercent={maintenancePercent}
                                    compact={false} // Full details view
                                    onEnterPresentation={() => setIsPresentationOpen(true)}
                                />
                            </Section>

                            <NarrativeConnector style={{ marginTop: 'var(--spacing-md)' }}>
                                <span>👉</span>
                                <span>With the economics quantified, proceed to <strong>Step 5: Steering Committee Exports</strong> to download board-ready assets and review final system logs.</span>
                                <AdvanceButton onClick={() => setActiveTechStep(5)}>Open Step 5</AdvanceButton>
                            </NarrativeConnector>
                        </AccordionContent>
                    )}
                </AccordionStep>

                {/* Step 5: Steering Committee Exports & Debug Sandbox */}
                <AccordionStep>
                    <AccordionHeader onClick={() => setActiveTechStep(activeTechStep === 5 ? null : 5)}>
                        <AccordionTitleBlock>
                            <div className="title-row">
                                <TechStepBadge style={{ marginBottom: 0 }}>Step 5</TechStepBadge>
                                <h3>Executive Deliverables: Board-Ready Reporting & Tracing</h3>
                            </div>
                            <p>Extracting steering committee presentation decks, downloading financial models, and verifying operational execution traces.</p>
                        </AccordionTitleBlock>
                        {activeTechStep === 5 ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </AccordionHeader>
                    {activeTechStep === 5 && (
                        <AccordionContent>
                            <CommentaryCard>
                                <h4><Lightbulb size={16} /> Steering Committee Guideline</h4>
                                To secure board-level appropriation, export the formal PDF Business Case Memo and CSV Financial Model. The runtime execution traces provide the required compliance trail to satisfy institutional auditing standards.
                            </CommentaryCard>
                            <GridSection className="grid grid-2 gap-lg" style={{ marginTop: 0 }}>
                                <RunTrace />
                                <Gamification
                                    monthlyTokens={monthlyTokens}
                                    monthlyRequests={monthlyRequests}
                                    pricePerThousand={pricePerThousand}
                                />
                            </GridSection>
                        </AccordionContent>
                    )}
                </AccordionStep>
            </TabContent>

            {/* Footer */}
            <Footer>
                <FooterHeading>
                    Ready to Deploy Your Future?
                </FooterHeading>
                <FooterText>
                    Strategic Token & Operational Labor Cost Optimization Modeling Engine. Designed for Management Consultants & Senior Decision Makers.
                </FooterText>
            </Footer>
        </AppContainer>
    );
}

export default App;
