// IMPORTS
import { getCursorPosition } from "./utils.js";

// Variables for debounce and managing ongoing animations
let resizeTimeout;
let finalResizeTimeout;
let scrollTimeout;
let isAnimating = false;

// FUNCTIONS

export function pushParticules() {
  addEventListener("click", function (e) {
    const cursorPosition = { x: e.clientX, y: e.clientY };
    const particules = document.querySelectorAll(".particule");

    particules.forEach((particule) => {
      const rect = particule.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - cursorPosition.x;
      const dy = rect.top + rect.height / 2 - cursorPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        // Push particles close to the click
        const force = (1 - distance / 100) * 50;
        const forceX = (dx / distance) * force;
        const forceY = (dy / distance) * force;

        gsap.to(particule, {
          x: `+=${forceX}`,
          y: `+=${forceY}`,
          duration: 2,
          ease: "power1.out",
        });
      }
    });
  });
}

export function generateBackgroundParticules() {
  // Remove all existing particles
  clearParticules();

  // Generate exactly 20 particles
  for (let i = 0; i < 100; i++) {
    backgroundParticules();
  }
}

// Function to remove existing particles
function clearParticules() {
  const existingParticules = document.querySelectorAll(".particule");
  existingParticules.forEach((particule) => particule.remove());
}

// Create a particle at a random position within the window
function backgroundParticules() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const particulePosition = {
    x: Math.random() * windowWidth,
    y: Math.random() * windowHeight,
  };

  const particule = document.createElement("div");
  particule.style.position = "absolute";
  particule.style.left = `${particulePosition.x}px`;
  particule.style.top = `${particulePosition.y}px`;
  particule.style.width = "2px"; // Particle size
  particule.style.height = "2px"; // Particle size
  particule.style.backgroundColor = "white";
  particule.style.zIndex = "-1";
  particule.style.borderRadius = "50%";
  particule.style.boxShadow = "0 0 10px 2px white";
  particule.classList.add("particule");

  document.body.appendChild(particule);
}

// Particle animation on window resize
function animateParticlesOnResize() {
  if (isAnimating) return; // If an animation is already in progress, do nothing.

  isAnimating = true; // Mark the animation as in progress

  const particules = document.querySelectorAll(".particule");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Cancel all ongoing animations with GSAP
  gsap.killTweensOf(particules); // Cancel all GSAP animations of the particles

  particules.forEach((particule) => {
    // Get current position (left/top) of the particle
    const currentLeft = parseFloat(particule.style.left);
    const currentTop = parseFloat(particule.style.top);

    // Generate new random positions within the window limits
    let newLeft = Math.random() * windowWidth;
    let newTop = Math.random() * windowHeight;

    // Ensure the particle stays within the screen (size = 2px)
    newLeft = Math.min(Math.max(newLeft, 0), windowWidth - 2);
    newTop = Math.min(Math.max(newTop, 0), windowHeight - 2);

    // Animate the transition from the current position to the new position
    gsap.to(particule, {
      x: newLeft - currentLeft,
      y: newTop - currentTop,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        // Update the CSS position and reset GSAP transformation
        particule.style.left = `${newLeft}px`;
        particule.style.top = `${newTop}px`;
        gsap.set(particule, { x: 0, y: 0 });

        // Mark the animation as finished when all particles have moved
        const remainingAnimations = document.querySelectorAll(
          ".particule:not([style*='transform'])"
        ).length;
        if (remainingAnimations === 0) {
          isAnimating = false;
        }
      },
    });
  });
}

// On window resize, animate particles to new positions with debounce
window.addEventListener("resize", function () {
  // Cancel the previous timeout if a resize occurs before the animation finishes
  clearTimeout(resizeTimeout);

  // If an animation is in progress, don't start a new one
  if (isAnimating) return;

  // Trigger the animation after a 200ms delay without resizing
  resizeTimeout = setTimeout(() => {
    animateParticlesOnResize();

    // Execute the last animation after an additional delay if the user keeps resizing
    clearTimeout(finalResizeTimeout);
    finalResizeTimeout = setTimeout(() => {
      // Execute the last animation to account for the final size
      animateParticlesOnResize();
      // Reset animation for the next time
      isAnimating = false;
    }, 500); // 500ms delay after the last resize to ensure it's the end
  }, 200);
});

// Handle scroll to animate particles
window.addEventListener("scroll", function () {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    // Add code here to handle background animation or particles
    if (!isAnimating) animateParticlesOnResize();
  }, 100); // Delay to avoid repeated animations during scrolling
});

export function circlesOnClick() {
  // Handle the circle display logic on click
  addEventListener("click", function (e) {
    const cursorPosition = getCursorPosition(e);

    const clickCircle = document.createElement("div");
    clickCircle.style.position = "absolute";
    clickCircle.style.left = `${cursorPosition.x}px`;
    clickCircle.style.top = `${cursorPosition.y}px`;
    clickCircle.style.borderRadius = "50%";
    clickCircle.style.zIndex = "-1";
    clickCircle.style.background =
      "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)";
    clickCircle.style.width = "0px";
    clickCircle.style.height = "0px";
    clickCircle.style.opacity = "0.2";

    document.body.appendChild(clickCircle);

    const tl = gsap.timeline({
      onComplete: () => {
        clickCircle.remove();
      },
    });

    tl.to(clickCircle, {
      width: "100px",
      height: "100px",
      left: `${cursorPosition.x - 50}px`,
      top: `${cursorPosition.y - 50}px`,
      duration: 1,
      ease: "power2.out",
    });
    tl.to(
      clickCircle,
      {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      },
      "-=0.5"
    );
  });
}

// Initialization: generate particles on load
generateBackgroundParticules();
