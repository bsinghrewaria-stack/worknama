// ================== Logout ==================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("worknamaUser");
  window.location.href = "../index.html";
});

// ================== Auth Check + Org Name Display ==================
window.onload = function () {
  // localStorage से current user/org fetch करो
  let currentUser = JSON.parse(localStorage.getItem("worknamaUser"));

  if (!currentUser) {
    alert("Please login first!");
    window.location.href = "../index.html";
    return;
  }

  // Org Name / User Name show करो
  const orgDisplay = document.getElementById("orgNameDisplay");
  orgDisplay.textContent = currentUser.orgName || currentUser.username || "Unknown User";
};

// ================== Clock ==================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();
