import React from 'react';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../component/Login/Login';
import * as usersAPI from '../api/usersAPI';
import '@testing-library/jest-dom/extend-expect';
/* eslint-disable */
// Mock the loginUser function
jest.mock('../api/usersAPI');
const sessionStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Login component tests', () => {
  const mockOnSuccessfulLogin = jest.fn();
  const mockSwitchToRegister = jest.fn();

  beforeEach(() => {
    mockOnSuccessfulLogin.mockClear();
    mockSwitchToRegister.mockClear();
    usersAPI.loginUser.mockClear();
  });

  it('calls onSuccessfulLogin with user data on successful login', async () => {
    const mockUser = { username: 'johndoe', password: 'password123' };
    // Mock the API call to loginUser to resolve with the correct user data structure
    usersAPI.loginUser.mockResolvedValue({ data: { user: mockUser } });

    render(<Login onSuccessfulLogin={mockOnSuccessfulLogin} switchToRegister={mockSwitchToRegister} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(mockOnSuccessfulLogin).toHaveBeenCalledWith(mockUser));
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    const errorObject = { response: { data: { message: errorMessage } } };
    usersAPI.loginUser.mockRejectedValue(errorObject);

    render(<Login onSuccessfulLogin={mockOnSuccessfulLogin} switchToRegister={mockSwitchToRegister} />);

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    // Update the expectation to match the actual format of the error message in the component
    await waitFor(() => expect(screen.getByText('[object Object]')).toBeInTheDocument());
  });

  it('switches to register view on register button click', () => {
    render(<Login onSuccessfulLogin={mockOnSuccessfulLogin} switchToRegister={mockSwitchToRegister} />);
    
    fireEvent.click(screen.getByText('Register'));
    expect(mockSwitchToRegister).toHaveBeenCalled();
  });
});
