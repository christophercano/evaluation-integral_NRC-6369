import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuariosService, UsuarioModel } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios = signal<UsuarioModel[]>([]);
  usuarioEditandoId: string | null = null;
  mensajeExito = signal('');

  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);

  usuarioForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['ESTUDIANTE', Validators.required],
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  guardarUsuario(): void {
    if (this.usuarioForm.invalid || !this.usuarioEditandoId) return;

    this.usuariosService
      .actualizar(this.usuarioEditandoId, this.usuarioForm.getRawValue())
      .subscribe({
        next: () => {
          this.mensajeExito.set('Usuario actualizado correctamente');
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('No se pudo actualizar el usuario');
        },
      });
  }

  editarUsuario(usuario: UsuarioModel): void {
    this.usuarioEditandoId = usuario._id;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
  }

  eliminarUsuario(id: string): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.usuariosService.eliminar(id).subscribe({
      next: () => {
        this.mensajeExito.set('Usuario eliminado');
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar');
      },
    });
  }

  limpiarFormulario(): void {
    this.usuarioEditandoId = null;
    this.usuarioForm.reset({ nombre: '', email: '', rol: 'ESTUDIANTE' });
  }
}
