import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { register } from '../../api/usersAPI';
import './Register.css';

function Register({ switchToLogin }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      setMessage('Username, password, and email are required!');
      return;
    }

    const newUser = {
      username,
      firstName,
      lastName,
      email,
      password,
      major,
      followers: [],
      following: [],
      loginAttempts: 0,
    };

    try {
      await register(newUser);
      setMessage('Registration successful!');
      setTimeout(() => switchToLogin(), 2000);
    } catch (error) {
      setMessage('Registration failed!');
    }
  };

  return (
    <div className="center-content">
      <div className="register-container">
        <h1>Welcome To Group Social</h1>
        {message && <p>{message}</p>}
        <label htmlFor="username-input" className="input-label">
          <span className="label-text">Username:</span>
          <input id="username-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />

        <label htmlFor="first-name-input" className="input-label">
          <span className="label-text">First Name:</span>
          <input id="first-name-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <br />

        <label htmlFor="last-name-input" className="input-label">
          <span className="label-text">Last Name:</span>
          <input id="last-name-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <br />

        <label htmlFor="email-input" className="input-label">
          <span className="label-text">Email:</span>
          <input id="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />

        <label htmlFor="password-input" className="input-label">
          <span className="label-text">Password:</span>
          <input id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />

        <label htmlFor="major-input" className="input-label">
          <span className="label-text">Major:</span>
          <input id="major-input" type="text" value={major} onChange={(e) => setMajor(e.target.value)} />
        </label>
        <br />

        <button className="btn" type="button" onClick={handleRegister}>Register</button>
        <button className="btn" type="button" onClick={switchToLogin}>Already have an account? Login</button>
      </div>
    </div>
  );
}

Register.propTypes = {
  switchToLogin: PropTypes.func.isRequired,
};

export default Register;
