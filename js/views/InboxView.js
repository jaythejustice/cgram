/**
 * ============================================================================
 * INBOX VIEW MODULE
 * ============================================================================
 */

import AbstractView from './AbstractView.js';
import { subscribeToInboxMessages, getUserById } from '../services/dbService.js';
import { auth } from '../services/firebaseConfig.js';

export default class InboxView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | Messages');
        this.unsubscribe = null;
    }

    async getHtml() {
        return `
            <section id="inbox-screen" class="screen active">
                <header class="chat-header">
                    <h1 class="logo">Aizengram</h1>
                    <button class="icon-btn" id="new-chat-btn"><i class="fa-regular fa-pen-to-square"></i></button>
                </header>

                <div class="search-bar-container">
                    <div class="search-input-wrapper">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="search" class="search-bar" placeholder="Search">
                    </div>
                </div>

                <div id="inbox-container" style="flex-grow: 1; overflow-y: auto;">
                    <div class="empty-state">
                        <p>No messages yet.</p>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        const container = document.getElementById('inbox-container');
        const currentUserId = auth.currentUser.uid;

        // Listen for all messages where the user is a participant
        this.unsubscribe = subscribeToInboxMessages(async (messages) => {
            if (!container) return;
            
            if (messages.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No messages yet.</p></div>';
                return;
            }

            // Group messages by the "other" person to show conversations
            const conversations = {};
            
            for (const msg of messages) {
                const otherId = msg.participants.find(id => id !== currentUserId);
                if (!conversations[otherId]) {
                    conversations[otherId] = msg; // Keep the latest message only
                }
            }

            container.innerHTML = '';
            
            for (const otherId in conversations) {
                const latestMsg = conversations[otherId];
                const otherUser = await getUserById(otherId);
                
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.padding = '12px 16px';
                div.style.alignItems = 'center';
                div.style.cursor = 'pointer';

                div.innerHTML = `
                    <img src="${otherUser?.photoURL || 'assets/default-avatar.png'}" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 12px;">
                    <div style="flex-grow: 1;">
                        <div style="font-weight: 600; font-size: 14px;">${otherUser?.username || 'User'}</div>
                        <div style="color: var(--text-secondary); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">
                            ${latestMsg.text}
                        </div>
                    </div>
                `;

                div.addEventListener('click', () => {
                    localStorage.setItem('viewUserId', otherId);
                    window.location.hash = '#/chat';
                });

                container.appendChild(div);
            }
        });
    }
}