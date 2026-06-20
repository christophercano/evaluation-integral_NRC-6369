const express = require('express');
const routes = express.Router();

const {
    crear,
    listar,
    actualizar,
    eliminar
} = require('../controllers/cursoController');

routes.post('/cursos', crear);
routes.get('/cursos', listar);
routes.put('/cursos/:id', actualizar);
routes.delete('/cursos/:id', eliminar);

module.exports = routes;