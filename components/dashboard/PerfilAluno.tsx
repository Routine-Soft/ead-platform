'use client';

import React from 'react';

type Props = {
    user: {
        _id: string;
        name: string;
        email: string;
    };
};

export default function PerfilAluno({ user }: Props) {
    return (
        <div className="max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>

            <div className="bg-white p-6 shadow rounded-lg">
                <p className="mb-4">
                    <strong>Nome:</strong> {user.name}
                </p>
                <p className="mb-4">
                    <strong>Email:</strong> {user.email}
                </p>

                <p className="text-gray-600 text-sm">
                    Em breve você poderá editar seus dados aqui.
                </p>
            </div>
        </div>
    );
}
