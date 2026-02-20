import React, { useState } from 'react';
import { TeacherCalendarIcon } from '../../components/RoleIcons';
import '../../styles/Auth.css';
import { signIn } from '../../services/supabaseClient';
import { getUserProfileByIdentifier } from '../../services/supabaseClient';

interface TeacherLoginProps {
  onLogin: (username: string, role: 'teacher') => void;
  onBack: () => void;
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const TEACHER_CREDENTIALS = {
    username: 'teacher01',
    password: 'cbnhs'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // If username is an email, try Supabase sign-in
    (async () => {
      try {
        if (username.includes('@')) {
          const res = await signIn(username, password);
          if (res.error) {
            setError('Invalid credentials. Please try again.');
          } else {
            const profile = await getUserProfileByIdentifier(username);
            const role = profile?.role === 'teacher' ? 'teacher' : 'teacher';
            onLogin(username, 'teacher');
          }
        } else {
          // fallback to local static credentials for teachers
          await new Promise(r => setTimeout(r, 500));
          if (username === TEACHER_CREDENTIALS.username && password === TEACHER_CREDENTIALS.password) {
            onLogin(username, 'teacher');
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
        <div className="auth-icon"><TeacherCalendarIcon size={56} /></div>
        <h2>Teacher Login</h2>
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

export default TeacherLogin;
