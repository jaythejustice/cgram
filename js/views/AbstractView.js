/**
 * ============================================================================
 * ABSTRACT VIEW CLASS
 * ============================================================================
 * Every view (page) in the app extends this blueprint. It guarantees
 * that every page has a standard way to load its HTML and execute its logic.
 * ============================================================================
 */
export default class AbstractView {
    constructor() {
        this.params = {};
    }

    // Set the document title when the page loads
    setTitle(title) {
        document.title = title;
    }

    // Returns the HTML string for the page
    async getHtml() {
        return "";
    }

    // Runs all the event listeners (clicks, submits) AFTER the HTML is injected
    async executeViewLogic() {
        // To be overridden by specific views
    }
}