import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import Login from './components/Login.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileRef = ref(db, `profiles/${user.uid}`);
                const snapshot = await get(profileRef);
                setUserType(snapshot.val()?.tipo || 'comum');
            } else {
                setUserType(null);
            }
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (!user) return <Login />;
    if (userType === 'admin') return <AdminDashboard user={user} />;
    return <UserDashboard user={user} />;
}

export default App;

