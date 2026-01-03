import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import useradminModel from '@/models/useradmin';

export async function POST(request: NextRequest) {
    try {
        await db();

        // 1. Obter dados do body
        const { name, email, password, phone, username } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // 2. Verificar se email já existe
        const existingEmail = await useradminModel.findOne({ email });

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email já cadastrado' },
                { status: 409 }
            );
        }

        // 3. Verificar username duplicado (se existir)
        if (username) {
            const existingUser = await useradminModel.findOne({ username });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Username já cadastrado' },
                    { status: 409 }
                );
            }
        }

        // 4. Criar usuário admin
        const newUseradmin = new useradminModel({
            name,
            email,
            password,
            phone,
            username
        });

        await newUseradmin.save();

        // 5. Remover campos sensíveis
        const userClean = newUseradmin.toObject();
        delete userClean.password;
        delete userClean.token;
        delete userClean.resetPasswordToken;
        delete userClean.resetPasswordExpires;

        return NextResponse.json(
            {
                message: 'Usuário admin criado com sucesso',
                useradmin: userClean
            },
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error(error);

        return NextResponse.json(
            { error: 'Erro interno do servidor', details: (error as Error).message },
            { status: 500 }
        );
    }
}
