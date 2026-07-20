# Diagrama de Arquitectura

## Estructura del proyecto

```
cursos-angular-ei/
├── backend-express/          # API REST - Node.js + Express + Mongoose
│   ├── config/database.js    # Conexión MongoDB Atlas
│   ├── controllers/          # Lógica de negocio
│   ├── middlewares/          # JWT, roles, validaciones
│   ├── models/               # Schemas Mongoose
│   ├── routes/               # Endpoints
│   └── server.js             # Punto de entrada
│
├── src/                      # Angular 21 - Panel Administrativo
│   └── app/
│       ├── components/       # Cursos, Usuarios, Login
│       ├── guards/           # authGuard (JWT)
│       └── services/         # Conexión HTTP con backend
│
├── frontend-react/           # React 19 - Portal del Estudiante
│   └── src/
│       ├── context/          # AuthContext (Context API)
│       ├── pages/            # Login, Register, Catalog, Dashboard
│       ├── components/       # Navbar, ProtectedRoute
│       └── services/         # Axios config
│
├── frontend-nextjs/          # Next.js 16 - Vista Pública (SSR)
│   └── src/
│       ├── app/              # Páginas SSR
│       └── lib/              # API client
│
└── docs/                     # Documentación técnica
```

## Diagrama de flujo

```
┌──────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                       │
│              (usuarios, cursos, inscripciones)           │
└──────────────────────┬───────────────────────────────────┘
                       │
               ┌───────┴───────┐
               │   BACKEND     │
               │ Express :3000 │
               │  JWT + Roles  │
               └───┬───┬───┬───┘
                   │   │   │
         ┌─────────┘   │   └─────────┐
         ▼             ▼             ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Angular  │ │  React   │ │ Next.js  │
   │  :4200   │ │  :5173   │ │  :3001   │
   │  ADMIN   │ │ESTUDIANTE│ │ PÚBLICO  │
   │  CRUD    │ │ Catálogo │ │   SSR    │
   │ Usuarios │ │Inscrip.  │ │ Catálogo │
   │  Cursos  │ │Dashboard │ │ Detalles │
   └──────────┘ └──────────┘ └──────────┘
```

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend Admin | Angular | 21 |
| Frontend Estudiante | React + Vite | 19 |
| Frontend Público | Next.js | 16 (Turbopack) |
| Backend | Node.js + Express | 5 |
| Base de datos | MongoDB Atlas | 9 (Mongoose) |
| Autenticación | JWT + bcryptjs | - |
| Estado global | Context API | React 19 |
| SSR/SSG | Next.js force-dynamic | App Router |

## Decisiones técnicas

1. **JWT** para autenticación stateless con expiración de 2 horas
2. **bcryptjs** con 10 rondas de salt para hash de contraseñas
3. **Context API** en React para estado global de autenticación (requisito solicitado)
4. **SSR** en Next.js con `force-dynamic` para datos frescos del backend
5. **Helmet** para headers de seguridad HTTP
6. **CORS** configurado para permitir múltiples orígenes en desarrollo
7. **Express 5** con soporte nativo para async/await en middlewares
8. **Mongoose** con índices únicos compuestos para evitar duplicados en inscripciones
