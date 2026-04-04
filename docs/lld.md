# Low-Level Design (LLD)

## 1. Introduction

This document provides a detailed, low-level view of the key components and utilities within the **Agentic Workflow Token Optimization Web App**. It covers both the original business-logic layer and the stability/observability layer added to harden the agentic analysis pipeline.

---

## 2. Utility Modules (`src/utils/`)

### 2.1 `calculations.js`

Pure, stateless functions that contain all cost and projection logic. Every function is safe to call with zero side-effects.

| Function | Signature | Returns | Notes |
|----------|-----------|---------|-------|
| `calculateCost` | `(tokens, pricePerThousand)` | `number` | `(tokens / 1000) * price` |
| `calculateSavings` | `(monolithicCost, agenticCost)` | `{ amount, percentage }` | Returns `percentage: 0` when `monolithicCost === 0` (division-by-zero guard) |
| `calculateTokenReduction` | `(monolithicTokens, agenticTokens)` | `{ amount, percentage }` | Returns `percentage: 0` when `monolithicTokens === 0` |
| `calculateMonthlyProjection` | `(tokensPerMonth, pricePerThousand, monolithicTokens, agenticTokens)` | `{ requests, monolithicCost, agenticCost, savings }` | Uses `safeAgenticTokens = max(agenticTokens, 1)` to prevent divide-by-zero |
| `calculateAnnualProjection` | `(tokensPerYear, …)` | `{ requests, monolithicCost, agenticCost, savings }` | Delegates to `calculateMonthlyProjection × 12` |
| `calculateMultiYearProjection` | `(yearsArray, tokensPerYear, …)` | `Array<{ year, cumulativeSavings }>` | Maps over `yearsArray` |
| `formatCurrency` | `(amount)` | `string` | `Intl.NumberFormat` in USD |
| `formatNumber` | `(num)` | `string` | `Intl.NumberFormat` with commas |

---

### 2.2 `workflowEngine.js`

Provides all runtime stability primitives: loop guards, step result standardisation, error taxonomy, retry logic, and a sequential step runner.

#### 2.2.1 Constants

```js
LIMITS = {
  MAX_ITERATIONS:    25,   // maximum steps a WorkflowRunner may execute
  MAX_TOOL_CALLS:    50,   // maximum external tool calls per run
  MAX_WALL_CLOCK_MS: 30000 // maximum wall-clock time per run (30 s)
}
```

#### 2.2.2 `ErrorKind` taxonomy

| Value | When thrown |
|-------|------------|
| `tool_timeout` | External call did not respond within timeout |
| `tool_invalid_input` | Input to a tool failed pre-validation |
| `model_refusal` | LLM refused to complete the request |
| `parse_error` | JSON or structured output could not be parsed |
| `rate_limited` | API rate limit hit |
| `max_iterations` | `LoopGuard.tick()` exceeded `MAX_ITERATIONS` |
| `max_tool_calls` | `LoopGuard.toolCall()` exceeded `MAX_TOOL_CALLS` |
| `wall_clock_exceeded` | Elapsed time exceeded `MAX_WALL_CLOCK_MS` |
| `validation_error` | Schema validation failed after repair attempt |
| `cancelled` | `AbortSignal` was aborted before or during execution |
| `unknown` | Any unclassified error |

#### 2.2.3 `stepSuccess(output, meta)` / `stepFailure(kind, message, meta)`

Standardised result objects:

```ts
// success
{ ok: true,  output: T,                            meta: Record<string, any> }
// failure
{ ok: false, error: { kind: ErrorKind, message: string }, meta: Record<string, any> }
```

#### 2.2.4 `LoopGuard`

Tracks iterations, tool calls, and elapsed time. Each call to `tick()` or `toolCall()` checks all three limits and throws a typed error if any is exceeded.

```
constructor(limits?)
  .tick()          → increments iterations; throws MAX_ITERATIONS or WALL_CLOCK_EXCEEDED
  .toolCall()      → increments toolCalls;  throws MAX_TOOL_CALLS  or WALL_CLOCK_EXCEEDED
  .iterations      → read-only current count
  .toolCalls       → read-only current count
  .elapsedMs       → read-only wall-clock since construction
```

#### 2.2.5 `withRetry(fn, options)`

```
options:
  maxAttempts  (default: 3)
  baseDelayMs  (default: 200ms)
  maxDelayMs   (default: 5000ms)
  signal?      AbortSignal – aborts between retries

Delay formula: min(baseDelayMs × 2^(attempt-1) + jitter(0–30%), maxDelayMs)
```

If `signal` is already aborted before the first attempt, throws immediately with `kind: 'cancelled'`.

#### 2.2.6 `WorkflowRunner`

Executes an array of `{ name, fn, retry? }` step descriptors sequentially:

```
constructor(options?)
  options.signal?  AbortSignal
  options.limits?  { maxIterations, maxToolCalls, maxWallClockMs }
  options.retry?   default retry options applied to all steps

.run(steps) → Promise<RunResult>
```

**`RunResult` shape:**

```ts
// success
{
  ok: true,
  steps: StepResult[],
  guard: { iterations: number, toolCalls: number, elapsedMs: number }
}

// failure
{
  ok: false,
  steps: StepResult[],       // steps completed before failure
  terminationReason: ErrorKind,
  terminationMessage: string,
  guard: { iterations, toolCalls, elapsedMs }
}
```

**Execution order per step:**

1. Check `signal.aborted` → terminate with `cancelled`.
2. `guard.tick()` → terminate on limit breach.
3. `withRetry(step.fn(prevResult), retryOpts)` → terminate on unrecoverable error.
4. Wrap result in `stepSuccess`; pass to next step as `prevResult`.

---

### 2.3 `schemaValidator.js`

Lightweight schema validation for critical step outputs with a one-shot repair path.

#### 2.3.1 `validateTokenAnalysis(data)`

Validates the `tokenAnalysis` object shape:

| Field | Rule |
|-------|------|
| `original` | non-empty string |
| `monolithicTokens` | finite number > 0 |
| `agenticTokens` | finite number ≥ 0 |
| `agenticBreakdown` | array; each item needs `id`, `name: string`, `actualTokens: number` |
| `reduction` | finite number in [0, 100] |
| `tokensSaved` | finite number ≥ 0 |

Returns `{ valid: boolean, errors: string[] }`.

#### 2.3.2 `validateAgentConfig(agent)`

Validates `{ id, name: string, tokens: number ≥ 0 }`. Returns `{ valid, errors }`.

#### 2.3.3 `repairJSON(raw)`

Four repair strategies applied in order:
1. Direct `JSON.parse`
2. Strip trailing commas before `}` or `]`
3. Extract first `{…}` block
4. Extract first `[…]` block

Returns `{ value, repaired: boolean } | null`.

#### 2.3.4 `validateAndRepairTokenAnalysis(data)`

1. If `data` is a string, calls `repairJSON(data)`.
2. Runs `validateTokenAnalysis(parsed)`.
3. On failure: coerces string-typed numerics, clamps `reduction` to [0, 100], initialises missing arrays.
4. Re-validates after coercion.

Returns `{ value, valid, repaired, errors }`.

---

### 2.4 `cache.js`

Two-tier TTL cache (in-memory + localStorage).

#### 2.4.1 Key building

```
stableStringify(value)
  → deterministic JSON serialisation with sorted object keys
  → handles nested objects and arrays

buildCacheKey(stepName, inputs, model, params)
  → "${stepName}::${model}::${stableStringify(inputs)}::${stableStringify(params)}"
```

Identical inputs always produce the same key regardless of property insertion order.

#### 2.4.2 In-memory tier

| Function | Behaviour |
|----------|-----------|
| `getFromCache(key)` | Returns value or `undefined` (auto-evicts expired entries) |
| `setInCache(key, value, ttlMs?)` | Default TTL: 5 min |
| `deleteFromCache(key)` | Removes single entry |
| `clearCache()` | Removes all entries |

#### 2.4.3 localStorage tier

| Function | Behaviour |
|----------|-----------|
| `getFromPersistentCache(key)` | Reads `aw_cache__<key>` from localStorage; returns `undefined` on error or expiry |
| `setInPersistentCache(key, value, ttlMs?)` | Silently ignores `QuotaExceededError` |

#### 2.4.4 Two-tier helpers

```
getCached(key)
  1. Check _memCache  → HIT: return
  2. Check localStorage → HIT: warm _memCache, return
  3. MISS: return undefined

setCached(key, value, ttlMs?)
  → writes to both _memCache and localStorage
```

---

### 2.5 `tracer.js`

Per-run structured logging with secret redaction.

#### 2.5.1 Secret redaction (`redact(value)`)

Recursively traverses an object. Any key matching one of the following patterns has its value replaced with `[REDACTED]`:

`api[_-]?key`, `auth[_-]?token`, `bearer`, `password`, `secret`, `private[_-]?key`, `access[_-]?token`, `refresh[_-]?token`, `client[_-]?secret`

#### 2.5.2 `RunTracer`

```
new RunTracer(runName)
  → assigns runId = "${Date.now()}-${counter}"
  → records _startMs

.stepStart(stepName, input?)
  → records step start time; redacts input

.stepEnd(stepName, output?, meta?)
  → records latency; redacts output; appends to _steps

.stepError(stepName, err)
  → records { kind, message }; appends to _steps

.finish(summary?)
  → builds trace record; appends to localStorage['aw_run_traces'] (max 50 entries)
  → returns trace
```

**Trace record shape:**

```ts
{
  runId:             string,        // unique ID
  runName:           string,
  timestamp:         string,        // ISO 8601
  totalLatencyMs:    number,
  ok:                boolean,
  terminationReason: string | null,
  guard:             { iterations, toolCalls, elapsedMs } | null,
  steps: Array<{
    name:      string,
    input:     object,             // redacted
    output?:   object,             // redacted
    error?:    { kind, message },
    meta:      object,
    latencyMs: number
  }>
}
```

#### 2.5.3 Storage helpers

| Function | Behaviour |
|----------|-----------|
| `getRecentTraces()` | Reads `aw_run_traces` from localStorage; returns `[]` on error |
| `clearTraces()` | Removes `aw_run_traces` from localStorage |

---

## 3. Component Design

### 3.1 `TokenizerInput.jsx`

The most complex component. Orchestrates the full prompt-analysis pipeline.

#### State

| Variable | Type | Purpose |
|----------|------|---------|
| `prompt` | `string` | Controlled textarea value |
| `analysis` | `object\|null` | Local analysis result (mirrored to parent via `onAnalysisChange`) |
| `abortRef` | `Ref<AbortController>` | Cancels any in-flight `WorkflowRunner` run |

The component also accepts `analysis` as a prop (lifted state from `App.jsx`). If provided, it takes precedence over local state.

#### `analyzePrompt()` — step-by-step

```
1. Guard: return if prompt is empty
2. Abort previous run: abortRef.current?.abort(); create new AbortController
3. Compute cache key: buildCacheKey('tokenize', { prompt }, 'gpt-tokenizer', {})
4. Cache lookup: getCached(key)
   → HIT: setAnalysis(cached); return
5. Create RunTracer('analyzePrompt')
6. Create WorkflowRunner({ signal, retry: { maxAttempts: 2, baseDelayMs: 100 } })
7. runner.run([
     'tokenize'  → encode(prompt)  [gpt-tokenizer]
     'distribute'→ proportional token allocation across agents
     'validate'  → validateAndRepairTokenAnalysis(raw)
                   throw VALIDATION_ERROR if still invalid after repair
   ])
8. tracer.finish(result)
9. if result.ok:
     setCached(key, analysis)
     setAnalysis(analysis)
   else:
     setAnalysis(character-estimation fallback)
```

#### Fallback behaviour

When the `WorkflowRunner` terminates with any non-`cancelled` error, a character-based estimation is shown:
- `monolithicTokens = ceil(prompt.length / 4)`
- `agenticTokens = floor(monolithicTokens × 0.425)`
- `reduction = 57.5%` (static)
- `isEstimate: true` → displays a warning banner

---

### 3.2 `RunTrace.jsx`

Observability panel that reads from the tracer store.

| Element | Behaviour |
|---------|-----------|
| Refresh button | Calls `getRecentTraces().reverse()` and re-renders |
| Clear button | Calls `clearTraces()`; disabled when list is empty |
| `TraceItem` | Collapsible card showing run status dot, name, ID, timestamp, latency; expands to full JSON |
| Empty state | Shown when no traces exist; prompts user to run an analysis |

---

### 3.3 `ScenarioBuilder.jsx`

Custom agent configuration builder.

| Feature | Implementation |
|---------|---------------|
| Agent list | `useState` initialised from `workflowData.agents` |
| Token slider | `<input type="range">` mutates agent's `tokens` field via `setAgents` |
| Add / remove agent | `setAgents([...agents, newAgent])` / `filter(a => a.id !== id)` |
| Save | Wrapped in `try/catch`: reads `agentic-scenarios` from localStorage, appends, writes back. Alerts on `QuotaExceededError` |

---

### 3.4 `ProjectionCharts.jsx`

#### Props

| Prop | Type | Purpose |
|------|------|---------|
| `pricePerThousand` | `number` | Passed from `App.jsx`; feeds `calculateMonthlyProjection` |

#### Data processing

1. **Monthly bar chart** — maps over `[1M, 10M, 100M]` token scales, calls `calculateMonthlyProjection()`.
2. **Multi-year line chart** — calls `calculateMultiYearProjection([1,2,3,4,5], annualTokens, …)`.

Both datasets are formatted into the `react-chartjs-2` data structure (`labels`, `datasets[].data`).

---

## 4. Data Schemas

### `tokenAnalysis` object

```ts
interface TokenAnalysis {
  original:         string;    // raw prompt text
  monolithicTokens: number;    // gpt-tokenizer token count (or char/4 estimate)
  agenticTokens:    number;    // sum of agent actualTokens
  agenticBreakdown: AgentBreakdown[];
  reduction:        number;    // percentage [0–100]
  tokensSaved:      number;    // monolithicTokens - agenticTokens
  isEstimate?:      boolean;   // true when fallback estimation is used
}

interface AgentBreakdown {
  id:           number;
  name:         string;
  tokens:       number;        // static weight from workflowData.js
  role:         string;
  description:  string;
  color:        string;
  actualTokens: number;        // proportional allocation of prompt token count
}
```

### `agent` object (`workflowData.js`)

```ts
interface Agent {
  id:          number;
  name:        string;
  tokens:      number;   // default token weight
  role:        string;
  description: string;
  color:       string;   // hex colour for UI
}
```

---

## 5. Test Coverage

| Test File | Scope | Tests |
|-----------|-------|-------|
| `workflowEngine.test.js` | `LoopGuard` (limits, counters), `withRetry` (success, retry, exhaustion, cancellation), `WorkflowRunner` (sequential run, failure, cancellation, guard stats, MAX_ITERATIONS) | 17 |
| `schemaValidator.test.js` | `validateTokenAnalysis` (all field rules), `validateAgentConfig`, `repairJSON` (all 4 strategies), `validateAndRepairTokenAnalysis` (coercion, clamping, JSON string input) | 23 |
| `cache.test.js` | `stableStringify` (key order independence, arrays, primitives), `buildCacheKey` (stepName/model/params differentiation), in-memory TTL and eviction | 15 |
| `App.test.jsx` | Root renders without crash | 1 |
| `Header.test.jsx` | Title present | 1 |
| `AboutModal.test.jsx` | Open/closed state | 2 |
| `ProjectInfo.test.jsx` | Section renders | 1 |
| `TokenComparison.test.jsx` | Title present | 1 |
| `ProjectionCharts.test.jsx` | Section renders | 1 |
| **Total** | | **62** |

