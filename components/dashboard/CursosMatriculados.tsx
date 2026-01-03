'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Curso = {
    _id: string;
    titulo: string;
    descricao?: string;
    imagem?: string;
};

type Matricula = {
    cursoId: { _id: string };
    status: 'pendente' | 'aprovado' | 'rejeitado';
};

export default function CursosMatriculados({
    userId,
    onEstudar
}: {
    userId: string;
    onEstudar: (cursoId: string) => void;
}) {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);

    useEffect(() => {
        async function load() {
            const c = await axios.get('/api/cursos');
            const m = await axios.get(`/api/matriculas?userId=${userId}`);

            setCursos(c.data.cursos || []);
            setMatriculas(m.data.matriculas || []);
        }

        load();
    }, [userId]);

    function getMatricula(cursoId: string) {
        return matriculas.find((m) => m.cursoId._id === cursoId);
    }

    const cursosMatriculados = cursos.filter((curso) =>
        matriculas.some((m) => m.cursoId._id === curso._id)
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Meus Cursos</h2>

            {cursosMatriculados.length === 0 && (
                <p className="text-gray-600">
                    Você ainda não está matriculado em nenhum curso.
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cursosMatriculados.map((curso) => {
                    const matricula = getMatricula(curso._id);

                    return (
                        <div
                            key={curso._id}
                            className="p-4 bg-white shadow rounded"
                        >
                            {curso.imagem && (
                                <img
                                    src={curso.imagem}
                                    alt={curso.titulo}
                                    className="w-full h-40 object-cover rounded mb-3"
                                />
                            )}

                            <h3 className="text-xl font-semibold">
                                {curso.titulo}
                            </h3>

                            {curso.descricao && (
                                <p className="text-gray-600 mt-1">
                                    {curso.descricao}
                                </p>
                            )}

                            {matricula && (
                                <p className="mt-2 font-medium">
                                    Status:{' '}
                                    <span
                                        className={
                                            matricula.status === 'aprovado'
                                                ? 'text-green-600'
                                                : matricula.status === 'pendente'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {matricula.status}
                                    </span>
                                </p>
                            )}

                            {matricula?.status === 'aprovado' && (
                                <button
                                    onClick={() => onEstudar(curso._id)}
                                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Estudar Agora
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
