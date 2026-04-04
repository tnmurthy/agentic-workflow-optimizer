// src/__tests__/workflowEngine.test.js
import { describe, test, expect, vi } from 'vitest';
import {
    LIMITS,
    ErrorKind,
    stepSuccess,
    stepFailure,
    withRetry,
    LoopGuard,
    WorkflowRunner,
} from '../utils/workflowEngine';

// ─── stepSuccess / stepFailure ────────────────────────────────────────────

describe('stepSuccess', () => {
    test('returns ok:true with output and empty meta by default', () => {
        const result = stepSuccess({ tokens: 42 });
        expect(result.ok).toBe(true);
        expect(result.output).toEqual({ tokens: 42 });
        expect(result.meta).toEqual({});
    });

    test('merges provided meta', () => {
        const result = stepSuccess('x', { latencyMs: 10 });
        expect(result.meta).toEqual({ latencyMs: 10 });
    });
});

describe('stepFailure', () => {
    test('returns ok:false with error kind and message', () => {
        const result = stepFailure(ErrorKind.PARSE_ERROR, 'bad json');
        expect(result.ok).toBe(false);
        expect(result.error.kind).toBe(ErrorKind.PARSE_ERROR);
        expect(result.error.message).toBe('bad json');
    });
});

// ─── LoopGuard ────────────────────────────────────────────────────────────

describe('LoopGuard', () => {
    test('does not throw within limits', () => {
        const guard = new LoopGuard({ maxIterations: 5, maxToolCalls: 5 });
        for (let i = 0; i < 5; i++) {
            expect(() => guard.tick()).not.toThrow();
        }
    });

    test('throws MAX_ITERATIONS when iteration limit is exceeded', () => {
        const guard = new LoopGuard({ maxIterations: 2 });
        guard.tick(); // 1
        guard.tick(); // 2
        expect(() => guard.tick()).toThrow(); // 3 > 2
        try {
            new LoopGuard({ maxIterations: 2, maxToolCalls: 100, maxWallClockMs: 99999 }).tick().tick().tick();
        } catch (err) {
            // just ensure we can reach here
        }
        const err = (() => {
            try { guard.tick(); } catch (e) { return e; }
        })();
        expect(err.kind).toBe(ErrorKind.MAX_ITERATIONS);
    });

    test('throws MAX_TOOL_CALLS when tool-call limit is exceeded', () => {
        const guard = new LoopGuard({ maxIterations: 100, maxToolCalls: 1 });
        guard.toolCall(); // 1
        let caught;
        try { guard.toolCall(); } catch (e) { caught = e; } // 2 > 1
        expect(caught).toBeDefined();
        expect(caught.kind).toBe(ErrorKind.MAX_TOOL_CALLS);
    });

    test('throws WALL_CLOCK_EXCEEDED when time limit is exceeded', async () => {
        const guard = new LoopGuard({ maxWallClockMs: 1 });
        await new Promise(r => setTimeout(r, 5));
        let caught;
        try { guard.tick(); } catch (e) { caught = e; }
        expect(caught).toBeDefined();
        expect(caught.kind).toBe(ErrorKind.WALL_CLOCK_EXCEEDED);
    });

    test('exposes counters and elapsed time', () => {
        const guard = new LoopGuard({ maxIterations: 10, maxToolCalls: 10 });
        guard.tick();
        guard.tick();
        guard.toolCall();
        expect(guard.iterations).toBe(2);
        expect(guard.toolCalls).toBe(1);
        expect(guard.elapsedMs).toBeGreaterThanOrEqual(0);
    });
});

// ─── withRetry ────────────────────────────────────────────────────────────

describe('withRetry', () => {
    test('returns result immediately on first success', async () => {
        const fn = vi.fn().mockResolvedValue(42);
        const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 1 });
        expect(result).toBe(42);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('retries on failure and eventually succeeds', async () => {
        let calls = 0;
        const fn = vi.fn(async () => {
            calls++;
            if (calls < 3) throw new Error('flaky');
            return 'ok';
        });
        const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 1 });
        expect(result).toBe('ok');
        expect(fn).toHaveBeenCalledTimes(3);
    });

    test('throws after maxAttempts are exhausted', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('always fails'));
        await expect(withRetry(fn, { maxAttempts: 2, baseDelayMs: 1 })).rejects.toThrow('always fails');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('aborts immediately when signal is already aborted', async () => {
        const controller = new AbortController();
        controller.abort();
        const fn = vi.fn().mockResolvedValue('never');
        await expect(withRetry(fn, { signal: controller.signal })).rejects.toMatchObject({ kind: ErrorKind.CANCELLED });
        expect(fn).not.toHaveBeenCalled();
    });
});

// ─── WorkflowRunner ───────────────────────────────────────────────────────

describe('WorkflowRunner', () => {
    test('runs steps sequentially and returns ok:true', async () => {
        const runner = new WorkflowRunner();
        const result = await runner.run([
            { name: 'step1', fn: () => 1 },
            { name: 'step2', fn: (prev) => prev.output + 1 },
        ]);
        expect(result.ok).toBe(true);
        expect(result.steps).toHaveLength(2);
        expect(result.steps[1].output).toBe(2);
    });

    test('terminates on step failure with terminationReason', async () => {
        const runner = new WorkflowRunner({ retry: { maxAttempts: 1 } });
        const result = await runner.run([
            { name: 'good', fn: () => 'ok' },
            { name: 'bad', fn: () => { throw Object.assign(new Error('boom'), { kind: ErrorKind.PARSE_ERROR }); } },
            { name: 'unreachable', fn: () => 'never' },
        ]);
        expect(result.ok).toBe(false);
        expect(result.terminationReason).toBe(ErrorKind.PARSE_ERROR);
        expect(result.steps).toHaveLength(2);
    });

    test('respects cancellation signal', async () => {
        const controller = new AbortController();
        const runner = new WorkflowRunner({ signal: controller.signal, retry: { maxAttempts: 1 } });
        controller.abort();
        const result = await runner.run([{ name: 's', fn: () => 'x' }]);
        expect(result.ok).toBe(false);
        expect(result.terminationReason).toBe(ErrorKind.CANCELLED);
    });

    test('exposes guard stats on completion', async () => {
        const runner = new WorkflowRunner();
        const result = await runner.run([{ name: 'a', fn: () => 1 }]);
        expect(result.guard.iterations).toBe(1);
        expect(result.guard.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    test('hits MAX_ITERATIONS limit', async () => {
        const runner = new WorkflowRunner({ limits: { maxIterations: 2 } });
        const steps = Array.from({ length: 5 }, (_, i) => ({ name: `s${i}`, fn: () => i }));
        const result = await runner.run(steps);
        expect(result.ok).toBe(false);
        expect(result.terminationReason).toBe(ErrorKind.MAX_ITERATIONS);
    });
});
