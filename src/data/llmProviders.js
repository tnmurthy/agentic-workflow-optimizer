// LLM Provider and Model definitions with real-world pricing

export const llmProviders = [
    {
        id: 'openai',
        name: 'OpenAI',
        logo: '🤖',
        models: [
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                inputCostPer1M: 2.50,
                outputCostPer1M: 10.00,
                contextWindow: 128000,
                description: 'Most capable model, best for complex tasks'
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                inputCostPer1M: 0.15,
                outputCostPer1M: 0.60,
                contextWindow: 128000,
                description: 'Fast and affordable, great for simple tasks'
            },
            {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                inputCostPer1M: 0.50,
                outputCostPer1M: 1.50,
                contextWindow: 16385,
                description: 'Legacy model, still cost-effective'
            }
        ]
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        logo: '🔷',
        models: [
            {
                id: 'claude-3-5-sonnet',
                name: 'Claude 3.5 Sonnet',
                inputCostPer1M: 3.00,
                outputCostPer1M: 15.00,
                contextWindow: 200000,
                description: 'Highest intelligence, excellent for complex reasoning'
            },
            {
                id: 'claude-3-haiku',
                name: 'Claude 3 Haiku',
                inputCostPer1M: 0.25,
                outputCostPer1M: 1.25,
                contextWindow: 200000,
                description: 'Fastest and most compact, great for simple tasks'
            }
        ]
    },
    {
        id: 'google',
        name: 'Google',
        logo: '🔵',
        models: [
            {
                id: 'gemini-1-5-pro',
                name: 'Gemini 1.5 Pro',
                inputCostPer1M: 1.25,
                outputCostPer1M: 5.00,
                contextWindow: 2000000,
                description: 'Massive context window, multimodal capabilities'
            },
            {
                id: 'gemini-1-5-flash',
                name: 'Gemini 1.5 Flash',
                inputCostPer1M: 0.075,
                outputCostPer1M: 0.30,
                contextWindow: 1000000,
                description: 'Fast and efficient, optimized for speed'
            }
        ]
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        logo: '🌊',
        models: [
            {
                id: 'mistral-large',
                name: 'Mistral Large',
                inputCostPer1M: 2.00,
                outputCostPer1M: 6.00,
                contextWindow: 128000,
                description: 'Top-tier performance for complex tasks'
            },
            {
                id: 'mistral-small',
                name: 'Mistral Small',
                inputCostPer1M: 0.20,
                outputCostPer1M: 0.60,
                contextWindow: 32000,
                description: 'Cost-effective for simple tasks'
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
