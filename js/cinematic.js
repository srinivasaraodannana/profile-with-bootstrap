/**
 * DANNANA SRINIVASA RAO — CINEMATIC INTERACTIVE ENGINE
 * Framework: GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initNavigation();
  initPersonaChoreography();
  initCounters();
  initSkillsAccordion();
  initProjectFilters();
  initLightbox();
  initContactActions();
});

/* --------------------------------------------------------------------------
   01. LENIS SMOOTH SCROLL & GSAP SYNC
   -------------------------------------------------------------------------- */
let lenis = null;

function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -60, duration: 1.4 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   02. CINEMATIC NAVIGATION & HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.getElementById('navHamburger');
  const linksList = document.getElementById('navLinksList');
  if (hamburger && linksList) {
    hamburger.addEventListener('click', () => {
      const isVisible = linksList.style.display === 'flex';
      linksList.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        linksList.style.flexDirection = 'column';
        linksList.style.position = 'absolute';
        linksList.style.top = '80px';
        linksList.style.left = '0';
        linksList.style.width = '100%';
        linksList.style.background = 'rgba(7, 8, 11, 0.98)';
        linksList.style.padding = '2rem';
        linksList.style.borderBottom = '1px solid rgba(255, 107, 0, 0.2)';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   03. CINEMATIC PERSONA CHOREOGRAPHY (THE SIGNATURE FEATURE)
   -------------------------------------------------------------------------- */
function initPersonaChoreography() {
  const stage = document.getElementById('personaStage');
  const video1 = document.getElementById('personaVideo1'); // Waving
  const video2 = document.getElementById('personaVideo2'); // Smiling

  if (!stage || !video1 || !video2) return;

  // Autoplay safety & loop
  [video1, video2].forEach((v) => {
    v.muted = true;
    v.playsInline = true;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, attach one-time user interaction listener
        const resumePlay = () => {
          v.play();
          document.removeEventListener('click', resumePlay);
          document.removeEventListener('scroll', resumePlay);
        };
        document.addEventListener('click', resumePlay, { once: true });
        document.addEventListener('scroll', resumePlay, { once: true });
      });
    }
  });

  // Crossfade helper
  function switchToVideo(target) {
    if (target === 1) {
      video1.classList.add('active');
      video2.classList.remove('active');
    } else {
      video2.classList.add('active');
      video1.classList.remove('active');
    }
  }

  // Desktop ScrollTrigger choreography
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Only apply fixed glide on screens wide enough (desktop/laptop)
    const mm = gsap.matchMedia();

    mm.add('(min-width: 992px)', () => {
      // 1. In Hero (Anchor Right)
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          stage.className = 'cinematic-persona-stage state-hero';
          switchToVideo(1);
        },
        onEnterBack: () => {
          stage.className = 'cinematic-persona-stage state-hero';
          switchToVideo(1);
        },
      });

      // 2. In About (Glide to Left + Switch to Smiling Video)
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          stage.className = 'cinematic-persona-stage state-about';
          switchToVideo(2);
        },
        onEnterBack: () => {
          stage.className = 'cinematic-persona-stage state-about';
          switchToVideo(2);
        },
      });

      // 3. In Sites (Subtle ambient backdrop for full-width grid)
      ScrollTrigger.create({
        trigger: '#sites',
        start: 'top 50%',
        end: 'bottom 40%',
        onEnter: () => {
          stage.className = 'cinematic-persona-stage state-subtle';
        },
        onEnterBack: () => {
          stage.className = 'cinematic-persona-stage state-subtle';
        },
      });

      // 4. In Skills (Glide back to Right alongside skills list)
      ScrollTrigger.create({
        trigger: '#skills',
        start: 'top 50%',
        end: 'bottom 40%',
        onEnter: () => {
          stage.className = 'cinematic-persona-stage state-skills';
          switchToVideo(2);
        },
        onEnterBack: () => {
          stage.className = 'cinematic-persona-stage state-skills';
          switchToVideo(2);
        },
      });

      // 5. In Projects, Journey & Contact (Subtle background dock)
      ScrollTrigger.create({
        trigger: '#projects',
        start: 'top 40%',
        endTrigger: '#contact',
        end: 'bottom bottom',
        onEnter: () => {
          stage.className = 'cinematic-persona-stage state-subtle';
        },
        onLeaveBack: () => {
          stage.className = 'cinematic-persona-stage state-skills';
        },
      });
    });
  }
}

/* --------------------------------------------------------------------------
   04. NUMERICAL STAT COUNTERS
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-count'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeProgress * targetNum;

            el.textContent = currentVal.toFixed(decimals);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = targetNum.toFixed(decimals);
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   05. SKILLS ACCORDION & PROGRESS BARS
   -------------------------------------------------------------------------- */
function initSkillsAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Close all
      accordionItems.forEach((other) => {
        other.classList.remove('active');
        other.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          bar.style.width = '0%';
        });
      });

      // Toggle clicked
      if (!wasActive) {
        item.classList.add('active');
        // Animate child skill bars
        setTimeout(() => {
          item.querySelectorAll('.skill-bar-fill').forEach((bar) => {
            const targetWidth = bar.getAttribute('data-width') || '85%';
            bar.style.width = targetWidth;
          });
        }, 150);
      }
    });
  });

  // Activate first item by default
  if (accordionItems.length > 0) {
    accordionItems[0].classList.add('active');
    setTimeout(() => {
      accordionItems[0].querySelectorAll('.skill-bar-fill').forEach((bar) => {
        const targetWidth = bar.getAttribute('data-width') || '90%';
        bar.style.width = targetWidth;
      });
    }, 400);
  }
}

/* --------------------------------------------------------------------------
   06. PROJECT FILTERS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || category.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   07. LIGHTBOX FOR ARCHITECTURE & 3D RENDERS
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('cinematicLightbox');
  const lbImg = document.getElementById('lightboxImage');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');

  if (!lightbox || !lbImg) return;

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = btn.getAttribute('data-lightbox');
      const caption = btn.getAttribute('data-caption') || '';
      lbImg.src = imgSrc;
      if (lbCaption) lbCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLb = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lbClose) lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLb();
  });
}

/* --------------------------------------------------------------------------
   08. CONTACT ACTIONS & COPY EMAIL
   -------------------------------------------------------------------------- */
function initContactActions() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = 'srinivasaraodannana2000@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailText);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        copyBtn.style.background = 'var(--amber-core)';
        copyBtn.style.color = '#000';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2500);
      } catch (err) {
        // Fallback for non-secure context
        window.location.href = `mailto:${emailText}`;
      }
    });
  }

  // Contact Form Submission handling
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName')?.value || '';
      const email = document.getElementById('cEmail')?.value || '';
      const subject = document.getElementById('cSubject')?.value || 'Portfolio Inquiry';
      const msg = document.getElementById('cMsg')?.value || '';

      if (!name || !email || !msg) {
        alert('Please fill in your name, email and message.');
        return;
      }

      // Format mailto link
      const mailtoUri = `mailto:${emailText}?subject=${encodeURIComponent(
        `[Portfolio] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.textContent = '✓ Opening your email client to send message...';
      }

      window.location.href = mailtoUri;
    });
  }
}
