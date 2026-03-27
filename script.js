/**
 * TASK 1: THE SCRIPT FOUNDATION & DATA STRUCTURE
 */
class Product {
    constructor(id, name, price, image, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
    }
}

// 10 Test Data Products
const products = [
    new Product(1, "Wireless Headphones", 299.00, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", "High-quality noise cancellation."),
    new Product(2, "Smart Watch", 399.00, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", "Stay fit and connected."),
    new Product(3, "Mechanical Keyboard", 150.00, "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300", "RGB backlit tactile keys."),
    new Product(4, "Gaming Mouse", 85.00, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", "Ultra-fast response time."),
    new Product(5, "USB-C Hub", 55.00, "https://images.unsplash.com/photo-1562770584-eaf50b017307?w=300", "7-in-1 connectivity."),
    new Product(6, "4K Monitor", 450.00, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300", "Stunning ultra-HD visuals."),
    new Product(7, "Laptop Stand", 45.00, "https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=300", "Ergonomic aluminum design."),
    new Product(8, "Portable SSD", 120.00, "https://images.unsplash.com/photo-1597872200370-493dee2474a6?w=300", "1TB high-speed storage."),
    new Product(9, "Webcam HD", 95.00, "https://images.unsplash.com/photo-1585338107529-13afc5f0141f?w=300", "1080p pro streaming."),
    new Product(10, "LED Desk Lamp", 35.00, "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=300", "Eye-friendly dimmable light.")
];

// Cart State (Stored in LocalStorage to persist between pages)
let cart = JSON.parse(localStorage.getItem('techCart')) || [];

/**
 * TASK 2: DYNAMIC PRODUCT RENDERING (products.html)
 */
function renderProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear static HTML

    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        const h3 = document.createElement('h3');
        h3.textContent = product.name;

        const p = document.createElement('p');
        p.textContent = product.description;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = product.price.toFixed(2);

        const btn = document.createElement('button');
        btn.textContent = "Add to Cart";
        btn.setAttribute('data-id', product.id); // Store ID
        btn.classList.add('add-to-cart-btn');
        btn.style.width = "100%";

        // Append everything
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(price);
        card.appendChild(btn);
        grid.appendChild(card);
    });
}

/**
 * TASK 3: EVENT HANDLING & THE CART
 */
// Event Delegation (Bubbling)
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === id);
        
        if (product) {
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
            
            // Task 6: Feedback Animation
            const card = e.target.closest('article');
            card.classList.add('fade-in');
            setTimeout(() => card.classList.remove('fade-in'), 600);
        }
    }
});

function renderCart() {
    const cartContainer = document.querySelector('#cart ul');
    const totalDisplay = document.querySelector('.subtotal p');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        
        const title = document.createElement('h3');
        title.textContent = item.name;

        const price = document.createElement('p');
        price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.value = item.quantity;
        qtyInput.min = '0';

        // Quantity Adjustment Logic
        qtyInput.addEventListener('change', () => {
            const newQty = parseInt(qtyInput.value);
            if (newQty <= 0) {
                cart = cart.filter(i => i.id !== item.id);
            } else {
                item.quantity = newQty;
            }
            saveCart();
            renderCart();
        });

        li.appendChild(title);
        li.appendChild(price);
        li.appendChild(qtyInput);
        cartContainer.appendChild(li);
    });

    // Calculate Total using Reduce
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalDisplay) totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('techCart', JSON.stringify(cart));
}

/**
 * TASK 4: FORM VALIDATION (checkout.html)
 */
const checkoutForm = document.querySelector('#checkout form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent reload
        
        const inputs = checkoutForm.querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add('error'); // CSS class
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });

        if (valid) {
            alert("Order Placed Successfully!");
            cart = [];
            saveCart();
            window.location.href = 'account.html';
        }
    });
}

/**
 * TASK 5: USER ACCOUNT (account.html)
 */
const currentUser = {
    name: "Juan Dela Cruz",
    orderHistory: [
        { date: "Oct 12, 2025", total: 45.00, items: "1x Headphones, 2x USB Cables" }
    ]
};

function initAccount() {
    const greeting = document.querySelector('header h1');
    if (greeting && window.location.pathname.includes('account.html')) {
        greeting.textContent = `Hello, ${currentUser.name}!`; // Dynamic greeting
    }

    // Expanding Orders logic
    const summaries = document.querySelectorAll('summary');
    summaries.forEach(summary => {
        summary.addEventListener('click', function() {
            const parent = this.parentElement;
            if (!parent.querySelector('.order-data')) {
                const p = document.createElement('p');
                p.className = 'order-data';
                p.textContent = `Details: ${currentUser.orderHistory[0].items} | Total: $${currentUser.orderHistory[0].total}`;
                parent.appendChild(p);
            }
        });
    });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    initAccount();
});