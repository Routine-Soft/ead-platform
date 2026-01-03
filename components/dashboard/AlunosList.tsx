'use client';

import { useState, useEffect } from 'react';

interface User {
    _id: string;
    name?: string;
    email: string;
    username?: string;
    phone?: string;
    createdAt?: string;
}

export default function AlunosList() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<User>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/user`);
            const data = await response.json();

            if (response.ok) {
                setUsers(data.users || []);
            } else {
                setError(data.error || 'Erro ao carregar alunos');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este aluno?')) return;

        try {
            const response = await fetch(`/api/user/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao deletar aluno');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleEdit = (user: User) => {
        setEditingId(user._id);
        setEditForm({
            name: user.name,
            email: user.email,
            username: user.username,
            phone: user.phone
        });
    };

    const handleSaveEdit = async (id: string) => {
        try {
            const response = await fetch(`/api/user/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                await fetchUsers();
                setEditingId(null);
                setEditForm({});
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao atualizar aluno');
            }
        } catch {
            alert('Erro ao conectar com o servidor');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Carregando alunos...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Alunos Cadastrados</h1>
                <p className="text-gray-600 mt-2">Gerencie os alunos do sistema</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                    Nenhum aluno cadastrado ainda.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        {editingId === user._id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editForm.name || ''}
                                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <input
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editForm.email || ''}
                                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <input
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editForm.username || ''}
                                                        onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <input
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={editForm.phone || ''}
                                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                    />
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-emerald-600 mr-2" onClick={() => handleSaveEdit(user._id)}>Salvar</button>
                                                    <button className="text-gray-600" onClick={handleCancelEdit}>Cancelar</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 text-sm">{user.name || '-'}</td>
                                                <td className="px-6 py-4 text-sm">{user.email}</td>
                                                <td className="px-6 py-4 text-sm">{user.username || '-'}</td>
                                                <td className="px-6 py-4 text-sm">{user.phone || '-'}</td>

                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 mr-3" onClick={() => handleEdit(user)}>Editar</button>
                                                    <button className="text-red-600" onClick={() => handleDelete(user._id)}>Deletar</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
