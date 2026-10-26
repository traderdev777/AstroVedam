/**
 * AstroVeda - Security & HTML Sanitization Utilities
 * Prevents DOM-based and Reflected Cross-Site Scripting (XSS).
 */

/**
 * Escapes characters with special meaning in HTML contexts to their entity representations.
 * Encodes: &, <, >, ", '
 *
 * @param {any} val - Untrusted input string or value
 * @returns {string} Safe HTML-encoded string
 */
export function escapeHtml(val) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
