const express = require('express');
const routes = express.Router();

const {
    listar,
    perfil,
    actualizar,
    eliminar
} = require('../controllers/usuarioController');

const {
    verificarToken,
    soloAdmin
} = require('../middlewares/authMiddleware');

// Perfil del usuario autenticado
routes.get('/perfil', verificarToken, perfil);

// Admin: listar todos los usuarios
routes.get('/', verificarToken, soloAdmin, listar);

// Admin: actualizar usuario
routes.put('/:id', verificarToken, soloAdmin, actualizar);

// Admin: eliminar usuario
routes.delete('/:id', verificarToken, soloAdmin, eliminar);

module.exports = routes;
