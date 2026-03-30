// Data Loader Module
const DataLoader = {
  async loadProducts() {
    const res = await fetch('./data/products.json');
    return await res.json();
  },
  async loadBlog() {
    const res = await fetch('./data/blog.json');
    return await res.json();
  },
  async loadConfig() {
    const res = await fetch('./data/site-config.json');
    return await res.json();
  }
};

// Renderer Module
const Renderer = {
  renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // Sort by rank
    const sortedProducts = products.sort((a, b) => a.rank - b.rank);
    
    let html = '<div class="tools-grid">';
    
    sortedProducts.forEach(product => {
      if (!product.link_active) return;
      
      const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
      const prosHtml = product.pros.map(pro => `<div class="feature">✓ ${pro}</div>`).join('');
      const consHtml = product.cons.map(con => `<div class="feature">✗ ${con}</div>`).join('');
      
      html += `
        <div class="tool-card ${product.featured ? 'featured' : ''}">
          ${product.badge ? `<div class="tool-badge" style="background: ${product.badge_color}">${product.badge}</div>` : ''}
          <div class="tool-header">
            <h3>${product.name}</h3>
            <div class="rating">
              <span class="stars">${stars}</span>
              <span class="rating-text">${product.rating}/5</span>
            </div>
          </div>
          <div class="tool-description">
            <p>${product.tagline}</p>
          </div>
          <div class="tool-features">
            ${prosHtml}
          </div>
          <div class="tool-pricing">
            <span class="price">$${product.price_starting}/mo</span>
            <span class="original-price">$${Math.round(product.price_starting * 2.5)}/mo</span>
          </div>
          <button class="tool-cta" onclick="handleAffiliateClick('${product.id}', '${product.affiliate_url}')">
            Get ${product.commission_percent}% Off →
          </button>
        </div>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  },
  
  renderComparison(products) {
    const container = document.getElementById('comparison-container');
    if (!container) return;
    
    const activeProducts = products.filter(p => p.link_active);
    
    let html = `
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              ${activeProducts.map(p => `<th>${p.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Primary Use</td>
              ${activeProducts.map(p => `<td>${p.category}</td>`).join('')}
            </tr>
            <tr>
              <td>Starting Price</td>
              ${activeProducts.map(p => `<td>$${p.price_starting}/month</td>`).join('')}
            </tr>
            <tr>
              <td>Commission</td>
              ${activeProducts.map(p => `<td>${p.commission_percent}% ${p.commission_type}</td>`).join('')}
            </tr>
            <tr>
              <td>Rating</td>
              ${activeProducts.map(p => `<td>${p.rating}/5 (${p.review_count} reviews)</td>`).join('')}
            </tr>
            <tr>
              <td>Best For</td>
              ${activeProducts.map(p => `<td>${p.category}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    container.innerHTML = html;
  },
  
  renderBlog(posts) {
    const container = document.getElementById('blog-container');
    if (!container) return;
    
    const activePosts = posts.filter(p => p.active);
    
    let html = '<div class="blog-grid">';
    
    activePosts.forEach(post => {
      html += `
        <article class="blog-card">
          <div class="blog-content">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <a href="${post.url}" class="blog-link" onclick="handleBlogClick('${post.id}')">Read Review →</a>
          </div>
        </article>
      `;
    });
    
    html += '</div>';
    container.innerHTML = html;
  }
};

// Last Updated Module
const LastUpdated = {
  render(lastUpdated) {
    const footerElement = document.querySelector('.copyright p');
    if (footerElement) {
      const date = new Date(lastUpdated);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      footerElement.innerHTML = `&copy; 2026 AIVerse. Last updated: ${formattedDate}`;
    }
  }
};

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ toggle functionality
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Handle affiliate link clicks
function handleAffiliateClick(tool, affiliateUrl) {
    // Track click analytics (placeholder for real analytics)
    console.log(`Affiliate link clicked: ${tool}`);
    console.log(`Redirecting to: ${affiliateUrl}`);
    
    // Google Analytics event tracking (TODO: Uncomment when GA4 is configured)
    // gtag('event', 'affiliate_click', {
    //     'tool_name': tool,
    //     'affiliate_url': affiliateUrl
    // });
    
    // Show loading state
    event.target.textContent = 'Loading...';
    event.target.disabled = true;
    
    // Simulate redirect delay for better UX
    setTimeout(() => {
        // In real implementation, this would redirect to actual affiliate links
        alert(`Redirecting to ${tool.charAt(0).toUpperCase() + tool.slice(1)} affiliate page...`);
        event.target.textContent = event.target.textContent.replace('Loading...', '');
        event.target.disabled = false;
        
        // Actual redirect to affiliate URL
        // window.open(affiliateUrl, '_blank');
    }, 500);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.tool-card, .testimonial-card, .problem-card, .solution-card, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add hover effects to tool cards
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment below for typing effect
        // typeWriter(heroTitle, originalText, 30);
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Form validation for potential newsletter signup
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add smooth reveal animation for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const number = parseInt(target.replace(/\D/g, ''));
        
        let current = 0;
        const increment = number / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let display = Math.floor(current);
            if (isPlus) display += '+';
            if (isPercentage) display += '%';
            
            stat.textContent = display;
        }, 30);
    });
}

// Trigger stats animation when CTA section is visible
const ctaObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            ctaObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const finalCTA = document.querySelector('.final-cta');
if (finalCTA) {
    ctaObserver.observe(finalCTA);
}

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy load images when implemented
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Enhanced accessibility for screen readers
document.querySelectorAll('button, a').forEach(element => {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
    
    element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
        }
    });
});

// Console branding
console.log('%c🚀 AIVerse - Your AI-Powered Workflow Starts Here', 
            'font-size: 20px; font-weight: bold; color: #06B6D4;');
console.log('%cTransform your workflow with cutting-edge AI tools', 
            'font-size: 14px; color: #A855F7;');

// Error handling for affiliate links
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('AIVerse initialized successfully');
    
    // Add loading complete indicator
    document.body.classList.add('loaded');
    
    // Load data and render components
    try {
        const [products, blogPosts, config] = await Promise.all([
            DataLoader.loadProducts(),
            DataLoader.loadBlog(),
            DataLoader.loadConfig()
        ]);
        
        // Render all components
        Renderer.renderProducts(products.products);
        Renderer.renderComparison(products.products);
        Renderer.renderBlog(blogPosts.posts);
        LastUpdated.render(config.last_updated);
        
        console.log('Data loaded and rendered successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback: show error message to user
        const errorHtml = `
            <div style="text-align: center; padding: 50px; color: #ef4444;">
                <h2>⚠️ Unable to load data</h2>
                <p>Please refresh the page or check your connection.</p>
            </div>
        `;
        document.getElementById('products-container').innerHTML = errorHtml;
    }
    
    // Initialize cookie consent
    initCookieConsent();
    
    // Initialize any tooltips or popovers
    initializeTooltips();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
});

// Cookie Consent Management
function initCookieConsent() {
    // Check if user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        // Create cookie consent banner
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-consent';
        cookieBanner.innerHTML = `
            <div class="cookie-consent-content">
                <p>We use cookies to enhance your experience and track affiliate performance. By continuing, you agree to our use of cookies.</p>
            </div>
            <div class="cookie-consent-buttons">
                <button class="cookie-btn cookie-accept" onclick="acceptCookies()">Accept</button>
                <button class="cookie-btn cookie-decline" onclick="declineCookies()">Decline</button>
            </div>
        `;
        
        document.body.appendChild(cookieBanner);
        
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Remove cookie banner
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
    }
    
    // Enable Google Analytics (TODO: Uncomment when GA4 is configured)
    // loadGoogleAnalytics();
    
    console.log('Cookie consent accepted');
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    
    // Remove cookie banner
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
    }
    
    console.log('Cookie consent declined');
}

// Google Analytics Loading (TODO: Configure with actual GA4 ID)
function loadGoogleAnalytics() {
    // This would be implemented when GA4 is set up
    console.log('Google Analytics would be loaded here');
}

// Blog click tracking
function handleBlogClick(articleId) {
    console.log(`Blog article clicked: ${articleId}`);
    
    // Google Analytics event tracking (TODO: Uncomment when GA4 is configured)
    // gtag('event', 'blog_click', {
    //     'article_id': articleId
    // });
    
    // Placeholder for actual blog functionality
    event.preventDefault();
    alert(`Blog article "${articleId}" would open here. This is a placeholder for future blog functionality.`);
}

// Scroll-triggered animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.tool-card, .testimonial-card, .problem-card, .solution-card, .faq-item, .blog-card'
    );
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation effect
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, Array.from(animatedElements).indexOf(entry.target) * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Tooltip system (for future enhancements)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}
