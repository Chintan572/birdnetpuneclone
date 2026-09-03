/* ============================================================
   BIRD NET PUNE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // 1. STICKY HEADER ON SCROLL
  // ============================================================
  const mainHeader = document.querySelector('.main-header');
  
  function handleScroll() {
    if (window.scrollY > 60) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ============================================================
  // 2. MOBILE NAV TOGGLE
  // ============================================================
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

  function openMobileNav() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });


  // ============================================================
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ============================================================
  // 4. HERO TEXT ROTATOR
  // ============================================================
  const rotatorWords = document.querySelectorAll('.rotator-word');
  let currentWordIndex = 0;

  function rotateWords() {
    if (rotatorWords.length === 0) return;

    rotatorWords.forEach(function (word) {
      word.classList.remove('active');
    });

    currentWordIndex = (currentWordIndex + 1) % rotatorWords.length;
    rotatorWords[currentWordIndex].classList.add('active');
  }

  if (rotatorWords.length > 0) {
    // Set first word as active
    rotatorWords[0].classList.add('active');
    setInterval(rotateWords, 2800);
  }


  // ============================================================
  // 5. ANIMATED COUNTERS
  // ============================================================
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);

      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }


  // ============================================================
  // 6. FAQ ACCORDION
  // ============================================================
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(function (card) {
    const trigger = card.querySelector('.faq-trigger');
    const content = card.querySelector('.faq-content');
    const contentInner = card.querySelector('.faq-content-inner');

    trigger.addEventListener('click', function () {
      const isOpen = card.classList.contains('open');

      // Close all others
      faqCards.forEach(function (otherCard) {
        if (otherCard !== card) {
          otherCard.classList.remove('open');
          otherCard.querySelector('.faq-content').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        card.classList.remove('open');
        content.style.maxHeight = '0';
      } else {
        card.classList.add('open');
        content.style.maxHeight = contentInner.scrollHeight + 'px';
      }
    });
  });


  // ============================================================
  // 7. GALLERY TAB FILTER
  // ============================================================
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Reset active state
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      galleryItems.forEach(function (item) {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.classList.remove('hidden');
          item.style.display = '';
        } else {
          item.classList.add('hidden');
          item.style.display = 'none';
        }
      });
    });
  });


  // ============================================================
  // 8. CONTACT FORM SUBMISSION (UI-ONLY)
  // ============================================================
  const inspectionForm = document.getElementById('inspection-form');
  const formFeedback = document.getElementById('form-feedback');

  if (inspectionForm && formFeedback) {
    inspectionForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = inspectionForm.querySelector('.form-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="material-symbols-outlined" style="animation: spin .8s linear infinite;">progress_activity</span>' +
        '<span>Registering Visit...</span>';

      setTimeout(function () {
        formFeedback.classList.add('show');
        submitBtn.innerHTML =
          '<span class="material-symbols-outlined">check_circle</span>' +
          '<span>Inspection Reserved!</span>';
        submitBtn.style.background = 'var(--emerald-600)';
        inspectionForm.reset();
      }, 800);
    });
  }


  // ============================================================
  // 9. SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

});

/* Spin keyframe for form loading */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
