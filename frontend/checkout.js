const API = "http://127.0.0.1:8000/api";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPayment = "";

const orderItems = document.getElementById("order-items");
const totalPriceEl = document.getElementById("total-price");

// 🖥️ Render Order Summary
function renderSummary() {
    if (cart.length === 0) {
        orderItems.innerHTML = "<p>No items in cart</p>";
        totalPriceEl.innerText = 0;
        return;
    }

    let total = 0;
    orderItems.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;
        orderItems.innerHTML += `<p>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</p>`;
    });

    totalPriceEl.innerText = total;
}

// 🧾 Place Order
async function placeOrder() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const payment = selectedPayment || document.getElementById("payment").value;
    const userEmail = localStorage.getItem("user");

    if (!name || !phone || !address || !payment) {
        alert("Please fill all details!");
        return;
    }

    if (!userEmail) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const res = await fetch(`${API}/order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_email: userEmail,
            name, phone, address, payment, total,
            items: cart
        })
    });

    const data = await res.json();

    if (data.status === "success") {
        localStorage.removeItem("cart");
        alert(`Order placed successfully! 🎉 Order ID: #${data.order_id}`);
        window.location.href = "index.html";
    } else {
        alert("Something went wrong. Try again!");
    }
}

// 💳 Select Payment
function selectPayment(method, element) {
    selectedPayment = method;

    document.querySelectorAll(".payment-card").forEach(card => card.classList.remove("active"));
    element.classList.add("active");

    const cardForm = document.getElementById("card-form");
    if (method === "CARD") {
        cardForm.style.display = "block";
    } else {
        cardForm.style.display = "none";
    }
}

renderSummary();
