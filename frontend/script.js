const API = "http://127.0.0.1:8000/api";

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];

const productList = document.getElementById("product-list");

// 🔢 Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// 🖥️ Render Products
function renderProducts(list) {
    if (!productList) return;
    productList.innerHTML = "";

    if (list.length === 0) {
        productList.innerHTML = "<h4 class='text-center mt-4'>No products found 😢</h4>";
        return;
    }

    list.forEach((product) => {
        productList.innerHTML += `
            <div class="col-md-3">
                <div class="card product-card mb-4">
                    <img src="${product.image}" class="card-img-top">
                    <div class="card-body text-center">
                        <h5>${product.name}</h5>
                        <p class="price">₹${product.price}</p>
                        <button class="btn btn-success w-100 mb-2" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="btn btn-outline-danger w-100 mb-2" onclick="addToWishlist(${product.id})">❤️ Wishlist</button>
                        <button class="btn btn-primary w-100" onclick="viewProduct(${product.id})">View</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 🛒 Add to Cart
window.addToCart = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(product.name + " added to cart 🛒");
};

// 👁️ View Product
window.viewProduct = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product.html";
};

// 🔍 Search
window.handleSearch = function (e) {
    e.preventDefault();
    const query = document.getElementById("search-input").value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(query)));
};

const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        renderProducts(products.filter(p => p.name.toLowerCase().includes(this.value.toLowerCase())));
    });
}

// 🔔 Toast
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// ❤️ Add to Wishlist
window.addToWishlist = async function (id) {
    const userEmail = localStorage.getItem("user");
    if (!userEmail) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const product = products.find(p => p.id === id);
    if (!product) return;

    const res = await fetch(`${API}/wishlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userEmail, product })
    });

    const data = await res.json();
    showToast(data.message);
};

// 🚀 Load Products from Backend
async function loadProducts() {
    try {
        const res = await fetch(`${API}/products/`);
        products = await res.json();
        renderProducts(products);

        // New Arrivals — last 5 products
        const newArrivals = [...products].slice(-5).reverse();
        const newArrivalsList = document.getElementById("new-arrivals-list");
        if (newArrivalsList) {
            newArrivalsList.innerHTML = "";
            newArrivals.forEach((product) => {
                newArrivalsList.innerHTML += `
                    <div class="col-md-3">
                        <div class="card product-card mb-4">
                            <span class="badge bg-primary" style="position:absolute;top:10px;left:10px;z-index:1;border-radius:6px;">New</span>
                            <img src="${product.image}" class="card-img-top">
                            <div class="card-body text-center">
                                <h5>${product.name}</h5>
                                <p class="price">₹${product.price}</p>
                                <button class="btn btn-success w-100 mb-2" onclick="addToCart(${product.id})">Add to Cart</button>
                                <button class="btn btn-primary w-100" onclick="viewProduct(${product.id})">View</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    } catch (err) {
        if (productList) productList.innerHTML = "<h4 class='text-center mt-4'>Could not load products. Make sure backend is running ⚠️</h4>";
    }
}

// 🎠 Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(n) {
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove("active"));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

window.prevSlide = function () { showSlide(currentSlide - 1); };
window.nextSlide = function () { showSlide(currentSlide + 1); };

if (slides.length > 0) setInterval(() => showSlide(currentSlide + 1), 4000);

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    loadProducts();

    // Auth button
    const authBtn = document.getElementById("auth-btn");
    const accountDropdown = document.getElementById("account-dropdown");
    const userEmail = localStorage.getItem("user");
    if (userEmail) {
        if (authBtn) authBtn.style.display = "none";
        if (accountDropdown) accountDropdown.style.display = "block";
    } else {
        if (authBtn) authBtn.style.display = "block";
        if (accountDropdown) accountDropdown.style.display = "none";
    }
});
