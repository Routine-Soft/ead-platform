import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import provaModel from '@/models/prova';

// ------------------------------------------------
// GET — Listar todas as provas (single tenant)
// ------------------------------------------------
export async function GET() {
    try {
        await db();

        const provas = await provaModel
            .find()
            .populate('cursoId', 'titulo')
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { message: 'Provas listadas com sucesso', provas },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro ao listar provas:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// ------------------------------------------------
// POST — Criar nova prova (single tenant)
// ------------------------------------------------
export async function POST(request: NextRequest) {
    try {
        await db();

        const { titulo, descricao, cursoId, tempoLimite, questoes } =
            await request.json();

        if (!titulo) {
            return NextResponse.json(
                { error: 'O título da prova é obrigatório' },
                { status: 400 }
            );
        }

        const newProva = new provaModel({
            titulo,
            descricao,
            cursoId,
            tempoLimite,
            questoes: questoes || []
        });

        await newProva.save();

        return NextResponse.json(
            { message: 'Prova criada com sucesso', prova: newProva },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro ao criar prova:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
