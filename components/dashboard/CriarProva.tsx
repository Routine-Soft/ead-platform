'use client';

import { useState, useEffect } from 'react';

interface Alternativa {
    texto: string;
    correta: boolean;
}

interface Questao {
    enunciado: string;
    tipo: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
    pontuacao?: number;
    alternativas?: Alternativa[];
}

interface Curso {
    _id: string;
    titulo: string;
}

interface CriarProvaProps {
    onSuccess?: () => void;
}

export default function CriarProva({ onSuccess }: CriarProvaProps) {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        cursoId: '',
        tempoLimite: ''
    });
    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [showQuestaoForm, setShowQuestaoForm] = useState(false);
    const [questaoForm, setQuestaoForm] = useState<Questao>({
        enunciado: '',
        tipo: 'multipla_escolha',
        pontuacao: 1,
        alternativas: []
    });
    const [alternativaForm, setAlternativaForm] = useState({ texto: '', correta: false });
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await fetch('/api/cursos');
            const data = await response.json();
            if (response.ok) {
                setCursos(data.cursos || []);
            }
        } catch (err) {
            console.error('Erro ao carregar cursos:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddAlternativa = () => {
        if (alternativaForm.texto.trim()) {
            setQuestaoForm({
                ...questaoForm,
                alternativas: [...(questaoForm.alternativas || []), { ...alternativaForm }]
            });
            setAlternativaForm({ texto: '', correta: false });
        }
    };

    const handleRemoveAlternativa = (index: number) => {
        const novasAlternativas = questaoForm.alternativas?.filter((_, i) => i !== index) || [];
        setQuestaoForm({ ...questaoForm, alternativas: novasAlternativas });
    };

    const handleAddQuestao = () => {
        if (questaoForm.enunciado.trim()) {
            // Se for múltipla escolha ou verdadeiro/falso, precisa ter alternativas
            if ((questaoForm.tipo === 'multipla_escolha' || questaoForm.tipo === 'verdadeiro_falso') 
                && (!questaoForm.alternativas || questaoForm.alternativas.length === 0)) {
                alert('Questões de múltipla escolha ou verdadeiro/falso precisam ter alternativas');
                return;
            }

            setQuestoes([...questoes, { ...questaoForm }]);
            setQuestaoForm({
                enunciado: '',
                tipo: 'multipla_escolha',
                pontuacao: 1,
                alternativas: []
            });
            setAlternativaForm({ texto: '', correta: false });
            setShowQuestaoForm(false);
        }
    };

    const handleRemoveQuestao = (index: number) => {
        setQuestoes(questoes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const provaData = {
                ...formData,
                tempoLimite: formData.tempoLimite ? Number(formData.tempoLimite) : undefined,
                cursoId: formData.cursoId || undefined,
                questoes: questoes.length > 0 ? questoes : []
            };

            const response = await fetch('/api/provas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(provaData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao criar prova');
                setLoading(false);
                return;
            }

            // Reset form
            setFormData({
                titulo: '',
                descricao: '',
                cursoId: '',
                tempoLimite: ''
            });
            setQuestoes([]);

            if (onSuccess) {
                onSuccess();
            } else {
                alert('Prova criada com sucesso!');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Criar Nova Prova</h1>
                <p className="text-gray-600 mt-2">Preencha os dados da prova</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Nome da prova"
                    />
                </div>

                <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                    </label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Descrição da prova"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cursoId" className="block text-sm font-medium text-gray-700 mb-2">
                            Curso (Opcional)
                        </label>
                        <select
                            id="cursoId"
                            name="cursoId"
                            value={formData.cursoId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="">Selecione um curso</option>
                            {cursos.map((curso) => (
                                <option key={curso._id} value={curso._id}>
                                    {curso.titulo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tempoLimite" className="block text-sm font-medium text-gray-700 mb-2">
                            Tempo Limite (minutos)
                        </label>
                        <input
                            type="number"
                            id="tempoLimite"
                            name="tempoLimite"
                            value={formData.tempoLimite}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Ex: 60"
                        />
                    </div>
                </div>

                {/* Questões */}
                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Questões (Opcional)</h3>
                        <button
                            type="button"
                            onClick={() => setShowQuestaoForm(!showQuestaoForm)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Adicionar Questão
                        </button>
                    </div>

                    {showQuestaoForm && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enunciado <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={questaoForm.enunciado}
                                    onChange={(e) => setQuestaoForm({ ...questaoForm, enunciado: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    rows={3}
                                    placeholder="Enunciado da questão"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo
                                    </label>
                                    <select
                                        value={questaoForm.tipo}
                                        onChange={(e) => {
                                            const value = e.target.value as Questao['tipo'];
                                        
                                            setQuestaoForm({
                                                ...questaoForm,
                                                tipo: value,
                                                alternativas: value === 'dissertativa' ? [] : questaoForm.alternativas
                                            });
                                        }}
                                                                            
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="multipla_escolha">Múltipla Escolha</option>
                                        <option value="verdadeiro_falso">Verdadeiro/Falso</option>
                                        <option value="dissertativa">Dissertativa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pontuação
                                    </label>
                                    <input
                                        type="number"
                                        value={questaoForm.pontuacao}
                                        onChange={(e) => setQuestaoForm({ ...questaoForm, pontuacao: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        min="0"
                                        step="0.5"
                                    />
                                </div>
                            </div>

                            {(questaoForm.tipo === 'multipla_escolha' || questaoForm.tipo === 'verdadeiro_falso') && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Alternativas</h4>
                                    <div className="space-y-2 mb-2">
                                        {questaoForm.alternativas?.map((alt, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={alt.correta}
                                                    onChange={() => {
                                                        const novasAlternativas = questaoForm.alternativas?.map((a, i) =>
                                                            i === idx ? { ...a, correta: !a.correta } : a
                                                        );
                                                        setQuestaoForm({ ...questaoForm, alternativas: novasAlternativas });
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="flex-1">{alt.texto}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAlternativa(idx)}
                                                    className="text-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={alternativaForm.texto}
                                            onChange={(e) => setAlternativaForm({ ...alternativaForm, texto: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Texto da alternativa"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddAlternativa}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddQuestao}
                                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                >
                                    Adicionar Questão
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowQuestaoForm(false);
                                        setQuestaoForm({
                                            enunciado: '',
                                            tipo: 'multipla_escolha',
                                            pontuacao: 1,
                                            alternativas: []
                                        });
                                        setAlternativaForm({ texto: '', correta: false });
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {questoes.length > 0 && (
                        <div className="space-y-2">
                            {questoes.map((questao, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{index + 1}. {questao.enunciado}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Tipo: {questao.tipo} | Pontuação: {questao.pontuacao || 1} pts
                                        </p>
                                        {questao.alternativas && questao.alternativas.length > 0 && (
                                            <ul className="mt-2 space-y-1 text-sm">
                                                {questao.alternativas.map((alt, idx) => (
                                                    <li key={idx} className={alt.correta ? 'text-green-600 font-semibold' : ''}>
                                                        {alt.correta && '✓ '}{alt.texto}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveQuestao(index)}
                                        className="text-red-600 hover:text-red-700 ml-4"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Criando...' : 'Criar Prova'}
                    </button>
                    {onSuccess && (
                        <button
                            type="button"
                            onClick={onSuccess}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

