import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Chart.js
vi.mock('chart.js', async () => {
    const chart = await vi.importActual('chart.js');
    return {
        ...chart,
        Chart: {
            ...chart.Chart,
            register: vi.fn(),
        },
    };
});

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
