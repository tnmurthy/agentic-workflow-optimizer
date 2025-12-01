// src/__tests__/App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from '../App';

test('renders main header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Stop Burning Potential/i);
    expect(headerElement).toBeInTheDocument();
});
