import mongoose, { Schema } from "mongoose";

const matriculaSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    cursoId: {
        type: Schema.Types.ObjectId,
        ref: "cursoModel",
        required: true
    },
    status: {
        type: String,
        enum: ["pendente", "aprovado", "rejeitado"],
        default: "pendente"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const matriculaModel = mongoose.models.matriculaModel || mongoose.model("matriculaModel", matriculaSchema);
export default matriculaModel;
