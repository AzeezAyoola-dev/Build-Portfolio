/**
 * Azeez Ayoola — UI/UX Designer Portfolio
 * Client-Side Interactivity, Responsive Navigation & Functional Email Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  const EMAIL_ADDRESS = 'azeezayoola945@gmail.com';

  // ---------------------------------------------------------
  // 1. Header Scroll Blur Effect
  // ---------------------------------------------------------
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------------------------------------------------------
  // 2. Mobile Navigation Toggle
  // ---------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------------------------------------------------------
  // 3. Active Nav Link on Scroll
  // ---------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollPosition = window.scrollY + 180;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ---------------------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---------------------------------------------------------
  // 5. Toast Notification System
  // ---------------------------------------------------------
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message, duration = 3500) => {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  };

  // ---------------------------------------------------------
  // 6. Copy Email Quick-Actions
  // ---------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || EMAIL_ADDRESS;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email copied: ${email}`);

        // Temporary button label feedback if exists
        const label = btn.querySelector('.copy-label');
        if (label) {
          const original = label.textContent;
          label.textContent = 'Copied!';
          setTimeout(() => {
            label.textContent = original;
          }, 2000);
        }
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Email copied: ${email}`);
      }
    });
  });

  // ---------------------------------------------------------
  // 7. Functional Contact Form -> Mailto & Draft Creator
  // ---------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const subjectSelect = document.getElementById('projectType');
    const messageInput = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const clearErrors = () => {
      [nameError, emailError, subjectError, messageError].forEach(err => {
        if (err) err.textContent = '';
      });
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        hasError = true;
      }

      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        emailError.textContent = 'Please enter your email.';
        hasError = true;
      } else if (!emailRegex.test(emailVal)) {
        emailError.textContent = 'Please enter a valid email address.';
        hasError = true;
      }

      if (!subjectSelect.value) {
        subjectError.textContent = 'Please select a subject.';
        hasError = true;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter a message.';
        hasError = true;
      }

      if (hasError) return;

      const senderName = encodeURIComponent(nameInput.value.trim());
      const senderEmail = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectSelect.value} - from ${nameInput.value.trim()}`);
      
      const bodyText = 
`Hello Azeez,

My name is ${nameInput.value.trim()} (${emailInput.value.trim()}).

Inquiry Subject: ${subjectSelect.value}

Message:
${messageInput.value.trim()}

---
Sent from your portfolio contact form.`;

      const encodedBody = encodeURIComponent(bodyText);

      // Trigger mailto directly
      const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${encodedBody}`;
      
      // Attempt to open default mail client
      window.location.href = mailtoUrl;

      // Also copy text to clipboard as safety net
      if (navigator.clipboard) {
        navigator.clipboard.writeText(bodyText).catch(() => {});
      }

      showToast('Opening your email client! A message draft has also been created.');

      // Clear the form after submission
      contactForm.reset();
    });
  }

  // ---------------------------------------------------------
  // 8. Image Lightbox Modal for Projects
  // ---------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const zoomTriggers = document.querySelectorAll('[data-zoom-src]');

  const openLightbox = (src, title) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  };

  zoomTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-zoom-src');
      const title = trigger.getAttribute('data-zoom-title') || 'Project Preview';
      openLightbox(src, title);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = trigger.getAttribute('data-zoom-src');
        const title = trigger.getAttribute('data-zoom-title') || 'Project Preview';
        openLightbox(src, title);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
});
