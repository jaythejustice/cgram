import Router from './router.js';
import AuthView from './views/AuthView.js';
import InboxView from './views/InboxView.js';
import ProfileView from './views/ProfileView.js';
import SearchView from './views/SearchView.js';
import PublicProfileView from './views/PublicProfileView.js';
import ChatView from './views/ChatView.js';
import EditProfileView from './views/EditProfileView.js';
import { monitorAuthState } from './services/authService.js';
import { auth } from './services/firebaseConfig.js';

const App = {
    init() {
        console.log("🚀 Aizengram Engine: Online");

        const routes = [
            { path: '/', view: AuthView },
            { path: '/inbox', view: InboxView },
            { path: '/profile', view: ProfileView },
            { path: '/search', view: SearchView },
            { path: '/public-profile', view: PublicProfileView },
            { path: '/chat', view: ChatView },
            { path: '/edit-profile', view: EditProfileView }
        ];

        const appRouter = new Router(routes);

        const syncUI = () => {
            const hash = window.location.hash || '#/';
            const nav = document.getElementById('bottom-nav');
            const items = document.querySelectorAll('.nav-item');
            
            // Hide nav bar on specific screens
            const hideNav = ['#/chat', '#/edit-profile', '#/'];
            const shouldHide = hideNav.includes(hash) || !auth.currentUser;

            if (nav) nav.style.display = shouldHide ? 'none' : 'flex';

            // Update active tab highlight
            items.forEach(btn => {
                const route = btn.getAttribute('data-route');
                if (`#${route}` === hash) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        };

        // Tab click listeners
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-route');
                if (target) appRouter.navigateTo(target);
            });
        });

        // Auth Monitor
        monitorAuthState((user) => {
            if (user) {
                if (window.location.hash === '' || window.location.hash === '#/') {
                    appRouter.navigateTo('/inbox');
                }
            } else {
                appRouter.navigateTo('/');
            }
            syncUI();
        });

        window.addEventListener('hashchange', syncUI);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());