import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cursos } from './components/cursos/cursos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cursos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cursos-angular-ei');
}
