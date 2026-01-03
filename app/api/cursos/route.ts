import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import cursoModel from '@/models/curso';

// ------------------------------------------------
// GET — Listar todos os cursos (single tenant)
// ------------------------------------------------
export async function GET() {
    try {
        await db();

        const cursos = await cursoModel.find().sort({ createdAt: -1 });

        return NextResponse.json(
            { message: 'Cursos listados com sucesso', cursos },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao listar cursos:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}

// ------------------------------------------------
// POST — Criar curso (single tenant)
// ------------------------------------------------
export async function POST(request: NextRequest) {
    try {
        await db();

        const body = await request.json();

        const {
            titulo,
            descricao,
            categoria,
            duracao,
            preco,
            imagem,
            modulos
        } = body;

        if (!titulo) {
            return NextResponse.json(
                { error: 'O título do curso é obrigatório' },
                { status: 400 }
            );
        }

        const novoCurso = new cursoModel({
            titulo,
            descricao,
            categoria,
            duracao,
            preco,
            imagem,
            modulos: Array.isArray(modulos) ? modulos : [],
        });

        await novoCurso.save();

        return NextResponse.json(
            { message: 'Curso criado com sucesso', curso: novoCurso },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro ao criar curso:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
