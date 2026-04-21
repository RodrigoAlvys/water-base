import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyAJ1lP0p0e1zCj_sznkHzo6WH-8tj4mwB4",
    authDomain: "water-acid.firebaseapp.com",
    projectId: "water-acid",
    storageBucket: "water-acid.firebasestorage.app",
    messagingSenderId: "289352085555",
    appId: "1:289352085555:web:828765e0f4223c4c527346"
};

const app = initializeApp(firebaseConfig);

export { app, firebaseConfig };
