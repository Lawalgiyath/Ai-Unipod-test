/**
 * Authentication Module
 * Secure authentication for admin panel
 */

// DO NOT store credentials in frontend code
// These will be loaded from environment variables via backend
let authConfig = null;

/**
 * Initialize authentication
 */
export async function initAuth() {
  try {
    // Load auth config from secure endpoint (not exposed in frontend)
    const response = await fetch('/.netlify/functions/auth-config');
    if (response.ok) {
      authConfig = await response.json();
    }
  } catch (error) {
    console.error('Failed to load auth config:', error);
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  try {
    // Call secure backend endpoint for authentication
    const response = await fetch('/.netlify/functions/admin-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    const { token, user } = await response.json();
    
    // Store session securely (httpOnly cookie would be better, but using sessionStorage for now)
    sessionStorage.setItem('admin_session', token);
    sessionStorage.setItem('admin_user', JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOut() {
  sessionStorage.removeItem('admin_session');
  sessionStorage.removeItem('admin_user');
  window.location.href = 'login.html';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!sessionStorage.getItem('admin_session');
}

/**
 * Get current user
 */
export function getCurrentUser() {
  const userStr = sessionStorage.getItem('admin_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get auth token for API requests
 */
export function getAuthToken() {
  return sessionStorage.getItem('admin_session');
}

/**
 * Protect admin pages - redirect to login if not authenticated
 */
export function protectAdminPage() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Add auth header to fetch requests
 */
export function authFetch(url, options = {}) {
  const token = getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Auto-logout on session expiry (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const loginTime = sessionStorage.getItem('login_time');

if (loginTime && Date.now() - parseInt(loginTime) > SESSION_DURATION) {
  signOut();
} else if (isAuthenticated() && !loginTime) {
  sessionStorage.setItem('login_time', Date.now().toString());
}
