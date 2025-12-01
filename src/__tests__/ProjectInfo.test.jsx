// src/__tests__/ProjectInfo.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import ProjectInfo from '../components/ProjectInfo';

test('renders project info section', () => {
    render(<ProjectInfo />);
    const titleElement = screen.getByText(/Project Overview/i);
    expect(titleElement).toBeInTheDocument();
});
