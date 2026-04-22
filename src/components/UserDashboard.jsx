import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config.js';
import { signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

export default function UserDashboard({ user }) {
    const [notes, setNotes] = useState({});
    const [form, setForm] = useState({ titulo: '', conteudo: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const snapshot = await get(ref(db, `profiles/${user.uid}/anotacoes`));
        if (snapshot.exists()) setNotes(snapshot.val());
    };

    const saveNotes = async (newNotes) => {
        await set(ref(db, `profiles/${user.uid}/anotacoes`), newNotes);
        setNotes(newNotes);
    };

    const handleSubmit = async () => {
        if (!form.titulo.trim()) return;
        const id = editId || Date.now().toString();
        const newNotes = {
            ...notes,
            [id]: { 
                ...form, 
                criadoEm: notes[id]?.criadoEm || new Date().toISOString(), 
                atualizadoEm: new Date().toISOString() 
            }
        };
        await saveNotes(newNotes);
        setForm({ titulo: '', conteudo: '' });
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (confirm('Excluir esta anotação?')) {
            const newNotes = { ...notes };
            delete newNotes[id];
            await saveNotes(newNotes);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Minhas Anotações</h1>
        <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-600">{user.email}</span>
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
        <h2 className="font-semibold mb-3">{editId ? 'Editar Anotação' : 'Nova Anotação'}</h2>
        <input 
        type="text" 
        placeholder="Título" 
        value={form.titulo}
        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        className="w-full p-2 border rounded mb-2"
        />
        <textarea 
        placeholder="Conteúdo" 
        value={form.conteudo}
        onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
        className="w-full p-2 border rounded mb-2" 
        rows="3"
        />
        <div className="flex gap-2">
        <button 
        onClick={handleSubmit} 
        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
        >
        {editId ? 'Atualizar' : 'Salvar'}
        </button>
        {editId && (
            <button 
            onClick={() => { setForm({ titulo: '', conteudo: '' }); setEditId(null); }}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            >
            Cancelar
            </button>
        )}
        </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(notes).map(([id, note]) => (
            <div key={id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-2">{note.titulo}</h3>
            <p className="text-gray-600 text-sm mb-3">{note.conteudo}</p>
            <div className="text-xs text-gray-400 mb-3">
            {new Date(note.criadoEm).toLocaleDateString()}
            </div>
            <div className="flex gap-2">
            <button 
            onClick={() => { setForm(note); setEditId(id); }} 
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
            Editar
            </button>
            <button 
            onClick={() => handleDelete(id)} 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
            Excluir
            </button>
            </div>
            </div>
        ))}
        </div>

        {Object.keys(notes).length === 0 && (
            <div className="text-center text-gray-500 mt-8">
            Nenhuma anotação ainda. Crie sua primeira anotação!
            </div>
        )}
        </div>
        </div>
    );
}

