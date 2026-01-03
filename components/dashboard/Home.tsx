'use client';

import { useState, useEffect } from 'react';
import SolicitacoesMatricula from './SolicitacoesMatricula';

function ManualEnrollForm() {
    const [courses, setCourses] = useState<{ _id: string; titulo: string }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [email, setEmail] = useState('');
    const [loadingEnroll, setLoadingEnroll] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/cursos');
                const data = await res.json();
                setCourses(data.cursos || []);
            } catch (err) {
                console.error('Erro ao carregar cursos para matrícula manual', err);
            }
        };

        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!email || !selectedCourse) {
            setMessage('Informe email e curso.');
            return;
        }

        setLoadingEnroll(true);

        try {
            const res = await fetch('/api/matriculas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cursoId: selectedCourse })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Matrícula criada com sucesso.');
                setEmail('');
                setSelectedCourse('');
            } else {
                setMessage(data.error || 'Erro ao criar matrícula');
            }
        } catch (err) {
            console.error(err);
            setMessage('Erro ao conectar com o servidor');
        } finally {
            setLoadingEnroll(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded">
            <div className="space-y-2">
                <input
                    type="email"
                    placeholder="Email do usuário"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                />

                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="">Selecione um curso</option>
                    {courses.map((c) => (
                        <option key={c._id} value={c._id}>{c.titulo}</option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={loadingEnroll}
                >
                    {loadingEnroll ? 'Matriculando...' : 'Matricular Manualmente'}
                </button>

                {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
            </div>
        </form>
    );
}

interface HomeProps {
    onNavigate?: (section: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
    const [stats, setStats] = useState({
        cursos: 0,
        provas: 0,
        alunos: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [cursosRes, provasRes, alunosRes] = await Promise.all([
                    fetch('/api/cursos'),
                    fetch('/api/provas'),
                    fetch('/api/user')
                ]);

                const cursosData = await cursosRes.json();
                const provasData = await provasRes.json();
                const alunosData = await alunosRes.json();

                setStats({
                    cursos: cursosData.cursos?.length || 0,
                    provas: provasData.provas?.length || 0,
                    alunos: alunosData.users?.length || 0
                });
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Cursos */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total de Documentos</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.cursos}</p>
                        </div>
                        <div className="bg-emerald-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Provas */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total de outras info</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.provas}</p>
                        </div>
                        <div className="bg-teal-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Alunos */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total de Clientes</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.alunos}</p>
                        </div>
                        <div className="bg-cyan-100 rounded-full p-3">
                            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            {/* Seção: Solicitações e Matrículas Manuais
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <div className="mt-6">
                    <SolicitacoesMatricula />
                </div>
            </div> */}
        </div>
    );
}
