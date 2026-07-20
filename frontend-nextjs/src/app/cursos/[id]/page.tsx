import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCursoById, getCursos } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CursoDetallePage({ params }: Props) {
  const { id } = await params;
  const curso = await getCursoById(id);

  if (!curso) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium mb-6 inline-block">
          ← Volver al catálogo
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 flex items-center justify-center">
            <span className="text-6xl">⚡</span>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{curso.curso}</h1>
                <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {curso.categoria}
                </span>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                curso.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {curso.estado}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">👨‍🏫 Docente</p>
                <p className="font-bold text-gray-900">{curso.docente}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">👥 Inscritos</p>
                <p className="font-bold text-gray-900">{curso.inscritos}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">⏱️ Duración</p>
                <p className="font-bold text-gray-900">60 horas</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-500 text-sm">💰 Precio</p>
                <p className="font-bold text-purple-700 text-xl">S/ {curso.precio}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://reactportal-estudiantes.vercel.app/login"
                className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                📝 Inscribirme ahora
              </a>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Ver más cursos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
