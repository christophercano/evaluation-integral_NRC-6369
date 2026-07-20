/**
 * Controlador de gestión de usuarios (CRUD).
 * 
 * Este módulo gestiona las operaciones administrativas sobre los usuarios
 * registrados en el sistema. Permite listar, consultar perfiles, actualizar
 * y eliminar usuarios. Incluye seguridad para no exponer contraseñas en las respuestas.
 * 
 * Requiere autenticación previa (middleware JWT) y control de roles (Admin).
 */

// Importa bcryptjs para posibles operaciones de encriptación (importado aunque no se use en este archivo)
const bcrypt = require('bcryptjs');
// Importa el modelo de usuarios para interactuar con la colección en MongoDB
const Usuario = require('../models/usuario');

// ==================== GET - Admin: listar todos los usuarios ====================
// Obtiene y devuelve el listado completo de usuarios registrados (sin mostrar contraseñas)
exports.listar = async (req, res) => {
    try {
        // Consulta todos los usuarios en la base de datos
        // .select('-password') excluye el campo 'password' de los resultados por seguridad
        const usuarios = await Usuario.find().select('-password');
        
        // Devuelve el array de usuarios sin sus contraseñas
        res.json(usuarios);
    } catch (error) {
        // Muestra el error en consola para depuración
        console.error('Error al listar usuarios:', error);
        // Responde con error genérico del servidor
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== GET - Obtener perfil del usuario autenticado ====================
// Devuelve los datos del perfil del usuario que está actualmente logueado
exports.perfil = async (req, res) => {
    try {
        // Busca al usuario por el ID extraído del token JWT (req.usuario.id)
        // Excluye el campo 'password' de la respuesta por seguridad
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        
        // Si el usuario no existe en la base de datos, responde con error 404
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        // Devuelve los datos del perfil del usuario autenticado
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== PUT - Admin: actualizar usuario ====================
// Permite al administrador modificar los datos de cualquier usuario por su ID
exports.actualizar = async (req, res) => {
    try {
        // Obtiene el ID del usuario a actualizar desde los parámetros de la URL
        const { id } = req.params;
        // Extrae los campos que se desean actualizar del cuerpo de la petición
        const { nombre, email, rol } = req.body;

        // Busca el usuario en la base de datos
        const usuario = await Usuario.findById(id);
        
        // Si no existe el usuario, responde con error 404
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Actualiza solo los campos que fueron proporcionados en la petición (validación parcial)
        if (nombre) usuario.nombre = nombre;   // Actualiza el nombre si se envió
        if (email) usuario.email = email;       // Actualiza el email si se envió
        if (rol) usuario.rol = rol;             // Actualiza el rol si se envió

        // Guarda los cambios en la base de datos
        await usuario.save();

        // Convierte el documento a objeto plano y extrae todos los campos excepto la contraseña
        // Esto asegura que la contraseña nunca se incluya en la respuesta
        const { password, ...usuarioSinPassword } = usuario.toObject();
        
        // Responde confirmando la actualización y devolviendo los datos actualizados (sin password)
        res.json({ mensaje: 'Usuario actualizado', usuario: usuarioSinPassword });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== DELETE - Admin: eliminar usuario ====================
// Permite al administrador eliminar un usuario del sistema por su ID
exports.eliminar = async (req, res) => {
    try {
        // Obtiene el ID del usuario a eliminar desde los parámetros de la URL
        const { id } = req.params;

        // Busca y elimina el usuario directamente en una sola operación
        const usuario = await Usuario.findByIdAndDelete(id);
        
        // Si no se encontró el usuario, responde con error 404
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Confirma que el usuario fue eliminado exitosamente
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};