import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Curso {
  _id: string;
  curso: string;
  docente: string;
  categoria: string;
  inscritos: string;
  precio: string;
  estado: string;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export async function getCursos(): Promise<Curso[]> {
  const { data } = await api.get<Curso[]>('/cursos');
  return data;
}

export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    const cursos = await getCursos();
    return cursos.find((c) => c._id === id) || null;
  } catch {
    return null;
  }
}

export async function getCursosActivos(): Promise<Curso[]> {
  const cursos = await getCursos();
  return cursos.filter((c) => c.estado === 'Activo');
}
