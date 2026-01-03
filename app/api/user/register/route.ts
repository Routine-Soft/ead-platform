import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';

export async function POST(request: NextRequest) {
    try {
        await db();

        const { name, email, password, phone, username } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar duplicidades globais (single tenant)
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 409 }
            );
        }

        if (username) {
            const existingUsername = await userModel.findOne({ username });
            if (existingUsername) {
                return NextResponse.json(
                    { error: 'Username já cadastrado' },
                    { status: 409 }
                );
            }
        }

        // Criar usuário
        const newUser = new userModel({
            name,
            email,
            password,
            phone,
            username
        });

        await newUser.save();

        // Remover campos sensíveis
        const userClean = newUser.toObject();
        delete userClean.password;
        delete userClean.token;
        delete userClean.resetPasswordToken;
        delete userClean.resetPasswordExpires;

        return NextResponse.json(
            {
                message: 'Usuário criado com sucesso',
                user: userClean
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro no registro:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
