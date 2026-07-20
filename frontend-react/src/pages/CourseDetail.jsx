import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [yaInscrito, setYaInscrito] = useState(false);

  useEffect(() => {
    cargarCurso();
    if (usuario) {
      verificarInscripcion();
    }
  }, [id]);

  const cargarCurso = async () => {
    try {
      const { data } = await api.get('/cursos');
      const encontrado = data.find((c) => c._id === id);
      setCurso(encontrado);
    } catch (err) {
      console.error('Error al cargar curso:', err);
    } finally {
      setLoading(false);
    }
  };

  const verificarInscripcion = async () => {
    try {
      const { data } = await api.get('/inscripciones/mis');
      const inscrito = data.some((ins) => ins.curso?._id === id);
      setYaInscrito(inscrito);
    } catch (err) {
      console.error('Error al verificar inscripción:', err);
    }
  };

  const handleInscribir = async () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    setInscribiendo(true);
    setMensaje('');

    try {
      await api.post('/inscripciones', { cursoId: id });
      setMensaje('✅ ¡Te has inscrito correctamente!');
      setYaInscrito(true);
    } catch (err) {
      setMensaje('❌ ' + (err.response?.data?.mensaje || 'Error al inscribirse'));
    } finally {
      setInscribiendo(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando curso...</div>;
  }

  if (!curso) {
    return <div className="loading">Curso no encontrado</div>;
  }

  return (
    <div className="detail-container">
      <Link to="/catalogo" className="back-link">← Volver al catálogo</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-icon">⚡</div>
          <div>
            <h1>{curso.curso}</h1>
            <p className="detail-category">{curso.categoria}</p>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-info">
            <div className="info-item">
              <span className="info-label">👨‍🏫 Docente</span>
              <span>{curso.docente}</span>
            </div>
            <div className="info-item">
              <span className="info-label">👥 Inscritos</span>
              <span>{curso.inscritos} estudiantes</span>
            </div>
            <div className="info-item">
              <span className="info-label">📊 Estado</span>
              <span className="badge badge-success">{curso.estado}</span>
            </div>
            <div className="info-item price-item">
              <span className="info-label">💰 Precio</span>
              <span className="price">S/ {curso.precio}</span>
            </div>
          </div>

          {mensaje && (
            <div className={mensaje.startsWith('✅') ? 'success-message' : 'error-message'}>
              {mensaje}
            </div>
          )}

          {yaInscrito ? (
            <div className="already-enrolled">
              ✅ Ya estás inscrito en este curso
            </div>
          ) : (
            <button
              onClick={handleInscribir}
              className="btn-primary btn-lg"
              disabled={inscribiendo}
            >
              {inscribiendo ? 'Inscribiendo...' : '📝 Inscribirme ahora'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
