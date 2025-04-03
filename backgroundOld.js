// IMPORTS
import { getCursorPosition } from "./utils.js";

// Variables
let canvas, ctx;
let particles = [];
let resizeTimeout;
let isAnimating = false;

// Particle class
class Particle {
  constructor() {
    this.reset();
    this.size = a2; // Taille exacte comme dans votre ancien code (2px)
    this.vx = 0;
    this.vy = 0;
    this.moveToNewTarget = false;
    this.animationProgress = 0; // Pour l'ease-out
    this.animationDuration = 1; // Durée en secondes
    this.startX = 0;
    this.startY = 0;
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  update() {
    if (this.moveToNewTarget) {
      // Augmenter progressivement la progression de l'animation
      this.animationProgress += 0.005; // Très lent (0.005 au lieu de 0.01)

      if (this.animationProgress >= 1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.moveToNewTarget = false;
        this.animationProgress = 0;
      } else {
        // Ease-out cubic - ralentit vers la fin
        const easeOut = 1 - Math.pow(1 - this.animationProgress, 3);

        // Interpolation entre position de départ et cible
        this.x = this.startX + (this.targetX - this.startX) * easeOut;
        this.y = this.startY + (this.targetY - this.startY) * easeOut;
      }
    } else {
      // Comportement normal quand on n'est pas en mode animation
      // Apply velocity (for click force)
      this.x += this.vx;
      this.y += this.vy;

      // Apply friction to velocity
      this.vx *= 0.95;
      this.vy *= 0.95;

      // If velocity is negligible, stop applying it
      if (Math.abs(this.vx) < 0.01 && Math.abs(this.vy) < 0.01) {
        this.vx = 0;
        this.vy = 0;
      }
    }

    // Keep within bounds
    if (this.x < 0) this.x = 0;
    if (this.x > window.innerWidth) this.x = window.innerWidth;
    if (this.y < 0) this.y = 0;
    if (this.y > window.innerHeight) this.y = window.innerHeight;
  }

  draw() {
    // Effet de lueur identique à celui de votre code original
    // Équivalent à boxShadow: "0 0 10px 2px white"
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Cercle principal - point blanc distinct
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Réinitialiser les ombres
    ctx.shadowBlur = 0;
  }

  applyForce(forceX, forceY) {
    // Configurer pour une animation avec ease-out plutôt qu'un mouvement direct
    this.startX = this.x;
    this.startY = this.y;

    // Le point cible est calculé en fonction de la force
    // Force x12 pour un effet visuel plus important
    this.targetX = this.x + forceX * 12;
    this.targetY = this.y + forceY * 12;

    // Activer le mode animation
    this.moveToNewTarget = true;
    this.animationProgress = 0;

    // Réinitialiser les vélocités
    this.vx = 0;
    this.vy = 0;
  }

  setNewTarget() {
    this.startX = this.x;
    this.startY = this.y;
    this.targetX = Math.random() * window.innerWidth;
    this.targetY = Math.random() * window.innerHeight;
    this.moveToNewTarget = true;
    this.animationProgress = 0; // Réinitialiser la progression
  }
}

// Setup canvas
function setupCanvas() {
  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
}

// Create particles
function createParticles(count = 50) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

// Animation loop
function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  // Continue animation
  requestAnimationFrame(animate);
}

// Handle click event
function handleClick(e) {
  const x = e.clientX;
  const y = e.clientY;

  // Create click circle visual effect
  createClickCircle(x, y);

  // Apply forces to particles
  particles.forEach((particle) => {
    const dx = particle.x - x;
    const dy = particle.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      // Force decreases with distance
      const force = (1 - distance / 100) * 2.5;
      // Normalize direction
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;

      particle.applyForce(forceX, forceY);
    }
  });
}

// Create click circle effect
function createClickCircle(x, y) {
  const circleCanvas = document.createElement("canvas");
  circleCanvas.width = 200;
  circleCanvas.height = 200;
  circleCanvas.style.position = "absolute";
  circleCanvas.style.left = `${x - 100}px`;
  circleCanvas.style.top = `${y - 100}px`;
  circleCanvas.style.pointerEvents = "none";
  circleCanvas.style.zIndex = "-1";
  document.body.appendChild(circleCanvas);

  const circleCtx = circleCanvas.getContext("2d");

  // Animation timing - plus lent pour correspondre à l'original
  let startTime = null;
  const duration = 2000; // 2 secondes

  function animateCircle(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const linearProgress = Math.min(elapsed / duration, 1);

    // Appliquer une fonction d'ease-out pour accélération au début et ralentissement à la fin
    const easeOutProgress = 1 - Math.pow(1 - linearProgress, 3);

    // Clear canvas
    circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

    // Draw expanding circle - using easeOutProgress instead of linear progress
    const radius = easeOutProgress * 100;
    const alpha = 0.2 * (1 - linearProgress);

    circleCtx.beginPath();
    const gradient = circleCtx.createRadialGradient(
      100,
      100,
      0,
      100,
      100,
      radius
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
    circleCtx.fillStyle = gradient;
    circleCtx.arc(100, 100, radius, 0, Math.PI * 2);
    circleCtx.fill();

    if (linearProgress < 1) {
      requestAnimationFrame(animateCircle);
    } else {
      document.body.removeChild(circleCanvas);
    }
  }

  requestAnimationFrame(animateCircle);
}

// Handle window resize
function handleResize() {
  // Prevent multiple resize handling
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    // Update canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set new targets for particles
    particles.forEach((particle) => {
      particle.setNewTarget();
    });
  }, 200);
}

// EXPORTS
export function generateBackgroundParticules() {
  setupCanvas();
  createParticles();
  animate();
}

export function pushParticules() {
  window.addEventListener("click", handleClick);
}

export function circlesOnClick() {
  // Click circles are handled in handleClick
}

// Window event listeners
window.addEventListener("resize", handleResize);
