const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

// GET - Admin: listar todos los usuarios
exports.listar = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET - Obtener perfil del usuario autenticado
exports.perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// PUT - Admin: actualizar usuario
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (nombre) usuario.nombre = nombre;
        if (email) usuario.email = email;
        if (rol) usuario.rol = rol;

        await usuario.save();

        const { password, ...usuarioSinPassword } = usuario.toObject();
        res.json({ mensaje: 'Usuario actualizado', usuario: usuarioSinPassword });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// DELETE - Admin: eliminar usuario
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByIdAndDelete(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
