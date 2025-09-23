// current user
    const user = JSON.parse(localStorage.getItem("worknamaUser"));

    if (!user) {
      // agar direct home.html khola without login → index.html redirect
      window.location.href = "index.html";
    } else {
      document.getElementById("welcomeMsg").innerText =
        "Welcome, " + (user.orgName || user.email || "User") + "!";
    }

    // logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("worknamaUser");
      window.location.href = "index.html";
    });