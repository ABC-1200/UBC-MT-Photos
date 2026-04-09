/**
 * ═══════════════════════════════════════════════════════════
 * MT. PHOTOS — Interactive Scripts
 * ═══════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ─── Variables & Elements ───
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const cursorGlow = document.getElementById('cursor-glow');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    const starField = document.getElementById('star-field');
    const statNums = document.querySelectorAll('.stat-num');
    
    // ─── Cursor Glow Effect ───
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // ─── Navbar Scroll Effect ───
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Mobile Menu Toggle ───
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── Star Field Generation ───
    const createStars = () => {
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            const size = Math.random() * 2 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const dur = Math.random() * 3 + 2;
            const delay = Math.random() * 5;

            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--dur', `${dur}s`);
            star.style.animationDelay = `${delay}s`;
            
            starField.appendChild(star);
        }
    };
    createStars();

    // ─── Gallery Filtering ───
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            masonryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    // Add a slight delay for animation
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });

    // ─── Lightbox Functionality ───
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lbTitle = document.getElementById('lb-title');
    const lbLoc = document.getElementById('lb-loc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentPhotoIndex = 0;
    const galleryPhotos = Array.from(document.querySelectorAll('.photo-expand'));

    const openLightbox = (index) => {
        currentPhotoIndex = index;
        const trigger = galleryPhotos[index];
        lightboxImg.src = trigger.getAttribute('data-img');
        lbTitle.textContent = trigger.getAttribute('data-title');
        lbLoc.textContent = trigger.getAttribute('data-loc');
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    galleryPhotos.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-backdrop').addEventListener('click', closeLightbox);

    lightboxPrev.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
        openLightbox(currentPhotoIndex);
    });

    lightboxNext.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
        openLightbox(currentPhotoIndex);
    });

    // Keyboard support for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ─── Stats Counter Animation ───
    const animateStats = () => {
        statNums.forEach(num => {
            const target = +num.getAttribute('data-target');
            const count = +num.innerText;
            const speed = 200; // lower is slower
            const inc = target / speed;

            if (count < target) {
                num.innerText = Math.ceil(count + inc);
                setTimeout(animateStats, 10);
            } else {
                num.innerText = target;
            }
        });
    };

    // ─── Intersection Observer for Reveal ───
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If the target is the hero stats, trigger counting
                if (entry.target.classList.contains('hero-stats')) {
                   animateStats();
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to sections and specific elements
    const elementsToReveal = [
        '.hero-stats',
        '.section-header',
        '.masonry-item',
        '.about-grid',
        '.service-card',
        '.contact-grid',
        '.award-item'
    ];

    elementsToReveal.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    });

    // ─── Form Submission Simulation ───
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Simple validation
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent! ✨';
                formSuccess.textContent = 'Thank you! I will get back to you amidst the peaks.';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    formSuccess.textContent = '';
                }, 5000);
            }, 1500);
        });
    }
});
