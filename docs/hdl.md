# High-Level Design (HLD)

## 1. Introduction

This document outlines the high-level architecture of the **Agentic Workflow Token Optimization Web App**. The application is designed as an interactive, client-side tool to demonstrate and calculate the cost savings of using modular, agentic AI workflows compared to monolithic approaches.

## 2. Core Architectural Principles

- **Modularity:** The application is built as a set of loosely coupled React components, each responsible for a specific feature or piece of the user interface.
- **Interactivity:** The primary goal is to provide a hands-on, interactive experience through real-time calculations, visualizations, and customizable inputs.
- **Client-Side Operation:** The entire application runs in the browser. There is no backend server, and no data is stored outside of the user's session (localStorage is used only for ephemeral caching and trace storage).
- **Stability:** All multi-step operations are guarded by explicit loop guards (max iterations, max tool calls, max wall-clock time). Runs always terminate with a clear, typed reason.
- **Observability:** Every workflow run generates a structured trace (steps, timings, token counts, termination reason) that is persisted in localStorage and viewable in the UI.
- **Caching:** Deterministic sub-steps are served from a two-tier in-memory + localStorage cache keyed on `(stepName, normalizedInputs, model, params)`.
- **Maintainability:** Strict separation of concerns between UI components, data, utility functions, and the workflow runtime.

## 3. System Architecture

The application is a **Single-Page Application (SPA)** built on the following technology stack:

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | styled-components (CSS-in-JS) + CSS Variables design system |
| Visualizations | Chart.js / react-chartjs-2, react-google-charts (Sankey) |
| Tokenization | gpt-tokenizer |
| Animations | Framer Motion |
| Testing | Vitest + @testing-library/react |
| CI | GitHub Actions |

### High-Level Component & Utility Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Browser (SPA)                              │
│                                                                     │
│  ┌──────────────┐   state/props   ┌─────────────────────────────┐  │
│  │   App.jsx    │◄───────────────►│     UI Components (20+)     │  │
│  │ (orchestrator│                 │  TokenizerInput, Charts,     │  │
│  │  global state│                 │  CostCalculator, RunTrace…   │  │
│  └──────┬───────┘                 └──────────────┬──────────────┘  │
│         │                                        │                  │
│         │ imports                                │ imports          │
│         ▼                                        ▼                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     src/utils/                                │  │
│  │  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐   │  │
│  │  │calculations.js│  │workflowEngine │  │schemaValidator.js│   │  │
│  │  │  (pure math) │  │LoopGuard      │  │validateTokenAnal.│   │  │
│  │  │  cost/savings │  │WorkflowRunner │  │repairJSON        │   │  │
│  │  │  projections  │  │withRetry      │  │validateAgentCfg  │   │  │
│  │  └──────────────┘  │ErrorKind      │  └──────────────────┘   │  │
│  │                     └───────────────┘                         │  │
│  │  ┌──────────────┐  ┌───────────────┐                          │  │
│  │  │   cache.js   │  │   tracer.js   │                          │  │
│  │  │ buildCacheKey│  │ RunTracer     │                          │  │
│  │  │ getCached    │  │ stepStart/End │                          │  │
│  │  │ setCached    │  │ redact()      │                          │  │
│  │  │ (mem + LS)   │  │ getRecentTrace│                          │  │
│  │  └──────────────┘  └───────────────┘                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      src/data/                                │  │
│  │   workflowData.js (agent definitions)                         │  │
│  │   llmProviders.js (provider pricing)                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────┐  ┌────────────────────────────────────┐   │
│  │  localStorage        │  │           In-Memory                │   │
│  │  aw_cache__*  (TTL) │  │  _memCache Map (TTL)               │   │
│  │  aw_run_traces       │  │                                    │   │
│  │  agentic-scenarios   │  │                                    │   │
│  └─────────────────────┘  └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.jsx
├── AboutModal.jsx
├── Header.jsx
├── ProjectInfo.jsx
│   └── LogicFlow.jsx
├── TokenizerInput.jsx          ← WorkflowRunner + cache + RunTracer
│   └── PromptBreakdown.jsx
├── TokenFlowSankey.jsx
├── WorkflowDiagram.jsx
├── TokenComparison.jsx
├── BenchmarkMode.jsx
├── ScenarioBuilder.jsx
├── ProviderComparison.jsx
├── CostCalculator.jsx
├── ScenarioInput.jsx
├── ProjectionCharts.jsx
├── CostBreakdownSankey.jsx
├── Gamification.jsx
├── ExportTools.jsx
└── RunTrace.jsx                ← observability panel
```

## 4. Component Breakdown

| Component | Responsibility |
|-----------|---------------|
| `App.jsx` | Root orchestrator; manages global state (`pricePerThousand`, `monthlyRequests`, `monthlyTokens`, `tokenAnalysis`, `isAboutOpen`) |
| `Header.jsx` | Displays title, subtitle, and "About Project" button |
| `ProjectInfo.jsx` | High-level overview of project goals; embeds LogicFlow Mermaid diagram |
| `TokenizerInput.jsx` | Interactive prompt tokenizer; runs a `WorkflowRunner` pipeline with caching, tracing, and schema validation |
| `PromptBreakdown.jsx` | Token-level breakdown visualization for the current prompt |
| `WorkflowDiagram.jsx` | Visualises the 5-agent pipeline (Retriever → Summarizer → Classifier → Insight → Output) |
| `TokenComparison.jsx` | Side-by-side bar chart of monolithic vs. agentic token counts |
| `TokenFlowSankey.jsx` | Sankey diagram showing token flow through the agent pipeline |
| `BenchmarkMode.jsx` | Pre-loaded benchmark scenarios (RAG, Summarization, Classification) |
| `ScenarioBuilder.jsx` | Custom agent configuration builder with drag-to-adjust sliders; saves to localStorage |
| `ProviderComparison.jsx` | LLM provider & model selector with real-time cost table |
| `CostCalculator.jsx` | Cost analysis with configurable per-1K-token pricing |
| `ScenarioInput.jsx` | Monthly requests and token volume inputs |
| `ProjectionCharts.jsx` | Monthly / annual / 5-year ROI projection charts |
| `CostBreakdownSankey.jsx` | Sankey diagram showing cost distribution across agents |
| `Gamification.jsx` | Achievement and milestone tracking |
| `ExportTools.jsx` | PDF report and CSV data export |
| `RunTrace.jsx` | Collapsible run trace inspector; reads from `tracer.getRecentTraces()` |
| `AboutModal.jsx` | Documentation modal |
| `LogicFlow.jsx` | Mermaid-rendered flowchart diagrams |

## 5. Data Flow

### Static Data
Agent definitions (`workflowData.js`) and LLM provider pricing (`llmProviders.js`) are imported at build time.

### Global Application State (App.jsx)
| State Variable | Type | Default | Purpose |
|----------------|------|---------|---------|
| `pricePerThousand` | `number` | `0.002` | $/1K token price; shared with CostCalculator, ProjectionCharts, ExportTools |
| `monthlyRequests` | `number` | `100,000` | Shared with ScenarioInput, Gamification |
| `monthlyTokens` | `number` | `10,000,000` | Shared with ScenarioInput, Gamification |
| `tokenAnalysis` | `object\|null` | `null` | Lifted from TokenizerInput; shared with TokenFlowSankey |
| `isAboutOpen` | `boolean` | `false` | Controls AboutModal visibility |

### Workflow Runtime Data Flow (TokenizerInput)
When a user clicks "Analyze Tokens":

1. A new `AbortController` is created (cancels any in-flight run).
2. `buildCacheKey('tokenize', { prompt }, 'gpt-tokenizer', {})` is computed.
3. Cache lookup via `getCached(key)` — memory tier first, then localStorage.
4. **Cache hit** → result is returned immediately; no further processing.
5. **Cache miss** → a `WorkflowRunner` executes 3 named steps:
   - `tokenize` — calls `encode(prompt)` from gpt-tokenizer.
   - `distribute` — proportionally allocates tokens across agents.
   - `validate` — calls `validateAndRepairTokenAnalysis()`; throws `VALIDATION_ERROR` on failure.
6. `RunTracer` records step start/end and persists the completed trace to `aw_run_traces` in localStorage.
7. On success, the result is written to cache via `setCached(key, result)`.
8. On failure, a character-based estimation fallback is used.

### Trace Storage
Traces are kept in `localStorage['aw_run_traces']` as a rolling buffer of up to 50 entries. The `RunTrace` component reads and displays them. Sensitive field values (api_key, password, etc.) are replaced with `[REDACTED]` before storage.

## 6. Stability & Guard Architecture

```
User Action
    │
    ▼
AbortController.signal ──────────────────────────────────────┐
    │                                                         │
    ▼                                                         │
WorkflowRunner.run(steps)                                     │
    │                                                         │
    ├── LoopGuard.tick() ──► MAX_ITERATIONS (25)?  ──► terminationReason: 'max_iterations'
    │                  └──► MAX_WALL_CLOCK_MS (30s)? ──► terminationReason: 'wall_clock_exceeded'
    │
    ├── withRetry(step.fn, { maxAttempts, baseDelayMs }) ──► exponential back-off
    │
    └── step failure ──► ErrorKind taxonomy ──► terminationReason
```

## 7. Caching Architecture

```
getCached(key)
    │
    ├── _memCache.get(key) ──► HIT? ──► return value (fast path)
    │
    └── MISS
         │
         └── localStorage.getItem('aw_cache__' + key) ──► HIT? ──► warm _memCache → return
                                                      └── MISS  ──► return undefined
```

Keys are built via `buildCacheKey(stepName, inputs, model, params)` using `stableStringify` (deterministic, key-order-independent serialisation).

Default TTL: **5 minutes** (both tiers).

## 8. Reporting & Export Architecture

The application provides two reporting paths: real-time **ELU score benchmarks** in the UI, and on-demand **document exports** (PDF and CSV).

### ELU Scores — Definition & Computation

ELU stands for **Efficiency, Latency, Utilization** — the three dimensions used to measure workflow gains:

| Dimension | Measures | Derived From |
|-----------|----------|-------------|
| **E — Efficiency** | Token reduction % | `(monolithicTokens − agenticTokens) / monolithicTokens × 100` |
| **L — Latency** | Processing time reduction % | Pre-computed per benchmark (`improvement.latency`) or inferred from `time` strings |
| **U — Utilization** | Cost reduction % | `(monolithicCost − agenticCost) / monolithicCost × 100` (= E-score when price is constant) |

ELU scores are **static** for the pre-loaded benchmarks in `BenchmarkMode.jsx` and **dynamic** for the live tokenizer analysis (`TokenizerInput.jsx` → `tokenAnalysis.reduction`).

### Export Data Flow

```
User clicks "Export to PDF"
    │
    ├── ExportTools.exportToPDF()
    │       │
    │       ├── calculateCost(monolithicTokens, pricePerThousand)
    │       ├── calculateSavings(monolithicCost, agenticCost)
    │       ├── build off-screen HTML report (cost tables, projections, recs)
    │       ├── html2canvas(div, { scale: 2 })  ──► PNG canvas
    │       ├── jsPDF → addImage(PNG) → pdf.save('*.pdf')
    │       └── remove off-screen div
    │
    └── ExportTools.exportToCSV()
            │
            ├── calculateCost + calculateSavings
            ├── build CSV rows (metrics + monthly projections at 3 scales)
            └── Blob → URL.createObjectURL → link.click() → download

```

### Report Content Matrix

| Section | PDF | CSV |
|---------|-----|-----|
| Executive summary | ✅ | ✗ |
| Token usage comparison table | ✅ | ✅ |
| Cost per request | ✅ | ✅ |
| Monthly projections (1M / 10M / 100M) | ✅ | ✅ |
| Recommendations | ✅ | ✗ |
| ELU score badges | ✗ | ✗ (in Benchmark UI only) |
| Run trace data | ✗ | ✗ (in RunTrace UI only) |

> Run traces and ELU scores are observability artefacts visible in the UI. They are not currently included in exports; adding them is a planned future enhancement.

## 9. CI/CD Pipeline

```
Push / PR
    │
    ├── ci.yml ──► test job  ──► npm ci → npm test -- --run  (62 tests)
    │          └── build job ──► npm ci → npm run build      (gated on test)
    │
    └── deploy.yml (push to main only)
              └── build → upload dist/ → GitHub Pages
```

