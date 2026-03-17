import AbstractView from './AbstractView.js';
import { auth } from '../services/firebaseConfig.js';
import { getUserById, saveUserProfile } from '../services/dbService.js';

export default class EditProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | Edit Profile');
    }

    async getHtml() {
        return `
            <section id="edit-profile-screen" class="screen active">
                <header class="chat-header">
                    <button class="icon-btn" onclick="window.history.back()"><i class="fa-solid fa-xmark"></i></button>
                    <h1 style="font-size: 16px; font-weight: 700; flex-grow: 1; margin-left: 20px;">Edit Profile</h1>
                    <button class="icon-btn" id="save-profile-btn" style="color: var(--accent-blue); font-weight: 700; background: none; border: none; cursor: pointer;">Done</button>
                </header>

                <div style="padding: 20px;">
                    <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px;">
                        <img id="edit-avatar-preview" src="assets/default-avatar.png" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);">
                        <p style="color: var(--accent-blue); font-size: 14px; margin-top: 12px; font-weight: 600; cursor: pointer;">Change Profile Photo</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="edit-group" style="display: flex; flex-direction: column; gap: 5px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; opacity: 0.7; background: var(--bg-secondary); transition: 0.2s;">
                            <label style="font-size: 11px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Name</label>
                            <input type="text" id="edit-display-name" style="border: none; outline: none; background: transparent; color: var(--text-primary); font-size: 16px;">
                        </div>

                        <div class="edit-group" style="display: flex; flex-direction: column; gap: 5px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; opacity: 0.7; background: var(--bg-secondary); transition: 0.2s;">
                            <label style="font-size: 11px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Username</label>
                            <input type="text" id="edit-username" style="border: none; outline: none; background: transparent; color: var(--text-primary); font-size: 16px;">
                        </div>

                        <div class="edit-group" style="display: flex; flex-direction: column; gap: 5px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; opacity: 0.7; background: var(--bg-secondary); transition: 0.2s;">
                            <label style="font-size: 11px; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Bio</label>
                            <textarea id="edit-bio" rows="3" style="border: none; outline: none; background: transparent; color: var(--text-primary); font-size: 16px; resize: none; font-family: inherit;"></textarea>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        const user = auth.currentUser;
        if (!user) return;

        // Visual Interaction Logic
        const groups = document.querySelectorAll('.edit-group');
        groups.forEach(group => {
            const input = group.querySelector('input, textarea');
            input.addEventListener('focus', () => {
                group.style.opacity = '1';
                group.style.borderColor = 'var(--text-primary)';
                group.style.backgroundColor = 'var(--bg-primary)';
            });
            input.addEventListener('blur', () => {
                group.style.opacity = '0.7';
                group.style.borderColor = 'var(--border-color)';
                group.style.backgroundColor = 'var(--bg-secondary)';
            });
        });

        // Load Initial Data
        try {
            const userData = await getUserById(user.uid);
            if (userData) {
                document.getElementById('edit-display-name').value = userData.displayName || "";
                document.getElementById('edit-username').value = userData.username || "";
                document.getElementById('edit-bio').value = userData.bio || "";
                if (userData.photoURL) document.getElementById('edit-avatar-preview').src = userData.photoURL;
            }
        } catch (e) { console.error(e); }

        // Save Logic
        document.getElementById('save-profile-btn').addEventListener('click', async () => {
            const data = {
                displayName: document.getElementById('edit-display-name').value.trim(),
                username: document.getElementById('edit-username').value.trim().toLowerCase().replace(/\s/g, ''),
                bio: document.getElementById('edit-bio').value.trim(),
                uid: user.uid,
                email: user.email
            };
            if (!data.username) return alert("Username is required");
            await saveUserProfile(user.uid, data);
            window.history.back();
        });
    }
}