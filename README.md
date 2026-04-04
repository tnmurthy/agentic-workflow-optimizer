# Agentic Workflow Token Optimization Web App

An interactive web application that demonstrates how **agentic workflows** reduce token usage and costs compared to monolithic prompts.

## 🎯 Features

- **Interactive Workflow Diagram**: Visualize the modular agent pipeline
- **Token Usage Comparison**: See the 60% token reduction in action
- **Interactive Tokenizer**: Paste your prompts for real-time token analysis
- **LLM Provider Comparison**: Compare costs across OpenAI, Anthropic, Google, Mistral
- **Scenario Builder**: Create custom agent configurations with drag-to-adjust tokens
- **Benchmark Mode**: View pre-loaded comparisons for common use cases (RAG, Summarization)
- **Gamification**: Track your optimization achievements and badges
- **Export & Sharing**: Generate PDF reports and CSV data exports
- **Cost Modeling**: Calculate real-time cost savings with configurable pricing
- **Projection Charts**: Monthly, annual, and multi-year ROI projections
- **Custom Scenarios**: Input your own usage estimates
- **🆕 Loop Guards**: Runs terminate with a clear reason when iteration/time limits are hit
- **🆕 Schema Validation**: Key step outputs are validated and auto-repaired when malformed
- **🆕 Two-Tier Caching**: Identical sub-steps are served from memory or localStorage cache
- **🆕 Run Traces**: Every prompt analysis generates an inspectable trace with timings, inputs, and outputs
- **Premium Design**: Dark mode with gradients, animations, and glassmorphism

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite (development server)
- Chart.js (for visualizations)
- React-ChartJS-2 (React wrapper for Chart.js)
- Lucide React (icons)
- GPT-Tokenizer (real-time token counting)
- Framer Motion (smooth animations)
- React Hot Toast (notifications)

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 4. Preview Production Build

```bash
npm run preview
```

### 5. Run Tests

```bash
npm test
```

Runs the full Vitest suite (62 tests covering calculations, workflow engine, schema validation, caching, and all UI components).

## 📊 How It Works

### ELU Scores — Efficiency, Latency, Utilization

The application measures workflow gains across three dimensions:

| Dimension | Formula | Example (RAG benchmark) |
|-----------|---------|------------------------|
| **E — Efficiency** | `(monoTokens − agenticTokens) / monoTokens × 100` | **70%** token reduction |
| **L — Latency** | `(monoTime − agenticTime) / monoTime × 100` | **48%** faster (3.5s → 1.8s) |
| **U — Utilization** | `(monoCost − agenticCost) / monoCost × 100` | **70%** cost reduction |

ELU scores for the live tokenizer are computed dynamically from `tokenAnalysis.reduction`. The three pre-loaded benchmarks (Document Summarization, Email Classification, RAG Q&A) display static ELU scores in the Benchmark Mode panel.

### Agentic Pipeline

The app demonstrates a modular agentic workflow with 5 specialized agents:

1. **Retriever Agent** (300 tokens) - Fetches relevant context
2. **Summarizer Agent** (250 tokens) - Compresses information
3. **Classifier Agent** (150 tokens) - Categorizes requests
4. **Insight Agent** (100 tokens) - Identifies patterns
5. **Final Output Agent** (50 tokens) - Generates response

**Total: 850 tokens** vs. **Monolithic: 2,000 tokens** = **~60% reduction**

### Cost Savings

At $0.002 per 1,000 tokens:
- Monolithic: $0.004 per request
- Agentic: $0.0017 per request
- **Savings: ~57% per request**

At scale (100M tokens/month):
- **Monthly savings: ~$113**
- **Annual savings: ~$1,360**

## 🎨 Design Features

- Modern dark theme with vibrant gradients
- Smooth animations and transitions
- Glassmorphism effects
- Responsive layout
- Interactive charts with Chart.js
- Premium typography (Inter font)

## 🛠 Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Charts**: Chart.js + React-ChartJS-2 + react-google-charts (Sankey diagrams)
- **Icons**: Lucide React
- **Styling**: styled-components (CSS-in-JS) + CSS Variables design system
- **Tokenization**: gpt-tokenizer
- **Animations**: Framer Motion
- **Testing**: Vitest + @testing-library/react
- **CI**: GitHub Actions (`.github/workflows/ci.yml`)

## 🏛️ Architecture

For a detailed overview of the application's architecture, please see the following documents:

- **[High-Level Design (HLD)](./docs/hdl.md)**: Architecture overview, component map, data flow, ELU score computation, reporting & export architecture, guard/cache diagrams, and CI/CD pipeline.
- **[Low-Level Design (LLD)](./docs/lld.md)**: Utility module APIs, component internals, ELU benchmark data model, export formats (PDF/CSV), schema, and test coverage.
- **[Sequence Diagrams](./docs/sequence-diagrams.md)**: 12 Mermaid sequence diagrams covering the full runtime — prompt analysis, cache hit/miss, retry, loop guard, cancellation, schema repair, run trace, PDF export, CSV export, ELU score display, achievement unlock, and CI/CD.

## 📁 Project Structure

```
agentic-workflow-optimizer/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: test + build on every push/PR
│       └── deploy.yml          # CD: deploy to GitHub Pages on push to main
├── index.html                  # Entry HTML
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite + Vitest configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main app component & global state
│   ├── index.css               # Global styles & design system (CSS variables)
│   ├── setupTests.jsx          # Vitest test setup & mocks
│   ├── components/
│   │   ├── Header.jsx          # Title bar & About button
│   │   ├── ProjectInfo.jsx     # High-level overview + LogicFlow diagram
│   │   ├── TokenizerInput.jsx  # Interactive prompt tokenizer (uses WorkflowRunner)
│   │   ├── PromptBreakdown.jsx # Token-level breakdown visualization
│   │   ├── WorkflowDiagram.jsx # Agent pipeline visualization
│   │   ├── TokenComparison.jsx # Side-by-side token usage charts
│   │   ├── TokenFlowSankey.jsx # Token flow Sankey diagram
│   │   ├── BenchmarkMode.jsx   # Pre-loaded benchmark scenarios
│   │   ├── ScenarioBuilder.jsx # Custom agent configuration builder
│   │   ├── ProviderComparison.jsx # LLM provider & model cost comparison
│   │   ├── CostCalculator.jsx  # Custom pricing calculator
│   │   ├── ScenarioInput.jsx   # Monthly usage inputs
│   │   ├── ProjectionCharts.jsx # ROI projection charts
│   │   ├── CostBreakdownSankey.jsx # Cost flow Sankey diagram
│   │   ├── Gamification.jsx    # Achievement tracking
│   │   ├── ExportTools.jsx     # PDF & CSV export
│   │   ├── RunTrace.jsx        # Run trace inspector (observability UI)
│   │   ├── LogicFlow.jsx       # Mermaid flowchart diagrams
│   │   └── AboutModal.jsx      # Documentation modal
│   ├── data/
│   │   ├── workflowData.js     # Agent definitions & default pricing
│   │   └── llmProviders.js     # Provider & model pricing data
│   ├── utils/
│   │   ├── calculations.js     # Pure cost & projection functions
│   │   ├── workflowEngine.js   # Loop guards, step runner, retry, ErrorKind
│   │   ├── schemaValidator.js  # Output schema validation & JSON repair
│   │   ├── cache.js            # Two-tier in-memory + localStorage cache
│   │   └── tracer.js           # Per-run trace logging & secret redaction
│   └── __tests__/
│       ├── App.test.jsx
│       ├── Header.test.jsx
│       ├── AboutModal.test.jsx
│       ├── ProjectInfo.test.jsx
│       ├── TokenComparison.test.jsx
│       ├── ProjectionCharts.test.jsx
│       ├── workflowEngine.test.js  # Loop guard, retry, WorkflowRunner tests
│       ├── schemaValidator.test.js # Schema validation & JSON repair tests
│       └── cache.test.js           # Cache key determinism & TTL tests
└── docs/
    ├── hdl.md                  # High-Level Design
    ├── lld.md                  # Low-Level Design
    └── sequence-diagrams.md    # Mermaid sequence diagrams
```

## 🎯 Use Cases

- **AI Product Teams**: Understand token optimization strategies
- **Cost Analysis**: Calculate potential savings for AI applications
- **Education**: Learn about agentic workflow architectures
- **Sales/Marketing**: Demonstrate value proposition of modular AI systems

## 🔧 Customization

### Modify Agent Configuration

Edit `src/data/workflowData.js` to change:
- Number of agents
- Token counts per agent
- Agent roles and descriptions
- Default pricing

### Adjust Pricing

The app uses $0.002 per 1,000 tokens by default. You can:
- Change `defaultPricing` in `workflowData.js`
- Adjust pricing in real-time using the UI input

### Modify Projections

Edit `src/components/ProjectionCharts.jsx` to change:
- Monthly projection scales
- Multi-year timeframes
- Chart styling and colors

## 📝 Next Steps

Once the app is running, you can:

1. Explore the workflow diagram to understand the agent pipeline
2. Compare token usage between monolithic and agentic approaches
3. Adjust pricing to match your LLM provider
4. Input custom scenarios to see personalized projections
5. Analyze ROI across different time horizons

## 🚧 Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Dependencies Not Installing

If you encounter issues with npm install:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Chart.js Not Rendering

Ensure all Chart.js components are properly registered in the component files. Each chart component imports and registers the necessary Chart.js modules.

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Built to demonstrate the efficiency gains of agentic workflows in AI applications** 🚀
