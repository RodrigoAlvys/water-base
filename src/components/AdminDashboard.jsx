import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config.js';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, remove, update } from 'firebase/database';

export default function AdminDashboard({ user }) {
    const [profiles, setProfiles] = useState({});
    const [form, setForm] = useState({ email: '', senha: '', tipo: 'comum' });

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const snapshot = await get(ref(db, 'profiles'));
        if (snapshot.exists()) setProfiles(snapshot.val());
    };

    const handleCreate = async () => {
        if (!form.email || !form.senha) return;

        if (form.senha.length < 6) {
            alert('Senha deve ter no mínimo 6 caracteres');
            return;
        }

        try {
            const userCred = await createUserWithEmailAndPassword(auth, form.email, form.senha);
            await set(ref(db, `profiles/${userCred.user.uid}`), {
                email: form.email,
                tipo: form.tipo,
                criadoEm: new Date().toISOString(),
                anotacoes: {}
            });
            await loadProfiles();
            setForm({ email: '', senha: '', tipo: 'comum' });
            alert('Perfil criado com sucesso!');
        } catch (error) {
            let msg = error.message;
            if (msg.includes('auth/email-already-in-use')) msg = 'Email já cadastrado';
            alert('Erro: ' + msg);
        }
    };

    const handleUpdate = async (id) => {
        const novoTipo = prompt('Novo tipo (comum/admin):', profiles[id].tipo);
        if (novoTipo && ['comum', 'admin'].includes(novoTipo)) {
            await update(ref(db, `profiles/${id}`), { tipo: novoTipo });
            await loadProfiles();
            alert('Tipo atualizado!');
        }
    };

    const handleDelete = async (id) => {
        if (id === user.uid) {
            alert('Você não pode excluir seu próprio perfil!');
            return;
        }

        if (confirm(`Excluir perfil de ${profiles[id].email}?`)) {
            await remove(ref(db, `profiles/${id}`));
            await loadProfiles();
            alert('Perfil excluído!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin - Gerenciar Perfis</h1>
        <div className="flex gap-4 items-center">
        <span className="text-sm text-red-600 font-semibold">Admin: {user.email}</span>
        <button 
        onClick={() => signOut(auth)} 
        className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
        >
        Sair
        </button>
        </div>
        </div>
        </nav>

        <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="font-semibold mb-3">Criar Novo Perfil</h2>
        <div className="grid gap-3 md:grid-cols-3">
        <input 
        type="email" 
        placeholder="Email" 
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="p-2 border rounded text-sm"
        />
        <input 
        type="password" 
        placeholder="Senha (mínimo 6 caracteres)" 
        value={form.senha}
        onChange={(e) => setForm({ ...form, senha: e.target.value })}
        className="p-2 border rounded text-sm"
        />
        <select 
        value={form.tipo} 
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        className="p-2 border rounded text-sm"
        >
        <option value="comum">Comum</option>
        <option value="admin">Admin</option>
        </select>
        </div>
        <button 
        onClick={handleCreate} 
        className="mt-3 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
        >
        Criar Perfil
        </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
        <thead className="bg-gray-50">
        <tr>
        <th className="p-3 text-left">Email</th>
        <th className="p-3 text-left">Tipo</th>
        <th className="p-3 text-left">Criado em</th>
        <th className="p-3 text-left">Ações</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(profiles).map(([id, profile]) => (
            <tr key={id} className="border-t">
            <td className="p-3">{profile.email}</td>
            <td className="p-3">
            <span className={`px-2 py-1 rounded text-xs ${
                profile.tipo === 'admin' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
            }`}>
            {profile.tipo}
            </span>
            </td>
            <td className="p-3">{new Date(profile.criadoEm).toLocaleDateString()}</td>
            <td className="p-3">
            <div className="flex gap-2">
            <button 
            onClick={() => handleUpdate(id)} 
            className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
            >
            Editar
            </button>
            <button 
            onClick={() => handleDelete(id)} 
            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
            >
            Excluir
            </button>
            </div>
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
        </div>
        </div>
    );
}

