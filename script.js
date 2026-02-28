// Navigation scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll event for navbar (optimized with throttling)
let navTicking = false;
const updateNavbar = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    navTicking = false;
};

window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(updateNavbar);
        navTicking = true;
    }
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('.section, .hero');
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.timeline-item, .experience-card, .cert-card, .skill-item, .contact-item, .portfolio-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        if (element.dataset.scrollAnimInit === 'true') return;
        element.dataset.scrollAnimInit = 'true';
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Initialize scroll animations
window.addEventListener('load', animateOnScroll);

// Typing effect for hero title (optional enhancement)
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// Parallax effect for hero section (optimized)
let ticking = false;
const hero = document.querySelector('.hero');

const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero ? hero.offsetHeight : 0;

    // Only apply parallax when hero is visible and in viewport
    if (hero && scrolled < heroHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    } else if (hero) {
        hero.style.transform = 'translateY(0)';
    }
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Skill items hover effect enhancement
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Experience cards - subtle lift
const experienceCards = document.querySelectorAll('.experience-card, .cert-card');
experienceCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Scroll to top functionality (optional)
const createScrollToTop = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 999;
    `;

    document.body.appendChild(scrollBtn);

    let scrollBtnTicking = false;
    const updateScrollBtn = () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
        scrollBtnTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollBtnTicking) {
            window.requestAnimationFrame(updateScrollBtn);
            scrollBtnTicking = true;
        }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
};

// Initialize scroll to top button
createScrollToTop();

// Portfolio
const initPortfolio = async () => {
    const grid = document.getElementById('portfolioGrid');
    const searchInput = document.getElementById('portfolioSearch');
    const countEl = document.getElementById('portfolioCount');
    const emptyEl = document.getElementById('portfolioEmpty');
    const noteEl = document.getElementById('portfolioNote');

    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('portfolioModalTitle');
    const modalDesc = document.getElementById('portfolioModalDesc');
    const modalImage = document.getElementById('portfolioModalImage');
    const modalThumbs = document.getElementById('portfolioModalThumbs');
    const prevBtn = modal?.querySelector('.portfolio-modal__nav--prev');
    const nextBtn = modal?.querySelector('.portfolio-modal__nav--next');
    const closeBtn = modal?.querySelector('.portfolio-modal__close');

    if (!grid || !searchInput || !countEl || !emptyEl || !noteEl || !modal || !modalTitle || !modalDesc || !modalImage || !modalThumbs || !prevBtn || !nextBtn || !closeBtn) {
        return;
    }

    const state = {
        basePath: 'portfolio',
        items: [], // { project, coverUrl, descriptionText, cardEl }
        filteredIds: new Set(),
        activeProjectId: null,
        activeImageIndex: 0,
        lastFocusedEl: null
    };

    const encodePath = (...segments) => segments.map(s => encodeURIComponent(String(s))).join('/');
    const buildFileUrl = (basePath, folder, file) => encodePath(basePath, folder, file);

    const safeExcerpt = (text, maxLen = 160) => {
        const clean = String(text || '').replace(/\s+/g, ' ').trim();
        if (!clean) return 'Click to view details and screenshots.';
        return clean.length <= maxLen ? clean : `${clean.slice(0, maxLen - 1)}…`;
    };

    const setCount = (visible, total) => {
        countEl.textContent = `${visible} / ${total} projects`;
    };

    const showNote = (msg) => {
        noteEl.hidden = !msg;
        noteEl.textContent = msg || '';
    };

    const setEmpty = (isEmpty) => {
        emptyEl.hidden = !isEmpty;
    };

    const fetchJson = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
        return res.json();
    };

    const fetchText = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
        return res.text();
    };

    const renderCard = (item) => {
        const card = document.createElement('article');
        card.className = 'portfolio-card';
        card.tabIndex = 0;
        card.dataset.projectId = item.project.id;

        const img = document.createElement('img');
        img.className = 'portfolio-card__image';
        img.loading = 'lazy';
        img.alt = `${item.project.title} preview`;
        img.src = item.coverUrl;

        const body = document.createElement('div');
        body.className = 'portfolio-card__body';

        const title = document.createElement('h3');
        title.className = 'portfolio-card__title';
        title.textContent = item.project.title;

        const desc = document.createElement('p');
        desc.className = 'portfolio-card__desc';
        desc.textContent = item.descriptionText ? safeExcerpt(item.descriptionText) : 'Loading description…';

        const cta = document.createElement('div');
        cta.className = 'portfolio-card__cta';
        cta.innerHTML = `View project <i class="fas fa-arrow-right" aria-hidden="true"></i>`;

        body.appendChild(title);
        body.appendChild(desc);
        body.appendChild(cta);

        card.appendChild(img);
        card.appendChild(body);
        item.cardEl = card;
        item.cardDescEl = desc;
        return card;
    };

    const applyFilter = () => {
        const q = searchInput.value.trim().toLowerCase();
        const total = state.items.length;
        let visible = 0;

        state.items.forEach(item => {
            const haystack = `${item.project.title}\n${item.descriptionText || ''}`.toLowerCase();
            const match = !q || haystack.includes(q);
            item.cardEl.style.display = match ? '' : 'none';
            if (match) visible += 1;
        });

        setCount(visible, total);
        setEmpty(total > 0 && visible === 0);
    };

    const setModalOpen = (open) => {
        if (open) {
            state.lastFocusedEl = document.activeElement;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
        } else {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            modalThumbs.innerHTML = '';
            state.activeProjectId = null;
            state.activeImageIndex = 0;
            if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === 'function') {
                state.lastFocusedEl.focus();
            }
        }
    };

    const getActiveItem = () => state.items.find(i => i.project.id === state.activeProjectId) || null;

    const setActiveImage = (index) => {
        const item = getActiveItem();
        if (!item) return;
        const images = item.project.images || [];
        if (!images.length) return;

        const safeIndex = ((index % images.length) + images.length) % images.length;
        state.activeImageIndex = safeIndex;

        const src = buildFileUrl(state.basePath, item.project.folder, images[safeIndex]);
        modalImage.src = src;
        modalImage.alt = `${item.project.title} screenshot ${safeIndex + 1} of ${images.length}`;

        [...modalThumbs.querySelectorAll('.portfolio-thumb')].forEach((btn, i) => {
            btn.classList.toggle('is-active', i === safeIndex);
        });
    };

    const openProject = async (projectId) => {
        const item = state.items.find(i => i.project.id === projectId);
        if (!item) return;

        state.activeProjectId = projectId;
        modalTitle.textContent = item.project.title;
        modalDesc.textContent = item.descriptionText ? item.descriptionText : 'Loading description…';

        modalThumbs.innerHTML = '';
        (item.project.images || []).forEach((file, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'portfolio-thumb';
            btn.setAttribute('aria-label', `View image ${i + 1}`);

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = '';
            img.src = buildFileUrl(state.basePath, item.project.folder, file);

            btn.appendChild(img);
            btn.addEventListener('click', () => setActiveImage(i));
            modalThumbs.appendChild(btn);
        });

        setModalOpen(true);
        setActiveImage(0);

        if (!item.descriptionText) {
            try {
                const descUrl = buildFileUrl(state.basePath, item.project.folder, item.project.descriptionFile);
                item.descriptionText = await fetchText(descUrl);
                if (state.activeProjectId === projectId) {
                    modalDesc.textContent = item.descriptionText;
                }
                if (item.cardDescEl) item.cardDescEl.textContent = safeExcerpt(item.descriptionText);
            } catch (err) {
                const msg = 'Description not available for this project.';
                if (state.activeProjectId === projectId) modalDesc.textContent = msg;
                if (item.cardDescEl) item.cardDescEl.textContent = msg;
            }
            applyFilter();
        }
    };

    // Card glow tracking (mouse position)
    grid.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.portfolio-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });

    // Open project (click + keyboard)
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.portfolio-card');
        if (!card) return;
        openProject(card.dataset.projectId);
    });

    grid.addEventListener('keydown', (e) => {
        const card = e.target.closest('.portfolio-card');
        if (!card) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProject(card.dataset.projectId);
        }
    });

    // Modal interactions
    modal.addEventListener('click', (e) => {
        const close = e.target.closest('[data-portfolio-close="true"]');
        if (close) setModalOpen(false);
    });

    prevBtn.addEventListener('click', () => setActiveImage(state.activeImageIndex - 1));
    nextBtn.addEventListener('click', () => setActiveImage(state.activeImageIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') setModalOpen(false);
        if (e.key === 'ArrowLeft') setActiveImage(state.activeImageIndex - 1);
        if (e.key === 'ArrowRight') setActiveImage(state.activeImageIndex + 1);
    });

    searchInput.addEventListener('input', applyFilter);

    // Load manifest and render
    try {
        const manifest = await fetchJson('portfolio/portfolio.json');
        state.basePath = manifest.basePath || 'portfolio';
        const projects = Array.isArray(manifest.projects) ? manifest.projects : [];

        if (!projects.length) {
            setCount(0, 0);
            showNote('No portfolio projects found.');
            return;
        }

        state.items = projects.map(project => {
            const coverFile = (project.images && project.images[0]) ? project.images[0] : '';
            const coverUrl = coverFile ? buildFileUrl(state.basePath, project.folder, coverFile) : '';
            return { project, coverUrl, descriptionText: '' };
        });

        const fragment = document.createDocumentFragment();
        state.items.forEach(item => fragment.appendChild(renderCard(item)));
        grid.innerHTML = '';
        grid.appendChild(fragment);

        // Re-run reveal animations for newly added cards
        animateOnScroll();

        setCount(state.items.length, state.items.length);
        applyFilter();

        // Lazy-load descriptions to improve search + excerpts
        state.items.forEach(async (item) => {
            try {
                const descUrl = buildFileUrl(state.basePath, item.project.folder, item.project.descriptionFile);
                item.descriptionText = await fetchText(descUrl);
                if (item.cardDescEl) item.cardDescEl.textContent = safeExcerpt(item.descriptionText);
            } catch (_) {
                // keep placeholder
            } finally {
                applyFilter();
            }
        });
    } catch (err) {
        showNote('Portfolio could not be loaded. If you are opening the file directly, run it with a local server (Live Server) or deploy it (e.g., GitHub Pages).');
        setCount(0, 0);
    }
};

initPortfolio();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console message
console.log('%c👋 Welcome to Laraib Azhar\'s Portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #764ba2; font-size: 14px;');
