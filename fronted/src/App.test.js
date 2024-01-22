import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Login from './component/Login/Login';
/* eslint-disable */
test('renders headers', () => {
  render(<App />);
  const linkElement = screen.getByText(/Group Social/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Login form when not logged in', () => {
  render(<App />);
  const loginElement = screen.getByPlaceholderText(/Username/);
  expect(loginElement).toBeInTheDocument();
});

test('switches to Register view when Register button is clicked', async () => {
  render(<App />);
  const registerButton = screen.getByText(/Register/);
  await userEvent.click(registerButton);

  const registerForm = screen.getByText(/Welcome To Group Social/);
  expect(registerForm).toBeInTheDocument();
});

test('updates the username input value when changed', () => {
  render(<Login onSuccessfulLogin={jest.fn()} switchToRegister={jest.fn()} />);

  const usernameInput = screen.getByPlaceholderText('Username');
  userEvent.type(usernameInput, 'simon');

  expect(usernameInput.value).toBe('simon');
});

test('updates the password input value when changed', () => {
  render(<Login onSuccessfulLogin={jest.fn()} switchToRegister={jest.fn()} />);

  const passwordInput = screen.getByPlaceholderText('Password');
  fireEvent.change(passwordInput, { target: { value: '123' } });

  expect(passwordInput.value).toBe('123');
});
