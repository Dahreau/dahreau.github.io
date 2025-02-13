// IMPORTS

import { getCursorPosition } from "./utils.js";

// FUNCTIONS

export function generateBackgroundParticules() {
  for (let i = 0; i < 100; i++) {
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
