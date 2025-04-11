document.addEventListener("DOMContentLoaded", function () {
  // Vérifier que GSAP est chargé
  if (typeof gsap !== "undefined") {
    // Enregistrer le plugin ScrollTrigger
    if (gsap.registerPlugin) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Animation du titre principal
    gsap.from(".home-info h1", {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 0.2,
    });

    // Animation des cartes projet
    document.querySelectorAll(".project-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
      });
    });

    // Animation des compétences
    document.querySelectorAll(".skill-item").forEach((skill, i) => {
      gsap.from(skill, {
        scrollTrigger: {
          trigger: skill,
          start: "top bottom-=50",
        },
        opacity: 0,
        y: 30,
        duration: 0.4,
        delay: i * 0.05,
      });
    });

    console.log("GSAP animations initialized"); // Pour vérifier dans la console
  } else {
    console.error("GSAP not loaded"); // Message d'erreur si GSAP n'est pas chargé
  }
});
