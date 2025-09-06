// Application State
let currentPage = 'login';
let isAuthenticated = false;
let cartItems = [];
let selectedProduct = null;
let products = [];
let myListings = [];
let purchases = [];
let selectedCategory = 'all';
let authStep = 'credentials'; // 'credentials' or 'otp-verification'
let authMode = 'login'; // 'login' or 'signup'
let currentEmail = '';
let otpTimer = 0;
let otpTimerInterval = null;

// Sample product data
const sampleProducts = [
    {
        id: '1',
        title: 'Vintage Leather Jacket',
        price: 45.00,
        category: 'Clothing',
        condition: 'Very Good',
        description: 'Classic brown leather jacket in excellent condition. Perfect for fall weather.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
        co2Saved: 2.1
    },
    {
        id: '2',
        title: 'MacBook Pro 13"',
        price: 899.00,
        category: 'Electronics',
        condition: 'Good',
        description: 'MacBook Pro 13" from 2019. Some wear on the corners but fully functional.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        co2Saved: 15.2
    },
    {
        id: '3',
        title: 'Ceramic Plant Pots Set',
        price: 28.00,
        category: 'Home',
        condition: 'Like New',
        description: 'Set of 3 beautiful ceramic plant pots. Perfect for indoor plants.',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
        co2Saved: 1.5
    },
    {
        id: '4',
        title: 'Programming Books Collection',
        price: 35.00,
        category: 'Books',
        condition: 'Good',
        description: 'Collection of 5 programming books including JavaScript and Python guides.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        co2Saved: 0.8
    },
    {
        id: '5',
        title: 'Professional Camera Lens',
        price: 250.00,
        category: 'Electronics',
        condition: 'Very Good',
        description: '50mm f/1.8 lens compatible with Canon cameras. Excellent for portraits.',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
        co2Saved: 8.3
    },
    {
        id: '6',
        title: 'Yoga Mat & Blocks',
        price: 22.00,
        category: 'Sports',
        condition: 'Like New',
        description: 'Premium yoga mat with two supporting blocks. Used only a few times.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        co2Saved: 1.2
    }
];

// Initialize products
products = [...sampleProducts];

// DOM Elements
const navigation = document.getElementById('navigation');
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-button');
const loginForm = document.getElementById('login-form');
const addProductForm = document.getElementById('add-product-form');
const productsGrid = document.getElementById('products-grid');
const myListingsGrid = document.getElementById('my-listings-grid');
const cartContent = document.getElementById('cart-content');
const purchasesContent = document.getElementById('purchases-content');
const categoryPills = document.querySelectorAll('.category-pill');
const cartBadge = document.getElementById('cart-badge');
const productDetailModal = document.getElementById('product-detail-modal');
const toastContainer = document.getElementById('toast-container');

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Navigation Functions
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    currentPage = pageId;
    
    // Load page-specific content
    switch(pageId) {
        case 'home':
            loadProducts();
            break;
        case 'my-listings':
            loadMyListings();
            break;
        case 'cart':
            loadCart();
            break;
        case 'purchases':
            loadPurchases();
            break;
    }
}

function handlePageChange(pageId) {
    if (!isAuthenticated && pageId !== 'login') {
        showPage('login');
        return;
    }
    showPage(pageId);
}

// Authentication Functions
function handleCredentialsSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    currentEmail = formData.get('email');
    
    // Simulate sending OTP
    showToast(`OTP sent to ${currentEmail}! Check your email inbox.`);
    authStep = 'otp-verification';
    otpTimer = 60;
    startOtpTimer();
    renderLoginPage();
}

function handleOtpSubmit(e) {
    e.preventDefault();
    const otpInput = document.getElementById('otp-input');
    const otp = otpInput.value;
    
    if (otp.length !== 6) {
        showToast('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6) {
        isAuthenticated = true;
        navigation.style.display = 'block';
        authStep = 'credentials';
        
        if (authMode === 'signup') {
            showToast('Account created successfully! Welcome to EcoFinds! 🌱');
        } else {
            showToast('Login successful! Welcome back! 🌱');
        }
        
        showPage('home');
        clearOtpTimer();
    } else {
        showToast('Invalid OTP. Please try again.', 'error');
        otpInput.value = '';
    }
}

function handleResendOtp() {
    if (otpTimer > 0) return;
    
    otpTimer = 60;
    startOtpTimer();
    showToast('New OTP sent to your email!');
}

function handleBackToCredentials() {
    authStep = 'credentials';
    clearOtpTimer();
    renderLoginPage();
}

function startOtpTimer() {
    clearOtpTimer();
    otpTimerInterval = setInterval(() => {
        otpTimer--;
        updateResendButton();
        if (otpTimer <= 0) {
            clearOtpTimer();
        }
    }, 1000);
    updateResendButton();
}

function clearOtpTimer() {
    if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
        otpTimerInterval = null;
    }
    otpTimer = 0;
}

function updateResendButton() {
    const resendBtn = document.getElementById('resend-otp-btn');
    if (resendBtn) {
        if (otpTimer > 0) {
            resendBtn.textContent = `Resend OTP in ${otpTimer}s`;
            resendBtn.disabled = true;
        } else {
            resendBtn.textContent = 'Resend OTP';
            resendBtn.disabled = false;
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    isAuthenticated = true;
    navigation.style.display = 'block';
    showPage('home');
    showToast('Welcome to EcoFinds! 🌱');
}

function handleLogout() {
    isAuthenticated = false;
    currentPage = 'login';
    cartItems = [];
    selectedProduct = null;
    navigation.style.display = 'none';

    // Reset auth state to credentials
    authStep = 'credentials';
    clearOtpTimer();
    renderLoginPage();

    showPage('login');
    updateCartBadge();
    showToast("You've been logged out. See you soon! 👋");
}


// Product Functions
function createProductCard(product, showActions = true) {
    const isInCart = cartItems.some(item => item.id === product.id);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'">
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${product.title}</h3>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <div class="product-meta">
                    <span class="product-category">${product.category}</span>
                    <span class="product-condition">${product.condition}</span>
                </div>
                <p class="product-description">${product.description}</p>
                ${showActions ? `
                    <div class="product-actions">
                        <button class="add-to-cart-button" onclick="addToCart('${product.id}')" ${isInCart ? 'disabled' : ''}>
                            ${isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                        <button class="view-button" onclick="viewProduct('${product.id}')">View</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function loadProducts() {
    const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(p => p.category === selectedCategory);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="empty-cart">No products found in this category.</p>';
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function loadMyListings() {
    if (myListings.length === 0) {
        myListingsGrid.innerHTML = '<p class="empty-cart">You haven\'t listed any items yet. <button class="link-button" onclick="handlePageChange(\'add-product\')">List your first item</button></p>';
        return;
    }
    
    myListingsGrid.innerHTML = myListings.map(product => createProductCard(product, false)).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const isAlreadyInCart = cartItems.some(item => item.id === productId);
    if (!isAlreadyInCart) {
        cartItems.push(product);
        updateCartBadge();
        showToast(`${product.title} added to cart! 🛒`);
        loadProducts(); // Refresh to update button states
    } else {
        showToast('Item is already in your cart', 'info');
    }
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCartBadge();
    showToast('Item removed from cart');
    loadCart();
    loadProducts(); // Refresh to update button states
}

function updateCartBadge() {
    if (cartItems.length > 0) {
        cartBadge.textContent = cartItems.length;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

function loadCart() {
    if (cartItems.length === 0) {
        cartContent.innerHTML = '<div class="empty-cart">Your cart is empty. <button class="link-button" onclick="handlePageChange(\'home\')">Start shopping</button></div>';
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalCO2 = cartItems.reduce((sum, item) => sum + (item.co2Saved || 0), 0);
    
    cartContent.innerHTML = `
        ${cartItems.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop'">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <p style="color: var(--muted-foreground); font-size: 0.875rem;">CO₂ saved: ${(item.co2Saved || 0).toFixed(1)} kg</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-button" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('')}
        
        <div class="cart-summary">
            <div class="cart-total">
                <span>Total: ${formatPrice(total)}</span>
            </div>
            <p style="color: var(--primary); font-weight: 500; margin-bottom: 1rem; text-align: center;">
                🌱 You'll save ${totalCO2.toFixed(1)} kg of CO₂ with this purchase!
            </p>
            <button class="checkout-button" onclick="handleCheckout()">
                Complete Purchase
            </button>
        </div>
    `;
}

function handleCheckout() {
    if (cartItems.length === 0) return;
    
    // Add items to purchase history
    const purchase = {
        id: generateId(),
        items: [...cartItems],
        total: cartItems.reduce((sum, item) => sum + item.price, 0),
        co2Saved: cartItems.reduce((sum, item) => sum + (item.co2Saved || 0), 0),
        date: new Date().toLocaleDateString()
    };
    
    purchases.push(purchase);
    cartItems = [];
    updateCartBadge();
    
    showToast('Order placed successfully! Your sustainable choices matter! 🌿');
    showPage('purchases');
}

function loadPurchases() {
    if (purchases.length === 0) {
        purchasesContent.innerHTML = '<div class="empty-cart">No purchases yet. <button class="link-button" onclick="handlePageChange(\'home\')">Start shopping</button></div>';
        return;
    }
    
    const totalCO2 = purchases.reduce((sum, purchase) => sum + purchase.co2Saved, 0);
    const totalItems = purchases.reduce((sum, purchase) => sum + purchase.items.length, 0);
    
    // Update eco stats
    document.querySelector('.stat-value').textContent = `${totalCO2.toFixed(1)} kg`;
    document.querySelectorAll('.stat-value')[1].textContent = totalItems;
    
    purchasesContent.innerHTML = purchases.map(purchase => `
        <div class="cart-item">
            <div class="cart-item-details" style="flex: 1;">
                <h3 class="cart-item-title">Order from ${purchase.date}</h3>
                <p class="cart-item-price">${formatPrice(purchase.total)}</p>
                <p style="color: var(--primary); font-size: 0.875rem;">CO₂ saved: ${purchase.co2Saved.toFixed(1)} kg</p>
                <div style="margin-top: 0.5rem;">
                    ${purchase.items.map(item => `
                        <span style="color: var(--muted-foreground); font-size: 0.875rem; margin-right: 1rem;">
                            ${item.title}
                        </span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    selectedProduct = product;
    const isInCart = cartItems.some(item => item.id === productId);
    
    document.getElementById('product-detail-content').innerHTML = `
        <div style="padding: 2rem;">
            <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius); margin-bottom: 1.5rem;" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop'">
            
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: var(--foreground);">${product.title}</h2>
                <span style="font-size: 2rem; font-weight: 700; color: var(--primary);">${formatPrice(product.price)}</span>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <span class="product-category">${product.category}</span>
                <span class="product-condition">${product.condition}</span>
            </div>
            
            <p style="color: var(--muted-foreground); margin-bottom: 1.5rem; line-height: 1.6;">
                ${product.description}
            </p>
            
            <div style="background: rgba(46, 125, 50, 0.1); padding: 1rem; border-radius: var(--radius); margin-bottom: 1.5rem;">
                <p style="color: var(--primary); font-weight: 500; margin: 0;">
                    🌱 By buying this item, you'll save ${(product.co2Saved || 0).toFixed(1)} kg of CO₂ from being produced!
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button class="add-to-cart-button" onclick="addToCart('${product.id}'); closeModal();" ${isInCart ? 'disabled' : ''} style="flex: 1;">
                    ${isInCart ? 'Already in Cart' : 'Add to Cart'}
                </button>
                <button class="view-button" onclick="closeModal()" style="flex: 1;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    productDetailModal.classList.add('show');
}

function closeModal() {
    productDetailModal.classList.remove('show');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newProduct = {
        id: generateId(),
        title: formData.get('title'),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        condition: formData.get('condition'),
        description: formData.get('description'),
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        co2Saved: Math.random() * 10 + 0.5 // Random CO2 savings
    };
    
    // Add to both products and myListings
    products.push(newProduct);
    myListings.push(newProduct);
    
    showToast('Your item has been listed successfully! 🎉');
    e.target.reset();
    showPage('my-listings');
}

function filterProducts(category) {
    selectedCategory = category;
    
    // Update active category pill
    categoryPills.forEach(pill => pill.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    loadProducts();
}

// Render Functions
function renderLoginPage() {
    const credentialsStep = document.getElementById('credentials-step');
    const otpStep = document.getElementById('otp-step');
    const loginSubtitle = document.getElementById('login-subtitle');
    const otpEmail = document.getElementById('otp-email');
    const verifyBtn = document.getElementById('verify-otp-btn');
    
    if (authStep === 'credentials') {
        credentialsStep.style.display = 'block';
        otpStep.style.display = 'none';
        loginSubtitle.textContent = 'Your sustainable marketplace';
    } else {
        credentialsStep.style.display = 'none';
        otpStep.style.display = 'block';
        loginSubtitle.textContent = 'Verification Required';
        otpEmail.textContent = currentEmail;
        verifyBtn.textContent = `Verify & ${authMode === 'signup' ? 'Create Account' : 'Sign In'}`;
    }
}

function switchAuthMode(mode) {
    authMode = mode;
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    // Update active tab
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    
    // Show/hide forms
    if (mode === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auth mode tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchAuthMode(tab.dataset.mode);
        });
    });
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleCredentialsSubmit);
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', handleCredentialsSubmit);
    
    // OTP form
    document.getElementById('otp-form').addEventListener('submit', handleOtpSubmit);
    
    // OTP input formatting
    const otpInput = document.getElementById('otp-input');
    otpInput.addEventListener('input', function(e) {
        // Only allow numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Enable/disable verify button
        const verifyBtn = document.getElementById('verify-otp-btn');
        verifyBtn.disabled = this.value.length !== 6;
    });
    
    // Add product form
    addProductForm.addEventListener('submit', handleAddProduct);
    
    // Navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            handlePageChange(page);
        });
    });
    
    // Add product button in my listings
    document.querySelector('.add-button').addEventListener('click', () => {
        handlePageChange('add-product');
    });
    
    // Category filters
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const category = pill.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // Account dropdown
    const accountButton = document.querySelector('.account-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const logoutBtn = document.querySelector('.logout-btn');
    
    accountButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
    });
    
    logoutBtn.addEventListener('click', handleLogout);
    
    // Modal close events
    document.querySelector('.close-button').addEventListener('click', closeModal);
    productDetailModal.addEventListener('click', (e) => {
        if (e.target === productDetailModal) {
            closeModal();
        }
    });
    
    // Initialize
    renderLoginPage();
    showPage('login');
});

// Global functions for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.viewProduct = viewProduct;
window.closeModal = closeModal;
window.handleCheckout = handleCheckout;
window.handlePageChange = handlePageChange;
window.handleResendOtp = handleResendOtp;
window.handleBackToCredentials = handleBackToCredentials;