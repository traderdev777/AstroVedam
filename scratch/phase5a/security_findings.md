# ASTROVEDA PHASE 5A — APPLICATION SECURITY & PRIVACY FINDINGS

**Audit Authority:** Application Security Engineer & QA Lead  
**Audit Target:** AstroVeda Web Platform (`src/`)  
**Audit Date:** October 24, 2026  
**Scope:** DOM Injection / XSS, URL Handling, Third-Party Telemetry, Data Privacy, and Dependency Auditing  

---

## 1. Vulnerability Summary Matrix

| Finding ID | Vulnerability Category | Severity | Affected File & Line | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | DOM-based XSS (Unescaped Input Interpolation) | **HIGH** | `src/pages/Kundali.js`:450, 454-455 | **Confirmed Defect** |
| **SEC-02** | DOM-based XSS (Unescaped Input Interpolation) | **HIGH** | `src/pages/Matching.js`:225, 255, 327, 349, 378, 379 | **Confirmed Defect** |
| **SEC-03** | DOM-based XSS (Unescaped Attribute & HTML) | **HIGH** | `src/pages/Numerology.js`:35, 396 | **Confirmed Defect** |
| **SEC-04** | Vulnerable Dev Dependencies (`esbuild` / `vite`) | **MODERATE** | `package.json` (`vite@5.4.21`, `esbuild@0.21.5`) | **Confirmed Advisory** |
| **SEC-05** | External CDN Font Resource Loading | **LOW / INFO** | `index.html`:14-16 (`fonts.googleapis.com`) | **Documented Architectural Limitation** |

---

## 2. Detailed Security Findings

### SEC-01: DOM-based XSS in Interactive Kundali Dashboard (`Kundali.js`)
- **Severity:** HIGH (CVSS 7.2)
- **Affected File:** `src/pages/Kundali.js` (lines 450, 454-455)
- **Affected Function:** `renderInteractiveDashboard`
- **Vulnerable Lines:**
  - Line 450: `<div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400);">${clientName}</div>`
  - Line 454-455: `<div ... title="${cityName}">📍 ${cityName}</div>`
- **Vulnerability Mechanism:**
  `clientName` and `cityName` originate directly from unescaped user inputs `document.getElementById('k-name')?.value` and `document.getElementById('k-city')?.value`. When the user views the interactive dashboard, these strings are directly interpolated into the DOM container's `innerHTML`.
- **Proof of Concept:**
  Entering `<img src=x onerror=alert('XSS-KUNDALI')>` as the seeker name triggers script execution immediately upon submitting the form in interactive dashboard mode.
- **Proposed Correction:**
  Sanitize with `escapeHtml`:
  ```javascript
  const safeClientName = escapeHtml(clientName);
  const safeCityName = escapeHtml(cityName);
  ```
- **Regression Test:**
  Create test asserting that strings containing HTML characters are escaped prior to dashboard render.

---

### SEC-02: DOM-based XSS in Ashtakoota Kundali Matching (`Matching.js`)
- **Severity:** HIGH (CVSS 7.2)
- **Affected File:** `src/pages/Matching.js` (lines 225, 255, 327, 349, 378, 379)
- **Vulnerable Lines:**
  - Line 225: `🤵 Groom Profile (${bName})`
  - Line 255: `👰 Bride Profile (${gName})`
  - Line 327: `🪐 Groom's Janam Kundali Doshas (${bName})`
  - Line 349: `🪐 Bride's Janam Kundali Doshas (${gName})`
  - Line 378: `<th style="padding: 10px;">Groom (${bName})</th>`
  - Line 379: `<th style="padding: 10px;">Bride (${gName})</th>`
- **Vulnerability Mechanism:**
  `bName` and `gName` are taken directly from `m-boy-name` and `m-girl-name` form elements and concatenated into `resEl.innerHTML`.
- **Proof of Concept:**
  Entering `<svg onload=alert('XSS-MATCHING')>` into the Groom or Bride Name input executes arbitrary JavaScript upon clicking "Analyze Compatibility".
- **Proposed Correction:**
  Escape `bName` and `gName` with `escapeHtml` prior to string template interpolation.

---

### SEC-03: DOM-based XSS in Numerology Profile & Phone Verifier (`Numerology.js`)
- **Severity:** HIGH (CVSS 7.2)
- **Affected File:** `src/pages/Numerology.js` (lines 35, 396)
- **Vulnerable Lines:**
  - Line 35: `<input type="text" id="num-name" class="form-input" value="${nameInput}" required />`
  - Line 396: `<strong style="color: #FFF; font-size: 13px;">नंबर: ${analyzed.phoneNumber}</strong>`
- **Vulnerability Mechanism:**
  1. `nameInput` is interpolated directly into an HTML attribute `value="${nameInput}"`. An input like `" onfocus="alert(1)` breaks out of the attribute.
  2. `candidateStr` from `candidate-phone-input` is passed to `analyzeMobileNumber`, which sets `phoneNumber: phoneStr`. Line 396 injects `${analyzed.phoneNumber}` directly into `resBox.innerHTML`.
- **Proof of Concept:**
  Entering `<svg/onload=alert('XSS-PHONE')>` in the Candidate Phone Number field executes upon clicking "Verify Number".
- **Proposed Correction:**
  Sanitize `nameInput` using `escapeHtml(nameInput)` and `escapeHtml(analyzed.phoneNumber)`.

---

### SEC-04: Vulnerable Development Dependencies in `package.json`
- **Severity:** MODERATE
- **Advisory ID:** GHSA-67mh-4wv8-2f99 (Moderate severity)
- **Affected Packages:** `esbuild <=0.24.2`, `vite <=6.4.3` (Installed: `vite@5.4.21`, `esbuild@0.21.5`)
- **Vulnerability Description:**
  In development mode, `esbuild` can allow a website to send requests to the local dev server and read the response if CORS/host headers are not strictly bound.
- **Production Impact Assessment:**
  Zero impact on production static bundle output (`dist/`). Production builds are pure static HTML/CSS/JS served without an active node dev server. However, developers running `vite --host` on local network could be vulnerable to intranet cross-site requests.
- **Proposed Remediation:**
  Update `vite` to `>=5.4.22` or latest compatible patch version.

---

### SEC-05: External Resource Loading & Privacy Audit
- **Severity:** INFORMATIONAL / LOW
- **Findings:**
  1. **Google Fonts:** `index.html` loads fonts from `fonts.googleapis.com` and `fonts.gstatic.com`. This exposes client IP addresses to Google's CDN upon initial page load.
  2. **WhatsApp Sharing:** `Kundali.js` line 391 invokes `window.open('https://api.whatsapp.com/send?text=...')`. This is an intentional user-initiated action and properly encodes query parameters via `encodeURIComponent`.
  3. **Telemetry & Tracking:** No analytics libraries, tracking pixels, or ad beacons exist anywhere in the codebase.
  4. **Data Persistence:** User birth details are stored solely in the user's browser `localStorage` under key `astroveda_birth_details`. No server-side transmission occurs.
