const curso = require('../models/cursos');

exports.crear = async(req, res) => {
    try {
        const nuevo = await curso.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

exports.listar = async(req,res) => {
    try {
        const cursos = await curso.find();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

exports.actualizar = async(req, res)=>{
    try {
        const actualizado = await curso.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}

exports.eliminar = async(req, res)=>{
    try {
        await curso.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Curso eliminado'});
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}