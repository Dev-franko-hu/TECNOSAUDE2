const totalSteps = 5;
let currentStep = 1;
let selectedPlan = "";

const premiumStyles = document.createElement("link");
premiumStyles.rel = "stylesheet";
premiumStyles.href = "premium.css";
document.head.appendChild(premiumStyles);

const enhancementStyles = document.createElement("link");
enhancementStyles.rel = "stylesheet";
enhancementStyles.href = "site-enhancements.css";
document.head.appendChild(enhancementStyles);

const planButtons = document.querySelectorAll(".choose-plan");
const selectedPlanBox = document.getElementById("selectedPlan");
const selectedPlanName = document.getElementById("selectedPlanName");
const continueButton = document.getElementById("continueButton");
const planInput = document.getElementById("planInput");
const form = document.getElementById("studentForm");
const formSteps = document.querySelectorAll(".form-step");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const submitButton = document.getElementById("submitButton");
const stepLabel = document.getElementById("stepLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const successMessage = document.getElementById("successMessage");

function selectPlan(plan) {
  selectedPlan = plan;
  planInput.value = plan;
  selectedPlanName.textContent = plan;
  selectedPlanBox.classList.add("visible");

  document.querySelectorAll(".plan").forEach((card) => {
    card.classList.toggle("selected", card.querySelector("[data-plan]")?.dataset.plan === plan);
  });

  localStorage.setItem("tecnosaude-plano", plan);
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => selectPlan(button.dataset.plan));
});

continueButton.addEventListener("click", () => {
  if (!selectedPlan) return;
  document.getElementById("formulario").scrollIntoView({ behavior: "smooth" });
});

function updateForm() {
  formSteps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });

  const percentage = (currentStep / totalSteps) * 100;
  stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  progressPercent.textContent = `${Math.round(percentage)}%`;
  progressFill.style.width = `${percentage}%`;
  previousButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
  nextButton.hidden = currentStep === totalSteps;
  submitButton.hidden = currentStep !== totalSteps;
}

function validateCurrentStep() {
  const activeStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const requiredFields = activeStep.querySelectorAll("input[required], select[required], textarea[required]");

  for (const field of requiredFields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

nextButton.addEventListener("click", () => {
  if (!selectedPlan) {
    alert("Escolha um plano antes de continuar.");
    document.getElementById("planos").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!validateCurrentStep()) return;

  if (currentStep < totalSteps) {
    currentStep += 1;
    updateForm();
    document.querySelector(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

previousButton.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep -= 1;
    updateForm();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("tecnosaude-formulario", JSON.stringify(data));

  form.style.display = "none";
  document.querySelector(".progress-area").style.display = "none";
  successMessage.classList.add("visible");
});

const revealItems = document.querySelectorAll("section:not(.hero), .step, .plan, .form-card");
revealItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const savedPlan = localStorage.getItem("tecnosaude-plano");
if (savedPlan) selectPlan(savedPlan);

updateForm();
