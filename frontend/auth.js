// 🔐 LOGIN
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.status === "success") {
        localStorage.setItem("user", email);
        alert("Login successful ✅");
        window.location.href = "index.html";
    } else {
        alert(data.message);
    }
}

// 📝 SIGNUP
async function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Fill all fields!");
        return;
    }

    const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.status === "success") {
        alert("Signup successful 🎉");
        window.location.href = "login.html";
    } else {
        alert(data.message);
    }
}
