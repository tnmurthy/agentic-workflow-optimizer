// src/__tests__/AboutModal.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import AboutModal from '../components/AboutModal';

test('renders about modal when open', () => {
    render(<AboutModal isOpen={true} />);
    const titleElement = screen.getByText(/Agentic Workflow Token Optimizer/i);
    expect(titleElement).toBeInTheDocument();
});

test('does not render about modal when closed', () => {
    const { container } = render(<AboutModal isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
});
