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
    initTextReveal();
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
    // Force GPU compositing for hero elements
    gsap.set('.char-reveal', { willChange: 'transform, opacity' });
    gsap.set('.line-reveal', { willChange: 'transform, opacity' });

    const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out', force3D: true }
    });

    // Animate title lines
    tl.to('.char-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
    })
    // Animate other line-reveal elements (description, CTA, cards)
    .to('.line-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
    }, '-=0.4')
    // Show scroll indicator
    .to('.hero-scroll-indicator', {
        opacity: 1,
        duration: 0.4,
    }, '-=0.2')
    // Cleanup willChange after animation completes
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
// TEXT REVEAL (Word by word on scroll)
// ============================================
function initTextReveal() {
    const textElements = document.querySelectorAll('.big-text-reveal');

    textElements.forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(' ');
        el.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                textElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
                        const words = el.querySelectorAll('.word');
                        const progress = Math.max(0, 1 - (rect.top / (windowHeight * 0.6)));
                        const wordsToReveal = Math.floor(progress * words.length * 1.2);

                        words.forEach((word, index) => {
                            if (index < wordsToReveal) {
                                word.classList.add('active');
                            } else {
                                word.classList.remove('active');
                            }
                        });
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
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
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCount(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) observer.observe(statsSection);
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
