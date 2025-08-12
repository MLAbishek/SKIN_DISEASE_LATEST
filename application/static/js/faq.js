// FAQ Page JavaScript for SkinCare AI

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');

    // Category switching functionality
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show target category
            faqCategories.forEach(category => {
                category.classList.remove('active');
                if (category.id === targetCategory) {
                    category.classList.add('active');
                }
            });
        });
    });

    // FAQ item toggle functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                        if (otherToggle) otherToggle.textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0px';
                    toggle.textContent = '+';
                } else {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                }
            });
        }
    });

    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search FAQs...';
    searchInput.className = 'faq-search';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 1rem;
        margin: 2rem auto;
        display: block;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        color: var(--text-primary);
        font-family: 'Unbounded', sans-serif;
        font-size: 1rem;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;

    // Add search input to page
    const faqMain = document.querySelector('.faq-main');
    if (faqMain) {
        const searchContainer = document.createElement('div');
        searchContainer.style.textAlign = 'center';
        searchContainer.appendChild(searchInput);
        faqMain.insertBefore(searchContainer, faqMain.firstChild);
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all items
            faqItems.forEach(item => {
                item.style.display = 'block';
            });
            faqCategories.forEach(category => {
                category.style.display = 'block';
            });
            return;
        }

        // Filter items
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.faq-answer p');
            
            if (question && answer) {
                const questionText = question.textContent.toLowerCase();
                const answerText = answer.textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Highlight matching text
                    highlightText(question, searchTerm);
                    highlightText(answer, searchTerm);
                } else {
                    item.style.display = 'none';
                }
            }
        });

        // Show categories that have visible items
        faqCategories.forEach(category => {
            const visibleItems = category.querySelectorAll('.faq-item[style*="display: block"]');
            if (visibleItems.length > 0) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    });

    // Highlight search terms
    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark style="background: var(--primary-color); color: var(--background-dark); padding: 0 2px; border-radius: 3px;">$1</mark>');
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Clear search
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });

    // Focus management
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.boxShadow = 'var(--glow-primary)';
    });

    searchInput.addEventListener('blur', function() {
        this.style.borderColor = 'var(--border-color)';
        this.style.boxShadow = 'none';
    });

    // Auto-expand first item in each category
    faqCategories.forEach(category => {
        const firstItem = category.querySelector('.faq-item');
        if (firstItem) {
            setTimeout(() => {
                firstItem.classList.add('open');
                const answer = firstItem.querySelector('.faq-answer');
                const toggle = firstItem.querySelector('.faq-toggle');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                if (toggle) toggle.textContent = '−';
            }, 500);
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add CSS for FAQ animations
    const style = document.createElement('style');
    style.textContent = `
        .faq-category {
            display: none;
            animation: fadeIn 0.3s ease-out;
        }
        
        .faq-category.active {
            display: block;
        }
        
        .faq-question {
            cursor: pointer;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .faq-question:hover {
            border-color: var(--primary-color);
            box-shadow: var(--glow-primary);
            transform: translateY(-2px);
        }
        
        .faq-question h3 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .faq-toggle {
            font-size: 1.5rem;
            color: var(--primary-color);
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        
        .faq-item.open .faq-toggle {
            transform: rotate(180deg);
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            padding: 0 1.5rem;
        }
        
        .faq-answer p {
            margin: 0;
            padding: 1rem 0;
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        .category-btn {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Unbounded', sans-serif;
            font-weight: 500;
            margin: 0 0.5rem 1rem;
        }
        
        .category-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            box-shadow: var(--glow-primary);
        }
        
        .category-btn.active {
            background: var(--primary-color);
            color: var(--background-dark);
            border-color: var(--primary-color);
            box-shadow: var(--glow-primary);
        }
        
        .faq-categories {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .faq-question {
                padding: 1rem;
            }
            
            .faq-question h3 {
                font-size: 1rem;
            }
            
            .category-btn {
                margin: 0 0.25rem 0.5rem;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize FAQ categories
    if (faqCategories.length > 0) {
        faqCategories[0].classList.add('active');
    }

    console.log('SkinCare AI - FAQ JavaScript loaded successfully');
});
