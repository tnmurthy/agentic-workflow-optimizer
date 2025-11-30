export const agents = [
    {
        id: 1,
        name: 'Retriever Agent',
        tokens: 300,
        role: 'Data Fetching',
        description: 'Retrieves relevant context and documents from the knowledge base',
        color: '#6366f1'
    },
    {
        id: 2,
        name: 'Summarizer Agent',
        tokens: 250,
        role: 'Content Compression',
        description: 'Condenses retrieved information into concise summaries',
        color: '#8b5cf6'
    },
    {
        id: 3,
        name: 'Classifier Agent',
        tokens: 150,
        role: 'Intent Analysis',
        description: 'Categorizes and routes requests to appropriate handlers',
        color: '#10b981'
    },
    {
        id: 4,
        name: 'Insight Agent',
        tokens: 100,
        role: 'Pattern Recognition',
        description: 'Identifies key patterns and insights from processed data',
        color: '#f59e0b'
    },
    {
        id: 5,
        name: 'Final Output Agent',
        tokens: 50,
        role: 'Response Generation',
        description: 'Generates the final formatted response',
        color: '#ef4444'
    }
];

export const monolithicTokens = 2000;
export const agenticTotalTokens = agents.reduce((sum, agent) => sum + agent.tokens, 0);

export const defaultPricing = {
    pricePerThousandTokens: 0.002
};
