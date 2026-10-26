# ASTROVEDAM CTO DIRECTIVE — PHASE 4F.2 REPORT
## Venus & Mercury Precision Upgrade — Controlled Implementation

**Document ID:** `AV-UPGRADE-4F2-001`  
**Date:** October 23, 2026  
**Role:** Senior Astronomical Software Architect and QA Lead  
**Target Module:** Ephemeris Engine (`src/engines/astrology/ephemeris.js`)  
**Scope:** Venus & Mercury Geocentric Apparent Longitude Precision  
**Status:** COMPLETE — 100% BENCHMARK PASS FOR MERCURY & VENUS (130/135 Overall Benchmark Pass Rate)

---

## Executive Summary

In accordance with CTO Directive Phase 4F.2, the geocentric apparent longitude calculation models for **Venus and Mercury** were upgraded from truncated polynomial approximations to the Jean Meeus (*Astronomical Algorithms*, 2nd Edition, 1998, Chapter 31) analytical theory referred to the mean equinox and ecliptic of date, incorporating exact iterative solution of Kepler's equation, light-time retardation, and IAU 1980 principal nutation in longitude.

### Key Upgrade Highlights

| Metric | Phase 4F.1 Baseline | Phase 4F.2 Upgraded | Net Change | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Astronomical Benchmark** | 119 / 135 (88.15%) | **130 / 135 (96.30%)** | **+11 Passed (+8.15%)** | 🌟 Highest in Engine History |
| **Mercury Longitude (tol: 2.0')** | 2 / 9 (22.2%) | **9 / 9 (100.0%)** | **+7 Passed (+77.8%)** | Max error: **0.86'** (was 5.25') |
| **Venus Longitude (tol: 2.0')** | 5 / 9 (55.6%) | **9 / 9 (100.0%)** | **+4 Passed (+44.4%)** | Max error: **0.42'** (was 19.92') |
| **Master Regression Suite** | 1,146 / 1,146 (100%) | **1,218 / 1,218 (100%)** | **+72 New Assertions** | Zero regressions across 11 suites |
| **Production Vite Build** | Clean (5.07s) | Clean (5.16s) | Preserved | 424 modules transformed |
| **Independent JPL API Validation** | 10 Hist / 12 Audit | **18 Live Checked & Verified** | +18 Raw JSONs Archived | 100% pass across 1920–2080 |

---

## 1. Baseline Reproduction

Prior to introducing any production source code modifications, the existing repository state was independently reproduced and archived in `scratch/phase4f2/`.

### 1.1 Pre-Upgrade Baseline Results

- **Astronomical Benchmark:** `node scratch/run_astronomical_benchmark.js`  
  - Total Checks: 135 | Passed: 119 (88.15%) | Failed: 16 (11.85%)  
  - Log archived: `scratch/phase4f2/baseline_benchmark_output.txt`
- **Master Regression Suite:** `npm test` (`node tests/run_all_tests.js`)  
  - Total Assertions: 1,146 | Passed: 1,146 (100.0%) | Failed: 0  
  - Log archived: `scratch/phase4f2/baseline_npm_test_output.txt`
- **Production Vite Build:** `npm run build` (`vite build`)  
  - Result: 424 modules transformed cleanly in 5.07s  
  - Log archived: `scratch/phase4f2/baseline_build_output.txt`

### 1.2 Baseline Failures in Scope for Phase 4F.2

Of the 16 baseline benchmark failures, exactly **11 failures** resided in Mercury and Venus:
- **Mercury (7 failures):** REF-01 ($+5.24'$), REF-02 ($+2.15'$), REF-03 ($+5.25'$), REF-04 ($-4.04'$), REF-06 ($-4.38'$), REF-07 ($-5.17'$), REF-08 ($-2.45'$).
- **Venus (4 failures):** REF-05 ($-3.89'$), REF-06 ($+5.28'$), REF-07 ($-7.16'$), REF-08 ($+19.92'$).

---

## 2. Source Files Changed & Implementation Summary

### 2.1 Production Source File: `src/engines/astrology/ephemeris.js`

1. **Mercury Ephemeris Upgrade:**
   - **Root Cause of Defect:** The legacy `mercuryLongitude` used a truncated 3-term series for the equation of center:
     $$C = \left(2e - \frac{e^3}{4}\right)\sin M + \frac{5}{4}e^2 \sin 2M + \frac{13}{12}e^3 \sin 3M$$
     Because Mercury has high eccentricity ($e \approx 0.20563$), truncating higher powers of $e$ caused truncation errors up to $\pm 7.5'$. Furthermore, the secular rate of mean longitude $L$ omitted general precession in longitude ($1.3969^\circ / \text{century}$), and light-time retardation and nutation were missing.
   - **New Implementation (`getMercuryHelio` and `mercuryLongitude`):**
     - Adopted Jean Meeus Table 31.A equinox-of-date orbital elements:
       $$\begin{aligned}
       a &= 0.38709831 \text{ AU} \\
       e &= 0.20563175 + 0.000020407 T - 0.0000000283 T^2 \\
       I &= (7.004986^\circ + 0.0018215^\circ T - 0.0000181^\circ T^2) \\
       L &= 252.250906^\circ + 149474.0722491^\circ T + 0.0003035^\circ T^2 \\
       \varpi &= 77.456119^\circ + 1.5564776^\circ T + 0.00029544^\circ T^2 \\
       \Omega &= (48.330893^\circ + 1.1861883^\circ T + 0.00017542^\circ T^2)
       \end{aligned}$$
     - Replaced series expansion with the exact Newton-Raphson Kepler solver `solveKepler(M, e)`.
     - Calculated true anomaly $v = 2 \arctan\left(\sqrt{\frac{1+e}{1-e}}\tan(E/2)\right)$ and heliocentric radius $r = a(1 - e\cos E)$.
     - Implemented single-iteration light-time retardation:
       $$d_0 = \|\vec{r}_{\text{merc}} - \vec{r}_{\text{earth}}\|, \quad \tau = 0.0057755183 \times d_0 \text{ days}$$
       re-evaluating heliocentric vector at retarded time $T_{\tau} = \text{julianCenturies}(jd - \tau)$.
     - Added IAU 1980 principal nutation in longitude `nutationInLongitude(T)`.

2. **Venus Ephemeris Upgrade:**
   - **Root Cause of Defect:** Legacy `venusLongitude` used mean longitude and node rates referred to the fixed equinox of J2000.0 rather than the equinox of date, causing a precession discrepancy of $\sim 1.397^\circ \times T$. At inferior conjunction (REF-08, 2010), when Venus was only $0.28$ AU from Earth, this rate mismatch amplified to $+19.92'$.
   - **New Implementation (`getVenusHelio` and `venusLongitude`):**
     - Adopted Jean Meeus Table 31.A equinox-of-date orbital elements:
       $$\begin{aligned}
       a &= 0.72332982 \text{ AU} \\
       e &= 0.00677192 - 0.000047765 T + 0.0000000981 T^2 \\
       I &= (3.394662^\circ + 0.0010037^\circ T - 0.00000088^\circ T^2) \\
       L &= 181.979801^\circ + 58519.2130302^\circ T + 0.00031014^\circ T^2 \\
       \varpi &= 131.563703^\circ + 1.4022288^\circ T - 0.00107618^\circ T^2 \\
       \Omega &= (76.67992^\circ + 0.9011206^\circ T + 0.00040618^\circ T^2)
       \end{aligned}$$
     - Solved Kepler's equation iteratively with `solveKepler`.
     - Added light-time retardation $\tau = 0.0057755183 \times d_0$ and nutation in longitude.

### 2.2 Test Suite Updates

1. **`tests/regression/retrograde_verification.test.js`:**
   - Updated line 236 regression guard baseline from Phase 4B.2 value ($352.2216^\circ$) to Phase 4F.2 upgraded precision value ($352.1472^\circ$), maintaining the strict tolerance of $< 0.01^\circ$ ($0.6'$).
2. **`tests/regression/phase4f2_precision.test.js`:**
   - Created new comprehensive 72-assertion test suite validating Mercury and Venus across canonical cases, historical JPL Horizons data, motion invariance, coordinate continuity, and non-finite input guards.
3. **`tests/run_all_tests.js`:**
   - Registered `runPhase4F2PrecisionTests()` into the master test harness.

---

## 3. Reference Provenance and Cryptographic Checksums

In accordance with Section 2 of the CTO Directive, raw reference responses from the official NASA JPL Horizons API were queried, verified, and archived with SHA-256 checksums in `scratch/phase4f2/raw_horizons_responses/`.

### 3.1 Independent Validation Manifest (`scratch/phase4f2/validation_manifest.json`)

All queries were executed with the following parameters:
- **API Endpoint:** `https://ssd.jpl.nasa.gov/api/horizons.api`
- **EPHEM_TYPE:** `'OBSERVER'`
- **CENTER:** `'500@399'` (Geocentric observer at Earth center)
- **QUANTITIES:** `'31'` (Apparent geocentric ecliptic longitude and latitude)
- **Reference Plane / Equinox:** IAU 1976/1980 ecliptic and equinox of date
- **Time Scale:** UTC (post-1962), UT1 (pre-1962)

| Case ID | Scenario / Date | Target | Target Code | JPL ObsEcLon | Raw Response File | SHA-256 Checksum | Provenance |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **HIST-01** | Early 20th Century (1920-05-15) | **Mercury** | 199 | 41.1934° | `HIST-01_Mercury_horizons_raw.json` | `88ac24cead41195dbdcf68a1215b497cb19a2786a4ea843472fa998a4da4122c` | **VERIFIED** |
| **HIST-01** | Early 20th Century (1920-05-15) | **Venus** | 299 | 40.3771° | `HIST-01_Venus_horizons_raw.json` | `58ab9f7d442acd8c4c34a17088b90623d3a04294d12fa1dbb499119614486588` | **VERIFIED** |
| **HIST-02** | Mid 20th Century (1950-01-01) | **Mercury** | 199 | 299.4473° | `HIST-02_Mercury_horizons_raw.json` | `45d7f003e3933ea747d515a8bfbfe2b4506c04f997cb24fe567b55f1f7253509` | **VERIFIED** |
| **HIST-02** | Mid 20th Century (1950-01-01) | **Venus** | 299 | 316.9795° | `HIST-02_Venus_horizons_raw.json` | `870442ebee52be67d2e07172fe49e755257e849479b3cb602fc5f037dd787aa1` | **VERIFIED** |
| **HIST-03** | Late 20th Century (1975-07-01) | **Mercury** | 199 | 77.7650° | `HIST-03_Mercury_horizons_raw.json` | `3c01f79cf7a2ed00445ec64027419f44ea5954a1be2e68cfb99db1c5f34be558` | **VERIFIED** |
| **HIST-03** | Late 20th Century (1975-07-01) | **Venus** | 299 | 143.3101° | `HIST-03_Venus_horizons_raw.json` | `0773e6f9d1d2fd8959d28fa16fe327cfbc56f082e6ef2256df602a8eb3309a13` | **VERIFIED** |
| **HIST-04** | Mid 21st Century (2050-01-01) | **Mercury** | 199 | 270.0595° | `HIST-04_Mercury_horizons_raw.json` | `cee3012b8b65e0de29c4ba54be2f5d21469085ec3cf060bc00da9895fe8ebca6` | **VERIFIED** |
| **HIST-04** | Mid 21st Century (2050-01-01) | **Venus** | 299 | 281.2480° | `HIST-04_Venus_horizons_raw.json` | `920b1b91fdcbd5ec5d99216067b57bc4e976db84fa4f6ea317cff1784cae6973` | **VERIFIED** |
| **HIST-05** | Late 21st Century (2080-10-15) | **Mercury** | 199 | 197.6262° | `HIST-05_Mercury_horizons_raw.json` | `daa6ad0dd46c440fe3a3db6fbf5761619623e1c6b541907cb5cf39f28df6da8d` | **VERIFIED** |
| **HIST-05** | Late 21st Century (2080-10-15) | **Venus** | 299 | 240.5515° | `HIST-05_Venus_horizons_raw.json` | `3faaf5515cd2dc9c8b05615d18d4078a6358c56fa972d3f0a402324749f7ba3b` | **VERIFIED** |
| **MERC-STAT** | Mercury Station (2023-04-21) | **Mercury** | 199 | 45.6203° | `MERC-STAT_Mercury_horizons_raw.json` | `9eddb1ecefe011c255ec03df6a9b40742d45c5c7d039869502b489a8a7ebdfc4` | **VERIFIED** |
| **MERC-STAT** | Mercury Station (2023-04-21) | **Venus** | 299 | 71.9088° | `MERC-STAT_Venus_horizons_raw.json` | `394f10cc4f1592e8a609d9365e1b6f68c37d0c3eb1a47395427aa89a19c5c996` | **VERIFIED** |
| **VEN-STAT** | Venus Station (2023-07-22) | **Mercury** | 199 | 140.3032° | `VEN-STAT_Mercury_horizons_raw.json` | `ce9a79da8cff00f7e4dd38b0ddbb19942a98f16801967208d13e31ff734ea078` | **VERIFIED** |
| **VEN-STAT** | Venus Station (2023-07-22) | **Venus** | 299 | 148.5971° | `VEN-STAT_Venus_horizons_raw.json` | `be3ad2d9ed23a476db867b34e5a95267a14e9f90cf98358dbb3ba486241270b2` | **VERIFIED** |
| **MERC-WRAP**| Mercury Ingress (2023-03-31) | **Mercury** | 199 | 24.3784° | `MERC-WRAP_Mercury_horizons_raw.json` | `83c9663c28de2790e66d34b7f83617be3fe2978a2e5d95646f404caeaec306b3` | **VERIFIED** |
| **MERC-WRAP**| Mercury Ingress (2023-03-31) | **Venus** | 299 | 47.4161° | `MERC-WRAP_Venus_horizons_raw.json` | `00fe659f5c570aaee84f50f24300bfce30a3863488ee24495ae409b3b8908323` | **VERIFIED** |
| **VEN-INGRESS**| Venus Ingress (2023-04-06) | **Mercury** | 199 | 34.4266° | `VEN-INGRESS_Mercury_horizons_raw.json` | `754985ec91bf9c7c22998632fe244a0bdf5177a544b6c31bfad7b9a5ae31b3e7` | **VERIFIED** |
| **VEN-INGRESS**| Venus Ingress (2023-04-06) | **Venus** | 299 | 54.4980° | `VEN-INGRESS_Venus_horizons_raw.json` | `388874464accf98bb2cba72db9ec172aa4a6b6f0e340dbcbdbb6f1fcb78d22bb` | **VERIFIED** |

---

## 4. Before / After Per-Planet Error Tables

### 4.1 Mercury Longitude Comparison (Benchmark Fixture Cases, Tolerance = 2.0')

| Case ID | Scenario / Date | JPL Ref Trop | JPL Ref Sid | Baseline Delta | Baseline Status | Upgraded Delta | Upgraded Status | Error Improvement |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **REF-01** | Indian Birth (1999) | 352.1342° | 328.2919° | $+5.24'$ | ❌ FAIL | **$+0.78'$** | ✅ **PASS** | **$+4.46'$** |
| **REF-02** | Sign Boundary (2000)| 0.7254° | 336.8685° | $+2.15'$ | ❌ FAIL | **$+0.33'$** | ✅ **PASS** | **$+1.82'$** |
| **REF-03** | Nakshatra Boundary (1999)| 352.1514° | 328.3091° | $+5.25'$ | ❌ FAIL | **$+0.77'$** | ✅ **PASS** | **$+4.48'$** |
| **REF-04** | Leap Day (2000) | 342.5065° | 318.6512° | $-4.04'$ | ❌ FAIL | **$+0.86'$** | ✅ **PASS** | **$+3.18'$** |
| **REF-05** | Fall Equinox (2020) | 203.3207° | 179.1785° | $-1.81'$ | ✅ PASS | **$+0.34'$** | ✅ **PASS** | **$+1.47'$** |
| **REF-06** | Solstice DST (2023) | 78.7140° | 54.5335° | $-4.38'$ | ❌ FAIL | **$+0.09'$** | ✅ **PASS** | **$+4.29'$** |
| **REF-07** | High Latitude (2022)| 211.9947° | 187.8231° | $-5.17'$ | ❌ FAIL | **$+0.28'$** | ✅ **PASS** | **$+4.89'$** |
| **REF-08** | Southern Hem. (2010)| 241.9024° | 217.8979° | $-2.45'$ | ❌ FAIL | **$+0.29'$** | ✅ **PASS** | **$+2.16'$** |
| **REF-09** | Y2K Midnight (2000) | 271.2240° | 247.3710° | $+0.47'$ | ✅ PASS | **$+0.47'$** | ✅ **PASS** | $+0.00'$ |
| **Summary** | **9 Cases** | — | — | **2/9 pass (22%)** | — | **9/9 pass (100%)** | — | **Mean err: 0.47'** |

### 4.2 Venus Longitude Comparison (Benchmark Fixture Cases, Tolerance = 2.0')

| Case ID | Scenario / Date | JPL Ref Trop | JPL Ref Sid | Baseline Delta | Baseline Status | Upgraded Delta | Upgraded Status | Error Improvement |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **REF-01** | Indian Birth (1999) | 41.8381° | 17.9958° | $+0.45'$ | ✅ PASS | **$+0.23'$** | ✅ **PASS** | $+0.22'$ |
| **REF-02** | Sign Boundary (2000)| 8.2819° | 344.4250° | $+0.13'$ | ✅ PASS | **$+0.23'$** | ✅ **PASS** | $-0.10'$ |
| **REF-03** | Nakshatra Boundary (1999)| 41.7965° | 17.9542° | $+0.45'$ | ✅ PASS | **$+0.23'$** | ✅ **PASS** | $+0.22'$ |
| **REF-04** | Leap Day (2000) | 313.9566° | 290.1013° | $+0.29'$ | ✅ PASS | **$+0.34'$** | ✅ **PASS** | $-0.05'$ |
| **REF-05** | Fall Equinox (2020) | 137.2908° | 113.1486° | $-3.89'$ | ❌ FAIL | **$+0.29'$** | ✅ **PASS** | **$+3.60'$** |
| **REF-06** | Solstice DST (2023) | 134.0986° | 109.9181° | $+5.28'$ | ❌ FAIL | **$-0.01'$** | ✅ **PASS** | **$+5.27'$** |
| **REF-07** | High Latitude (2022)| 219.6147° | 195.4431° | $-7.16'$ | ❌ FAIL | **$+0.29'$** | ✅ **PASS** | **$+6.87'$** |
| **REF-08** | Southern Hem. (2010)| 209.1762° | 185.1717° | $+19.92'$ | ❌ FAIL | **$+0.03'$** | ✅ **PASS** | **$+19.89'$** |
| **REF-09** | Y2K Midnight (2000) | 241.0487° | 217.1957° | $+0.42'$ | ✅ PASS | **$+0.42'$** | ✅ **PASS** | $+0.00'$ |
| **Summary** | **9 Cases** | — | — | **5/9 pass (56%)** | — | **9/9 pass (100%)** | — | **Mean err: 0.23'** |

---

## 5. Full Astronomical Benchmark Results & Remaining Failures

### 5.1 Factor Breakdown across 135 Benchmark Comparisons

| Factor / Body | Total Checks | Passed | Failed | Tolerance | Max Measured \|Error\| | Pass Rate | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Ascendant (Lagna)** | 9 | 9 | 0 | 2.0' (0.0333°) | **0.0027'** | **100.0%** | Perfect |
| **Sun Longitude** | 9 | 9 | 0 | 1.0' (0.0167°) | **0.2440'** | **100.0%** | Perfect |
| **Sun Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Moon Longitude** | 9 | 8 | 1 | 2.0' (0.0333°) | **2.5696'** | **88.9%** | Deferred to Moon Phase |
| **Moon Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Mercury Longitude** | 9 | 9 | 0 | 2.0' (0.0333°) | **0.8600'** | **100.0%** | 🌟 Upgraded in 4F.2 |
| **Mercury Retrograde**| 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Venus Longitude** | 9 | 9 | 0 | 2.0' (0.0333°) | **0.4200'** | **100.0%** | 🌟 Upgraded in 4F.2 |
| **Venus Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Mars Longitude** | 9 | 6 | 3 | 1.0' (0.0167°) | **2.9701'** | **66.7%** | Deferred to Mars Phase |
| **Mars Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Jupiter Longitude** | 9 | 9 | 0 | 1.0' (0.0167°) | **0.8345'** | **100.0%** | Upgraded in 4F.1 |
| **Jupiter Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **Saturn Longitude** | 9 | 8 | 1 | 1.0' (0.0167°) | **1.2579'** | **88.9%** | Upgraded in 4F.1 |
| **Saturn Retrograde** | 9 | 9 | 0 | Boolean | N/A | **100.0%** | Perfect |
| **TOTALS** | **135** | **130** | **5** | — | — | **96.30%** | **Highest in Engine History** |

### 5.2 Complete Catalog of All 5 Remaining Benchmark Failures

| Case ID | Scenario / Date | Factor | Ref Sidereal | AV Sidereal | Delta (AV - Ref) | Tolerance | Excess Error | Target Remediation Phase |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **REF-01** | Normal Indian Birth (1999) | **Mars** | 197.7747° | 197.7312° | **-2.61'** | 1.0' | +1.61' | Phase 4F.3 (Mars Upgrade) |
| **REF-02** | Mesha Ingress (2000) | **Moon** | 114.9433° | 114.9005° | **-2.57'** | 2.0' | +0.57' | Phase 4F.4 (Moon ELP-2000 Upgrade) |
| **REF-03** | Retrograde Mars (1999) | **Mars** | 197.7789° | 197.7354° | **-2.61'** | 1.0' | +1.61' | Phase 4F.3 (Mars Upgrade) |
| **REF-05** | Fall Equinox (2020) | **Mars** | 2.9622° | 2.9127° | **-2.97'** | 1.0' | +1.97' | Phase 4F.3 (Mars Upgrade) |
| **REF-06** | Summer Solstice DST (2023) | **Saturn** | 313.0174° | 312.9964° | **-1.26'** | 1.0' | +0.26' | Documented 5-term truncation limit |

---

## 6. Regression and Build Output Summaries

### 6.1 Master Regression Test Execution (`npm test`)

```
===========================================================
🪐 ASTROVEDAM MASTER QA REGRESSION TEST SUITE
===========================================================
✅ PASS | Janampatrika 9-Page Report & Multilingual Integration | 98/98 passed
✅ PASS | North & South Indian Chart SVG Rendering           | 29/29 passed
✅ PASS | Astrology Baseline Contracts & Sade Sati Reference | 27/27 passed
✅ PASS | AstroGuru Conversational AI & Chart Awareness      | 45/45 passed
✅ PASS | Ascendant (Lagna) Astronomical Verification        | 42/42 passed
✅ PASS | Geocentric Planetary Longitude Verification (Phase 4B.2) | 112/112 passed
✅ PASS | Planetary Retrograde & Velocity Verification (Phase 4B.3) | 119/119 passed
✅ PASS | Sade Sati & Saturn Transit Dynamic Assessment (Phase 4C.2) | 477/477 passed
✅ PASS | Phase 4D Targeted Saturn Transit Presentation & Input Safety | 121/121 passed
✅ PASS | Targeted Jupiter & Saturn Precision Upgrade (Phase 4F.1) | 76/76 passed
✅ PASS | Targeted Venus & Mercury Precision Upgrade (Phase 4F.2) | 72/72 passed
-----------------------------------------------------------
TOTAL ASSERTIONS: 1218 | PASSED: 1218 | FAILED: 0 | DURATION: 0.28s
===========================================================
🌟 ALL REGRESSION TESTS PASSED CLEANLY (100% SUCCESS) 🌟
```

### 6.2 Production Vite Build Execution (`npm run build`)

```
vite v5.4.21 building for production...
✓ 424 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                        7.97 kB │ gzip:   1.92 kB
dist/assets/index-CFPN4POS.css        36.17 kB │ gzip:   7.89 kB
dist/assets/purify.es-CAi2OJFm.js     30.47 kB │ gzip:  11.73 kB
dist/assets/index.es-BtfYe5rT.js     151.03 kB │ gzip:  51.65 kB
dist/assets/index-4gra937f.js      1,173.50 kB │ gzip: 373.72 kB
✓ built in 5.16s
```

---

## 7. Known Limitations & Unverified Provenance

1. **Benchmark Baseline Fixtures (REF-01 to REF-09):**
   - The numerical values in `scratch/reference_cases.json` were validated against live JPL Horizons queries, and our calculations match them to $< 0.86'$.
   - However, the raw HTTP response payloads for the 9 original baseline cases were not archived to disk prior to Phase 4E. In accordance with the directive, their provenance is marked **UNVERIFIED**.
2. **Analytical Theory Truncation Bounds:**
   - The Meeus Table 31.A equinox-of-date model uses low-to-medium degree secular variations. For Mercury and Venus, it achieves accuracy within $0.86'$ across 1900–2100. Over multi-millennium timescales ($> 500$ years from J2000), higher-order planetary perturbations (e.g. from Jupiter and Earth) would introduce residuals of $2'$ to $5'$. For AstroVedam's target historical window (1900–2100), the model is strictly within tolerance.
3. **Remaining Mars Errors:**
   - Mars currently accounts for 3 of the 5 remaining benchmark failures (REF-01, REF-03, REF-05 with $\sim 2.6'$ to $3.0'$ errors against a $1.0'$ tolerance). Mars will be remediated in Phase 4F.3.

---

## 8. Final Recommendation

1. **Phase 4F.2 Milestone Complete:** Both Mercury and Venus geocentric apparent calculations now achieve 100% pass rates across all benchmark scenarios, station turning points, and historical epochs.
2. **Authorization to Proceed:** **APPROVE PROCEEDING TO PHASE 4F.3 (Mars Precision Upgrade)** to address the 3 remaining Mars longitude failures using the same validated equinox-of-date formulation.
