import { test, expect } from 'vitest';
import {
    calculateLaborSavings,
    calculatePaybackPeriod,
    calculateNPV,
    calculateCostWithEngine,
    calculateCapEx,
    calculateOpEx
} from '../utils/calculations';

test('calculateCostWithEngine handles caching and discounts', () => {
    // 1000 tokens, $2.00/1k, no cache, no discount => $2.00
    expect(calculateCostWithEngine(1000, 2.00, 0, 0)).toBe(2.00);

    // 1000 tokens, $2.00/1k, 50% cache, no discount => $1.00
    expect(calculateCostWithEngine(1000, 2.00, 50, 0)).toBe(1.00);

    // 1000 tokens, $2.00/1k, no cache, 10% discount => $1.80
    expect(calculateCostWithEngine(1000, 2.00, 0, 10)).toBe(1.80);

    // 1000 tokens, $2.00/1k, 30% cache, 15% discount => 700 effective tokens -> $1.40 base -> $1.19 net
    expect(calculateCostWithEngine(1000, 2.00, 30, 15)).toBeCloseTo(1.19, 4);
});

test('calculateCapEx computes initial build cost correctly', () => {
    // 2 FTE, 6 weeks, $85/hr => 2 * 6 * 40 * 85 = $40,800
    expect(calculateCapEx(2, 6, 85)).toBe(40800);
});

test('calculateOpEx computes monthly maintenance correctly', () => {
    // $40,800 CapEx, 15% annual maintenance rate => (40800 * 0.15) / 12 = $510.00
    expect(calculateOpEx(40800, 15)).toBe(510.00);
});

test('calculateLaborSavings computes correct values', () => {
    // 100k requests/mo, mono error 15%, agentic 3%, audit time 15 mins (0.25 hrs), labor rate $40/hr
    // error diff = 12% -> 12,000 errors avoided
    // hours saved = 12000 * 0.25 = 3000 hours
    // savings = 3000 * 40 = $120,000
    const res = calculateLaborSavings(100000, 15, 3, 15, 40);
    expect(res.errorsAvoided).toBe(12000);
    expect(res.hoursSaved).toBe(3000);
    expect(res.monthlySavings).toBe(120000);
});

test('calculatePaybackPeriod handles maintenance cost', () => {
    // $50k setup, $10k monthly gross savings, $2k monthly maintenance => monthly net savings = $8k
    // Payback = 50000 / 8000 = 6.25 months => rounded to 6.3
    expect(calculatePaybackPeriod(50000, 10000, 2000)).toBe(6.3);

    // If net savings are negative or zero
    expect(calculatePaybackPeriod(50000, 2000, 2000)).toBe(999);
    expect(calculatePaybackPeriod(50000, 1000, 2000)).toBe(999);
});

test('calculateNPV computes standard discounted flows with maintenance cost', () => {
    // Setup $50k cost, $10k gross savings/mo, $0 maintenance, discount 10%, 5 years
    // Year 1: 120 / 1.1 = 109.09
    // Year 2: 120 / 1.21 = 99.17
    // Year 3: 120 / 1.331 = 90.16
    // Year 4: 120 / 1.4641 = 81.96
    // Year 5: 120 / 1.61051 = 74.51
    // Sum = 454.89 - 50 = ~404.89
    const npvNoMaint = calculateNPV(50000, 10000, 0, 0.10, 5);
    expect(npvNoMaint).toBeCloseTo(404890.30, -1);

    // Setup $50k cost, $10k gross savings/mo, $2k maintenance, discount 10%, 5 years
    // Monthly net savings = $8k -> $96k/year
    // Year 1: 96 / 1.1 = 87.27
    // Year 2: 96 / 1.21 = 79.34
    // Year 3: 96 / 1.331 = 72.13
    // Year 4: 96 / 1.4641 = 65.57
    // Year 5: 96 / 1.61051 = 59.61
    // Sum = 363.92 - 50 = ~313.92
    const npvWithMaint = calculateNPV(50000, 10000, 2000, 0.10, 5);
    expect(npvWithMaint).toBeCloseTo(313912.24, -1);
});
