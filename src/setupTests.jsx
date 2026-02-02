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

// Mock Canvas API for Chart.js
HTMLCanvasElement.prototype.getContext = () => {
    return {
        fillStyle: '',
        fillRect: vi.fn(),
        measureText: () => ({ width: 0 }),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        clearRect: vi.fn(),
        setLineDash: vi.fn(),
        getLineDash: () => [],
        createLinearGradient: () => ({ addColorStop: vi.fn() }),
    };
};
