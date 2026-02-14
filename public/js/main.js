document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Element Selectors ---
  const selectors = {
    toggle: document.getElementById('menu-toggle'),
    nav: document.getElementById('nav-links'),
    overlay: document.getElementById('menu-overlay'),
    loginModal: document.getElementById('loginModal'),
    openLoginBtn: document.getElementById('openLoginBtn'),
  };

  // --- 2. Shared Functions ---
  const closeMenu = () => {
    selectors.nav?.classList.remove('active');
    selectors.toggle?.classList.remove('active');
    selectors.overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const isOpen = selectors.nav?.classList.toggle('active');
    selectors.toggle?.classList.toggle('active');
    selectors.overlay?.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  // --- 3. Event Listeners (With Null Checks) ---

  // Burger Toggle
  selectors.toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Clicking the dark overlay to close
  selectors.overlay?.addEventListener('click', closeMenu);

  // Close menu when clicking any link
  selectors.nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // --- 4. Login Modal Logic ---

  // This is where your bug was: openLoginBtn might be missing if logged in!
  if (selectors.openLoginBtn && selectors.loginModal) {
    selectors.openLoginBtn.addEventListener('click', () => {
      // Close mobile menu first if it's open
      closeMenu();
      // Open the Lit component
      selectors.loginModal.open = true;
      document.body.style.overflow = 'hidden';
    });

    // Handle the custom event from our Lit component
    selectors.loginModal.addEventListener('login-success', () => {
      // Refresh the page to update Nunjucks nav (Hello, User!)
      window.location.reload();
    });
  }

  // --- 5. Global Clean-up ---
  // If user hits the "Back" button or switches tabs, clean the UI
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') closeMenu();
  });
});
