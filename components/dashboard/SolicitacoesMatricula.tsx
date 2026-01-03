'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

interface Curso {
    _id: string;
    titulo: string;
}

interface Usuario {
    _id: string;
    name: string;
    email: string;
}

export type MatriculaStatus = 'pendente' | 'aprovado' | 'rejeitado';

interface Matricula {
    _id: string;
    status: MatriculaStatus;
    cursoId: Curso;
    userId: Usuario;
}

export default function SolicitacoesMatricula() {
    const [lista, setLista] = useState<Matricula[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/matriculas');
            // assume the API returns { matriculas: [...] }
            setLista(res.data.matriculas as Matricula[] || []);
        } catch (err) {
            console.error('Erro ao carregar solicitações de matrícula:', err);
            setLista([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // carregar ao montar (somente uma vez)
        load();
    }, [load]);

    const atualizar = useCallback(async (id: string, status: 'aprovado' | 'rejeitado') => {
        setUpdatingId(id);
        try {
            await axios.patch(`/api/matriculas/${id}`, { status });
            // recarrega lista após alteração
            await load();
        } catch (err) {
            console.error(`Erro ao atualizar matrícula ${id}:`, err);
        } finally {
            setUpdatingId(null);
        }
    }, [load]);

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Solicitações de Matrícula</h2>
                <p className="text-gray-600">Carregando solicitações...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Solicitações de Matrícula</h2>

            {lista.length === 0 ? (
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-600">Nenhuma solicitação encontrada.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {lista.map((m) => (
                        <div key={m._id} className="p-4 bg-white shadow rounded">
                            <p><b>Aluno:</b> {m.userId?.name ?? m.userId?.email ?? '—'}</p>
                            <p><b>Curso:</b> {m.cursoId?.titulo ?? '—'}</p>
                            <p><b>Status:</b> {m.status}</p>

                            {m.status === 'pendente' && (
                                <div className="flex gap-3 mt-3">
                                    <button
                                        onClick={() => atualizar(m._id, 'aprovado')}
                                        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                                        disabled={updatingId !== null}
                                    >
                                        {updatingId === m._id ? 'Aprovando...' : 'Aprovar'}
                                    </button>

                                    <button
                                        onClick={() => atualizar(m._id, 'rejeitado')}
                                        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                                        disabled={updatingId !== null}
                                    >
                                        {updatingId === m._id ? 'Rejeitando...' : 'Rejeitar'}
                                    </button>
                                </div>
                            )}

                            {m.status !== 'pendente' && (
                                <div className="mt-3">
                                    <small className="text-gray-500">Última atualização: {m.status}</small>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
