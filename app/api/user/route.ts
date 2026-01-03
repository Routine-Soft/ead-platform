import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';

export async function GET(request: NextRequest) {
    try {
        await db();

        // Busca TODOS os usuários (single tenant)
        const users = await userModel.find().sort({ createdAt: -1 });

        return NextResponse.json(
            {
                message: 'Usuários listados com sucesso',
                users
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao listar usuários:', error);

        return NextResponse.json(
            {
                error: 'Erro interno do servidor'
            },
            { status: 500 }
        );
    }
}
