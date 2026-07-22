# Documentación de API REST

## Base URL

```
http://localhost:3000/api
```

---

## 🔐 Autenticación (`/api/auth`)

### POST `/api/auth/register`

Registrar nuevo usuario.

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "password": "123456"
}
```

Respuesta: `201 Created`

```json
{ "mensaje": "Usuario registrado correctamente" }
```

### POST `/api/auth/login`

Iniciar sesión.

```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```

Respuesta: `200 OK`

```json
{
  "mensaje": "Inicio de sesión correcto",
  "token": "eyJhbG...",
  "usuario": { "id": "...", "nombre": "Juan", "email": "...", "rol": "ESTUDIANTE" }
}
```

---

## 📚 Cursos (`/api/cursos`)

| Método    | Ruta            | Auth | Rol   | Descripción            |
| ---------- | --------------- | ---- | ----- | ----------------------- |
| `GET`    | `/cursos`     | ❌   | -     | Listar todos los cursos |
| `POST`   | `/cursos`     | ✅   | ADMIN | Crear curso             |
| `PUT`    | `/cursos/:id` | ✅   | ADMIN | Actualizar curso        |
| `DELETE` | `/cursos/:id` | ✅   | ADMIN | Eliminar curso          |

---

## 📝 Inscripciones (`/api/inscripciones`)

| Método    | Ruta                   | Auth | Rol   | Descripción                |
| ---------- | ---------------------- | ---- | ----- | --------------------------- |
| `POST`   | `/inscripciones`     | ✅   | -     | Inscribirse a un curso      |
| `GET`    | `/inscripciones/mis` | ✅   | -     | Ver mis inscripciones       |
| `GET`    | `/inscripciones`     | ✅   | ADMIN | Ver todas las inscripciones |
| `DELETE` | `/inscripciones/:id` | ✅   | -     | Cancelar inscripción       |

---

## 👥 Usuarios (`/api/usuarios`)

| Método    | Ruta                 | Auth | Rol   | Descripción              |
| ---------- | -------------------- | ---- | ----- | ------------------------- |
| `GET`    | `/usuarios/perfil` | ✅   | -     | Ver mi perfil             |
| `GET`    | `/usuarios`        | ✅   | ADMIN | Listar todos los usuarios |
| `PUT`    | `/usuarios/:id`    | ✅   | ADMIN | Actualizar usuario        |
| `DELETE` | `/usuarios/:id`    | ✅   | ADMIN | Eliminar usuario          |

---

## Cabeceras de autenticación

```
Authorization: Bearer <token>
```

## Modelo de datos

### Usuario

```json
{
  "_id": "ObjectId",
  "nombre": "String (required)",
  "email": "String (required, unique)",
  "password": "String (hashed, required)",
  "rol": "ADMIN | ESTUDIANTE",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Curso

```json
{
  "_id": "ObjectId",
  "curso": "String (required)",
  "docente": "String (required)",
  "categoria": "String (required)",
  "inscritos": "String",
  "precio": "String (required)",
  "estado": "Activo | Inactivo | Borrador"
}
```

### Inscripción

```json
{
  "_id": "ObjectId",
  "usuario": "ObjectId (ref: Usuario, required)",
  "curso": "ObjectId (ref: cursos, required)",
  "fechaInscripcion": "Date",
  "estado": "Activa | Completada | Cancelada",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
