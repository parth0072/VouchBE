// ============================================================
// Data: the full endpoint catalog (mirrors API.md exactly)
// ============================================================
const ENDPOINTS = [
  // --- Auth ---
  { group:"Auth", method:"POST", path:"/auth/signup", auth:"none", desc:"Password signup. Call /auth/role right after — active_role at signup is just a placeholder.",
    body:{ email:"reya@example.com", password:"correcthorse123" } },
  { group:"Auth", method:"POST", path:"/auth/login", auth:"none", desc:"Existing account login.",
    body:{ email:"reya@example.com", password:"correcthorse123" } },
  { group:"Auth", method:"POST", path:"/auth/refresh", auth:"none", desc:"Re-sign a fresh token pair from a refresh token.",
    body:{ refresh_token:"" } },
  { group:"Auth", method:"POST", path:"/auth/role", auth:"bearer", desc:"Switch active role; creates the client_profiles/creator_profiles row on first switch.",
    body:{ role:"creator" } },
  { group:"Auth", method:"POST", path:"/auth/logout", auth:"bearer", desc:"Client-side signal only — no server session to invalidate." },

  // --- Onboarding ---
  { group:"Onboarding", method:"GET", path:"/social-accounts/:platform/oauth-url", auth:"bearer", desc:"platform = instagram | tiktok | youtube | facebook. 501 until OAuth env vars are set." },
  { group:"Onboarding", method:"POST", path:"/social-accounts/:platform/callback", auth:"bearer", desc:"501 until OAuth env vars are set.",
    body:{ code:"abc123" } },
  { group:"Onboarding", method:"DELETE", path:"/social-accounts/:id", auth:"bearer", desc:"Remove a linked social account." },
  { group:"Onboarding", method:"PATCH", path:"/creator-profile", auth:"bearer", desc:"All fields optional.",
    body:{ name:"Reya Okafor", bio:"Beauty + product content.", niches:["beauty","product"], starting_rate:250, typical_turnaround_days:3 } },
  { group:"Onboarding", method:"POST", path:"/creator-profile/portfolio", auth:"bearer", desc:"media_url is an already-uploaded S3 URL, not a file upload.",
    body:{ media_url:"https://vouch-media.s3.amazonaws.com/portfolio/abc.jpg" } },
  { group:"Onboarding", method:"DELETE", path:"/creator-profile/portfolio/:id", auth:"bearer", desc:"Remove a portfolio item." },

  // --- Briefs ---
  { group:"Briefs", method:"POST", path:"/briefs", auth:"bearer", desc:"Client posts a brief. Needs POST /auth/role {role:client} done first.",
    body:{ title:"15s product reel for launch", format:"reel", niche:"beauty", description:"Handheld, natural light, 15s max.", budget_min:300, budget_max:600, deadline:"2026-09-02", reference_images:[] } },
  { group:"Briefs", method:"GET", path:"/briefs/mine", auth:"bearer", desc:"Client's own briefs.", query:[{name:"status", placeholder:"open"}] },
  { group:"Briefs", method:"GET", path:"/briefs/feed", auth:"bearer", desc:"Creator's open-brief feed, defaults to their own niches.", query:[{name:"niche"},{name:"budget_min"},{name:"format"}] },
  { group:"Briefs", method:"GET", path:"/briefs/:id", auth:"bearer", desc:"Any authenticated user." },
  { group:"Briefs", method:"PATCH", path:"/briefs/:id", auth:"bearer", desc:"Client, owner, only while status: open.",
    body:{ title:"Updated title", budget_max:650 } },
  { group:"Briefs", method:"POST", path:"/briefs/:id/cancel", auth:"bearer", desc:"Client, owner." },

  // --- Bids ---
  { group:"Bids", method:"POST", path:"/briefs/:id/bids", auth:"bearer", desc:"Creator bids on a brief. -> notifies client (bid_received).",
    body:{ price:450, delivery_days:3, note:"Can start Monday." } },
  { group:"Bids", method:"GET", path:"/briefs/:id/bids", auth:"bearer", desc:"Client, owner — reviews bids on their brief." },
  { group:"Bids", method:"GET", path:"/bids/mine", auth:"bearer", desc:"Creator's own bids, with parent brief nested." },
  { group:"Bids", method:"PATCH", path:"/bids/:id", auth:"bearer", desc:"Creator, owner, only while pending.",
    body:{ price:480, delivery_days:2 } },
  { group:"Bids", method:"DELETE", path:"/bids/:id", auth:"bearer", desc:"Creator, owner, only while pending. Hard delete." },
  { group:"Bids", method:"POST", path:"/bids/:id/accept", auth:"bearer", desc:"Client, brief owner. Declines other bids, creates the Deal." },

  // --- Creators ---
  { group:"Creators", method:"GET", path:"/creators/search", auth:"bearer", desc:"Directory search.", query:[{name:"q"},{name:"niche"},{name:"followers_min"},{name:"followers_max"},{name:"budget_max"}] },
  { group:"Creators", method:"GET", path:"/creators/:id", auth:"bearer", desc:"Single creator + portfolio_items." },

  // --- Offers ---
  { group:"Offers", method:"POST", path:"/offers", auth:"bearer", desc:"Client sends a direct offer. Creates/reuses a Thread as a side effect.",
    body:{ creator_id:"", brief_id:null, price:520, format:"reel", turnaround_days:3, message:"Loved your spring campaign." } },
  { group:"Offers", method:"GET", path:"/offers/mine", auth:"bearer", desc:"Sent (client) + received (creator) offers." },
  { group:"Offers", method:"GET", path:"/offers/:id", auth:"bearer", desc:"Participant. Includes revisions[]." },
  { group:"Offers", method:"POST", path:"/offers/:id/counter", auth:"bearer", desc:"Either participant. -> notifies the other side (offer_countered).",
    body:{ price:600, turnaround_days:4, note:"Covers a second usage license." } },
  { group:"Offers", method:"POST", path:"/offers/:id/accept", auth:"bearer", desc:"Either participant. Creates a Deal (source: direct_offer)." },
  { group:"Offers", method:"POST", path:"/offers/:id/decline", auth:"bearer", desc:"Either participant." },

  // --- Agreement ---
  { group:"Agreement", method:"POST", path:"/deals/:id/agreement", auth:"bearer", desc:"Client, deal party. negotiating -> agreement_pending.",
    body:{ usage_rights:"paid_ads", live_duration_days:60, approval_required:true, min_views:null } },
  { group:"Agreement", method:"GET", path:"/deals/:id/agreement", auth:"bearer", desc:"Either party. 404 if not set yet." },
  { group:"Agreement", method:"POST", path:"/deals/:id/agreement/consent", auth:"bearer", desc:"Creator, deal party. The hard gate — consented must be literal true.",
    body:{ consented:true } },

  // --- Escrow & Payments ---
  { group:"Escrow & Payments", method:"POST", path:"/deals/:id/fund", auth:"bearer", desc:"Client. Real Stripe manual-capture PaymentIntent — 501 until STRIPE_SECRET_KEY is set.",
    body:{ payment_method_id:"" } },
  { group:"Escrow & Payments", method:"POST", path:"/deals/:id/mark-live", auth:"bearer", desc:"Creator, deal party.",
    body:{ live_url:"https://instagram.com/p/abc123" } },
  { group:"Escrow & Payments", method:"POST", path:"/internal/escrow/release-due-payouts", auth:"internal", desc:"Cron-only. Header X-Internal-Secret, not a Bearer token." },
  { group:"Escrow & Payments", method:"GET", path:"/transactions/mine", auth:"bearer", desc:"Ledger of the caller's transactions." },
  { group:"Escrow & Payments", method:"POST", path:"/payment-methods", auth:"bearer", desc:"Client. Attaches a Stripe PaymentMethod id (from a client-confirmed SetupIntent).",
    body:{ payment_method_id:"pm_1P..." } },
  { group:"Escrow & Payments", method:"GET", path:"/payment-methods", auth:"bearer", desc:"Client's saved payment methods." },
  { group:"Escrow & Payments", method:"POST", path:"/payout-methods", auth:"bearer", desc:"Creator. Creates/reuses a Stripe Connect Express account + onboarding link.",
    body:{ schedule:"weekly" } },
  { group:"Escrow & Payments", method:"GET", path:"/payout-methods", auth:"bearer", desc:"Creator's payout methods." },

  // --- Drafts ---
  { group:"Drafts", method:"POST", path:"/deals/:id/drafts", auth:"bearer", desc:"Creator, deal party. Pre-signed S3 URL flow.",
    body:{ file_url:"https://vouch-media.s3.amazonaws.com/drafts/abc.mp4", note:"First cut — happy to adjust the opening shot." } },
  { group:"Drafts", method:"GET", path:"/deals/:id/drafts", auth:"bearer", desc:"Either party, newest first." },
  { group:"Drafts", method:"POST", path:"/drafts/:id/approve", auth:"bearer", desc:"Client, deal party." },
  { group:"Drafts", method:"POST", path:"/drafts/:id/request-changes", auth:"bearer", desc:"Client, deal party. feedback is required.",
    body:{ feedback:"Can you use the overhead shot as the opener instead?" } },

  // --- Messaging ---
  { group:"Messaging", method:"GET", path:"/threads", auth:"bearer", desc:"All threads, sorted by last_message.created_at desc." },
  { group:"Messaging", method:"GET", path:"/threads/:id/messages", auth:"bearer", desc:"Participant. Cursor pagination, 30/page, newest first.", query:[{name:"before", placeholder:"<message id>"}] },
  { group:"Messaging", method:"POST", path:"/threads/:id/messages", auth:"bearer", desc:"Participant. text and/or attachment_url — at least one required.",
    body:{ text:"Sure, send me the terms" } },

  // --- Notifications ---
  { group:"Notifications", method:"GET", path:"/notifications", auth:"bearer", desc:"", query:[{name:"unread_only", placeholder:"true"}] },
  { group:"Notifications", method:"POST", path:"/notifications/:id/read", auth:"bearer", desc:"Mark one notification read." },
  { group:"Notifications", method:"POST", path:"/push-tokens", auth:"bearer", desc:"Register a device for push.",
    body:{ platform:"ios", token:"fcm-or-apns-token" } },

  // --- Reviews ---
  { group:"Reviews", method:"POST", path:"/deals/:id/review", auth:"bearer", desc:"Either deal party. Only once Deal.status = completed.",
    body:{ rating:5, tags:["great_communication","on_time"], comment:"Would book again." } },
  { group:"Reviews", method:"GET", path:"/users/:id/reviews", auth:"bearer", desc:"Public review summary + list for a user." },

  // --- Settings ---
  { group:"Settings", method:"GET", path:"/me", auth:"bearer", desc:"Never includes password_hash." },
  { group:"Settings", method:"PATCH", path:"/me", auth:"bearer", desc:"avatar_url is written to whichever profile you hold.",
    body:{ avatar_url:"https://example.com/avatar.jpg", notification_prefs:{ push:true, email_digest:false } } },

  // --- Deals (core) ---
  { group:"Deals", method:"GET", path:"/deals/mine", auth:"bearer", desc:"All deals + nested agreement/escrow (nullable until set)." },
  { group:"Deals", method:"GET", path:"/deals/:id", auth:"bearer", desc:"Participant. Single-deal shape." },
  { group:"Deals", method:"POST", path:"/deals/:id/cancel", auth:"bearer", desc:"Participant. Only while negotiating or agreement_pending." },

  // --- Health ---
  { group:"Health", method:"GET", path:"/health", auth:"none", desc:"Liveness check." },
];

// ============================================================
// State
// ============================================================
let sessions = [];       // {id, email, access_token, refresh_token, active_role, has_client_profile, has_creator_profile}
let activeSessionId = null;
let currentEndpoint = null;
let history = [];

// localStorage throws in some hosting contexts (private browsing, a data:
// preview sandbox, storage disabled) rather than just being empty — every
// call goes through here so a storage failure degrades to in-memory-only
// state for this page load instead of surfacing as a broken action elsewhere
// (it was previously indistinguishable from a failed API call).
let storageAvailable = true;
const storage = {
  get(key, fallback){
    try { const v = localStorage.getItem(key); return v === null ? fallback : v; }
    catch { storageAvailable = false; return fallback; }
  },
  set(key, value){
    try { localStorage.setItem(key, value); }
    catch { storageAvailable = false; }
  },
};

function loadState(){
  try{ sessions = JSON.parse(storage.get("vouch-console-sessions", "[]")); }catch{ sessions = []; }
  activeSessionId = storage.get("vouch-console-active", null) || null;
  try{ history = JSON.parse(storage.get("vouch-console-history", "[]")); }catch{ history = []; }
  const savedBase = storage.get("vouch-console-base", null);
  if (savedBase){
    const sel = document.getElementById("baseSelect");
    const opt = [...sel.options].find(o => o.value === savedBase);
    if (opt){ sel.value = savedBase; }
    else { sel.value = "custom"; document.getElementById("baseCustom").style.display = "inline-block"; document.getElementById("baseCustom").value = savedBase; }
  }
  if (!storageAvailable) toast("Storage unavailable here — sessions won't persist across reloads");
}
function saveSessions(){ storage.set("vouch-console-sessions", JSON.stringify(sessions)); }
function saveActive(){ storage.set("vouch-console-active", activeSessionId || ""); }
function saveHistory(){ storage.set("vouch-console-history", JSON.stringify(history.slice(0, 40))); }
function saveBase(){ storage.set("vouch-console-base", getBaseUrl()); }

function getBaseUrl(){
  const sel = document.getElementById("baseSelect");
  if (sel.value === "custom") return document.getElementById("baseCustom").value.trim().replace(/\/$/, "");
  return sel.value;
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ============================================================
// Sessions
// ============================================================
function fillTestEmail(){
  document.getElementById("authEmail").value = `test-${Date.now()}@example.com`;
}

async function doSignup(){
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!email || !password) return toast("Enter an email + password first");
  try {
    const res = await fetch(getBaseUrl() + "/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) return toast(json.error || `Signup failed (${res.status})`);
    await addSession(email, json.access_token, json.refresh_token);
    toast("Signed up — session saved");
  } catch (e) { toast("Network error: " + e.message); }
}

async function doLogin(){
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!email || !password) return toast("Enter an email + password first");
  try {
    const res = await fetch(getBaseUrl() + "/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) return toast(json.error || `Login failed (${res.status})`);
    await addSession(email, json.access_token, json.refresh_token);
    toast("Logged in — session saved");
  } catch (e) { toast("Network error: " + e.message); }
}

async function addSession(email, access_token, refresh_token){
  const id = "s_" + Date.now();
  const session = { id, email, access_token, refresh_token, active_role: null, has_client_profile: false, has_creator_profile: false, user_id: null };
  sessions.push(session);
  activeSessionId = id;
  saveSessions(); saveActive();
  await refreshSessionMe(id);
  renderSessions();
}

async function refreshSessionMe(id){
  const s = sessions.find(x => x.id === id);
  if (!s) return;
  try {
    const res = await fetch(getBaseUrl() + "/me", { headers: { Authorization: "Bearer " + s.access_token } });
    if (res.ok){
      const me = await res.json();
      s.active_role = me.active_role; s.has_client_profile = me.has_client_profile;
      s.has_creator_profile = me.has_creator_profile; s.user_id = me.id;
      saveSessions();
    }
  } catch {}
}

async function switchRole(id, role){
  const s = sessions.find(x => x.id === id);
  if (!s) return;
  try {
    const res = await fetch(getBaseUrl() + "/auth/role", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + s.access_token },
      body: JSON.stringify({ role })
    });
    const json = await res.json();
    if (!res.ok) return toast(json.error || "Role switch failed");
    s.active_role = json.active_role; s.has_client_profile = json.has_client_profile; s.has_creator_profile = json.has_creator_profile;
    saveSessions(); renderSessions();
    toast(`Now ${role} — ${json.active_role === "creator" && !json.has_creator_profile ? "" : "profile row ready"}`);
  } catch (e) { toast("Network error: " + e.message); }
}

function removeSession(id){
  sessions = sessions.filter(s => s.id !== id);
  if (activeSessionId === id) activeSessionId = sessions[0]?.id || null;
  saveSessions(); saveActive(); renderSessions();
}

function setActiveSession(id){
  activeSessionId = id; saveActive(); renderSessions();
  if (currentEndpoint) renderRequestPanel();
}

function renderSessions(){
  const el = document.getElementById("sessionList");
  if (sessions.length === 0){ el.innerHTML = `<div class="no-sessions">No sessions yet — sign up above.</div>`; return; }
  el.innerHTML = sessions.map(s => `
    <div class="session-card ${s.id === activeSessionId ? "active" : ""}" onclick="setActiveSession('${s.id}')">
      <div class="row1">
        <span class="session-email">${escapeHtml(s.email)}</span>
        ${s.active_role ? `<span class="role-pill ${s.active_role}">${s.active_role}</span>` : `<span class="role-pill">no role</span>`}
      </div>
      <div class="session-id">${s.user_id ? s.user_id.slice(0,8) + "…" : ""} ${s.has_client_profile ? "· client✓" : ""} ${s.has_creator_profile ? "· creator✓" : ""}</div>
      <div class="session-actions" onclick="event.stopPropagation()">
        <button class="btn btn-ghost btn-sm" onclick="switchRole('${s.id}','client')">→ client</button>
        <button class="btn btn-ghost btn-sm" onclick="switchRole('${s.id}','creator')">→ creator</button>
        <button class="btn btn-ghost btn-sm" style="margin-left:auto;color:var(--danger)" onclick="removeSession('${s.id}')">remove</button>
      </div>
    </div>
  `).join("");
}

// ============================================================
// Endpoint catalog sidebar
// ============================================================
function renderEndpointGroups(){
  const groups = [...new Set(ENDPOINTS.map(e => e.group))];
  const el = document.getElementById("endpointGroups");
  el.innerHTML = groups.map((g, gi) => {
    const items = ENDPOINTS.filter(e => e.group === g);
    return `
    <div class="group" data-group="${g}">
      <button class="group-head" onclick="toggleGroup('${g}')">
        <span>${g} <span class="group-count">(${items.length})</span></span>
        <span class="group-chevron">▸</span>
      </button>
      <div class="group-items">
        ${items.map((e, i) => `
          <button class="ep-item" data-key="${g}::${i}" onclick="selectEndpoint('${g}', ${i})">
            <span class="m-tag m-${e.method}">${e.method}</span>
            <span class="ep-path">${e.path}</span>
            ${e.auth === "bearer" ? '<span class="ep-lock">🔒</span>' : ""}
          </button>
        `).join("")}
      </div>
    </div>`;
  }).join("");
}

function toggleGroup(g){
  document.querySelector(`.group[data-group="${g}"]`).classList.toggle("open");
}

function selectEndpoint(group, idx){
  const items = ENDPOINTS.filter(e => e.group === group);
  currentEndpoint = { ...items[idx], _key: `${group}::${idx}` };
  document.querySelectorAll(".ep-item").forEach(b => b.classList.toggle("selected", b.dataset.key === currentEndpoint._key));
  renderRequestPanel();
}

// ============================================================
// Request panel
// ============================================================
function buildPath(ep, params){
  let p = ep.path;
  for (const [k, v] of Object.entries(params)) p = p.replace(":" + k, encodeURIComponent(v || ""));
  return p;
}
function pathParamNames(path){ return [...path.matchAll(/:(\w+)/g)].map(m => m[1]); }

function renderRequestPanel(){
  const ep = currentEndpoint;
  const main = document.getElementById("main");
  const pParams = pathParamNames(ep.path);
  const activeSession = sessions.find(s => s.id === activeSessionId);

  main.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">${ep.method} ${ep.path}</h2>
      <p class="panel-desc">${ep.desc || ""}</p>

      ${pParams.length || (ep.query && ep.query.length) ? `
      <div class="field-grid">
        ${pParams.map(p => `<div class="field"><label>${p}</label><input id="param_${p}" type="text" placeholder="${p}"></div>`).join("")}
        ${(ep.query||[]).map(q => `<div class="field"><label>?${q.name}</label><input id="query_${q.name}" type="text" placeholder="${q.placeholder||""}"></div>`).join("")}
      </div>` : ""}

      ${ep.auth === "bearer" ? `
        <div class="auth-row">
          <label>Session</label>
          <select id="sessionPicker">
            ${sessions.length === 0 ? '<option value="">— no sessions —</option>' :
              sessions.map(s => `<option value="${s.id}" ${s.id===activeSessionId?"selected":""}>${escapeHtml(s.email)} ${s.active_role ? "("+s.active_role+")":""}</option>`).join("")}
          </select>
        </div>
      ` : ep.auth === "internal" ? `
        <div class="field" style="margin-bottom:14px;"><label>X-Internal-Secret</label><input id="internalSecret" type="text" placeholder="INTERNAL_API_SECRET value"></div>
      ` : `<div class="auth-off" style="margin-bottom:14px;">No authentication required.</div>`}

      ${ep.body !== undefined ? `
        <div class="body-label">
          <span>Body</span>
          <button class="btn btn-ghost btn-sm" onclick="resetBody()">reset to example</button>
        </div>
        <textarea id="bodyEditor" spellcheck="false"></textarea>
      ` : ""}

      <div class="url-preview" id="urlPreview" style="margin-top:14px;"></div>

      <div class="send-row">
        <button class="btn btn-primary" onclick="sendRequest()">Send →</button>
        <span id="sendStatus"></span>
        <div style="flex:1"></div>
        <button class="btn btn-ghost btn-sm" onclick="copyCurl()">copy as curl</button>
      </div>
    </div>

    <div class="panel">
      <div class="body-label" style="margin-bottom:10px;"><span>Response</span></div>
      <div id="responseArea"><div class="resp-empty">Nothing sent yet.</div></div>
    </div>

    <div class="panel">
      <div class="body-label" style="margin-bottom:10px;"><span>History</span></div>
      <div class="history-list" id="historyList"></div>
    </div>
  `;

  if (ep.body !== undefined){
    document.getElementById("bodyEditor").value = ep.body ? JSON.stringify(ep.body, null, 2) : "";
  }
  document.querySelectorAll('[id^="param_"], [id^="query_"]').forEach(el => el.addEventListener("input", updateUrlPreview));
  updateUrlPreview();
  renderHistory();
}

function resetBody(){
  if (currentEndpoint.body) document.getElementById("bodyEditor").value = JSON.stringify(currentEndpoint.body, null, 2);
}

function currentParams(){
  const params = {};
  pathParamNames(currentEndpoint.path).forEach(p => { params[p] = document.getElementById("param_" + p)?.value || ""; });
  return params;
}
function currentQuery(){
  const q = new URLSearchParams();
  (currentEndpoint.query || []).forEach(qd => {
    const v = document.getElementById("query_" + qd.name)?.value;
    if (v) q.set(qd.name, v);
  });
  const s = q.toString();
  return s ? "?" + s : "";
}

function updateUrlPreview(){
  const path = buildPath(currentEndpoint, currentParams()) + currentQuery();
  document.getElementById("urlPreview").innerHTML = `<b>${getBaseUrl()}</b>${escapeHtml(path)}`;
}

async function sendRequest(){
  const ep = currentEndpoint;
  const path = buildPath(ep, currentParams()) + currentQuery();
  const url = getBaseUrl() + path;
  const headers = { "Content-Type": "application/json" };
  let sessionUsed = null;

  if (ep.auth === "bearer"){
    const sid = document.getElementById("sessionPicker")?.value;
    sessionUsed = sessions.find(s => s.id === sid);
    if (!sessionUsed) return toast("Pick a session first");
    headers["Authorization"] = "Bearer " + sessionUsed.access_token;
  } else if (ep.auth === "internal"){
    const secret = document.getElementById("internalSecret")?.value;
    if (secret) headers["X-Internal-Secret"] = secret;
  }

  let bodyText = null;
  if (ep.body !== undefined){
    bodyText = document.getElementById("bodyEditor").value.trim();
  }

  const opts = { method: ep.method, headers };
  if (bodyText && ep.method !== "GET"){
    try { JSON.parse(bodyText); } catch { return toast("Body isn't valid JSON"); }
    opts.body = bodyText;
  }

  document.getElementById("sendStatus").innerHTML = `<span class="timing">sending…</span>`;
  const t0 = performance.now();
  let record = { method: ep.method, path, url, time: new Date().toISOString() };

  try {
    const res = await fetch(url, opts);
    const ms = Math.round(performance.now() - t0);
    let json = null, raw = null;
    try { raw = await res.text(); json = raw ? JSON.parse(raw) : null; } catch { /* not json */ }

    record.status = res.status; record.ms = ms; record.response = json ?? raw;
    renderResponse(res.status, ms, json ?? raw);

    // convenience: auto-refresh the session's /me snapshot after any call that likely changed it
    if (sessionUsed && (path === "/auth/role" || path === "/me")) await refreshSessionMe(sessionUsed.id), renderSessions();

  } catch (e) {
    record.status = "ERR"; record.ms = Math.round(performance.now() - t0); record.response = e.message;
    renderResponse("ERR", record.ms, e.message);
  }

  history.unshift(record);
  saveHistory();
  renderHistory();
  document.getElementById("sendStatus").innerHTML = "";
}

function statusClass(status){
  if (status === "ERR") return "status-err";
  if (status >= 200 && status < 300) return "status-2xx";
  if (status >= 400 && status < 500) return "status-4xx";
  return "status-5xx";
}

function renderResponse(status, ms, body){
  const area = document.getElementById("responseArea");
  area.innerHTML = `
    <div class="send-row" style="margin-top:0;margin-bottom:12px;">
      <span class="status-pill ${statusClass(status)}">${status === "ERR" ? "NETWORK ERROR" : status}</span>
      <span class="timing">${ms}ms</span>
      <div style="flex:1"></div>
      <button class="btn btn-ghost btn-sm" onclick="copyResponse()">copy JSON</button>
    </div>
    <div class="resp-body" id="respBody">${syntaxHighlight(body)}</div>
  `;
  area._raw = body;
}

function syntaxHighlight(body){
  if (body === null || body === undefined) return '<span class="json-null">(empty body)</span>';
  const text = typeof body === "string" ? body : JSON.stringify(body, null, 2);
  const escaped = escapeHtml(text);
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g, m => {
    if (/^"/.test(m)) return /:$/.test(m) ? `<span class="json-key">${m}</span>` : `<span class="json-str">${m}</span>`;
    if (/true|false/.test(m)) return `<span class="json-bool">${m}</span>`;
    if (/null/.test(m)) return `<span class="json-null">${m}</span>`;
    return `<span class="json-num">${m}</span>`;
  });
}

function copyResponse(){
  const area = document.getElementById("responseArea");
  const text = typeof area._raw === "string" ? area._raw : JSON.stringify(area._raw, null, 2);
  navigator.clipboard.writeText(text || "").then(() => toast("Response copied"));
}

function copyCurl(){
  const ep = currentEndpoint;
  const path = buildPath(ep, currentParams()) + currentQuery();
  let cmd = `curl -s -X ${ep.method} "${getBaseUrl()}${path}"`;
  cmd += ` \\\n  -H "Content-Type: application/json"`;
  if (ep.auth === "bearer"){
    const sid = document.getElementById("sessionPicker")?.value;
    const s = sessions.find(x => x.id === sid);
    if (s) cmd += ` \\\n  -H "Authorization: Bearer ${s.access_token}"`;
  } else if (ep.auth === "internal"){
    const secret = document.getElementById("internalSecret")?.value;
    if (secret) cmd += ` \\\n  -H "X-Internal-Secret: ${secret}"`;
  }
  if (ep.body !== undefined){
    const bodyText = document.getElementById("bodyEditor").value.trim();
    if (bodyText) cmd += ` \\\n  -d '${bodyText.replace(/'/g, "'\\''")}'`;
  }
  navigator.clipboard.writeText(cmd).then(() => toast("curl command copied"));
}

function renderHistory(){
  const el = document.getElementById("historyList");
  if (!el) return;
  if (history.length === 0){ el.innerHTML = `<div class="no-sessions">No requests sent yet.</div>`; return; }
  el.innerHTML = history.slice(0, 20).map((h, i) => `
    <div class="history-row" onclick='replayHistory(${i})'>
      <span class="method-badge ${h.method}" style="font-size:10px;padding:3px 6px;">${h.method}</span>
      <span class="history-path">${escapeHtml(h.path)}</span>
      <span class="status-pill ${statusClass(h.status)}" style="font-size:10px;">${h.status}</span>
      <span class="history-time">${h.ms}ms</span>
    </div>
  `).join("");
}

function replayHistory(i){
  const h = history[i];
  renderResponse(h.status, h.ms, h.response);
  toast(`${h.method} ${h.path} — ${new Date(h.time).toLocaleTimeString()}`);
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

// ============================================================
// Boot
// ============================================================
document.getElementById("baseSelect").addEventListener("change", (e) => {
  document.getElementById("baseCustom").style.display = e.target.value === "custom" ? "inline-block" : "none";
  saveBase();
  if (currentEndpoint) updateUrlPreview();
});
document.getElementById("baseCustom").addEventListener("input", () => { saveBase(); if (currentEndpoint) updateUrlPreview(); });

loadState();
renderEndpointGroups();
renderSessions();
// open the Auth group by default
document.querySelector('.group[data-group="Auth"]')?.classList.add("open");
