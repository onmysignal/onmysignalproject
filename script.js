// ============================================
// MINIMAL SCROLL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    heroReveal();
    scrollReveal();
    counterAnimation();
    smoothNav();
});

// ============================================
// HERO — fade in on load
// ============================================
function heroReveal() {
    gsap.to('.reveal', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2,
    });
}

// ============================================
// SCROLL REVEAL — Intersection Observer
// ============================================
function scrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function counterAnimation() {
    const nums = document.querySelectorAll('.stat-num');
    let done = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !done) {
                done = true;
                nums.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    gsap.to(num, {
                        textContent: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                    });
                });
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.stats');
    if (stats) observer.observe(stats);
}

// ============================================
// SMOOTH NAV
// ============================================
function smoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
