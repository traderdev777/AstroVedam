/**
 * AstroVeda - Universal Chart Renderer
 * Allows instantaneous switching between North Indian and South Indian representations
 */

import { renderNorthIndianChart } from './NorthIndianChart.js';
import { renderSouthIndianChart } from './SouthIndianChart.js';

export function renderChart(chartData, containerId, style = 'north', options = {}) {
  if (style === 'south') {
    renderSouthIndianChart(chartData, containerId, options);
  } else {
    renderNorthIndianChart(chartData, containerId, options);
  }
}
