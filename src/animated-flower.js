// export function initAnimatedFlower(
//     canvas,
//     {
//       width = 800,
//       height = 800,
//       petals = 8,
//       rings = 18,
//       baseRadius = 150,
//       step = 6,
//       smallRadius = 40,
//       speed = 0.8,
//       lineWidth = 1.6,
//       saturation = 1.0,
//       lightness = 0.55,
//       background = 'transparent',
  
//       // reveal controls
//       revealSeconds = 1.6,
//       fadeSeconds = 0.25,
//       spinAfterReveal = true
//     } = {}
//   ) {
//     if (!(canvas instanceof HTMLCanvasElement)) {
//       throw new Error('initAnimatedFlower: first argument must be a <canvas> element');
//     }
//     const ctx = canvas.getContext('2d');
  
//     // HiDPI
//     const dpr = window.devicePixelRatio || 1;
//     const cssW = width, cssH = height;
//     canvas.width = Math.floor(cssW * dpr);
//     canvas.height = Math.floor(cssH * dpr);
//     canvas.style.width = cssW + 'px';
//     canvas.style.height = cssH + 'px';
//     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
//     // theme hues (purple ↔ blue)
//     const BLUE_HUE = 200;     // ~ #38bdf8
//     const PURPLE_HUE = 270;   // ~ #7c3aed
//     const COLOR_BLEND_SPEED = 1.2;
  
//     let start = performance.now();
//     let rafId = 0;
  
//     function drawFrame(now) {
//       const t = (now - start) / 1000;
//       const perPetalDelay = revealSeconds / petals;
  
//       // background (transparent supported)
//       if (background && background !== 'transparent') {
//         ctx.fillStyle = background;
//         ctx.fillRect(0, 0, cssW, cssH);
//       } else {
//         ctx.clearRect(0, 0, cssW, cssH);
//       }
  
//       ctx.save();
//       ctx.translate(cssW / 2, cssH / 2);
  
//       const spinT = spinAfterReveal ? Math.max(0, t - revealSeconds) : t;
//       ctx.rotate(spinT * 0.1 * speed);
  
//       ctx.lineWidth = lineWidth;
//       ctx.lineCap = 'round';
//       ctx.lineJoin = 'round';
  
//       for (let i = 0; i < petals; i++) {
//         const appearAt = i * perPetalDelay;
//         if (t < appearAt) continue;
  
//         const alpha = Math.min(1, Math.max(0, (t - appearAt) / fadeSeconds));
//         ctx.globalAlpha = alpha;
  
//         ctx.save();
//         const petalAngle = (i * (Math.PI * 2)) / petals;
//         ctx.rotate(petalAngle);
  
//         for (let j = 0; j < rings; j++) {
//           const R = Math.max(4, baseRadius - j * step);
//           const f = (Math.sin(spinT * COLOR_BLEND_SPEED + i * 0.6 + j * 0.25) + 1) / 2; // 0..1
//           const hue = BLUE_HUE + (PURPLE_HUE - BLUE_HUE) * f;
//           ctx.strokeStyle = `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
  
//           // draw each arc in its own path (prevents center square)
//           ctx.save(); ctx.rotate(-Math.PI / 2);
//           ctx.beginPath(); ctx.arc(0, R, R, -Math.PI / 2, 0, false); ctx.stroke();
//           ctx.restore();
  
//           ctx.save(); ctx.rotate(Math.PI / 2);
//           ctx.beginPath(); ctx.arc(0, R, R, Math.PI, Math.PI * 1.5, false); ctx.stroke();
//           ctx.restore();
  
//           ctx.save(); ctx.rotate(Math.PI);
//           const smallSweep = (24 * Math.PI) / 180;
//           ctx.beginPath(); ctx.arc(0, smallRadius, smallRadius, 0, smallSweep, false); ctx.stroke();
//           ctx.restore();
  
//           ctx.rotate(((2 * Math.PI) / (rings * 12)) * speed);
//         }
  
//         ctx.restore();
//         ctx.globalAlpha = 1;
//       }
  
//       ctx.restore();
//       rafId = requestAnimationFrame(drawFrame);
//     }
  
//     rafId = requestAnimationFrame(drawFrame);
//     return () => { if (rafId) cancelAnimationFrame(rafId); };
//   }
  