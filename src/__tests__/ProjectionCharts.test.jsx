// src/__tests__/ProjectionCharts.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import ProjectionCharts from '../components/ProjectionCharts';

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);


test('renders projection charts section', () => {
    render(<ProjectionCharts pricePerThousand={0.002} />);
    const titleElement = screen.getByText(/Monthly Cost Projections/i);
    expect(titleElement).toBeInTheDocument();
});
