/**
 * tracer.js
 *
 * Per-run trace logging with step inputs/outputs, timing, token usage,
 * loop counters, termination reasons, and secret redaction.
 */

// ─── Secret redaction ─────────────────────────────────────────────────────

/** Patterns whose *values* should be redacted in trace output. */
const REDACT_PATTERNS = [
    /api[_-]?key/i,
    /auth[_-]?token/i,
    /bearer/i,
    /password/i,
    /secret/i,
    /private[_-]?key/i,
    /access[_-]?token/i,
    /refresh[_-]?token/i,
    /client[_-]?secret/i,
];

const REDACTED = '[REDACTED]';

/**
 * Recursively redacts sensitive values in an object.
 *
 * @param {*} value
 * @returns {*} - Safe copy with secrets replaced by '[REDACTED]'.
 */
export function redact(value) {
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') return value; // strings themselves aren't redacted; only by key
    if (typeof value !== 'object') return value;

    if (Array.isArray(value)) {
        return value.map(redact);
    }

    const result = {};
    for (const [k, v] of Object.entries(value)) {
        const isSensitive = REDACT_PATTERNS.some(re => re.test(k));
        result[k] = isSensitive ? REDACTED : redact(v);
    }
    return result;
}

// ─── Trace store ──────────────────────────────────────────────────────────

const MAX_STORED_TRACES = 50;
const LS_TRACES_KEY = 'aw_run_traces';

function _loadTraces() {
    try {
        const raw = localStorage.getItem(LS_TRACES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function _saveTraces(traces) {
    try {
        localStorage.setItem(LS_TRACES_KEY, JSON.stringify(traces.slice(-MAX_STORED_TRACES)));
    } catch (_) { /* QuotaExceededError – silently skip */ }
}

/**
 * Returns the most recent run traces (up to MAX_STORED_TRACES).
 *
 * @returns {Object[]}
 */
export function getRecentTraces() {
    return _loadTraces();
}

/**
 * Deletes all stored traces.
 */
export function clearTraces() {
    try { localStorage.removeItem(LS_TRACES_KEY); } catch (_) { /* ignore */ }
}

// ─── RunTracer ────────────────────────────────────────────────────────────

let _traceIdCounter = 0;

/**
 * Collects a trace for a single workflow run and persists it.
 *
 * Usage:
 *   const tracer = new RunTracer('analyzePrompt');
 *   tracer.stepStart('tokenize', { prompt });
 *   tracer.stepEnd('tokenize', { tokens: 42 });
 *   tracer.finish({ ok: true });
 */
export class RunTracer {
    /**
     * @param {string} runName - Human-readable name for this run (e.g. 'analyzePrompt').
     */
    constructor(runName) {
        this.runId = `${Date.now()}-${++_traceIdCounter}`;
        this.runName = runName;
        this._startMs = Date.now();
        this._steps = [];
        this._currentStep = null;
    }

    /**
     * Records the start of a step.
     *
     * @param {string} stepName
     * @param {*} [input={}] - Step input; will be redacted.
     */
    stepStart(stepName, input = {}) {
        this._currentStep = {
            name: stepName,
            startMs: Date.now(),
            input: redact(input),
        };
    }

    /**
     * Records the end of a step.
     *
     * @param {string} stepName
     * @param {*} [output={}] - Step output; will be redacted.
     * @param {Object} [meta={}] - Optional metadata (tokens, cached, etc.).
     */
    stepEnd(stepName, output = {}, meta = {}) {
        const step = this._currentStep && this._currentStep.name === stepName
            ? this._currentStep
            : { name: stepName, startMs: Date.now(), input: {} };

        this._steps.push({
            ...step,
            output: redact(output),
            meta,
            latencyMs: Date.now() - step.startMs,
        });
        this._currentStep = null;
    }

    /**
     * Records a step error.
     *
     * @param {string} stepName
     * @param {Error|Object} err
     */
    stepError(stepName, err) {
        const step = this._currentStep && this._currentStep.name === stepName
            ? this._currentStep
            : { name: stepName, startMs: Date.now(), input: {} };

        this._steps.push({
            ...step,
            error: {
                kind: err.kind ?? 'unknown',
                message: err.message ?? String(err),
            },
            latencyMs: Date.now() - step.startMs,
        });
        this._currentStep = null;
    }

    /**
     * Finalises the trace and persists it.
     *
     * @param {Object} [summary={}] - Run summary (ok, terminationReason, guardStats, etc.).
     * @returns {Object} - The completed trace record.
     */
    finish(summary = {}) {
        const trace = {
            runId: this.runId,
            runName: this.runName,
            timestamp: new Date().toISOString(),
            totalLatencyMs: Date.now() - this._startMs,
            ok: summary.ok ?? true,
            terminationReason: summary.terminationReason ?? null,
            guard: summary.guard ?? null,
            steps: this._steps,
        };

        const traces = _loadTraces();
        traces.push(trace);
        _saveTraces(traces);

        return trace;
    }
}
