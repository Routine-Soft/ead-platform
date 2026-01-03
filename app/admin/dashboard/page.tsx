'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Home from '@/components/dashboard/Home';
import CursosList from '@/components/dashboard/CursosList';
import CriarCurso from '@/components/dashboard/CriarCurso';
import ProvasList from '@/components/dashboard/ProvasList';
import CriarProva from '@/components/dashboard/CriarProva';
import AlunosList from '@/components/dashboard/AlunosList';
import SolicitacoesMatricula from '@/components/dashboard/SolicitacoesMatricula';

type ActiveSection =
  | 'home'
  | 'cursos'
  | 'criar-curso'
  | 'provas'
  | 'criar-prova'
  | 'alunos'
  | 'solicitacoes-matricula';

type UserAdmin = {
  _id: string;
  name: string;
  email: string;
};

export default function UserAdminDashboard() {
  const router = useRouter();

  const [activeSection, setActiveSection] =
    useState<ActiveSection>('home');
  const [useradmin, setUseradmin] = useState<UserAdmin | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const useradminData = localStorage.getItem('useradmin');
    if (!useradminData) {
      router.push('/login/useradmin');
      return;
    }

    const parsed: UserAdmin = JSON.parse(useradminData);
    queueMicrotask(() => {
      setUseradmin(parsed);
    })
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('useradmin');
    router.push('/login/useradmin');
  };

  if (!useradmin) {
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
          text-white flex flex-col w-64
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
            Admin: {useradmin.name || useradmin.email}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'cursos', label: 'Documentos' },
            { id: 'criar-curso', label: 'Criar Documento' },
            { id: 'alunos', label: 'Clientes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as ActiveSection);
                setMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition
                ${
                  activeSection === item.id
                    ? 'bg-white text-emerald-600 font-semibold'
                    : 'hover:bg-emerald-700'
                }
              `}
            >
              {item.label}
            </button>
          ))}
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
            Painel Administrativo
          </span>
        </header>

        <div className="p-4 md:p-8">
          {activeSection === 'home' && (
            <Home onNavigate={(s) => setActiveSection(s as ActiveSection)} />
          )}

          {activeSection === 'cursos' && (
            <CursosList onEdit={() => setActiveSection('criar-curso')} />
          )}

          {activeSection === 'criar-curso' && (
            <CriarCurso onSuccess={() => setActiveSection('cursos')} />
          )}

          {activeSection === 'provas' && (
            <ProvasList onEdit={() => setActiveSection('criar-prova')} />
          )}

          {activeSection === 'criar-prova' && (
            <CriarProva onSuccess={() => setActiveSection('provas')} />
          )}

          {activeSection === 'alunos' && <AlunosList />}

          {activeSection === 'solicitacoes-matricula' && (
            <SolicitacoesMatricula />
          )}
        </div>
      </main>
    </div>
  );
}
