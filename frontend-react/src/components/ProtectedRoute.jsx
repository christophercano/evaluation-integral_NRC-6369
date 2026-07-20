import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Cargando...</p>
    </div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && usuario.rol !== 'ADMIN') {
    return <Navigate to="/catalogo" replace />;
  }

  return children;
}
