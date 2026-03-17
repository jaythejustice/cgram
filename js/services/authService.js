/**
 * ============================================================================
 * AUTHENTICATION SERVICE
 * ============================================================================
 * Handles all login, signup, and logout requests to Firebase.
 * ============================================================================
 */

import { auth, googleProvider } from './firebaseConfig.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// 1. Log in with Email/Password
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// 2. Sign up with new Email/Password
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

// 3. Log in with Google
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        throw error;
    }
};

// 4. Log out
export const logoutUser = async () => {
    return await signOut(auth);
};

// 5. Monitor if a user is logged in or out
export const monitorAuthState = (callback) => {
    onAuthStateChanged(auth, callback);
};