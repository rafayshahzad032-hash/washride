const state = {
  selectedPackage: null,
  selectedAddons: new Set(),
  selectedDate: null,
  selectedTime: null,
  address: '',
  bookingId: ''
};

const packages = [
  { id: 'basic', name: 'Basic Wash', price: 10, desc: 'Exterior foam wash and microfiber body dry.' },
  { id: 'standard', name: 'Standard Wash', price: 18, desc: 'Exterior wash, interior vacuuming and dust wipe.', popular: true },
  { id: 'premium', name: 'Premium Wash', price: 28, desc: 'Full interior/exterior detailing and protective wax coating.' }
];

const addons = [
  { id: 'tire', icon: '🛞', name: 'Tire Shine', price: 5 },
  { id: 'fragrance', icon: '🌸', name: 'Interior Fragrance', price: 3 },
  { id: 'engine', icon: '⚙️', name: 'Engine Clean', price: 7 }
];

function getTotal() {
  const pkg = packages.find(p => p.id === state.selectedPackage);
  const base = pkg ? pkg.price : 0;
  const extra = [...state.selectedAddons].reduce((s, id) => s + (addons.find(a => a.id === id)?.price || 0), 0);
  return base + extra;
}

function genBookingId() {
  return 'WR-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-4);
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ── SPLASH ──
function renderSplash() {
  return `
  <div id="splash" class="screen">
    <div class="splash-logo">🚗</div>
    <div class="splash-brand">WashRide</div>
    <div class="splash-tag">CLEAN CAR • HAPPY RIDE</div>
    <div class="splash-bar"><div class="splash-bar-fill"></div></div>
  </div>`;
}

// ── ONBOARDING ──
const slides = [
  { icon: '🏠', title: 'Doorstep Convenience', desc: 'Professional car wash delivered right to your door. No queues, no hassle.' },
  { icon: '📦', title: 'Flexible Packages', desc: 'Choose from Basic, Standard or Premium — tailored to your car\'s needs.' },
  { icon: '⚡', title: 'Fast Scheduling', desc: 'Pick a date and time that works for you. We\'ll be there on time, every time.' }
];

let obIndex = 0;

function renderOnboarding() {
  return `
  <div id="onboarding" class="screen">
    <div class="ob-slides">
      ${slides.map((s, i) => `
      <div class="ob-slide ${i === 0 ? 'active' : ''}" id="ob-slide-${i}">
        <div class="ob-icon">${s.icon}</div>
        <div class="ob-title">${s.title}</div>
        <div class="ob-desc">${s.desc}</div>
      </div>`).join('')}
    </div>
    <div class="ob-dots">
      ${slides.map((_, i) => `<div class="ob-dot ${i === 0 ? 'active' : ''}" id="ob-dot-${i}"></div>`).join('')}
    </div>
    <div class="ob-footer">
      <button class="btn btn-primary" id="ob-next-btn">Next</button>
      <button class="btn btn-outline" onclick="showScreen('login')">Skip</button>
    </div>
  </div>`;
}

function obNext() {
  obIndex++;
  if (obIndex >= slides.length) { showScreen('login'); obIndex = 0; return; }
  slides.forEach((_, i) => {
    document.getElementById(`ob-slide-${i}`).classList.toggle('active', i === obIndex);
    document.getElementById(`ob-dot-${i}`).classList.toggle('active', i === obIndex);
  });
  document.getElementById('ob-next-btn').textContent = obIndex === slides.length - 1 ? 'Get Started' : 'Next';
}

// ── LOGIN ──
function renderLogin() {
  return `
  <div id="login" class="screen auth-screen">
    <div class="auth-header">
      <h1>Welcome Back 👋</h1>
      <p>Sign in to book your next wash</p>
    </div>
    <div class="auth-body">
      <div class="field-group">
        <label>Email or Phone</label>
        <div class="field-wrap">
          <input type="text" placeholder="you@example.com" id="login-email" />
        </div>
      </div>
      <div class="field-group">
        <label>Password</label>
        <div class="field-wrap">
          <input type="password" placeholder="••••••••" id="login-pass" />
          <span class="eye" onclick="togglePass('login-pass',this)">👁️</span>
        </div>
      </div>
      <div class="auth-row">
        <label class="check-label"><input type="checkbox" /> Remember Me</label>
        <button class="link">Forgot Password?</button>
      </div>
      <button class="btn btn-primary" onclick="doLogin()">Sign In</button>
      <div class="auth-alt">Don't have an account? <button class="link" onclick="showScreen('login')">Sign Up</button></div>
    </div>
  </div>`;
}

function togglePass(id, el) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  el.textContent = inp.type === 'password' ? '👁️' : '🙈';
}

function doLogin() {
  const e = document.getElementById('login-email').value.trim();
  if (!e) { showToast('Please enter your email or phone'); return; }
  showScreen('home');
}

// ── HOME ──
function renderHome() {
  return `
  <div id="home" class="screen">
    <div class="home-header">
      <div class="home-greeting">Good morning,</div>
      <div class="home-name">Alex Johnson 👋</div>
      <div class="offer-card">
        <div class="offer-text">
          <h3>First Wash Offer!</h3>
          <p>Use code WASHRIDE20</p>
        </div>
        <div class="offer-badge">20%<br>OFF</div>
      </div>
    </div>
    <div class="section-title">Categories</div>
    <div class="categories">
      ${[['🚗','Exterior'],['🧹','Interior'],['✨','Full Detail'],['🛞','Tires'],['⚙️','Engine']].map(([i,l]) =>
        `<div class="cat-chip"><span>${i}</span><span>${l}</span></div>`).join('')}
    </div>
    <div class="section-title">Popular Packages</div>
    <div class="packages-list">
      ${packages.map(p => `
      <div class="pkg-card ${p.popular ? 'popular' : ''}" onclick="quickBook('${p.id}')">
        <div class="pkg-info">
          <h4>${p.name}</h4>
          <p>${p.desc}</p>
        </div>
        <div class="pkg-right">
          <div class="pkg-price">$${p.price}</div>
          ${p.popular ? '<span class="badge badge-blue">⭐ Popular</span>' : ''}
        </div>
      </div>`).join('')}
    </div>
    <div class="bottom-nav">
      <div class="nav-item active"><span>🏠</span><span>Home</span></div>
      <div class="nav-item" onclick="showScreen('select-service')"><span>🚿</span><span>Book</span></div>
      <div class="nav-item"><span>📋</span><span>Orders</span></div>
      <div class="nav-item"><span>👤</span><span>Profile</span></div>
    </div>
  </div>`;
}

function quickBook(pkgId) {
  state.selectedPackage = pkgId;
  showScreen('select-service');
  renderSelectService();
}

// ── SELECT SERVICE ──
function renderSelectService() {
  const screen = document.getElementById('select-service');
  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" onclick="showScreen('home')">←</button>
      <h2>Select Service</h2>
    </div>
    <div class="service-packages">
      ${packages.map(p => `
      <div class="svc-card ${state.selectedPackage === p.id ? 'selected' : ''}" onclick="selectPkg('${p.id}')">
        <div class="svc-card-top">
          <div>
            <div class="svc-name">${p.name} ${p.popular ? '<span class="badge badge-blue">Popular</span>' : ''}</div>
            <div class="svc-desc">${p.desc}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
            <div class="svc-price">$${p.price}</div>
            <div class="svc-check">${state.selectedPackage === p.id ? '✓' : ''}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <div class="section-title" style="padding-top:8px">Optional Add-ons</div>
    <div class="addons-section">
      ${addons.map(a => `
      <div class="addon-item ${state.selectedAddons.has(a.id) ? 'selected' : ''}" onclick="toggleAddon('${a.id}')">
        <div class="addon-left">
          <span class="addon-icon">${a.icon}</span>
          <span class="addon-name">${a.name}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="addon-price">+$${a.price}</span>
          <div class="addon-toggle">${state.selectedAddons.has(a.id) ? '✓' : '+'}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="sticky-footer">
      <div class="sticky-footer-row">
        <span class="total-label">Total</span>
        <span class="total-amount">$${getTotal()}</span>
      </div>
      <button class="btn btn-primary" onclick="goToLocation()">Continue</button>
    </div>`;
}

function selectPkg(id) {
  state.selectedPackage = id;
  renderSelectService();
}

function toggleAddon(id) {
  state.selectedAddons.has(id) ? state.selectedAddons.delete(id) : state.selectedAddons.add(id);
  renderSelectService();
}

function goToLocation() {
  if (!state.selectedPackage) { showToast('Please select a package'); return; }
  showScreen('location-time');
  renderLocationTime();
}

// ── LOCATION & TIME ──
const dates = (() => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { day: days[d.getDay()], num: d.getDate(), full: d.toDateString() };
  });
})();

const times = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];
const unavailable = new Set(['11:00 AM', '02:00 PM']);

function renderLocationTime() {
  const screen = document.getElementById('location-time');
  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" onclick="showScreen('select-service');renderSelectService()">←</button>
      <h2>Location & Time</h2>
    </div>
    <div class="lt-section">
      <h3>📍 Your Address</h3>
      <div class="address-input-wrap">
        <span class="pin">📍</span>
        <input type="text" placeholder="Enter your address" id="addr-input" value="${state.address}"
          oninput="state.address=this.value" />
      </div>
      <div class="map-preview">🗺️</div>
    </div>
    <div class="lt-section" style="margin-top:20px">
      <h3>📅 Select Date</h3>
      <div class="date-scroll">
        ${dates.map(d => `
        <div class="date-chip ${state.selectedDate === d.full ? 'selected' : ''}" onclick="selectDate('${d.full}',this)">
          <span class="day">${d.day}</span>
          <span class="num">${d.num}</span>
        </div>`).join('')}
      </div>
    </div>
    <div class="lt-section" style="margin-top:20px;padding-bottom:20px">
      <h3>🕐 Select Time</h3>
      <div class="time-grid">
        ${times.map(t => `
        <div class="time-chip ${unavailable.has(t) ? 'unavailable' : ''} ${state.selectedTime === t ? 'selected' : ''}"
          onclick="${unavailable.has(t) ? '' : `selectTime('${t}')`}">${t}</div>`).join('')}
      </div>
    </div>
    <div class="sticky-footer">
      <button class="btn btn-primary" onclick="goToSummary()">Review Booking</button>
    </div>`;
}

function selectDate(full) {
  state.selectedDate = full;
  renderLocationTime();
}

function selectTime(t) {
  state.selectedTime = t;
  renderLocationTime();
}

function goToSummary() {
  if (!state.address.trim()) { showToast('Please enter your address'); return; }
  if (!state.selectedDate) { showToast('Please select a date'); return; }
  if (!state.selectedTime) { showToast('Please select a time slot'); return; }
  showScreen('booking-summary');
  renderSummary();
}

// ── BOOKING SUMMARY ──
function renderSummary() {
  const pkg = packages.find(p => p.id === state.selectedPackage);
  const addonList = [...state.selectedAddons].map(id => addons.find(a => a.id === id));
  const screen = document.getElementById('booking-summary');
  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" onclick="showScreen('location-time');renderLocationTime()">←</button>
      <h2>Booking Summary</h2>
    </div>
    <div class="summary-card">
      <div class="summary-row">
        <span class="summary-label">🚿 Service</span>
        <span class="summary-value">${pkg.name}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">📍 Address</span>
        <span class="summary-value">${state.address}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">📅 Date</span>
        <span class="summary-value">${state.selectedDate}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">🕐 Time</span>
        <span class="summary-value">${state.selectedTime}</span>
      </div>
      ${addonList.length ? `
      <div class="summary-row">
        <span class="summary-label">✨ Add-ons</span>
        <span class="summary-value">${addonList.map(a => a.name).join(', ')}</span>
      </div>` : ''}
      <div class="summary-row">
        <span class="summary-label">💰 Package Price</span>
        <span class="summary-value">$${pkg.price}</span>
      </div>
      ${addonList.map(a => `
      <div class="summary-row">
        <span class="summary-label">${a.icon} ${a.name}</span>
        <span class="summary-value">+$${a.price}</span>
      </div>`).join('')}
    </div>
    <div class="summary-total">
      <span>Total Amount</span>
      <span>$${getTotal()}</span>
    </div>
    <div style="padding:20px">
      <button class="btn btn-navy" onclick="confirmBooking()">Confirm Booking</button>
    </div>`;
}

// ── SUCCESS ──
function confirmBooking() {
  state.bookingId = genBookingId();
  showScreen('success');
  document.getElementById('bid').textContent = state.bookingId;
}

function copyId() {
  navigator.clipboard.writeText(state.bookingId).then(() => showToast('Booking ID copied!'));
}

function resetApp() {
  state.selectedPackage = null;
  state.selectedAddons.clear();
  state.selectedDate = null;
  state.selectedTime = null;
  state.address = '';
  state.bookingId = '';
  showScreen('home');
}

// ── RENDER ALL STATIC SCREENS ──
function init() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderSplash()}
    ${renderOnboarding()}
    ${renderLogin()}
    ${renderHome()}
    <div id="select-service" class="screen"></div>
    <div id="location-time" class="screen"></div>
    <div id="booking-summary" class="screen"></div>
    <div id="success" class="screen" style="align-items:center;justify-content:center;padding:40px 24px;text-align:center;">
      <div class="success-anim">✓</div>
      <div class="success-title">Booking Confirmed!</div>
      <div class="success-sub">Your car wash has been scheduled.<br>We'll see you soon!</div>
      <div class="booking-id-card">
        <div class="booking-id-label">Booking ID</div>
        <div class="booking-id-value" id="bid">—</div>
        <button class="copy-btn" onclick="copyId()">📋 Copy ID</button>
      </div>
      <div class="success-actions">
        <button class="btn btn-primary" onclick="showScreen('booking-summary')">View Details</button>
        <button class="btn btn-outline" onclick="resetApp()">Back to Home</button>
      </div>
    </div>
    <div class="toast" id="toast"></div>`;

  document.getElementById('ob-next-btn').addEventListener('click', obNext);
  showScreen('splash');
  setTimeout(() => showScreen('onboarding'), 2500);
}

init();
