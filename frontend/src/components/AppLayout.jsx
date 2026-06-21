import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function AppLayout({ title, subtitle, children, actions }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-page page-enter">
      <div className="container">
        <header className="navbar">
          <div className="navbar-brand">
            <span className="navbar-brand-title">{title}</span>
            {subtitle && <span className="navbar-brand-sub">{subtitle}</span>}
          </div>
          <div className="navbar-actions">
            {actions}
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

export function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to} className={`nav-link${active ? ' active' : ''}`}>
      {children}
    </Link>
  );
}

export default AppLayout;
