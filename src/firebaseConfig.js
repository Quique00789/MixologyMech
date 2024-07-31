import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
    apiKey: "AIzaSyCpt2kOMCywKnoH_YMoxLx-0E2tOHaVRJg",
    authDomain: "mixology2-4bc8c.firebaseapp.com",
    databaseURL: "https://mixology2-4bc8c-default-rtdb.firebaseio.com",
    projectId: "mixology2-4bc8c",
    storageBucket: "mixology2-4bc8c.appspot.com",
    messagingSenderId: "394051080426",
    appId: "1:394051080426:web:244dc0e9788198ecee8793",
    measurementId: "G-7V13WE84T0"
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
