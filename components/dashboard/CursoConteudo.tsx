'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Modulo {
    _id: string;
    titulo: string;
    conteudo: string;
}

interface Curso {
    _id: string;
    titulo: string;
    descricao?: string;
    modulos: Modulo[];
}

export default function CursoConteudo({ cursoId }: { cursoId: string }) {
    const [curso, setCurso] = useState<Curso | null>(null);

    useEffect(() => {
        let ativo = true;

        async function load() {
            const res = await axios.get(`/api/cursos/${cursoId}`);
            if (!ativo) return;
            setCurso(res.data.curso);
        }

        load();

        return () => {
            ativo = false;
        };
    }, [cursoId]);

    if (!curso) {
        return <p>Carregando curso...</p>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{curso.titulo}</h1>
                {curso.descricao && (
                    <p className="text-gray-600 mt-2">{curso.descricao}</p>
                )}
            </div>

            {curso.modulos.length === 0 && (
                <p>Este curso ainda não possui conteúdo.</p>
            )}

            <div className="space-y-4">
                {curso.modulos.map((modulo, index) => (
                    <div key={modulo._id} className="p-4 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">
                            {index + 1}. {modulo.titulo}
                        </h3>

                        <div
                            className="mt-3 text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: modulo.conteudo
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
