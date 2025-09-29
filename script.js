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
  {code: 'PK', name: 'Pakistan', dial: '+92'}
];

// ----- Region / States Data -----
const REGION_DATA = {
  'IN': { states: { 'Maharashtra': ['Mumbai','Pune','Nagpur'], 'Karnataka':['Bengaluru','Mysore'], 'Delhi':['Central Delhi','South Delhi'] } },
  'US': { states: { 'California': ['Los Angeles','San Diego'], 'Texas':['Houston','Dallas'] } },
  'GB': { states: { 'England':['London'], 'Scotland':['Glasgow'] } }
};

// ----- Helpers -----
const el = id => document.getElementById(id);
const createOpt = (text,val)=> { const o = document.createElement('option'); o.value = val||text; o.textContent=text; return o; };

// ----- UI Elements -----
let openRegisterBtn = el('openRegisterBtn'),
    modalOverlay = el('modalOverlay'),
    closeModal = el('closeModal'),
    cancelReg = el('cancelReg'),
    countrySearch = el('countrySearch'),
    countryList = el('countryList'),
    countryCode = el('countryCode'),
    stateSelect = el('stateSelect'),
    districtSelect = el('districtSelect'),
    shiftCount = el('shiftCount'),
    shiftTimes = el('shiftTimes'),
    sendMobileOtp = el('sendMobileOtp'),
    mobileOtpRow = el('mobileOtpRow'),
    mobileOtp = el('mobileOtp'),
    verifyMobileOtp = el('verifyMobileOtp'),
    mobileOtpInfo = el('mobileOtpInfo'),
    sendEmailOtp = el('sendEmailOtp'),
    emailOtpRow = el('emailOtpRow'),
    emailOtp = el('emailOtp'),
    verifyEmailOtp = el('verifyEmailOtp'),
    emailOtpInfo = el('emailOtpInfo'),
    emailInput = el('email'),
    mobileInput = el('mobile'),
    saveBtn = el('saveBtn'),
    regForm = el('regForm'),
    confOverlay = el('confOverlay'),
    confMsg = el('confMsg'),
    confBackLogin = el('confBackLogin');

// ----- State -----
let selectedCountry = COUNTRIES.find(c=>c.code==='IN');
let mobileOtpSent=null, emailOtpSent=null, mobileVerified=false, emailVerified=false;

// ----- Init -----
function init(){
  renderCountryOptions();
  countrySearch.value=selectedCountry.name;
  countryCode.value=selectedCountry.dial;
  populateStatesForCountry(selectedCountry.code);

  openRegisterBtn.addEventListener('click',openModal);
  closeModal.addEventListener('click',closeModalFn);
  cancelReg.addEventListener('click',backToLogin);

  countrySearch.addEventListener('input',filterCountries);
  countrySearch.addEventListener('focus',()=>countryList.style.display='block');
  document.addEventListener('click',(e)=>{if(!e.target.closest('.select-search')) countryList.style.display='none';});

  shiftCount.addEventListener('change',renderShiftTimeInputs);
  sendMobileOtp.addEventListener('click',handleSendMobileOtp);
  verifyMobileOtp.addEventListener('click',handleVerifyMobileOtp);
  sendEmailOtp.addEventListener('click',handleSendEmailOtp);
  verifyEmailOtp.addEventListener('click',handleVerifyEmailOtp);

  regForm.addEventListener('submit',handleRegister);

  confBackLogin.addEventListener('click',()=>{
    confOverlay.classList.add('hidden');
  });

  renderShiftTimeInputs();

  // Login form listener
  const loginForm = el('loginForm');
  if(loginForm) loginForm.addEventListener('submit',handleLogin);

  // Forgot password listeners
  initForgotPassword();
}

// ----- Country -----
function renderCountryOptions(){
  countryList.innerHTML='';
  COUNTRIES.forEach(c=>{
    const div=document.createElement('div');
    div.className='opt';
    div.textContent=`${c.name} (${c.dial})`;
    div.dataset.code=c.code;
    div.dataset.dial=c.dial;
    div.addEventListener('click',()=>{
      selectedCountry=c;
      countrySearch.value=c.name;
      countryCode.value=c.dial;
      countryList.style.display='none';
      populateStatesForCountry(c.code);
    });
    countryList.appendChild(div);
  });
}
function filterCountries(){
  const q=countrySearch.value.trim().toLowerCase();
  let any=false;
  countryList.querySelectorAll('.opt').forEach(o=>{
    const show=o.textContent.toLowerCase().includes(q);
    o.style.display=show?'block':'none';
    if(show) any=true;
  });
  countryList.style.display=any?'block':'none';
}
function populateStatesForCountry(code){
  stateSelect.innerHTML=''; districtSelect.innerHTML=''; stateSelect.disabled=true; districtSelect.disabled=true;
  const region=REGION_DATA[code];
  if(region && region.states){
    stateSelect.appendChild(createOpt('-- Select state --',''));
    Object.keys(region.states).forEach(s=>stateSelect.appendChild(createOpt(s,s)));
    stateSelect.disabled=false;
    stateSelect.onchange=onStateChange;
  }else{
    stateSelect.appendChild(createOpt('State not in list','')); stateSelect.disabled=true;
  }
}
function onStateChange(e){
  const st=e.target.value; districtSelect.innerHTML=''; districtSelect.disabled=true;
  if(!st) return;
  const region=REGION_DATA[selectedCountry.code];
  if(region && region.states[st]){
    districtSelect.appendChild(createOpt('-- Select district --',''));
    region.states[st].forEach(d=>districtSelect.appendChild(createOpt(d,d)));
    districtSelect.disabled=false;
  }
}

// ----- Shifts -----
function renderShiftTimeInputs(){
  const count=Number(shiftCount.value)||1;
  shiftTimes.innerHTML='';
  for(let i=1;i<=count;i++){
    const div=document.createElement('div');
    div.className='shift-block';
    div.innerHTML=`<label>Shift ${i} Timing
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="time" class="shift-start" id="shift${i}Start" required/>
        <input type="time" class="shift-end" id="shift${i}End" required/>
      </div></label>`;
    shiftTimes.appendChild(div);
  }
  if(count===1){
    const s=el('shift1Start'), e=el('shift1End');
    if(s) s.value='08:00'; if(e) e.value='20:00';
  }
}

// ----- OTP -----
const randomOtp=()=>Math.floor(100000+Math.random()*900000).toString();
function handleSendMobileOtp(){
  const m=mobileInput.value.trim();
  if(!/^\d{10}$/.test(m)){alert('Enter valid 10 digit mobile'); return;}
  mobileOtpSent=randomOtp(); mobileOtpRow.classList.remove('hidden'); mobileOtpInfo.textContent=`Demo OTP: ${mobileOtpSent}`; mobileVerified=false;
}
function handleVerifyMobileOtp(){ const otp=mobileOtp.value.trim(); if(!mobileOtpSent){alert('Send OTP first'); return;} if(otp===mobileOtpSent){mobileVerified=true; mobileOtpInfo.textContent='Mobile verified ✅'; mobileOtpRow.classList.add('hidden');} else mobileOtpInfo.textContent='Wrong OTP'; }
function handleSendEmailOtp(){ const e=emailInput.value.trim(); if(!/^\S+@\S+\.\S+$/.test(e)){alert('Valid email'); return;} emailOtpSent=randomOtp(); emailOtpRow.classList.remove('hidden'); emailOtpInfo.textContent=`Demo OTP: ${emailOtpSent}`; emailVerified=false;}
function handleVerifyEmailOtp(){ const otp=emailOtp.value.trim(); if(!emailOtpSent){alert('Send OTP first'); return;} if(otp===emailOtpSent){emailVerified=true; emailOtpInfo.textContent='Email verified ✅'; emailOtpRow.classList.add('hidden');} else emailOtpInfo.textContent='Wrong OTP';}

// ----- Register -----
function handleRegister(e){
  e.preventDefault();
  if(!mobileVerified){alert('Verify mobile'); return;}
  if(!emailVerified){alert('Verify email'); return;}
  const email=emailInput.value.trim(), password=el('password').value, orgName=el('orgName').value.trim();
  let orgs=JSON.parse(localStorage.getItem('orgs')||'[]');
  const newOrg={ orgName, credentials:{email,password}, createdAt:new Date().toISOString() };
  orgs.push(newOrg); localStorage.setItem('orgs',JSON.stringify(orgs));
  confMsg.innerHTML=`<strong>Registered:</strong> ${orgName} <br/><strong>Email:</strong> ${email} <br/><strong>Password:</strong> <code>${password}</code>`;
  confOverlay.classList.remove('hidden'); closeModalFn();
}

// ----- Modal -----
function openModal(){ modalOverlay.classList.remove('hidden'); document.body.classList.add('modal-open'); regForm.reset(); mobileOtpRow.classList.add('hidden'); emailOtpRow.classList.add('hidden'); mobileOtpInfo.textContent=''; emailOtpInfo.textContent=''; mobileOtpSent=null; emailOtpSent=null; mobileVerified=false; emailVerified=false; countrySearch.value=selectedCountry.name; countryCode.value=selectedCountry.dial; populateStatesForCountry(selectedCountry.code); renderShiftTimeInputs();}
function closeModalFn(){ modalOverlay.classList.add('hidden'); document.body.classList.remove('modal-open');}
function backToLogin(){ closeModalFn(); }

// ----- Login -----
function handleLogin(e){
  e.preventDefault();
  const email=el('loginEmail').value.trim(), password=el('loginPassword').value;
  if(!email||!password){alert('Enter email and password'); return;}
  const orgs=JSON.parse(localStorage.getItem('orgs')||'[]');
  const match=orgs.find(o=>o.credentials.email===email && o.credentials.password===password);
  if(match){
    const userData={orgName:match.orgName, credentials:match.credentials, createdAt:match.createdAt};
    localStorage.setItem('worknamaUser',JSON.stringify(userData));
    window.location.href="./dashboard/dashboard.html";
  } else alert('Invalid email/password');
}

// ----- Forgot Password -----
function initForgotPassword(){
  const forgotLink=el("forgotPasswordLink"),
        forgotOverlay=el("forgotOverlay"),
        closeForgotModal=el("closeForgotModal"),
        forgotForm=el("forgotForm"),
        sendForgotOtp=el("sendForgotOtp"),
        forgotOtpRow=el("forgotOtpRow"),
        forgotOtp=el("forgotOtp"),
        verifyForgotOtp=el("verifyForgotOtp"),
        forgotOtpInfo=el("forgotOtpInfo"),
        forgotNewPassRow=el("forgotNewPassRow"),
        forgotEmailInput=el("forgotEmail");
  let forgotOtpSent=null, forgotEmailVerified=false;

  forgotLink.addEventListener("click",e=>{e.preventDefault(); forgotOverlay.classList.remove("hidden");});
  closeForgotModal.addEventListener("click",()=>{forgotOverlay.classList.add("hidden"); resetForgotForm();});
  function resetForgotForm(){ forgotForm.reset(); forgotOtpRow.classList.add("hidden"); forgotNewPassRow.classList.add("hidden"); forgotOtpInfo.textContent=""; forgotOtpSent=null; forgotEmailVerified=false;}

  sendForgotOtp.addEventListener("click",()=>{
    const email=forgotEmailInput.value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){alert("Valid email"); return;}
    const orgs=JSON.parse(localStorage.getItem("orgs")||"[]");
    const user=orgs.find(o=>o.credentials.email===email);
    if(!user){alert("No account found"); return;}
    forgotOtpSent=Math.floor(100000+Math.random()*900000).toString();
    forgotOtpRow.classList.remove("hidden"); forgotOtpInfo.textContent=`Demo OTP: ${forgotOtpSent}`; forgotEmailVerified=false;
  });

  verifyForgotOtp.addEventListener("click",()=>{
    if(!forgotOtpSent){alert("Send OTP first"); return;}
    if(forgotOtp.value.trim()===forgotOtpSent){forgotEmailVerified=true; forgotOtpInfo.textContent="Email verified ✅"; forgotOtpRow.classList.add("hidden"); forgotNewPassRow.classList.remove("hidden");} else forgotOtpInfo.textContent="Wrong OTP";
  });

  forgotForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!forgotEmailVerified){alert("Verify email"); return;}
    const email=forgotEmailInput.value.trim(), newPass=el("forgotNewPassword").value, confirmPass=el("forgotConfirmPassword").value;
    if(newPass.length<6){alert("Password >=6"); return;}
    if(newPass!==confirmPass){alert("Passwords do not match"); return;}
    const orgs=JSON.parse(localStorage.getItem("orgs")||"[]");
    const user=orgs.find(o=>o.credentials.email===email);
    if(user){user.credentials.password=newPass; localStorage.setItem("orgs",JSON.stringify(orgs)); alert("Password updated"); forgotOverlay.classList.add("hidden"); resetForgotForm();}
  });
}

// ----- DOMContentLoaded -----
window.addEventListener('DOMContentLoaded',init);
