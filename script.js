// IMPORTS

// import { getCursorPosition } from "./utils.js";
import {
  circlesOnClick,
  generateBackgroundParticules,
  pushParticules,
} from "./background.js";

// FUNCTIONS

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("#SectionSelector > div");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    sections.forEach((section) => section.classList.remove("active"));
    navItems.forEach((navItem) => navItem.classList.remove("active"));

    item.classList.add("active");
    const sectionId = item.id.toLowerCase();
    document.getElementById(`${sectionId}Content`).classList.add("active");
  });
});

pushParticules();
generateBackgroundParticules();
circlesOnClick();
