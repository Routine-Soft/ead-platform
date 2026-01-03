'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Curso = { _id: string; titulo: string; descricao?: string; imagem?: string };
type Matricula = { cursoId: { _id: string }; status: 'pendente' | 'aprovado' | 'rejeitado'; };

export default function CursosDisponiveis({
    userId,
    onEstudar
}: {
    userId: string;
    onEstudar: (cursoId: string) => void;
}) {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const c = await axios.get('/api/cursos');
            const m = await axios.get(`/api/matriculas?userId=${userId}`);
            setCursos(c.data.cursos || []);
            setMatriculas(m.data.matriculas || []);
        }
        load();
    }, [userId]);

    async function matricular(cursoId: string) {
        try {
            await axios.post('/api/matriculas', { userId, cursoId });
            alert('Solicitação enviada');
            // atualizar status localmente
            const m = await axios.get(`/api/matriculas?userId=${userId}`);
            setMatriculas(m.data.matriculas || []);
        } catch (err) {
            console.error('Erro ao solicitar matrícula', err);
            alert('Erro ao enviar solicitação');
        }
    }

    function getStatus(cursoId: string) {
        const m = matriculas.find((x) => x.cursoId._id === cursoId);
        return m?.status;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Seus documentos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cursos.map((curso) => {
                    const status = getStatus(curso._id);

                    return (
                        <div key={curso._id} className="p-4 bg-white shadow rounded">
                            {curso.imagem && (
                                <img src={curso.imagem} alt={curso.titulo} className="w-full h-40 object-cover rounded mb-3" />
                            )}

                            <h3 className="text-xl font-semibold">{curso.titulo}</h3>
                            {curso.descricao && <p className="text-gray-600 mt-1">{curso.descricao}</p>}

                            {status === 'pendente' && (
                                <p className="text-yellow-600 mt-2">Pendente</p>
                            )}

                            {status === 'aprovado' && (
                                <p className="text-green-600 mt-2">Matriculado / Aprovado</p>
                            )}

                            {status === 'rejeitado' && (
                                <p className="text-red-600 mt-2">Rejeitado</p>
                            )}

                            {status === 'aprovado' && (
                                <button
                                    onClick={() => onEstudar(curso._id)}
                                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Estudar Agora
                                </button>
                            )}


                            {!status && (
                                <button
                                    onClick={() => matricular(curso._id)}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Solicitar Matrícula
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
