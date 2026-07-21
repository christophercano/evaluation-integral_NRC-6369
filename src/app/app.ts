import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cursos-angular-ei');

  private authService = inject(AuthService);
private router = inject(Router);

cerrarSesion(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}
