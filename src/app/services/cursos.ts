import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//modelo de la base de datos
export interface CursosModel {
  _id: string;
  curso: string;
  docente: string;
  categoria: string;
  inscritos: string;
  precio: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class CursosService {

  private http = inject(HttpClient);
  private apiUrl = 'https://edutech-api-ykso.onrender.com/api/cursos';

  // Listar cursos
  getCurso(): Observable<CursosModel[]> {
  return this.http.get<CursosModel[]>(this.apiUrl);
}

  // Crear curso
  crearCurso(curso: Omit<CursosModel, '_id'>): Observable<CursosModel> {
  return this.http.post<CursosModel>(
    this.apiUrl,
    curso,
    { headers: this.getHeaders() }
  );
}

actualizarCurso(
  id: string,
  curso: Partial<CursosModel>
): Observable<CursosModel> {
  return this.http.put<CursosModel>(
    `${this.apiUrl}/${id}`,
    curso,
    { headers: this.getHeaders() }
  );
}

eliminarCurso(id: string): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    { headers: this.getHeaders() }
  );
}

  private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || '';

  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}


}