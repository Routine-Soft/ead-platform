import { NextRequest, NextResponse } from 'next/server';
import connectMongoDBWithMongoose from '@/database/db';
import cursoModel from '@/models/curso';

// ---------------------------------------------------------
// GET — Buscar curso por ID
// ---------------------------------------------------------
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // 👈 AGORA CORRETO

        await connectMongoDBWithMongoose();

        const curso = await cursoModel.findById(id);

        if (!curso) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Curso encontrado', curso },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao buscar curso:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}


// ---------------------------------------------------------
// PATCH — Atualizar curso
// ---------------------------------------------------------
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await connectMongoDBWithMongoose();

        const body = await request.json();
        const curso = await cursoModel.findById(id);

        if (!curso) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        Object.assign(curso, body);
        await curso.save();

        return NextResponse.json(
            { message: 'Curso atualizado com sucesso', curso },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}


// ---------------------------------------------------------
// DELETE — Deletar curso
// ---------------------------------------------------------
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await connectMongoDBWithMongoose();

        const deleted = await cursoModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Curso não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Curso deletado com sucesso' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao deletar curso:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

