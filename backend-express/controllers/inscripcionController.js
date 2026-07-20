const Inscripcion = require('../models/inscripcion');
const Curso = require('../models/cursos');

// POST - Inscribir estudiante a un curso
exports.inscribir = async (req, res) => {
    try {
        const { cursoId } = req.body;
        const usuarioId = req.usuario.id;

        if (!cursoId) {
            return res.status(400).json({ mensaje: 'El ID del curso es obligatorio' });
        }

        const curso = await Curso.findById(cursoId);
        if (!curso) {
            return res.status(404).json({ mensaje: 'Curso no encontrado' });
        }

        const yaInscrito = await Inscripcion.findOne({
            usuario: usuarioId,
            curso: cursoId
        });

        if (yaInscrito) {
            return res.status(400).json({ mensaje: 'Ya estás inscrito en este curso' });
        }

        const nuevaInscripcion = new Inscripcion({
            usuario: usuarioId,
            curso: cursoId
        });

        await nuevaInscripcion.save();

        const inscritosActuales = parseInt(curso.inscritos) || 0;
        curso.inscritos = String(inscritosActuales + 1);
        await curso.save();

        res.status(201).json({
            mensaje: 'Inscripción realizada correctamente',
            inscripcion: nuevaInscripcion
        });

    } catch (error) {
        console.error('Error al inscribir:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET - Listar inscripciones del usuario autenticado (estudiante ve las suyas)
exports.misInscripciones = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const inscripciones = await Inscripcion.find({ usuario: usuarioId })
            .populate('curso')
            .sort({ fechaInscripcion: -1 });

        res.json(inscripciones);
    } catch (error) {
        console.error('Error al obtener inscripciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// GET - Admin: listar todas las inscripciones
exports.listarTodas = async (req, res) => {
    try {
        const inscripciones = await Inscripcion.find()
            .populate('usuario', 'nombre email')
            .populate('curso', 'curso docente categoria')
            .sort({ fechaInscripcion: -1 });

        res.json(inscripciones);
    } catch (error) {
        console.error('Error al listar inscripciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// DELETE - Cancelar inscripción
exports.cancelar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuario.id;

        const inscripcion = await Inscripcion.findById(id);

        if (!inscripcion) {
            return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
        }

        if (req.usuario.rol !== 'ADMIN' && inscripcion.usuario.toString() !== usuarioId) {
            return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta inscripción' });
        }

        const curso = await Curso.findById(inscripcion.curso);
        if (curso) {
            const inscritosActuales = parseInt(curso.inscritos) || 1;
            curso.inscritos = String(Math.max(0, inscritosActuales - 1));
            await curso.save();
        }

        await Inscripcion.findByIdAndDelete(id);

        res.json({ mensaje: 'Inscripción cancelada correctamente' });
    } catch (error) {
        console.error('Error al cancelar inscripción:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
