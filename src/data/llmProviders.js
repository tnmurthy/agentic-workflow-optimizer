// LLM Provider and Model definitions with real-world pricing
// Last updated: April 2026 — reflects latest model releases from each provider

export const llmProviders = [
    {
        id: 'openai',
        name: 'OpenAI',
        logo: '🤖',
        models: [
            {
                id: 'gpt-4.1',
                name: 'GPT-4.1',
                inputCostPer1M: 2.00,
                outputCostPer1M: 8.00,
                contextWindow: 1000000,
                description: 'Latest flagship model — 1M context, strong coding & instruction following'
            },
            {
                id: 'gpt-4.1-mini',
                name: 'GPT-4.1 Mini',
                inputCostPer1M: 0.40,
                outputCostPer1M: 1.60,
                contextWindow: 1000000,
                description: 'Efficient mid-tier model, significantly cheaper than GPT-4.1'
            },
            {
                id: 'gpt-4.1-nano',
                name: 'GPT-4.1 Nano',
                inputCostPer1M: 0.10,
                outputCostPer1M: 0.40,
                contextWindow: 1000000,
                description: 'Ultra-low cost model, ideal for high-volume simple tasks'
            },
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                inputCostPer1M: 2.50,
                outputCostPer1M: 10.00,
                contextWindow: 128000,
                description: 'Multimodal flagship — text, vision & audio in one model'
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                inputCostPer1M: 0.15,
                outputCostPer1M: 0.60,
                contextWindow: 128000,
                description: 'Fast and affordable, great for everyday tasks'
            },
            {
                id: 'o3',
                name: 'o3',
                inputCostPer1M: 10.00,
                outputCostPer1M: 40.00,
                contextWindow: 200000,
                description: 'Advanced reasoning model, best for math, science & code'
            },
            {
                id: 'o4-mini',
                name: 'o4-mini',
                inputCostPer1M: 1.10,
                outputCostPer1M: 4.40,
                contextWindow: 200000,
                description: 'Cost-efficient reasoning model with strong STEM performance'
            }
        ]
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        logo: '🔷',
        models: [
            {
                id: 'claude-3-7-sonnet',
                name: 'Claude 3.7 Sonnet',
                inputCostPer1M: 3.00,
                outputCostPer1M: 15.00,
                contextWindow: 200000,
                description: 'Latest Claude — hybrid reasoning, best overall intelligence'
            },
            {
                id: 'claude-3-5-sonnet',
                name: 'Claude 3.5 Sonnet',
                inputCostPer1M: 3.00,
                outputCostPer1M: 15.00,
                contextWindow: 200000,
                description: 'Excellent for complex reasoning and long-form content'
            },
            {
                id: 'claude-3-5-haiku',
                name: 'Claude 3.5 Haiku',
                inputCostPer1M: 0.80,
                outputCostPer1M: 4.00,
                contextWindow: 200000,
                description: 'Fast and affordable, strong for everyday tasks'
            },
            {
                id: 'claude-3-haiku',
                name: 'Claude 3 Haiku',
                inputCostPer1M: 0.25,
                outputCostPer1M: 1.25,
                contextWindow: 200000,
                description: 'Most compact and fastest, cost-effective for simple tasks'
            }
        ]
    },
    {
        id: 'google',
        name: 'Google',
        logo: '🔵',
        models: [
            {
                id: 'gemini-2-5-pro',
                name: 'Gemini 2.5 Pro',
                inputCostPer1M: 1.25,
                outputCostPer1M: 10.00,
                contextWindow: 1000000,
                description: 'State-of-the-art thinking model, best for complex reasoning'
            },
            {
                id: 'gemini-2-0-flash',
                name: 'Gemini 2.0 Flash',
                inputCostPer1M: 0.10,
                outputCostPer1M: 0.40,
                contextWindow: 1000000,
                description: 'Next-gen speed and efficiency, excellent cost-to-performance'
            },
            {
                id: 'gemini-1-5-pro',
                name: 'Gemini 1.5 Pro',
                inputCostPer1M: 1.25,
                outputCostPer1M: 5.00,
                contextWindow: 2000000,
                description: 'Massive 2M context window, strong multimodal capabilities'
            },
            {
                id: 'gemini-1-5-flash',
                name: 'Gemini 1.5 Flash',
                inputCostPer1M: 0.075,
                outputCostPer1M: 0.30,
                contextWindow: 1000000,
                description: 'Fast and efficient, optimized for high-throughput workloads'
            }
        ]
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        logo: '🌊',
        models: [
            {
                id: 'mistral-large-2',
                name: 'Mistral Large 2',
                inputCostPer1M: 2.00,
                outputCostPer1M: 6.00,
                contextWindow: 128000,
                description: 'Top-tier multilingual model, strong at coding and reasoning'
            },
            {
                id: 'codestral',
                name: 'Codestral',
                inputCostPer1M: 0.30,
                outputCostPer1M: 0.90,
                contextWindow: 256000,
                description: 'Specialized code model — 80+ languages, 256K context'
            },
            {
                id: 'mistral-small-3',
                name: 'Mistral Small 3',
                inputCostPer1M: 0.10,
                outputCostPer1M: 0.30,
                contextWindow: 32000,
                description: 'Ultra-efficient, Apache 2.0 licensed, great for local deployments'
            }
        ]
    }
];

export const getProvider = (providerId) => {
    return llmProviders.find(p => p.id === providerId);
};

export const getModel = (providerId, modelId) => {
    const provider = getProvider(providerId);
    return provider?.models.find(m => m.id === modelId);
};

export const getAllModels = () => {
    return llmProviders.flatMap(provider =>
        provider.models.map(model => ({
            ...model,
            providerId: provider.id,
            providerName: provider.name
        }))
    );
};
