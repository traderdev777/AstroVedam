/**
 * AstroVeda - Reliable High-Definition Page-by-Page PDF Downloader
 * Captures each .patrika-page at 2.0x scale (retina / 300DPI equivalent) for crystal-clear readability,
 * supports multilingual filenames, and provides a real-time progress modal with native print fallback.
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function showDownloadStatus(stage, message, percent = 0) {
  let statusCard = document.getElementById('astro-pdf-download-status');
  if (!statusCard) {
    statusCard = document.createElement('div');
    statusCard.id = 'astro-pdf-download-status';
    statusCard.className = 'no-print';
    statusCard.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: #0F172A;
      color: #FFFFFF;
      border: 2px solid #DAA520;
      box-shadow: 0 10px 35px rgba(0,0,0,0.7);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 320px;
      max-width: 440px;
      font-family: 'Inter', -apple-system, sans-serif;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(statusCard);
  }

  if (stage === 'generating') {
    statusCard.style.display = 'block';
    statusCard.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 18px; height: 18px; border: 2.5px solid rgba(218,165,32,0.3); border-top-color: #DAA520; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <strong style="color: #FBBF24; font-size: 13.5px;">AstroVeda HD PDF Generator</strong>
        </div>
        <span style="font-size: 12px; font-weight: 700; color: #10B981;">${percent}%</span>
      </div>
      <div style="font-size: 12px; color: #E2E8F0; margin-bottom: 8px;">${message}</div>
      <div style="background: rgba(255,255,255,0.15); border-radius: 999px; height: 6px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #F59E0B, #10B981); height: 100%; width: ${Math.max(percent, 8)}%; transition: width 0.25s ease;"></div>
      </div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">
        Rendering ultra-crisp 9-Page Vedic Mahapatrika directly to your Downloads folder...
      </div>
    `;
  } else if (stage === 'success') {
    statusCard.style.display = 'block';
    statusCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">✅</span>
        <div>
          <strong style="color: #34D399; font-size: 14px;">PDF Downloaded Successfully!</strong>
          <div style="font-size: 12px; color: #E2E8F0; margin-top: 2px;">${message}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Saved to your browser's Downloads folder.</div>
        </div>
      </div>
    `;
    setTimeout(() => {
      if (statusCard) statusCard.style.display = 'none';
    }, 5000);
  } else if (stage === 'fallback' || stage === 'error') {
    statusCard.style.display = 'block';
    statusCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🖨️</span>
        <div>
          <strong style="color: #FBBF24; font-size: 14px;">Opening Print / Save as PDF</strong>
          <div style="font-size: 12px; color: #E2E8F0; margin-top: 2px;">${message}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Destination में "Save as PDF" चुनें।</div>
        </div>
      </div>
    `;
    setTimeout(() => {
      if (statusCard) statusCard.style.display = 'none';
    }, 5000);
  }
}

export async function downloadKundaliPdf(elementId = 'printable-patrika', personName = 'Seeker', onStatusChange = null, lang = 'hi') {
  const notify = (stage, msg, pct = 0) => {
    if (typeof onStatusChange === 'function') {
      try { onStatusChange(stage, msg, pct); } catch (e) { /* ignore */ }
    }
    showDownloadStatus(stage, msg, pct);
  };

  const container = document.getElementById(elementId);
  if (!container) {
    console.warn('Report container not found, triggering window.print()');
    notify('fallback', 'Launching Native Print / Save as PDF dialog...');
    window.print();
    return;
  }

  const pages = container.querySelectorAll('.patrika-page');
  if (!pages || pages.length === 0) {
    notify('fallback', 'Launching Native Print / Save as PDF dialog...');
    window.print();
    return;
  }

  const cleanName = (personName || 'Seeker').trim().replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
  const langNames = { en: 'English', hi: 'Hindi', kn: 'Kannada', mr: 'Marathi', te: 'Telugu' };
  const langLabel = langNames[lang] || 'Patrika';
  const filename = `AstroVeda_Kundali_Patrika_${cleanName}_${langLabel}.pdf`;

  notify('generating', `Preparing 9-Page HD Kundali Patrika (${langLabel})...`, 5);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    for (let i = 0; i < pages.length; i++) {
      const pct = Math.round(((i + 1) / pages.length) * 100);
      notify('generating', `Processing HD Page ${i + 1} of ${pages.length} (${langLabel})...`, pct);

      const pageEl = pages[i];
      // 2.0x scale produces razor-sharp 300DPI equivalent retina quality
      const canvas = await html2canvas(pageEl, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1024
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    pdf.save(filename);
    notify('success', `Saved as ${filename} in your Downloads folder!`, 100);
  } catch (err) {
    console.warn('Direct canvas download error, launching native Print / Save as PDF:', err);
    notify('fallback', 'Launching Native Print / Save as PDF dialog...');
    setTimeout(() => {
      window.print();
    }, 200);
  }
}
