export const calculateCost = (tokens, pricePerThousand) => {
    return (tokens / 1000) * pricePerThousand;
};

/**
 * Calculates token cost incorporating cache hits and negotiated contract volume discounts.
 */
export const calculateCostWithEngine = (tokens, pricePerThousand, cacheHitRate = 0, discountPercent = 0) => {
    const effectiveTokens = tokens * (1 - cacheHitRate / 100);
    const baseCost = (effectiveTokens / 1000) * pricePerThousand;
    return baseCost * (1 - discountPercent / 100);
};

export const calculateSavings = (monolithicCost, agenticCost) => {
    const savings = monolithicCost - agenticCost;
    const percentage = monolithicCost !== 0 ? (savings / monolithicCost) * 100 : 0;
    return { amount: savings, percentage };
};

export const calculateTokenReduction = (monolithicTokens, agenticTokens) => {
    const reduction = monolithicTokens - agenticTokens;
    const percentage = monolithicTokens !== 0 ? (reduction / monolithicTokens) * 100 : 0;
    return { amount: reduction, percentage };
};

/**
 * Calculates Initial Setup Capital Expenditure (CapEx)
 */
export const calculateCapEx = (devFte, buildWeeks, builderHourlyRate) => {
    return devFte * buildWeeks * 40 * builderHourlyRate;
};

/**
 * Calculates Monthly Operating Maintenance Expense (OpEx)
 */
export const calculateOpEx = (capEx, maintenancePercent) => {
    return (capEx * (maintenancePercent / 100)) / 12;
};

/**
 * Calculates monthly indirect labor savings from error rate reduction
 */
export const calculateLaborSavings = (requestsPerMonth, monoErrorRate, agenticErrorRate, auditTimeMinutes, laborRatePerHour) => {
    const errorReductionPercentage = Math.max(0, (monoErrorRate - agenticErrorRate) / 100);
    const errorsAvoided = requestsPerMonth * errorReductionPercentage;
    const hoursSaved = errorsAvoided * (auditTimeMinutes / 60);
    const monthlySavings = hoursSaved * laborRatePerHour;
    return {
        errorsAvoided: Math.floor(errorsAvoided),
        hoursSaved: parseFloat(hoursSaved.toFixed(1)),
        monthlySavings: parseFloat(monthlySavings.toFixed(2))
    };
};

/**
 * Calculates Payback Period in months, factoring in CapEx setup and OpEx maintenance.
 */
export const calculatePaybackPeriod = (implementationCost, monthlyGrossSavings, monthlyMaintenanceCost = 0) => {
    const monthlyNetSavings = monthlyGrossSavings - monthlyMaintenanceCost;
    if (monthlyNetSavings <= 0) return 999; // Return high number if no net savings
    return parseFloat((implementationCost / monthlyNetSavings).toFixed(1));
};

/**
 * Calculates Net Present Value (NPV) over 5 years, factoring in CapEx setup and OpEx maintenance.
 */
export const calculateNPV = (implementationCost, monthlyGrossSavings, monthlyMaintenanceCost = 0, annualDiscountRate = 0.10, years = 5) => {
    const annualNetSavings = (monthlyGrossSavings - monthlyMaintenanceCost) * 12;
    let npv = -implementationCost;
    for (let t = 1; t <= years; t++) {
        npv += annualNetSavings / Math.pow(1 + annualDiscountRate, t);
    }
    return parseFloat(npv.toFixed(2));
};

export const calculateMonthlyProjection = (tokensPerMonth, pricePerThousand, monolithicTokens, agenticTokens) => {
    const safeAgenticTokens = agenticTokens > 0 ? agenticTokens : 1;
    const requestsPerMonth = tokensPerMonth / safeAgenticTokens;

    const monolithicCost = calculateCost(requestsPerMonth * monolithicTokens, pricePerThousand);
    const agenticCost = calculateCost(tokensPerMonth, pricePerThousand);

    return {
        requests: Math.floor(requestsPerMonth),
        monolithicCost,
        agenticCost,
        savings: monolithicCost - agenticCost
    };
};

export const calculateAnnualProjection = (tokensPerYear, pricePerThousand, monolithicTokens, agenticTokens) => {
    const monthly = calculateMonthlyProjection(tokensPerYear / 12, pricePerThousand, monolithicTokens, agenticTokens);

    return {
        requests: monthly.requests * 12,
        monolithicCost: monthly.monolithicCost * 12,
        agenticCost: monthly.agenticCost * 12,
        savings: monthly.savings * 12
    };
};

export const calculateMultiYearProjection = (yearsArray, tokensPerYear, pricePerThousand, monolithicTokens, agenticTokens) => {
    return yearsArray.map(year => {
        const annual = calculateAnnualProjection(tokensPerYear, pricePerThousand, monolithicTokens, agenticTokens);
        return {
            year,
            cumulativeSavings: annual.savings * year
        };
    });
};

export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

export const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(num);
};
