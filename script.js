/* ═══════════════════════════════════════════════
   GAADS PREMIUM REDESIGN — SCRIPT.JS
═══════════════════════════════════════════════ */

'use strict';

/* ─── AOS Init ─── */
AOS.init({
  once: true,
  duration: 700,
  easing: 'ease-out-cubic',
  offset: 60,
});

/* ─── Announcement Bar Close ─── */
document.getElementById('closeBar')?.addEventListener('click', () => {
  const bar = document.getElementById('announcementBar');
  bar.style.maxHeight = bar.offsetHeight + 'px';
  bar.style.overflow = 'hidden';
  bar.style.transition = 'max-height 0.4s ease, opacity 0.4s ease, padding 0.4s ease';
  requestAnimationFrame(() => {
    bar.style.maxHeight = '0';
    bar.style.opacity = '0';
    bar.style.padding = '0';
  });
  setTimeout(() => { bar.remove(); }, 450);
});

/* ─── Sticky Navbar: add .scrolled class on scroll ─── */
const mainNav = document.getElementById('mainNav');

function handleNavScroll() {
  if (window.scrollY > 40) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ─── Animated Counters ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// Observe all .counter and .trust-num elements
const counterEls = document.querySelectorAll('.counter, .trust-num[data-target]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counterEls.forEach((el) => counterObserver.observe(el));

/* ─── Smooth scroll for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Lead Form: fake submit with feedback ─── */
function handleFormSubmit(btn) {
  const form = btn.closest('.lead-form-card');
  const inputs = form.querySelectorAll('input[required], select[required]');
  let valid = true;

  inputs.forEach((inp) => {
    if (!inp.value.trim()) {
      inp.style.borderColor = '#FF6B6B';
      valid = false;
      setTimeout(() => { inp.style.borderColor = ''; }, 2000);
    }
  });

  if (!valid) {
    shakeBtn(btn);
    return;
  }

  // Simulate submission
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Sending...';

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Brochure Sent! Check Your Email';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';

    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = 'Download Free Brochure <i class="fas fa-file-download ms-2"></i>';
    }, 5000);
  }, 1600);
}

function shakeBtn(btn) {
  btn.style.animation = 'shake 0.4s ease';
  btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
}

// Inject shake keyframes
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.g-link');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });

/* ─── Floating badges subtle float animation ─── */
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  .float-badge {
    animation: floatBadge 4s ease-in-out infinite;
  }
  .badge-bottom-left {
    animation-delay: 2s;
  }
  @keyframes floatBadge {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`;
document.head.appendChild(floatStyle);

/* ─── Marquee: pause on hover ─── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.parentElement.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.parentElement.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ─── Navbar: close collapse on mobile link click ─── */
document.querySelectorAll('#navMenu .nav-link:not(.dropdown-toggle)').forEach((link) => {
  link.addEventListener('click', () => {
    const collapse = document.getElementById('navMenu');
    if (collapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
      bsCollapse.hide();
    }
  });
});

/* ─── Course card: subtle parallax tilt on mouse ─── */
document.querySelectorAll('.course-card, .service-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Performance: lazy-load images below fold ─── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img:not([loading])').forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
}

console.log('%c GAADS Learning | Premium Redesign 🚀', 'color:#00C2CB;font-size:14px;font-weight:bold;');
