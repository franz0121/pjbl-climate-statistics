import React, { useState } from 'react';
import { AdminShieldIcon } from '../../components/RoleIcons';
import '../../styles/Auth.css';
import { signIn } from '../../services/supabaseClient';
import { getUserProfileByIdentifier } from '../../services/supabaseClient';

interface AdminLoginProps {
  onLogin: (username: string, role: 'admin') => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_CREDENTIALS = {
    username: 'sirmarco',
    password: '101997'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    (async () => {
      try {
        if (username.includes('@')) {
          const res = await signIn(username, password);
          if (res.error) {
            setError('Invalid credentials. Please try again.');
          } else {
            const profile = await getUserProfileByIdentifier(username);
            onLogin(username, profile?.role === 'admin' ? 'admin' : 'admin');
          }
        } else {
          await new Promise(r => setTimeout(r, 500));
          if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            onLogin(username, 'admin');
          } else {
            setError('Invalid credentials. Please try again.');
          }
        }
      } catch (e) {
        setError('Login failed. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="auth-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-icon"><AdminShieldIcon size={56} /></div>
        <h2>Administrator Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
