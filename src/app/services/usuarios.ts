import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UsuarioModel {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = 'https://edutech-api-ykso.onrender.com/api/usuarios';

  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  actualizar(id: string, datos: Partial<UsuarioModel>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos, {
      headers: this.getHeaders(),
    });
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
