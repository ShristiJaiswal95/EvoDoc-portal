// =====================
// DATA
// =====================
const PATIENTS = [
  {
    id: 0, name: "Ramesh Kumar", dob: "1978-03-12", gender: "Male",
    contact: "9876543210", bloodGroup: "O+", allergies: "Penicillin",
    conditions: "Hypertension", medications: "Amlodipine 5mg",
    emergency: "Sunita Kumar — 9876543211"
  },
  {
    id: 1, name: "Lakshmi Devi", dob: "1990-07-25", gender: "Female",
    contact: "9123456780", bloodGroup: "B+", allergies: "None",
    conditions: "Diabetes Type 2", medications: "Metformin 500mg",
    emergency: "Ravi Devi — 9123456781"
  },
  {
    id: 2, name: "Arun Sharma", dob: "1965-11-08", gender: "Male",
    contact: "9988776655", bloodGroup: "A-", allergies: "Sulfa drugs",
    conditions: "None", medications: "None",
    emergency: "Meena Sharma — 9988776656"
  }
];

const DOCTORS = [
  { id: 1, name: "Dr. Priya Nair",   specialty: "General Medicine", available: true  },
  { id: 2, name: "Dr. Arjun Mehta",  specialty: "Cardiology",       available: false },
  { id: 3, name: "Dr. Sunita Rao",   specialty: "Pediatrics",       available: true  },
  { id: 4, name: "Dr. Vikram Iyer",  specialty: "Orthopedics",      available: true  }
];

const APPOINTMENTS = [
  { id: 1, patientId: 0, patientName: "Ramesh Kumar",  doctorId: 1, doctorName: "Dr. Priya Nair",  date: "2026-04-23", time: "09:00", type: "Follow-up",    status: "scheduled", notes: "BP check" },
  { id: 2, patientId: 1, patientName: "Lakshmi Devi",  doctorId: 3, doctorName: "Dr. Sunita Rao",  date: "2026-04-23", time: "10:30", type: "Consultation", status: "completed", notes: "Sugar levels review" },
  { id: 3, patientId: 2, patientName: "Arun Sharma",   doctorId: 4, doctorName: "Dr. Vikram Iyer", date: "2026-04-24", time: "14:00", type: "New Patient",  status: "scheduled", notes: "Knee pain assessment" },
  { id: 4, patientId: 0, patientName: "Ramesh Kumar",  doctorId: 2, doctorName: "Dr. Arjun Mehta", date: "2026-04-22", time: "11:00", type: "Follow-up",    status: "cancelled", notes: "" },
  { id: 5, patientId: 1, patientName: "Lakshmi Devi",  doctorId: 1, doctorName: "Dr. Priya Nair",  date: "2026-04-25", time: "16:00", type: "Consultation", status: "scheduled", notes: "HbA1c results" }
];

const VISITS = [
  { id: 1, patientId: 0, date: "2026-03-15", doctor: "Dr. Priya Nair",  diagnosis: "Hypertension — controlled", notes: "Patient BP was 140/90. Adjusted Amlodipine dosage. Advised low-salt diet and daily walks." },
  { id: 2, patientId: 1, date: "2026-04-01", doctor: "Dr. Sunita Rao",  diagnosis: "T2 Diabetes — monitoring",  notes: "HbA1c at 7.2%. Continue Metformin. Advised dietary changes and moderate exercise." },
  { id: 3, patientId: 2, date: "2026-04-10", doctor: "Dr. Vikram Iyer", diagnosis: "Osteoarthritis — mild",     notes: "X-ray shows mild wear in right knee. Physiotherapy recommended. Prescribed anti-inflammatories." }
];

// extra notes added at runtime per patient
const EXTRA_NOTES = { 0: [], 1: [], 2: [] };

// =====================
// STATE
// =====================
let currentPortal  = "nurse";
let currentPage    = "intake";
let selectedApptPatient = null;
let docApptFilter  = "upcoming";
let currentPatientId = 0;

// =====================
// PORTAL SWITCH
// =====================
function switchPortal(portal) {
  currentPortal = portal;

  document.querySelectorAll(".switch-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.portal === portal)
  );

  document.getElementById("nurse-nav").style.display  = portal === "nurse"  ? "" : "none";
  document.getElementById("doctor-nav").style.display = portal === "doctor" ? "" : "none";

  document.getElementById("sidebar-label").textContent = portal === "nurse" ? "Reception" : "Doctor";
  document.getElementById("topbar-avatar").textContent = portal === "nurse" ? "RN" : "PN";
  document.getElementById("topbar-name").textContent   = portal === "nurse" ? "Reception Desk" : "Dr. Priya Nair";

  const firstPage = portal === "nurse" ? "intake" : "dashboard";
  setPage(firstPage);
}

// =====================
// PAGE NAVIGATION
// =====================
function setPage(page) {
  currentPage = page;

  // hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // deactivate all nav items
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  // page-id map
  const pageMap = {
    intake:           "page-intake",
    appointment:      "page-appointment",
    list:             "page-list",
    dashboard:        "page-dashboard",
    "doc-appointments": "page-doc-appointments",
    "patient-details":  "page-patient-details"
  };

  const titleMap = {
    intake:             "Patient Intake Form",
    appointment:        "Book Appointment",
    list:               "All Appointments",
    dashboard:          "Overview",
    "doc-appointments": "My Appointments",
    "patient-details":  "Patient Details"
  };

  const el = document.getElementById(pageMap[page]);
  if (el) el.classList.add("active");

  document.getElementById("page-title").textContent = titleMap[page] || page;

  // highlight correct nav item
  document.querySelectorAll(".nav-item").forEach(n => {
    const cb = n.getAttribute("onclick") || "";
    if (cb.includes(`'${page}'`)) n.classList.add("active");
  });

  // page-specific init
  if (page === "list")              renderList();
  if (page === "doc-appointments")  renderDocAppts();
  if (page === "patient-details")   loadPatient();
}

// =====================
// TOAST
// =====================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerHTML = `<span class="toast-check">✓</span> ${msg}`;
  t.style.display = "flex";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = "none"; }, 2800);
}

// =====================
// INTAKE FORM
// =====================
function submitIntakeForm() {
  const fields = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName:  document.getElementById("lastName").value.trim(),
    dob:       document.getElementById("dob").value,
    gender:    document.getElementById("gender").value,
    contact:   document.getElementById("contact").value.trim(),
    emergencyContact: document.getElementById("emergencyContact").value.trim()
  };

  let valid = true;

  function setErr(id, msg) {
    const el = document.getElementById("err-" + id);
    const input = document.getElementById(id);
    if (el) el.textContent = msg;
    if (input) input.classList.toggle("error-field", !!msg);
    if (msg) valid = false;
  }

  setErr("firstName", fields.firstName ? "" : "Required");
  setErr("lastName",  fields.lastName  ? "" : "Required");
  setErr("dob",       fields.dob       ? "" : "Required");
  setErr("gender",    fields.gender    ? "" : "Required");
  setErr("contact",   /^\d{10}$/.test(fields.contact) ? "" : "Valid 10-digit number required");

  if (fields.emergencyContact && !/^\d{10}$/.test(fields.emergencyContact)) {
    setErr("emergencyContact", "Valid 10-digit number required");
  } else {
    setErr("emergencyContact", "");
  }

  if (valid) {
    document.getElementById("intake-success").textContent = "✓ Patient record saved successfully.";
    showToast("Patient registered successfully.");
    setTimeout(() => {
      document.getElementById("intake-success").textContent = "";
    }, 3000);
  }
}

function saveDraft() {
  showToast("Draft saved.");
}

// =====================
// APPOINTMENT BOOKING
// =====================
function searchPatients() {
  const q = document.getElementById("appt-patient-search").value.trim().toLowerCase();
  const resultsEl = document.getElementById("patient-results");

  if (q.length < 2) { resultsEl.innerHTML = ""; return; }

  const matches = PATIENTS.filter(p => p.name.toLowerCase().includes(q));

  if (matches.length === 0) {
    resultsEl.innerHTML = `<div class="dropdown-item"><span style="color:#888780;">No patients found</span></div>`;
    return;
  }

  resultsEl.innerHTML = matches.map(p => `
    <div class="dropdown-item" onclick="selectPatient(${p.id})">
      <span class="dropdown-item-name">${p.name}</span>
      <span class="dropdown-item-meta">DOB: ${p.dob}</span>
    </div>
  `).join("");
}

function selectPatient(id) {
  selectedApptPatient = PATIENTS[id];
  document.getElementById("patient-search-block").style.display = "none";
  document.getElementById("selected-patient-block").style.display = "flex";
  document.getElementById("selected-patient-name").textContent = selectedApptPatient.name;
  document.getElementById("selected-patient-meta").textContent =
    `DOB: ${selectedApptPatient.dob} · ${selectedApptPatient.bloodGroup} · ${selectedApptPatient.conditions || "No known conditions"}`;
  document.getElementById("err-appt-patient").textContent = "";
}

function clearPatient() {
  selectedApptPatient = null;
  document.getElementById("patient-search-block").style.display = "";
  document.getElementById("selected-patient-block").style.display = "none";
  document.getElementById("appt-patient-search").value = "";
  document.getElementById("patient-results").innerHTML = "";
}

function checkDoctorAvail() {
  const sel = document.getElementById("appt-doctor");
  const opt = sel.options[sel.selectedIndex];
  const avail = opt && opt.dataset.avail;
  const msg = document.getElementById("doctor-avail-msg");

  if (!avail) { msg.textContent = ""; return; }
  if (avail === "true") {
    msg.textContent = "✓ Available today";
    msg.className = "avail-msg avail-available";
  } else {
    msg.textContent = "⚠ Not available today";
    msg.className = "avail-msg avail-busy";
  }
}

function confirmBooking() {
  const doctor = document.getElementById("appt-doctor").value;
  const type   = document.getElementById("appt-type").value;
  const date   = document.getElementById("appt-date").value;
  const time   = document.getElementById("appt-time").value;

  let valid = true;

  function setErr(id, msg) {
    const el = document.getElementById("err-appt-" + id);
    const input = document.getElementById("appt-" + id);
    if (el) el.textContent = msg;
    if (input) input.classList.toggle("error-field", !!msg);
    if (msg) valid = false;
  }

  if (!selectedApptPatient) {
    document.getElementById("err-appt-patient").textContent = "Select a patient";
    valid = false;
  }
  setErr("doctor", doctor ? "" : "Select a doctor");
  setErr("type",   type   ? "" : "Select appointment type");
  setErr("date",   date   ? "" : "Select a date");
  setErr("time",   time   ? "" : "Select a time");

  if (valid) {
    const docName = document.getElementById("appt-doctor").options[
      document.getElementById("appt-doctor").selectedIndex
    ].text.split(" — ")[0];

    const box = document.getElementById("appt-confirm-box");
    box.style.display = "";
    document.getElementById("confirm-meta").textContent =
      `${selectedApptPatient.name} with ${docName} on ${date} at ${time}`;

    showToast("Appointment booked successfully!");

    setTimeout(() => {
      box.style.display = "none";
      clearPatient();
      ["appt-doctor","appt-type","appt-date","appt-time"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      document.getElementById("appt-notes").value = "";
      document.getElementById("doctor-avail-msg").textContent = "";
    }, 3500);
  }
}

// =====================
// APPOINTMENTS LIST
// =====================
function renderList() {
  const search  = document.getElementById("list-search").value.toLowerCase();
  const date    = document.getElementById("list-date").value;
  const doctor  = document.getElementById("list-doctor").value;
  const status  = document.getElementById("list-status").value;

  const filtered = APPOINTMENTS.filter(a => {
    if (date   && a.date       !== date)   return false;
    if (doctor && a.doctorName !== doctor) return false;
    if (status && a.status     !== status) return false;
    if (search && !a.patientName.toLowerCase().includes(search)) return false;
    return true;
  });

  const tbody = document.getElementById("list-tbody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#888780;padding:32px;">No appointments found</td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(a => `
      <tr>
        <td style="font-weight:500;">${a.patientName}</td>
        <td>${a.doctorName}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="tag">${a.type}</span></td>
        <td><span class="badge badge-${a.status}">${a.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-secondary btn-sm">View</button>
            ${a.status === "scheduled" ? `<button class="btn btn-secondary btn-sm">Edit</button>` : ""}
            ${a.status === "scheduled" ? `<button class="btn btn-danger btn-sm">Cancel</button>` : ""}
          </div>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("list-count").textContent =
    `${filtered.length} appointment${filtered.length !== 1 ? "s" : ""} shown`;
}

function clearListFilters() {
  document.getElementById("list-search").value = "";
  document.getElementById("list-date").value = "";
  document.getElementById("list-doctor").value = "";
  document.getElementById("list-status").value = "";
  renderList();
}

// =====================
// DOCTOR APPOINTMENTS
// =====================
function setApptFilter(filter, btn) {
  docApptFilter = filter;
  document.querySelectorAll("#page-doc-appointments .tab-btn").forEach(b =>
    b.classList.toggle("active", b === btn)
  );
  renderDocAppts();
}

function renderDocAppts() {
  const search = (document.getElementById("doc-appt-search").value || "").toLowerCase();

  const filtered = APPOINTMENTS.filter(a => {
    if (docApptFilter === "upcoming" && (a.status === "completed" || a.status === "cancelled")) return false;
    if (docApptFilter === "past"     && a.status === "scheduled")  return false;
    if (search && !a.patientName.toLowerCase().includes(search))   return false;
    return true;
  });

  const container = document.getElementById("doc-appt-list");

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:#888780;padding:20px;">No appointments found.</p>`;
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
        <div class="appt-meta">${a.type}${a.notes ? " · " + a.notes : ""}</div>
      </div>
      <span class="badge badge-${a.status}">${a.status}</span>
      <button class="btn btn-secondary" style="font-size:13px;" onclick="viewPatientFromAppt(${a.patientId})">
        View Patient →
      </button>
    </div>
  `).join("");
}

function viewPatientFromAppt(patientId) {
  currentPatientId = patientId;
  document.getElementById("patient-select").value = patientId;
  setPage("patient-details");
}

// =====================
// PATIENT DETAILS
// =====================
function loadPatient() {
  currentPatientId = +document.getElementById("patient-select").value;
  const p = PATIENTS[currentPatientId];
  const age = new Date().getFullYear() - new Date(p.dob).getFullYear();

  // header
  const initials = p.name.split(" ").map(w => w[0]).join("");
  document.getElementById("patient-header").innerHTML = `
    <div class="avatar avatar-lg" style="background:#FAEEDA;color:#BA7517;font-size:16px;">${initials}</div>
    <div style="flex:1;">
      <p class="patient-name-lg">${p.name}</p>
      <p class="patient-sub">${age} years · ${p.gender} · ${p.contact}</p>
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
    </div>
  `;

  // reset to overview tab
  document.querySelectorAll(".tab-bar .tab-btn").forEach((b, i) =>
    b.classList.toggle("active", i === 0)
  );
  document.querySelectorAll(".patient-tab").forEach((t, i) =>
    t.classList.toggle("active", i === 0)
  );

  renderOverview(p);
  renderHistory(p);
  renderNotesList(p);
}

function renderOverview(p) {
  const visits = [...VISITS.filter(v => v.patientId === p.id), ...EXTRA_NOTES[p.id]];
  const last = visits[visits.length - 1];

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
      </div>
      <div class="card">
        <p class="card-heading">Last Visit</p>
        ${last ? `
          <p style="font-size:13px;color:#888780;">${last.date} · ${last.doctor}</p>
          <p style="font-size:14px;line-height:1.6;margin-top:8px;">${last.notes}</p>
          ${last.diagnosis ? `<p style="margin-top:8px;"><span class="tag">${last.diagnosis}</span></p>` : ""}
        ` : `<p style="color:#888780;font-size:14px;">No visits recorded.</p>`}
      </div>
    </div>
  `;
}

function renderHistory(p) {
  const visits = VISITS.filter(v => v.patientId === p.id);
  const historyEl = document.getElementById("tab-history");

  if (visits.length === 0) {
    historyEl.innerHTML = `<div class="card"><p style="color:#888780;">No visit history.</p></div>`;
    return;
  }

  historyEl.innerHTML = `
    <div class="card">
      ${visits.map(v => `
        <div class="visit-entry">
          <div class="visit-header">
            <div>
              <div class="visit-date">${v.date}</div>
              <div class="visit-doctor">${v.doctor}</div>
            </div>
            ${v.diagnosis ? `<span class="tag">${v.diagnosis}</span>` : ""}
          </div>
          <p class="visit-notes">${v.notes}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderNotesList(p) {
  const all = [
    ...VISITS.filter(v => v.patientId === p.id),
    ...EXTRA_NOTES[p.id]
  ].slice().reverse();

  const el = document.getElementById("notes-list");

  if (all.length === 0) {
    el.innerHTML = `<p class="card-heading">Previous Notes</p><p style="color:#888780;font-size:14px;">No notes yet.</p>`;
    return;
  }

  el.innerHTML = `
    <p class="card-heading">Previous Notes</p>
    ${all.map(v => `
      <div class="notes-entry">
        <div class="notes-meta">${v.date} · ${v.doctor}</div>
        <div class="notes-text">${v.notes}</div>
      </div>
    `).join("")}
  `;
}

function addNote() {
  const val = document.getElementById("new-note").value.trim();
  if (!val) return;

  EXTRA_NOTES[currentPatientId].push({
    id: Date.now(),
    patientId: currentPatientId,
    date: "2026-04-23",
    doctor: "Dr. Priya Nair",
    notes: val,
    diagnosis: ""
  });

  document.getElementById("new-note").value = "";
  renderNotesList(PATIENTS[currentPatientId]);
  showToast("Note saved.");
}

function setPatientTab(tab, btn) {
  document.querySelectorAll(".tab-bar .tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".patient-tab").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
  setPage("intake");
  renderList();
  renderDocAppts();
  loadPatient();
});