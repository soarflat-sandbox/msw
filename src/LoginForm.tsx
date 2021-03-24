import { useState, useCallback } from 'react';
import { UserData } from '../types';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const handleFormSubmit = useCallback(
    event => {
      event.preventDefault();

      fetch('/login2', {
        method: 'POST',
        body: JSON.stringify({
          username,
        }),
      })
        .then(res => res.json())
        .then(setUserData);
    },
    [username]
  );

  if (userData) {
    return (
      <div>
        <h1>
          <span data-testid="firstName">{userData.firstName}</span>{' '}
          <span data-testid="lastName">{userData.lastName}</span>
        </h1>
        <p data-testid="userId">{userData.id}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input id="username" name="username" value={username} onChange={handleUsernameChange} />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
