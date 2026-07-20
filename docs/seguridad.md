# Checklist de Seguridad

## Medidas implementadas

| # | Medida | Estado | Detalle |
|---|--------|--------|---------|
| 1 | **HTTPS** | ⚠️ Local | En producción Vercel/Render proveen HTTPS automático |
| 2 | **CORS restringido** | ⚠️ Dev | `cors()` abierto en desarrollo; se restringirá en prod |
| 3 | **Helmet** | ✅ | Headers de seguridad HTTP configurados |
| 4 | **JWT** | ✅ | Tokens firmados con secreto, expiración 2h |
| 5 | **bcrypt** | ✅ | 10 rondas de salt para hash de contraseñas |
| 6 | **Validación de entradas** | ✅ | Validaciones en frontend (formularios reactivos) y backend (Mongoose required) |
| 7 | **Protección XSS** | ✅ | Helmet + React/Angular escapan contenido por defecto |
| 8 | **Rate limiting** | ❌ | Pendiente implementar (express-rate-limit) |
| 9 | **Input sanitization** | ⚠️ | Mongoose validations; falta sanitización explícita |
| 10 | **Variables de entorno** | ✅ | `.env` no se sube a GitHub; existe `.env.example` |
| 11 | **Body limit** | ✅ | `express.json({ limit: '10kb' })` |
| 12 | **Protección de rutas** | ✅ | Guards en Angular, ProtectedRoute en React, middlewares en Express |
| 13 | **MongoDB Atlas whitelist** | ⚠️ | Configurar IP whitelist en Atlas |
| 14 | **CSRF** | ❌ | Pendiente para endpoints state-changing |
| 15 | **Lighthouse** | ⚠️ | Pendiente generar reporte en producción |

## Variables de entorno (`.env.example`)

```
MONGO_URI=mongodb://127.0.0.1:27017/cursosdb
JWT_SECRET=edutech_jwt_2026_seguro
PORT=3000
```

> Nota: Los secretos reales **nunca** se suben al repositorio.
