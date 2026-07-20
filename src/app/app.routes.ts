import { Routes } from '@angular/router';
import { Cursos } from './components/cursos/cursos';
import { Login } from './components/login/login';
import { Usuarios } from './components/usuarios/usuarios';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'cursos',
        component: Cursos,
        canActivate: [authGuard]
    },
    {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];