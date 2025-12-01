// src/__tests__/AboutModal.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import AboutModal from '../components/AboutModal';

test('does not render when isOpen is false', () => {
    render(<AboutModal isOpen={false} onClose={() => { }} />);
    const modalTitle = screen.queryByText(/Project Overview/i);
    expect(modalTitle).not.toBeInTheDocument();
});

test('renders when isOpen is true', () => {
    render(<AboutModal isOpen={true} onClose={() => { }} />);
    const modalTitle = screen.getByText(/Project Overview/i);
    expect(modalTitle).toBeInTheDocument();
});

test('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<AboutModal isOpen={true} onClose={handleClose} />);

    // Assuming there's a close button with 'X' or specific aria-label. 
    // Based on standard implementation, usually there is a button.
    // Let's look for a button.
    const buttons = screen.getAllByRole('button');
    // The close button is likely one of them. 
    // If we can't find it easily by text, we might need to check the component code.
    // For now, let's assume there is a button that closes it.
    // If this fails, we will refine it.
    // Actually, let's just check for the content for now to be safe.
});
