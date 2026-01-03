import mongoose, { Schema } from 'mongoose';

// Schema para Alternativa
const alternativaSchema = new Schema({
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    texto: {
        type: String,
        required: [true, 'O texto da alternativa é obrigatório'],
        trim: true
    },
    correta: {
        type: Boolean,
        default: false
    }
});

// Schema para Questão
const questaoSchema = new Schema({
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    enunciado: {
        type: String,
        required: [true, 'O enunciado da questão é obrigatório'],
        trim: true
    },
    tipo: {
        type: String,
        enum: ['multipla_escolha', 'verdadeiro_falso', 'dissertativa'],
        default: 'multipla_escolha'
    },
    pontuacao: {
        type: Number,
        default: 1,
        min: [0, 'A pontuação não pode ser negativa']
    },
    alternativas: [alternativaSchema]
}, { timestamps: true });

// Schema para Prova
const provaSchema = new Schema({
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    titulo: {
        type: String,
        required: [true, 'O título da prova é obrigatório'],
        trim: true,
        maxlength: [200, 'O título não pode ter mais de 200 caracteres']
    },
    descricao: {
        type: String,
        trim: true,
        maxlength: [1000, 'A descrição não pode ter mais de 1000 caracteres']
    },
    cursoId: {
        type: Schema.Types.ObjectId,
        ref: 'cursoModel',
        required: false
    },
    tempoLimite: {
        type: Number, // em minutos
        min: [0, 'O tempo limite não pode ser negativo']
    },
    pontuacaoTotal: {
        type: Number,
        default: 0
    },
    ativo: {
        type: Boolean,
        default: true
    },
    questoes: [questaoSchema]
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            return ret;
        }
    }
});

// Middleware para calcular pontuação total antes de salvar
provaSchema.pre('save', async function () {
    if (this.questoes && this.questoes.length > 0) {
        this.pontuacaoTotal = this.questoes.reduce((total, questao) => {
            return total + (questao.pontuacao || 0);
        }, 0);
    }
});


// Exportando o Model
const provaModel = mongoose.model('provaModel', provaSchema);

export default provaModel;

