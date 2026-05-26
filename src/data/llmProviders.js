// LLM Provider and Model definitions with real-world pricing
// Last updated: May 2026 — reflects latest model releases from each provider

export const llmProviders = [
    {
        id: 'openai',
        name: 'OpenAI',
        logo: '🤖',
        models: [
            {
                id: 'o1',
                name: 'o1',
                inputCostPer1M: 15.00,
                outputCostPer1M: 60.00,
                contextWindow: 200000,
                description: 'Advanced reasoning model, top tier for logic and math'
            },
            {
                id: 'o1-mini',
                name: 'o1-mini',
                inputCostPer1M: 3.00,
                outputCostPer1M: 12.00,
                contextWindow: 128000,
                description: 'Fast reasoning model, ideal for structured coding'
            },
            {
                id: 'o3-mini',
                name: 'o3-mini',
                inputCostPer1M: 1.10,
                outputCostPer1M: 4.40,
                contextWindow: 200000,
                description: 'Next-gen cost-efficient reasoning model with superb STEM capability'
            },
            {
                id: 'gpt-4o',
                name: 'GPT-4o',
                inputCostPer1M: 2.50,
                outputCostPer1M: 10.00,
                contextWindow: 128000,
                description: 'Flagship multimodal model (text, vision & audio)'
            },
            {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                inputCostPer1M: 0.15,
                outputCostPer1M: 0.60,
                contextWindow: 128000,
                description: 'Ultra-fast, highly cost-effective model for high volume tasks'
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
                description: 'High intelligence flagship model for complex coding & reasoning'
            },
            {
                id: 'claude-3-5-haiku',
                name: 'Claude 3.5 Haiku',
                inputCostPer1M: 0.80,
                outputCostPer1M: 4.00,
                contextWindow: 200000,
                description: 'Blazing fast intelligence, excellent cost-to-performance ratio'
            },
            {
                id: 'claude-3-haiku',
                name: 'Claude 3 Haiku',
                inputCostPer1M: 0.25,
                outputCostPer1M: 1.25,
                contextWindow: 200000,
                description: 'Original high-speed compact model, ideal for simple routing tasks'
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
                outputCostPer1M: 5.00,
                contextWindow: 2000000,
                description: 'State-of-the-art reasoning model with massive 2M context window'
            },
            {
                id: 'gemini-2-5-flash',
                name: 'Gemini 2.5 Flash',
                inputCostPer1M: 0.075,
                outputCostPer1M: 0.30,
                contextWindow: 1000000,
                description: 'Ultra-efficient high throughput model with 1M context'
            },
            {
                id: 'gemini-2-0-flash',
                name: 'Gemini 2.0 Flash',
                inputCostPer1M: 0.10,
                outputCostPer1M: 0.40,
                contextWindow: 1000000,
                description: 'High performance and low latency flash model'
            },
            {
                id: 'gemini-1-5-pro',
                name: 'Gemini 1.5 Pro',
                inputCostPer1M: 1.25,
                outputCostPer1M: 5.00,
                contextWindow: 2000000,
                description: 'Deep multimodal capabilities, excellent for large compliance runs'
            },
            {
                id: 'gemini-1-5-flash',
                name: 'Gemini 1.5 Flash',
                inputCostPer1M: 0.075,
                outputCostPer1M: 0.30,
                contextWindow: 1000000,
                description: 'Fast and cost-effective, optimized for high-throughput workflows'
            }
        ]
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        logo: '🌊',
        models: [
            {
                id: 'mistral-large-latest',
                name: 'Mistral Large',
                inputCostPer1M: 2.00,
                outputCostPer1M: 6.00,
                contextWindow: 128000,
                description: 'Top-tier multilingual model, strong at reasoning and coding'
            },
            {
                id: 'codestral-latest',
                name: 'Codestral',
                inputCostPer1M: 0.30,
                outputCostPer1M: 0.90,
                contextWindow: 256000,
                description: 'Specialized coding assistant with large context'
            },
            {
                id: 'mistral-small-latest',
                name: 'Mistral Small',
                inputCostPer1M: 0.10,
                outputCostPer1M: 0.30,
                contextWindow: 32000,
                description: 'Fast and compact model for high-throughput execution'
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
