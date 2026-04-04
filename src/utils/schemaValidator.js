/**
 * schemaValidator.js
 *
 * Lightweight schema validation for key step outputs and a one-shot
 * JSON repair path for malformed responses.
 */

// ─── tokenAnalysis schema ─────────────────────────────────────────────────

/**
 * Validates a tokenAnalysis object produced by the TokenizerInput step.
 *
 * Required shape:
 * {
 *   original:         string   (non-empty)
 *   monolithicTokens: number   (> 0)
 *   agenticTokens:    number   (>= 0)
 *   agenticBreakdown: Array<{ id, name, tokens, actualTokens, ... }>
 *   reduction:        number   (0–100)
 *   tokensSaved:      number   (>= 0)
 * }
 *
 * @param {*} data - Value to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateTokenAnalysis(data) {
    const errors = [];

    if (data === null || typeof data !== 'object') {
        return { valid: false, errors: ['tokenAnalysis must be a non-null object'] };
    }

    if (typeof data.original !== 'string' || data.original.trim() === '') {
        errors.push('original must be a non-empty string');
    }
    if (typeof data.monolithicTokens !== 'number' || !isFinite(data.monolithicTokens) || data.monolithicTokens <= 0) {
        errors.push('monolithicTokens must be a positive finite number');
    }
    if (typeof data.agenticTokens !== 'number' || !isFinite(data.agenticTokens) || data.agenticTokens < 0) {
        errors.push('agenticTokens must be a non-negative finite number');
    }
    if (!Array.isArray(data.agenticBreakdown)) {
        errors.push('agenticBreakdown must be an array');
    } else {
        data.agenticBreakdown.forEach((item, i) => {
            if (typeof item.id === 'undefined') errors.push(`agenticBreakdown[${i}].id is required`);
            if (typeof item.name !== 'string') errors.push(`agenticBreakdown[${i}].name must be a string`);
            if (typeof item.actualTokens !== 'number' || !isFinite(item.actualTokens)) {
                errors.push(`agenticBreakdown[${i}].actualTokens must be a finite number`);
            }
        });
    }
    if (typeof data.reduction !== 'number' || !isFinite(data.reduction) || data.reduction < 0 || data.reduction > 100) {
        errors.push('reduction must be a number between 0 and 100');
    }
    if (typeof data.tokensSaved !== 'number' || !isFinite(data.tokensSaved) || data.tokensSaved < 0) {
        errors.push('tokensSaved must be a non-negative finite number');
    }

    return { valid: errors.length === 0, errors };
}

// ─── agentConfig schema ───────────────────────────────────────────────────

/**
 * Validates a single agent configuration object.
 *
 * @param {*} agent
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateAgentConfig(agent) {
    const errors = [];

    if (agent === null || typeof agent !== 'object') {
        return { valid: false, errors: ['agent must be a non-null object'] };
    }
    if (typeof agent.id === 'undefined') errors.push('agent.id is required');
    if (typeof agent.name !== 'string' || agent.name.trim() === '') errors.push('agent.name must be a non-empty string');
    if (typeof agent.tokens !== 'number' || !isFinite(agent.tokens) || agent.tokens < 0) {
        errors.push('agent.tokens must be a non-negative finite number');
    }

    return { valid: errors.length === 0, errors };
}

// ─── JSON repair ─────────────────────────────────────────────────────────

/**
 * Attempts to repair a malformed JSON string using common heuristics.
 * Returns the parsed value on success, or null on failure.
 *
 * Repair strategies (applied in order):
 *  1. Direct JSON.parse
 *  2. Strip trailing commas before } or ]
 *  3. Wrap bare object-like string in {}
 *  4. Extract the first {...} or [...] block
 *
 * @param {string} raw - The raw string to repair.
 * @returns {{ value: *, repaired: boolean } | null}
 */
export function repairJSON(raw) {
    if (typeof raw !== 'string') return null;

    // Strategy 1: direct parse
    try {
        return { value: JSON.parse(raw), repaired: false };
    } catch (_) { /* fall through */ }

    // Strategy 2: strip trailing commas
    let cleaned = raw.replace(/,\s*([}\]])/g, '$1');
    try {
        return { value: JSON.parse(cleaned), repaired: true };
    } catch (_) { /* fall through */ }

    // Strategy 3: extract first JSON object or array
    const objMatch = raw.match(/\{[\s\S]*\}/);
    if (objMatch) {
        try {
            return { value: JSON.parse(objMatch[0]), repaired: true };
        } catch (_) { /* fall through */ }
    }
    const arrMatch = raw.match(/\[[\s\S]*\]/);
    if (arrMatch) {
        try {
            return { value: JSON.parse(arrMatch[0]), repaired: true };
        } catch (_) { /* fall through */ }
    }

    return null;
}

/**
 * Validates a tokenAnalysis object; if invalid, attempts to repair it by
 * re-parsing as JSON and coercing field types.
 *
 * @param {*} data - Raw data (already parsed or a JSON string).
 * @returns {{ value: Object|null, valid: boolean, repaired: boolean, errors: string[] }}
 */
export function validateAndRepairTokenAnalysis(data) {
    // If raw string, attempt JSON parse first
    let parsed = data;
    let wasRepaired = false;

    if (typeof data === 'string') {
        const result = repairJSON(data);
        if (!result) {
            return { value: null, valid: false, repaired: false, errors: ['Cannot parse JSON'] };
        }
        parsed = result.value;
        wasRepaired = result.repaired;
    }

    // First validation pass
    let { valid, errors } = validateTokenAnalysis(parsed);
    if (valid) return { value: parsed, valid: true, repaired: wasRepaired, errors: [] };

    // Coerce numeric fields
    const repaired = { ...parsed };
    if (repaired.monolithicTokens !== undefined) repaired.monolithicTokens = Number(repaired.monolithicTokens);
    if (repaired.agenticTokens !== undefined) repaired.agenticTokens = Number(repaired.agenticTokens);
    if (repaired.reduction !== undefined) repaired.reduction = Number(repaired.reduction);
    if (repaired.tokensSaved !== undefined) repaired.tokensSaved = Number(repaired.tokensSaved);
    if (repaired.original === undefined || repaired.original === null) repaired.original = '';
    if (!Array.isArray(repaired.agenticBreakdown)) repaired.agenticBreakdown = [];

    // Clamp reduction to [0, 100]
    if (isFinite(repaired.reduction)) {
        repaired.reduction = Math.max(0, Math.min(100, repaired.reduction));
    }

    // Re-validate after coercion
    ({ valid, errors } = validateTokenAnalysis(repaired));
    return { value: repaired, valid, repaired: true, errors };
}
