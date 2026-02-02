# Low-Level Design (LLD)

## 1. Introduction

This document provides a detailed, low-level view of the key components and logic within the **Agentic Workflow Token Optimization Web App**. It is intended for developers to understand the internal workings of the most complex parts of the application.

## 2. Component Design

### `TokenizerInput.jsx`

#### Purpose

This component provides an interactive interface for users to input a text prompt, analyze it, and see a real-time comparison between monolithic and agentic token counts.

#### State Management

The component manages its state using the `useState` hook:

- `prompt (string)`: Stores the user's input from the text area.
- `analysis (object | null)`: Stores the result of the token analysis. When `null`, no analysis is displayed. The object has the following structure:
  ```javascript
  {
    original: string,
    monolithicTokens: number,
    agenticTokens: number,
    agenticBreakdown: Array<{...}>,
    reduction: number,
    tokensSaved: number,
    isEstimate?: boolean // True if gpt-tokenizer fails and it falls back to a character estimate
  }
  ```

#### Core Logic

- **`analyzePrompt()`**: This is the primary function, triggered by the "Analyze Tokens" button.
  1. It first checks if the `prompt` is empty.
  2. It uses the `encode()` function from `gpt-tokenizer` to convert the prompt into a list of tokens and get the count.
  3. It then simulates an agentic breakdown by proportionally distributing the total token count across the predefined agents from `workflowData.js`.
  4. It calculates the total agentic tokens, the number of tokens saved, and the percentage reduction.
  5. In case `gpt-tokenizer` fails (e.g., in a limited environment), it has a `try...catch` fallback that performs a simple character-based estimation (`prompt.length / 4`).
  6. Finally, it updates the `analysis` state with the results, which triggers a re-render to display the analysis.

### `ProjectionCharts.jsx`

#### Purpose

This component is responsible for visualizing the projected cost savings over different time horizons using bar and line charts.

#### Props

- `pricePerThousand (number)`: The cost per 1,000 tokens, passed down from the `App.jsx` component.

#### Third-Party Libraries

- **`chart.js`**: The core charting library.
- **`react-chartjs-2`**: A React wrapper that provides `<Bar>` and `<Line>` components for easy integration.

#### Data Processing

The component does not perform calculations directly. Instead, it relies on utility functions from `src/utils/calculations.js` to get the data required for the charts.

1.  **Monthly Projections (Bar Chart)**:
    - It defines a set of monthly usage scales (e.g., 1M, 10M, 100M tokens).
    - It calls `calculateMonthlyProjection()` for each scale to get the monolithic and agentic costs.
    - The results are then formatted into the `data` structure required by `react-chartjs-2`.

2.  **Multi-Year ROI (Line Chart)**:
    - It calls `calculateMultiYearProjection()` to get the cumulative savings over a 5-year period.
    - The results are formatted for the line chart, showing the growth of savings over time.

## 3. Utility Functions (`src/utils/calculations.js`)

This file isolates the application's business logic, making it reusable and easy to test.

#### `formatNumber(number)`

- **Description:** Formats a number by adding commas as thousands separators.
- **Input:** `number`
- **Output:** `string` (e.g., `10000` -> `"10,000"`)

#### `formatCurrency(amount)`

- **Description:** Formats a number into a currency string (USD).
- **Input:** `amount` (number)
- **Output:** `string` (e.g., `1234.5` -> `"$1,234.50"`)

#### `calculateCost(tokens, pricePerThousand)`

- **Description:** Calculates the cost for a given number of tokens and a price per thousand tokens.
- **Input:** `tokens` (number), `pricePerThousand` (number)
- **Output:** `number`

#### `calculateMonthlyProjection(monthlyTokens, pricePerThousand, monolithicTokens, agenticTotalTokens)`

- **Description:** Calculates the projected monthly costs and savings for a given total monthly token usage.
- **Input:**
    - `monthlyTokens` (number): The total number of tokens processed per month.
    - `pricePerThousand` (number): The cost per 1,000 tokens.
    - `monolithicTokens` (number): The token count for a single monolithic request.
    - `agenticTotalTokens` (number): The total token count for a single agentic workflow request.
- **Output:** An object containing `monolithicCost`, `agenticCost`, and `savings`.

#### `calculateMultiYearProjection(years, annualTokens, pricePerThousand, monolithicTokens, agenticTotalTokens)`

- **Description:** Calculates the cumulative savings over a specified number of years.
- **Input:**
    - `years` (Array<number>): An array of years to calculate savings for (e.g., `[1, 2, 3, 4, 5]`).
    - `annualTokens` (number): The total number of tokens processed per year.
- **Output:** An array of objects, each containing the `year` and the `cumulativeSavings` for that year.
