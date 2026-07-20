import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
    mensaje: string;
    token: string;
    usuario: {
        id: string;
        nombre: string;
        email: string;
        rol: string;
    };
    }

    @Injectable({
    providedIn: 'root'
    })
    export class AuthService {

    private http = inject(HttpClient);

    private apiUrl = 'https://edutech-api-ykso.onrender.com/api/auth';

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http
        .post<LoginResponse>(`${this.apiUrl}/login`, {
            email,
            password
        })
        .pipe(
            tap((respuesta) => {
            localStorage.setItem('token', respuesta.token);
            localStorage.setItem(
                'usuario',
                JSON.stringify(respuesta.usuario)
            );
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    estaAutenticado(): boolean {
        return !!this.getToken();
    }

    getUsuario(): LoginResponse['usuario'] | null {
        const usuario = localStorage.getItem('usuario');

        return usuario
        ? JSON.parse(usuario)
        : null;
    }
}