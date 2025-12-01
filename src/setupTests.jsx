// vitest setup to mock heavy modules
import { vi } from 'vitest';
import '@testing-library/jest-dom';
// Mock chart.js to avoid rendering issues
vi.mock('chart.js', () => {
    return {
        Chart: class { },
        register: () => { }
    };
});
// Mock html2canvas and jspdf
vi.mock('html2canvas', () => ({ default: () => Promise.resolve({ toDataURL: () => '' }) }));
vi.mock('jspdf', () => ({ jsPDF: class { } }));
