import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

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

        // Buscar usuário com password
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Verificar senha
        const passwordMatch = await argon2.verify(user.password, password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Gerar token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            SECRET,
            { expiresIn: '100h' }
        );

        // Remover dados sensíveis
        const userClean = user.toObject();
        delete userClean.password;

        return NextResponse.json(
            {
                message: 'Login realizado com sucesso',
                token,
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
