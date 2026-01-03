import { NextRequest, NextResponse } from 'next/server';
import db from '@/database/db';
import useradminModel from '@/models/useradmin';
import argon2 from 'argon2';

interface LoginUserAdminBody {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        await db();

        // Body tipado
        const { email, password } = (await request.json()) as LoginUserAdminBody;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Buscar usuario admin único do sistema (single tenant)
        const useradmin = await useradminModel
            .findOne({ email })
            .select('+password');

        if (!useradmin) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Validar senha
        const passwordOk = await argon2.verify(useradmin.password, password);

        if (!passwordOk) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // Sanitizar
        const cleanUser = useradmin.toObject();
        delete cleanUser.password;
        delete cleanUser.token;
        delete cleanUser.resetPasswordToken;
        delete cleanUser.resetPasswordExpires;

        return NextResponse.json(
            {
                message: 'Login realizado com sucesso',
                useradmin: cleanUser
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
