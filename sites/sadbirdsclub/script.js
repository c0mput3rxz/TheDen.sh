// Sad Birds Club - Loads from config
let currentCategory = 'earrings';
let cart = [];
let config = null;

document.addEventListener('DOMContentLoaded', async function() {
    const configLoader = new ConfigLoader();
    config = await configLoader.loadConfig();
    
    if (config.type === 'ecommerce') {
        setupNavigation();
        loadProducts('earrings');
        setupPenguins();
    }
});

function setupNavigation() {
    const navBar = document.getElementById('nav-bar');
    const categories = config.categories || [];
    
    navBar.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'nav-button';
        button.setAttribute('data-category', category);
        button.textContent = category;
        button.addEventListener('click', function() {
            currentCategory = category;
            navBar.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadProducts(category);
        });
        navBar.appendChild(button);
    });
    
    // Set initial active
    navBar.querySelector(`[data-category="${currentCategory}"]`).classList.add('active');
}

function loadProducts(category) {
    const productsGrid = document.getElementById('products-grid');
    const categoryProducts = config.products[category] || [];
    
    productsGrid.innerHTML = '';
    
    if (categoryProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: white; font-size: 1.5rem; grid-column: 1 / -1;">No products available in this category yet!</p>';
        return;
    }
    
    categoryProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-title">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id}, '${category}')">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId, category) {
    const product = config.products[category].find(p => p.id === productId);
    if (product) {
        cart.push(product);
        showNotification(`${product.name} added to cart!`);
        updateCartCount();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff69b4;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: 'Comic Sans MS', cursive;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function updateCartCount() {
    console.log('Cart items:', cart.length);
}

function setupPenguins() {
    const penguinRow = document.getElementById('penguin-row');
    for (let i = 0; i < 8; i++) {
        const penguin = document.createElement('div');
        penguin.className = 'penguin-icon';
        penguin.textContent = '🐧';
        penguinRow.appendChild(penguin);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

