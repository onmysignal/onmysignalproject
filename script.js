// ============================================
// UPGRADED SCROLL ANIMATION ENGINE
// Using GSAP + ScrollTrigger + Lenis
// ============================================

// Wait for everything to load
window.addEventListener('load', () => {
    initLoader();
});

// ============================================
// PAGE LOADER
// ============================================
function initLoader() {
    const loader = document.querySelector('.loader');
    
    setTimeout(() => {
        loader.classList.add('loaded');
        // Start animations after loader
        setTimeout(() => {
            initApp();
        }, 300);
    }, 2500);
}

// ============================================
// MAIN APP INIT
// ============================================
function initApp() {
    initSmoothScroll();
    initCursor();
    initScrollProgress();
    initNavbar();
    initHeroAnimations();
    initScrollReveal();
    initTextReveal();
    initImageReveal();
    initCounters();
    initMagnetic();
    initParallax();
}

// ============================================
// SMOOTH SCROLL (LENIS)
// ============================================
let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if (!dot || !outline) return;
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Smooth follow for outline
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.12;
        outlineY += (mouseY - outlineY) * 0.12;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .magnetic, .service-item, .project-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.classList.add('hovering');
            dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            outline.classList.remove('hovering');
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// HERO ANIMATIONS (GSAP)
// ============================================
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Animate character reveals
    tl.to('.char-reveal', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
    })
    .to('.line-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
    }, '-=0.6')
    .to('.hero-scroll-indicator', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.3');
}


// ============================================
// SCROLL REVEAL (Intersection Observer + GSAP)
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // For image reveals
                const imageReveal = entry.target.querySelector('.image-reveal');
                if (imageReveal) {
                    imageReveal.classList.add('revealed');
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
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

    // Scroll-based word reveal
    window.addEventListener('scroll', () => {
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
    });
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
                    setTimeout(() => {
                        reveal.classList.add('revealed');
                    }, 200);
                }
            }
        });
    }, { threshold: 0.2 });

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
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
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
// MAGNETIC EFFECT
// ============================================
function initMagnetic() {
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallax() {
    // Parallax for gradient orbs
    gsap.utils.toArray('.gradient-orb').forEach(orb => {
        gsap.to(orb, {
            y: () => Math.random() * 200 - 100,
            scrollTrigger: {
                trigger: orb.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });

    // Parallax for project images
    gsap.utils.toArray('.project-image').forEach(img => {
        gsap.to(img, {
            y: -40,
            scrollTrigger: {
                trigger: img.closest('.project-card'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            }
        });
    });

    // Scale effect for section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scale: 0.95,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
            }
        });
    });
}
