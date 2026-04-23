import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getLoginError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        return 'Invalid email or password. Please try again.';
      }
      return err.response.data?.message || 'Server error. Please try again later.';
    }

    if (err.code === 'ECONNABORTED') {
      return 'The server is taking too long to respond. Please wait a moment and try again.';
    }

    return 'Backend is not reachable. Please check your connection or wait a moment.';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');
    setLoading(true);

    const wakeupTimer = window.setTimeout(() => {
      setStatusMessage('Server is waking up, please wait...');
    }, 1800);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getLoginError(err));
    } finally {
      clearTimeout(wakeupTimer);
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="glass-card">
      <h1>Welcome Back</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Log in to your student dashboard
      </p>

      {error && <div className="error-msg">{error}</div>}
      {statusMessage && (
        <div className="login-status">
          <span className="loader" />
          <p>{statusMessage}</p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </div>
    </div>
  );
};

export default Login;
