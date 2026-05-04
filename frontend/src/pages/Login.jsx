import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
    <div className="page">
      <div className="card authShell">
        <aside className="authAside">
          <span className="badge">AI Interviewer</span>
          <div className="authBrand">
            <h1 className="title">Practice interviews with confidence</h1>
            <p>
              Set your role, experience, and difficulty — and start a voice-based AI interview
              session in minutes.
            </p>
          </div>
        </aside>

        <main className="authMain">
          <div className="stack" style={{ gap: 10 }}>
            <h2>Login</h2>
            <div className="muted" style={{ fontSize: 14 }}>
              Welcome back. Please enter your details.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="stack" style={{ marginTop: 18 }}>
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
                placeholder="••••••••"
                className="field"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-wide">
              Login
            </button>
          </form>

          <div className="authFooter">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
