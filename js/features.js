document.addEventListener("DOMContentLoaded", () => {
  // ------- Reading Progress Bar -------
  function updateReadingProgress() {
    const progressBar = document.getElementById("readingProgressBar");
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateReadingProgress);

  // ------- Project Filtering avec méthode anti-clignotement -------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectsGrid = document.querySelector(".projects-grid");

  let isFiltering = false; // Pour éviter les filtres multiples simultanés

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Éviter les filtres multiples trop rapides
      if (isFiltering) return;
      isFiltering = true;

      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filterValue = button.getAttribute("data-filter");

      // Masquer tous les projets rapidement pour éviter le clignotement
      projectCards.forEach((card) => {
        // On supprime d'abord les classes d'animation et visible
        card.classList.remove("animate-in");
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";
      });

      // Après un court délai, appliquons le filtrage réel
      setTimeout(() => {
        // Parcourir toutes les cartes pour décider lesquelles afficher
        let visibleCards = [];
        projectCards.forEach((card) => {
          const tags = card.getAttribute("data-tags");

          if (filterValue === "all" || (tags && tags.includes(filterValue))) {
            // Cette carte correspond au filtre, la garder visible
            card.classList.remove("filtered-out");
            card.classList.add("visible");
            visibleCards.push(card);
          } else {
            // Cette carte ne correspond pas au filtre, la cacher
            card.classList.add("filtered-out");
            card.classList.remove("visible");
          }
        });

        // Animation d'entrée séquentielle pour les cartes visibles
        visibleCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
            card.classList.add("animate-in");
          }, 50 * index);
        });

        // Permettre un nouveau filtrage après un délai
        setTimeout(() => {
          isFiltering = false;
        }, 50 * visibleCards.length + 300);
      }, 300);
    });
  });

  // ------- Stats Counter Animation -------
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateStats() {
    statNumbers.forEach((statElem) => {
      const target = parseInt(statElem.getAttribute("data-count"));
      const duration = 2000; // ms
      const increment = target / (duration / 30); // Update every 30ms
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          statElem.textContent = target;
          clearInterval(timer);
        } else {
          statElem.textContent = Math.floor(current);
        }
      }, 30);
    });
  }

  // Only run stats animation when stats section is visible
  const statsSection = document.getElementById("statistics");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(statsSection);
  }

  // ------- GitHub Stats API -------
  async function fetchGitHubStats() {
    try {
      // Replace 'Dahreau' with your actual GitHub username
      const response = await fetch("https://api.github.com/users/Dahreau");
      const data = await response.json();

      document.getElementById("repoCount").textContent = data.public_repos || 0;

      // Fetch repos for star count
      const reposResponse = await fetch(
        "https://api.github.com/users/Dahreau/repos"
      );
      const repos = await reposResponse.json();

      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
      );
      document.getElementById("starsCount").textContent = totalStars || 0;

      // Set a placeholder for commits (GitHub API doesn't provide this directly)
      document.getElementById("commitsCount").textContent = "200+";
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      // Fill with placeholder data if API fails
      document.getElementById("repoCount").textContent = "10+";
      document.getElementById("starsCount").textContent = "25+";
      document.getElementById("commitsCount").textContent = "200+";
    }
  }

  fetchGitHubStats();

  // ------- Radar Chart for Skills avec animation progressive et compatibilité mode clair -------
  let skillsChart = null; // Variable globale pour stocker l'instance du graphique

  function initializeSkillsChart() {
    const ctx = document.getElementById("skillsRadarChart");
    if (!ctx) return;

    // Important: détruire le graphique existant s'il y en a un
    if (skillsChart) {
      skillsChart.destroy();
    }

    // Forcer l'opacité à 0 pour s'assurer que l'animation est visible
    ctx.style.opacity = "0";
    ctx.style.transform = "scale(0.9)";

    // Vérifier si nous sommes en mode clair pour adapter les couleurs
    const isLightMode = document.body.classList.contains("light-mode");
    const gridColor = isLightMode
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(255, 255, 255, 0.1)";
    const textColor = isLightMode ? "#555555" : "#b0b0b0";
    const fillColor = isLightMode
      ? "rgba(94, 157, 217, 0.3)"
      : "rgba(94, 157, 217, 0.2)";

    // Définir les libellés et les données finales
    const labels = ["Frontend", "Backend", "UX/UI", "Database", "Game Dev"];
    const finalData = [90, 85, 75, 70, 80];

    // Créer le graphique avec des données initiales à zéro
    skillsChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Skill Level",
            data: [0, 0, 0, 0, 0], // Commencer avec zéro
            backgroundColor: fillColor,
            borderColor: "#5e9dd9",
            borderWidth: 2,
            pointBackgroundColor: "#5e9dd9",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#5e9dd9",
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
            },
            grid: {
              color: gridColor,
            },
            angleLines: {
              color: gridColor,
            },
            pointLabels: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12,
              },
              color: textColor,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        animation: {
          duration: 0, // Désactiver l'animation automatique de Chart.js
        },
      },
    });

    // Animation progressive manuelle
    const totalSteps = 25;
    let currentStep = 0;

    // Faire apparaître le graphique avec délai
    setTimeout(() => {
      ctx.style.opacity = "1";
      ctx.style.transform = "scale(1)";

      // Animation des données et du fond
      function animateStep() {
        if (currentStep >= totalSteps) return;

        currentStep++;
        const progress = currentStep / totalSteps;

        // Calculer les valeurs intermédiaires
        const newData = finalData.map((value) => Math.round(value * progress));

        // Calculer la valeur d'opacité intermédiaire pour le fond
        const backgroundAlpha = isLightMode ? 0.3 * progress : 0.2 * progress;

        // Mettre à jour les données et le fond
        skillsChart.data.datasets[0].data = newData;
        skillsChart.data.datasets[0].backgroundColor = `rgba(94, 157, 217, ${backgroundAlpha})`;

        // Mettre à jour le graphique
        skillsChart.update();

        // Continuer l'animation
        if (currentStep < totalSteps) {
          requestAnimationFrame(animateStep);
        }
      }

      // Démarrer l'animation après un délai
      setTimeout(animateStep, 300);
    }, 200);
  }

  // Initialiser le graphique au chargement si la section est active
  const skillsSection = document.getElementById("skills");
  if (skillsSection && skillsSection.classList.contains("active")) {
    initializeSkillsChart();
  }

  // Initialiser le graphique quand on change de section
  document.querySelectorAll(".nav-menu li").forEach((navItem) => {
    navItem.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      if (sectionId === "skills") {
        setTimeout(initializeSkillsChart, 300);
      }
    });
  });

  // Réinitialiser le graphique si le thème change
  document
    .getElementById("theme-toggle")
    .addEventListener("click", function () {
      // Attendre que le changement de thème soit appliqué
      setTimeout(() => {
        if (skillsSection.classList.contains("active")) {
          initializeSkillsChart();
        }
      }, 300);
    });

  // ------- Scroll Animations (pour la timeline et autres) -------
  function handleScrollAnimations() {
    const elements = document.querySelectorAll("[data-aos]");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const elementVisible = 150; // when element is 150px from bottom of viewport

      if (elementPosition < windowHeight - elementVisible) {
        element.classList.add("aos-animate");
      } else {
        element.classList.remove("aos-animate");
      }
    });
  }

  window.addEventListener("scroll", handleScrollAnimations);
  // Initial check on load
  handleScrollAnimations();

  // Au chargement, marquer tous les projets comme visibles
  projectCards.forEach((card) => {
    card.classList.add("visible");
  });

  // Ajouter la classe transition-done après la transition des cartes projet
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const expandedDetails = this.querySelector(".project-details-expanded");
      if (expandedDetails) {
        setTimeout(() => {
          expandedDetails.classList.add("transition-done");
        }, 500); // Correspond à la durée de transition height 0.5s
      }
    });

    card.addEventListener("mouseleave", function () {
      const expandedDetails = this.querySelector(".project-details-expanded");
      if (expandedDetails) {
        expandedDetails.classList.remove("transition-done");
      }
    });
  });
});
