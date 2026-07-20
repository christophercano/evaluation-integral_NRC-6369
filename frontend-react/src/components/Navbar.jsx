import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 Edu<em>Tech</em>
          {usuario?.rol === 'ADMIN' && <span className="admin-badge">ADMIN</span>}
        </Link>

        <ul className="navbar-links">
          <li><Link to="/catalogo">📚 Catálogo</Link></li>
          {usuario ? (
            <>
              <li><Link to="/dashboard">📋 Mis Cursos</Link></li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  🚪 Cerrar sesión
                </button>
              </li>
              <li className="user-info-nav">
                <span className="avatar">👤</span>
                <span>{usuario.nombre}</span>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">🔐 Iniciar sesión</Link></li>
              <li><Link to="/register" className="btn-register">📝 Registrarse</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
