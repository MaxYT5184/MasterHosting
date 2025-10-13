// Firebase Configuration and Authentication
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo-GWT_THjvTYuqpEnMEqgoFH67mxkPPw",
  authDomain: "masterhosting-7e0a7.firebaseapp.com",
  projectId: "masterhosting-7e0a7",
  storageBucket: "masterhosting-7e0a7.firebasestorage.app",
  messagingSenderId: "610453122121",
  appId: "1:610453122121:web:971ba62d7ea21577bb6398",
  measurementId: "G-HTDFYE8WF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export for use in other files
window.firebaseAuth = auth;
window.googleProvider = provider;

// Google Sign-In Function
window.signInWithGoogle = async function() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Signed in successfully:', user.displayName);
    
    // Show success message
    showNotification('success', `Welcome, ${user.displayName || user.email}!`);
    
    // Update UI
    updateAuthUI(user);
    
    return user;
  } catch (error) {
    console.error('❌ Sign-in error:', error);
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      showNotification('error', 'Sign-in cancelled.');
    } else if (error.code === 'auth/unauthorized-domain') {
      showNotification('error', 'Domain not authorized. Please contact support.');
    } else {
      showNotification('error', 'Failed to sign in. Please try again.');
    }
    
    throw error;
  }
};

// Sign Out Function
window.signOutUser = async function() {
  try {
    await signOut(auth);
    console.log('✅ Signed out successfully');
    showNotification('success', 'Signed out successfully!');
    updateAuthUI(null);
  } catch (error) {
    console.error('❌ Sign-out error:', error);
    showNotification('error', 'Failed to sign out.');
  }
};

// Auth State Observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('👤 User is signed in:', user.displayName);
    updateAuthUI(user);
  } else {
    console.log('👤 User is signed out');
    updateAuthUI(null);
  }
});

// Update UI based on auth state
function updateAuthUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userPhoto = document.getElementById('userPhoto');
  
  if (user) {
    // User is signed in
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) {
      userInfo.style.display = 'flex';
      if (userName) userName.textContent = user.displayName;
      if (userEmail) userEmail.textContent = user.email;
      if (userPhoto) userPhoto.src = user.photoURL;
    }
  } else {
    // User is signed out
    if (loginBtn) loginBtn.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
  }
}

// Show notification
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

console.log('🔥 Firebase initialized successfully');
