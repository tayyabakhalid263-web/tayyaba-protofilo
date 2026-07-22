/* ==========================================================================
   TAYYABA KHALID — PORTFOLIO SCRIPT
   Organized by feature, all vanilla JS, no external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. HAMBURGER / MOBILE NAV
     ------------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is tapped
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------------
     2. ACTIVE NAV LINK ON SCROLL + SCROLL PROGRESS BAR
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const progressBar = document.getElementById('progressBar');

  const onScroll = () => {
    // Progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (scrollTop >= sectionTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // Back to top button visibility
    backToTop.classList.toggle('show', scrollTop > 500);
  };

  window.addEventListener('scroll', onScroll);

  /* ------------------------------------------------------------------------
     3. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------------
     4. TYPING EFFECT (HERO ROLE)
     ------------------------------------------------------------------------ */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Frontend Web Developer',
    'Software Engineering Student',
    'Aspiring AI & Full Stack Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typedTextEl.textContent = currentRole.substring(0, charIndex);
    } else {
      charIndex++;
      typedTextEl.textContent = currentRole.substring(0, charIndex);
    }

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1600; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------------
     6. ANIMATED SKILL BARS (trigger once visible)
     ------------------------------------------------------------------------ */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = `${width}%`;
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  /* ------------------------------------------------------------------------
     7. ANIMATED COUNTERS (Projects / CGPA / Technologies)
     ------------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ------------------------------------------------------------------------
     8. CURSOR GLOW (decorative, desktop only)
     ------------------------------------------------------------------------ */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* ------------------------------------------------------------------------
     9. CONTACT FORM VALIDATION (client-side only, no backend)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = '';

    if (value === '') {
      message = 'This field is required.';
    } else if (key === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) message = 'Please enter a valid email address.';
    } else if (key === 'message' && value.length < 10) {
      message = 'Message should be at least 10 characters.';
    }

    error.textContent = message;
    el.closest('.form-group').classList.toggle('invalid', Boolean(message));
    return message === '';
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (isValid) {
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    } else {
      formSuccess.classList.remove('show');
    }
  });

  /* ------------------------------------------------------------------------
     10. FOOTER YEAR
     ------------------------------------------------------------------------ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Run once on load to set initial active link / progress bar */
  onScroll();
});
