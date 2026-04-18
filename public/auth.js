const Auth = (() => {
  let currentUser = null;
  async function init() {
    try {
      const userRes = await fetch('/auth/user');
      const userData = await userRes.json();
      if (userData.authenticated) {
        currentUser = userData.user;
      }
      updateUI();
      return currentUser;
    } catch (err) {
      console.error('Auth init failed:', err);
      return null;
    }
  }
  async function login(mobile, password) {
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
      });
      const data = await res.json();
      if (data.success) {
        currentUser = data.user;
        updateUI();
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error.' };
    }
  }
  async function register(name, mobile, password) {
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, password })
      });
      const data = await res.json();
      if (data.success) {
        currentUser = data.user;
        updateUI();
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error.' };
    }
  }
  async function forgotPassword(mobile, newPassword) {
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, newPassword })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Network error.' };
    }
  }
  function logout() {
    currentUser = null;
    window.location.href = '/logout';
  }
  function checkAuth() {
    return currentUser;
  }
  function protectRoute() {
    if (!currentUser) {
      window.location.href = '/';
      return false;
    }
    return true;
  }
  function updateUI() {
    const userMenu = document.getElementById('user-menu');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    if (currentUser) {
      if (userMenu) {
        userMenu.style.display = 'flex';
        const nameEl = userMenu.querySelector('.user-name');
        if (nameEl) nameEl.textContent = currentUser.name;
      }
      if (mobileUserMenu) {
        mobileUserMenu.style.display = 'flex';
        const nameEl = mobileUserMenu.querySelector('.user-name');
        if (nameEl) nameEl.textContent = currentUser.name;
      }
      updateCartCount();
    } else {
      const path = window.location.pathname;
      if (path !== '/' && path !== '/landing.html' && path !== '/login.html' && path !== '/public/landing.html' && path !== '/sell.html' && path !== '/dashboard.html') {
        window.location.href = '/login.html';
      }
    }
  }
  async function updateCartCount() {
    try {
      const res = await fetch('/cart/count');
      const data = await res.json();
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = data.count;
        el.style.display = data.count > 0 ? 'flex' : 'none';
      });
    } catch (err) {}
  }
  return { init, login, register, forgotPassword, logout, checkAuth, protectRoute, updateUI, updateCartCount };
})();