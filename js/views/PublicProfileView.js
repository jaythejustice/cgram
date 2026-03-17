import AbstractView from './AbstractView.js';
import { getUserById } from '../services/dbService.js';
import { auth } from '../services/firebaseConfig.js';

export default class PublicProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | User Profile');
    }

    async getHtml() {
        return `
            <section id="public-profile-screen" class="screen active">
                <header class="chat-header">
                    <button class="icon-btn" onclick="window.history.back()"><i class="fa-solid fa-arrow-left"></i></button>
                    <h1 class="logo" id="public-header-username" style="font-size: 18px;">Profile</h1>
                    <div style="width: 24px;"></div>
                </header>
                <div style="padding: 16px;">
                    <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <img id="public-profile-avatar" src="assets/default-avatar.png" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 20px; border: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; flex-grow: 1; text-align: center;">
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Posts</div></div>
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Followers</div></div>
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Following</div></div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div style="font-weight: 600;" id="public-display-name">Loading...</div>
                        <div style="color: var(--text-secondary); font-size: 14px;" id="public-text"></div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-primary" style="flex-grow: 1;">Follow</button>
                        <button class="btn-secondary" id="message-btn-trigger" style="flex-grow: 1;">Message</button>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        const targetUserId = localStorage.getItem('viewUserId');
        if (!targetUserId) return;
        
        try {
            const userData = await getUserById(targetUserId);
            if (userData) {
                document.getElementById('public-header-username').textContent = userData.username || "Profile";
                document.getElementById('public-display-name').textContent = userData.displayName || "User";
                document.getElementById('public-text').textContent = userData.bio || "";
                if (userData.photoURL) document.getElementById('public-profile-avatar').src = userData.photoURL;
            }
        } catch (e) { console.error(e); }

        const msgBtn = document.getElementById('message-btn-trigger');
        if (msgBtn) {
            msgBtn.addEventListener('click', () => {
                window.location.hash = '#/chat';
            });
        }
    }
}