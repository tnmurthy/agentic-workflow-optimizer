// src/__tests__/schemaValidator.test.js
import { describe, test, expect } from 'vitest';
import {
    validateTokenAnalysis,
    validateAgentConfig,
    repairJSON,
    validateAndRepairTokenAnalysis,
} from '../utils/schemaValidator';

const VALID_ANALYSIS = {
    original: 'Hello world',
    monolithicTokens: 100,
    agenticTokens: 43,
    agenticBreakdown: [
        { id: 1, name: 'Retriever', tokens: 300, actualTokens: 30 },
    ],
    reduction: 57,
    tokensSaved: 57,
};

// ─── validateTokenAnalysis ────────────────────────────────────────────────

describe('validateTokenAnalysis', () => {
    test('accepts a valid object', () => {
        const { valid, errors } = validateTokenAnalysis(VALID_ANALYSIS);
        expect(valid).toBe(true);
        expect(errors).toHaveLength(0);
    });

    test('rejects null', () => {
        const { valid } = validateTokenAnalysis(null);
        expect(valid).toBe(false);
    });

    test('rejects missing original', () => {
        const { valid, errors } = validateTokenAnalysis({ ...VALID_ANALYSIS, original: '' });
        expect(valid).toBe(false);
        expect(errors.some(e => e.includes('original'))).toBe(true);
    });

    test('rejects non-positive monolithicTokens', () => {
        const { valid, errors } = validateTokenAnalysis({ ...VALID_ANALYSIS, monolithicTokens: 0 });
        expect(valid).toBe(false);
        expect(errors.some(e => e.includes('monolithicTokens'))).toBe(true);
    });

    test('rejects negative agenticTokens', () => {
        const { valid } = validateTokenAnalysis({ ...VALID_ANALYSIS, agenticTokens: -1 });
        expect(valid).toBe(false);
    });

    test('rejects reduction outside [0, 100]', () => {
        const { valid } = validateTokenAnalysis({ ...VALID_ANALYSIS, reduction: 150 });
        expect(valid).toBe(false);
    });

    test('rejects non-array agenticBreakdown', () => {
        const { valid } = validateTokenAnalysis({ ...VALID_ANALYSIS, agenticBreakdown: null });
        expect(valid).toBe(false);
    });

    test('rejects breakdown items with missing actualTokens', () => {
        const breakdown = [{ id: 1, name: 'A', tokens: 10 }]; // missing actualTokens
        const { valid } = validateTokenAnalysis({ ...VALID_ANALYSIS, agenticBreakdown: breakdown });
        expect(valid).toBe(false);
    });
});

// ─── validateAgentConfig ─────────────────────────────────────────────────

describe('validateAgentConfig', () => {
    test('accepts valid agent', () => {
        const { valid } = validateAgentConfig({ id: 1, name: 'Retriever', tokens: 300 });
        expect(valid).toBe(true);
    });

    test('rejects null agent', () => {
        const { valid } = validateAgentConfig(null);
        expect(valid).toBe(false);
    });

    test('rejects empty name', () => {
        const { valid } = validateAgentConfig({ id: 1, name: '', tokens: 50 });
        expect(valid).toBe(false);
    });

    test('rejects negative tokens', () => {
        const { valid } = validateAgentConfig({ id: 1, name: 'X', tokens: -5 });
        expect(valid).toBe(false);
    });
});

// ─── repairJSON ───────────────────────────────────────────────────────────

describe('repairJSON', () => {
    test('parses valid JSON without modification', () => {
        const result = repairJSON('{"a":1}');
        expect(result).not.toBeNull();
        expect(result.value).toEqual({ a: 1 });
        expect(result.repaired).toBe(false);
    });

    test('strips trailing commas', () => {
        const result = repairJSON('{"a":1,"b":2,}');
        expect(result).not.toBeNull();
        expect(result.value).toEqual({ a: 1, b: 2 });
        expect(result.repaired).toBe(true);
    });

    test('extracts first JSON object from surrounding text', () => {
        const result = repairJSON('Some text {"x":99} more text');
        expect(result).not.toBeNull();
        expect(result.value).toEqual({ x: 99 });
        expect(result.repaired).toBe(true);
    });

    test('extracts first JSON array from surrounding text', () => {
        const result = repairJSON('Here: [1,2,3] done');
        expect(result).not.toBeNull();
        expect(result.value).toEqual([1, 2, 3]);
    });

    test('returns null for completely unparseable input', () => {
        const result = repairJSON('not json at all !!!');
        expect(result).toBeNull();
    });

    test('returns null for non-string input', () => {
        expect(repairJSON(42)).toBeNull();
        expect(repairJSON(null)).toBeNull();
    });
});

// ─── validateAndRepairTokenAnalysis ──────────────────────────────────────

describe('validateAndRepairTokenAnalysis', () => {
    test('returns valid:true for a valid object', () => {
        const { valid, value } = validateAndRepairTokenAnalysis(VALID_ANALYSIS);
        expect(valid).toBe(true);
        expect(value).toMatchObject(VALID_ANALYSIS);
    });

    test('repairs numeric fields passed as strings', () => {
        const broken = {
            ...VALID_ANALYSIS,
            monolithicTokens: '100',
            agenticTokens: '43',
            reduction: '57',
            tokensSaved: '57',
        };
        const { valid, repaired } = validateAndRepairTokenAnalysis(broken);
        expect(valid).toBe(true);
        expect(repaired).toBe(true);
    });

    test('clamps reduction to [0, 100]', () => {
        const broken = { ...VALID_ANALYSIS, reduction: 200 };
        const { value, repaired } = validateAndRepairTokenAnalysis(broken);
        expect(repaired).toBe(true);
        expect(value.reduction).toBe(100);
    });

    test('parses a valid JSON string', () => {
        const { valid, value } = validateAndRepairTokenAnalysis(JSON.stringify(VALID_ANALYSIS));
        expect(valid).toBe(true);
        expect(value.monolithicTokens).toBe(100);
    });

    test('returns valid:false for an irreparable object', () => {
        const { valid } = validateAndRepairTokenAnalysis({ monolithicTokens: -5, agenticTokens: -1 });
        expect(valid).toBe(false);
    });
});
