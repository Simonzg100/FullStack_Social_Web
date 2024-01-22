import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { loginUser } from '../../api/usersAPI';
import './Login.css';

function Login({ onSuccessfulLogin, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password });
      onSuccessfulLogin(response.data.user);
    } catch (error) {
      console.log('error.response.data.message:', error);
      console.log('error.response:', error);
      console.log('error.response.data:', error);

      console.log('Caught error:', error);
      setErrorMessage(error.toString());
    }
  };

  return (
    <div className="center-container">
      <div className="login-container">
        <h1 className="name">Group Social</h1>
        <br />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input id="username" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <br />
        <input id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button id="loginBtn" type="button" onClick={handleLogin}>Login</button>
        <button id="loginBtn" type="button" onClick={switchToRegister}>Register</button>
      </div>
    </div>
  );
}

Login.propTypes = {
  onSuccessfulLogin: PropTypes.func.isRequired,
  switchToRegister: PropTypes.func.isRequired,
};

export default Login;
