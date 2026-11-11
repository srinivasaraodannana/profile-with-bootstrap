/* Dannana Srinivasa Rao — portfolio interactions (vanilla JS + Bootstrap 5) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- theme toggle ---------- */
  var themeBtn = $('#themeToggle');
  function setThemeIcon() {
    var dark = root.getAttribute('data-bs-theme') !== 'light';
    if (themeBtn) {
      themeBtn.innerHTML = dark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0a1626' : '#f4f7fb');
  }
  setThemeIcon();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    setThemeIcon();
  });

  /* ---------- navbar state, scroll progress, to-top ---------- */
  var nav = $('#mainNav'), bar = $('#scrollProgress'), toTop = $('#toTop'), ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- scrollspy (active nav link) ---------- */
  var spyLinks = $$('#navLinks .nav-link');
  var spySections = spyLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  function spy() {
    var mark = window.innerHeight * 0.35, current = null;
    spySections.forEach(function (s) { if (s.getBoundingClientRect().top <= mark) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 && spySections.length) {
      current = spySections[spySections.length - 1].id;
    }
    spyLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { window.requestAnimationFrame(spy); }, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* close mobile menu after picking a link */
  var navCollapse = $('#navLinks');
  $$('#navLinks .nav-link').forEach(function (a) {
    a.addEventListener('click', function () {
      if (navCollapse && navCollapse.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  /* ---------- typing effect ---------- */
  var typed = $('#typed');
  var roles = [
    'Assistant Manager – Civil',
    'QA/QC & billing',
    'Industrial site execution',
    'RCC estimation & BBS',
    'Residential design & 3D'
  ];
  if (typed && !reduceMotion) {
    var ri = 0, ci = roles[0].length, deleting = true;
    (function tick() {
      var word = roles[ri];
      typed.textContent = word.slice(0, ci);
      var delay = deleting ? 35 : 75;
      if (deleting) {
        ci--;
        if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; delay = 300; }
      } else {
        ci++;
        if (ci > roles[ri].length) { deleting = true; ci = roles[ri].length; delay = 2000; }
      }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- counters ---------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if (reduceMotion || isNaN(target)) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- skill bars ---------- */
  $$('.skill').forEach(function (s) {
    var lvl = s.getAttribute('data-level');
    var label = s.querySelector('span');
    if (label) label.setAttribute('data-pct', lvl + '%');
  });
  function fillSkill(s) {
    var i = s.querySelector('.bar i');
    if (i) i.style.width = s.getAttribute('data-level') + '%';
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.classList.contains('reveal')) el.classList.add('in');
        if (el.hasAttribute('data-count')) runCounter(el);
        if (el.classList.contains('skill')) fillSkill(el);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, [data-count], .skill').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('.skill').forEach(fillSkill);
  }

  /* ---------- portfolio filters ---------- */
  var filterBtns = $$('.filters button');
  var projects = $$('#projectGrid .project');
  filterBtns.forEach(function (btn) {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      projects.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(/\s+/);
        var show = f === 'all' || cats.indexOf(f) !== -1;
        if (show) {
          var wasHidden = p.classList.contains('is-hidden');
          p.classList.remove('is-hidden');
          // reveal children that may not have intersected yet
          $$('.reveal', p).forEach(function (r) { r.classList.add('in'); });
          if (wasHidden && !reduceMotion) {
            p.classList.add('is-entering');
            requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.remove('is-entering'); }); });
          }
        } else {
          p.classList.add('is-hidden');
        }
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox');
  if (lb) {
    var lbImg = $('img', lb), lbCap = $('figcaption', lb), lbClose = $('.lb-close', lb), lastFocus = null;
    function openLb(src, cap) {
      lastFocus = document.activeElement;
      lbImg.src = src;
      lbImg.alt = cap || '';
      lbCap.textContent = cap || '';
      lb.classList.add('open');
      document.body.classList.add('lb-lock');
      lbClose.focus();
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.classList.remove('lb-lock');
      if (lastFocus) lastFocus.focus();
    }
    $$('[data-lightbox]').forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        openLb(t.getAttribute('data-lightbox'), t.getAttribute('data-caption'));
      });
    });
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
    });
  }

  /* ---------- contact form → mailto ---------- */
  var form = $('#contactForm'), note = $('#formNote');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#cName'), email = $('#cEmail'), subj = $('#cSubject'), msg = $('#cMsg');
    var ok = true;
    [name, email, msg].forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please fill in your name, a valid email and a message.';
      note.className = 'form-note error';
      return;
    }
    var subject = subj.value.trim() || 'Hello from your portfolio';
    var body = msg.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')';
    window.location.href = 'mailto:srinivasarao.dannana2000@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Your email app should open now. Thanks for reaching out!';
    note.className = 'form-note ok';
  });
  $$('#contactForm .form-control').forEach(function (f) {
    f.addEventListener('input', function () { f.classList.remove('is-invalid'); });
  });
})();
