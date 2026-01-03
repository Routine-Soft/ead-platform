import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';
import argon2 from 'argon2';

export async function POST(request: NextRequest) {
    try {
        await db();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuário no sistema (single tenant)
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Verificar senha
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Remover dados sensíveis
        const userClean = user.toObject();
        delete userClean.password;
        delete userClean.token;
        delete userClean.resetPasswordToken;
        delete userClean.resetPasswordExpires;

        return NextResponse.json(
            {
                message: 'Login realizado com sucesso',
                user: userClean
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erro no login:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
