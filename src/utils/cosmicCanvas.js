/**
 * AstroVeda - Cosmic Canvas Animator (battery-friendly)
 * - Pre-renders star sprites once, then only blits them each frame
 * - Caps star count (fewer on phones), throttles to ~30 fps
 * - Pauses when the tab is hidden; draws a single static frame for prefers-reduced-motion
 * - Handles high-DPI screens without blowing up canvas memory
 */

export function initCosmicCanvas(canvasId = 'cosmic-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.matchMedia?.('(max-width: 768px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const MAX_STARS = isSmall ? 70 : 160;
  const FRAME_MS = 1000 / 30;

  let width = 0, height = 0, stars = [], rafId = null, last = 0, resizeTimer = null;

  // Pre-render one glowing dot per colour
  const sprites = ['#DAA520', '#AD6FFF'].map(color => {
    const s = document.createElement('canvas');
    s.width = s.height = 8;
    const c = s.getContext('2d');
    const g = c.createRadialGradient(4, 4, 0, 4, 4, 4);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 8, 8);
    return s;
  });

  function createStars() {
    const count = Math.min(MAX_STARS, Math.floor((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 1.5 + 0.3) * 2.4,
      alpha: Math.random() * 0.7 + 0.2,
      speed: (Math.random() * 0.02 + 0.005) * 2,
      sprite: sprites[Math.random() > 0.3 ? 0 : 1],
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
    if (reduceMotion || !rafId) drawFrame(false);
  }

  function drawFrame(animate = true) {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      if (animate) {
        star.alpha += star.speed;
        if (star.alpha > 0.9 || star.alpha < 0.2) star.speed = -star.speed;
      }
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.drawImage(star.sprite, star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  function loop(ts) {
    rafId = requestAnimationFrame(loop);
    if (ts - last < FRAME_MS) return;
    last = ts;
    drawFrame(true);
  }

  function start() { if (!reduceMotion && !rafId) rafId = requestAnimationFrame(loop); }
  function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };
  const onVisibility = () => (document.hidden ? stop() : start());

  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  start();

  return () => {
    stop();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
