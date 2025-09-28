// ================== Logout ==================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("worknamaUser");
  window.location.href = "../index.html";
});

// ================== Auth Check + Org Name Display ==================
window.onload = function () {
  let currentUser = JSON.parse(localStorage.getItem("worknamaUser"));

  if (!currentUser) {
    alert("Please login first!");
    window.location.href = "../index.html";
    return;
  }

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
document.getElementById("closeOrgDetails").addEventListener("click", () => {
  document.getElementById("orgDetailsModal").classList.add("hidden");
});
// ================== Add Member Modal ==================
const addMemberBtn = document.getElementById("addMemberBtn");
const addMemberModal = document.getElementById("addMemberModal");
const closeAddMember = document.getElementById("closeAddMember");
const seatContainer = document.getElementById("seatContainer");

let seatCount = 50; // minimum 50 seats

// Load saved seats data from localStorage (if any)
let seatsData = JSON.parse(localStorage.getItem("seatsData")) || {};

// ================== Render Seats ==================
function renderSeats() {
  seatContainer.innerHTML = "";
  for (let i = 1; i <= seatCount; i++) {
    let seat = document.createElement("div");
    seat.className = "seat";

    // Check if seat is filled
    if (seatsData[i] && seatsData[i].filled) {
      seat.classList.add("selected");
      seat.textContent = `Seat ${i}`;
    } else {
      seat.textContent = i;
    }

    // Seat click opens Admission Form
    seat.addEventListener("click", () => openAdmissionForm(i));
    seatContainer.appendChild(seat);
  }
}

// ================== Open / Close Add Member Modal ==================
addMemberBtn.addEventListener("click", () => {
  renderSeats();
  addMemberModal.classList.remove("hidden");
});

closeAddMember.addEventListener("click", () => {
  addMemberModal.classList.add("hidden");
});

// ================== Add / Remove Seats ==================
document.getElementById("addSeatsBtn").addEventListener("click", () => {
  seatCount += 10;
  renderSeats();
});

document.getElementById("removeSeatsBtn").addEventListener("click", () => {
  if (seatCount > 50) {
    seatCount -= 10;
    renderSeats();
  } else {
    alert("At least 50 seats required!");
  }
});

// ================== Admission Form Modal ==================
const admissionFormModal = document.getElementById("admissionFormModal");
const closeAdmissionForm = document.getElementById("closeAdmissionForm");
const cancelAdmissionForm = document.getElementById("cancelAdmissionForm");
const admissionForm = document.getElementById("admissionForm");

// Seat number currently being edited
let currentSeatNumber = null;

// Open Admission Form
function openAdmissionForm(seatNumber) {
  currentSeatNumber = seatNumber;

  // Pre-fill if seat already has data
  if (seatsData[seatNumber]) {
    const data = seatsData[seatNumber];
    admissionForm.memberName.value = data.name || "";
    admissionForm.memberMobile.value = data.mobile || "";
    admissionForm.memberAadhaar.value = data.aadhaar || "";
    admissionForm.memberDob.value = data.dob || "";
    admissionForm.memberAddress.value = data.address || "";
    admissionForm.memberShift.value = data.shift || "";
    admissionForm.joiningDate.value = data.joiningDate || "";
    admissionForm.exitDate.value = data.exitDate || "";
    admissionForm.totalFee.value = data.totalFee || 0;
    admissionForm.discountFee.value = data.discount || 0;
    admissionForm.paidAmount.value = data.paid || 0;
    admissionForm.balanceAmount.value = (data.totalFee - data.discount - data.paid) || 0;
    admissionForm.paymentMethod.value = data.paymentMethod || "";
  } else {
    admissionForm.reset();
    admissionForm.balanceAmount.value = 0;
  }

  admissionFormModal.classList.remove("hidden");
}

// Close Admission Form
closeAdmissionForm.addEventListener("click", () => {
  admissionFormModal.classList.add("hidden");
});
cancelAdmissionForm.addEventListener("click", () => {
  admissionFormModal.classList.add("hidden");
});

// ================== Fee Balance Calculation ==================
admissionForm.totalFee.addEventListener("input", calculateBalance);
admissionForm.discountFee.addEventListener("input", calculateBalance);
admissionForm.paidAmount.addEventListener("input", calculateBalance);

function calculateBalance() {
  const total = parseFloat(admissionForm.totalFee.value) || 0;
  const discount = parseFloat(admissionForm.discountFee.value) || 0;
  const paid = parseFloat(admissionForm.paidAmount.value) || 0;
  const balance = total - discount - paid;
  admissionForm.balanceAmount.value = balance >= 0 ? balance : 0;
}

// ================== Save Admission Form ==================
admissionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Save data to seatsData
  seatsData[currentSeatNumber] = {
    filled: true,
    name: admissionForm.memberName.value,
    mobile: admissionForm.memberMobile.value,
    aadhaar: admissionForm.memberAadhaar.value,
    dob: admissionForm.memberDob.value,
    address: admissionForm.memberAddress.value,
    shift: admissionForm.memberShift.value,
    joiningDate: admissionForm.joiningDate.value,
    exitDate: admissionForm.exitDate.value,
    totalFee: parseFloat(admissionForm.totalFee.value) || 0,
    discount: parseFloat(admissionForm.discountFee.value) || 0,
    paid: parseFloat(admissionForm.paidAmount.value) || 0,
    balance: parseFloat(admissionForm.balanceAmount.value) || 0,
    paymentMethod: admissionForm.paymentMethod.value,
  };

  // Save to localStorage
  localStorage.setItem("seatsData", JSON.stringify(seatsData));

  // Re-render seats
  renderSeats();

  // Close Admission Form
  admissionFormModal.classList.add("hidden");
});
