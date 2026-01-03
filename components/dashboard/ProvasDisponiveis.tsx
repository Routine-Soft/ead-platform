'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
    userId: string;
};

type Prova = {
    _id: string;
    titulo: string;
    descricao?: string;
    dataDisponivel?: string;
};

export default function ProvasDisponiveis({ userId }: Props) {
    const [provas, setProvas] = useState<Prova[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProvas() {
            try {
                const res = await axios.get(`/api/user/provas?userId=${userId}`);
                setProvas(res.data.provas || []);
            } catch (error) {
                console.error('Erro ao buscar provas:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProvas();
    }, [userId]);

    if (loading) return <p>Carregando provas...</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Provas Disponíveis</h2>

            {provas.length === 0 && (
                <p className="text-gray-600">Nenhuma prova disponível no momento.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {provas.map((prova) => (
                    <div key={prova._id} className="p-4 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{prova.titulo}</h3>
                        {prova.descricao && (
                            <p className="text-gray-700 mt-2">{prova.descricao}</p>
                        )}
                        {prova.dataDisponivel && (
                            <p className="text-sm text-gray-500 mt-2">
                                Disponível em:{' '}
                                {new Date(prova.dataDisponivel).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
