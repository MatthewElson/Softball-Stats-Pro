import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB0ULn5lSyBCjZcB3gGdPA1UogHxzY_Tdc",
    authDomain: "softball-stats-pro1.firebaseapp.com",
    projectId: "softball-stats-pro1",
    storageBucket: "softball-stats-pro1.appspot.com",
    messagingSenderId: "917318184574",
    appId: "1:917318184574:web:f7e6364c6dc1064235f22f",
    measurementId: "G-JMK650B29S"
  };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);