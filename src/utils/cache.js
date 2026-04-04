/**
 * cache.js
 *
 * Lightweight in-memory + localStorage cache for deterministic sub-steps.
 * Keys are built from (stepName, normalizedInputs, model, params).
 */

// ─── Key building ─────────────────────────────────────────────────────────

/**
 * Builds a deterministic cache key string.
 *
 * @param {string} stepName - Name of the step (e.g. 'tokenize').
 * @param {*} inputs - Step inputs (will be JSON-serialised with sorted keys).
 * @param {string} [model='default'] - Model identifier.
 * @param {Object} [params={}] - Additional parameters (temperature, maxTokens, etc.).
 * @returns {string}
 */
export function buildCacheKey(stepName, inputs, model = 'default', params = {}) {
    const normalizedInputs = stableStringify(inputs);
    const normalizedParams = stableStringify(params);
    return `${stepName}::${model}::${normalizedInputs}::${normalizedParams}`;
}

/**
 * Deterministically serialises a value by sorting object keys.
 * Handles nested objects and arrays.
 *
 * @param {*} value
 * @returns {string}
 */
export function stableStringify(value) {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return '[' + value.map(stableStringify).join(',') + ']';
    }
    const keys = Object.keys(value).sort();
    const pairs = keys.map(k => JSON.stringify(k) + ':' + stableStringify(value[k]));
    return '{' + pairs.join(',') + '}';
}

// ─── In-memory cache ──────────────────────────────────────────────────────

const _memCache = new Map();

/**
 * Default TTL: 5 minutes.
 */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * Reads an entry from the in-memory cache.
 *
 * @param {string} key
 * @returns {* | undefined} - The cached value, or undefined if missing/expired.
 */
export function getFromCache(key) {
    const entry = _memCache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
        _memCache.delete(key);
        return undefined;
    }
    return entry.value;
}

/**
 * Writes an entry to the in-memory cache.
 *
 * @param {string} key
 * @param {*} value
 * @param {number} [ttlMs=DEFAULT_TTL_MS]
 */
export function setInCache(key, value, ttlMs = DEFAULT_TTL_MS) {
    _memCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Removes an entry from the in-memory cache.
 *
 * @param {string} key
 */
export function deleteFromCache(key) {
    _memCache.delete(key);
}

/**
 * Clears all entries from the in-memory cache.
 */
export function clearCache() {
    _memCache.clear();
}

// ─── localStorage-backed persistent cache ────────────────────────────────

const LS_PREFIX = 'aw_cache__';

/**
 * Reads a value from localStorage cache.
 * Falls back to undefined on any localStorage error.
 *
 * @param {string} key
 * @returns {* | undefined}
 */
export function getFromPersistentCache(key) {
    try {
        const raw = localStorage.getItem(LS_PREFIX + key);
        if (!raw) return undefined;
        const entry = JSON.parse(raw);
        if (Date.now() > entry.expiresAt) {
            try { localStorage.removeItem(LS_PREFIX + key); } catch (_) { /* ignore */ }
            return undefined;
        }
        return entry.value;
    } catch (_) {
        return undefined;
    }
}

/**
 * Writes a value to localStorage cache.
 * Silently ignores QuotaExceededError and other storage errors.
 *
 * @param {string} key
 * @param {*} value
 * @param {number} [ttlMs=DEFAULT_TTL_MS]
 */
export function setInPersistentCache(key, value, ttlMs = DEFAULT_TTL_MS) {
    try {
        const entry = { value, expiresAt: Date.now() + ttlMs };
        localStorage.setItem(LS_PREFIX + key, JSON.stringify(entry));
    } catch (_) {
        /* QuotaExceededError or unavailable – silently ignore */
    }
}

// ─── Two-tier lookup ─────────────────────────────────────────────────────

/**
 * Attempts a two-tier cache lookup: memory first, then localStorage.
 * Populates the memory tier on a localStorage hit.
 *
 * @param {string} key
 * @returns {* | undefined}
 */
export function getCached(key) {
    const memHit = getFromCache(key);
    if (memHit !== undefined) return memHit;

    const lsHit = getFromPersistentCache(key);
    if (lsHit !== undefined) {
        setInCache(key, lsHit); // warm memory tier
        return lsHit;
    }
    return undefined;
}

/**
 * Writes to both memory and localStorage caches.
 *
 * @param {string} key
 * @param {*} value
 * @param {number} [ttlMs=DEFAULT_TTL_MS]
 */
export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
    setInCache(key, value, ttlMs);
    setInPersistentCache(key, value, ttlMs);
}
