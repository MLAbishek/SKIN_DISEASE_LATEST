// Services Page JavaScript for SkinCare AI

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const billingToggle = document.getElementById('billing-toggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const statItems = document.querySelectorAll('.stat-item');

    // Initialize pricing toggle functionality
    initPricingToggle();

    // Initialize animations
    initAnimations();

    // Initialize interactive features
    initInteractiveFeatures();

    // Pricing Toggle Functionality
    function initPricingToggle() {
        if (!billingToggle) return;

        billingToggle.addEventListener('change', function () {
            const isAnnual = this.checked;
            updatePricing(isAnnual);
        });
    }

    function updatePricing(isAnnual) {
        const prices = {
            pro: {
                monthly: 9.99,
                annual: 7.99
            }
        };

        pricingCards.forEach(card => {
            const priceElement = card.querySelector('.amount');
            const planName = card.querySelector('h3').textContent.toLowerCase();

            if (planName === 'pro' && priceElement) {
                const newPrice = isAnnual ? prices.pro.annual : prices.pro.monthly;
                priceElement.textContent = newPrice.toFixed(2);

                // Update period text
                const periodElement = card.querySelector('.period');
                if (periodElement) {
                    periodElement.textContent = isAnnual ? '/month' : '/month';
                }

                // Add annual savings note
                const pricingNote = card.querySelector('.pricing-note');
                if (pricingNote && isAnnual) {
                    pricingNote.textContent = 'Billed annually ($95.88/year)';
                } else if (pricingNote && !isAnnual) {
                    pricingNote.textContent = '7-day free trial';
                }
            }
        });
    }

    // Animation Functions
    function initAnimations() {
        // Animate stats on scroll
        animateStatsOnScroll();

        // Animate service cards on scroll
        animateServiceCardsOnScroll();

        // Animate pricing cards on scroll
        animatePricingCardsOnScroll();
    }

    function animateStatsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => {
            observer.observe(item);
        });
    }

    function animateServiceCardsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        serviceCards.forEach(card => {
            observer.observe(card);
        });
    }

    function animatePricingCardsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        pricingCards.forEach(card => {
            observer.observe(card);
        });
    }

    // Interactive Features
    function initInteractiveFeatures() {
        // Add hover effects to service cards
        addServiceCardHoverEffects();

        // Add click effects to pricing cards
        addPricingCardClickEffects();

        // Add smooth scrolling to CTA buttons
        addSmoothScrolling();

        // Add tooltips to disabled buttons
        addTooltips();
    }

    function addServiceCardHoverEffects() {
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    function addPricingCardClickEffects() {
        pricingCards.forEach(card => {
            const ctaButton = card.querySelector('.btn:not(.btn-disabled)');
            if (ctaButton) {
                card.addEventListener('click', function (e) {
                    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                        ctaButton.click();
                    }
                });

                card.style.cursor = 'pointer';
            }
        });
    }

    function addSmoothScrolling() {
        const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    function addTooltips() {
        const disabledButtons = document.querySelectorAll('.btn-disabled');
        disabledButtons.forEach(button => {
            button.setAttribute('title', 'This feature is coming soon!');
        });
    }

    // Counter Animation for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseFloat(counter.textContent.replace(/[^\d.]/g, ''));
            const suffix = counter.textContent.replace(/[\d.]/g, '');
            let current = 0;
            const increment = target / 50;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = current.toFixed(1) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
        });
    }

    // Initialize counter animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // FAQ Accordion functionality (if needed)
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('h4');
            const answer = item.querySelector('p');

            if (question && answer) {
                // Initially hide answers
                answer.style.display = 'none';

                question.addEventListener('click', function () {
                    const isOpen = answer.style.display === 'block';

                    // Close all other answers
                    faqItems.forEach(otherItem => {
                        const otherAnswer = otherItem.querySelector('p');
                        if (otherAnswer) {
                            otherAnswer.style.display = 'none';
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current answer
                    if (!isOpen) {
                        answer.style.display = 'block';
                        item.classList.add('active');
                    }
                });

                // Add cursor pointer to questions
                question.style.cursor = 'pointer';
            }
        });
    }

    // Initialize FAQ accordion
    initFAQAccordion();

    // Add loading states to buttons
    function addLoadingStates() {
        const buttons = document.querySelectorAll('.btn:not(.btn-disabled)');

        buttons.forEach(button => {
            button.addEventListener('click', function () {
                if (this.textContent.includes('Subscribe') || this.textContent.includes('Contact')) {
                    const originalText = this.textContent;
                    this.textContent = 'Loading...';
                    this.disabled = true;

                    // Simulate loading (remove in production)
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    addLoadingStates();

    // Add parallax effect to hero section
    function addParallaxEffect() {
        const hero = document.querySelector('.services-hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Initialize parallax effect
    addParallaxEffect();

    // Add keyboard navigation
    function addKeyboardNavigation() {
        document.addEventListener('keydown', function (e) {
            // Tab navigation for pricing cards
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedElement = document.activeElement;
                if (focusedElement.closest('.pricing-card')) {
                    const ctaButton = focusedElement.closest('.pricing-card').querySelector('.btn:not(.btn-disabled)');
                    if (ctaButton) {
                        e.preventDefault();
                        ctaButton.click();
                    }
                }
            }
        });
    }

    addKeyboardNavigation();

    // Performance optimization: Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    lazyLoadImages();

    console.log('SkinCare AI - Services JavaScript loaded successfully');
});
