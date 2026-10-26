# ASTROVEDA PHASE 5A — PERFORMANCE & DEPLOYMENT AUDIT FINDINGS

**Audit Authority:** Principal Systems Architect & Performance Lead  
**Audit Target:** AstroVeda Production Build & Runtime Performance  
**Audit Date:** October 24, 2026  

---

## 1. Production Bundle Measurement & Chunk Analysis

A production build executed with `npm run build` (`vite build`) produced the following asset outputs:

| Asset Name | Type | Raw Size | Gzip Size | Status / Warning |
| :--- | :--- | :--- | :--- | :--- |
| `dist/index.html` | HTML Entry | 7.97 kB | 1.92 kB | Optimal |
| `dist/assets/index-CFPN4POS.css` | Combined CSS | 36.17 kB | 7.89 kB | Highly Compact |
| `dist/assets/purify.es-CAi2OJFm.js` | Vendor (DOMPurify) | 30.47 kB | 11.73 kB | Separated Chunk |
| `dist/assets/index.es-DP25s6hN.js` | Vendor (PDF/Canvas) | 151.03 kB | 51.65 kB | Separated Chunk |
| `dist/assets/index-MTg-ZhEq.js` | Main Application Bundle | **1,181.72 kB** | **377.76 kB** | **Exceeds 500 kB Warning Limit** |

### Vite Warning Log:
```
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

---

## 2. Root Cause Analysis of Bundle Monolith

Inspection of source files and dependency graphs reveals that `src/main.js` performs static top-level imports of all 9 route pages:
```javascript
import { renderHomePage } from "./pages/Home.js";
import { renderKundaliPage } from "./pages/Kundali.js";
import { renderDashaPage } from "./pages/Dasha.js";
import { renderPanchangPage } from "./pages/Panchang.js";
import { renderMuhurtaPage } from "./pages/Muhurta.js";
import { renderMatchingPage } from "./pages/Matching.js";
import { renderNumerologyPage } from "./pages/Numerology.js";
import { renderVaastuPage } from "./pages/Vaastu.js";
import { renderAstroGuruPage } from "./pages/AstroGuru.js";
```

Each page in turn statically pulls in massive domain dictionaries and engines:
1. **Multilingual Prediction Dictionaries:** `src/i18n/predictionTranslations.js` accounts for **295.7 kB** of raw JavaScript objects (complete life forecasts across Career, Wealth, Marriage, Health, and Remedies in 5 languages).
2. **Master Report Markup:** `src/components/reports/FullPatrikaReport.js` accounts for **76.0 kB**.
3. **Core Astrological Engine:** `src/engines/astrology/predictions.js` (62.3 kB) and `ephemeris.js` (54.7 kB).
4. **Conversational Guide:** `src/engines/astroguru/advisor.js` (52.4 kB) and `AstroGuru.js` (44.2 kB).
5. **Numerology & Location DB:** `calculator.js` (49.4 kB) and `indianPlaces.js` (28.6 kB).

Because of static imports, a user visiting the landing page (`/`) is forced to download all 1.18 MB of code, even if they never generate a 9-page Janampatrika or interact with AstroGuru.

---

## 3. Safe Code-Splitting Opportunities

### Opportunity 1: Route-Based Lazy Loading via Dynamic `import()`
- **Action:** In `src/main.js`, convert synchronous page renderers into dynamic imports:
  ```javascript
  switch (pageId) {
    case "home":
      const { renderHomePage } = await import("./pages/Home.js");
      renderHomePage(pageContentEl, navigateTo);
      break;
    case "kundali":
      const { renderKundaliPage } = await import("./pages/Kundali.js");
      renderKundaliPage(pageContentEl);
      break;
    // ...
  }
  ```
- **Projected Impact:** Reduces initial landing bundle from 1.18 MB to **~120 kB** (gzip ~35 kB), achieving sub-second initial load on 3G/4G connections.

### Opportunity 2: Report-Only Splitting for PDF Generation
- **Action:** `FullPatrikaReport.js`, `html2canvas`, and `jspdf` should be loaded only when the user requests report generation or triggers PDF export.
- **Projected Impact:** Defers ~480 kB of minified JS from the main Kundali calculation page until the user explicitly requests full report generation.

### Opportunity 3: Language Dictionary Chunking
- **Action:** Partition `predictionTranslations.js` into per-language chunks (`en.predictions.js`, `hi.predictions.js`, etc.) loaded on-demand.
- **Risk Assessment:** Requires care to ensure offline functionality is not broken if assets fail to fetch without internet.

---

## 4. Mobile & Low-Memory Device Audit

1. **Retina Canvas Rasterization:**
   `pdfDownloader.js` iterates through 9 pages, capturing each page at `scale: 2.0` (300 DPI equivalent) via `html2canvas`.
   - On memory-constrained mobile devices (e.g. mobile Safari / budget Android), generating 9 separate 2x canvases can allocate > 60 MB of transient GPU buffer memory.
   - While the current loop processes pages sequentially, the canvas elements should explicitly be zeroed after conversion to JPEG (`canvas.width = 0; canvas.height = 0;`) to trigger immediate browser garbage collection.
2. **Native Print Fallback:**
   The existing codebase includes an automated fallback to `window.print()` if canvas rasterization throws an exception, providing a proven safety net for mobile devices.

---

## 5. Verification across 5 Supported Languages
- Verified that translations for `en`, `hi`, `kn`, `mr`, and `te` execute without missing key lookups or undefined property errors in all 15 regression suites.
