const body = document.body;
const header = document.querySelector("[data-header]");
const loader = document.querySelector(".loader");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("[data-nav-menu]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");
const backToTop = document.querySelector("[data-back-to-top]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const projectCount = document.querySelector("[data-project-count]");
const sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

body.classList.add("is-loading");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 450);
});

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
const initialTheme = savedTheme || (prefersLight ? "light" : "dark");

const updateThemeIcon = (theme) => {
  themeIcon.textContent = theme === "light" ? "☀" : "☾";
};

document.documentElement.dataset.theme = initialTheme;
updateThemeIcon(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeIcon(nextTheme);
});

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const updateProjectCount = () => {
  if (!projectCount) return;
  const visibleCount = Array.from(projectCards).filter((card) => !card.classList.contains("is-hidden")).length;
  projectCount.textContent = `${visibleCount} projet${visibleCount > 1 ? "s" : ""} affiché${visibleCount > 1 ? "s" : ""}`;
};

const updateActiveNav = () => {
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 130 && rect.bottom > 130) {
      activeId = section.id;
    }
  });

  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
};

const updateChrome = () => {
  const isScrolled = window.scrollY > 20;
  header.classList.toggle("is-scrolled", isScrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 600);
  updateActiveNav();
};

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateActiveNav);
updateChrome();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.counter);
  const duration = 1100;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.hasAttribute("data-counter") && !entry.target.dataset.counted) {
        entry.target.dataset.counted = "true";
        animateCounter(entry.target);
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal, [data-counter]").forEach((element) => observer.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !shouldShow);
    });

    updateProjectCount();
  });
});

updateProjectCount();

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Merci, votre message est prêt à être envoyé.";
  contactForm.reset();
});
