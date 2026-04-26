// ============================================================
// DATA
// ============================================================
let PATIENTS = [
  { id: 0, name: "Ramesh Kumar",  dob: "1978-03-12", gender: "Male",   contact: "9876543210", bloodGroup: "O+", allergies: "Penicillin",  conditions: "Hypertension",   medications: "Amlodipine 5mg",  emergency: "Sunita Kumar — 9876543211" },
  { id: 1, name: "Lakshmi Devi", dob: "1990-07-25", gender: "Female", contact: "9123456780", bloodGroup: "B+", allergies: "None",         conditions: "Diabetes Type 2", medications: "Metformin 500mg", emergency: "Ravi Devi — 9123456781" },
  { id: 2, name: "Arun Sharma",  dob: "1965-11-08", gender: "Male",   contact: "9988776655", bloodGroup: "A-", allergies: "Sulfa drugs",  conditions: "None",           medications: "None",            emergency: "Meena Sharma — 9988776656" }
];

const DOCTORS = [
  { id: 1, name: "Dr. Priya Nair",  specialty: "General Medicine", available: true  },
  { id: 2, name: "Dr. Arjun Mehta", specialty: "Cardiology",       available: false },
  { id: 3, name: "Dr. Sunita Rao",  specialty: "Pediatrics",       available: true  },
  { id: 4, name: "Dr. Vikram Iyer", specialty: "Orthopedics",      available: true  }
];

let APPOINTMENTS = [
  { id: 1, patientId: 0, patientName: "Ramesh Kumar", doctorId: 1, doctorName: "Dr. Priya Nair",  date: "2026-04-26", time: "09:00", type: "Follow-up",    status: "scheduled", notes: "BP check" },
  { id: 2, patientId: 1, patientName: "Lakshmi Devi", doctorId: 1, doctorName: "Dr. Priya Nair",  date: "2026-04-26", time: "10:30", type: "Consultation", status: "scheduled", notes: "Sugar levels review" },
  { id: 3, patientId: 2, patientName: "Arun Sharma",  doctorId: 4, doctorName: "Dr. Vikram Iyer", date: "2026-04-27", time: "14:00", type: "New Patient",  status: "scheduled", notes: "Knee pain assessment" },
  { id: 4, patientId: 0, patientName: "Ramesh Kumar", doctorId: 2, doctorName: "Dr. Arjun Mehta", date: "2026-04-22", time: "11:00", type: "Follow-up",    status: "cancelled", notes: "" },
  { id: 5, patientId: 1, patientName: "Lakshmi Devi", doctorId: 3, doctorName: "Dr. Sunita Rao",  date: "2026-04-25", time: "16:00", type: "Consultation", status: "completed", notes: "HbA1c results" }
];

let VISITS = [
  { id: 1, patientId: 0, date: "2026-03-15", doctor: "Dr. Priya Nair",  diagnosis: "Hypertension — controlled", notes: "Patient BP was 140/90. Adjusted Amlodipine dosage. Advised low-salt diet and daily walks." },
  { id: 2, patientId: 1, date: "2026-04-01", doctor: "Dr. Sunita Rao",  diagnosis: "T2 Diabetes — monitoring",  notes: "HbA1c at 7.2%. Continue Metformin. Advised dietary changes and moderate exercise." },
  { id: 3, patientId: 2, date: "2026-04-10", doctor: "Dr. Vikram Iyer", diagnosis: "Osteoarthritis — mild",     notes: "X-ray shows mild wear in right knee. Physiotherapy recommended. Prescribed anti-inflammatories." }
];

// ============================================================
// AUTH
// ============================================================
const ACCOUNTS = {
  "nurse@evodoc.com":  { password: "nurse123",  role: "nurse",  name: "Reception Desk",  initials: "RN" },
  "doctor@evodoc.com": { password: "doctor123", role: "doctor", name: "Dr. Priya Nair",  initials: "PN" }
};

let currentUser = null;

function fillLogin(email, pw) {
  document.getElementById("login-email").value    = email;
  document.getElementById("login-password").value = pw;
}

function doLogin() {
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pw    = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");

  const account = ACCOUNTS[email];
  if (!account || account.password !== pw) {
    errEl.textContent = "Invalid email or password. Try the demo accounts below.";
    errEl.style.display = "block";
    return;
  }

  errEl.style.display = "none";
  currentUser = { ...account, email };

  // Setup topbar
  document.getElementById("topbar-avatar").textContent = account.initials;
  document.getElementById("topbar-name").textContent   = account.name;
  document.getElementById("portal-label").textContent  = account.role === "nurse" ? "Nurse / Reception Portal" : "Doctor Portal";
  document.getElementById("sidebar-label").textContent = account.role === "nurse" ? "Reception" : "Doctor";

  // Show correct nav
  document.getElementById("nurse-nav").style.display  = account.role === "nurse"  ? "" : "none";
  document.getElementById("doctor-nav").style.display = account.role === "doctor" ? "" : "none";

  // Show app, hide login
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "flex";

  // Navigate to first page
  if (account.role === "nurse") {
    setPage("intake");
  } else {
    renderDashboard();
    setPage("dashboard");
  }
}

function doLogout() {
  currentUser = null;
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("login-email").value    = "";
  document.getElementById("login-password").value = "";
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
let currentPage = "";

function setPage(page) {
  currentPage = page;

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const pageMap = {
    intake:             "page-intake",
    appointment:        "page-appointment",
    list:               "page-list",
    dashboard:          "page-dashboard",
    "doc-appointments": "page-doc-appointments",
    "patient-details":  "page-patient-details"
  };
  const titleMap = {
    intake:             "Patient Intake Form",
    appointment:        "Book Appointment",
    list:               "All Appointments",
    dashboard:          "Dashboard",
    "doc-appointments": "Appointments",
    "patient-details":  "Patient Details"
  };

  const el = document.getElementById(pageMap[page]);
  if (el) el.classList.add("active");
  document.getElementById("page-title").textContent = titleMap[page] || "";

  // Highlight sidebar
  document.querySelectorAll(".nav-item").forEach(n => {
    if ((n.getAttribute("onclick") || "").includes(`'${page}'`)) n.classList.add("active");
  });

  // Page init
  if (page === "list")             renderList();
  if (page === "doc-appointments") renderDocAppts();
  if (page === "patient-details")  { refreshPatientSelector(); loadPatient(); }
  if (page === "dashboard")        renderDashboard();
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerHTML = `<span class="toast-check">&#10003;</span> ${msg}`;
  t.style.display = "flex";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = "none"; }, 3200);
}

// ============================================================
// MODAL
// ============================================================
function openModal(html) {
  const o = document.getElementById("modal-overlay");
  o.innerHTML = html;
  o.style.display = "flex";
}
function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

// ============================================================
// NURSE: PATIENT INTAKE
// ============================================================
function submitIntakeForm() {
  const firstName        = v("firstName");
  const lastName         = v("lastName");
  const dob              = v("dob");
  const gender           = v("gender");
  const contact          = v("contact");
  const emergencyName    = v("emergencyName");
  const emergencyContact = v("emergencyContact");
  const bloodGroup       = v("bloodGroup");
  const allergies        = v("allergies");
  const conditions       = v("conditions");
  const medications      = v("medications");

  let valid = true;
  function setErr(id, msg) {
    const e = document.getElementById("err-" + id);
    const i = document.getElementById(id);
    if (e) e.textContent = msg;
    if (i) i.classList.toggle("error-field", !!msg);
    if (msg) valid = false;
  }

  setErr("firstName", firstName ? "" : "Required");
  setErr("lastName",  lastName  ? "" : "Required");
  setErr("dob",       dob       ? "" : "Required");
  setErr("gender",    gender    ? "" : "Required");
  setErr("contact",   /^\d{10}$/.test(contact) ? "" : "Valid 10-digit number required");
  setErr("emergencyContact", (!emergencyContact || /^\d{10}$/.test(emergencyContact)) ? "" : "Valid 10-digit number required");

  if (!valid) return;

  const newId = PATIENTS.reduce((m, p) => Math.max(m, p.id), -1) + 1;
  PATIENTS.push({
    id: newId, name: firstName + " " + lastName,
    dob, gender, contact,
    bloodGroup:  bloodGroup  || "Unknown",
    allergies:   allergies   || "None",
    conditions:  conditions  || "None",
    medications: medications || "None",
    emergency:   emergencyName ? `${emergencyName} — ${emergencyContact}` : (emergencyContact || "Not provided")
  });

  ["firstName","lastName","dob","gender","contact","emergencyName","emergencyContact",
   "bloodGroup","allergies","conditions","medications"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.getElementById("intake-success").textContent =
    `✓ ${firstName} ${lastName} registered successfully (ID: P${String(newId).padStart(3,"0")})`;
  showToast(`${firstName} ${lastName} registered!`);
  setTimeout(() => { document.getElementById("intake-success").textContent = ""; }, 5000);
}

function saveDraft() { showToast("Draft saved."); }

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// ============================================================
// NURSE: BOOK APPOINTMENT
// ============================================================
let selectedApptPatient = null;
let editingApptId = null;

function searchPatients() {
  const q = document.getElementById("appt-patient-search").value.trim().toLowerCase();
  const resultsEl = document.getElementById("patient-results");
  if (q.length < 1) { resultsEl.innerHTML = ""; return; }

  const matches = PATIENTS.filter(p => p.name.toLowerCase().includes(q));
  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="dropdown-item"><span style="color:#888780;">No patients found</span></div>`;
    return;
  }
  resultsEl.innerHTML = matches.map(p =>
    `<div class="dropdown-item" onclick="selectPatient(${p.id})">
      <span class="dropdown-item-name">${p.name}</span>
      <span class="dropdown-item-meta">DOB: ${p.dob}</span>
    </div>`
  ).join("");
}

function selectPatient(id) {
  selectedApptPatient = PATIENTS.find(p => p.id === id);
  document.getElementById("patient-search-block").style.display = "none";
  document.getElementById("selected-patient-block").style.display = "flex";
  document.getElementById("selected-patient-name").textContent = selectedApptPatient.name;
  document.getElementById("selected-patient-meta").textContent =
    `DOB: ${selectedApptPatient.dob} · ${selectedApptPatient.bloodGroup} · ${selectedApptPatient.conditions}`;
  document.getElementById("err-appt-patient").textContent = "";
  document.getElementById("patient-results").innerHTML = "";
}

function clearPatient() {
  selectedApptPatient = null;
  document.getElementById("patient-search-block").style.display = "";
  document.getElementById("selected-patient-block").style.display = "none";
  document.getElementById("appt-patient-search").value = "";
  document.getElementById("patient-results").innerHTML = "";
}

function checkDoctorAvail() {
  const sel   = document.getElementById("appt-doctor");
  const opt   = sel.options[sel.selectedIndex];
  const avail = opt && opt.dataset.avail;
  const msg   = document.getElementById("doctor-avail-msg");
  if (!avail) { msg.textContent = ""; return; }
  msg.textContent = avail === "true" ? "✓ Available today" : "⚠ Not available today";
  msg.className   = "avail-msg " + (avail === "true" ? "avail-available" : "avail-busy");
}

function confirmBooking() {
  const doctorSel = document.getElementById("appt-doctor");
  const doctor = doctorSel.value;
  const type   = v("appt-type") || document.getElementById("appt-type").value;
  const date   = document.getElementById("appt-date").value;
  const time   = document.getElementById("appt-time").value;
  const notes  = document.getElementById("appt-notes").value.trim();

  let valid = true;
  function setErr(id, msg) {
    const e = document.getElementById("err-appt-" + id);
    const i = document.getElementById("appt-" + id);
    if (e) e.textContent = msg;
    if (i) i.classList.toggle("error-field", !!msg);
    if (msg) valid = false;
  }
  if (!selectedApptPatient) {
    document.getElementById("err-appt-patient").textContent = "Select a patient";
    valid = false;
  } else {
    document.getElementById("err-appt-patient").textContent = "";
  }
  setErr("doctor", doctor ? "" : "Select a doctor");
  setErr("type",   document.getElementById("appt-type").value ? "" : "Select appointment type");
  setErr("date",   date   ? "" : "Select a date");
  setErr("time",   time   ? "" : "Select a time");
  if (!valid) return;

  const docName = doctorSel.options[doctorSel.selectedIndex].text.split(" — ")[0];

  if (editingApptId !== null) {
    const idx = APPOINTMENTS.findIndex(a => a.id === editingApptId);
    if (idx !== -1) {
      APPOINTMENTS[idx] = { ...APPOINTMENTS[idx], patientId: selectedApptPatient.id, patientName: selectedApptPatient.name, doctorId: +doctor, doctorName: docName, date, time, type: document.getElementById("appt-type").value, notes, status: "scheduled" };
    }
    editingApptId = null;
    const lbl = document.getElementById("booking-btn-label");
    if (lbl) lbl.textContent = "Confirm Booking";
    showToast("Appointment updated!");
  } else {
    APPOINTMENTS.push({
      id: APPOINTMENTS.reduce((m,a)=>Math.max(m,a.id),0)+1,
      patientId: selectedApptPatient.id, patientName: selectedApptPatient.name,
      doctorId: +doctor, doctorName: docName,
      date, time, type: document.getElementById("appt-type").value, notes, status: "scheduled"
    });
    showToast("Appointment booked successfully!");
  }

  document.getElementById("appt-confirm-box").style.display = "";
  document.getElementById("confirm-meta").textContent =
    `${selectedApptPatient.name} with ${docName} on ${date} at ${time}`;

  setTimeout(() => {
    document.getElementById("appt-confirm-box").style.display = "none";
    clearPatient();
    ["appt-doctor","appt-type","appt-date","appt-time"].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = "";
    });
    document.getElementById("appt-notes").value = "";
    document.getElementById("doctor-avail-msg").textContent = "";
  }, 3000);
}

// ============================================================
// NURSE: APPOINTMENTS LIST
// ============================================================
function renderList() {
  const search = document.getElementById("list-search").value.toLowerCase();
  const date   = document.getElementById("list-date").value;
  const doctor = document.getElementById("list-doctor").value;
  const status = document.getElementById("list-status").value;

  const filtered = APPOINTMENTS.filter(a => {
    if (date   && a.date       !== date)   return false;
    if (doctor && a.doctorName !== doctor) return false;
    if (status && a.status     !== status) return false;
    if (search && !a.patientName.toLowerCase().includes(search)) return false;
    return true;
  });

  const tbody = document.getElementById("list-tbody");
  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="7" style="text-align:center;color:#888780;padding:32px;">No appointments found</td></tr>`
    : filtered.map(a => `
        <tr>
          <td style="font-weight:500;">${a.patientName}</td>
          <td>${a.doctorName}</td>
          <td>${a.date}</td>
          <td>${a.time}</td>
          <td><span class="tag">${a.type}</span></td>
          <td><span class="badge badge-${a.status}">${a.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn btn-secondary btn-sm" onclick="viewAppointment(${a.id})">View</button>
              ${a.status==="scheduled"?`<button class="btn btn-secondary btn-sm" onclick="editAppointment(${a.id})">Edit</button>`:""}
              ${a.status==="scheduled"?`<button class="btn btn-danger btn-sm" onclick="cancelAppointment(${a.id})">Cancel</button>`:""}
            </div>
          </td>
        </tr>`).join("");

  document.getElementById("list-count").textContent =
    `${filtered.length} appointment${filtered.length !== 1 ? "s" : ""} shown`;
}

function viewAppointment(id) {
  const a = APPOINTMENTS.find(a => a.id === id);
  if (!a) return;
  openModal(`
    <div style="background:#fff;border-radius:14px;padding:32px;width:480px;max-width:95vw;font-family:'DM Sans',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="font-size:18px;font-weight:600;color:#2C2C2A;margin:0;">Appointment Details</h2>
        <button onclick="closeModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#888780;">&#215;</button>
      </div>
      <div style="display:grid;gap:14px;">
        ${[["Patient",a.patientName],["Doctor",a.doctorName],["Date",a.date],["Time",a.time],
           ["Type",a.type],["Status",`<span class="badge badge-${a.status}">${a.status}</span>`],
           ["Notes",a.notes||"<span style='color:#888780;'>None</span>"]
          ].map(([l,val])=>`
            <div style="display:flex;gap:12px;align-items:baseline;">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888780;min-width:72px;">${l}</span>
              <span style="font-size:14px;color:#2C2C2A;">${val}</span>
            </div>`).join("")}
      </div>
      <div style="margin-top:24px;text-align:right;">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>`);
}

function editAppointment(id) {
  const a = APPOINTMENTS.find(a => a.id === id);
  if (!a) return;
  editingApptId = id;
  selectedApptPatient = PATIENTS.find(p => p.id === a.patientId);
  setPage("appointment");
  setTimeout(() => {
    if (selectedApptPatient) {
      document.getElementById("patient-search-block").style.display = "none";
      document.getElementById("selected-patient-block").style.display = "flex";
      document.getElementById("selected-patient-name").textContent = selectedApptPatient.name;
      document.getElementById("selected-patient-meta").textContent =
        `DOB: ${selectedApptPatient.dob} · ${selectedApptPatient.bloodGroup} · ${selectedApptPatient.conditions}`;
    }
    document.getElementById("appt-doctor").value = a.doctorId;
    document.getElementById("appt-type").value   = a.type;
    document.getElementById("appt-date").value   = a.date;
    document.getElementById("appt-time").value   = a.time;
    document.getElementById("appt-notes").value  = a.notes || "";
    const lbl = document.getElementById("booking-btn-label");
    if (lbl) lbl.textContent = "Update Appointment";
    checkDoctorAvail();
  }, 60);
  showToast("Editing appointment — update and confirm.");
}

function cancelAppointment(id) {
  const a = APPOINTMENTS.find(a => a.id === id);
  if (!a) return;
  openModal(`
    <div style="background:#fff;border-radius:14px;padding:32px;width:420px;max-width:95vw;font-family:'DM Sans',sans-serif;">
      <h2 style="font-size:18px;font-weight:600;margin:0 0 12px;">Cancel Appointment?</h2>
      <p style="font-size:14px;color:#555;margin:0 0 6px;">
        Cancel appointment for <strong>${a.patientName}</strong> with <strong>${a.doctorName}</strong>.
      </p>
      <p style="font-size:13px;color:#888780;margin:0 0 24px;">${a.date} at ${a.time} &middot; ${a.type}</p>
      <div style="display:flex;gap:12px;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="closeModal()">Keep It</button>
        <button class="btn btn-danger" onclick="confirmCancel(${id})">Yes, Cancel</button>
      </div>
    </div>`);
}

function confirmCancel(id) {
  const idx = APPOINTMENTS.findIndex(a => a.id === id);
  if (idx !== -1) APPOINTMENTS[idx].status = "cancelled";
  closeModal();
  renderList();
  showToast("Appointment cancelled.");
}

function clearListFilters() {
  ["list-search","list-date","list-doctor","list-status"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  renderList();
}

// ============================================================
// DOCTOR: DASHBOARD
// ============================================================
function renderDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts  = APPOINTMENTS.filter(a => a.date === today);
  const weekAppts   = APPOINTMENTS.filter(a => a.date >= today);
  const scheduled   = todayAppts.filter(a => a.status === "scheduled");

  // Date string
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  // Header
  document.getElementById("dash-header").innerHTML = `
    <div class="avatar avatar-lg" style="background:#E1F5EE;color:#085041;">PN</div>
    <div>
      <p class="doc-greeting">Good morning, Dr. Priya Nair</p>
      <p class="doc-subtitle">General Medicine &nbsp;&middot;&nbsp; ${dateStr}</p>
    </div>`;

  // Metrics
  document.getElementById("dash-metrics").innerHTML = [
    { label: "Today's Appointments", value: todayAppts.length, color: "#185FA5" },
    { label: "Scheduled Today",      value: scheduled.length,  color: "#0F6E56" },
    { label: "Upcoming This Week",   value: weekAppts.length,  color: "#BA7517" },
    { label: "Total Patients",       value: PATIENTS.length,   color: "#3B6D11" }
  ].map(m => `
    <div class="metric-card" style="border-top-color:${m.color};">
      <p class="metric-value" style="color:${m.color};">${m.value}</p>
      <p class="metric-label">${m.label}</p>
    </div>`).join("");

  // Today's schedule
  const schedEl = document.getElementById("dash-schedule");
  if (todayAppts.length === 0) {
    schedEl.innerHTML = `<p style="color:#888780;font-size:14px;">No appointments scheduled for today.</p>`;
  } else {
    schedEl.innerHTML = todayAppts.map(a => `
      <div class="schedule-item">
        <div class="time-badge">${a.time}<span>${a.date}</span></div>
        <div class="schedule-info">
          <p class="schedule-name">${a.patientName}</p>
          <p class="schedule-type">${a.type}${a.notes ? " · " + a.notes : ""}</p>
        </div>
        <span class="badge badge-${a.status}">${a.status}</span>
      </div>`).join("");
  }

  // Recent activity
  const recentVisits = [...VISITS].sort((a,b) => b.date.localeCompare(a.date)).slice(0,3);
  document.getElementById("dash-activity").innerHTML = recentVisits.length === 0
    ? `<p style="color:#888780;font-size:14px;">No recent activity.</p>`
    : recentVisits.map(v => {
        const p = PATIENTS.find(pt => pt.id === v.patientId);
        return `<div class="notif notif-info" style="cursor:pointer;" onclick="goToPatient(${v.patientId})">
          <p class="notif-msg">${p ? p.name : "Patient"}</p>
          <p class="notif-time">${v.date} &middot; ${v.doctor} &middot; ${v.diagnosis || "Visit note"}</p>
        </div>`;
      }).join("");
}

function goToPatient(patientId) {
  currentPatientId = patientId;
  setPage("patient-details");
}

// ============================================================
// DOCTOR: APPOINTMENTS
// ============================================================
let docApptFilter = "upcoming";

function setApptFilter(filter, btn) {
  docApptFilter = filter;
  document.querySelectorAll("#page-doc-appointments .tab-btn").forEach(b =>
    b.classList.toggle("active", b === btn)
  );
  renderDocAppts();
}

function renderDocAppts() {
  const search   = (document.getElementById("doc-appt-search")?.value || "").toLowerCase();
  const dateFilter = document.getElementById("doc-appt-date")?.value || "";

  const filtered = APPOINTMENTS.filter(a => {
    if (docApptFilter === "upcoming" && (a.status === "completed" || a.status === "cancelled")) return false;
    if (docApptFilter === "past"     && a.status === "scheduled") return false;
    if (search     && !a.patientName.toLowerCase().includes(search)) return false;
    if (dateFilter && a.date !== dateFilter) return false;
    return true;
  });

  const container = document.getElementById("doc-appt-list");
  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:#888780;padding:20px 0;">No appointments found.</p>`;
    return;
  }

  container.innerHTML = filtered.map(a => `
    <div class="appt-card">
      <div class="appt-time-block">
        <div class="appt-time">${a.time}</div>
        <div class="appt-date-small">${a.date}</div>
      </div>
      <div class="appt-info">
        <div class="appt-patient">${a.patientName}</div>
        <div class="appt-meta">${a.doctorName} &middot; ${a.type}${a.notes ? " · " + a.notes : ""}</div>
      </div>
      <span class="badge badge-${a.status}">${a.status}</span>
      <button class="btn btn-secondary" style="font-size:13px;flex-shrink:0;" onclick="goToPatient(${a.patientId})">View Patient &rarr;</button>
    </div>`).join("");
}

// ============================================================
// DOCTOR: PATIENT DETAILS
// ============================================================
let currentPatientId = 0;

function refreshPatientSelector() {
  const sel = document.getElementById("patient-select");
  if (!sel) return;
  sel.innerHTML = PATIENTS.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
  sel.value = currentPatientId;
}

function loadPatient() {
  currentPatientId = +document.getElementById("patient-select").value;
  const p = PATIENTS.find(pt => pt.id === currentPatientId);
  if (!p) return;

  const age      = new Date().getFullYear() - new Date(p.dob).getFullYear();
  const initials = p.name.split(" ").map(w => w[0]).join("");

  // Header card
  document.getElementById("patient-header").innerHTML = `
    <div class="avatar avatar-lg" style="background:#FAEEDA;color:#BA7517;">${initials}</div>
    <div style="flex:1;">
      <p class="patient-name-lg">${p.name}</p>
      <p class="patient-sub">${age} years &middot; ${p.gender} &middot; ${p.contact}</p>
    </div>
    <div class="patient-badges">
      <div class="patient-badge-item">
        <div class="patient-badge-label">Blood Group</div>
        <div class="patient-badge-value">${p.bloodGroup}</div>
      </div>
      <div class="patient-badge-item">
        <div class="patient-badge-label">Allergies</div>
        <div class="patient-badge-value ${p.allergies !== "None" ? "allergy-alert" : ""}">${p.allergies}</div>
      </div>
    </div>`;

  // Reset to Overview tab
  document.querySelectorAll(".tab-bar .tab-btn").forEach((b,i) => b.classList.toggle("active", i === 0));
  document.querySelectorAll(".patient-tab").forEach((t,i) => t.classList.toggle("active", i === 0));

  renderOverview(p);
  renderHistory(p);
  renderNotesList(p);
  prefillUpdateForm(p);
}

function renderOverview(p) {
  const visits = VISITS.filter(v => v.patientId === p.id);
  const last   = visits[visits.length - 1];

  // Next appointment
  const today = new Date().toISOString().split("T")[0];
  const nextAppt = APPOINTMENTS.find(a => a.patientId === p.id && a.status === "scheduled" && a.date >= today);

  document.getElementById("tab-overview").innerHTML = `
    <div class="overview-grid">
      <div class="card">
        <p class="card-heading">Medical Summary</p>
        <div class="info-item">
          <div class="info-label">Chronic Conditions</div>
          <div class="info-value">${p.conditions || "None recorded"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Current Medications</div>
          <div class="info-value">${p.medications || "None"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Emergency Contact</div>
          <div class="info-value">${p.emergency}</div>
        </div>
        ${nextAppt ? `
        <div class="info-item" style="margin-top:16px;padding-top:16px;border-top:1px solid #F1EFE8;">
          <div class="info-label">Next Appointment</div>
          <div class="info-value" style="color:#0F6E56;font-weight:500;">${nextAppt.date} at ${nextAppt.time} &middot; ${nextAppt.type}</div>
        </div>` : ""}
      </div>
      <div class="card">
        <p class="card-heading">Last Visit</p>
        ${last ? `
          <p style="font-size:13px;color:#888780;">${last.date} &middot; ${last.doctor}</p>
          <p style="font-size:14px;line-height:1.6;margin-top:8px;">${last.notes}</p>
          ${last.diagnosis ? `<p style="margin-top:10px;"><span class="tag">${last.diagnosis}</span></p>` : ""}
        ` : `<p style="color:#888780;font-size:14px;">No visits recorded yet.</p>`}
      </div>
    </div>`;
}

function renderHistory(p) {
  const visits    = VISITS.filter(v => v.patientId === p.id).slice().reverse();
  const historyEl = document.getElementById("tab-history");

  historyEl.innerHTML = visits.length === 0
    ? `<div class="card"><p style="color:#888780;">No visit history found.</p></div>`
    : `<div class="card">${visits.map(v => `
        <div class="visit-entry">
          <div class="visit-header">
            <div>
              <div class="visit-date">${v.date}</div>
              <div class="visit-doctor">${v.doctor}</div>
            </div>
            ${v.diagnosis ? `<span class="tag">${v.diagnosis}</span>` : ""}
          </div>
          <p class="visit-notes">${v.notes}</p>
        </div>`).join("")}
      </div>`;
}

function renderNotesList(p) {
  const all = VISITS.filter(v => v.patientId === p.id).slice().reverse();
  const el  = document.getElementById("notes-list");

  el.innerHTML = `<p class="card-heading">Previous Notes</p>` + (
    all.length === 0
      ? `<p style="color:#888780;font-size:14px;">No notes yet for this patient.</p>`
      : all.map(v => `
          <div class="notes-entry">
            <div class="notes-meta">${v.date} &middot; ${v.doctor}${v.diagnosis ? " &middot; " + v.diagnosis : ""}</div>
            <div class="notes-text">${v.notes}</div>
          </div>`).join("")
  );

  // Set today's date as default in note-date field
  const noteDateEl = document.getElementById("note-date");
  if (noteDateEl && !noteDateEl.value) {
    noteDateEl.value = new Date().toISOString().split("T")[0];
  }
}

function addNote() {
  const noteText  = document.getElementById("new-note").value.trim();
  const diagnosis = document.getElementById("note-diagnosis").value.trim();
  const noteDate  = document.getElementById("note-date").value || new Date().toISOString().split("T")[0];

  if (!noteText) {
    document.getElementById("new-note").style.borderColor = "#E24B4A";
    showToast("Please enter note content.");
    return;
  }
  document.getElementById("new-note").style.borderColor = "";

  VISITS.push({
    id:        Date.now(),
    patientId: currentPatientId,
    date:      noteDate,
    doctor:    currentUser ? currentUser.name : "Dr. Priya Nair",
    diagnosis: diagnosis,
    notes:     noteText
  });

  document.getElementById("new-note").value       = "";
  document.getElementById("note-diagnosis").value = "";

  const p = PATIENTS.find(pt => pt.id === currentPatientId);
  renderNotesList(p);
  renderOverview(p);
  renderHistory(p);
  showToast("Clinical note saved.");
}

// ============================================================
// DOCTOR: UPDATE PATIENT RECORD
// ============================================================
function prefillUpdateForm(p) {
  const fields = {
    "upd-bloodGroup":  p.bloodGroup  !== "Unknown" ? p.bloodGroup : "",
    "upd-allergies":   p.allergies   !== "None"    ? p.allergies  : "",
    "upd-conditions":  p.conditions  !== "None"    ? p.conditions : "",
    "upd-medications": p.medications !== "None"    ? p.medications: "",
    "upd-emergency":   p.emergency   !== "Not provided" ? p.emergency : ""
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
  const s = document.getElementById("update-success");
  if (s) s.textContent = "";
}

function updatePatientRecord() {
  const idx = PATIENTS.findIndex(pt => pt.id === currentPatientId);
  if (idx === -1) return;

  const bg   = document.getElementById("upd-bloodGroup").value;
  const al   = document.getElementById("upd-allergies").value.trim();
  const cond = document.getElementById("upd-conditions").value.trim();
  const meds = document.getElementById("upd-medications").value.trim();
  const emrg = document.getElementById("upd-emergency").value.trim();

  if (bg)   PATIENTS[idx].bloodGroup  = bg;
  if (al)   PATIENTS[idx].allergies   = al;
  if (cond) PATIENTS[idx].conditions  = cond;
  if (meds) PATIENTS[idx].medications = meds;
  if (emrg) PATIENTS[idx].emergency   = emrg;

  const s = document.getElementById("update-success");
  if (s) s.textContent = "✓ Patient record updated successfully.";
  showToast("Record updated!");

  // Refresh header and overview to reflect changes
  const p = PATIENTS[idx];
  const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
  const initials = p.name.split(" ").map(w => w[0]).join("");
  document.getElementById("patient-header").innerHTML = `
    <div class="avatar avatar-lg" style="background:#FAEEDA;color:#BA7517;">${initials}</div>
    <div style="flex:1;">
      <p class="patient-name-lg">${p.name}</p>
      <p class="patient-sub">${age} years &middot; ${p.gender} &middot; ${p.contact}</p>
    </div>
    <div class="patient-badges">
      <div class="patient-badge-item">
        <div class="patient-badge-label">Blood Group</div>
        <div class="patient-badge-value">${p.bloodGroup}</div>
      </div>
      <div class="patient-badge-item">
        <div class="patient-badge-label">Allergies</div>
        <div class="patient-badge-value ${p.allergies !== "None" ? "allergy-alert" : ""}">${p.allergies}</div>
      </div>
    </div>`;
  renderOverview(p);

  setTimeout(() => { if (s) s.textContent = ""; }, 4000);
}

function resetUpdateForm() {
  const p = PATIENTS.find(pt => pt.id === currentPatientId);
  if (p) prefillUpdateForm(p);
  const s = document.getElementById("update-success");
  if (s) s.textContent = "";
}

function setPatientTab(tab, btn) {
  document.querySelectorAll(".tab-bar .tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".patient-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  // Re-render notes tab to set today's date
  if (tab === "notes") {
    const noteDateEl = document.getElementById("note-date");
    if (noteDateEl && !noteDateEl.value) {
      noteDateEl.value = new Date().toISOString().split("T")[0];
    }
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Show login screen on load — nothing else
});