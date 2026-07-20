const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();

const conectarDB = require('./config/database');
const routes = require('./routes/cursoRoutes');
const authRoutes = require('./routes/authRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({limit:'10kb'}));

async function iniciarServidor(){
    await conectarDB();
    app.use('/api', routes);
    app.use('/api/auth', authRoutes);
    app.use('/api/inscripciones', inscripcionRoutes);
    app.use('/api/usuarios', usuarioRoutes);
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () =>{
        console.log(`Servidor ejecutandose en puerto ${PORT}`)
    });
}

iniciarServidor();