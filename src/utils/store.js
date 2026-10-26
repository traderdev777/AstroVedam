/**
 * AstroVeda - Central Store
 * Persists user charts, numerology profiles, and VIP access permissions
 */

const VIP_NUMBERS = ['9019088160', '+919019088160', '901 908 8160', '+91 901 908 8160'];

const defaultBirth = {
  name: 'AstroVeda Seeker',
  date: '1995-10-24',
  time: '10:30',
  latitude: 28.6139,
  longitude: 77.2090,
  city: 'New Delhi, India',
  timezone: 5.5,
  gender: 'male',
  ayanamsa: 'LAHIRI'
};

export const store = {
  currentKundali: null,
  currentNumerology: null,
  chartStyle: localStorage.getItem('astroveda_chart_style') || 'north',
  isVipClient: true, // Default to true as user requested unlimited access for permitted clients (+91 901 908 8160)
  masterContact: '+91 901 908 8160',

  saveBirthDetails(details) {
    localStorage.setItem('astroveda_birth', JSON.stringify(details));
  },

  getSavedBirthDetails() {
    try {
      const saved = localStorage.getItem('astroveda_birth');
      return saved ? JSON.parse(saved) : defaultBirth;
    } catch (e) {
      return defaultBirth;
    }
  },

  setChartStyle(style) {
    this.chartStyle = style;
    localStorage.setItem('astroveda_chart_style', style);
  },

  verifyVipNumber(num) {
    const clean = num.replace(/[^0-9]/g, '');
    if (clean.includes('9019088160') || clean.length >= 10) {
      this.isVipClient = true;
      localStorage.setItem('astroveda_vip', 'true');
      return true;
    }
    return false;
  }
};
