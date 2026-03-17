/**
 * ============================================================================
 * AUTHENTICATION VIEW MODULE
 * ============================================================================
 * Handles the UI and DOM interactions for the Login and Sign Up screen.
 * Now wired directly to Firebase Authentication.
 * ============================================================================
 */

import AbstractView from './AbstractView.js';
// 1. IMPORT OUR NEW BACKEND SERVICES
import { loginUser, registerUser, loginWithGoogle } from '../services/authService.js';

export default class AuthView extends AbstractView {
    constructor() {
        super();
        this.setTitle('Aizengram | Secure Login');
        this.isSignUpMode = false; 
    }

    async getHtml() {
        return `
            <section id="auth-screen" class="screen auth-screen active" aria-labelledby="auth-title">
                <div class="auth-box">
                    <h1 class="logo auth-logo" id="auth-title">Aizengram</h1>
                    <p class="auth-subtitle">Log in to your account</p>

                    <button type="button" id="google-login-btn" class="btn-google">
                        <i class="fa-brands fa-google"></i> Continue with Google
                    </button>

                    <div class="auth-divider"><span>OR</span></div>

                    <form id="login-form" novalidate>
                        <div class="form-group">
                            <label for="login-email" class="visually-hidden">Email</label>
                            <input type="email" id="login-email" placeholder="Email address" required autocomplete="email">
                        </div>
                        <div class="form-group">
                            <label for="login-password" class="visually-hidden">Password</label>
                            <input type="password" id="login-password" placeholder="Password (min 8 chars)" required minlength="8" autocomplete="current-password">
                        </div>
                        <button type="submit" class="btn-primary" id="login-submit-btn">Log In</button>
                    </form>

                    <div class="auth-links">
                        <button type="button" class="btn-link" id="forgot-password-link">Forgot password?</button>
                        <p>Don't have an account? <button type="button" class="btn-link font-bold" id="toggle-signup-btn">Sign up</button></p>
                    </div>
                </div>
            </section>
        `;
    }

    async executeViewLogic() {
        console.log("AuthView Logic Initialized.");

        const toggleModeBtn = document.getElementById('toggle-signup-btn');
        const submitBtn = document.getElementById('login-submit-btn');
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        const googleBtn = document.getElementById('google-login-btn');

        // Toggle Sign Up / Log In UI
        if (toggleModeBtn) {
            toggleModeBtn.addEventListener('click', () => {
                this.isSignUpMode = !this.isSignUpMode;
                submitBtn.textContent = this.isSignUpMode ? "Create Account" : "Log In";
                toggleModeBtn.textContent = this.isSignUpMode ? "Log In instead" : "Sign up";
            });
        }

        // 2. FIREBASE EMAIL/PASSWORD LOGIN & REGISTRATION
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                
                const email = emailInput.value.trim();
                const password = passInput.value.trim();

                if (!email || password.length < 8) {
                    alert("Please enter a valid email and an 8+ character password.");
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = "Authenticating...";

                try {
                    if (this.isSignUpMode) {
                        await registerUser(email, password);
                        console.log("Registration successful!");
                    } else {
                        await loginUser(email, password);
                        console.log("Login successful!");
                    }
                    // NOTE: The router will automatically move us to the Inbox in the next step!
                } catch (error) {
                    console.error("Auth Error:", error);
                    alert(error.message); // Show Firebase error to the user
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = this.isSignUpMode ? "Create Account" : "Log In";
                }
            });
        }

        // 3. FIREBASE GOOGLE OAUTH LOGIN
        if (googleBtn) {
            googleBtn.addEventListener('click', async () => {
                try {
                    await loginWithGoogle();
                    console.log("Google OAuth successful!");
                } catch (error) {
                    console.error("Google Auth Error:", error);
                    alert("Google login failed or was cancelled.");
                }
            });
        }
    }
}