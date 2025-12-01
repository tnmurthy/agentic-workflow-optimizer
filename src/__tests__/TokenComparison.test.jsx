// src/__tests__/TokenComparison.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import TokenComparison from '../components/TokenComparison';

// Mock data dependencies if necessary, but they are imported from files.
// We mocked chart.js in setupTests.jsx, so the Bar chart won't render fully but won't crash.

test('renders token comparison section', () => {
    render(<TokenComparison />);
    const titleElement = screen.getByText(/Token Usage Comparison/i);
    expect(titleElement).toBeInTheDocument();

    const reductionText = screen.getByText(/Reduction/i);
    expect(reductionText).toBeInTheDocument();
});
