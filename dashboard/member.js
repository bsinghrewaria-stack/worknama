// =================== GLOBAL DATA ===================
let members = {}; // seatNo -> memberData
let totalSeats = 30; // total number of seats (change as per need)
let currentSeat = null;

// =================== SEAT GENERATION ===================
window.onload = function () {
  generateSeats();
  setupCamera();
};

function generateSeats() {
  const container = document.getElementById("seatContainer");
  container.innerHTML = "";

  for (let i = 1; i <= totalSeats; i++) {
    const seatBtn = document.createElement("button");
    seatBtn.className = "seat";
    seatBtn.textContent = i;

    if (members[i]) {
      seatBtn.classList.add("booked");
    }

    seatBtn.onclick = () => openSeat(i);
    container.appendChild(seatBtn);
  }
}

// =================== OPEN SEAT ===================
function openSeat(seatNo) {
  currentSeat = seatNo;

  if (members[seatNo]) {
    showMemberDetails(seatNo);
  } else {
    openAddMemberModal();
  }
}

// =================== ADD MEMBER MODAL ===================
function openAddMemberModal() {
  document.getElementById("addMemberModal").classList.remove("hidden");
}

function closeAddMemberModal() {
  document.getElementById("memberForm").reset();
  document.getElementById("profileCanvas").classList.add("hidden");
  document.getElementById("addMemberModal").classList.add("hidden");
}

// =================== SAVE MEMBER ===================
function saveMember() {
  const name = document.getElementById("memberName").value.trim();
  const mobile = document.getElementById("memberMobile").value.trim();

  if (!name || !mobile) {
    alert("Please fill required fields!");
    return;
  }

  // Capture profile picture
  const profileCanvas = document.getElementById("profileCanvas");
  let profileImg = profileCanvas.toDataURL("image/png");

  // Aadhaar Photo
  const aadhaarFile = document.getElementById("aadhaarPhoto").files[0];
  let aadhaarImg = aadhaarFile ? URL.createObjectURL(aadhaarFile) : "";

  members[currentSeat] = {
    seat: currentSeat,
    name,
    mobile,
    email: document.getElementById("memberEmail").value.trim(),
    dob: document.getElementById("memberDob").value,
    aadhaar: document.getElementById("memberAadhaar").value,
    address: document.getElementById("memberAddress").value,
    shift: document.getElementById("memberShift").value,
    joining: document.getElementById("joiningDate").value,
    exit: document.getElementById("exitDate").value,
    fee: document.getElementById("feeAmount").value,
    discount: document.getElementById("feeDiscount").value,
    paid: document.getElementById("paidAmount").value,
    balance: document.getElementById("balanceAmount").value,
    method: document.getElementById("feeMethod").value,
    transaction: document.getElementById("transactionId").value,
    paymentDate: document.getElementById("paymentDate").value,
    status: "Active",
    profileImg,
    aadhaarImg,
  };

  closeAddMemberModal();
  generateSeats();
}

// =================== MEMBER DETAILS MODAL ===================
function showMemberDetails(seatNo) {
  const m = members[seatNo];

  document.getElementById("viewSeatNo").textContent = m.seat;
  document.getElementById("viewName").textContent = m.name;
  document.getElementById("viewMobile").textContent = m.mobile;
  document.getElementById("viewEmail").textContent = m.email;
  document.getElementById("viewDob").textContent = m.dob;
  document.getElementById("viewAadhaar").textContent = m.aadhaar;
  document.getElementById("viewAddress").textContent = m.address;
  document.getElementById("viewShift").textContent = m.shift;
  document.getElementById("viewJoining").textContent = m.joining;
  document.getElementById("viewExit").textContent = m.exit;
  document.getElementById("viewFee").textContent = m.fee;
  document.getElementById("viewDiscount").textContent = m.discount;
  document.getElementById("viewPaid").textContent = m.paid;
  document.getElementById("viewBalance").textContent = m.balance;
  document.getElementById("viewMethod").textContent = m.method;
  document.getElementById("viewTransaction").textContent = m.transaction;
  document.getElementById("viewPaymentDate").textContent = m.paymentDate;
  document.getElementById("viewStatus").textContent = m.status;

  document.getElementById("viewProfileImg").src = m.profileImg;
  document.getElementById("viewAadhaarImg").src = m.aadhaarImg;

  document.getElementById("memberDetailsModal").classList.remove("hidden");
}

function closeMemberModal() {
  document.getElementById("memberDetailsModal").classList.add("hidden");
}

// =================== DELETE MEMBER ===================
function deleteMember() {
  if (confirm("Are you sure you want to delete this member?")) {
    delete members[currentSeat];
    closeMemberModal();
    generateSeats();
  }
}

// =================== EDIT MEMBER ===================
function enableEditMode() {
  const m = members[currentSeat];

  document.getElementById("memberDetailsView").classList.add("hidden");
  document.getElementById("editMemberForm").classList.remove("hidden");

  document.getElementById("editMemberName").value = m.name;
  document.getElementById("editMemberMobile").value = m.mobile;
  document.getElementById("editMemberEmail").value = m.email;
  document.getElementById("editMemberDob").value = m.dob;
  document.getElementById("editMemberAadhaar").value = m.aadhaar;
  document.getElementById("editMemberAddress").value = m.address;
  document.getElementById("editMemberShift").value = m.shift;
  document.getElementById("editJoiningDate").value = m.joining;
  document.getElementById("editExitDate").value = m.exit;
  document.getElementById("editFeeAmount").value = m.fee;
  document.getElementById("editFeeDiscount").value = m.discount;
  document.getElementById("editPaidAmount").value = m.paid;
  document.getElementById("editBalanceAmount").value = m.balance;
  document.getElementById("editFeeMethod").value = m.method;
  document.getElementById("editTransactionId").value = m.transaction;
  document.getElementById("editPaymentDate").value = m.paymentDate;
}

function updateMember() {
  const m = members[currentSeat];

  m.name = document.getElementById("editMemberName").value;
  m.mobile = document.getElementById("editMemberMobile").value;
  m.email = document.getElementById("editMemberEmail").value;
  m.dob = document.getElementById("editMemberDob").value;
  m.aadhaar = document.getElementById("editMemberAadhaar").value;
  m.address = document.getElementById("editMemberAddress").value;
  m.shift = document.getElementById("editMemberShift").value;
  m.joining = document.getElementById("editJoiningDate").value;
  m.exit = document.getElementById("editExitDate").value;
  m.fee = document.getElementById("editFeeAmount").value;
  m.discount = document.getElementById("editFeeDiscount").value;
  m.paid = document.getElementById("editPaidAmount").value;
  m.balance = document.getElementById("editBalanceAmount").value;
  m.method = document.getElementById("editFeeMethod").value;
  m.transaction = document.getElementById("editTransactionId").value;
  m.paymentDate = document.getElementById("editPaymentDate").value;

  cancelEdit();
  showMemberDetails(currentSeat);
}

function cancelEdit() {
  document.getElementById("memberDetailsView").classList.remove("hidden");
  document.getElementById("editMemberForm").classList.add("hidden");
}

// =================== CHANGE SEAT ===================
function changeSeat() {
  let newSeat = prompt("Enter new seat number:");
  if (!newSeat || newSeat == currentSeat) return;

  if (members[newSeat]) {
    alert("Seat already booked!");
    return;
  }

  members[newSeat] = members[currentSeat];
  members[newSeat].seat = newSeat;
  delete members[currentSeat];
  currentSeat = newSeat;

  generateSeats();
  showMemberDetails(newSeat);
}

// =================== CAMERA CAPTURE ===================
function setupCamera() {
  const video = document.getElementById("profileCamera");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error("Camera not accessible", err);
      });
  }
}

function captureProfile() {
  const video = document.getElementById("profileCamera");
  const canvas = document.getElementById("profileCanvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.classList.remove("hidden");
}

// =================== PAYMENT DETAILS ===================
function togglePaymentDetails() {
  const method = document.getElementById("feeMethod").value;
  document
    .getElementById("paymentDetails")
    .classList.toggle("hidden", method === "Cash");
}

function toggleEditPaymentDetails() {
  const method = document.getElementById("editFeeMethod").value;
  document
    .getElementById("editPaymentDetails")
    .classList.toggle("hidden", method === "Cash");
}
