// E-commerce Project Script

class EcommerceStore {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'MacBook Pro',
                description: 'Powerful laptop for professionals',
                price: 1999.99,
                image: '💻'
            },
            {
                id: 2,
                name: 'iPhone 15',
                description: 'Latest smartphone with advanced features',
                price: 999.99,
                image: '📱'
            },
            {
                id: 3,
                name: 'AirPods Pro',
                description: 'Wireless earbuds with noise cancellation',
                price: 249.99,
                image: '🎧'
            },
            {
                id: 4,
                name: 'iPad Air',
                description: 'Versatile tablet for work and play',
                price: 599.99,
                image: '📱'
            },
            {
                id: 5,
                name: 'Apple Watch',
                description: 'Smartwatch for fitness and productivity',
                price: 399.99,
                image: '⌚'
            },
            {
                id: 6,
                name: 'Magic Keyboard',
                description: 'Wireless keyboard with Touch ID',
                price: 149.99,
                image: '⌨️'
            }
        ];
        
        this.cart = [];
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                document.getElementById('checkout').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <div class="product-content">
                    <div class="product-name">${product.name}</div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="store.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.updateCartDisplay();
            }
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="store.removeFromCart(${item.id})">Remove</button>
                </div>
            `).join('');
        }

        this.updateCartSummary();
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    handleCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zip: document.getElementById('zip').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiry: document.getElementById('expiry').value,
            cvv: document.getElementById('cvv').value
        };

        // Simple validation
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zip', 'cardNumber', 'expiry', 'cvv'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            alert('Please fill in all required fields.');
            return;
        }

        // Simulate checkout process
        const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Order placed successfully! Thank you for your purchase.');
            this.cart = [];
            this.updateCartDisplay();
            document.getElementById('checkout-form').reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.store = new EcommerceStore();
    console.log('E-commerce store loaded successfully!');
});
