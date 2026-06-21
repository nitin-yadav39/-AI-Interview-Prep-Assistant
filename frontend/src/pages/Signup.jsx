import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import ThemeToggle from '../components/ThemeToggle';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/signup', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Error signing up');
    }
  };

  return (
    <div className="page-center page-enter">
      <div className="auth-shell">
        <aside className="auth-aside">
          <span className="badge">AI Interviewer</span>
          <h1 className="auth-aside-title">Create your profile</h1>
          <p className="text-caption text-muted mt-2">
            Your details help personalize the dashboard and keep a history of your interview
            sessions.
          </p>
        </aside>

        <main className="auth-main">
          <div className="row" style={{ marginBottom: 8 }}>
            <div className="stack stack-sm">
              <h2 className="text-heading">Sign up</h2>
              <p className="text-caption text-muted">It only takes a minute.</p>
            </div>
            <ThemeToggle />
          </div>

          <form onSubmit={handleSubmit} className="stack mt-2">
            <div className="form-row">
              <div className="field-group">
                <label className="label" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Alex"
                  className="field"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="field-group">
                <label className="label" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Smith"
                  className="field"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

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
                placeholder="Create a strong password"
                className="field"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <span className="hint">Use at least 8 characters for best security.</span>
            </div>

            <button type="submit" className="btn btn-primary btn-wide btn-lg">
              Sign Up
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
