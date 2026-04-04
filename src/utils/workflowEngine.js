/**
 * workflowEngine.js
 *
 * Provides loop guards, step result shape, error taxonomy, and retry
 * utilities for agentic workflow steps.
 */

// ─── Limits ────────────────────────────────────────────────────────────────

export const LIMITS = {
    MAX_ITERATIONS: 25,
    MAX_TOOL_CALLS: 50,
    MAX_WALL_CLOCK_MS: 30_000,
};

// ─── Error taxonomy ────────────────────────────────────────────────────────

export const ErrorKind = Object.freeze({
    TOOL_TIMEOUT: 'tool_timeout',
    TOOL_INVALID_INPUT: 'tool_invalid_input',
    MODEL_REFUSAL: 'model_refusal',
    PARSE_ERROR: 'parse_error',
    RATE_LIMITED: 'rate_limited',
    MAX_ITERATIONS: 'max_iterations',
    MAX_TOOL_CALLS: 'max_tool_calls',
    WALL_CLOCK_EXCEEDED: 'wall_clock_exceeded',
    VALIDATION_ERROR: 'validation_error',
    CANCELLED: 'cancelled',
    UNKNOWN: 'unknown',
});

// ─── Step result helpers ────────────────────────────────────────────────────

/**
 * Creates a successful step result.
 * @param {*} output - The step output payload.
 * @param {Object} [meta={}] - Optional metadata (tokens, latency, etc.).
 * @returns {{ ok: true, output: *, meta: Object }}
 */
export function stepSuccess(output, meta = {}) {
    return { ok: true, output, meta };
}

/**
 * Creates a failed step result.
 * @param {string} kind - One of the ErrorKind values.
 * @param {string} message - Human-readable error message.
 * @param {Object} [meta={}] - Optional metadata.
 * @returns {{ ok: false, error: { kind: string, message: string }, meta: Object }}
 */
export function stepFailure(kind, message, meta = {}) {
    return { ok: false, error: { kind, message }, meta };
}

// ─── Retry with exponential back-off ──────────────────────────────────────

/**
 * Executes `fn` with retries and exponential back-off.
 *
 * @param {() => Promise<*>} fn - Async function to execute.
 * @param {Object} [options={}]
 * @param {number} [options.maxAttempts=3]
 * @param {number} [options.baseDelayMs=200]
 * @param {number} [options.maxDelayMs=5000]
 * @param {AbortSignal} [options.signal] - Optional cancellation signal.
 * @returns {Promise<*>} - Resolves with the first successful return value.
 * @throws {Error} - Throws after all attempts are exhausted or on cancellation.
 */
export async function withRetry(fn, options = {}) {
    const {
        maxAttempts = 3,
        baseDelayMs = 200,
        maxDelayMs = 5_000,
        signal,
    } = options;

    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (signal?.aborted) {
            throw Object.assign(new Error('Operation cancelled'), { kind: ErrorKind.CANCELLED });
        }
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt === maxAttempts) break;

            const jitter = Math.random() * 0.3 * baseDelayMs;
            const delay = Math.min(baseDelayMs * 2 ** (attempt - 1) + jitter, maxDelayMs);

            await new Promise((resolve, reject) => {
                const timer = setTimeout(resolve, delay);
                if (signal) {
                    signal.addEventListener('abort', () => {
                        clearTimeout(timer);
                        reject(Object.assign(new Error('Operation cancelled'), { kind: ErrorKind.CANCELLED }));
                    }, { once: true });
                }
            });
        }
    }
    throw lastError;
}

// ─── Loop guard ───────────────────────────────────────────────────────────

/**
 * A guard that enforces iteration and wall-clock limits for workflow loops.
 *
 * Usage:
 *   const guard = new LoopGuard();
 *   while (!done) {
 *     guard.tick(); // throws if a limit is hit
 *     ...
 *   }
 */
export class LoopGuard {
    /**
     * @param {Object} [limits]
     * @param {number} [limits.maxIterations=LIMITS.MAX_ITERATIONS]
     * @param {number} [limits.maxToolCalls=LIMITS.MAX_TOOL_CALLS]
     * @param {number} [limits.maxWallClockMs=LIMITS.MAX_WALL_CLOCK_MS]
     */
    constructor(limits = {}) {
        this._maxIterations = limits.maxIterations ?? LIMITS.MAX_ITERATIONS;
        this._maxToolCalls = limits.maxToolCalls ?? LIMITS.MAX_TOOL_CALLS;
        this._maxWallClockMs = limits.maxWallClockMs ?? LIMITS.MAX_WALL_CLOCK_MS;
        this._iterations = 0;
        this._toolCalls = 0;
        this._startMs = Date.now();
    }

    /** Increment iteration counter and check all limits. */
    tick() {
        this._iterations += 1;
        this._checkLimits();
    }

    /** Increment tool-call counter and check all limits. */
    toolCall() {
        this._toolCalls += 1;
        this._checkLimits();
    }

    get iterations() { return this._iterations; }
    get toolCalls() { return this._toolCalls; }
    get elapsedMs() { return Date.now() - this._startMs; }

    _checkLimits() {
        if (this._iterations > this._maxIterations) {
            throw Object.assign(
                new Error(`Loop limit exceeded: ${this._iterations} iterations (max ${this._maxIterations})`),
                { kind: ErrorKind.MAX_ITERATIONS }
            );
        }
        if (this._toolCalls > this._maxToolCalls) {
            throw Object.assign(
                new Error(`Tool-call limit exceeded: ${this._toolCalls} calls (max ${this._maxToolCalls})`),
                { kind: ErrorKind.MAX_TOOL_CALLS }
            );
        }
        const elapsed = Date.now() - this._startMs;
        if (elapsed > this._maxWallClockMs) {
            throw Object.assign(
                new Error(`Wall-clock limit exceeded: ${elapsed}ms (max ${this._maxWallClockMs}ms)`),
                { kind: ErrorKind.WALL_CLOCK_EXCEEDED }
            );
        }
    }
}

// ─── WorkflowRunner ───────────────────────────────────────────────────────

/**
 * Executes a sequence of named steps with loop guards, retries, and
 * optional cancellation support.
 *
 * @example
 * const runner = new WorkflowRunner({ signal: controller.signal });
 * const result = await runner.run([
 *   { name: 'tokenize', fn: () => tokenize(prompt) },
 *   { name: 'distribute', fn: (prev) => distribute(prev.output) },
 * ]);
 */
export class WorkflowRunner {
    /**
     * @param {Object} [options={}]
     * @param {AbortSignal} [options.signal]
     * @param {Object} [options.limits]
     * @param {Object} [options.retry] - Default retry options for all steps.
     */
    constructor(options = {}) {
        this._signal = options.signal ?? null;
        this._limits = options.limits ?? {};
        this._defaultRetry = options.retry ?? { maxAttempts: 1 };
        this._guard = new LoopGuard(this._limits);
        this._stepResults = [];
    }

    /**
     * Runs an array of steps sequentially.
     *
     * @param {Array<{ name: string, fn: (prevResult: Object) => *, retry?: Object }>} steps
     * @returns {Promise<{ ok: boolean, steps: Object[], terminationReason?: string }>}
     */
    async run(steps) {
        let prevResult = stepSuccess(null);

        for (const step of steps) {
            if (this._signal?.aborted) {
                return this._terminate(ErrorKind.CANCELLED, 'Run aborted by caller');
            }

            try {
                this._guard.tick();
            } catch (err) {
                return this._terminate(err.kind ?? ErrorKind.UNKNOWN, err.message ?? String(err));
            }

            const retryOpts = { ...this._defaultRetry, ...(step.retry ?? {}), signal: this._signal };
            const startMs = Date.now();

            let result;
            try {
                const output = await withRetry(() => step.fn(prevResult), retryOpts);
                result = stepSuccess(output, { latencyMs: Date.now() - startMs });
            } catch (err) {
                const kind = err.kind ?? ErrorKind.UNKNOWN;
                result = stepFailure(kind, err.message ?? String(err), { latencyMs: Date.now() - startMs });
                this._stepResults.push({ name: step.name, ...result });
                return this._terminate(kind, err.message ?? String(err));
            }

            this._stepResults.push({ name: step.name, ...result });
            prevResult = result;
        }

        return {
            ok: true,
            steps: this._stepResults,
            guard: {
                iterations: this._guard.iterations,
                toolCalls: this._guard.toolCalls,
                elapsedMs: this._guard.elapsedMs,
            },
        };
    }

    _terminate(kind, reason) {
        return {
            ok: false,
            steps: this._stepResults,
            terminationReason: kind,
            terminationMessage: reason,
            guard: {
                iterations: this._guard.iterations,
                toolCalls: this._guard.toolCalls,
                elapsedMs: this._guard.elapsedMs,
            },
        };
    }
}
