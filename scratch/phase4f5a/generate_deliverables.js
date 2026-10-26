import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mdPath = 'scratch/phase4f5a_independent_saturn_verification_report.md';
const md = fs.readFileSync(mdPath, 'utf8');

function mdToHtml(text) {
  let html = text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^---$/gim, '<hr/>');

  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  let outLines = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith('|') && l.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<div class="table-wrapper"><table><thead>';
        const headers = l.split('|').slice(1, -1).map(h => '<th>' + h.trim() + '</th>').join('');
        tableHtml += '<tr>' + headers + '</tr></thead><tbody>';
        if (i + 1 < lines.length && lines[i + 1].includes('---')) {
          i++;
        }
      } else {
        const cells = l.split('|').slice(1, -1).map(c => '<td>' + c.trim() + '</td>').join('');
        tableHtml += '<tr>' + cells + '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table></div>';
        outLines.push(tableHtml);
      }
      outLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table></div>';
    outLines.push(tableHtml);
  }

  html = outLines.join('\n');
  html = html.replace(/\n\n([^\n<]+)\n/gim, '\n\n<p>$1</p>\n');
  return html;
}

const bodyHtml = mdToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AstroVedam Phase 4F.5A — Independent Saturn Verification Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.55; max-width: 960px; margin: 0 auto; padding: 24px 28px; background: #ffffff; }
    h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0; }
    h2 { font-size: 18px; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; }
    h3 { font-size: 15px; color: #334155; margin-top: 18px; margin-bottom: 8px; }
    h4 { font-size: 13.5px; color: #475569; margin-top: 14px; margin-bottom: 6px; }
    p, li { font-size: 13px; color: #334155; }
    .table-wrapper { overflow-x: auto; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; }
    th { background: #f1f5f9; color: #0f172a; font-weight: 600; }
    tr:nth-child(even) td { background: #f8fafc; }
    code { font-family: 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; font-size: 11.5px; background: #f1f5f9; color: #b91c1c; padding: 2px 4px; border-radius: 4px; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .badge-pass { display: inline-block; background: #dcfce7; color: #15803d; font-weight: 600; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
    .alert { padding: 12px 16px; border-radius: 6px; margin: 16px 0; font-size: 12.5px; }
    .alert-success { background: #f0fdf4; border-left: 4px solid #22c55e; color: #166534; }
    .alert-info { background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

const outHtmlPath = 'public/phase4f5a_independent_saturn_verification_report.html';
fs.writeFileSync(outHtmlPath, fullHtml, 'utf8');
console.log('HTML written to ' + outHtmlPath);

const absHtmlPath = path.resolve(outHtmlPath);
const absPdfPath = path.resolve('public/phase4f5a_independent_saturn_verification_report.pdf');

try {
  execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf="${absPdfPath}" "file://${absHtmlPath}" 2>&1`);
  console.log('PDF generated at ' + absPdfPath);
} catch (e) {
  console.error('Failed to generate PDF via Chrome:', e.message);
}

try {
  execSync('zip -j public/phase4f5a_saturn_bundle.zip public/phase4f5a_independent_saturn_verification_report.html public/phase4f5a_independent_saturn_verification_report.pdf scratch/phase4f5a_independent_saturn_verification_report.md scratch/phase4f5a/fresh_benchmark_output.txt scratch/phase4f5a/fresh_npm_test_output.txt scratch/phase4f5a/fresh_build_output.txt scratch/phase4f5a/expanded_validation_manifest.json 2>&1');
  console.log('ZIP bundle generated at public/phase4f5a_saturn_bundle.zip');
} catch (e) {
  console.error('Failed to generate ZIP bundle:', e.message);
}

// Copy deliverables to brain artifact directory
const artifactDir = '/Users/supreeththakur/.gemini/antigravity-ide/brain/ffa2cbd2-cb86-41a3-9f63-8f9bd64b27a9';
fs.copyFileSync('scratch/phase4f5a_independent_saturn_verification_report.md', path.join(artifactDir, 'phase4f5a_independent_saturn_verification_report.md'));
fs.copyFileSync(outHtmlPath, path.join(artifactDir, 'phase4f5a_independent_saturn_verification_report.html'));
fs.copyFileSync(absPdfPath, path.join(artifactDir, 'phase4f5a_independent_saturn_verification_report.pdf'));
fs.copyFileSync('public/phase4f5a_saturn_bundle.zip', path.join(artifactDir, 'phase4f5a_saturn_bundle.zip'));
console.log('Copied Markdown, HTML, PDF, and ZIP to artifact directory:', artifactDir);
