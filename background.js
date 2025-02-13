// IMPORTS

import { getCursorPosition } from "./utils.js";

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
        // Only affect particles within a 200px range
        const force = (1 - distance / 100) * 50; // Closer = stronger push
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
  for (let i = 0; i < 200; i++) {
    backgroundParticules();
  }
}

function backgroundParticules() {
  const particulePosition = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  };
  const particule = document.createElement("div");
  particule.style.position = "absolute";
  particule.style.left = `${particulePosition.x}px`;
  particule.style.top = `${particulePosition.y}px`;
  particule.style.width = "1px";
  particule.style.height = "1px";
  particule.style.backgroundColor = "white";
  particule.style.zIndex = "-1";
  particule.style.borderRadius = "50%";
  particule.style.boxShadow = "0 0 10px 2px white";
  particule.classList.add("particule");
  document.body.appendChild(particule);
}

export function circlesOnClick() {
  // Manages the logic behind the circles on click
  addEventListener("click", function (e) {
    // Gets the cursor position
    const cursorPosition = getCursorPosition(e);

    // Creates the circle
    const clickCircle = document.createElement("div");

    // Styles the circle
    clickCircle.style.position = "absolute";
    clickCircle.style.left = `${cursorPosition.x}px`;
    clickCircle.style.top = `${cursorPosition.y}px`;
    clickCircle.style.borderRadius = "50%";
    clickCircle.style.zIndex = "-1";
    clickCircle.style.backgroundColor = "white";
    clickCircle.style.width = "0px";
    clickCircle.style.height = "0px";
    clickCircle.style.opacity = "0.2";

    document.body.appendChild(clickCircle); // Adds the circle to the body

    // Animates the circle (gsap)

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
        deplay: 0.5,
      },
      "-=0.5"
    );
  });
}
