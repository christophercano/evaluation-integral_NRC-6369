import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Catalog() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState('');
  const { usuario } = useAuth();

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      const { data } = await api.get('/cursos');
      setCursos(data.filter(c => c.estado === 'Activo'));
    } catch (err) {
      setError('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const categorias = [...new Set(cursos.map(c => c.categoria))];

  const cursosFiltrados = cursos.filter((curso) => {
    const matchSearch =
      curso.curso.toLowerCase().includes(search.toLowerCase()) ||
      curso.docente.toLowerCase().includes(search.toLowerCase()) ||
      curso.categoria.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoria || curso.categoria === categoria;
    return matchSearch && matchCat;
  });

  if (loading) {
    return <div className="loading">Cargando catálogo...</div>;
  }

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>📚 Catálogo de Cursos</h1>
        <p>Explora nuestra oferta académica y potencia tu futuro</p>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="🔍 Buscar por nombre, docente o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="courses-grid">
        {cursosFiltrados.map((curso) => (
          <div key={curso._id} className="course-card">
            <div className="course-card-icon">⚡</div>
            <h3>{curso.curso}</h3>
            <p className="course-docente">👨‍🏫 {curso.docente}</p>
            <span className="course-category">{curso.categoria}</span>
            <div className="course-meta">
              <span>👥 {curso.inscritos} inscritos</span>
              <span className="course-price">S/ {curso.precio}</span>
            </div>
            <Link to={`/curso/${curso._id}`} className="btn-primary btn-block">
              Ver detalle
            </Link>
          </div>
        ))}
      </div>

      {cursosFiltrados.length === 0 && !loading && (
        <p className="empty-message">No se encontraron cursos.</p>
      )}
    </div>
  );
}
