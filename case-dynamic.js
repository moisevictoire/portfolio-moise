const steps = Array.from(document.querySelectorAll(".simple-step"));
const progressBar = document.querySelector(".simple-progress span");
const stepCounter = document.querySelector("[data-step-counter]");

steps.forEach((step, index) => {
  step.dataset.step = String(index + 1).padStart(2, "0");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

steps.forEach((step) => revealObserver.observe(step));

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
  progressBar.style.width = `${progress * 100}%`;

  let activeIndex = 0;
  steps.forEach((step, index) => {
    const top = step.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.45) {
      activeIndex = index;
    }
  });

  if (stepCounter) {
    stepCounter.textContent = `Étape ${activeIndex + 1} / ${steps.length}`;
  }
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const modal = document.createElement("div");
modal.className = "image-modal";
modal.innerHTML = `
  <button class="image-modal__close" type="button" aria-label="Fermer l'image">×</button>
  <img alt="" />
`;
document.body.appendChild(modal);

const modalImage = modal.querySelector("img");
const closeModal = () => modal.classList.remove("is-open");

modal.addEventListener("click", (event) => {
  if (event.target === modal || event.target.closest(".image-modal__close")) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.querySelectorAll(".simple-step__image img").forEach((image) => {
  image.addEventListener("click", () => {
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modal.classList.add("is-open");
  });
});
