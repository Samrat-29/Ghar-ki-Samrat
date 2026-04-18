let currentAIProperties = [];
document.addEventListener('DOMContentLoaded', async () => {
  await Auth.init();
  loadProperties();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initModals();
  initContactForm();
  initCounters();
  initSearch();
  initLocationAutocomplete();
  initChatbot();
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => Auth.logout());
  });
});
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    });
  });
}
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      overlay.classList.toggle('open');
      hamburger.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (overlay) overlay.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const hamburger = document.getElementById('hamburger');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (hamburger) hamburger.classList.remove('active');
  document.body.style.overflow = '';
}
function initModals() {
  const loginModal = document.getElementById('login-modal');
  if (!loginModal) return;
  function switchAuthView(viewId) {
    const vLogin = document.getElementById('view-login');
    const vRegister = document.getElementById('view-register');
    const vForgot = document.getElementById('view-forgot-password');
    if (vLogin) vLogin.style.display = 'none';
    if (vRegister) vRegister.style.display = 'none';
    if (vForgot) vForgot.style.display = 'none';
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';
  }
  document.querySelectorAll('[data-open="login"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      loginModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      switchAuthView('view-login');
    });
  });
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', () => {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.querySelectorAll('.auth-toggle-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchAuthView(target);
    });
  });
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        if (type === 'text') {
          btn.style.color = 'var(--primary)';
        } else {
          btn.style.color = '';
        }
      }
    });
  });
  document.getElementById('form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const mobile = document.getElementById('login-mobile').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Logging in...';
    errorEl.textContent = '';
    const result = await Auth.login(mobile, password);
    if (result.success) {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
      showToast('Welcome back! 🏠', 'success');
      setTimeout(() => location.reload(), 500);
    } else {
      errorEl.textContent = result.message;
    }
    btn.disabled = false;
    btn.textContent = 'Log In';
  });
  document.getElementById('form-register')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const name = document.getElementById('register-name').value;
    const mobile = document.getElementById('register-mobile').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creating account...';
    errorEl.textContent = '';
    const result = await Auth.register(name, mobile, password);
    if (result.success) {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
      showToast('Account created successfully! 🏠', 'success');
      setTimeout(() => location.reload(), 500);
    } else {
      errorEl.textContent = result.message;
    }
    btn.disabled = false;
    btn.textContent = 'Sign Up';
  });
  document.getElementById('form-forgot-password')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const mobile = document.getElementById('forgot-mobile').value;
    const newPassword = document.getElementById('forgot-password-new').value;
    const errorEl = document.getElementById('forgot-error');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Updating...';
    errorEl.textContent = '';
    const result = await Auth.forgotPassword(mobile, newPassword);
    if (result.success) {
      showToast('Password reset successfully! Please log in.', 'success');
      switchAuthView('view-login');
      document.getElementById('form-forgot-password').reset();
    } else {
      errorEl.textContent = result.message;
    }
    btn.disabled = false;
    btn.textContent = 'Update Password';
  });
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
}
function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  if (!searchBtn) return;
  searchBtn.addEventListener('click', () => {
    const cityText = document.getElementById('search-city')?.value || '';
    const city = cityText.trim() ? cityText.trim() : 'all';
    const type = document.getElementById('search-type')?.value || 'all';
    const price = document.getElementById('search-price')?.value || 'all';
    let params = new URLSearchParams();
    if (city !== 'all') params.set('city', city);
    if (type !== 'all') params.set('type', type);
    if (price !== 'all') {
      const [min, max] = price.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    loadProperties(params.toString());
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  });
}
function initLocationAutocomplete() {
  const input = document.getElementById('search-city');
  const suggestionsBox = document.getElementById('city-suggestions');
  if (!input || !suggestionsBox) return;
  let debounceTimer;
  let activeIndex = -1;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    activeIndex = -1;
    if (query.length < 2) {
      suggestionsBox.style.display = 'none';
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const suggestRes = await fetch(`/suggest?q=${encodeURIComponent(query)}`);
        const suggestions = await suggestRes.json();
        const { cities, areas, types } = suggestions;
        const hasResults = cities.length || areas.length || types.length;
        if (hasResults) {
          let html = '';
          if (cities.length) {
            html += '<li class="suggest-category">📍 Cities</li>';
            html += cities.map(c => `<li class="suggestion-item" data-name="${c}"><span class="suggestion-title">${highlightMatch(c, query)}</span></li>`).join('');
          }
          if (areas.length) {
            html += '<li class="suggest-category">🏘️ Areas</li>';
            html += areas.map(a => `<li class="suggestion-item" data-name="${a}"><span class="suggestion-title">${highlightMatch(a, query)}</span></li>`).join('');
          }
          if (types.length) {
            html += '<li class="suggest-category">🏠 Property Types</li>';
            html += types.map(t => `<li class="suggestion-item" data-name="${t}"><span class="suggestion-title">${highlightMatch(t, query)}</span></li>`).join('');
          }
          suggestionsBox.innerHTML = html;
          suggestionsBox.style.display = 'block';
          addSuggestionClickListeners();
          return;
        }
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=8`);
        const data = await res.json();
        if (data && data.length > 0) {
          suggestionsBox.innerHTML = data.map(item => `
            <li class="suggestion-item" data-name="${item.display_name.split(',')[0].trim()}">
              <span class="suggestion-title">${item.display_name.split(',')[0]}</span>
              <span class="suggestion-desc">${item.display_name}</span>
            </li>
          `).join('');
          suggestionsBox.style.display = 'block';
          addSuggestionClickListeners();
        } else {
          suggestionsBox.innerHTML = '<li class="suggestion-item" style="color:#9ca3af;">No results found</li>';
          suggestionsBox.style.display = 'block';
        }
      } catch (err) {
        console.error('Suggestion fetch error:', err);
      }
    }, 300);
  });
  input.addEventListener('keydown', (e) => {
    const items = suggestionsBox.querySelectorAll('.suggestion-item[data-name]');
    if (!items.length || suggestionsBox.style.display === 'none') return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateKeyboardHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateKeyboardHighlight(items);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      input.value = items[activeIndex].getAttribute('data-name');
      suggestionsBox.style.display = 'none';
      activeIndex = -1;
    } else if (e.key === 'Escape') {
      suggestionsBox.style.display = 'none';
      activeIndex = -1;
    }
  });
  function updateKeyboardHighlight(items) {
    items.forEach((li, i) => {
      li.classList.toggle('keyboard-active', i === activeIndex);
    });
    if (activeIndex >= 0 && items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }
  function addSuggestionClickListeners() {
    suggestionsBox.querySelectorAll('.suggestion-item[data-name]').forEach(li => {
      li.addEventListener('click', () => {
        input.value = li.getAttribute('data-name');
        suggestionsBox.style.display = 'none';
      });
    });
  }
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });
}
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<strong class="suggest-highlight">$1</strong>');
}
async function loadProperties(queryString = '') {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:#9ca3af;">
      <div class="spinner"></div>
      <p style="margin-top:12px;">Searching properties...</p>
    </div>`;
  try {
    const searchUrl = queryString ? `/api/search?${queryString}` : '/api/search';
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data.properties && data.properties.length > 0) {
      currentAIProperties = data.properties;
      sessionStorage.setItem('aiProperties', JSON.stringify(data.properties));
      showSourceBanner(data.source, data.message);
      renderProperties(data.properties, grid);
      return;
    }
  } catch (err) {
    console.warn('AI search failed, trying local...', err);
  }
  try {
    const url = queryString ? `/properties?${queryString}` : '/properties';
    const res = await fetch(url);
    const properties = await res.json();
    showSourceBanner('fallback', 'Live data unavailable — showing verified listings');
    renderProperties(properties, grid);
  } catch (err) {
    grid.innerHTML = '<p class="text-center text-gray-400" style="grid-column:1/-1;padding:60px 0;">Unable to load properties.</p>';
  }
}
function showSourceBanner(source, message) {
  const existing = document.getElementById('source-banner');
  if (existing) existing.remove();
  const propertiesSection = document.getElementById('properties');
  if (!propertiesSection) return;
  const banner = document.createElement('div');
  banner.id = 'source-banner';
  banner.className = `source-banner source-${source}`;
  if (source === 'ai') {
    banner.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      <span>${message}</span>
      <span class="source-badge">AI Powered</span>`;
  } else {
    banner.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${message}</span>`;
  }
  const header = propertiesSection.querySelector('.properties-header');
  if (header) {
    header.after(banner);
  }
}
function formatINR(amount) {
  if (amount >= 10000000) {
    return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + ' L';
  }
  return '₹' + amount.toLocaleString('en-IN');
}
function renderProperties(properties, container) {
  if (!properties.length) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:#9ca3af;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;display:block;">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <p style="font-weight:600;font-size:16px;color:#6b7280;">No properties found</p>
        <p style="font-size:14px;margin-top:4px;">Try adjusting your search filters.</p>
      </div>`;
    return;
  }
  container.innerHTML = properties.map(prop => `
    <div class="property-card animate-on-scroll" data-id="${prop.id}">
      <div class="property-card-image">
        <img src="${prop.image}" alt="${prop.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'" />
        <span class="property-tag">${prop.tag}</span>
        ${prop.source === 'ai' ? '<span class="property-ai-badge">✦ AI</span>' : ''}
        <button class="btn-wishlist" onclick="addToCart('${prop.id}')" title="Add to Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM20 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>
      </div>
      <div class="property-card-body">
        <div class="property-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${prop.location}
        </div>
        <h3 class="property-title">${prop.title}</h3>
        <div class="property-specs">
          ${prop.bedrooms ? `<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v11m0-4h18m0 4V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3"/><path d="M7 11V7h4v4m6 0V7h4v4"/></svg> ${prop.bedrooms} Beds</span>` : ''}
          ${prop.bathrooms ? `<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2.25"/></svg> ${prop.bathrooms} Baths</span>` : ''}
          ${prop.area ? `<span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> ${prop.area} sq.ft</span>` : ''}
        </div>
        <div class="property-price-row">
          <span class="property-price">${formatINR(prop.price)}</span>
          <span class="property-type-badge">${prop.type}</span>
        </div>
        <div class="property-actions">
          <a href="/property.html?id=${prop.id}${prop.source === 'ai' ? '&source=ai' : ''}" class="btn-view-details">View Details</a>
          <button class="btn-contact-quick" onclick="openWhatsApp('${prop.phone || '+91 98765 43210'}', '${prop.title.replace(/'/g, "\\'")}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}
async function addToCart(propertyId) {
  const user = Auth.checkAuth();
  if (!user) {
    showToast('Please log in to add items to cart.', 'warning');
    document.getElementById('login-modal')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    return;
  }
  const aiProp = currentAIProperties.find(p => p.id === propertyId);
  try {
    const body = { propertyId };
    if (aiProp) {
      body.propertyData = aiProp;
    }
    const res = await fetch('/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      showToast('Added to cart! 🛒', 'success');
      Auth.updateCartCount();
    } else {
      showToast(data.message, 'info');
    }
  } catch (err) {
    showToast('Failed to add to cart.', 'error');
  }
}
async function removeFromCart(propertyId) {
  try {
    const res = await fetch(`/cart/${propertyId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Removed from cart.', 'info');
      Auth.updateCartCount();
      if (typeof loadCartItems === 'function') loadCartItems();
    }
  } catch (err) {
    showToast('Failed to remove from cart.', 'error');
  }
}
function openWhatsApp(phone, propertyTitle) {
  const cleanPhone = phone.replace(/[\s+]/g, '');
  const message = encodeURIComponent(`Hi! I'm interested in the property: "${propertyTitle}" listed on Ghar ki Samrat. Can you share more details?`);
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
}
function callSeller(phone) {
  window.location.href = `tel:${phone}`;
}
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email')?.value || '';
    const phone = document.getElementById('contact-phone')?.value || '';
    const message = document.getElementById('contact-message').value;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Sending...';
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Message sent! We\'ll get back to you soon. 📩', 'success');
        form.reset();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Failed to send message.', 'error');
    }
    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
}
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.animate-on-scroll:not(.animate-in)').forEach(el => observer.observe(el));
}
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
function initChatbot() {
  const fab = document.getElementById('chatbot-fab');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const messagesEl = document.getElementById('chatbot-messages');
  const suggestionsEl = document.getElementById('chatbot-suggestions');
  if (!fab || !chatWindow) return;
  fab.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      input?.focus();
    }
  });
  closeBtn?.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });
  suggestionsEl?.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      if (msg) sendChatMessage(msg);
    });
  });
  sendBtn?.addEventListener('click', () => {
    const msg = input?.value.trim();
    if (msg) sendChatMessage(msg);
  });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const msg = input.value.trim();
      if (msg) sendChatMessage(msg);
    }
  });
  async function sendChatMessage(message) {
    if (!messagesEl || !input) return;
    if (suggestionsEl) suggestionsEl.style.display = 'none';
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-message user-message';
    userBubble.innerHTML = `<div class="chat-bubble">${escapeHtml(message)}</div>`;
    messagesEl.appendChild(userBubble);
    input.value = '';
    scrollChat();
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typing);
    scrollChat();
    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      typing.remove();
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-message bot-message';
      botBubble.innerHTML = `<div class="chat-bubble">${escapeHtml(data.reply || 'Sorry, something went wrong.')}</div>`;
      messagesEl.appendChild(botBubble);
      scrollChat();
    } catch (err) {
      typing.remove();
      const errBubble = document.createElement('div');
      errBubble.className = 'chat-message bot-message';
      errBubble.innerHTML = `<div class="chat-bubble">Sorry, I couldn't connect. Please try again.</div>`;
      messagesEl.appendChild(errBubble);
      scrollChat();
    }
  }
  function scrollChat() {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}