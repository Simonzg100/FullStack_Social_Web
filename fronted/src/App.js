import React, { useEffect, useState } from 'react';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import ActivityFeed from './component/ActivityFeed/ActivityFeed';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const token = sessionStorage.getItem('app-token');
    const storedUser = sessionStorage.getItem('app-user');
    console.log(`token: ${token} storedUser: ${storedUser}`);
    if (token && storedUser !== 'undefined') {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const onSuccessfulLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const switchToRegister = () => {
    setView('register');
  };

  const switchToLogin = () => {
    setView('login');
  };

  if (!user) {
    if (view === 'login') {
      return <Login onSuccessfulLogin={onSuccessfulLogin} switchToRegister={switchToRegister} />;
    } if (view === 'register') {
      return <Register switchToLogin={switchToLogin} />;
    }
  }

  return (
    <div>
      <div><ActivityFeed user={user} updateUser={setUser} /></div>
    </div>
  );
}

export default App;
