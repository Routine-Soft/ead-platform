'use client';

import { useState } from 'react';

interface Modulo {
    titulo: string;
    descricao?: string;
    ordem?: number;
    conteudo?: string;
}

interface CriarCursoProps {
    onSuccess?: () => void;
}

export default function CriarCurso({ onSuccess }: CriarCursoProps) {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        categoria: '',
        duracao: '',
        preco: '',
        imagem: ''
    });

    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [showModuloForm, setShowModuloForm] = useState(false);

    const [moduloForm, setModuloForm] = useState<Modulo>({
        titulo: '',
        descricao: '',
        ordem: 0,
        conteudo: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddModulo = () => {
        if (!moduloForm.titulo.trim()) return;

        setModulos([
            ...modulos,
            { ...moduloForm, ordem: modulos.length }
        ]);

        setModuloForm({ titulo: '', descricao: '', ordem: 0, conteudo: '' });
        setShowModuloForm(false);
    };

    const handleRemoveModulo = (index: number) => {
        setModulos(modulos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const cursoData = {
                ...formData,
                duracao: formData.duracao ? Number(formData.duracao) : undefined,
                preco: formData.preco ? Number(formData.preco) : undefined,
                modulos: modulos.length > 0 ? modulos : undefined
            };

            const response = await fetch(`/api/cursos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cursoData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao criar curso');
                return;
            }

            // Limpar form
            setFormData({
                titulo: '',
                descricao: '',
                categoria: '',
                duracao: '',
                preco: '',
                imagem: ''
            });

            setModulos([]);

            onSuccess ? onSuccess() : alert('Curso criado com sucesso!');
        } catch {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Criar Novo Curso</h1>
            <p className="text-gray-600">Preencha os dados do curso</p>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg space-y-6">
                
                <div>
                    <label className="block font-medium mb-1">Título *</label>
                    <input
                        type="text"
                        name="titulo"
                        required
                        value={formData.titulo}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Descrição</label>
                    <textarea
                        name="descricao"
                        rows={4}
                        value={formData.descricao}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Categoria</label>
                        <input
                            type="text"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Duração (horas)</label>
                        <input
                            type="number"
                            name="duracao"
                            value={formData.duracao}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Preço</label>
                        <input
                            type="number"
                            name="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">URL da Imagem</label>
                        <input
                            type="url"
                            name="imagem"
                            value={formData.imagem}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                </div>

                {/* MÓDULOS */}
                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Módulos (Opcional)</h3>
                        <button
                            type="button"
                            onClick={() => setShowModuloForm(!showModuloForm)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded"
                        >
                            Adicionar Módulo
                        </button>
                    </div>

                    {showModuloForm && (
                        <div className="bg-gray-100 p-4 rounded mt-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Título do módulo"
                                value={moduloForm.titulo}
                                onChange={(e) => setModuloForm({ ...moduloForm, titulo: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <textarea
                                placeholder="Descrição"
                                value={moduloForm.descricao}
                                onChange={(e) => setModuloForm({ ...moduloForm, descricao: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                rows={2}
                            />

                            <textarea
                                placeholder="Conteúdo"
                                value={moduloForm.conteudo}
                                onChange={(e) => setModuloForm({ ...moduloForm, conteudo: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                rows={3}
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddModulo}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded"
                                >
                                    Adicionar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModuloForm(false);
                                        setModuloForm({ titulo: '', descricao: '', ordem: 0, conteudo: '' });
                                    }}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {modulos.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {modulos.map((mod, i) => (
                                <div key={i} className="bg-gray-100 p-3 rounded flex justify-between">
                                    <div>
                                        <p className="font-semibold">{mod.titulo}</p>
                                        {mod.descricao && (
                                            <p className="text-sm text-gray-600">{mod.descricao}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveModulo(i)}
                                        className="text-red-600"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded font-semibold"
                >
                    {loading ? 'Criando...' : 'Criar Curso'}
                </button>

                {onSuccess && (
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="w-full bg-gray-300 py-3 rounded font-semibold"
                    >
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
}
