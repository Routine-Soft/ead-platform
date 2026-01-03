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

interface PageProps {
    params: {
        id: string;
    };
}

export default async function CursoPage({ params }: PageProps) {
    const { id } = params;

    const res = await axios.get(`http://localhost:3000/api/cursos/${id}`);
    const curso: Curso = res.data.curso;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{curso.titulo}</h1>
                {curso.descricao && (
                    <p className="text-gray-600 mt-2">{curso.descricao}</p>
                )}
            </div>

            <div className="space-y-4">
                {curso.modulos.length === 0 && (
                    <p>Este curso ainda não possui conteúdo.</p>
                )}

                {curso.modulos.map((modulo, index) => (
                    <div
                        key={modulo._id}
                        className="p-4 bg-white shadow rounded"
                    >
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
