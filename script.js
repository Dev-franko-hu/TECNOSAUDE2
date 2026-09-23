const totalSteps = 5;
let currentStep = 1;
let selectedPlan = "";

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
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectPlan(button.dataset.plan);

    document.querySelectorAll(".plan").forEach((plan) => {
      plan.style.outline = "none";
    });

    button.closest(".plan").style.outline = "2px solid var(--green)";
  });
});

continueButton.addEventListener("click", () => {
  if (!selectedPlan) return;

  document.getElementById("formulario").scrollIntoView({
    behavior: "smooth",
  });

  if (currentStep === 1) {
    window.scrollBy({ top: 120, behavior: "smooth" });
  }
});

function updateForm() {
  formSteps.forEach((step) => {
    const shouldBeActive = Number(step.dataset.step) === currentStep;
    step.classList.toggle("active", shouldBeActive);
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
  const requiredFields = activeStep.querySelectorAll("input[required], select[required]");

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

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log("Dados do aluno:", data);

  form.style.display = "none";
  document.querySelector(".progress-area").style.display = "none";
  successMessage.classList.add("visible");
});

updateForm();
