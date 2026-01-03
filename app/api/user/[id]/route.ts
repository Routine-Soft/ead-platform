import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';

// -----------------------------------
// GET — Buscar usuário por ID
// -----------------------------------
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db();

        const { id } = params;

        const user = await userModel.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Usuário encontrado', user },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// -----------------------------------
// PATCH — Atualizar usuário
// -----------------------------------
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params; // <--- CORREÇÃO

        const data = await request.json();

        const user = await userModel.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        if (data.name !== undefined) user.name = data.name;
        if (data.email !== undefined) user.email = data.email;
        if (data.phone !== undefined) user.phone = data.phone;
        if (data.username !== undefined) user.username = data.username;

        await user.save();

        return NextResponse.json(
            { message: 'Usuário atualizado com sucesso', user },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}


// -----------------------------------
// DELETE — Remover usuário
// -----------------------------------
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await db();

        const { id } = await context.params; // <--- CORREÇÃO

        const deleted = await userModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Usuário deletado com sucesso' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

