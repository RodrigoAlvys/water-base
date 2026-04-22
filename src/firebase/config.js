import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAJ1lP0p0e1zCj_sznkHzo6WH-8tj4mwB4",
    authDomain: "water-acid.firebaseapp.com",
    projectId: "water-acid",
    storageBucket: "water-acid.firebasestorage.app",
    messagingSenderId: "289352085555",
    appId: "1:289352085555:web:828765e0f4223c4c527346",
    databaseURL: "https://water-acid-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

