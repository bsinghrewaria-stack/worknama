// Get current user
const user = JSON.parse(localStorage.getItem("worknamaUser"));

if (!user) {
  window.location.href = "../index.html";
} else {
  document.getElementById("welcomeHeader").innerText =
    "Welcome, " + (user.orgName || user.email || "User") + "!";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("worknamaUser");
  window.location.href = "../index.html";
});

// Organisation Details Modal
const orgBtn = document.getElementById("orgDetailsBtn");
const orgModal = document.getElementById("orgModal");
const closeOrgModal = document.getElementById("closeOrgModal");
const closeOrgBtn = document.getElementById("closeOrgBtn");
const orgTable = document.getElementById("orgDetailsTable");

orgBtn.addEventListener("click", () => {
  // Clear table first
  orgTable.innerHTML = "";

  // user details from localStorage
  const details = user;
  
  // Add rows dynamically
  for (let key in details) {
    if (key === "credentials") {
      for (let credKey in details.credentials) {
        const row = orgTable.insertRow();
        row.insertCell(0).innerText = credKey;
        row.insertCell(1).innerText = details.credentials[credKey];
      }
    } else {
      const row = orgTable.insertRow();
      row.insertCell(0).innerText = key;
      row.insertCell(1).innerText = details[key];
    }
  }

  orgModal.classList.remove("hidden");
});

closeOrgModal.addEventListener("click", () => orgModal.classList.add("hidden"));
closeOrgBtn.addEventListener("click", () => orgModal.classList.add("hidden"));
