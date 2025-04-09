document.addEventListener("DOMContentLoaded", () => {
  // ------- Reading Progress Bar -------
  function updateReadingProgress() {
    const progressBar = document.getElementById("readingProgressBar");
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateReadingProgress);

  // ------- Project Filtering -------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filterValue = button.getAttribute("data-filter");

      // Filter projects
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("filtered-out");
        } else {
          card.classList.add("filtered-out");
        }
      });
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

  // ------- Radar Chart for Skills -------
  const ctx = document.getElementById("skillsRadarChart");
  if (ctx) {
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "JavaScript",
          "HTML/CSS",
          "Go",
          "C",
          "SQLite",
          "UI/UX",
          "Game Dev",
        ],
        datasets: [
          {
            label: "Skill Level",
            data: [85, 90, 75, 70, 80, 65, 75],
            backgroundColor: "rgba(94, 157, 217, 0.2)",
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
              color: "rgba(255, 255, 255, 0.1)",
            },
            angleLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            pointLabels: {
              font: {
                family: "'Poppins', sans-serif",
                size: 12,
              },
              color: "#b0b0b0",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // ------- Form Submission -------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Collect form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Here you would normally send this to a server
      // For demo purposes, just log to console and show success
      console.log({
        name,
        email,
        subject,
        message,
      });

      // Show success message
      alert("Message sent successfully! (Demo only, no actual email sent)");

      // Reset form
      contactForm.reset();
    });
  }

  // ------- Scroll Animations -------
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
});
