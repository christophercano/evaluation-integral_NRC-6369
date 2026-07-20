import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cargarInscripciones = async () => {
    try {
      const { data } = await api.get('/inscripciones/mis');
      setInscripciones(data);
    } catch (err) {
      setError('Error al cargar tus inscripciones');
    } finally {
      setLoading(false);
    }
  };

  const cancelarInscripcion = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta inscripción?')) return;

    try {
      await api.delete(`/inscripciones/${id}`);
      alert('Inscripción cancelada');
      cargarInscripciones();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al cancelar');
    }
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📋 Mis Inscripciones</h1>
        <p>Bienvenido, <strong>{usuario?.nombre}</strong></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {inscripciones.length === 0 ? (
        <div className="empty-state">
          <p>📭 No tienes inscripciones activas.</p>
          <Link to="/catalogo" className="btn-primary">Explorar cursos</Link>
        </div>
      ) : (
        <div className="inscripciones-list">
          {inscripciones.map((ins) => (
            <div key={ins._id} className="inscripcion-card">
              <div className="inscripcion-info">
                <h3>{ins.curso?.curso || 'Curso no disponible'}</h3>
                <p>👨‍🏫 {ins.curso?.docente}</p>
                <span className="course-category">{ins.curso?.categoria}</span>
                <div className="inscripcion-meta">
                  <span>📅 {new Date(ins.fechaInscripcion).toLocaleDateString()}</span>
                  <span className={`badge badge-${ins.estado === 'Activa' ? 'success' : 'warning'}`}>
                    {ins.estado}
                  </span>
                </div>
              </div>
              <div className="inscripcion-actions">
                <Link to={`/curso/${ins.curso?._id}`} className="btn-secondary btn-sm">
                  Ver curso
                </Link>
                <button
                  onClick={() => cancelarInscripcion(ins._id)}
                  className="btn-danger btn-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
