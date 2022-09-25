import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
    databaseURL: import.meta.env.VITE_FIREBASE_REALTIME
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);