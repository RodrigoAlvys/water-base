import React, { useState } from 'react';
import { auth, db } from '../firebase/config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegister) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await set(ref(db, `profiles/${userCredential.user.uid}`), {
                    email,
                    tipo: 'comum',
                    criadoEm: new Date().toISOString(),
                    anotacoes: {}
                });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            let msg = err.message;
            if (msg.includes('auth/email-already-in-use')) msg = 'Email já cadastrado';
            else if (msg.includes('auth/invalid-email')) msg = 'Email inválido';
            else if (msg.includes('auth/weak-password')) msg = 'Senha muito fraca (mínimo 6 caracteres)';
            else if (msg.includes('auth/wrong-password')) msg = 'Senha incorreta';
            else if (msg.includes('auth/user-not-found')) msg = 'Usuário não encontrado';
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Water Base</h1>
                <h2 className="text-xl mb-4">{isRegister ? 'Registrar' : 'Login'}</h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        {isRegister ? 'Registrar' : 'Entrar'}
                    </button>
                </form>
                
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="w-full mt-3 text-blue-500 hover:text-blue-700 text-sm"
                >
                    {isRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se'}
                </button>
            </div>
        </div>
    );
}

