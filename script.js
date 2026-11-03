const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#primary-navigation');
const navigationItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], footer[id]');
const currentYear = document.querySelector('#current-year');

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const bubbleField = document.querySelector('.bubble-field');
const bubbleElements = bubbleField ? [...bubbleField.querySelectorAll('.bubble')] : [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (bubbleElements.length && !reducedMotion.matches) {
  const bubbles = bubbleElements.map((element) => ({
    element,
    radius: element.getBoundingClientRect().width / 2,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  }));
  let frameId;
  let previousTime = 0;

  const placeBubbles = () => {
    const columns = Math.max(1, Math.floor(window.innerWidth / 160));
    const rows = Math.ceil(bubbles.length / columns);
    const cellWidth = window.innerWidth / columns;
    const cellHeight = window.innerHeight / rows;

    bubbles.forEach((bubble, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      bubble.x = Math.max(0, Math.min(
        window.innerWidth - bubble.radius * 2,
        (column + 0.5) * cellWidth - bubble.radius + (Math.random() - 0.5) * 28
      ));
      bubble.y = Math.max(0, Math.min(
        window.innerHeight - bubble.radius * 2,
        (row + 0.5) * cellHeight - bubble.radius + (Math.random() - 0.5) * 28
      ));
      const angle = Math.random() * Math.PI * 2;
      const speed = 24 + Math.random() * 28;
      bubble.vx = Math.cos(angle) * speed;
      bubble.vy = Math.sin(angle) * speed;
    });
  };

  const resolveCollisions = () => {
    for (let i = 0; i < bubbles.length; i += 1) {
      for (let j = i + 1; j < bubbles.length; j += 1) {
        const first = bubbles[i];
        const second = bubbles[j];
        const dx = second.x + second.radius - first.x - first.radius;
        const dy = second.y + second.radius - first.y - first.radius;
        const distance = Math.hypot(dx, dy);
        const minDistance = first.radius + second.radius;

        if (!distance || distance >= minDistance) continue;

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance;
        first.x -= nx * overlap / 2;
        first.y -= ny * overlap / 2;
        second.x += nx * overlap / 2;
        second.y += ny * overlap / 2;

        const relativeVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
        if (relativeVelocity < 0) {
          first.vx += relativeVelocity * nx;
          first.vy += relativeVelocity * ny;
          second.vx -= relativeVelocity * nx;
          second.vy -= relativeVelocity * ny;
        }
      }
    }
  };

  const animateBubbles = (time) => {
    if (document.hidden || reducedMotion.matches) {
      frameId = undefined;
      return;
    }

    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.032) : 0;
    previousTime = time;

    bubbles.forEach((bubble) => {
      bubble.x += bubble.vx * delta;
      bubble.y += bubble.vy * delta;

      if (bubble.x <= 0 || bubble.x + bubble.radius * 2 >= window.innerWidth) {
        bubble.vx *= -1;
        bubble.x = Math.max(0, Math.min(window.innerWidth - bubble.radius * 2, bubble.x));
      }
      if (bubble.y <= 0 || bubble.y + bubble.radius * 2 >= window.innerHeight) {
        bubble.vy *= -1;
        bubble.y = Math.max(0, Math.min(window.innerHeight - bubble.radius * 2, bubble.y));
      }
    });

    resolveCollisions();
    bubbles.forEach((bubble) => {
      bubble.element.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;
    });
    frameId = window.requestAnimationFrame(animateBubbles);
  };

  const startBubbles = () => {
    if (frameId !== undefined || document.hidden || reducedMotion.matches) return;
    previousTime = 0;
    frameId = window.requestAnimationFrame(animateBubbles);
  };

  const stopBubbles = () => {
    if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    frameId = undefined;
  };

  placeBubbles();
  window.addEventListener('resize', placeBubbles, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopBubbles();
    else startBubbles();
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopBubbles();
    else startBubbles();
  });
  startBubbles();
}

const setMenuOpen = (isOpen) => {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
};

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigationItems.forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (
    menuToggle?.getAttribute('aria-expanded') === 'true' &&
    !navLinks?.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeHash = entry.target.id === 'home' ? '' : `#${entry.target.id}`;
      navigationItems.forEach((link) => {
        link.classList.toggle('is-active', link.hash === activeHash);
      });
    });
  }, { rootMargin: '-10% 0px -10% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-heading, .about-copy, .impact-item, .experience-item, .skill-group, .project-card, .education-card').forEach((element) => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });

  document.documentElement.classList.add('js-ready');
}
