// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-real-estate-10c08.firebaseapp.com",
    projectId: "mern-real-estate-10c08",
    storageBucket: "mern-real-estate-10c08.appspot.com",
    messagingSenderId: "1048163219215",
    appId: "1:1048163219215:web:509db04ca42bdcb765b07a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);