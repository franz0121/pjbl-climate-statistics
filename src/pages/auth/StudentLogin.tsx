import React, { useState } from 'react';
import { StudentCapIcon } from '../../components/RoleIcons';
import { validateStudentCredentials, registerStudent } from '../../services/authService';
import { signIn } from '../../services/supabaseClient';
import { getUserProfileByIdentifier } from '../../services/supabaseClient';
import '../../styles/Auth.css';

interface StudentLoginProps {
  onLogin: (username: string, role: 'student' | 'admin') => void;
  onBack: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Allow admin credentials here for bypass testing
    if (username === 'sirmarco' && password === '101997') {
      onLogin(username, 'admin');
      setIsLoading(false);
      return;
    }

    try {
      // If username looks like email, try Supabase auth
      if (username.includes('@')) {
        const res = await signIn(username, password);
        if (res.error) {
          setError('Invalid credentials. Please contact your teacher for login details.');
        } else {
          // lookup role from users table
          const profile = await getUserProfileByIdentifier(username);
          const role = (profile && (profile.role as 'student' | 'teacher' | 'admin')) || 'student';
          onLogin(username, role);
        }
      } else {
        const isValid = await validateStudentCredentials(username, password);
        if (isValid) {
          onLogin(username, 'student');
        } else {
          setError('Invalid credentials. Please contact your teacher for login details.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('validateStudentCredentials error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-icon"><StudentCapIcon size={56} /></div>
        <h2>Student Login</h2>
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

export default StudentLogin;
