'use client';

import { useState, useEffect } from 'react';

/* ---------------------- TIPOS ---------------------- */
interface Alternativa {
    texto: string;
    correta: boolean;
}

interface Questao {
    enunciado: string;
    tipo: string;
    pontuacao?: number;
    alternativas?: Alternativa[];
}

interface Prova {
    _id: string;
    titulo: string;
    descricao?: string;
    cursoId?: {
        _id: string;
        titulo: string;
    } | string;
    tempoLimite?: number;
    pontuacaoTotal?: number;
    ativo?: boolean;
    questoes?: Questao[];
    createdAt?: string;
}

interface ProvasListProps {
    onEdit?: () => void;
}

/* ---------------------- COMPONENTE ---------------------- */

export default function ProvasList({ onEdit }: ProvasListProps) {
    const [provas, setProvas] = useState<Prova[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Prova>>({});

    /* ---------------------- CARREGAR PROVAS ---------------------- */
    useEffect(() => {
        fetchProvas();
    }, []);

    const fetchProvas = async () => {
        try {
            const response = await fetch(`/api/provas`);
            const data = await response.json();

            if (response.ok) {
                setProvas(data.provas || []);
            } else {
                setError(data.error || 'Erro ao carregar provas');
            }
        } catch {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    /* ---------------------- DELETAR ---------------------- */
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar esta prova?')) return;

        try {
            const response = await fetch(`/api/provas/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProvas(provas.filter((p) => p._id !== id));
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao deletar prova');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    /* ---------------------- EDITAR ---------------------- */
    const handleEdit = (prova: Prova) => {
        setEditingId(prova._id);
        setEditForm({
            titulo: prova.titulo,
            descricao: prova.descricao,
            tempoLimite: prova.tempoLimite,
            ativo: prova.ativo,
            pontuacaoTotal: prova.pontuacaoTotal,
            questoes: prova.questoes ? prova.questoes.map((q) => ({ ...q })) : [],
            createdAt: (prova as any).createdAt
        });
    };

    const handleSaveEdit = async (id: string) => {
        try {
            // recalcula pontuação total localmente antes de enviar
            const payload: any = { ...editForm };
            if (payload.questoes && Array.isArray(payload.questoes)) {
                payload.pontuacaoTotal = payload.questoes.reduce((sum: number, q: any) => {
                    return sum + (Number(q.pontuacao) || 0);
                }, 0);
            }

            const response = await fetch(`/api/provas/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchProvas();
                setEditingId(null);
                setEditForm({});
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao atualizar prova');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    /* ---------------------- LOADING ---------------------- */
    if (loading) {
        return (
            <div className="text-center py-8 text-gray-600">
                Carregando provas...
            </div>
        );
    }

    /* ---------------------- UI ---------------------- */

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Provas</h1>
                    <p className="text-gray-600 mt-2">Gerencie suas provas</p>
                </div>

                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Criar Nova Prova
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {provas.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                    Nenhuma prova cadastrada ainda.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {provas.map((prova) => (
                        <div key={prova._id} className="bg-white rounded-lg shadow-md p-6">
                            {/* MODO EDIÇÃO */}
                            {editingId === prova._id ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editForm.titulo || ''}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, titulo: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Título"
                                    />

                                    <textarea
                                        value={editForm.descricao || ''}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, descricao: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Descrição"
                                        rows={3}
                                    />

                                    <input
                                        type="number"
                                        value={editForm.tempoLimite || ''}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                tempoLimite: Number(e.target.value)
                                            })
                                        }
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="Tempo limite (minutos)"
                                    />

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={editForm.ativo ?? true}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    ativo: e.target.checked
                                                })
                                            }
                                            className="w-4 h-4"
                                        />
                                        <label className="text-sm text-gray-700">Ativo</label>
                                    </div>

                                    {/* Questões editor */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Questões</h4>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = (editForm.questoes || []).slice();
                                                    next.push({ enunciado: '', tipo: 'multipla_escolha', pontuacao: 1, alternativas: [] });
                                                    setEditForm({ ...editForm, questoes: next });
                                                }}
                                                className="px-3 py-1 bg-emerald-600 text-white rounded text-sm"
                                            >
                                                Adicionar Questão
                                            </button>
                                        </div>

                                        {(editForm.questoes || []).map((q, qi) => (
                                            <div key={qi} className="p-3 border rounded space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <strong>Questão {qi + 1}</strong>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const next = (editForm.questoes || []).slice();
                                                                next.splice(qi, 1);
                                                                setEditForm({ ...editForm, questoes: next });
                                                            }}
                                                            className="text-red-600"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={q.enunciado || ''}
                                                    onChange={(e) => {
                                                        const next = (editForm.questoes || []).slice();
                                                        next[qi] = { ...next[qi], enunciado: e.target.value };
                                                        setEditForm({ ...editForm, questoes: next });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-lg"
                                                    placeholder="Enunciado"
                                                />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <select
                                                        value={q.tipo || 'multipla_escolha'}
                                                        onChange={(e) => {
                                                            const next = (editForm.questoes || []).slice();
                                                            next[qi] = { ...next[qi], tipo: e.target.value };
                                                            setEditForm({ ...editForm, questoes: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                    >
                                                        <option value="multipla_escolha">Múltipla Escolha</option>
                                                        <option value="verdadeiro_falso">Verdadeiro / Falso</option>
                                                        <option value="dissertativa">Dissertativa</option>
                                                    </select>

                                                    <input
                                                        type="number"
                                                        value={q.pontuacao ?? 1}
                                                        onChange={(e) => {
                                                            const next = (editForm.questoes || []).slice();
                                                            next[qi] = { ...next[qi], pontuacao: e.target.value ? Number(e.target.value) : 0 };
                                                            setEditForm({ ...editForm, questoes: next });
                                                        }}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Pontuação"
                                                    />
                                                </div>

                                                {/* Alternativas (quando aplicável) */}
                                                {(q.tipo === 'multipla_escolha' || q.tipo === 'verdadeiro_falso') && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <small className="text-sm">Alternativas</small>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const next = (editForm.questoes || []).slice();
                                                                    const quest = next[qi] || { alternativas: [] };
                                                                    quest.alternativas = quest.alternativas || [];
                                                                    quest.alternativas.push({ texto: '', correta: false });
                                                                    next[qi] = quest;
                                                                    setEditForm({ ...editForm, questoes: next });
                                                                }}
                                                                className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                                            >
                                                                Adicionar Alternativa
                                                            </button>
                                                        </div>

                                                        {(q.alternativas || []).map((a, ai) => (
                                                            <div key={ai} className="flex gap-2 items-center">
                                                                <input
                                                                    type="text"
                                                                    value={a.texto || ''}
                                                                    onChange={(e) => {
                                                                        const next = (editForm.questoes || []).slice();
                                                                        const quest = next[qi];
                                                                        quest.alternativas = quest.alternativas || [];
                                                                        quest.alternativas[ai] = { ...quest.alternativas[ai], texto: e.target.value };
                                                                        next[qi] = quest;
                                                                        setEditForm({ ...editForm, questoes: next });
                                                                    }}
                                                                    className="flex-1 px-3 py-2 border rounded-lg"
                                                                    placeholder="Texto da alternativa"
                                                                />

                                                                <label className="flex items-center gap-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!a.correta}
                                                                        onChange={(e) => {
                                                                            const next = (editForm.questoes || []).slice();
                                                                            const quest = next[qi];
                                                                            quest.alternativas = quest.alternativas || [];
                                                                            quest.alternativas[ai] = { ...quest.alternativas[ai], correta: e.target.checked };
                                                                            next[qi] = quest;
                                                                            setEditForm({ ...editForm, questoes: next });
                                                                        }}
                                                                    />
                                                                    <span className="text-sm">Correta</span>
                                                                </label>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const next = (editForm.questoes || []).slice();
                                                                        const quest = next[qi];
                                                                        quest.alternativas = quest.alternativas || [];
                                                                        quest.alternativas.splice(ai, 1);
                                                                        next[qi] = quest;
                                                                        setEditForm({ ...editForm, questoes: next });
                                                                    }}
                                                                    className="text-red-600"
                                                                >
                                                                    Remover
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSaveEdit(prova._id)}
                                            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                        >
                                            Salvar
                                        </button>

                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* MODO VISUALIZAÇÃO */}
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {prova.titulo}
                                    </h3>

                                    {prova.descricao && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {prova.descricao}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {prova.cursoId && (
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                {typeof prova.cursoId === 'object'
                                                    ? prova.cursoId.titulo
                                                    : 'Curso'}
                                            </span>
                                        )}

                                        {prova.tempoLimite && (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                {prova.tempoLimite} min
                                            </span>
                                        )}

                                        {prova.pontuacaoTotal !== undefined && (
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                                {prova.pontuacaoTotal} pts
                                            </span>
                                        )}

                                        {prova.questoes && prova.questoes.length > 0 && (
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                                                {prova.questoes.length}{' '}
                                                questão{prova.questoes.length > 1 ? 'es' : ''}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(prova)}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(prova._id)}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
