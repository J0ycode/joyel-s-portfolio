/* ══════════════════════════════════════
   JOYEL JOE JOSH — PORTFOLIO 2026
   Script: Optimised for 60fps smooth scrolling
   Key fixes:
     • Removed all scrub-based hero/section parallax (main cause of lag)
     • Removed per-scroll gradient repaint on nav
     • Replaced O(n²) canvas connections with capped loop
     • Replaced infinite GSAP orbit tweens with CSS animation
     • Removed hero-content opacity fade on scroll
══════════════════════════════════════ */

(() => {
    'use strict';

    // ── UTILS ──
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const isMobile = () => window.innerWidth <= 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ══════════════════════════════════
    // GSAP SETUP
    // ══════════════════════════════════
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    // No smooth-scroll library — native OS scroll for zero-lag response
    const lenis = null;

    // ══════════════════════════════════
    // THEME SWITCHER
    // ══════════════════════════════════
    const initTheme = () => {
        const html = document.documentElement;
        const btn = $('#themeToggle');
        if (!btn) return;

        // Apply saved theme immediately (before paint)
        const saved = localStorage.getItem('portfolio-theme');
        if (saved) html.setAttribute('data-theme', saved);

        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'gold' ? '' : 'gold';
            if (next) {
                html.setAttribute('data-theme', next);
                localStorage.setItem('portfolio-theme', next);
            } else {
                html.removeAttribute('data-theme');
                localStorage.removeItem('portfolio-theme');
            }
        });
    };
    initTheme();

    // ══════════════════════════════════
    // PRELOADER
    // ══════════════════════════════════
    const initPreloader = () => {
        const loader = $('#preloader');
        const fill = $('.preloader-fill');
        if (!loader) return;

        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => { fill.style.width = '100%'; });

        window.addEventListener('load', () => {
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0, duration: 0.7, ease: 'power2.inOut',
                    onComplete: () => {
                        loader.remove();
                        document.body.style.overflow = '';
                        initHeroAnimations();
                    }
                });
            }, 1400);
        });

        // Fallback
        setTimeout(() => {
            if (!loader.parentNode) return;
            gsap.to(loader, {
                opacity: 0, duration: 0.5,
                onComplete: () => {
                    loader.remove();
                    document.body.style.overflow = '';
                    initHeroAnimations();
                }
            });
        }, 3200);
    };

    // ══════════════════════════════════
    // UNICORN STUDIO WEBGL BACKGROUND
    // Premium 3D Holographic Mesh
    // ══════════════════════════════════
    const initCanvas = () => {
        const bgContainer = $('#bgCanvas');
        if (!bgContainer) return;

        // Guard: only call if library loaded successfully from CDN
        if (typeof UnicornStudio === 'undefined') {
            console.warn('UnicornStudio not loaded — removing WebGL background.');
            bgContainer.remove();
            return;
        }

        UnicornStudio.init()
            .then(() => {
                console.log('Premium 3D Hologram Initialized');
            })
            .catch(err => {
                console.warn('WebGL init failed, removing BG:', err);
                bgContainer.remove();
            });
    };

    // ══════════════════════════════════
    // CUSTOM CURSOR
    // ══════════════════════════════════
    const initCursor = () => {
        if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

        const dot = $('#cursorDot');
        const ring = $('#cursorRing');
        if (!dot || !ring) return;

        // Start hidden — reveal only after first real mouse movement
        let hasMoved = false;
        let mx = -200, my = -200;
        let rx = -200, ry = -200;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            if (!hasMoved) {
                hasMoved = true;
                // Snap ring to position immediately on first move
                rx = mx; ry = my;
                document.body.classList.add('cursor-ready');
            }
        }, { passive: true });

        const renderCursor = () => {
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        const hoverEls = $$('a, button, .magnetic, .glass-card, input, textarea, .project-link-btn');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Shrink when mouse leaves the browser window, restore on re-enter
        document.addEventListener('mouseleave', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(0) translateZ(0)';
            ring.style.transform = 'translate(-50%, -50%) scale(0) translateZ(0)';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1) translateZ(0)';
            ring.style.transform = 'translate(-50%, -50%) scale(1) translateZ(0)';
        });
    };

    // ══════════════════════════════════
    // SCROLL PROGRESS BAR (passive)
    // ══════════════════════════════════
    const initScrollProgress = () => {
        const bar = $('#scrollProgress');
        if (!bar) return;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const max = document.documentElement.scrollHeight - window.innerHeight;
                    bar.style.width = (window.scrollY / max * 100) + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    };

    // ══════════════════════════════════
    // NAV
    // ══════════════════════════════════
    const initNav = () => {
        const nav = $('#nav');
        if (!nav) return;

        setTimeout(() => nav.classList.add('visible'), 200);

        // Throttled scroll class toggle
        let navTicking = false;
        window.addEventListener('scroll', () => {
            if (!navTicking) {
                requestAnimationFrame(() => {
                    nav.classList.toggle('scrolled', window.scrollY > 60);
                    navTicking = false;
                });
                navTicking = true;
            }
        }, { passive: true });

        // Active link tracking
        const sections = $$('section[id]');
        const navLinks = $$('.nav-link');
        let activeTicking = false;
        window.addEventListener('scroll', () => {
            if (!activeTicking) {
                requestAnimationFrame(() => {
                    let current = '';
                    sections.forEach(sec => {
                        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
                    });
                    navLinks.forEach(link => {
                        link.classList.toggle('active',
                            link.getAttribute('href') === `#${current}`);
                    });
                    activeTicking = false;
                });
                activeTicking = true;
            }
        }, { passive: true });

        // Mobile burger
        const burger = $('#navBurger');
        const drawer = $('#mobileDrawer');
        if (burger && drawer) {
            burger.addEventListener('click', () => {
                const isOpen = drawer.classList.toggle('open');
                burger.classList.toggle('open', isOpen);
                burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });
            $$('.drawer-link').forEach(link => {
                link.addEventListener('click', () => {
                    burger.classList.remove('open');
                    drawer.classList.remove('open');
                    burger.setAttribute('aria-expanded', 'false');
                    burger.setAttribute('aria-label', 'Open menu');
                    document.body.style.overflow = '';
                });
            });
        }

        // Smooth anchor scroll — use Lenis when available, GSAP fallback
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -64, duration: 1.2 });
                } else {
                    gsap.to(window, { duration: 1.1, scrollTo: { y: target, offsetY: 64 }, ease: 'power3.inOut' });
                }
            });
        });
    };

    // ══════════════════════════════════
    // MAGNETIC BUTTONS
    // ══════════════════════════════════
    const initMagnetic = () => {
        if (isMobile()) return;
        $$('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
                gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
            });
        });
    };

    // ══════════════════════════════════
    // ROLE CYCLER (Typewriter)
    // ══════════════════════════════════
    const initRoleCycle = () => {
        const el = $('#roleCycle');
        if (!el) return;
        const roles = ['systems.', 'startups.', 'solutions.', 'empires.', 'futures.'];
        let idx = 0, charIdx = 0, deleting = false;

        const type = () => {
            const current = roles[idx];
            if (!deleting) {
                el.textContent = current.substring(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            } else {
                el.textContent = current.substring(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    idx = (idx + 1) % roles.length;
                    setTimeout(type, 350);
                    return;
                }
            }
            setTimeout(type, deleting ? 40 : 85);
        };
        setTimeout(type, 2800);
    };

    // ══════════════════════════════════
    // HERO ANIMATIONS (plays after preloader — runs ONCE)
    // KEY FIX: removed all scrub/parallax ScrollTriggers from hero.
    //          Those were the main source of scroll lag.
    // ══════════════════════════════════
    const initHeroAnimations = () => {
        if (prefersReducedMotion) {
            gsap.set([
                '.gsap-hero-eyebrow', '.gsap-hero-line', '.gsap-hero-role',
                '.gsap-hero-desc', '.gsap-hero-actions', '.gsap-hero-stats',
                '.gsap-hero-visual', '.gsap-scroll-hint'
            ], { opacity: 1, y: 0, x: 0, scale: 1 });
            initRoleCycle();
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.gsap-hero-eyebrow',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.65 })
            .fromTo('.gsap-hero-line',
                { yPercent: 110, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.11, ease: 'power4.out' },
                '-=0.3')
            .fromTo('.gsap-hero-role',
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.65 },
                '-=0.45')
            .fromTo('.gsap-hero-desc',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.65 },
                '-=0.45')
            .fromTo('.gsap-hero-actions',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.55 },
                '-=0.35')
            .fromTo('.gsap-hero-stats',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.55 },
                '-=0.35')
            .fromTo('.gsap-hero-visual',
                { opacity: 0, scale: 0.88, rotate: -8 },
                { opacity: 1, scale: 1, rotate: 0, duration: 0.95, ease: 'power3.out' },
                0.2)
            .fromTo('.gsap-scroll-hint',
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.3');

        // Orbit icons fade in (CSS handles the rotation)
        gsap.fromTo('.orbit-item',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.4)', delay: 1 }
        );

        // Hero orb: single lightweight floating tween (CSS-composited transform)
        gsap.to('.hero-visual', {
            y: '-=16', duration: 3.2,
            ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8
        });

        // ── REMOVED: scrub parallax on .shape-1, .shape-2, .shape-3
        // ── REMOVED: hero-content fade-to-0.5 opacity on scroll
        // These were the core cause of scroll lag.

        initRoleCycle();
    };

    // ══════════════════════════════════
    // SCROLL ANIMATIONS (ScrollTrigger)
    // All use 'play none none none' — animate in once, stay visible.
    // No scrub. No repeated repaints.
    // ══════════════════════════════════
    const initScrollAnimations = () => {
        if (prefersReducedMotion) return;

        const once = { start: 'top 92%', toggleActions: 'play none none none' };

        // Section tags
        $$('.gsap-tag').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, x: -24 },
                { opacity: 1, x: 0, duration: 0.65, scrollTrigger: { trigger: el, ...once } }
            );
        });

        // Section headlines — word-clip reveal
        $$('.gsap-headline').forEach(el => {
            el.innerHTML = el.innerHTML.split('<br>').map(line =>
                `<span style="display:block;overflow:hidden"><span class="headline-word" style="display:block">${line}</span></span>`
            ).join('');

            gsap.fromTo(el.querySelectorAll('.headline-word'),
                { yPercent: 100, opacity: 0 },
                {
                    yPercent: 0, opacity: 1, stagger: 0.11, duration: 0.8, ease: 'power4.out',
                    scrollTrigger: { trigger: el, ...once }
                }
            );
        });

        // About
        gsap.fromTo('.gsap-about-text',
            { opacity: 0, x: -40 },
            {
                opacity: 1, x: 0, duration: 0.9,
                scrollTrigger: { trigger: '#about', start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
        gsap.fromTo('.info-card',
            { opacity: 0, y: 36, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, stagger: 0.09, duration: 0.65, ease: 'back.out(1.3)',
                scrollTrigger: { trigger: '.about-cards', start: 'top 92%', toggleActions: 'play none none none' }
            }
        );

        // Skills
        $$('.gsap-group-title').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, x: -24 },
                {
                    opacity: 1, x: 0, duration: 0.55, delay: i * 0.08,
                    scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
                }
            );
        });

        $$('.skills-group').forEach(group => {
            const cards = $$('.gsap-skill', group);
            gsap.fromTo(cards,
                { opacity: 0, y: -36, scale: 0.91 },
                {
                    opacity: 1, y: 0, scale: 1,
                    stagger: { amount: 0.55, grid: 'auto', from: 'start' },
                    duration: 0.6, ease: 'back.out(1.3)',
                    scrollTrigger: { trigger: group, start: 'top 92%', toggleActions: 'play none none none' }
                }
            );
        });

        // Skill level bars
        $$('.skill-level').forEach(bar => {
            const lvl = bar.getAttribute('data-level');
            bar.style.setProperty('--lvl', lvl + '%');
            ScrollTrigger.create({
                trigger: bar, start: 'top 95%',
                onEnter: () => bar.classList.add('animated')
            });
        });

        // Projects
        gsap.fromTo('.gsap-project',
            { opacity: 0, y: 50, scale: 0.94 },
            {
                opacity: 1, y: 0, scale: 1, stagger: 0.13, duration: 0.75, ease: 'power3.out',
                scrollTrigger: { trigger: '.projects-grid', start: 'top 92%', toggleActions: 'play none none none' }
            }
        );
        gsap.fromTo('.gsap-projects-cta',
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.65,
                scrollTrigger: { trigger: '.projects-cta', start: 'top 95%', toggleActions: 'play none none none' }
            }
        );

        // Contact
        gsap.fromTo('.gsap-contact-left',
            { opacity: 0, x: -50 },
            {
                opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: '#contact', start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
        gsap.fromTo('.gsap-contact-right',
            { opacity: 0, x: 50 },
            {
                opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: '#contact', start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
        gsap.fromTo('.form-field',
            { opacity: 0, y: 18 },
            {
                opacity: 1, y: 0, stagger: 0.08, duration: 0.55,
                scrollTrigger: { trigger: '.contact-form', start: 'top 92%', toggleActions: 'play none none none' }
            }
        );

        // Footer
        gsap.fromTo('#footer',
            { opacity: 0, y: 24 },
            {
                opacity: 1, y: 0, duration: 0.7,
                scrollTrigger: { trigger: '#footer', start: 'top 98%', toggleActions: 'play none none none' }
            }
        );

        // ── REMOVED: scroll-scrub backgroundSize on sections — was causing constant repaints
    };

    // ══════════════════════════════════
    // GLASS CARD 3D TILT
    // ══════════════════════════════════
    const initCardTilt = () => {
        if (isMobile()) return;
        $$('.glass-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -9;
                const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 9;
                gsap.to(card, {
                    rotateX: rx, rotateY: ry, transformPerspective: 800,
                    duration: 0.35, ease: 'power2.out', transformOrigin: 'center center'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'elastic.out(1,0.4)' });
            });
        });
    };

    // ══════════════════════════════════
    // PROJECT CARD GLOW
    // ══════════════════════════════════
    const initProjectGlow = () => {
        if (isMobile()) return;
        $$('.project-card').forEach(card => {
            const glow = $('.project-glow', card);
            if (!glow) return;
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                glow.style.background =
                    `radial-gradient(circle at ${x}% ${y}%, rgba(212,175,55,0.1), transparent 60%)`;
            });
        });
    };

    // ══════════════════════════════════
    // CONTACT FORM
    // ══════════════════════════════════
    const initContactForm = () => {
        const form = $('#contactForm');
        const btn = $('#submitBtn');
        if (!form || !btn) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            let valid = true;
            $$('.form-field input, .form-field textarea', form).forEach(field => {
                field.classList.remove('error');
                if (field.required && !field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                    gsap.fromTo(field, { x: -7 }, { x: 0, duration: 0.35, ease: 'elastic.out(1,0.4)' });
                }
                if (field.type === 'email' && field.value && !/\S+@\S+\.\S+/.test(field.value)) {
                    field.classList.add('error');
                    valid = false;
                }
            });
            if (!valid) return;

            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending...';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Message Sent!';
                btn.classList.add('success');
                form.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('success');
                    btn.disabled = false;
                }, 4000);
            }, 1800);
        });

        $$('.form-field input, .form-field textarea', form).forEach(field => {
            field.addEventListener('focus', () => {
                gsap.to(field, { boxShadow: '0 0 0 3px rgba(212,175,55,0.1)', duration: 0.25 });
            });
            field.addEventListener('blur', () => {
                gsap.to(field, { boxShadow: 'none', duration: 0.25 });
                if (field.required && !field.value.trim()) field.classList.add('error');
                else field.classList.remove('error');
            });
        });
    };

    // ══════════════════════════════════
    // ORBIT ANIMATION (Premium Interactive Orbit System)
    // Continuous smooth GSAP rotation. Slows down on planet hover.
    // Includes counter-rotation to keep icons upright.
    // ══════════════════════════════════
    const initOrbitAnimation = () => {
        if (prefersReducedMotion || isMobile()) return;

        // 1. Setup the forward rotation for the rings
        const skillRing = $('.ring-skills');
        const projRing = $('.ring-projects');

        const skillsTween = gsap.to(skillRing, {
            rotation: 360,
            duration: 40,
            repeat: -1,
            ease: 'linear'
        });

        const projTween = gsap.to(projRing, {
            rotation: -360,
            duration: 60,
            repeat: -1,
            ease: 'linear'
        });

        // 2. Setup the counter-rotation for the planets so they stay upright
        const skillPlanets = $$('.ring-skills .orbit-planet');
        const projPlanets = $$('.ring-projects .orbit-planet');

        const skillsCounterTween = gsap.to(skillPlanets, {
            rotation: -360,
            duration: 40,
            repeat: -1,
            ease: 'linear'
        });

        const projCounterTween = gsap.to(projPlanets, {
            rotation: 360,
            duration: 60,
            repeat: -1,
            ease: 'linear'
        });

        // 3. Hover Interaction - Slow down the rings smoothly
        const allPlanets = [...skillPlanets, ...projPlanets];

        allPlanets.forEach(planet => {
            planet.addEventListener('mouseenter', () => {
                // Add magnet pull class logic to styles using GSAP timescale
                gsap.to([skillsTween, projTween, skillsCounterTween, projCounterTween], {
                    timeScale: 0.1,  // Slow down rotation significantly
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });

            planet.addEventListener('mouseleave', () => {
                gsap.to([skillsTween, projTween, skillsCounterTween, projCounterTween], {
                    timeScale: 1, // Restore full speed
                    duration: 1.2,
                    ease: 'power2.inOut'
                });
            });
        });
    };

    // ══════════════════════════════════
    // SHAPES MOUSE PARALLAX (desktop only, mousemove — not scroll)
    // ══════════════════════════════════
    const initShapesParallax = () => {
        if (isMobile()) return;
        document.addEventListener('mousemove', e => {
            const mx = (e.clientX / window.innerWidth - 0.5);
            const my = (e.clientY / window.innerHeight - 0.5);
            gsap.to('.shape-3', { x: mx * 18, y: my * 18, duration: 1.4, ease: 'power2.out' });
        }, { passive: true });
    };

    // ── REMOVED: initNavParallax — was painting scroll-linked gradients every frame

    // ══════════════════════════════════
    // RESIZE HANDLER
    // ══════════════════════════════════
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    }, { passive: true });

    // ══════════════════════════════════
    // INIT ALL
    // ══════════════════════════════════
    const init = () => {
        initPreloader();
        initCanvas();
        initCursor();
        initScrollProgress();
        initNav();
        initMagnetic();
        initScrollAnimations();
        initCardTilt();
        initProjectGlow();
        initContactForm();
        initOrbitAnimation();   // no-op now; CSS handles it
        initShapesParallax();
        // initNavParallax();   // removed — was expensive scroll listener
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
