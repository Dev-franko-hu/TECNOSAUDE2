const totalSteps = 5;
let currentStep = 1;
let selectedPlan = "";

const WHATSAPP_NUMBER = "5511999999999"; // Troque pelo seu número do WhatsApp com DDI + DDD, sem sinais e sem espaços.

const loadStylesheet = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

loadStylesheet("premium.css");
loadStylesheet("site-enhancements.css");
loadStylesheet("motion.css");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  formSteps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === currentStep));
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
  for (const field of activeStep.querySelectorAll("input[required], select[required], textarea[required]")) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

function buildWhatsAppMessage(data) {
  const fields = [
    ["Plano", data.plano || "Não informado"],
    ["Nome", data.nome || "Não informado"],
    ["E-mail", data.email || "Não informado"],
    ["WhatsApp", data.whatsapp || "Não informado"],
    ["Nascimento", data.dataNascimento || "Não informado"],
    ["Objetivo", data.objetivo || "Não informado"],
    ["Peso", data.peso || "Não informado"],
    ["Altura", data.altura || "Não informado"],
    ["Nível", data.nivel || "Não informado"],
    ["Frequência", data.frequencia || "Não informado"],
    ["Prazo", data.prazo || "Não informado"],
    ["Motivação", data.motivacao || "Não informado"],
    ["Limitações", data.limitacoes || "Não informado"],
    ["Refeições", data.refeicoes || "Não informado"],
    ["Água", data.agua || "Não informado"],
    ["Alimentos", data.alimentosPreferidos || "Não informado"],
    ["Restrições", data.restricoes || "Não informado"],
    ["Rotina", data.rotinaAlimentar || "Não informado"],
    ["Saúde", data.condicoesSaude || "Não informado"],
    ["Medicamentos", data.medicamentosSuplementos || "Não informado"],
    ["Observações", data.observacoes || "Não informado"]
  ];

  return [
    "Olá! Chegou uma nova inscrição da Tecnosaude.",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensagem enviada automaticamente pelo formulário do site."
  ].join("\n");
}

function sendDataToWhatsApp(data) {
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!phone || phone === "5511999999999") {
    console.warn("Defina o número do WhatsApp no arquivo script.js antes de publicar.");
    return;
  }

  const message = encodeURIComponent(buildWhatsAppMessage(data));
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
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

  // Envia as informações para o WhatsApp do responsável
  sendDataToWhatsApp(data);

  form.style.display = "none";
  document.querySelector(".progress-area").style.display = "none";
  successMessage.classList.add("visible");
});

function addRevealAnimations() {
  const items = document.querySelectorAll("section:not(.hero), .step, .plan, .form-card");
  items.forEach((item, index) => {
    item.setAttribute("data-reveal", index % 3 === 1 ? "left" : index % 3 === 2 ? "right" : "up");
    item.style.transitionDelay = `${(index % 4) * 70}ms`;
  });

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function addParticles() {
  if (prefersReducedMotion) return;
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const field = document.createElement("div");
  field.className = "particle-field";

  for (let i = 0; i < 26; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${Math.random() * 8}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * -16}s`;
    particle.style.opacity = `${.25 + Math.random() * .5}`;
    field.appendChild(particle);
  }
  hero.prepend(field);
}

function addCursorGlow() {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.classList.add("visible");
  }, { passive: true });
}

function addTiltEffect() {
  if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".plan, .step").forEach((card) => {
    card.classList.add("motion-card");
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-7px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

function addTypingEffect() {
  if (prefersReducedMotion) return;
  const target = document.querySelector(".hero .eyebrow");
  if (!target) return;
  const original = target.textContent;
  target.textContent = "";
  const caret = document.createElement("span");
  caret.className = "typing-caret";
  let index = 0;
  const type = () => {
    if (index < original.length) {
      target.insertBefore(document.createTextNode(original[index]), caret);
      index += 1;
      setTimeout(type, 35);
    }
  };
  target.appendChild(caret);
  setTimeout(type, 500);
}

const savedPlan = localStorage.getItem("tecnosaude-plano");
if (savedPlan) selectPlan(savedPlan);

updateForm();
addRevealAnimations();
addParticles();
addCursorGlow();
addTiltEffect();
addTypingEffect();
