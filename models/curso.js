import mongoose, { Schema } from 'mongoose';

// Schema para Módulo
const moduloSchema = new Schema({
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    titulo: {
        type: String,
        required: [true, 'O título do módulo é obrigatório'],
        trim: true,
        maxlength: [200, 'O título não pode ter mais de 200 caracteres']
    },
    descricao: {
        type: String,
        trim: true,
        maxlength: [1000, 'A descrição não pode ter mais de 1000 caracteres']
    },
    ordem: {
        type: Number,
        default: 0
    },
    conteudo: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Schema para Curso
const cursoSchema = new Schema({
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    titulo: {
        type: String,
        required: [true, 'O título do curso é obrigatório'],
        trim: true,
        maxlength: [200, 'O título não pode ter mais de 200 caracteres']
    },
    descricao: {
        type: String,
        trim: true,
        maxlength: [2000, 'A descrição não pode ter mais de 2000 caracteres']
    },
    categoria: {
        type: String,
        trim: true
    },
    duracao: {
        type: Number, // em horas
        min: [0, 'A duração não pode ser negativa']
    },
    preco: {
        type: Number,
        min: [0, 'O preço não pode ser negativo'],
        default: 0
    },
    imagem: {
        type: String,
        trim: true
    },
    ativo: {
        type: Boolean,
        default: true
    },
    modulos: [moduloSchema]
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            return ret;
        }
    }
});

// Exportando o Model
const cursoModel = mongoose.model('cursoModel', cursoSchema);

export default cursoModel;

