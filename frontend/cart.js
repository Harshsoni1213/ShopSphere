// 🛒 Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const totalItemsEl = document.getElementById("total-items");

// 🖥️ Render Cart
function renderCart() {

    // Empty cart
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center p-5 bg-white rounded">
                <h4>Your cart is empty 😢</h4>
                <a href="index.html" class="btn btn-primary mt-3">Go Shopping</a>
            </div>
        `;
        totalPriceEl.innerText = 0;
        totalItemsEl.innerText = 0;
        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">
                
                <div class="cart-left">
                    <img src="${item.image}">
                    <div>
                        <h5>${item.name}</h5>
                        <p>₹${item.price}</p>
                    </div>
                </div>

                <div>
                    <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>

            </div>
        `;
    });

    totalPriceEl.innerText = total;
    totalItemsEl.innerText = totalItems;
}

// ➕ Increase Quantity
function increaseQty(index) {
    cart[index].quantity++;
    saveCart();
}

// ➖ Decrease Quantity
function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeItem(index);
        return;
    }
    saveCart();
}

// ❌ Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

// 💾 Save Cart + Refresh UI
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// 🧹 Clear Cart (optional feature)
function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
}

// 🚀 Init
renderCart();