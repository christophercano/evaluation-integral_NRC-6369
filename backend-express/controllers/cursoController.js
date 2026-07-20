/**
 * Controlador de cursos (CRUD).
 * 
 * Este módulo gestiona las operaciones básicas de un recurso "Curso"
 * en la base de datos MongoDB mediante Mongoose.
 * Implementa las 4 operaciones CRUD: Crear, Leer, Actualizar y Eliminar.
 */

// Importa el modelo de datos 'cursos' para interactuar con la colección en MongoDB
const cursos = require("../models/cursos");

// ==================== GET ====================
// Obtiene y devuelve la lista completa de cursos registrados
exports.listar = async(req, res) => {
    try {
        // Consulta todos los documentos de la colección 'cursos'
        const listarCursos = await cursos.find();
        
        // Devuelve el array de cursos en formato JSON
        res.json(listarCursos);
        
    } catch (error) {
        // Si ocurre un error en la consulta, responde con estado 500 (Error del servidor)
        res.status(500).json({
            error: error.message
        });
    }
}

// ==================== POST ====================
// Crea un nuevo curso con los datos recibidos en el cuerpo de la petición
exports.crear = async(req, res) => {
    try {
        // Crea un nuevo documento en la colección usando los datos enviados en req.body
        const crearCursos = await cursos.create(req.body);
        
        // Responde con estado 201 (Creado) y devuelve el curso recién creado
        res.status(201).json(crearCursos);
        
    } catch (error) {
        // Si hay error de validación o datos inválidos, responde con estado 400 (Solicitud incorrecta)
        res.status(400).json({
            error: error.message
        });
    }
}

// ==================== PUT ====================
// Actualiza un curso existente identificado por su ID
exports.actualizar = async(req, res)=>{
    try {
        // Busca el curso por el ID recibido en los parámetros de la URL (req.params.id)
        // y lo actualiza con los nuevos datos del cuerpo de la petición (req.body)
        // La opción {new: true} devuelve el documento ya actualizado, no el anterior
        const actualizarCurso = await cursos.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        
        // Devuelve el curso actualizado en formato JSON
        res.json(actualizarCurso);
        
    } catch (error) {
        // Si el ID no es válido o hay error de validación, responde con estado 400
        res.status(400).json({
            error: error.message
        });
    }
}

// ==================== DELETE ====================
// Elimina un curso existente identificado por su ID
exports.eliminar = async(req, res)=>{
    try {
        // Busca y elimina el curso por el ID recibido en los parámetros de la URL
        await cursos.findByIdAndDelete(req.params.id);
        
        // Responde confirmando que el curso fue eliminado exitosamente
        res.json({mensaje: 'Curso eliminado'});
        
    } catch (error) {
        // Si el ID no es válido o no se encuentra el curso, responde con estado 400
        res.status(400).json({
            error: error.message
        });
    }
}