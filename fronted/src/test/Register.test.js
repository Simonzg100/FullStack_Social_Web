import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../component/Register/Register';
import * as usersAPI from '../api/usersAPI';
import '@testing-library/jest-dom/extend-expect';

/* eslint-disable */
jest.mock('../api/usersAPI', () => ({
  register: jest.fn(() => Promise.resolve({ message: 'Registration successful!' }))
}));

const mockSwitchToLogin = jest.fn();

describe('Register Component', () => {
  it('renders correctly', () => {
    render(<Register switchToLogin={mockSwitchToLogin} />);
    expect(screen.getByText('Welcome To Group Social')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
  });

  it('allows inputting values', () => {
    render(<Register switchToLogin={mockSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: 'testpassword' },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: 'test@example.com' },
    });

    expect(screen.getByLabelText(/Username:/i).value).toBe('testuser');
    expect(screen.getByLabelText(/Password:/i).value).toBe('testpassword');
    expect(screen.getByLabelText(/Email:/i).value).toBe('test@example.com');
  });

  it('handles the registration process', async () => {
    render(<Register switchToLogin={mockSwitchToLogin} />);

    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: 'newpassword' },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: 'new@example.com' },
    });

    fireEvent.click(screen.getByText(/Register/i));
    const message = await screen.findByText('Registration successful!');
    expect(message).toBeInTheDocument();
  });

  it('displays an error message when registration fails', async () => {
    usersAPI.register.mockImplementation(() => Promise.reject(new Error('Registration failed!')));
  
    render(<Register switchToLogin={mockSwitchToLogin} />);
  
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText(/First Name:/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name:/i), { target: { value: 'Doe' } });
  
    fireEvent.click(screen.getByText(/Register/i));
  
    const errorMessage = await screen.findByText('Registration failed!');
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows an error message when username, password, or email are not provided', async () => {
    render(<Register switchToLogin={mockSwitchToLogin} />);
  
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'email@example.com' } });
    fireEvent.click(screen.getByText(/Register/i));
    expect(await screen.findByText('Username, password, and email are required!')).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: '' } });
  
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'username' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'email@example.com' } });
    fireEvent.click(screen.getByText(/Register/i));
    expect(await screen.findByText('Username, password, and email are required!')).toBeInTheDocument();
  
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: '' } });
  
    fireEvent.change(screen.getByLabelText(/Username:/i), { target: { value: 'username' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByText(/Register/i));
    expect(await screen.findByText('Username, password, and email are required!')).toBeInTheDocument();
  });

  it('updates major state on input change', () => {
    const switchToLoginMock = jest.fn();
    render(<Register switchToLogin={switchToLoginMock} />);

    const majorInput = screen.getByLabelText('Major:');
    fireEvent.change(majorInput, { target: { value: 'Computer Science' } });

    expect(majorInput.value).toBe('Computer Science');
  });
  
});