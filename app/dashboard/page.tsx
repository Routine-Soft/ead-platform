'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Home from '@/components/dashboard/UserHome';
import PerfilAluno from '@/components/dashboard/PerfilAluno';
import CursosDisponiveis from '@/components/dashboard/CursosDisponiveis';
import CursoConteudo from '@/components/dashboard/CursoConteudo';

type ActiveSection =
    | 'home'
    | 'perfil'
    | 'disponiveis'
    | 'curso-conteudo';

type User = {
    _id: string;
    name: string;
    email: string;
};

export default function UserDashboard() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [activeSection, setActiveSection] =
        useState<ActiveSection>('disponiveis');
    const [cursoId, setCursoId] = useState<string | null>(null);

    const [menuOpen, setMenuOpen] = useState(false);

    // useEffect(() => {
    //     const userData = localStorage.getItem('user');
    //     if (!userData) {
    //         router.push('/login/user');
    //         return;
    //     }
    //     setUser(JSON.parse(userData));
    // }, [router]);

        // 🔒 Carrega o usuário autenticado
    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (!userData) {
            router.push('/login/user');
            return;
        }

        const parsed = JSON.parse(userData) as User;
        queueMicrotask(() => {
         setUser(parsed);   
        })
        
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login/user');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* OVERLAY MOBILE */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    bg-gradient-to-b from-emerald-600 to-teal-600
                    text-white flex flex-col
                    w-64
                    md:relative md:translate-x-0
                    fixed top-0 left-0 h-screen z-50
                    transition-transform duration-300
                    ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:h-auto
                `}
            >
                <div className="p-6 border-b border-emerald-700">
                    <h1 className="text-xl font-bold leading-tight">
                        Nathan Seg<br />Trabalho LTDA
                    </h1>
                    <p className="text-emerald-100 text-sm mt-1">
                        {user.name}
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => {
                            setActiveSection('disponiveis');
                            setMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition
                            ${
                                activeSection === 'disponiveis'
                                    ? 'bg-white text-emerald-600 font-semibold'
                                    : 'hover:bg-emerald-700'
                            }
                        `}
                    >
                        Seus Documentos
                    </button>

                    <button
                        onClick={() => {
                            setActiveSection('perfil');
                            setMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition
                            ${
                                activeSection === 'perfil'
                                    ? 'bg-white text-emerald-600 font-semibold'
                                    : 'hover:bg-emerald-700'
                            }
                        `}
                    >
                        Meu Perfil
                    </button>
                </nav>

                <div className="p-4 border-t border-emerald-700">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 font-semibold transition"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO */}
            <main className="flex-1 overflow-auto">

                {/* HEADER MOBILE */}
                <header className="md:hidden flex items-center gap-4 p-4 bg-white shadow-sm">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="text-2xl font-bold"
                    >
                        ☰
                    </button>
                    <span className="font-semibold text-gray-700">
                        Painel do Usuário
                    </span>
                </header>

                <div className="p-4 md:p-8">
                    {activeSection === 'home' && <Home user={user} />}

                    {activeSection === 'disponiveis' && (
                        <CursosDisponiveis
                            userId={user._id}
                            onEstudar={(id) => {
                                setCursoId(id);
                                setActiveSection('curso-conteudo');
                            }}
                        />
                    )}

                    {activeSection === 'curso-conteudo' && cursoId && (
                        <CursoConteudo cursoId={cursoId} />
                    )}

                    {activeSection === 'perfil' && (
                        <PerfilAluno user={user} />
                    )}
                </div>
            </main>
        </div>
    );
}
