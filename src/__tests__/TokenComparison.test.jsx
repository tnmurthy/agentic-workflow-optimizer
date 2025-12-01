// src/__tests__/TokenComparison.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import TokenComparison from '../components/TokenComparison';

test('renders token comparison section', () => {
    render(<TokenComparison />);
    const titleElement = screen.getByText(/Token Usage Comparison/i);
    expect(titleElement).toBeInTheDocument();

    const monolithicElement = screen.getByText(/Monolithic/i);
    expect(monolithicElement).toBeInTheDocument();
});
