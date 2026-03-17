import AbstractView from './AbstractView.js';
import { auth } from '../services/firebaseConfig.js';
import { subscribeToAllUsers } from '../services/dbService.js';

export default class SearchView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | Search');
        this.unsubscribe = null;
        this.allUsers = []; 
    }

    async getHtml() {
        return `
            <section id="search-screen" class="screen active">
                <div class="search-bar-container" style="padding-top: 16px;">
                    <div class="search-input-wrapper">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="search" id="global-search-input" class="search-bar" placeholder="Search for users..." autocomplete="off">
                    </div>
                </div>
                <div id="search-results-container" style="flex-grow: 1; overflow-y: auto; padding-top: 10px;">
                    <div class="empty-state">
                        <p>Search for a username or name...</p>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        const resultsContainer = document.getElementById('search-results-container');
        const searchInput = document.getElementById('global-search-input');
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        this.unsubscribe = subscribeToAllUsers((users) => {
            if (!resultsContainer) return;
            this.allUsers = users.filter(user => user.uid !== currentUser.uid);
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                if (searchTerm === '') {
                    resultsContainer.innerHTML = '<div class="empty-state"><p>Search for a username...</p></div>';
                    return;
                }
                
                let matchedUsers = this.allUsers.filter(user => {
                    return (user.username || "").toLowerCase().includes(searchTerm) || 
                           (user.displayName || "").toLowerCase().includes(searchTerm);
                });

                this.renderUsers(matchedUsers, resultsContainer);
            });
        }
    }

    renderUsers(users, container) {
        container.innerHTML = '';
        if (users.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No results found.</p></div>';
            return;
        }

        users.forEach(userData => {
            const div = document.createElement('div');
            div.className = 'user-list-item';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.padding = '10px 16px';
            div.style.cursor = 'pointer';
            div.innerHTML = `
                <img src="${userData.photoURL || 'assets/default-avatar.png'}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 12px; border: 1px solid var(--border-color);">
                <div>
                    <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">${userData.username || userData.email.split('@')[0]}</div>
                    <div style="color: var(--text-secondary); font-size: 13px;">${userData.displayName || 'New User'}</div>
                </div>
            `;
            div.addEventListener('click', () => {
                localStorage.setItem('viewUserId', userData.uid);
                window.location.hash = '#/public-profile';
            });
            container.appendChild(div);
        });
    }
}