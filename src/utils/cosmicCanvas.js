/**
 * AstroVeda - Cosmic Canvas Animator
 * Creates animated stars, faint sacred geometric constellations, and nebula dust
 */

export function initCosmicCanvas(canvasId = 'cosmic-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((width * height) / 9000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.3 ? '#DAA520' : '#AD6FFF'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw twinkling stars
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 0.9 || star.alpha < 0.2) star.speed = -star.speed;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
      ctx.fill();
    });

    // Reset alpha
    ctx.globalAlpha = 1;
    animationFrameId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}
