/**
 * ============================================================================
 * AIZENGRAM - HASH ROUTER
 * ============================================================================
 * Intercepts URL changes and dynamically renders the correct View class
 * into the #view-root div.
 * ============================================================================
 */

export default class Router {
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('view-root');
        
        // Listen for back/forward buttons or hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    // Programmatically navigate to a new screen
    navigateTo(hash) {
        window.location.hash = hash;
    }

    // Determine which view to show based on the URL
    async handleRoute() {
        // Get the current hash (e.g., "#/inbox" becomes "/inbox")
        let path = window.location.hash.replace('#', '') || '/';

        // Find the matching route, or default to the root '/'
        let match = this.routes.find(route => route.path === path);
        
        // 404 Fallback: If route doesn't exist, force them back to start
        if (!match) {
            match = this.routes[0];
            window.location.hash = match.path;
            return; // The hashchange event will re-trigger handleRoute
        }

        // Instantiate the specific View class (e.g., new InboxView())
        const view = new match.view();

        // 1. Inject the HTML into the page
        this.rootElement.innerHTML = await view.getHtml();

        // 2. Fire up the JavaScript listeners for that specific page
        await view.executeViewLogic();
    }
}