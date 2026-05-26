import { llmProviders as staticFallbackProviders } from '../data/llmProviders';

const CACHE_KEY = 'token_optimizer_pricing_data';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// List of model patterns we want to actively map from OpenRouter to our interface
const TARGET_MODELS = {
    openai: [
        { key: 'openai/o1', id: 'o1', name: 'o1', desc: 'Advanced reasoning flagship model' },
        { key: 'openai/o1-mini', id: 'o1-mini', name: 'o1-mini', desc: 'Fast reasoning model' },
        { key: 'openai/o3-mini', id: 'o3-mini', name: 'o3-mini', desc: 'Cost-efficient next-gen reasoning' },
        { key: 'openai/gpt-4o', id: 'gpt-4o', name: 'GPT-4o', desc: 'Flagship multimodal (text/vision/audio)' },
        { key: 'openai/gpt-4o-mini', id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Ultra-efficient high-volume standard' }
    ],
    anthropic: [
        { key: 'anthropic/claude-3.7-sonnet', id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', desc: 'Latest flagship Claude — hybrid reasoning' },
        { key: 'anthropic/claude-3.5-sonnet', id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'High intelligence reasoning & coding' },
        { key: 'anthropic/claude-3.5-haiku', id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', desc: 'Blazing fast intelligence & low cost' },
        { key: 'anthropic/claude-3-haiku', id: 'claude-3-haiku', name: 'Claude 3 Haiku', desc: 'Original high-speed compact model' }
    ],
    google: [
        { key: 'google/gemini-2.5-pro', id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Reasoning model with massive 2M context' },
        { key: 'google/gemini-2.5-flash', id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Ultra-efficient 1M context high-throughput' },
        { key: 'google/gemini-2.0-flash-exp', id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'High performance low-latency standard' },
        { key: 'google/gemini-pro-1.5', id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Deep multimodal capabilities' },
        { key: 'google/gemini-flash-1.5', id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Fast, cost-effective high-throughput' }
    ],
    mistral: [
        { key: 'mistralai/mistral-large', id: 'mistral-large-latest', name: 'Mistral Large', desc: 'Top-tier multilingual intelligence' },
        { key: 'mistralai/codestral', id: 'codestral-latest', name: 'Codestral', desc: 'Specialized coding assistant' },
        { key: 'mistralai/mistral-small', id: 'mistral-small-latest', name: 'Mistral Small', desc: 'Compact model for high throughput' }
    ]
};

export const fetchLatestPricing = async () => {
    // 1. Try to load cached data
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL) {
                console.log('Using cached real-time LLM pricing data.');
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn('Failed to read from localStorage cache:', e);
    }

    // 2. Fetch fresh pricing from OpenRouter API
    try {
        console.log('Fetching fresh real-time LLM pricing from OpenRouter...');
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const openRouterModels = json.data;

        // Clone our template static providers to update prices
        const updatedProviders = JSON.parse(JSON.stringify(staticFallbackProviders));

        // Match OpenRouter models to our target lists
        updatedProviders.forEach(provider => {
            const targets = TARGET_MODELS[provider.id] || [];
            
            provider.models.forEach(model => {
                // Find matching target config
                const targetConfig = targets.find(t => t.id === model.id);
                if (targetConfig) {
                    // Try to locate model in OpenRouter response
                    // Sometimes OpenRouter IDs have suffixes or slightly different formats
                    const apiModel = openRouterModels.find(m => 
                        m.id === targetConfig.key || 
                        m.id.startsWith(targetConfig.key + ':') ||
                        m.id.split(':')[0] === targetConfig.key
                    );

                    if (apiModel && apiModel.pricing) {
                        // OpenRouter pricing is per-token. Convert to per-1M tokens
                        const inputCost = parseFloat(apiModel.pricing.prompt) * 1000000;
                        const outputCost = parseFloat(apiModel.pricing.completion) * 1000000;
                        
                        // Only override if they are valid numbers
                        if (!isNaN(inputCost)) {
                            model.inputCostPer1M = parseFloat(inputCost.toFixed(4));
                        }
                        if (!isNaN(outputCost)) {
                            model.outputCostPer1M = parseFloat(outputCost.toFixed(4));
                        }
                        if (apiModel.context_length) {
                            model.contextWindow = apiModel.context_length;
                        }
                        console.log(`Updated model pricing: ${model.name} -> Input: $${model.inputCostPer1M}/1M | Output: $${model.outputCostPer1M}/1M`);
                    }
                }
            });
        });

        // 3. Cache the successful result
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: updatedProviders
            }));
        } catch (e) {
            console.warn('Failed to cache pricing data to localStorage:', e);
        }

        return updatedProviders;
    } catch (error) {
        console.error('Failed to fetch dynamic pricing from OpenRouter API:', error);
        console.log('Falling back to local static model definitions.');
        return staticFallbackProviders;
    }
};
