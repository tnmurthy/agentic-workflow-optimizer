import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Header from '../components/Header';

test('renders header title', () => {
    render(<Header />);
    const headerElement = screen.getByText(/Agentic Workflow Token Optimizer/i);
    expect(headerElement).toBeInTheDocument();
});
