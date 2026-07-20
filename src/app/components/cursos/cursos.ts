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

  cursoEditandoId: string | null = null;

  textoBusqueda = signal('');
filtroCategoria = signal('');
filtroEstado = signal('');

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

  const datosCurso = this.cursoForm.getRawValue();

  // Si existe un ID, estamos editando un curso
  if (this.cursoEditandoId) {

    this.cursoService
      .actualizarCurso(this.cursoEditandoId, datosCurso)
      .subscribe({
        next: () => {
          alert('Curso actualizado correctamente');

          this.limpiarFormulario();
          this.cargarCursos();
        },
        error: (error) => {
          console.error('Error al actualizar el curso:', error);
          alert('No se pudo actualizar el curso');
        }
      });

  } else {

    // Si no existe ID, estamos creando un curso nuevo
    this.cursoService.crearCurso(datosCurso).subscribe({
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
}

  limpiarFormulario(): void {

    this.cursoEditandoId = null;

    this.cursoForm.reset({
      curso: '',
      docente: '',
      categoria: '',
      inscritos: '0',
      precio: '',
      estado: 'Activo'
    });
  }

  editarCurso(curso: CursosModel): void {
  this.cursoEditandoId = curso._id;

  this.cursoForm.patchValue({
    curso: curso.curso,
    docente: curso.docente,
    categoria: curso.categoria,
    inscritos: curso.inscritos,
    precio: curso.precio,
    estado: curso.estado
  });
}

eliminarCurso(id: string): void {

  const confirmar = confirm(
    '¿Estás seguro de que deseas eliminar este curso?'
  );

  if (!confirmar) {
    return;
  }

  this.cursoService.eliminarCurso(id).subscribe({
    next: () => {
      alert('Curso eliminado correctamente');
      this.cargarCursos();
    },
    error: (error) => {
      console.error('Error al eliminar el curso:', error);
      alert('No se pudo eliminar el curso');
    }
  });
}

cursosFiltrados(): CursosModel[] {
  const texto = this.textoBusqueda().toLowerCase().trim();
  const categoria = this.filtroCategoria();
  const estado = this.filtroEstado();

  return this.cursos().filter((curso) => {

    const coincideTexto =
      curso.curso.toLowerCase().includes(texto) ||
      curso.docente.toLowerCase().includes(texto) ||
      curso.categoria.toLowerCase().includes(texto);

    const coincideCategoria =
      categoria === '' ||
      curso.categoria === categoria;

    const coincideEstado =
      estado === '' ||
      curso.estado === estado;

    return coincideTexto && coincideCategoria && coincideEstado;
  });
}

}