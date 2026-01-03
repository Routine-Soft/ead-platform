import mongoose, { Schema } from 'mongoose';
import argon2 from 'argon2';

// Definindo o Schema
const useradminSchema = new Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório']
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true, // Permite múltiplos documentos sem username
    },
    phone: {
        type: String,
        trim: true,
        // match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Por favor, insira um número de telefone válido']
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        // match: [/^\S+@\S+\.\S+$/, 'Por favor, insira um email válido']
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória'],
    },
    token: {
        type: String,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    },
    // tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }

}, { 
    timestamps: true,
});

// Middleware de hashing de senha antes de salvar
useradminSchema.pre('save', async function () {
    // Só faz hash se a senha foi modificada
    if (!this.isModified('password')) return;
    
    try {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id
        });
    } catch (error) {
        throw error;
    }
});

const useradminModel = mongoose.models.useradmin || mongoose.model('useradmin', useradminSchema);
export default useradminModel;
