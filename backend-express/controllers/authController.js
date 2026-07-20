/**
 * Controlador de autenticación para el sistema.
 * 
 * Este módulo gestiona el registro e inicio de sesión de usuarios.
 * Utiliza bcryptjs para el hash seguro de contraseñas,
 * jsonwebtoken para generar tokens de sesión JWT,
 * y el modelo Mongoose 'Usuario' para interactuar con la base de datos.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

/**
 * Función para registrar un nuevo usuario en el sistema.
 * Recibe los datos del usuario, valida que no exista previamente,
 * encripta la contraseña y guarda el registro en la base de datos.
 */
const registrar = async (req, res) => {
    try {
        // Extrae los campos del cuerpo de la petición
        const { nombre, email, password, rol } = req.body;

        // Valida que los campos obligatorios estén presentes
        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: 'Nombre, email y contraseña son obligatorios'
            });
        }

        // Verifica si ya existe un usuario con el mismo email
        const usuarioExistente = await Usuario.findOne({ email });

        // Si el email ya está registrado, devuelve error de conflicto
        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: 'El usuario ya existe'
            });
        }

        // Encripta la contraseña con bcrypt usando 10 rondas de salt
        const passwordEncriptado = await bcrypt.hash(password, 10);

        // Crea una nueva instancia del modelo Usuario con los datos recibidos
        // Si no se especifica rol, asigna 'ESTUDIANTE' por defecto
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordEncriptado,
            rol: rol || 'ESTUDIANTE'
        });

        // Guarda el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        // Responde con éxito indicando que el registro fue exitoso
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente'
        });

    } catch (error) {
        // Muestra el error en consola para depuración
        console.error('Error al registrar usuario:', error);

        // Responde con error genérico del servidor
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

/**
 * Función para iniciar sesión de un usuario existente.
 * Valida las credenciales, compara la contraseña encriptada
 * y genera un token JWT para la sesión del usuario.
 */
const login = async (req, res) => {
    try {
        // Extrae email y password del cuerpo de la petición
        const { email, password } = req.body;

        // Valida que ambos campos estén presentes
        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'Email y contraseña son obligatorios'
            });
        }

        // Busca al usuario en la base de datos por su email
        const usuario = await Usuario.findOne({ email });

        // Si no existe el usuario, devuelve error de autenticación genérico
        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Compara la contraseña ingresada con la almacenada (encriptada)
        const passwordValido = await bcrypt.compare(
            password,
            usuario.password
        );

        // Si la contraseña no coincide, devuelve error de autenticación
        if (!passwordValido) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Genera un token JWT con los datos del usuario
        // Incluye id, nombre, email y rol del usuario
        // Usa la clave secreta definida en variables de entorno
        // El token expira en 2 horas
        const token = jwt.sign(
            {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        // Responde con éxito, devolviendo el token y los datos del usuario
        res.status(200).json({
            mensaje: 'Inicio de sesión correcto',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        // Muestra el error en consola para depuración
        console.error('Error al iniciar sesión:', error);

        // Responde con error genérico del servidor
        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

// Exporta las funciones para que puedan usarse en las rutas de la aplicación
module.exports = {
    registrar,
    login
};