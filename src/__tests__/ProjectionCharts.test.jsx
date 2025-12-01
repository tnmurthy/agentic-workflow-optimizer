// src/__tests__/ProjectionCharts.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import ProjectionCharts from '../components/ProjectionCharts';

test('renders projection charts section', () => {
    render(<ProjectionCharts pricePerThousand={0.002} />);
    const titleElement = screen.getByText(/Monthly Cost Projections/i);
    expect(titleElement).toBeInTheDocument();

    const roiTitle = screen.getByText(/5-Year ROI Projection/i);
    expect(roiTitle).toBeInTheDocument();
});
