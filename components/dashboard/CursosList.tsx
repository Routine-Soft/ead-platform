'use client';

import { useState, useEffect } from 'react';

interface Modulo {
    titulo: string;
    descricao?: string;
    ordem?: number;
    conteudo?: string;
}

interface Curso {
    _id: string;
    titulo: string;
    descricao?: string;
    categoria?: string;
    duracao?: number;
    preco?: number;
    imagem?: string;
    ativo?: boolean;
    modulos?: Modulo[];
    createdAt?: string;
}

interface CursosListProps {
    onEdit?: () => void;
}

export default function CursosList({ onEdit }: CursosListProps) {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Curso>>({});

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await fetch(`/api/cursos`);
            const data = await response.json();
            if (response.ok) {
                setCursos(data.cursos || []);
            } else {
                setError(data.error || 'Erro ao carregar cursos');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este curso?')) return;

        try {
            const response = await fetch(`/api/cursos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCursos(cursos.filter(c => c._id !== id));
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao deletar curso');
            }
        } catch (err) {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleEdit = (curso: Curso) => {
        setEditingId(curso._id);
        setEditForm({
            titulo: curso.titulo,
            descricao: curso.descricao,
            categoria: curso.categoria,
            duracao: curso.duracao,
            preco: curso.preco,
            imagem: curso.imagem,
            ativo: curso.ativo
            ,modulos: curso.modulos || [],
            createdAt: curso.createdAt
        });
    };

    const handleSaveEdit = async (id: string) => {
        try {
            const payload = {
                ...editForm,
                duracao: editForm.duracao ? Number(editForm.duracao) : undefined,
                preco: editForm.preco ? Number(editForm.preco) : undefined,
            };

            const response = await fetch(`/api/cursos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchCursos();
                setEditingId(null);
                setEditForm({});
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao atualizar curso');
            }
        } catch (err) {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Carregando cursos...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Cursos</h1>
                    <p className="text-gray-600 mt-2">Gerencie seus cursos</p>
                </div>

                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Criar Novo Curso
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {cursos.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                    Nenhum curso cadastrado ainda.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map((curso) => (
                        <div key={curso._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {curso.imagem && (
                                <img src={curso.imagem} alt={curso.titulo} className="w-full h-48 object-cover" />
                            )}

                            <div className="p-6">
                                {editingId === curso._id ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={editForm.titulo || ''}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, titulo: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />

                                        <textarea
                                            value={editForm.descricao || ''}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, descricao: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg"
                                            rows={3}
                                        />

                                        <input
                                            type="text"
                                            value={editForm.categoria || ''}
                                            onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="Categoria"
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                value={editForm.duracao ?? ''}
                                                onChange={(e) => setEditForm({ ...editForm, duracao: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Duração (horas)"
                                            />

                                            <input
                                                type="number"
                                                value={editForm.preco ?? ''}
                                                onChange={(e) => setEditForm({ ...editForm, preco: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Preço"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={editForm.imagem || ''}
                                            onChange={(e) => setEditForm({ ...editForm, imagem: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg"
                                            placeholder="URL da imagem"
                                        />

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={!!editForm.ativo}
                                                onChange={(e) => setEditForm({ ...editForm, ativo: e.target.checked })}
                                            />
                                            <span>Ativo</span>
                                        </label>

                                        {/* Módulos editor */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">Módulos</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditForm({ ...editForm, modulos: [...(editForm.modulos || []), { titulo: '', descricao: '', ordem: (editForm.modulos?.length || 0) + 1, conteudo: '' }] })}
                                                    className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
                                                >
                                                    Adicionar Módulo
                                                </button>
                                            </div>

                                            {(editForm.modulos || []).map((mod: Modulo, idx: number) => (
                                                <div key={idx} className="p-3 border rounded space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <strong>Módulo {idx + 1}</strong>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const next = (editForm.modulos || []).slice();
                                                                next.splice(idx, 1);
                                                                setEditForm({ ...editForm, modulos: next });
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        value={mod.titulo || ''}
                                                        onChange={(e) => {
                                                            const next = (editForm.modulos || []).slice();
                                                            next[idx] = { ...next[idx], titulo: e.target.value };
                                                            setEditForm({ ...editForm, modulos: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Título do módulo"
                                                    />

                                                    <input
                                                        type="text"
                                                        value={mod.descricao || ''}
                                                        onChange={(e) => {
                                                            const next = (editForm.modulos || []).slice();
                                                            next[idx] = { ...next[idx], descricao: e.target.value };
                                                            setEditForm({ ...editForm, modulos: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Descrição do módulo"
                                                    />

                                                    <input
                                                        type="number"
                                                        value={mod.ordem ?? ''}
                                                        onChange={(e) => {
                                                            const next = (editForm.modulos || []).slice();
                                                            next[idx] = { ...next[idx], ordem: e.target.value ? Number(e.target.value) : undefined };
                                                            setEditForm({ ...editForm, modulos: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Ordem"
                                                    />

                                                    <textarea
                                                        value={mod.conteudo || ''}
                                                        onChange={(e) => {
                                                            const next = (editForm.modulos || []).slice();
                                                            next[idx] = { ...next[idx], conteudo: e.target.value };
                                                            setEditForm({ ...editForm, modulos: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Conteúdo do módulo"
                                                        rows={3}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSaveEdit(curso._id)}
                                                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Salvar
                                            </button>

                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-semibold mb-2">{curso.titulo}</h3>

                                        {/* {curso.imagem && (
                                            <img src={curso.imagem} alt={curso.titulo} className="w-full h-40 object-cover rounded mb-2" />
                                        )} */}

                                        {curso.descricao && <p className="text-gray-600">{curso.descricao}</p>}

                                        <div className="mt-2 text-sm text-gray-700">
                                            {curso.categoria && <div><strong>Categoria:</strong> {curso.categoria}</div>}
                                            {curso.duracao !== undefined && <div><strong>Duração:</strong> {curso.duracao} horas</div>}
                                            {curso.preco !== undefined && <div><strong>Preço:</strong> R$ {curso.preco}</div>}
                                            <div><strong>Ativo:</strong> {curso.ativo ? 'Sim' : 'Não'}</div>
                                            {curso.createdAt && <div><strong>Criado em:</strong> {new Date(curso.createdAt).toLocaleString()}</div>}
                                        </div>

                                        {curso.modulos && curso.modulos.length > 0 && (
                                            <div className="mt-3">
                                                <strong>Módulos:</strong>
                                                <div className="mt-2 space-y-2">
                                                    {curso.modulos.map((m, i) => (
                                                        <div key={i} className="p-2 border rounded">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <div className="font-semibold">{m.titulo}</div>
                                                                    {m.descricao && <div className="text-sm text-gray-600">{m.descricao}</div>}
                                                                </div>
                                                                <div className="text-sm text-gray-500">Ordem: {m.ordem ?? '-'}</div>
                                                            </div>
                                                            {m.conteudo && <div className="mt-2 text-sm text-gray-700">{m.conteudo}</div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(curso)}
                                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(curso._id)}
                                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
