// Contact Page JavaScript for SkinCare AI

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const contactForm = document.getElementById('contactForm');
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Form submission handler
    async function handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm(contactForm)) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('btn-loading');

        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Here you would typically send the data to your backend
            // const response = await fetch('/contact', {
            //     method: 'POST',
            //     body: formData
            // });

            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            clearAllFieldErrors();

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-loading');
        }
    }

    // Field validation
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            }
        }

        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }
        }

        // Show/hide error
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }

        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);

        // Add error class
        field.classList.add('input-error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 0.9rem;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid #ff4444;
            border-radius: 5px;
            animation: slideIn 0.3s ease-out;
        `;

        // Insert error message after field
        field.parentNode.appendChild(errorElement);
        field.errorElement = errorElement;
    }

    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('input-error');
        if (field.errorElement) {
            field.errorElement.remove();
            field.errorElement = null;
        }
    }

    // Clear all field errors
    function clearAllFieldErrors() {
        formInputs.forEach(input => {
            clearFieldError(input);
        });
    }

    // Form validation
    function validateForm(form) {
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        return isValid;
    }

    // Character counter for message field
    const messageField = contactForm?.querySelector('textarea[name="message"]');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 0.5rem;
        `;
        messageField.parentNode.appendChild(counter);

        function updateCounter() {
            const length = messageField.value.length;
            const maxLength = 1000; // Set your desired max length
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ff4444';
            } else if (length > maxLength * 0.7) {
                counter.style.color = '#ffc107';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }

        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }

    // Auto-resize textarea
    if (messageField) {
        messageField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    }

    // Contact info interactions
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const details = this.querySelector('.contact-details');
            if (details) {
                // Add click effect
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                // Copy email to clipboard if it's an email
                const emailElement = details.querySelector('p');
                if (emailElement && emailElement.textContent.includes('@')) {
                    navigator.clipboard.writeText(emailElement.textContent).then(() => {
                        showNotification('Email copied to clipboard!', 'success');
                    }).catch(() => {
                        showNotification('Could not copy email to clipboard.', 'error');
                    });
                }
            }
        });
    });

    // Social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.textContent;
            showNotification(`${platform} link clicked! (This would open the respective platform)`, 'info');
        });
    });

    // Quick links
    const quickLinks = document.querySelectorAll('.quick-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'translateX(5px)';
            setTimeout(() => {
                this.style.transform = 'translateX(0)';
            }, 200);
        });
    });

    // Support options
    const supportOptions = document.querySelectorAll('.support-option');
    supportOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.querySelector('h3').textContent;
            showNotification(`${title} feature would be implemented here.`, 'info');
        });
    });

    // Add CSS for form styling
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-primary);
            font-family: 'Unbounded', sans-serif;
            font-size: 1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: var(--glow-primary);
        }
        
        .form-group input.input-error,
        .form-group textarea.input-error,
        .form-group select.input-error {
            border-color: #ff4444;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
        }
        
        .contact-item {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 1rem;
            border-radius: 10px;
        }
        
        .contact-item:hover {
            background: rgba(0, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        
        .contact-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .contact-details h4 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        
        .contact-details p {
            color: var(--text-secondary);
            margin: 0.25rem 0;
        }
        
        .quick-links a {
            display: block;
            padding: 0.5rem 0;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        .quick-links a:hover {
            color: var(--primary-color);
            text-shadow: var(--glow-primary);
        }
        
        .support-option {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
        }
        
        .support-option:hover {
            border-color: var(--primary-color);
            box-shadow: var(--glow-primary);
            transform: translateY(-5px);
        }
        
        .support-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .support-option h3 {
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
            }
            
            .support-options {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('SkinCare AI - Contact JavaScript loaded successfully');
});
