# Agentic Workflow Token Optimization Web App

An interactive web application that demonstrates how **agentic workflows** reduce token usage and costs compared to monolithic prompts.

## 🎯 Features

- **Interactive Workflow Diagram**: Visualize the modular agent pipeline
- **Token Usage Comparison**: See the 60% token reduction in action
- **🆕 Interactive Tokenizer**: Paste your prompts for real-time token analysis
- **🆕 LLM Provider Comparison**: Compare costs across OpenAI, Anthropic, Google, Mistral
- **🆕 Scenario Builder**: Create custom agent configurations with drag-to-adjust tokens
- **🆕 Benchmark Mode**: View pre-loaded comparisons for common use cases (RAG, Summarization)
- **🆕 Gamification**: Track your optimization achievements and badges
- **🆕 Export & Sharing**: Generate PDF reports and CSV data exports
- **Cost Modeling**: Calculate real-time cost savings with configurable pricing
- **Projection Charts**: Monthly, annual, and multi-year ROI projections
- **Custom Scenarios**: Input your own usage estimates
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

## 📊 How It Works

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
- **Charts**: Chart.js + React-ChartJS-2
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS Variables

## 📁 Project Structure

```
agentic-workflow-optimizer/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles & design system
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── WorkflowDiagram.jsx
│   │   ├── TokenComparison.jsx
│   │   ├── CostCalculator.jsx
│   │   ├── ProjectionCharts.jsx
│   │   └── ScenarioInput.jsx
│   ├── data/
│   │   └── workflowData.js  # Agent definitions & config
│   └── utils/
│       └── calculations.js   # Cost & projection utilities
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
