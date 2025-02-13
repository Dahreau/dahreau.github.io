// IMPORTS

import { getCursorPosition } from "./utils.js";
import { circlesOnClick, generateBackgroundParticules } from "./background.js";

// FUNCTIONS

console.log(gsap);

const daroSamaky = document.querySelector("#daroSamaky");

daroSamaky.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

gsap.from("#daroSamaky", {
  opacity: 0,
  duration: 2,
  delay: 1,
  ease: "power2.in",
});
// Manages the logic behind the background on click
daroSamaky.addEventListener("click", function (e) {
  // Gets the cursor position
  const cursorPosition = getCursorPosition(e);

  // Creates the background
  const firstBackground = document.createElement("div");

  // Styles the background
  firstBackground.style.position = "absolute";
  firstBackground.style.left = `${cursorPosition.x}px`;
  firstBackground.style.top = `${cursorPosition.y}px`;
  firstBackground.style.borderRadius = "50%";
  firstBackground.style.zIndex = "-2";
  firstBackground.style.backgroundColor = "#202020";
  firstBackground.style.width = "0px";
  firstBackground.style.height = "0px";

  document.body.appendChild(firstBackground); // Adds the background to the body

  // Animates the background (gsap)
  gsap.to(firstBackground, {
    width: "3000px",
    height: "3000px",
    left: `${cursorPosition.x - 1500}px`,
    top: `${cursorPosition.y - 1500}px`,
    duration: 2,
    ease: "power2.inOut",
    onComplete: () => {
      firstBackground.remove();
    },
  });
  gsap.to(document.body, { backgroundColor: "#202020", duration: 2 });
  gsap.to(daroSamaky, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      secondTitle();
      daroSamaky.remove();
    },
  });
});

function secondTitle() {
  const secondTitle = document.createElement("div");
  secondTitle.classList.add("startTitle");

  secondTitle.innerHTML = "Développeur Full Stack";
  secondTitle.style.color = "#fff";
  document.body.appendChild(secondTitle);
  secondTitle.style.opacity = "0";
  secondTitle.style.transition = "opacity 1s, font-size 0.3s ease";
  setTimeout(() => {
    secondTitle.style.opacity = "1";
  }, 50);

  secondTitle.addEventListener("click", function () {
    secondTitle.style.opacity = "0";
    setTimeout(() => {
      secondTitle.remove();
      loadMainContent();
    }, 1000);
  });
}

function loadMainContent() {
  fetch("main-content.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("contentContainer").innerHTML = data;
      document.getElementById("contentContainer").classList.remove("hidden");
    })
    .catch((error) => console.error("Error loading main content:", error));
}

generateBackgroundParticules();
circlesOnClick();
