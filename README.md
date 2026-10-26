# 🕉️ AstroVeda (AstroVedam)

> **Sanatan Hindu Vedic Astrology, Numerology & Vaastu Shastra Web Platform**  
> *Accurate Astronomical Ephemeris • Interactive North & South Indian Charts • High-Precision Dasha Calculations • 9-Page Janampatrika PDF Export*

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-gold?style=for-the-badge&logo=github)](https://traderdev777.github.io/AstroVedam/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🌟 Live Application
Experience the live application hosted on GitHub Pages:  
👉 **[https://traderdev777.github.io/AstroVedam/](https://traderdev777.github.io/AstroVedam/)**

---

## ✨ Features & Capabilities

### 🪐 1. Janam Kundali & Chart Engine
- **Astronomical Precision**: Geocentric planetary longitude calculations, apparent planetary velocity, retrograde detection, and true Lahiri Ayanamsha (Chitra Paksha).
- **Dual Visual Charts**: Interactive vector SVG rendering for both **North Indian (Diamond)** and **South Indian (Box)** chart styles.
- **Divisional Charts**: Accurate calculation of Rashi (D1), Navamsha (D9), and planetary dignities (Exalted, Moolatrikona, Own Sign, Debilitated).
- **Planetary Positions Table**: Exact degrees, nakshatras, padas, karakas, speeds, and combustion statuses.

### ⏳ 2. Vimshottari Dasha Engine
- Complete hierarchical Dasha timeline calculation (**Mahadasha, Antardasha, and Pratyantardasha**) based on birth nakshatra and moon longitude.
- Visual timeline with current running dasha indicator, elapsed percentages, and transition dates.

### 📅 3. Real-Time Vedic Panchang
- Accurate computation of the 5 limbs of time (**Tithi, Nakshatra, Yoga, Karana, and Vaara**).
- Daily auspicious and inauspicious timings: **Rahu Kalam, Yamaganda, Gulika Kalam, Abhijit Muhurta, Brahma Muhurta, Sunrise, Sunset, and Moonrise**.

### ⏰ 4. Shubh Muhurta & Choghadiya
- Day and Night **Choghadiya** (Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg).
- Auspicious muhurta windows for major life events: Griha Pravesh, Vivah (Marriage), Vahan Kharid (Vehicle), and Business inaugurations.

### 💑 5. Kundali Matching (Ashtakoot Milan)
- **36 Guna Milan System**: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), and Nadi (8).
- **Mangal Dosha Analysis**: Comprehensive Kuja Dosha evaluation for both bride and groom, including classical cancellation exceptions.

### 🔢 6. Vedic & Chaldean Numerology
- **Core Numbers**: Mulank (Driver/Psychic Number) and Bhagyank (Destiny/Life Path Number).
- **Name Numerology**: Chaldean system name vibrations and compatibility analysis.
- **Loshu Grid**: 3x3 Magic Square representation displaying strengths, missing numbers, and planes of will/thought/action.

### 🧭 7. Vaastu Shastra Energy Engine
- Directional 16-zone analysis for residential and commercial spaces.
- Room-by-room guidance, elemental balance (Panchamahabhutas), and non-invasive corrective remedies.

### 🧙‍♂️ 8. AstroGuru Conversational AI
- Embedded intelligent Vedic astrology advisor with context-aware insights based on the active generated chart.
- Instant explanations of planetary yogas, Sade Sati impacts, gemstone recommendations, and lifestyle remedies.

### 📄 9. Comprehensive Janampatrika PDF Export
- Generates a rich, multi-page astrological dossier including personal details, planetary tables, charts, dasha analysis, and predictions ready for offline printing or sharing.

### 🌐 10. Multilingual & Theme Support
- Available in **English**, **हिन्दी (Hindi)**, **ಕನ್ನಡ (Kannada)**, and **తెలుగు (Telugu)**.
- Cosmic dark theme and light theme support with smooth micro-animations.

---

## 🛠️ Technology Stack

- **Core**: Vanilla Modern JavaScript (ES Modules), HTML5 Semantic Elements.
- **Styling**: Vanilla CSS Design System with CSS variables, cosmic gradients, and glassmorphism.
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast bundling.
- **PDF Generation**: `html2pdf.js` for vectorized client-side PDF export.
- **Test Suite**: Comprehensive automated regression test suite (1,800+ test assertions covering astronomical algorithms, floating-point boundaries, and chart rendering).

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (version 9+ recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/traderdev777/AstroVedam.git
   cd AstroVedam
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and visit `http://localhost:5173`.

4. **Run the regression test suite:**
   ```bash
   npm test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
   The production build artifacts will be generated in the `dist/` directory.

---

## 📦 GitHub Pages Deployment

This repository uses automated GitHub Actions to build and deploy to GitHub Pages on every push to the `main` branch. 
The static build is also maintained on the `gh-pages` branch for direct static hosting.

---

## 📜 Tradition & Credits
Rooted in timeless **Sanatan Hindu Vedic Traditions** (Brihat Parashara Hora Shastra, Jaimini Sutras, Surya Siddhanta) combined with modern high-performance web engineering.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
