import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import ThemeToggle from '../components/ThemeToggle';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ ...response.data.user, token: response.data.token }));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="page-center page-enter">
      <div className="auth-shell">
        <aside className="auth-aside">
          <span className="badge">AI Interviewer</span>
          <h1 className="auth-aside-title">Practice interviews with confidence</h1>
          <p className="text-caption text-muted mt-2">
            Set your role, experience, and difficulty — and start a voice-based AI interview
            session in minutes.
          </p>
        </aside>

        <main className="auth-main">
          <div className="row" style={{ marginBottom: 8 }}>
            <div className="stack stack-sm">
              <h2 className="text-heading">Login</h2>
              <p className="text-caption text-muted">Welcome back. Please enter your details.</p>
            </div>
            <ThemeToggle />
          </div>

          <form onSubmit={handleSubmit} className="stack mt-2">
            <div className="field-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="field"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                className="field"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-wide btn-lg">
              Login
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
