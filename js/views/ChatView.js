/**
 * ============================================================================
 * CHAT VIEW MODULE
 * ============================================================================
 * Handles real-time messaging between the current user and a selected recipient.
 * ============================================================================
 */

import AbstractView from './AbstractView.js';
import { getUserById, sendMessage, subscribeToChat } from '../services/dbService.js';
import { auth } from '../services/firebaseConfig.js';

export default class ChatView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | Chat');
        this.unsubscribe = null;
    }

    async getHtml() {
        return `
            <section id="chat-room" class="screen active" style="display: flex; flex-direction: column; height: 100vh;">
                <header class="chat-header" style="flex-shrink: 0;">
                    <button class="icon-btn" onclick="window.history.back()"><i class="fa-solid fa-arrow-left"></i></button>
                    <div style="display: flex; align-items: center; flex-grow: 1; margin-left: 10px;">
                        <img id="chat-user-avatar" src="assets/default-avatar.png" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px; object-fit: cover;">
                        <h1 id="chat-user-name" style="font-size: 16px; font-weight: 600;">Chat</h1>
                    </div>
                </header>

                <div id="messages-container" style="flex-grow: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; background: var(--bg-primary);">
                    <div class="empty-state"><p>Loading conversation...</p></div>
                </div>

                <form id="chat-form" style="padding: 10px; border-top: 1px solid var(--border-color); display: flex; gap: 10px; background: var(--bg-primary); flex-shrink: 0;">
                    <input type="text" id="chat-input" placeholder="Message..." autocomplete="off" style="flex-grow: 1; border: 1px solid var(--border-color); border-radius: 20px; padding: 8px 15px; outline: none; background: var(--bg-secondary); color: var(--text-primary);">
                    <button type="submit" style="color: var(--accent-blue); background: none; border: none; font-weight: 600; font-size: 14px; cursor: pointer;">Send</button>
                </form>
            </section>
        `;
    }

    async executeViewLogic() {
        const otherUserId = localStorage.getItem('viewUserId');
        const container = document.getElementById('messages-container');
        const form = document.getElementById('chat-form');
        const input = document.getElementById('chat-input');
        const currentUser = auth.currentUser;

        if (!otherUserId || !currentUser) return;

        // 1. Load User Header Info
        try {
            const otherUser = await getUserById(otherUserId);
            if (otherUser) {
                document.getElementById('chat-user-name').textContent = otherUser.username || "User";
                if (otherUser.photoURL) {
                    document.getElementById('chat-user-avatar').src = otherUser.photoURL;
                }
            }
        } catch (err) { console.error("Header Error:", err); }

        // 2. Listen for real-time messages
        this.unsubscribe = subscribeToChat(otherUserId, (messages) => {
            if (!container) return;
            container.innerHTML = '';
            
            if (messages.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No messages yet. Say hi!</p></div>';
            }

            messages.forEach(msg => {
                const isMe = msg.senderId === currentUser.uid;
                const bubble = document.createElement('div');
                
                // Bubble Styling
                bubble.style.maxWidth = '75%';
                bubble.style.padding = '8px 14px';
                bubble.style.borderRadius = '18px';
                bubble.style.fontSize = '14px';
                bubble.style.wordBreak = 'break-word';
                bubble.style.alignSelf = isMe ? 'flex-end' : 'flex-start';
                bubble.style.backgroundColor = isMe ? '#0095f6' : '#efefef';
                bubble.style.color = isMe ? '#ffffff' : '#000000';
                
                if (isMe) {
                    bubble.style.borderBottomRightRadius = '4px';
                } else {
                    bubble.style.borderBottomLeftRadius = '4px';
                }

                bubble.textContent = msg.text;
                container.appendChild(bubble);
            });
            
            // Auto-scroll to the bottom of the chat
            container.scrollTop = container.scrollHeight;
        });

        // 3. Handle Message Sending
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;

                input.value = ''; // Clear input immediately for UX
                try {
                    await sendMessage(otherUserId, text);
                } catch (err) {
                    console.error("Send Error:", err);
                    alert("Message failed to send.");
                }
            });
        }
    }
}