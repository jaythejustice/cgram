/**
 * ============================================================================
 * FIREBASE CONFIGURATION
 * ============================================================================
 * Initializes the Firebase SDK and exports the auth and db objects 
 * so other files can use them securely.
 * ============================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDtTWrs0hPWyclYorQ1jxFJ_JPBSMnrjv4",
    authDomain: "aizengram.firebaseapp.com",
    projectId: "aizengram",
    storageBucket: "aizengram.firebasestorage.app",
    messagingSenderId: "101244739091",
    appId: "1:101244739091:web:030bae57cbdec05d50e9e6",
    measurementId: "G-W68VZ1NY6B"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);

// Export these so our other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();