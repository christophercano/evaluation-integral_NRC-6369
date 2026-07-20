const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cursos',
        required: true
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ['Activa', 'Completada', 'Cancelada'],
        default: 'Activa'
    }
}, {
    timestamps: true
});

inscripcionSchema.index({ usuario: 1, curso: 1 }, { unique: true });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);
