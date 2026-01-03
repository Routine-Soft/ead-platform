'use client';

import React from 'react';
import CursosDisponiveis from './CursosDisponiveis';
import CursosMatriculados from './CursosMatriculados';

type Props = {
    user: {
        _id: string;
        name: string;
        email: string;
    };
};

export default function UserHome({ user }: Props) {
    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Bem-vindo, {user.name}!
                </h1>

                <p className="text-gray-700">
                    Aqui você pode visualizar todos os cursos disponíveis e os cursos em que já está matriculado.
                </p>
            </div>

            {/* CURSOS DISPONÍVEIS (EM CIMA)
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Cursos Disponíveis
                </h2>

                <CursosDisponiveis
                    userId={user._id}
                    onEstudar={() => {
                        alert('Para estudar um curso, acesse a aba "Cursos Disponíveis".');
                    }}
                />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Meus Cursos
                </h2>

                <CursosMatriculados userId={user._id} />
            </div> */}

        </div>
    );
}
