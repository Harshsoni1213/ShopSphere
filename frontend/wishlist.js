const API = "http://127.0.0.1:8000/api";
const userEmail = localStorage.getItem("user");

const container = document.getElementById("wishlist-items");

// 🖥️ Render
function renderWishlist(wishlist) {
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="text-center p-5">
                <h4>Your wishlist is empty 😢</h4>
                <a href="index.html" class="btn btn-primary mt-3">Explore Products</a>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    wishlist.forEach((item) => {
        container.innerHTML += `
            <div class="col-md-3">
                <div class="card product-card mb-4">
                    <img src="${item.image}" class="card-img-top">
                    <div class="card-body text-center">
                        <h5>${item.product_name}</h5>
                        <p>₹${item.price}</p>
                        <button class="btn btn-success w-100 mb-2" onclick="moveToCart(${item.product_id}, '${item.product_name}', ${item.price}, '${item.image}')">
                            Move to Cart 🛒
                        </button>
                        <button class="btn btn-outline-danger w-100" onclick="removeItem(${item.product_id})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// ❌ Remove from wishlist
async function removeItem(product_id) {
    await fetch(`${API}/wishlist/${userEmail}/${product_id}/`, { method: "DELETE" });
    loadWishlist();
}

// 🛒 Move to Cart
function moveToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let exists = cart.find(p => p.id === id);

    if (exists) {
        exists.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    removeItem(id);
    alert("Moved to cart 🛒");
}

// 📦 Load wishlist from backend
async function loadWishlist() {
    if (!userEmail) {
        container.innerHTML = `<div class="text-center p-5"><h4>Please <a href="login.html">login</a> to view wishlist</h4></div>`;
        return;
    }

    const res = await fetch(`${API}/wishlist/${userEmail}/`);
    const wishlist = await res.json();
    renderWishlist(wishlist);
}

loadWishlist();
