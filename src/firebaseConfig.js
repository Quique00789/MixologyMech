import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyB0Xl3511ZNyGQqzc-5DvChqFVtAkeUIS8",
  authDomain: "realtimemixology.firebaseapp.com",
  databaseURL: "https://realtimemixology-default-rtdb.firebaseio.com",
  projectId: "realtimemixology",
  storageBucket: "realtimemixology.appspot.com",
  messagingSenderId: "188470696917",
  appId: "1:188470696917:web:98e48d60c02ae9cc05bb5c",
  measurementId: "G-EF72R7FPW5"
};



// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Función para iniciar sesión con Googleyyy
const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        throw error;
    }
};

export { auth, database, analytics, signInWithGoogle };
