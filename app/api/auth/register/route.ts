import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import userModel from '@/models/user';
import argon2 from 'argon2';

export async function POST(request: NextRequest) {
    try {
        await db();

        const { name, email, password } = await request.json();

        // Validação básica
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Nome, email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar duplicidade
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já registrado' },
                { status: 409 }
            );
        }

        // Criptografar senha
        const hashedPassword = await argon2.hash(password);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            // sem tenantId → este é o registro global
        });

        await newUser.save();

        // Remover campos sensíveis
        const userClean = newUser.toObject();
        delete userClean.password;

        return NextResponse.json(
            { message: 'Usuário criado com sucesso', user: userClean },
            { status: 201 }
        );

    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
