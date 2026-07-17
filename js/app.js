/**
 * BAMBOO CHICKEN - OFFICIAL WEBSITE CORE SCRIPTS
 * Optimized vanilla JavaScript. High-speed, responsive, lightweight.
 */

// Prevent the browser from automatically forcing the scroll position to the previous section on page refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure the page always starts at the very top of the page (hero/sticky header) upon entry/refresh
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
  initMobileNav();
  initMenuScrollEffects();
  initMealsSlider();
  initLiveStatus();
  initQrTransition();
});

/**
 * Mobile Hamburger Full-Screen Overlay Menu
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const overlay = document.getElementById('mobile-menu-overlay');
  const closeBtn = document.querySelector('.overlay-close');
  const overlayLinks = document.querySelectorAll('.overlay-nav-item, .btn-overlay-order');
  
  let lastFocusedElement = null;
  let scrollPosition = 0;

  if (!toggleBtn || !overlay || !closeBtn) return;

  // Function to open overlay
  const openMenu = () => {
    lastFocusedElement = document.activeElement;
    
    // Save current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('active');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';

    // Focus close button inside overlay
    setTimeout(() => {
      closeBtn.focus();
    }, 50);

    // Add keyboard trap
    document.addEventListener('keydown', handleKeydown);
  };

  // Function to close overlay
  const closeMenu = () => {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('active');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    
    // Enable scroll
    document.body.style.overflow = '';
    
    // Restore previous scroll position
    window.scrollTo(0, scrollPosition);

    // Return focus to trigger button
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    // Remove keyboard trap
    document.removeEventListener('keydown', handleKeydown);
  };

  // Keydown handler for ESC and Tab trap
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableSelectors = 'a[href], button:not([disabled])';
      const focusables = Array.from(overlay.querySelectorAll(focusableSelectors));
      if (focusables.length === 0) return;

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };

  // Event Listeners
  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  // Close overlay when clicking on any menu link and scroll smoothly
  overlayLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Update active states
      overlayLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        
        // Wait for the overlay transition to complete, then scroll smoothly
        setTimeout(() => {
          if (href === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            let targetElement = document.querySelector(href);
            
            // Fallback resolutions for custom targets
            if (!targetElement) {
              if (href === '#promotions') {
                targetElement = document.querySelector('#special-offers');
              } else if (href === '#about') {
                targetElement = document.querySelector('#about-us');
              }
            }
            
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 260); // 260ms matches our 250ms close transition delay perfectly
      } else {
        // External links (Menu & Order Now)
        closeMenu();
      }
    });
  });

  // Handle window resizing (close overlay when scaling back to desktop)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && overlay.classList.contains('active')) {
      closeMenu();
    }
  }, { passive: true });
}

/**
 * Smooth Horizontal Menu Carousel Active State Detection for Mobile swiping
 */
function initMenuScrollEffects() {
  const grid = document.querySelector('.menu-grid');
  const cards = document.querySelectorAll('.menu-card');
  if (!grid || cards.length === 0) return;

  const updateActiveCard = () => {
    if (window.innerWidth > 991) {
      // On desktop layouts, remove the active scaling class
      cards.forEach(card => card.classList.remove('is-active'));
      return;
    }

    const gridRect = grid.getBoundingClientRect();
    const gridCenter = gridRect.left + gridRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(gridCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    cards.forEach(card => {
      if (card === closestCard) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    });
  };

  // Perform updates on container scroll and window resize
  grid.addEventListener('scroll', updateActiveCard, { passive: true });
  window.addEventListener('resize', updateActiveCard, { passive: true });

  // Run immediately on page load
  updateActiveCard();
}

/**
 * Interactive Horizontal Swipe Rail for Complete Meals (Section 4)
 * Supports drag-to-scroll, trackpad horizontal scrolling, and navigation arrows.
 */
function initMealsSlider() {
  const container = document.getElementById('meals-rail-container');
  const prevBtn = document.getElementById('meals-prev-btn');
  const nextBtn = document.getElementById('meals-next-btn');
  if (!container || !prevBtn || !nextBtn) return;

  // Arrow controls
  prevBtn.addEventListener('click', () => {
    const cardWidth = container.querySelector('.meal-card')?.offsetWidth || 420;
    const scrollAmount = cardWidth + 32; // card width + gap
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cardWidth = container.querySelector('.meal-card')?.offsetWidth || 420;
    const scrollAmount = cardWidth + 32; // card width + gap
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Toggle arrows visibility based on scroll position
  const toggleButtons = () => {
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    // Hide prev button if scrolled to the beginning
    if (container.scrollLeft <= 5) {
      prevBtn.style.opacity = '0.3';
      prevBtn.style.pointerEvents = 'none';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
    }

    // Hide next button if scrolled to the end
    if (container.scrollLeft >= maxScrollLeft - 5) {
      nextBtn.style.opacity = '0.3';
      nextBtn.style.pointerEvents = 'none';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
    }
  };

  container.addEventListener('scroll', toggleButtons, { passive: true });
  window.addEventListener('resize', toggleButtons, { passive: true });
  
  // Set up initial button state and retry in case rendering isn't complete
  toggleButtons();
  setTimeout(toggleButtons, 150);

  // Mouse Drag to Scroll for Desktop users
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('active-dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      container.classList.remove('active-dragging');
    }
  });

  container.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      container.classList.remove('active-dragging');
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll-fast multiplier
    container.scrollLeft = scrollLeft - walk;
  });
}

/**
 * Live Status Indicator for Opening Hours (07:00 AM – 08:30 PM Harare, Zimbabwe / UTC+2)
 */
function initLiveStatus() {
  const statusCard = document.getElementById('visit-card-status');
  const pulseDot = document.getElementById('live-pulse');
  const statusText = document.getElementById('live-status-text');
  const servingText = document.getElementById('live-serving-text');
  const timeText = document.getElementById('live-time-text');

  if (!pulseDot || !statusText || !servingText || !timeText) return;

  function updateStatus() {
    const now = new Date();
    // Harare is UTC+2
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const harareTime = new Date(utc + (3600000 * 2));
    
    const hours = harareTime.getHours();
    const minutes = harareTime.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    // 07:00 AM is 7 * 60 = 420
    const openMinutes = 7 * 60;
    // 08:30 PM is 20 * 60 + 30 = 1230
    const closeMinutes = 20 * 60 + 30;

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    if (isOpen) {
      pulseDot.className = 'pulse-dot open';
      statusText.textContent = 'OPEN NOW';
      statusText.className = 'live-text open';
      servingText.textContent = 'Serving Fresh';
      timeText.innerHTML = '07:00 AM <span class="arrow-sep">→</span> 08:30 PM';
      if (statusCard) {
        statusCard.classList.add('is-open');
      }
    } else {
      pulseDot.className = 'pulse-dot closed';
      statusText.textContent = 'CLOSED';
      statusText.className = 'live-text closed';
      servingText.textContent = 'Reopens at 07:00 AM';
      timeText.textContent = 'Open Daily: 07:00 AM – 08:30 PM';
      if (statusCard) {
        statusCard.classList.remove('is-open');
      }
    }
  }

  // Update status immediately and then every 30 seconds
  updateStatus();
  setInterval(updateStatus, 30000);
}

/**
 * Cinematic QR Code Transition Experience
 */
function initQrTransition() {
  const qrLink = document.querySelector('.qr-image-link');
  const qrWrapper = document.querySelector('.qr-code-wrapper');
  const overlay = document.getElementById('qr-transition-overlay');
  
  if (!qrLink || !overlay) return;
  
  let isTransitioning = false;
  
  qrLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (isTransitioning) return;
    isTransitioning = true;
    
    const targetUrl = qrLink.getAttribute('href') || 'https://menu.eatbamboochicken.com';
    
    // Respect prefers-reduced-motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.location.href = targetUrl;
      return;
    }
    
    // Scale down and fade out the QR wrapper
    if (qrWrapper) {
      qrWrapper.classList.add('qr-clicked');
    }
    
    // Activate the overlay
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    
    // Phase 2: Fade the overlay entirely to solid black to transition into the navigation
    setTimeout(() => {
      overlay.classList.add('fade-out-page');
      
      // Phase 3: Redirect to the menu
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 300); // 300ms to complete the page fade to solid black
    }, 1000); // 1000ms total transition time for the cinematic effect
  });
}
