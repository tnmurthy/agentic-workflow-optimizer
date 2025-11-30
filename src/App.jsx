import React, { useState } from 'react';
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
import { defaultPricing } from './data/workflowData';

function App() {
    const [pricePerThousand, setPricePerThousand] = useState(defaultPricing.pricePerThousandTokens);
    const [monthlyRequests, setMonthlyRequests] = useState(100000);
    const [monthlyTokens, setMonthlyTokens] = useState(10000000);

    return (
        <div className="container">
            <Header />

            {/* Workflow Diagram */}
            <WorkflowDiagram />

            {/* Token Comparison */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <TokenComparison />
            </div>

            {/* Interactive Tokenizer - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <TokenizerInput />
            </div>

            {/* LLM Provider Comparison - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ProviderComparison />
            </div>

            {/* Scenario Builder - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ScenarioBuilder />
            </div>

            {/* Benchmark Mode - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <BenchmarkMode />
            </div>

            {/* Gamification - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <Gamification
                    monthlyTokens={monthlyTokens}
                    monthlyRequests={monthlyRequests}
                    pricePerThousand={pricePerThousand}
                />
            </div>

            {/* Export Tools - NEW */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ExportTools pricePerThousand={pricePerThousand} />
            </div>

            {/* Cost Calculator and Scenario Input */}
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

            {/* Projection Charts */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <ProjectionCharts pricePerThousand={pricePerThousand} />
            </div>

            {/* Footer */}
            <footer style={{
                marginTop: 'var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <p style={{ marginBottom: 0 }}>
                    Built to demonstrate the efficiency gains of agentic workflows in AI applications
                </p>
            </footer>
        </div>
    );
}

export default App;
