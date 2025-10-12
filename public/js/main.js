// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact Form Submission (with reCAPTCHA)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('formMessage');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Get reCAPTCHA token
        let recaptchaToken = '';
        if (typeof grecaptcha !== 'undefined') {
            recaptchaToken = grecaptcha.getResponse();
            if (!recaptchaToken) {
                formMessage.className = 'form-message error';
                formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please complete the reCAPTCHA verification.';
                formMessage.style.display = 'block';
                return;
            }
        }
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = {
            message: document.getElementById('message').value,
            recaptchaToken: recaptchaToken
        };
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                formMessage.className = 'form-message success';
                formMessage.innerHTML = '<i class="fas fa-check-circle"></i> ' + result.message;
                contactForm.reset();
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
            } else {
                formMessage.className = 'form-message error';
                formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + result.message;
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again.';
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Show message
            formMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .pricing-card, .example-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Editable subdomain demo
const editableSubdomain = document.querySelector('.editable-subdomain');
if (editableSubdomain) {
    editableSubdomain.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            this.textContent = 'yourname';
        }
    });
    
    editableSubdomain.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });
}

// ==================== AI CHATBOT ====================
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Toggle chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
}

// Close chatbot
if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });
}

// Send message function
async function sendChatMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    chatbotInput.value = '';
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        // Send to AI endpoint
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add bot response
        addChatMessage(data.response, 'bot');
    } catch (error) {
        typingIndicator.remove();
        addChatMessage('Sorry, I encountered an error. Please try again!', 'bot');
    }
}

// Add message to chat
function addChatMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-avatar"><i class="fas fa-user"></i></div>
        `;
    }
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return messageDiv;
}

// Add typing indicator
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
}

// Send button click
if (chatbotSend) {
    chatbotSend.addEventListener('click', sendChatMessage);
}

// Enter key to send
if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Check for login required parameter
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'required') {
        // Show login message
        const loginMessage = document.createElement('div');
        loginMessage.className = 'login-required-message';
        loginMessage.innerHTML = `
            <div class="message-content">
                <i class="fas fa-info-circle"></i>
                <span>Please login with Google to access this page.</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        document.body.appendChild(loginMessage);
        
        setTimeout(() => {
            loginMessage.remove();
        }, 5000);
    }
});
