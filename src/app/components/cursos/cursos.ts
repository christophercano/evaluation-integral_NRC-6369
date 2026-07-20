import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  CursosModel,
  CursosService
} from '../../services/cursos';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class Cursos implements OnInit {

  cursos = signal<CursosModel[]>([]);

  private cursoService = inject(CursosService);
  private fb = inject(FormBuilder);

  cursoForm = this.fb.nonNullable.group({
    curso: ['', Validators.required],
    docente: ['', Validators.required],
    categoria: ['', Validators.required],
    inscritos: ['0', Validators.required],
    precio: ['', Validators.required],
    estado: ['Activo', Validators.required]
  });

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cursoService.getCurso().subscribe({
      next: (data) => {
        console.log('Cursos recibidos:', data);
        this.cursos.set(data);
      },
      error: (error) => {
        console.error('Error al obtener cursos:', error);
      }
    });
  }

  guardarCurso(): void {

    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    const nuevoCurso = this.cursoForm.getRawValue();

    this.cursoService.crearCurso(nuevoCurso).subscribe({
      next: () => {
        alert('Curso registrado correctamente');

        this.limpiarFormulario();

        this.cargarCursos();
      },
      error: (error) => {
        console.error('Error al registrar el curso:', error);
        alert('No se pudo registrar el curso');
      }
    });
  }

  limpiarFormulario(): void {
    this.cursoForm.reset({
      curso: '',
      docente: '',
      categoria: '',
      inscritos: '0',
      precio: '',
      estado: 'Activo'
    });
  }
}