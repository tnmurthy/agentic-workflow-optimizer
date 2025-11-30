export const calculateCost = (tokens, pricePerThousand) => {
    return (tokens / 1000) * pricePerThousand;
};

export const calculateSavings = (monolithicCost, agenticCost) => {
    const savings = monolithicCost - agenticCost;
    const percentage = (savings / monolithicCost) * 100;
    return { amount: savings, percentage };
};

export const calculateTokenReduction = (monolithicTokens, agenticTokens) => {
    const reduction = monolithicTokens - agenticTokens;
    const percentage = (reduction / monolithicTokens) * 100;
    return { amount: reduction, percentage };
};

export const calculateMonthlyProjection = (tokensPerMonth, pricePerThousand, monolithicTokens, agenticTokens) => {
    const requestsPerMonth = tokensPerMonth / agenticTokens;

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
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};
