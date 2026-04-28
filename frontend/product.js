document.addEventListener("DOMContentLoaded", function () {

    // 📦 Get product
    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    // 🔔 Toast
    function showToast(message) {
        const toast = document.getElementById("toast");

        if (!toast) return;

        toast.innerText = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }

    // ❌ If no product
    if (!product) {
        showToast("Product not found ❌");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

        return;
    }

    // 🖥️ Show product
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-price").innerText = "₹" + product.price;

    // 🛒 Add to Cart
    window.addToCartDetail = function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let exists = cart.find(item => item.id === product.id);

        if (exists) {
            exists.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        showToast("Added to cart 🛒");
    };

    // ⬅ Back Button
    window.goBack = function () {
        if (document.referrer) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    };

});