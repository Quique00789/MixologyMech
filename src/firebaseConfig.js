// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
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
const database = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { database, auth, analytics };
