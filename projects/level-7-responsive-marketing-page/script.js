// Level 7: Responsive Marketing Page - JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Navigation functionality
  initNavigation();
  
  // Smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Form handling
  initFormHandling();
  
  // Intersection Observer for animations
  initScrollAnimations();
  
  // Mobile menu toggle
  initMobileMenu();
  
  // Button interactions
  initButtonInteractions();
});

// Navigation functionality
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  
  // Add scroll effect to navigation
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = 'none';
    }
  });
  
  // Active link highlighting
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Form handling
function initFormHandling() {
  const contactForm = document.querySelector('.contact__form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Basic validation
      if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Simulate form submission
      showNotification('Sending message...', 'info');
      
      setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        this.reset();
      }, 2000);
    });
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .about__card, .contact__item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// Mobile menu functionality
function initMobileMenu() {
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.contains('nav__links--open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
    
    // Close menu when clicking on links
    const mobileLinks = navLinks.querySelectorAll('.nav__link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }
}

function openMobileMenu() {
  const navLinks = document.querySelector('.nav__links');
  const navToggle = document.querySelector('.nav__toggle');
  
  if (navLinks && navToggle) {
    navLinks.classList.add('nav__links--open');
    navToggle.classList.add('nav__toggle--open');
    
    // Add mobile menu styles
    navLinks.style.cssText = `
      position: fixed;
      top: 4rem;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
      z-index: 1000;
    `;
    
    // Animate hamburger
    const hamburgers = navToggle.querySelectorAll('.nav__hamburger');
    hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    hamburgers[1].style.opacity = '0';
    hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  }
}

function closeMobileMenu() {
  const navLinks = document.querySelector('.nav__links');
  const navToggle = document.querySelector('.nav__toggle');
  
  if (navLinks && navToggle) {
    navLinks.classList.remove('nav__links--open');
    navToggle.classList.remove('nav__toggle--open');
    
    // Reset mobile menu styles
    navLinks.style.cssText = '';
    
    // Reset hamburger
    const hamburgers = navToggle.querySelectorAll('.nav__hamburger');
    hamburgers[0].style.transform = '';
    hamburgers[1].style.opacity = '';
    hamburgers[2].style.transform = '';
  }
}

// Button interactions
function initButtonInteractions() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    // Add ripple effect
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
    
    // Add hover effects
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add ripple animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Card hover effects
function initCardEffects() {
  const cards = document.querySelectorAll('.feature-card, .pricing-card, .about__card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// Initialize card effects
initCardEffects();

// Parallax effect for hero cards
function initParallaxEffect() {
  const heroCards = document.querySelectorAll('.hero__card');
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    heroCards.forEach((card, index) => {
      const speed = (index + 1) * 0.1;
      card.style.transform = `translateY(${rate * speed}px)`;
    });
  });
}

// Initialize parallax effect
initParallaxEffect();

// Pricing card selection
function initPricingSelection() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  pricingCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove active class from all cards
      pricingCards.forEach(c => c.classList.remove('pricing-card--selected'));
      
      // Add active class to clicked card
      this.classList.add('pricing-card--selected');
      
      // Add selection styles
      this.style.borderColor = '#0066cc';
      this.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
      
      // Reset other cards
      pricingCards.forEach(c => {
        if (c !== this) {
          c.style.borderColor = '';
          c.style.boxShadow = '';
        }
      });
    });
  });
}

// Initialize pricing selection
initPricingSelection();

// Typing animation for hero title
function initTypingAnimation() {
  const titleElement = document.querySelector('.hero__title');
  if (!titleElement) return;
  
  const text = titleElement.textContent;
  const highlightText = 'Frontend Mastery Hub';
  const beforeHighlight = text.split(highlightText)[0];
  const afterHighlight = text.split(highlightText)[1];
  
  titleElement.innerHTML = `
    ${beforeHighlight}<span class="hero__title--highlight typing-text"></span>${afterHighlight}
  `;
  
  const typingElement = titleElement.querySelector('.typing-text');
  let i = 0;
  
  function typeWriter() {
    if (i < highlightText.length) {
      typingElement.textContent += highlightText.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }
  
  // Start typing animation after a delay
  setTimeout(typeWriter, 1000);
}

// Initialize typing animation
initTypingAnimation();

// Performance monitoring
function initPerformanceMonitoring() {
  // Monitor scroll performance
  let ticking = false;
  
  function updateScrollEffects() {
    // Add any scroll-based effects here
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Accessibility improvements
function initAccessibility() {
  // Add keyboard navigation for cards
  const interactiveCards = document.querySelectorAll('.feature-card, .pricing-card');
  
  interactiveCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Add focus management for mobile menu
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
}

// Initialize accessibility features
initAccessibility();

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  // You could send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  // You could send this to an error tracking service
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isValidEmail,
    showNotification,
    openMobileMenu,
    closeMobileMenu
  };
}

