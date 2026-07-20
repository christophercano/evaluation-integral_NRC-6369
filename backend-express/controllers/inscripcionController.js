/**
 * Controlador de inscripciones a cursos.
 * 
 * Este módulo gestiona el proceso de inscripción y cancelación de estudiantes
 * a cursos disponibles en el sistema. Incluye funcionalidades para:
 * - Inscribir un estudiante a un curso
 * - Consultar las inscripciones del usuario autenticado
 * - Listar todas las inscripciones (solo administradores)
 * - Cancelar una inscripción existente
 * 
 * También mantiene actualizado el contador de inscritos en cada curso.
 */

// Importa el modelo de inscripciones para gestionar las inscripciones en la base de datos
const Inscripcion = require('../models/inscripcion');
// Importa el modelo de cursos para verificar existencia de cursos y actualizar contadores
const Curso = require('../models/cursos');

// ==================== POST - Inscribir estudiante a un curso ====================
// Permite que un usuario autenticado se inscriba en un curso existente
exports.inscribir = async (req, res) => {
    try {
        // Obtiene el ID del curso desde el cuerpo de la petición
        const { cursoId } = req.body;
        // Obtiene el ID del usuario autenticado desde el middleware de autenticación (token JWT)
        const usuarioId = req.usuario.id;

        // Valida que se haya proporcionado el ID del curso
        if (!cursoId) {
            return res.status(400).json({ mensaje: 'El ID del curso es obligatorio' });
        }

        // Verifica que el curso exista en la base de datos
        const curso = await Curso.findById(cursoId);
        if (!curso) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        // Verifica que el usuario no esté ya inscrito en el mismo curso (evita duplicados)
        const yaInscrito = await Inscripcion.findOne({
            usuario: usuarioId,
            curso: cursoId
        });

        if (yaInscrito) {
            return res.status(400).json({ mensaje: 'Ya estás inscrito en este curso' });
        }

        // Crea una nueva inscripción vinculando al usuario con el curso
        const nuevaInscripcion = new Inscripcion({
            usuario: usuarioId,
            curso: cursoId
        });

        // Guarda la inscripción en la base de datos
        await nuevaInscripcion.save();

        // Incrementa el contador de inscritos del curso
        // Se convierte a número, se suma 1 y se guarda como string (según el esquema del modelo)
        const inscritosActuales = parseInt(curso.inscritos) || 0;
        curso.inscritos = String(inscritosActuales + 1);
        await curso.save();

        // Responde con éxito indicando que la inscripción se realizó correctamente
        res.status(201).json({
            mensaje: 'Inscripción realizada correctamente',
            inscripcion: nuevaInscripcion
        });

    } catch (error) {
        // Muestra el error en consola para depuración
        console.error('Error al inscribir:', error);
        // Responde con error genérico del servidor
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== GET - Listar inscripciones del usuario autenticado ====================
// Permite a un estudiante ver todos los cursos en los que está inscrito
exports.misInscripciones = async (req, res) => {
    try {
        // Obtiene el ID del usuario autenticado desde el token JWT
        const usuarioId = req.usuario.id;

        // Busca todas las inscripciones del usuario y pobla (populate) los datos del curso
        // Ordena los resultados por fecha de inscripción descendente (la más reciente primero)
        const inscripciones = await Inscripcion.find({ usuario: usuarioId })
            .populate('curso')
            .sort({ fechaInscripcion: -1 });

        // Devuelve el listado de inscripciones con la información completa del curso
        res.json(inscripciones);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== GET - Admin: listar todas las inscripciones ====================
// Permite al administrador ver todas las inscripciones del sistema con detalles de usuario y curso
exports.listarTodas = async (req, res) => {
    try {
        // Obtiene todas las inscripciones de la base de datos
        // Pobla los campos de referencia: usuario (solo nombre y email) y curso (curso, docente, categoria)
        // Ordena por fecha de inscripción descendente
        const inscripciones = await Inscripcion.find()
            .populate('usuario', 'nombre email')
            .populate('curso', 'curso docente categoria')
            .sort({ fechaInscripcion: -1 });

        // Devuelve el listado completo de inscripciones
        res.json(inscripciones);
    } catch (error) {
        console.error('Error al listar inscripciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// ==================== DELETE - Cancelar inscripción ====================
// Permite a un usuario cancelar su propia inscripción o al admin cancelar cualquiera
exports.cancelar = async (req, res) => {
    try {
        // Obtiene el ID de la inscripción desde los parámetros de la URL
        const { id } = req.params;
        // Obtiene el ID del usuario autenticado
        const usuarioId = req.usuario.id;

        // Busca la inscripción por su ID
        const inscripcion = await Inscripcion.findById(id);

        // Si no existe la inscripción, responde con error 404
        if (!inscripcion) {
            return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
        }

        // Verifica permisos: solo el dueño de la inscripción o un ADMIN pueden cancelarla
        // Compara el ID del usuario de la inscripción con el ID del usuario autenticado
        if (req.usuario.rol !== 'ADMIN' && inscripcion.usuario.toString() !== usuarioId) {
            return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta inscripción' });
        }

        // Obtiene el curso asociado para actualizar el contador de inscritos
        const curso = await Curso.findById(inscripcion.curso);
        if (curso) {
            // Decrementa el contador de inscritos, asegurándose de no bajar de 0
            const inscritosActuales = parseInt(curso.inscritos) || 1;
            curso.inscritos = String(Math.max(0, inscritosActuales - 1));
            await curso.save();
        }

        // Elimina la inscripción de la base de datos
        await Inscripcion.findByIdAndDelete(id);

        // Confirma la cancelación de la inscripción
        res.json({ mensaje: 'Inscripción cancelada correctamente' });
    } catch (error) {
        console.error('Error al cancelar inscripción:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};