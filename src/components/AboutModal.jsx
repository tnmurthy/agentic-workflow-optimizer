import React, { useState } from 'react';
import styled from 'styled-components';
import {
    X, BookOpen, Zap, Layout, AlertTriangle, CheckCircle, ListTree,
    BarChart, Code, Users, Briefcase, Server, GitBranch, Activity,
    Database, Layers, ArrowRight, Clock, Shield
} from 'lucide-react';

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
    max-width: 960px;
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

const TabBar = styled.div`
    display: flex;
    gap: 0.25rem;
    padding: 0 var(--spacing-lg);
    border-bottom: 1px solid var(--glass-border);
    background: var(--bg-tertiary);
    overflow-x: auto;
`;

const Tab = styled.button`
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--accent-primary)' : 'transparent')};
    color: ${({ $active }) => ($active ? 'var(--accent-primary)' : 'var(--text-secondary)')};
    font-weight: ${({ $active }) => ($active ? '700' : '500')};
    font-size: 0.875rem;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all var(--transition-base);
    &:hover {
        color: var(--accent-primary);
    }
`;

const Section = styled.section`
    margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
    color: var(--accent-secondary);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
`;

const List = styled.ul`
    padding-left: 1.5rem;
    color: var(--text-secondary);
    line-height: 1.9;
`;

const FutureNote = styled.div`
    margin-top: var(--spacing-xl);
    padding: var(--spacing-md);
    background: rgba(139, 92, 246, 0.08);
    border-radius: var(--radius-md);
    border: 1px solid rgba(139, 92, 246, 0.2);
    text-align: center;
`;

const CodeBlock = styled.pre`
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.6;
    color: var(--text-primary);
    margin: var(--spacing-sm) 0;
`;

const ArchTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th {
        background: var(--bg-tertiary);
        padding: 0.6rem 0.8rem;
        text-align: left;
        font-weight: 700;
        color: var(--text-primary);
        border-bottom: 2px solid var(--glass-border);
    }

    td {
        padding: 0.6rem 0.8rem;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--glass-border);
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg-tertiary); color: var(--text-primary); }
`;

const FlowStep = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--glass-border);
    font-size: 0.9rem;
    &:last-child { border-bottom: none; }
`;

const StepBadge = styled.span`
    min-width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--gradient-accent);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0.1rem;
`;

const TwoCol = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--spacing-md);
`;

const MiniCard = styled.div`
    background: var(--bg-tertiary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
`;

const MiniCardTitle = styled.h4`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: var(--accent-primary);
    font-size: 0.95rem;
`;

/* ── Tabs ──────────────────────────────────────────────── */

const tabs = [
    { id: 'exec', label: 'Executive Summary', icon: <Briefcase size={14} /> },
    { id: 'hld', label: 'Architecture (HLD)', icon: <Server size={14} /> },
    { id: 'lld', label: 'Technical Design (LLD)', icon: <Code size={14} /> },
    { id: 'flows', label: 'System Flows', icon: <Activity size={14} /> },
];

/* ── Tab Panels ────────────────────────────────────────── */

const ExecTab = () => (
    <>
        <Section>
            <SectionTitle><Layout size={20} /> What This Tool Does</SectionTitle>
            <p>
                This interactive web application demonstrates how <strong>Agentic AI Workflows</strong> can reduce your organisation's
                AI operational costs by <strong>30–60%</strong> compared to traditional single-prompt ("monolithic") approaches —
                while simultaneously improving accuracy and response speed.
            </p>
            <p>
                You can model your own token volumes, choose different LLM providers, and export board-ready cost reports
                — all without writing a single line of code.
            </p>
        </Section>

        <Section>
            <SectionTitle><AlertTriangle size={20} /> The Problem</SectionTitle>
            <p>
                Enterprises deploying AI at scale are inadvertently wasting budget. Standard AI pipelines send entire data contexts
                to expensive models for every request, even when only a fraction is relevant. At 100M+ requests per month,
                this inefficiency translates to hundreds of thousands of dollars in unnecessary spend.
            </p>
        </Section>

        <Section>
            <SectionTitle><CheckCircle size={20} /> The Solution</SectionTitle>
            <List>
                <li><strong>Decompose tasks:</strong> Break large prompts into focused, specialist "agents" — each only processes what it needs.</li>
                <li><strong>Run in parallel:</strong> Agents operate concurrently, cutting end-to-end latency by up to 5×.</li>
                <li><strong>Cache intelligently:</strong> Repeated sub-steps are cached, avoiding redundant model calls entirely.</li>
                <li><strong>Measure everything:</strong> Every run logs token counts, costs, and performance for continuous improvement.</li>
            </List>
        </Section>

        <Section>
            <SectionTitle><BarChart size={20} /> Proven Impact</SectionTitle>
            <TwoCol>
                <MiniCard>
                    <MiniCardTitle><CheckCircle size={16} /> Document Summarisation</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        Token reduction: <strong>66%</strong> | Cost reduction: <strong>66%</strong> | Time: <strong>45s → 12s</strong>
                    </p>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><CheckCircle size={16} /> Email Classification</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        Token reduction: <strong>70%</strong> | Accuracy: <strong>82% → 94%</strong> | Time: <strong>15m → 3m</strong>
                    </p>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><CheckCircle size={16} /> RAG Q&A System</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        Token reduction: <strong>70%</strong> | Latency: <strong>−48%</strong> | Hallucinations: <strong>eliminated</strong>
                    </p>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><Users size={16} /> Developer Recommendation</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        Start with a 3-agent pilot on your highest-volume AI task. ROI is typically visible within <strong>30–90 days</strong>.
                    </p>
                </MiniCard>
            </TwoCol>
        </Section>

        <FutureNote>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <Zap size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                <strong>Future Directions:</strong> Advanced compression techniques, prompt fine-tuning, and smaller
                specialist models will push savings beyond 75% in next-generation pipelines.
            </p>
        </FutureNote>
    </>
);

const HldTab = () => (
    <>
        <Section>
            <SectionTitle><Server size={20} /> System Overview</SectionTitle>
            <p>
                The application is a fully <strong>client-side Single-Page Application (SPA)</strong> — nothing is sent to a backend server.
                All computation, caching, and tracing happens entirely in the user's browser session.
            </p>
            <ArchTable>
                <thead>
                    <tr>
                        <th>Layer</th>
                        <th>Technology</th>
                        <th>Purpose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>UI Framework</td><td>React 18</td><td>Component rendering & state management</td></tr>
                    <tr><td>Build Tool</td><td>Vite 5</td><td>Fast bundling & hot-module replacement</td></tr>
                    <tr><td>Styling</td><td>styled-components + CSS Variables</td><td>Scoped styles & design tokens</td></tr>
                    <tr><td>Visualisations</td><td>Chart.js / react-google-charts</td><td>Bar, line, and Sankey charts</td></tr>
                    <tr><td>Tokenisation</td><td>gpt-tokenizer</td><td>Client-side token counting (no API call)</td></tr>
                    <tr><td>Diagrams</td><td>Mermaid</td><td>Flowcharts rendered in-browser</td></tr>
                    <tr><td>Testing</td><td>Vitest + Testing Library</td><td>62 automated unit tests</td></tr>
                    <tr><td>CI/CD</td><td>GitHub Actions → GitHub Pages</td><td>Automated test, build, deploy pipeline</td></tr>
                </tbody>
            </ArchTable>
        </Section>

        <Section>
            <SectionTitle><Layers size={20} /> Component Hierarchy</SectionTitle>
            <CodeBlock>{`App.jsx  (global state: pricePerThousand, monthlyTokens, tokenAnalysis)
├── ExecDashboard.jsx       ← Business impact KPIs for executives
├── Header.jsx              ← Title + "About Project" button
├── ProjectInfo.jsx         ← Project overview + LogicFlow diagram
├── TokenizerInput.jsx      ← Interactive prompt tokenizer (WorkflowRunner)
│   └── PromptBreakdown.jsx ← Token-level colour-coded breakdown
├── TokenFlowSankey.jsx     ← Token movement through agent pipeline
├── WorkflowDiagram.jsx     ← 5-agent pipeline visualisation
├── TokenComparison.jsx     ← Monolithic vs agentic bar charts
├── BenchmarkMode.jsx       ← Pre-loaded real-world benchmarks
├── ScenarioBuilder.jsx     ← Custom agent configuration builder
├── ProviderComparison.jsx  ← Multi-provider / model cost table
├── CostCalculator.jsx      ← Per-request cost analysis
├── ScenarioInput.jsx       ← Monthly volume inputs
├── ProjectionCharts.jsx    ← Monthly / annual / 5-year ROI
├── CostBreakdownSankey.jsx ← Cost flow across agents
├── Gamification.jsx        ← Achievement badges
├── ExportTools.jsx         ← PDF + CSV report export
└── RunTrace.jsx            ← Live observability panel`}</CodeBlock>
        </Section>

        <Section>
            <SectionTitle><Database size={20} /> Data & State Architecture</SectionTitle>
            <TwoCol>
                <MiniCard>
                    <MiniCardTitle><Database size={15} /> Browser Storage</MiniCardTitle>
                    <List>
                        <li><strong>aw_cache__*</strong> — computed results (TTL: 5 min)</li>
                        <li><strong>aw_run_traces</strong> — last 50 workflow traces</li>
                        <li><strong>agentic-scenarios</strong> — user-built scenarios</li>
                    </List>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><Activity size={15} /> Global React State</MiniCardTitle>
                    <List>
                        <li><strong>pricePerThousand</strong> — $/1K token price</li>
                        <li><strong>monthlyRequests</strong> — volume scale input</li>
                        <li><strong>monthlyTokens</strong> — total monthly tokens</li>
                        <li><strong>tokenAnalysis</strong> — live tokenizer result</li>
                    </List>
                </MiniCard>
            </TwoCol>
        </Section>

        <Section>
            <SectionTitle><Shield size={20} /> Stability Architecture</SectionTitle>
            <p>
                The agentic analysis pipeline is hardened against runaway loops, slow operations, and schema mismatches:
            </p>
            <List>
                <li><strong>LoopGuard</strong> — enforces max 25 iterations, 50 tool calls, 30-second wall-clock limit per run.</li>
                <li><strong>withRetry</strong> — exponential back-off with up to 3 attempts per step.</li>
                <li><strong>AbortController</strong> — each new analysis cancels any in-flight previous run immediately.</li>
                <li><strong>schemaValidator</strong> — output is validated and auto-repaired before being displayed or cached.</li>
            </List>
        </Section>
    </>
);

const LldTab = () => (
    <>
        <Section>
            <SectionTitle><Code size={20} /> Core Utility Modules</SectionTitle>

            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>calculations.js — Pure Cost Maths</h4>
            <ArchTable>
                <thead>
                    <tr><th>Function</th><th>What it computes</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>calculateCost(tokens, price)</code></td><td>Token cost in dollars: <code>(tokens / 1000) × price</code></td></tr>
                    <tr><td><code>calculateSavings(mono, agent)</code></td><td>Absolute & % savings; guards division-by-zero</td></tr>
                    <tr><td><code>calculateTokenReduction(mono, agent)</code></td><td>Token delta & % reduction</td></tr>
                    <tr><td><code>calculateMonthlyProjection(…)</code></td><td>Cost at a given monthly token volume</td></tr>
                    <tr><td><code>calculateMultiYearProjection(years, …)</code></td><td>Cumulative 1–5 year savings array</td></tr>
                </tbody>
            </ArchTable>

            <h4 style={{ marginBottom: '0.5rem', marginTop: 'var(--spacing-md)', color: 'var(--text-primary)' }}>workflowEngine.js — Pipeline Runtime</h4>
            <ArchTable>
                <thead>
                    <tr><th>Class / Function</th><th>Role</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>LoopGuard</code></td><td>Counts iterations, tool calls, elapsed ms; throws typed errors at limits</td></tr>
                    <tr><td><code>withRetry(fn, opts)</code></td><td>Exponential back-off retry wrapper; respects AbortSignal</td></tr>
                    <tr><td><code>WorkflowRunner.run(steps)</code></td><td>Executes named steps sequentially; returns structured result with termination reason</td></tr>
                    <tr><td><code>stepSuccess / stepFailure</code></td><td>Standardised result objects for each step outcome</td></tr>
                    <tr><td><code>ErrorKind</code></td><td>Taxonomy: tool_timeout, parse_error, validation_error, cancelled, max_iterations, …</td></tr>
                </tbody>
            </ArchTable>

            <h4 style={{ marginBottom: '0.5rem', marginTop: 'var(--spacing-md)', color: 'var(--text-primary)' }}>cache.js — Two-Tier Caching</h4>
            <CodeBlock>{`getCached(key)
  └─ _memCache.get(key)        → HIT: return immediately (fast path)
  └─ MISS → localStorage['aw_cache__' + key]
              → HIT: warm _memCache, return value
              → MISS: return undefined (run workflow)

setCached(key, value)
  └─ _memCache.set(key, {value, exp})
  └─ localStorage.setItem(...)
  Both tiers use TTL = 5 minutes`}</CodeBlock>

            <h4 style={{ marginBottom: '0.5rem', marginTop: 'var(--spacing-md)', color: 'var(--text-primary)' }}>tracer.js — Run Observability</h4>
            <List>
                <li><strong>RunTracer</strong> records stepStart / stepEnd with timestamps for each pipeline step.</li>
                <li>On finish, all sensitive fields (api_key, password, token) are <strong>redacted</strong> before storage.</li>
                <li>Persists to <code>localStorage['aw_run_traces']</code> as a rolling buffer of 50 entries.</li>
                <li>Readable in the <strong>Run Trace</strong> panel at the bottom of the page.</li>
            </List>
        </Section>

        <Section>
            <SectionTitle><GitBranch size={20} /> TokenizerInput Pipeline (3 Steps)</SectionTitle>
            {[
                { step: 1, name: 'tokenize', desc: 'Encode the prompt using gpt-tokenizer. Returns raw token IDs (no API call — runs entirely in-browser).' },
                { step: 2, name: 'distribute', desc: 'Proportionally allocate tokens across the 5 agent roles and calculate the total reduction vs. monolithic.' },
                { step: 3, name: 'validate', desc: 'Run schemaValidator to check result integrity. Auto-repair numeric coercions; throw VALIDATION_ERROR if unrecoverable.' },
            ].map(s => (
                <FlowStep key={s.step}>
                    <StepBadge>{s.step}</StepBadge>
                    <div>
                        <strong style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{s.name}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}> — {s.desc}</span>
                    </div>
                </FlowStep>
            ))}
        </Section>

        <Section>
            <SectionTitle><BarChart size={20} /> ELU Score Definitions</SectionTitle>
            <ArchTable>
                <thead><tr><th>Dimension</th><th>Measures</th><th>Formula</th></tr></thead>
                <tbody>
                    <tr><td><strong>E — Efficiency</strong></td><td>Token reduction %</td><td>(monoTokens − agentTokens) / monoTokens × 100</td></tr>
                    <tr><td><strong>L — Latency</strong></td><td>Processing time reduction %</td><td>Pre-computed per benchmark or inferred from time strings</td></tr>
                    <tr><td><strong>U — Utilisation</strong></td><td>Cost reduction %</td><td>(monoCost − agentCost) / monoCost × 100</td></tr>
                </tbody>
            </ArchTable>
        </Section>
    </>
);

const FlowsTab = () => (
    <>
        <Section>
            <SectionTitle><Activity size={20} /> 1. Prompt Analysis — Normal Flow</SectionTitle>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                What happens behind the scenes when you click "Analyse Tokens":
            </p>
            {[
                { label: 'Cache check', detail: 'Build a deterministic cache key from the prompt. Check in-memory cache first, then localStorage.' },
                { label: 'Cache miss — run pipeline', detail: 'Create AbortController (cancels any previous in-flight run). Instantiate WorkflowRunner with LoopGuard.' },
                { label: 'Step 1: tokenize', detail: 'gpt-tokenizer encodes the prompt locally. No network call. Returns token IDs.' },
                { label: 'Step 2: distribute', detail: 'Allocate tokens proportionally across 5 agents; compute reduction percentage.' },
                { label: 'Step 3: validate', detail: 'schemaValidator checks the result. Auto-repairs coercible values. Throws on unrecoverable errors.' },
                { label: 'Trace & cache', detail: 'RunTracer redacts sensitive fields and persists the trace. Result is written to both cache tiers.' },
                { label: 'UI update', detail: 'Token breakdown, Sankey diagram, and all downstream charts update instantly.' },
            ].map((step, i) => (
                <FlowStep key={i}>
                    <StepBadge>{i + 1}</StepBadge>
                    <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{step.label}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}> — </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{step.detail}</span>
                    </div>
                </FlowStep>
            ))}
        </Section>

        <Section>
            <SectionTitle><Clock size={20} /> 2. Cancellation & Retry Flows</SectionTitle>
            <TwoCol>
                <MiniCard>
                    <MiniCardTitle><ArrowRight size={15} /> Cancellation</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        If you click "Analyse" again while a run is in progress, the previous <code>AbortController</code> is signalled.
                        The in-flight <code>withRetry</code> detects the signal between retries and terminates immediately with
                        <code> terminationReason: 'cancelled'</code>. The new run starts fresh.
                    </p>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><ArrowRight size={15} /> Retry with Back-off</MiniCardTitle>
                    <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                        Each step allows up to <strong>3 attempts</strong>. Delays follow exponential back-off:
                        200ms → 400ms → 800ms (+ up to 30% random jitter, capped at 5 s).
                        If all attempts fail, the runner terminates with a typed <code>ErrorKind</code>.
                    </p>
                </MiniCard>
            </TwoCol>
        </Section>

        <Section>
            <SectionTitle><GitBranch size={20} /> 3. Export Flows</SectionTitle>
            <TwoCol>
                <MiniCard>
                    <MiniCardTitle><Code size={15} /> PDF Export</MiniCardTitle>
                    <List>
                        <li>Compute costs via <code>calculations.js</code></li>
                        <li>Build an off-screen HTML report (tables + recommendations)</li>
                        <li>Rasterise to PNG at 2× resolution via <code>html2canvas</code></li>
                        <li>Embed PNG into A4 PDF via <code>jsPDF</code> and trigger browser download</li>
                    </List>
                </MiniCard>
                <MiniCard>
                    <MiniCardTitle><Code size={15} /> CSV Export</MiniCardTitle>
                    <List>
                        <li>Compute costs and savings metrics</li>
                        <li>Build row groups: header, per-metric rows, monthly projections at 1M / 10M / 100M tokens</li>
                        <li>Create a <code>Blob</code> and trigger download via <code>URL.createObjectURL</code></li>
                    </List>
                </MiniCard>
            </TwoCol>
        </Section>

        <Section>
            <SectionTitle><Server size={20} /> 4. CI/CD Pipeline</SectionTitle>
            {[
                { label: 'Push / PR opened', detail: 'GitHub Actions triggers the CI workflow (ci.yml) on any branch.' },
                { label: 'Test job', detail: 'npm ci → npm test --run executes all 62 Vitest unit tests.' },
                { label: 'Build job', detail: 'Gated on test success. npm run build produces an optimised dist/ bundle via Vite.' },
                { label: 'Deploy (main only)', detail: 'deploy.yml uploads dist/ as a GitHub Pages artifact and publishes to the live URL.' },
            ].map((step, i) => (
                <FlowStep key={i}>
                    <StepBadge>{i + 1}</StepBadge>
                    <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{step.label}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}> — {step.detail}</span>
                    </div>
                </FlowStep>
            ))}
        </Section>
    </>
);

/* ── Main Component ────────────────────────────────────── */

const AboutModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('exec');

    if (!isOpen) return null;

    const renderTab = () => {
        switch (activeTab) {
            case 'exec': return <ExecTab />;
            case 'hld': return <HldTab />;
            case 'lld': return <LldTab />;
            case 'flows': return <FlowsTab />;
            default: return <ExecTab />;
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>

                <ModalHeader>
                    <div className="flex items-center gap-sm">
                        <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>About This Project</h2>
                    </div>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </ModalHeader>

                <TabBar>
                    {tabs.map(tab => (
                        <Tab
                            key={tab.id}
                            $active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </Tab>
                    ))}
                </TabBar>

                <div style={{ padding: 'var(--spacing-lg)' }}>
                    {renderTab()}
                </div>

            </ModalContent>
        </ModalOverlay>
    );
};

export default AboutModal;
