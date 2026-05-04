import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

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
    <div className="page">
      <div className="card authShell">
        <aside className="authAside">
          <span className="badge">AI Interviewer</span>
          <div className="authBrand">
            <h1 className="title">Create your profile</h1>
            <p>
              Your details help personalize the dashboard and keep a history of your interview
              sessions.
            </p>
          </div>
        </aside>

        <main className="authMain">
          <div className="stack" style={{ gap: 10 }}>
            <h2>Sign up</h2>
            <div className="muted" style={{ fontSize: 14 }}>
              It only takes a minute.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 18 }}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Nitin"
                  className="field"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="label" htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Kumar"
                  className="field"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div>
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

            <div>
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
              <div className="hint">Use at least 8 characters for best security.</div>
            </div>

            <button type="submit" className="btn btn-success btn-wide">
              Sign Up
            </button>
          </form>

          <div className="authFooter">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup;
