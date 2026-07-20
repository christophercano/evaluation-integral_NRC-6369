import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getCursos() {
  try {
    const res = await fetch('https://edutech-api-ykso.onrender.com/api/cursos', {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const cursos = await getCursos();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            🎓 Edu<em className="text-purple-400 not-italic">Tech</em>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Plataforma de gestión de cursos e inscripciones.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="#catalogo" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold transition">
              Ver catálogo
            </Link>
            <Link href="https://reactportal-estudiantes.vercel.app/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition border border-white/20">
              Portal estudiante
            </Link>
          </div>
        </div>
      </section>

      <section id="catalogo" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📚 Catálogo de Cursos</h2>
        <p className="text-gray-600 mb-8">
          Datos obtenidos con <strong>Server-Side Rendering (SSR)</strong> desde el backend en Render.
        </p>

        {cursos.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Cargando cursos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map((curso: any) => (
              <div key={curso._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
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
                  <Link href={`/cursos/${curso._id}`} className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition">
                    Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        EduTech © {new Date().getFullYear()} — Proyecto Full Stack · Programación Web II
      </footer>
    </div>
  );
}
