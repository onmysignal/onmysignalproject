// ============================================
// SCROLL ANIMATION ENGINE
// ============================================

class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.heroAnimated = false;
        this.countersAnimated = false;
        this.init();
    }

    init() {
        // Wait for DOM
        this.setupScrollObserver();
        this.setupHeroAnimation();
        this.setupTextReveal();
        this.setupParallax();
        this.setupNavbarScroll();
        this.setupCounters();
        this.setupSmoothScroll();
    }

    // ============================================
    // Intersection Observer for scroll animations
    // ============================================
    setupScrollObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, options);

        // Observe all elements with data-scroll attribute
        document.querySelectorAll('[data-scroll]').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // Hero Section Animation (on load)
    // ============================================
    setupHeroAnimation() {
        const lines = document.querySelectorAll('.hero-title .line');
        const subtitle = document.querySelector('.hero-subtitle');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        // Animate hero elements on page load
        setTimeout(() => {
            lines.forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                    line.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`;
                }, index * 150);
            });

            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
                subtitle.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }, lines.length * 150 + 200);

            setTimeout(() => {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateY(0)';
                scrollIndicator.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            }, lines.length * 150 + 400);
        }, 300);
    }

    // ============================================
    // Text Reveal on Scroll
    // ============================================
    setupTextReveal() {
        const revealTexts = document.querySelectorAll('.reveal-text');

        revealTexts.forEach(text => {
            // Split text into words
            const words = text.textContent.split(' ');
            text.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
        });

        // Animate words based on scroll position
        window.addEventListener('scroll', () => {
            revealTexts.forEach(text => {
                const rect = text.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
                    const words = text.querySelectorAll('.word');
                    const progress = 1 - (rect.top / (windowHeight * 0.8));
                    const wordsToReveal = Math.floor(progress * words.length);

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
    // Parallax Effect
    // ============================================
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-image');

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(el => {
                const container = el.closest('.parallax-container');
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top < windowHeight && rect.bottom > 0) {
                    const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                    const translateY = (scrollPercent - 0.5) * 60;
                    el.style.transform = `translateY(${translateY}px)`;
                }
            });
        });
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.style.padding = '1rem 3rem';
                navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            } else {
                navbar.style.padding = '1.5rem 3rem';
                navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Animated Counters
    // ============================================
    setupCounters() {
        const counters = document.querySelectorAll('.counter-number');
        const counterSection = document.querySelector('.counter-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    this.countersAnimated = true;
                    counters.forEach(counter => {
                        this.animateCounter(counter);
                    });
                }
            });
        }, { threshold: 0.5 });

        if (counterSection) {
            observer.observe(counterSection);
        }
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ============================================
    // Smooth Scroll for nav links
    // ============================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// Custom Cursor Trail Effect
// ============================================
class CursorEffect {
    constructor() {
        this.trails = [];
        this.maxTrails = 8;
        this.init();
    }

    init() {
        // Create trail elements
        for (let i = 0; i < this.maxTrails; i++) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${12 - i}px;
                height: ${12 - i}px;
                background: linear-gradient(135deg, #6c5ce7, #fd79a8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - (i * 0.12)};
                transition: transform ${0.1 + i * 0.03}s ease;
                transform: translate(-50%, -50%) scale(0);
            `;
            document.body.appendChild(trail);
            this.trails.push(trail);
        }

        let mouseX = 0, mouseY = 0;
        let isMoving = false;
        let timeout;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;

            this.trails.forEach((trail, i) => {
                setTimeout(() => {
                    trail.style.left = mouseX + 'px';
                    trail.style.top = mouseY + 'px';
                    trail.style.transform = 'translate(-50%, -50%) scale(1)';
                }, i * 40);
            });

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.trails.forEach(trail => {
                    trail.style.transform = 'translate(-50%, -50%) scale(0)';
                });
            }, 300);
        });
    }
}

// ============================================
// Magnetic Button Effect
// ============================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-button');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }
}

// ============================================
// Tilt Effect on Cards
// ============================================
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.service-card, .testimonial-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `
                    perspective(1000px) 
                    rotateY(${x * 10}deg) 
                    rotateX(${-y * 10}deg)
                    translateY(-5px)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
            });
        });
    }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator();
    new CursorEffect();
    new MagneticButtons();
    new TiltEffect();
});

// ============================================
// Scroll Progress Indicator
// ============================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6c5ce7, #fd79a8);
    z-index: 10001;
    transition: width 0.1s linear;
    width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.pageYOffset / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});
