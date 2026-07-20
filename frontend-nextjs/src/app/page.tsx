import Link from 'next/link';
import { getCursosActivos, Curso } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let cursos: Curso[] = [];
  let error = '';

  try {
    cursos = await getCursosActivos();
  } catch {
    error = 'No se pudieron cargar los cursos.';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            🎓 Edu<em className="text-purple-400 not-italic">Tech</em>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Plataforma de gestión de cursos e inscripciones. Explora nuestro catálogo y potencia tu carrera profesional.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="#catalogo"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Ver catálogo
            </Link>
            <Link
              href="http://localhost:5173/login"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition border border-white/20"
            >
              Portal estudiante
            </Link>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 Catálogo de Cursos</h2>
        <p className="text-gray-600 mb-8">
          Cursos generados con <strong>Server-Side Rendering (SSR)</strong> — datos frescos en cada solicitud.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <div
              key={curso._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{curso.curso}</h3>
                <p className="text-gray-500 text-sm mb-3">👨‍🏫 {curso.docente}</p>
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {curso.categoria}
                </span>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>👥 {curso.inscritos} inscritos</span>
                  <span className="text-purple-700 font-bold text-lg">S/ {curso.precio}</span>
                </div>
                <Link
                  href={`/cursos/${curso._id}`}
                  className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>

        {cursos.length === 0 && !error && (
          <p className="text-center text-gray-500 py-12">No hay cursos disponibles en este momento.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        EduTech © {new Date().getFullYear()} — Proyecto integrador full stack · Programación Web II
      </footer>
    </div>
  );
}
