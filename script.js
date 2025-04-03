// Navigation handler
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-menu li");
  const sections = document.querySelectorAll(".section");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      navItems.forEach((i) => i.classList.remove("active"));
      // Add active class to clicked item
      item.classList.add("active");

      // Hide all sections
      sections.forEach((section) => section.classList.remove("active"));
      // Show selected section
      const sectionId = item.getAttribute("data-section");
      document.getElementById(sectionId).classList.add("active");
    });
  });

  // Initialize background effects
  initBackgroundEffects();
});

// Background effects
function initBackgroundEffects() {
  // Create and append canvas
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get context
  const ctx = canvas.getContext("2d");

  // Particles array
  let particles = [];

  // Create particles
  function createParticles() {
    particles = [];
    const count = Math.floor(window.innerWidth / 20); // Adjust number based on screen size

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: "rgba(255, 255, 255, 0.5)",
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        isMovingFromPush: false,
        pushTimer: 0,
        isActive: Math.random() < 0.1, // Seulement ~10% des particules sont actives initialement
        stateChangeTimer: 0,
        nextStateChange: Math.random() * 1000 + 500, // 500-1500 frames avant de potentiellement changer d'état
        // Ajout des propriétés pour le déplacement style "background.js"
        moveToNewTarget: false,
        animationProgress: 0,
        startX: 0,
        startY: 0,
      });
    }
  }

  // Animate particles
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((p) => {
      if (p.moveToNewTarget) {
        // Comportement du code background.js original
        // Augmenter progressivement la progression de l'animation
        p.animationProgress += 0.005; // Très lent (0.005 au lieu de 0.01)

        if (p.animationProgress >= 1) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.moveToNewTarget = false;
          p.animationProgress = 0;
          p.vx = 0;
          p.vy = 0;
        } else {
          // Ease-out cubic - ralentit vers la fin
          const easeOut = 1 - Math.pow(1 - p.animationProgress, 3);

          // Interpolation entre position de départ et cible
          p.x = p.startX + (p.targetX - p.startX) * easeOut;
          p.y = p.startY + (p.targetY - p.startY) * easeOut;
        }
      } else if (p.isMovingFromPush) {
        // Si la particule est poussée, n'appliquer QUE la vélocité (pas d'attraction vers la cible)
        p.x += p.vx;
        p.y += p.vy;

        // Appliquer friction
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Incrémenter le timer de poussée
        p.pushTimer++;

        // Réinitialiser l'état de poussée après 60 frames (~1 seconde)
        // ou quand la vélocité devient très petite
        if (
          p.pushTimer > 60 ||
          (Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1)
        ) {
          p.isMovingFromPush = false;
          p.pushTimer = 0;
        }
      } else {
        // Incrémenter le timer de changement d'état
        p.stateChangeTimer++;

        // Très rarement, considérer un changement d'état (actif/inactif)
        if (p.stateChangeTimer > p.nextStateChange) {
          // 2% de chance de changer d'état
          if (Math.random() < 0.02) {
            p.isActive = !p.isActive;

            if (p.isActive) {
              // Si devenu actif, définir une nouvelle cible
              p.startX = p.x;
              p.startY = p.y;
              p.targetX = Math.random() * canvas.width;
              p.targetY = Math.random() * canvas.height;
              p.moveToNewTarget = true;
              p.animationProgress = 0;
            }
          }

          // Réinitialiser le timer et définir un nouveau délai
          p.stateChangeTimer = 0;
          p.nextStateChange = Math.random() * 1000 + 500;
        }

        // Pour les particules actives qui ne se déplacent pas vers une cible
        if (p.isActive && !p.moveToNewTarget) {
          // Appliquer une légère vélocité résiduelle
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
        }
      }

      // Keep within bounds
      if (p.x < 0) p.x = 0;
      if (p.x > canvas.width) p.x = canvas.width;
      if (p.y < 0) p.y = 0;
      if (p.y > canvas.height) p.y = canvas.height;

      // Draw particle with glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Handle window resize - Utilise maintenant la méthode setNewTarget comme dans background.js
  function handleResize() {
    // Prevent multiple resize handling
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      // Update canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Set new targets for particles - Comme dans background.js
      particles.forEach((p) => {
        setNewTarget(p);
      });
    }, 200);
  }

  // Fonction setNewTarget comme dans le code background.js
  function setNewTarget(p) {
    p.startX = p.x;
    p.startY = p.y;
    p.targetX = Math.random() * canvas.width;
    p.targetY = Math.random() * canvas.height;
    p.moveToNewTarget = true;
    p.animationProgress = 0;
    p.isMovingFromPush = false; // Assure qu'il n'y a pas de conflit d'états
  }

  // Handle click event - push particles
  function handleClick(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Create ripple effect
    createRipple(x, y);

    // Push particles
    particles.forEach((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (1 - distance / 100) * 5;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;

        // Update target to maintain new position
        p.targetX = p.x + p.vx * 20;
        p.targetY = p.y + p.vy * 20;

        // Mark as moving from push
        p.isMovingFromPush = true;
        p.pushTimer = 0;
        p.isActive = false; // Réinitialiser l'état actif
        p.stateChangeTimer = 0;
        p.moveToNewTarget = false; // Assure que le déplacement vers la cible est désactivé
      }
    });
  }

  // Create ripple effect
  function createRipple(x, y) {
    const ripple = {
      x: x,
      y: y,
      radius: 0,
      maxRadius: 100,
      alpha: 0.5,
      lineWidth: 2,
    };

    function drawRipple() {
      if (ripple.alpha <= 0) return;

      ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.alpha})`;
      ctx.lineWidth = ripple.lineWidth;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();

      ripple.radius += 2;
      ripple.alpha -= 0.01;
      ripple.lineWidth -= 0.01;

      if (ripple.alpha > 0) {
        requestAnimationFrame(drawRipple);
      }
    }

    drawRipple();
  }

  // Initialize
  let resizeTimeout;
  window.addEventListener("resize", handleResize);
  window.addEventListener("click", handleClick);

  createParticles();
  animate();
}
