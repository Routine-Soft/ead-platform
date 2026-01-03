import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import provaModel from '@/models/prova';

// ---------------------------------------------------------
// GET - Buscar prova por ID (single tenant)
// ---------------------------------------------------------
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db();

        const { id } = params;

        const prova = await provaModel
            .findById(id)
            .populate('cursoId', 'titulo');

        if (!prova) {
            return NextResponse.json(
                { error: 'Prova não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Prova encontrada', prova },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao buscar prova:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// ---------------------------------------------------------
// PATCH - Atualizar prova (single tenant)
// ---------------------------------------------------------
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params;  // <-- CORREÇÃO AQUI

        const updates = await request.json();

        const prova = await provaModel.findById(id);

        if (!prova) {
            return NextResponse.json(
                { error: 'Prova não encontrada' },
                { status: 404 }
            );
        }

        Object.assign(prova, updates);

        await prova.save();

        return NextResponse.json(
            { message: 'Prova atualizada com sucesso', prova },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao atualizar prova:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}


// ---------------------------------------------------------
// DELETE - Deletar prova (single tenant)
// ---------------------------------------------------------
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params; // <-- CORREÇÃO AQUI

        const deleted = await provaModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Prova não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Prova deletada com sucesso' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao deletar prova:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

