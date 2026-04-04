# Sequence Diagrams

This document contains Mermaid sequence diagrams for the core runtime flows in the **Agentic Workflow Token Optimization Web App**.

---

## 1. Prompt Analysis — Happy Path (Cache Miss)

The end-to-end flow when a user clicks **"Analyze Tokens"** and the result is not in cache.

```mermaid
sequenceDiagram
    actor User
    participant UI as TokenizerInput
    participant Cache as cache.js
    participant Runner as WorkflowRunner
    participant Guard as LoopGuard
    participant Tracer as RunTracer
    participant Validator as schemaValidator
    participant Tokenizer as gpt-tokenizer

    User->>UI: clicks "Analyze Tokens"
    UI->>UI: abort previous AbortController
    UI->>UI: create new AbortController
    UI->>Cache: buildCacheKey('tokenize', {prompt}, ...)
    UI->>Cache: getCached(key)
    Cache-->>UI: undefined (cache miss)

    UI->>Tracer: new RunTracer('analyzePrompt')
    UI->>Runner: new WorkflowRunner({signal, retry})
    UI->>Runner: run([tokenize, distribute, validate])

    loop Each step
        Runner->>Guard: tick()
        Guard->>Guard: check MAX_ITERATIONS, WALL_CLOCK
        Guard-->>Runner: ok
    end

    Runner->>Tracer: stepStart('tokenize', {promptLength})
    Runner->>Tokenizer: encode(prompt)
    Tokenizer-->>Runner: tokens[]
    Runner->>Tracer: stepEnd('tokenize', {tokenCount})

    Runner->>Tracer: stepStart('distribute', {tokenCount})
    Runner->>Runner: proportional allocation across agents
    Runner->>Tracer: stepEnd('distribute', {agenticTotal, reduction})

    Runner->>Tracer: stepStart('validate', {})
    Runner->>Validator: validateAndRepairTokenAnalysis(rawAnalysis)
    Validator-->>Runner: {value, valid: true, repaired}
    Runner->>Tracer: stepEnd('validate', {valid: true})

    Runner-->>UI: {ok: true, steps, guard}
    UI->>Tracer: finish({ok: true, guard})
    Tracer->>Tracer: redact(steps)
    Tracer->>Tracer: persist to localStorage['aw_run_traces']

    UI->>Cache: setCached(key, analysis)
    Cache->>Cache: setInCache (memory, TTL 5 min)
    Cache->>Cache: setInPersistentCache (localStorage, TTL 5 min)

    UI->>UI: setAnalysis(result)
    UI->>User: renders token breakdown
```

---

## 2. Prompt Analysis — Cache Hit

When an identical prompt has already been analysed within the TTL window.

```mermaid
sequenceDiagram
    actor User
    participant UI as TokenizerInput
    participant Cache as cache.js

    User->>UI: clicks "Analyze Tokens"
    UI->>Cache: getCached(key)

    alt Memory hit
        Cache-->>UI: cached analysis (from _memCache)
    else localStorage hit
        Cache->>Cache: getFromPersistentCache(key)
        Cache->>Cache: warm _memCache
        Cache-->>UI: cached analysis
    end

    UI->>UI: setAnalysis(cached)
    UI->>User: renders token breakdown (no WorkflowRunner invoked)
```

---

## 3. Retry Flow (Transient Failure)

When a step fails on the first attempt but succeeds on retry.

```mermaid
sequenceDiagram
    participant Runner as WorkflowRunner
    participant Retry as withRetry
    participant Step as step.fn

    Runner->>Retry: withRetry(step.fn, {maxAttempts: 2, baseDelayMs: 100})

    Retry->>Step: attempt 1
    Step-->>Retry: throws Error("transient")

    Note over Retry: delay = 100ms + jitter
    Retry->>Retry: wait ~100ms

    Retry->>Step: attempt 2
    Step-->>Retry: returns output

    Retry-->>Runner: output
    Runner->>Runner: stepSuccess(output, {latencyMs})
```

---

## 4. Loop Guard — Limit Exceeded

When the `WorkflowRunner` is given more steps than `MAX_ITERATIONS` allows.

```mermaid
sequenceDiagram
    participant Runner as WorkflowRunner
    participant Guard as LoopGuard

    Runner->>Guard: new LoopGuard({maxIterations: 25})

    loop steps 1..25
        Runner->>Guard: tick()
        Guard-->>Runner: ok
    end

    Runner->>Guard: tick()  (step 26)
    Guard-->>Guard: iterations(26) > MAX_ITERATIONS(25)
    Guard-->>Runner: throws {kind: 'max_iterations', message: '...'}

    Runner-->>Runner: _terminate('max_iterations', message)
    Runner-->>Caller: {ok: false, terminationReason: 'max_iterations', steps, guard}
```

---

## 5. Cancellation Flow

When a new "Analyze" click arrives before the previous run completes.

```mermaid
sequenceDiagram
    actor User
    participant UI as TokenizerInput
    participant Runner1 as WorkflowRunner (run 1)
    participant Runner2 as WorkflowRunner (run 2)
    participant Retry as withRetry

    User->>UI: clicks "Analyze Tokens" (first time)
    UI->>UI: abortRef.current = new AbortController (ctrl1)
    UI->>Runner1: run(steps) with signal=ctrl1.signal

    Note over Runner1: executing step 1...

    User->>UI: clicks "Analyze Tokens" (second time, new prompt)
    UI->>UI: ctrl1.abort()
    UI->>UI: abortRef.current = new AbortController (ctrl2)

    Runner1->>Retry: withRetry is waiting between retries
    Retry->>Retry: signal aborted → reject with {kind: 'cancelled'}
    Runner1-->>UI: {ok: false, terminationReason: 'cancelled'}

    UI->>Runner2: run(steps) with signal=ctrl2.signal
    Runner2-->>UI: {ok: true, ...} (new result)
```

---

## 6. Schema Validation & Repair Flow

The validate step inside `WorkflowRunner` for a partially malformed analysis object.

```mermaid
sequenceDiagram
    participant Step as validate step
    participant V as validateAndRepairTokenAnalysis
    participant Val as validateTokenAnalysis

    Step->>V: validateAndRepairTokenAnalysis(rawAnalysis)

    V->>Val: validateTokenAnalysis(rawAnalysis)
    Val-->>V: {valid: false, errors: ['monolithicTokens must be positive']}

    Note over V: coerce: monolithicTokens = Number('100') → 100
    Note over V: coerce: reduction clamped to [0, 100]

    V->>Val: validateTokenAnalysis(repaired)
    Val-->>V: {valid: true, errors: []}

    V-->>Step: {value: repaired, valid: true, repaired: true, errors: []}
    Step-->>Runner: repaired analysis object
```

---

## 7. Run Trace — Persisting & Viewing

How a trace flows from execution to the `RunTrace` UI panel.

```mermaid
sequenceDiagram
    participant UI as TokenizerInput
    participant Tracer as RunTracer
    participant LS as localStorage
    participant Panel as RunTrace.jsx

    UI->>Tracer: new RunTracer('analyzePrompt')

    loop Each step
        UI->>Tracer: stepStart(name, input)
        UI->>Tracer: stepEnd(name, output, meta)
    end

    UI->>Tracer: finish({ok, terminationReason, guard})
    Tracer->>Tracer: redact(allStepInputsOutputs)
    Tracer->>LS: JSON.stringify(traces.slice(-50))
    Tracer-->>UI: traceRecord

    Note over Panel: User clicks "Refresh"
    Panel->>LS: getRecentTraces()
    LS-->>Panel: traces[]
    Panel->>Panel: setTraces(traces.reverse())
    Panel->>Panel: render TraceItem list

    Note over Panel: User clicks trace row
    Panel->>Panel: setExpanded(true)
    Panel->>Panel: render JSON.stringify(trace, null, 2)
```

---

## 8. CI/CD Pipeline

How code changes flow from push to deployment.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub
    participant CI as ci.yml
    participant CD as deploy.yml
    participant Pages as GitHub Pages

    Dev->>GH: git push (any branch / PR)
    GH->>CI: trigger CI workflow

    CI->>CI: test job: npm ci
    CI->>CI: test job: npm test -- --run (62 tests)
    CI->>CI: build job (needs: test): npm run build

    alt All jobs pass
        CI-->>GH: ✅ status checks green
    else Any job fails
        CI-->>GH: ❌ status checks red
        Note over GH: PR cannot merge (if branch protection enabled)
    end

    alt Push to main only
        GH->>CD: trigger deploy workflow
        CD->>CD: npm ci + npm run build
        CD->>Pages: upload dist/ artifact
        Pages-->>Dev: live at https://<org>.github.io/<repo>/
    end
```

---

## 9. PDF Export Flow

How the "Export to PDF" button produces a downloadable report.

```mermaid
sequenceDiagram
    actor User
    participant UI as ExportTools
    participant Calc as calculations.js
    participant DOM as Document DOM
    participant Canvas as html2canvas
    participant PDF as jsPDF

    User->>UI: clicks "Export to PDF"
    UI->>UI: setIsExporting(true) — disables button

    UI->>Calc: calculateCost(monolithicTokens, pricePerThousand)
    Calc-->>UI: monolithicCost

    UI->>Calc: calculateCost(agenticTotalTokens, pricePerThousand)
    Calc-->>UI: agenticCost

    UI->>Calc: calculateSavings(monolithicCost, agenticCost)
    Calc-->>UI: { amount, percentage }

    UI->>DOM: createElement('div') — off-screen at left:-9999px
    UI->>DOM: inject HTML (exec summary, token table, projection table, recs)
    UI->>DOM: document.body.appendChild(div)

    UI->>Canvas: html2canvas(div, { scale: 2, useCORS: true })
    Canvas-->>UI: canvas (PNG rasterised at 2× resolution)

    UI->>DOM: document.body.removeChild(div)

    UI->>PDF: new jsPDF('p', 'mm', 'a4')
    UI->>PDF: addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210mm, h)
    UI->>PDF: pdf.save('agentic-workflow-analysis.pdf')
    PDF-->>User: browser download prompt

    UI->>UI: setIsExporting(false) — re-enables button

    alt html2canvas or jsPDF throws
        UI->>UI: console.error(error)
        UI->>User: alert('Failed to export PDF. Please try again.')
        UI->>UI: setIsExporting(false)
    end
```

---

## 10. CSV Export Flow

How the "Export to CSV" button produces a downloadable spreadsheet.

```mermaid
sequenceDiagram
    actor User
    participant UI as ExportTools
    participant Calc as calculations.js
    participant DOM as Document DOM

    User->>UI: clicks "Export to CSV"

    UI->>Calc: calculateCost(monolithicTokens, pricePerThousand)
    UI->>Calc: calculateCost(agenticTotalTokens, pricePerThousand)
    UI->>Calc: calculateSavings(monolithicCost, agenticCost)
    Calc-->>UI: { amount, percentage }

    UI->>UI: build csvContent[][]
    Note over UI: Row groups: header, blank, metric rows,<br/>blank, monthly projection rows (1M/10M/100M)

    UI->>DOM: new Blob([csvContent], {type:'text/csv'})
    UI->>DOM: URL.createObjectURL(blob)
    UI->>DOM: createElement('a') — href=url, download='*.csv'
    UI->>DOM: document.body.appendChild(a)
    UI->>DOM: a.click()
    DOM-->>User: browser download prompt
    UI->>DOM: document.body.removeChild(a)
```

---

## 11. ELU Score Display Flow (BenchmarkMode)

How selecting a benchmark renders its Efficiency, Latency, and Utilization scores.

```mermaid
sequenceDiagram
    actor User
    participant UI as BenchmarkMode
    participant Data as benchmarks[] (static)

    Note over Data: 3 pre-loaded benchmark objects:<br/>summarization, classification, rag
    Note over Data: Each has monolithic{}, agentic{}, improvement{}

    UI->>UI: useState(benchmarks[0]) — default: summarization

    User->>UI: clicks "Email Classification" tab
    UI->>UI: setSelected(benchmarks[1])
    UI->>UI: re-render

    Note over UI: Monolithic card shows:<br/>tokens=500,000 / cost=$1.00 / time=15m / accuracy=82%
    Note over UI: Agentic card shows:<br/>tokens=150,000 / cost=$0.30 / time=3m / accuracy=94%

    UI->>UI: render E-score badge: improvement.tokens = '70%'
    UI->>UI: render U-score badge: improvement.cost   = '70%'
    Note over UI: L-score (latency) not surfaced as badge<br/>for this benchmark (only RAG has improvement.latency)

    User->>UI: clicks "RAG Q&A System" tab
    UI->>UI: setSelected(benchmarks[2])

    UI->>UI: render E-score badge: '70%'
    UI->>UI: render U-score badge: '70%'
    UI->>UI: render L-score (latency): improvement.latency = '48%'
    Note over UI: RAG is the only benchmark where<br/>all three ELU dimensions are shown
```

---

## 12. Gamification Achievement Unlock Flow

How achievement badges are evaluated and displayed as the user adjusts usage inputs.

```mermaid
sequenceDiagram
    actor User
    participant App as App.jsx
    participant GI as ScenarioInput
    participant GM as Gamification

    User->>GI: changes Monthly Tokens to 2,000,000
    GI->>App: onMonthlyTokensChange(2_000_000)
    App->>App: setMonthlyTokens(2_000_000)
    App->>GM: re-render with monthlyTokens=2M, pricePerThousand

    GM->>GM: tokensSaved = 2_000_000 × 0.60 = 1_200_000
    GM->>GM: savingsAmount = (2M/1000) × 0.002 × 0.60 = $2.40

    GM->>GM: useEffect([tokensSaved, savingsAmount])

    loop achievementsList
        GM->>GM: token_novice: 1_200_000 ≥ 1_000 ✅ unlock
        GM->>GM: cost_cutter: $2.40 < $100 ✗ locked
        GM->>GM: architect: hasCustomScenario=true ✅ unlock
        GM->>GM: optimizer_elite: 1_200_000 ≥ 1_000_000 ✅ unlock
    end

    GM->>GM: setUnlocked(['token_novice', 'architect', 'optimizer_elite'])
    GM->>User: renders 3 gold badges + 1 greyed badge
    GM->>User: stats bar: "Tokens Saved: 1,200,000 | Monthly Savings: $2.40"
```
