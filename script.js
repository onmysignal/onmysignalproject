// ============================================
// OPTIMIZED SCROLL ANIMATION ENGINE
// Using GSAP + ScrollTrigger (lightweight)
// ============================================

// Start immediately — no waiting
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ============================================
// MAIN APP INIT
// ============================================
function initApp() {
    initScrollProgress();
    initNavbar();
    initHeroAnimations();
    initScrollReveal();
    initImageReveal();
    initCounters();
    initSmoothNav();
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (window.pageYOffset / scrollHeight) * 100;
                progressBar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================
// HERO ANIMATIONS (GSAP — GPU accelerated)
// ============================================
function initHeroAnimations() {
    gsap.set('.char-reveal', { willChange: 'transform, opacity' });
    gsap.set('.line-reveal', { willChange: 'transform, opacity' });

    const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out', force3D: true }
    });

    tl.to('.char-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
    })
    .to('.line-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
    }, '-=0.4')
    .call(() => {
        gsap.set('.char-reveal, .line-reveal', { willChange: 'auto' });
    });
}

// ============================================
// SCROLL REVEAL (Intersection Observer)
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                const imageReveal = entry.target.querySelector('.image-reveal');
                if (imageReveal) {
                    imageReveal.classList.add('revealed');
                }
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// IMAGE CLIP-PATH REVEAL
// ============================================
function initImageReveal() {
    const imageContainers = document.querySelectorAll('.about-image-container');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const reveal = entry.target.querySelector('.image-reveal');
                if (reveal) {
                    reveal.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    imageContainers.forEach(el => observer.observe(el));
}

// ============================================
// ANIMATED COUNTERS
// ============================================
function initCounters() {
    const allCounters = document.querySelectorAll('.stat-number');
    let animated = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animated.add(entry.target);
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCount(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    allCounters.forEach(counter => observer.observe(counter));
}

function animateCount(element, target) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    requestAnimationFrame(update);
}

// ============================================
// SMOOTH NAV SCROLLING
// ============================================
function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
