// src/__tests__/cache.test.js
import { describe, test, expect, beforeEach } from 'vitest';
import {
    buildCacheKey,
    stableStringify,
    getFromCache,
    setInCache,
    deleteFromCache,
    clearCache,
} from '../utils/cache';

beforeEach(() => {
    clearCache();
});

// ─── stableStringify ──────────────────────────────────────────────────────

describe('stableStringify', () => {
    test('produces identical output regardless of object key order', () => {
        const a = stableStringify({ b: 2, a: 1 });
        const b = stableStringify({ a: 1, b: 2 });
        expect(a).toBe(b);
    });

    test('handles nested objects deterministically', () => {
        const a = stableStringify({ x: { d: 4, c: 3 }, y: 2 });
        const b = stableStringify({ y: 2, x: { c: 3, d: 4 } });
        expect(a).toBe(b);
    });

    test('handles arrays (preserving order)', () => {
        const a = stableStringify([1, 2, 3]);
        const b = stableStringify([1, 2, 3]);
        expect(a).toBe(b);

        // Different array order should produce different keys
        const c = stableStringify([3, 2, 1]);
        expect(a).not.toBe(c);
    });

    test('handles primitives', () => {
        expect(stableStringify(42)).toBe('42');
        expect(stableStringify('hello')).toBe('"hello"');
        expect(stableStringify(null)).toBe('null');
        expect(stableStringify(true)).toBe('true');
    });
});

// ─── buildCacheKey ────────────────────────────────────────────────────────

describe('buildCacheKey', () => {
    test('produces the same key for identical inputs regardless of object key order', () => {
        const k1 = buildCacheKey('tokenize', { b: 2, a: 1 }, 'gpt-4', { temp: 0 });
        const k2 = buildCacheKey('tokenize', { a: 1, b: 2 }, 'gpt-4', { temp: 0 });
        expect(k1).toBe(k2);
    });

    test('produces different keys for different stepNames', () => {
        const k1 = buildCacheKey('tokenize', { a: 1 });
        const k2 = buildCacheKey('distribute', { a: 1 });
        expect(k1).not.toBe(k2);
    });

    test('produces different keys for different models', () => {
        const k1 = buildCacheKey('step', {}, 'gpt-3.5');
        const k2 = buildCacheKey('step', {}, 'gpt-4');
        expect(k1).not.toBe(k2);
    });

    test('produces different keys for different params', () => {
        const k1 = buildCacheKey('step', {}, 'default', { temperature: 0 });
        const k2 = buildCacheKey('step', {}, 'default', { temperature: 1 });
        expect(k1).not.toBe(k2);
    });

    test('uses "default" model when not specified', () => {
        const k1 = buildCacheKey('step', { x: 1 });
        const k2 = buildCacheKey('step', { x: 1 }, 'default');
        expect(k1).toBe(k2);
    });
});

// ─── getFromCache / setInCache ────────────────────────────────────────────

describe('in-memory cache', () => {
    test('returns undefined for a missing key', () => {
        expect(getFromCache('nonexistent')).toBeUndefined();
    });

    test('returns a stored value', () => {
        setInCache('myKey', { data: 42 });
        expect(getFromCache('myKey')).toEqual({ data: 42 });
    });

    test('respects TTL and returns undefined for expired entries', async () => {
        setInCache('ttl-key', 'value', 10); // 10ms TTL
        await new Promise(r => setTimeout(r, 20));
        expect(getFromCache('ttl-key')).toBeUndefined();
    });

    test('deleteFromCache removes the entry', () => {
        setInCache('del-key', 'x');
        deleteFromCache('del-key');
        expect(getFromCache('del-key')).toBeUndefined();
    });

    test('clearCache removes all entries', () => {
        setInCache('k1', 1);
        setInCache('k2', 2);
        clearCache();
        expect(getFromCache('k1')).toBeUndefined();
        expect(getFromCache('k2')).toBeUndefined();
    });

    test('clearCache does not affect subsequent sets', () => {
        setInCache('k', 'old');
        clearCache();
        setInCache('k', 'new');
        expect(getFromCache('k')).toBe('new');
    });
});
