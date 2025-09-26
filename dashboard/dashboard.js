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
  orgDisplay.textContent =
    currentUser.orgName || currentUser.username || "Unknown User";
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

// ================== Organisation Details Show ==================
document.getElementById("orgDetailsBtn").addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("worknamaUser"));
  if (!user) {
    alert("No organisation data found!");
    return;
  }

  // Modal ke andar HTML generate karo (Password hide karke)
  let detailsHtml = `
    <h3>Organisation Details</h3>
    <p><b>Organisation Name:</b> ${user.orgName}</p>
    <p><b>Admin / Owner:</b> ${user.adminName}</p>
    <p><b>Country:</b> ${user.country}</p>
    <p><b>State:</b> ${user.state}</p>
    <p><b>District:</b> ${user.district}</p>
    <p><b>City:</b> ${user.city}</p>
    <p><b>Pincode:</b> ${user.pincode}</p>
    <p><b>Mobile:</b> +${user.countryCode || ""} ${user.mobile}</p>
    <p><b>Email:</b> ${user.email}</p>
    <p><b>Password:</b> ******</p>
    <p><b>Shifts:</b> ${user.shiftCount}</p>
    <p><b>Subscription:</b> ${user.subscription} months</p>
    <p><b>Created At:</b> ${new Date(user.createdAt).toLocaleString()}</p>
  `;

  document.getElementById("orgDetailsContent").innerHTML = detailsHtml;
  document.getElementById("orgDetailsModal").classList.remove("hidden");
});

// ================== Close Organisation Details Modal ==================
document
  .getElementById("closeOrgDetails")
  .addEventListener("click", () => {
    document.getElementById("orgDetailsModal").classList.add("hidden");
  });
// Open Member Page
document.getElementById("addMemberBtn").addEventListener("click", () => {
  window.location.href = "member.html"; // same folder me hone par direct chalega
});
