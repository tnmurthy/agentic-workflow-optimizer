# High-Level Design (HDL)

## 1. Introduction

This document outlines the high-level architecture of the **Agentic Workflow Token Optimization Web App**. The application is designed as an interactive, client-side tool to demonstrate and calculate the cost savings of using modular, agentic AI workflows compared to monolithic approaches.

## 2. Core Architectural Principles

- **Modularity:** The application is built as a set of loosely coupled React components, each responsible for a specific feature or piece of the user interface.
- **Interactivity:** The primary goal is to provide a hands-on, interactive experience for the user through real-time calculations, visualizations, and customizable inputs.
- **Client-Side Operation:** The entire application runs in the browser. There is no backend server, and no data is stored or processed outside of the user's session.
- **Maintainability:** The codebase is structured to be easily understood and extended, with a clear separation of concerns between UI components, data, and utility functions.

## 3. System Architecture

The application is a **Single-Page Application (SPA)** built on the following technology stack:

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** `styled-components` (CSS-in-JS) for component-level styling and a global `index.css` for the design system.
- **Visualizations:** Chart.js with the `react-chartjs-2` wrapper.

### Component Hierarchy

The application follows a standard hierarchical component structure, with the main `App.jsx` component acting as the central orchestrator.

```
App.jsx
├── Header.jsx
├── ProjectInfo.jsx
├── TokenizerInput.jsx
├── WorkflowDiagram.jsx
├── TokenComparison.jsx
├── BenchmarkMode.jsx
├── ScenarioBuilder.jsx
├── ProviderComparison.jsx
├── CostCalculator.jsx
├── ScenarioInput.jsx
├── ProjectionCharts.jsx
├── Gamification.jsx
├── ExportTools.jsx
└── AboutModal.jsx
```

## 4. Component Breakdown

| Component              | Responsibility                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `App.jsx`              | The main application component. Manages global state and orchestrates all other components. |
| `Header.jsx`           | Displays the main title, subtitle, and the "About Project" button.                    |
| `ProjectInfo.jsx`      | Provides a high-level overview of the project's goals and capabilities.                 |
| `TokenizerInput.jsx`   | Allows users to input text and see a real-time analysis of token usage.                 |
| `WorkflowDiagram.jsx`  | Visually represents the agentic workflow pipeline.                                     |
| `TokenComparison.jsx`  | Displays a side-by-side comparison of monolithic vs. agentic token usage.              |
| `ProviderComparison.jsx`| Allows users to compare costs across different LLM providers and models.               |
| `CostCalculator.jsx`   | Enables users to calculate cost savings based on custom pricing.                       |
| `ProjectionCharts.jsx` | Renders charts to visualize monthly, annual, and multi-year ROI projections.           |
| `AboutModal.jsx`       | A modal that provides detailed documentation about the project.                        |

## 5. Data Flow

The application's data is managed entirely on the client side.

- **Static Data:** Core data, such as agent definitions (`workflowData.js`) and LLM provider pricing (`llmProviders.js`), is stored in the `src/data/` directory and imported directly into the components.
- **State Management:** The primary application state (e.g., `pricePerThousand`, `monthlyRequests`) is managed within the `App.jsx` component using React's `useState` hook.
- **Props Drilling:** State is passed down from `App.jsx` to child components via props. Child components communicate back up to the parent through callback functions passed as props.

## 6. Utility Functions

The `src/utils/calculations.js` module contains pure functions responsible for all business logic, including:
- Calculating token costs.
- Projecting monthly and yearly savings.
- Formatting numbers and currency values.

This separation ensures that the application's logic is decoupled from the UI, making it easier to test and maintain.
