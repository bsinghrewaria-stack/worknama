// ----- Data: Countries (name + dial code) and sample states/districts -----
const COUNTRIES = [
  {code: 'IN', name: 'India', dial: '+91'},
  {code: 'US', name: 'United States', dial: '+1'},
  {code: 'GB', name: 'United Kingdom', dial: '+44'},
  {code: 'CA', name: 'Canada', dial: '+1'},
  {code: 'AU', name: 'Australia', dial: '+61'},
  {code: 'SG', name: 'Singapore', dial: '+65'},
  {code: 'AE', name: 'United Arab Emirates', dial: '+971'},
  {code: 'NZ', name: 'New Zealand', dial: '+64'},
  {code: 'ZA', name: 'South Africa', dial: '+27'},
  {code: 'BD', name: 'Bangladesh', dial: '+880'},
  {code: 'NP', name: 'Nepal', dial: '+977'},
  {code: 'LK', name: 'Sri Lanka', dial: '+94'},
  {code: 'PK', name: 'Pakistan', dial: '+92'},
  // add more if needed
];

const REGION_DATA = {
  'IN': {
    states: {
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
      'Karnataka': ['Bengaluru', 'Mysore', 'Mangalore'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
      'Delhi': ['Central Delhi', 'South Delhi', 'North Delhi'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai']
    }
  },
  'US': { states: { 'California': ['Los Angeles','San Diego'], 'Texas': ['Houston','Dallas'] } },
  'GB': { states: { 'England': ['Greater London'], 'Scotland': ['Glasgow'] } },
  // fallback structure for other countries will be simple empty
};

// ----- Helpers -----
function el(id) {
  return document.getElementById(id);
}
function createOpt(text, val) {
  const o = document.createElement('option');
  o.value = val !== undefined ? val : text;
  o.textContent = text;
  return o;
}

// ----- UI Elements -----
let openRegisterBtn = el('openRegisterBtn');
let modalOverlay = el('modalOverlay');
let closeModal = el('closeModal');
let cancelReg = el('cancelReg');
let countrySearch = el('countrySearch');
let countryList = el('countryList');
let countryCode = el('countryCode');
let stateSelect = el('stateSelect');
let districtSelect = el('districtSelect');
let shiftCount = el('shiftCount');
let shiftTimes = el('shiftTimes');
let sendMobileOtp = el('sendMobileOtp');
let mobileOtpRow = el('mobileOtpRow');
let mobileOtp = el('mobileOtp');
let verifyMobileOtp = el('verifyMobileOtp');
let mobileOtpInfo = el('mobileOtpInfo');
let sendEmailOtp = el('sendEmailOtp');
let emailOtpRow = el('emailOtpRow');
let emailOtp = el('emailOtp');
let verifyEmailOtp = el('verifyEmailOtp');
let emailOtpInfo = el('emailOtpInfo');
let emailInput = el('email');
let mobileInput = el('mobile');
let saveBtn = el('saveBtn');
let regForm = el('regForm');

let confOverlay = el('confOverlay');
let confMsg = el('confMsg');
let confBackLogin = el('confBackLogin');

// ----- State Variables -----
let selectedCountry = COUNTRIES.find(c=>c.code==='IN'); // default India
let mobileOtpSent = null;
let emailOtpSent = null;
let mobileVerified = false;
let emailVerified = false;

// ----- Initialization -----
function init(){
  renderCountryOptions();
  countrySearch.value = selectedCountry.name;
  countryCode.value = selectedCountry.dial;
  populateStatesForCountry(selectedCountry.code);

  openRegisterBtn.addEventListener('click', openModal);
  closeModal.addEventListener('click', closeModalFn);
  cancelReg.addEventListener('click', backToLogin);

  countrySearch.addEventListener('input', filterCountries);
  countrySearch.addEventListener('focus', ()=>{ countryList.style.display='block'; });
  document.addEventListener('click', (e)=>{ 
    if (!e.target.closest('.select-search')) countryList.style.display='none';
  });

  shiftCount.addEventListener('change', renderShiftTimeInputs);

  sendMobileOtp.addEventListener('click', handleSendMobileOtp);
  verifyMobileOtp.addEventListener('click', handleVerifyMobileOtp);

  sendEmailOtp.addEventListener('click', handleSendEmailOtp);
  verifyEmailOtp.addEventListener('click', handleVerifyEmailOtp);

  regForm.addEventListener('submit', handleRegister);

  confBackLogin.addEventListener('click', ()=>{
    confOverlay.classList.add('hidden');
    alert('Proceed to Login.'); 
  });

  renderShiftTimeInputs();
}

// ----- Country Selector UI -----
function renderCountryOptions(){
  countryList.innerHTML = '';
  COUNTRIES.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'opt';
    div.textContent = `${c.name} (${c.dial})`;
    div.dataset.code = c.code;
    div.dataset.dial = c.dial;
    div.addEventListener('click', ()=>{
      selectedCountry = c;
      countrySearch.value = c.name;
      countryCode.value = c.dial;
      countryList.style.display = 'none';
      // Repopulate state / district
      populateStatesForCountry(c.code);
    });
    countryList.appendChild(div);
  });
}

function filterCountries(){
  const q = countrySearch.value.trim().toLowerCase();
  const opts = countryList.querySelectorAll('.opt');
  let anyVisible = false;
  opts.forEach(o=>{
    const text = o.textContent.toLowerCase();
    if(text.includes(q)){
      o.style.display = 'block';
      anyVisible = true;
    } else {
      o.style.display = 'none';
    }
  });
  countryList.style.display = anyVisible ? 'block' : 'none';
}

// ----- States / Districts -----
function populateStatesForCountry(code){
  // Reset
  stateSelect.innerHTML = '';
  districtSelect.innerHTML = '';
  stateSelect.disabled = true;
  districtSelect.disabled = true;

  const region = REGION_DATA[code];
  if(region && region.states){
    const states = Object.keys(region.states);
    stateSelect.appendChild(createOpt('-- Select state --', ''));
    states.forEach(s => stateSelect.appendChild(createOpt(s, s)));
    stateSelect.disabled = false;
    // ensure old listener removed to avoid duplicates
    stateSelect.onchange = onStateChange;
  } else {
    // fallback: allow manual entry via text input
    // (for simplicity skip fallback or implement similarly)
    stateSelect.appendChild(createOpt('State not in list', ''));
    stateSelect.disabled = true;
  }
}

function onStateChange(e){
  const st = e.target.value;
  districtSelect.innerHTML = '';
  districtSelect.disabled = true;
  if(!st) return;
  const region = REGION_DATA[selectedCountry.code];
  if(region && region.states[st]){
    const districts = region.states[st];
    districtSelect.appendChild(createOpt('-- Select district --',''));
    districts.forEach(d => districtSelect.appendChild(createOpt(d, d)));
    districtSelect.disabled = false;
  }
}

// ----- Shift Time Inputs -----
function renderShiftTimeInputs(){
  const count = Number(shiftCount.value) || 1;
  shiftTimes.innerHTML = '';
  for(let i = 1; i <= count; i++){
    const div = document.createElement('div');
    div.className = 'shift-block';
    div.innerHTML = `
      <label>Shift ${i} Timing
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="time" class="shift-start" id="shift${i}Start" required />
          <input type="time" class="shift-end" id="shift${i}End" required />
        </div>
      </label>
    `;
    shiftTimes.appendChild(div);
  }
  if(count === 1){
    const s = el('shift1Start'), e = el('shift1End');
    if(s) s.value = '08:00';
    if(e) e.value = '20:00';
  }
}

// ----- OTP Helpers -----
function randomOtp(){
  return Math.floor(100000 + Math.random()*900000).toString();
}

function handleSendMobileOtp(){
  const mobile = mobileInput.value.trim();
  if(!/^\d{10}$/.test(mobile)){
    alert('Enter valid 10 digit mobile number (without country code).');
    return;
  }
  mobileOtpSent = randomOtp();
  mobileOtpRow.classList.remove('hidden');
  mobileOtpInfo.textContent = `Demo OTP: ${mobileOtpSent}`; // For testing
  mobileVerified = false;
}

function handleVerifyMobileOtp(){
  const otp = mobileOtp.value.trim();
  if(!mobileOtpSent){
    alert('Please send OTP first.');
    return;
  }
  if(otp === mobileOtpSent){
    mobileVerified = true;
    mobileOtpInfo.textContent = 'Mobile verified ✅';
    mobileOtpRow.classList.add('hidden');
  } else {
    mobileOtpInfo.textContent = 'Wrong OTP. Try again.';
  }
}

function handleSendEmailOtp(){
  const email = emailInput.value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email)){
    alert('Enter valid email address.');
    return;
  }
  emailOtpSent = randomOtp();
  emailOtpRow.classList.remove('hidden');
  emailOtpInfo.textContent = `Demo OTP: ${emailOtpSent}`; // For testing
  emailVerified = false;
}

function handleVerifyEmailOtp(){
  const otp = emailOtp.value.trim();
  if(!emailOtpSent){
    alert('Please send email OTP first.');
    return;
  }
  if(otp === emailOtpSent){
    emailVerified = true;
    emailOtpInfo.textContent = 'Email verified ✅';
    emailOtpRow.classList.add('hidden');
  } else {
    emailOtpInfo.textContent = 'Wrong OTP. Try again.';
  }
}

function handleRegister(e){
  e.preventDefault();

  if(!mobileVerified){
    alert('Please verify mobile.');
    return;
  }
  if(!emailVerified){
    alert('Please verify email.');
    return;
  }

  const email = emailInput.value.trim();
  const password = el('password').value;
  const orgName = el('orgName').value.trim();

  // 1. Get existing orgs from localStorage
  let orgs = JSON.parse(localStorage.getItem("orgs") || "[]");

  // 2. Create new org object
  const newOrg = {
    orgName: orgName,
    credentials: {
      email: email,
      password: password
    },
    createdAt: new Date().toISOString()
  };

  // 3. Save into localStorage
  orgs.push(newOrg);
  localStorage.setItem("orgs", JSON.stringify(orgs));

  // 4. Show confirmation
  confMsg.innerHTML = `<strong>Registered:</strong> ${orgName} <br/>
    <strong>Email:</strong> ${email} <br/>
    <strong>Password (one-time):</strong> <code>${password}</code>`;

  confOverlay.classList.remove('hidden');
  closeModalFn();
}


function openModal(){
  modalOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  // reset form
  regForm.reset();
  mobileOtpRow.classList.add('hidden');
  emailOtpRow.classList.add('hidden');
  mobileOtpInfo.textContent = '';
  emailOtpInfo.textContent = '';
  mobileOtpSent = null;
  emailOtpSent = null;
  mobileVerified = false;
  emailVerified = false;
  countrySearch.value = selectedCountry.name;
  countryCode.value = selectedCountry.dial;
  populateStatesForCountry(selectedCountry.code);
  renderShiftTimeInputs();
}

function closeModalFn(){
  modalOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function backToLogin(){
  closeModalFn();
  // you can also clear form or redirect
}

// Call init when DOM loaded
window.addEventListener('DOMContentLoaded', init);
const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', handleLogin)

function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById('loginEmail').value.trim()
  const password = document.getElementById('loginPassword').value

  if (!email || !password) {
    alert("Please enter both email and password.")
    return
  }

  const orgs = JSON.parse(localStorage.getItem('orgs') || '[]')
  const match = orgs.find(org => org.credentials.email === email && org.credentials.password === password)

  if (match) {
    // Store login info with SAME KEY used in home.html
    localStorage.setItem('worknamaUser', JSON.stringify(match))
    // Redirect to home page
    window.location.href = "./dashboard/dashboard.html";
  } else {
    alert("Invalid email or password.")
  }
}
// ----- Forgot Password Flow -----
const forgotLink = document.getElementById("forgotPasswordLink");
const forgotOverlay = document.getElementById("forgotOverlay");
const closeForgotModal = document.getElementById("closeForgotModal");
const forgotForm = document.getElementById("forgotForm");
const sendForgotOtp = document.getElementById("sendForgotOtp");
const forgotOtpRow = document.getElementById("forgotOtpRow");
const forgotOtp = document.getElementById("forgotOtp");
const verifyForgotOtp = document.getElementById("verifyForgotOtp");
const forgotOtpInfo = document.getElementById("forgotOtpInfo");
const forgotNewPassRow = document.getElementById("forgotNewPassRow");
const forgotEmailInput = document.getElementById("forgotEmail");

let forgotOtpSent = null;
let forgotEmailVerified = false;

// Open modal
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotOverlay.classList.remove("hidden");
});

// Close modal
closeForgotModal.addEventListener("click", () => {
  forgotOverlay.classList.add("hidden");
  resetForgotForm();
});

function resetForgotForm() {
  forgotForm.reset();
  forgotOtpRow.classList.add("hidden");
  forgotNewPassRow.classList.add("hidden");
  forgotOtpInfo.textContent = "";
  forgotOtpSent = null;
  forgotEmailVerified = false;
}

// Send OTP
sendForgotOtp.addEventListener("click", () => {
  const email = forgotEmailInput.value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Enter a valid email address.");
    return;
  }

  // check if email exists in localStorage
  const orgs = JSON.parse(localStorage.getItem("orgs") || "[]");
  const user = orgs.find((org) => org.credentials.email === email);

  if (!user) {
    alert("No account found with this email.");
    return;
  }

  forgotOtpSent = Math.floor(100000 + Math.random() * 900000).toString();
  forgotOtpRow.classList.remove("hidden");
  forgotOtpInfo.textContent = `Demo OTP: ${forgotOtpSent}`; // 🔥 testing purpose only
  forgotEmailVerified = false;
});

// Verify OTP
verifyForgotOtp.addEventListener("click", () => {
  if (!forgotOtpSent) {
    alert("Please send OTP first.");
    return;
  }
  if (forgotOtp.value.trim() === forgotOtpSent) {
    forgotEmailVerified = true;
    forgotOtpInfo.textContent = "Email verified ✅";
    forgotOtpRow.classList.add("hidden");
    forgotNewPassRow.classList.remove("hidden");
  } else {
    forgotOtpInfo.textContent = "Wrong OTP. Try again.";
  }
});

// Update password
forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!forgotEmailVerified) {
    alert("Please verify your email first.");
    return;
  }

  const email = forgotEmailInput.value.trim();
  const newPass = document.getElementById("forgotNewPassword").value;
  const confirmPass = document.getElementById("forgotConfirmPassword").value;

  if (newPass.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }
  if (newPass !== confirmPass) {
    alert("Passwords do not match.");
    return;
  }

  const orgs = JSON.parse(localStorage.getItem("orgs") || "[]");
  const user = orgs.find((org) => org.credentials.email === email);

  if (user) {
    user.credentials.password = newPass;
    localStorage.setItem("orgs", JSON.stringify(orgs));
    alert("Password updated successfully!");
    forgotOverlay.classList.add("hidden");
    resetForgotForm();
  }
});



