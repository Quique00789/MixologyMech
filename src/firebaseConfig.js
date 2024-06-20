// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';


// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYpo48YX6YW9c2SPi5-KwFAtISTK91KFc",
    authDomain: "mixologymech.firebaseapp.com",
    projectId: "mixologymech",
    storageBucket: "mixologymech.appspot.com",
    messagingSenderId: "202161090929",
    appId: "1:202161090929:web:ce56fea156886114bb06d0",
    measurementId: "G-CQYC412V3V"
  };
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { db, auth, database, analytics };
