/**
 * ============================================================================
 * DATABASE SERVICE (FIRESTORE)
 * ============================================================================
 */

import { db, auth } from './firebaseConfig.js';
import { 
    collection, doc, setDoc, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp, where 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 1. Save or Update User Profile
export const saveUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) { throw error; }
};

// 2. Fetch User by ID
export const getUserById = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) { throw error; }
};

// 3. Search Directory: Listen to all users
export const subscribeToAllUsers = (callback) => {
    const usersRef = collection(db, "users");
    return onSnapshot(usersRef, (snapshot) => {
        const users = [];
        snapshot.forEach((docSnap) => users.push(docSnap.data()));
        callback(users);
    });
};

// 4. SEND MESSAGE
export const sendMessage = async (receiverId, text) => {
    const senderId = auth.currentUser.uid;
    try {
        await addDoc(collection(db, "messages"), {
            senderId,
            receiverId,
            text,
            createdAt: serverTimestamp(),
            participants: [senderId, receiverId].sort()
        });
    } catch (error) { throw error; }
};

// 5. LISTEN TO CHAT (Specific Conversation)
export const subscribeToChat = (otherUserId, callback) => {
    const currentUserId = auth.currentUser.uid;
    const messagesRef = collection(db, "messages");
    const q = query(
        messagesRef,
        where("participants", "==", [currentUserId, otherUserId].sort()),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((docSnap) => messages.push({ id: docSnap.id, ...docSnap.data() }));
        callback(messages);
    });
};

// 6. INBOX: Listen to all messages involving the current user
export const subscribeToInboxMessages = (callback) => {
    const currentUserId = auth.currentUser.uid;
    const messagesRef = collection(db, "messages");
    const q = query(
        messagesRef,
        where("participants", "array-contains", currentUserId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((docSnap) => messages.push({ id: docSnap.id, ...docSnap.data() }));
        callback(messages);
    });
};