const express = require('express');
const routes = express.Router();

const {
    inscribir,
    misInscripciones,
    listarTodas,
    cancelar
} = require('../controllers/inscripcionController');

const {
    verificarToken,
    soloAdmin
} = require('../middlewares/authMiddleware');

// Estudiante: inscribirse
routes.post('/', verificarToken, inscribir);

// Estudiante: ver sus inscripciones
routes.get('/mis', verificarToken, misInscripciones);

// Admin: ver todas las inscripciones
routes.get('/', verificarToken, soloAdmin, listarTodas);

// Cancelar inscripción
routes.delete('/:id', verificarToken, cancelar);

module.exports = routes;
