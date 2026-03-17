import AbstractView from './AbstractView.js';
import { auth } from '../services/firebaseConfig.js';
import { logoutUser } from '../services/authService.js';
import { getUserById } from '../services/dbService.js';

export default class ProfileView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | My Profile');
    }

    async getHtml() {
        return `
            <section id="profile-screen" class="screen active">
                <header class="chat-header">
                    <h1 class="logo" id="header-username" style="font-size: 18px;">Profile</h1>
                    <button class="icon-btn" id="settings-btn"><i class="fa-solid fa-bars"></i></button>
                </header>

                <div style="padding: 16px;">
                    <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <img id="profile-avatar" src="assets/default-avatar.png" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-right: 20px; border: 1px solid var(--border-color);">
                        <div style="display: flex; justify-content: space-between; flex-grow: 1; text-align: center;">
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Posts</div></div>
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Followers</div></div>
                            <div><div style="font-weight: 700;">0</div><div style="font-size: 12px;">Following</div></div>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <div style="font-weight: 600;" id="profile-display-name">User</div>
                        <div style="color: var(--text-secondary); font-size: 14px;" id="profile-text">No bio yet.</div>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <button class="btn-secondary" id="edit-profile-trigger" style="flex-grow: 1;">Edit Profile</button>
                        <button class="btn-secondary" style="flex-grow: 1;">Share Profile</button>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <button id="logout-btn" class="btn-secondary" style="width: 100%; color: var(--danger); border-color: var(--danger);">Log Out</button>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userData = await getUserById(user.uid);
            if (userData) {
                document.getElementById('header-username').textContent = userData.username || "Profile";
                document.getElementById('profile-display-name').textContent = userData.displayName || "User";
                document.getElementById('profile-text').textContent = userData.bio || "No bio yet.";
                if (userData.photoURL) document.getElementById('profile-avatar').src = userData.photoURL;
            }
        } catch (err) { console.error(err); }

        document.getElementById('edit-profile-trigger').addEventListener('click', () => {
            window.location.hash = '#/edit-profile';
        });

        document.getElementById('logout-btn').addEventListener('click', async () => {
            await logoutUser();
        });
    }
}