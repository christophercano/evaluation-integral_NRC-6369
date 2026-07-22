# 🎓 EduTech - Plataforma de Gestión de Cursos e Inscripciones

Proyecto integrador full stack para la Evaluación Integral Final de **Programación Web II**.

---

## 📋 Integrantes

| Nombre                        | Rol                                   | Aporte                                            |
| ----------------------------- | ------------------------------------- | ------------------------------------------------- |
| Mario Yonatan Haro Agreda     | Frontend Developer (Angular)          | Angular Admin Panel                               |
| Karlo Andre Vergara Caballero | Backend Developer                     | Backend Express + MongoDB                         |
| Christopher Lenin Cano Romero | Frontend Developer (React)            | React Student Portal                              |
| Alexis chagua Cueva           | Frontend Developer (Next.js) / DevOps | Next.js + Despliegue                              |
| Erick Borda Roman             | Full Stack Developer                  | Inscripciones (backend + panel admin) y Seguridad |

---

## 🎯 Problema y Objetivos

**Problema:** Las instituciones educativas necesitan una plataforma para gestionar su catálogo de cursos y permitir a los estudiantes explorar e inscribirse de forma digital.

**Objetivos:**

- Panel administrativo (Angular) para CRUD de cursos y usuarios
- Portal del estudiante (React) para catálogo, inscripción y dashboard
- Vista pública (Next.js) con SSR para SEO y rendimiento
- API REST segura con JWT, roles y MongoDB Atlas

---

## 🏗️ Arquitectura

```
MongoDB Atlas ←→ Express API (:3000) ←→ ┌─ Angular Admin (:4200)
                                         ├─ React Estudiante (:5173)
                                         └─ Next.js Público (:3001)
```

- **Backend:** Node.js + Express 5 + Mongoose 9
- **Frontend Admin:** Angular 21 (TypeScript, formularios reactivos, guards)
- **Frontend Estudiante:** React 19 + Vite (Context API, React Router, Axios)
- **Frontend Público:** Next.js 16 (SSR con `force-dynamic`, Tailwind CSS)
- **Base de datos:** MongoDB Atlas
- **Autenticación:** JWT + bcryptjs con roles ADMIN/ESTUDIANTE

---

## 🚀 URLs Desplegadas

| Servicio            | Local                     | Producción | Public URL                                                                                        |
| ------------------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Backend API Express | `http://localhost:3000` | Render      | [edutech-api-ykso.onrender.com/api/cursos](https://edutech-api-ykso.onrender.com/api/cursos)       |
| Angular Admin       | `http://localhost:4200` | Vercel      | [angularpanel-admin.vercel.app](https://angularpanel-admin.vercel.app/login)                       |
| React Estudiante    | `http://localhost:5173` | Vercel      | [reactportal-estudiantes.vercel.app/catalogo](https://reactportal-estudiantes.vercel.app/catalogo) |
| Next.js Público    | `http://localhost:3001` | Vercel      | [nextjsvista-publica.vercel.app](https://nextjsvista-publica.vercel.app/)                          |

---

## 📦 Instalación

### Requisitos

- Node.js ≥ 18
- pnpm (Angular y Backend)
- npm (React y Next.js)

### 1. Clonar repositorio

```bash
git clone https://github.com/christophercano/evaluation-integral_NRC-6369
cd evaluation-integral_NRC-6369
```

### 2. Backend

```bash
cd backend-express
pnpm install
cp .env.example .env   # Configurar MONGO_URI y JWT_SECRET
node server.js          # http://localhost:3000
```

### 3. Angular (Admin)

```bash
pnpm install
pnpm start              # http://localhost:4200
```

### 4. React (Portal Estudiante)

```bash
cd frontend-react
pnpm install
pnpm dev                # http://localhost:5173
```

### 5. Next.js (Vista Pública)

```bash
cd frontend-nextjs
npm install
npm run dev             # http://localhost:3001
```

---

## 🔑 Credenciales de prueba

| Rol        | Email                      | Contraseña |
| ---------- | -------------------------- | ----------- |
| Admin      | admin@edutech.com          | admin123    |
| Estudiante | (registrarse en el portal) | -           |

> Para crear el admin: usar el endpoint `POST /api/auth/register` con `"rol": "ADMIN"`

---

## 📡 Endpoints API

Ver documentación completa en [`/docs/api-endpoints.md`](./docs/api-endpoints.md)

| Recurso       | Endpoints                                                   |
| ------------- | ----------------------------------------------------------- |
| Auth          | `POST /api/auth/register`, `POST /api/auth/login`       |
| Cursos        | `GET/POST /api/cursos`, `PUT/DELETE /api/cursos/:id`    |
| Inscripciones | `POST /api/inscripciones`, `GET /api/inscripciones/mis` |
| Usuarios      | `GET /api/usuarios`, `PUT/DELETE /api/usuarios/:id`     |

---

## 📂 Documentación adicional

- [`/docs/arquitectura.md`](./docs/arquitectura.md) - Diagrama de arquitectura y decisiones técnicas
- [`/docs/api-endpoints.md`](./docs/api-endpoints.md) - Documentación completa de la API
- [`/docs/seguridad.md`](./docs/seguridad.md) - Checklist de seguridad

---

## 🔒 Seguridad

- ✅ Helmet (headers HTTP seguros)
- ✅ JWT con expiración de 2 horas
- ✅ bcryptjs (10 rondas de salt)
- ✅ Validación en frontend y backend
- ✅ Protección de rutas por rol
- ✅ Variables de entorno (`.env.example`)
- ✅ Body limit (10kb)

---

## ▶️ Video de exposición

[🔗 Enlace al video en YouTube](https://youtube.com/...)

---

**Programación Web II** · Código 30690 · Período 202610
