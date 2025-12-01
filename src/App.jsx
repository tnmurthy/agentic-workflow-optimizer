import React, { useState } from 'react';
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
import { defaultPricing } from './data/workflowData';

function App() {
    const [pricePerThousand, setPricePerThousand] = useState(defaultPricing.pricePerThousandTokens);
    const [monthlyRequests, setMonthlyRequests] = useState(100000);
    const [monthlyTokens, setMonthlyTokens] = useState(10000000);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <div className="container">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', position: 'relative' }}>
                <button
                    onClick={() => setIsAboutOpen(true)}
                    className="btn btn-secondary"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <BookOpen size={16} />
                    About Project
                </button>

                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: 'var(--spacing-sm)',
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Stop Burning Potential. <br /> Start Building Intelligence.
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Visualize the exponential power of agentic workflows.
                    Move beyond simple cost savings to unlocking the true capability of AI at scale.
                </p>
            </header>

            {/* 1. Context: Project Info */}
            <ProjectInfo />

            {/* 2. Interactive Learning: What is a Token? */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <TokenizerInput />
            </div>

            {/* 3. The Concept: Visualizing the Workflow */}
            <WorkflowDiagram />

            {/* 4. The Proof: Token Comparison */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <TokenComparison />
            </div>

            {/* 5. Real Examples: Benchmark Mode */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <BenchmarkMode />
            </div>

            {/* 6. Deep Dive: Scenario Builder */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ScenarioBuilder />
            </div>

            {/* 7. Economics: Provider Comparison */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ProviderComparison />
            </div>

            {/* 8. Business Case: Cost Calculator */}
            <div className="grid grid-2 gap-lg" style={{ marginTop: 'var(--spacing-xl)' }}>
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
            </div>

            {/* 9. Long-term Value: Projections */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ProjectionCharts pricePerThousand={pricePerThousand} />
            </div>

            {/* 10. Engagement: Gamification */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <Gamification
                    monthlyTokens={monthlyTokens}
                    monthlyRequests={monthlyRequests}
                    pricePerThousand={pricePerThousand}
                />
            </div>

            {/* 11. Action: Export */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ExportTools pricePerThousand={pricePerThousand} />
            </div>

            {/* Footer */}
            <footer style={{
                marginTop: 'var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    Ready to Deploy Your Future?
                </p>
                <p style={{ marginBottom: 0, opacity: 0.7 }}>
                    Built to demonstrate the efficiency gains of agentic workflows in AI applications
                </p>
            </footer>
        </div>
    );
}

export default App;
