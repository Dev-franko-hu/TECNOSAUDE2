const WHATSAPP_NUMBER = "5511999999999"; // troque pelo seu número real
const totalSteps = 5;
let currentStep = 1;
let selectedPlan = "";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function init() {
  const form = $("#studentForm");
  if (!form) return;

  const steps = $$(".form-step");
  const next = $("#nextButton");
  const previous = $("#previousButton");
  const submit = $("#submitButton");
  const planInput = $("#planInput");
  const selected = $("#selectedPlan");
  const selectedName = $("#selectedPlanName");
  const progressFill = $("#progressFill");
  const stepLabel = $("#stepLabel");
  const stepPercent = $("#stepPercent");

  function renderStep() {
    steps.forEach((step) => {
      const active = Number(step.dataset.step) === currentStep;
      step.classList.toggle("active", active);
      step.hidden = !active;
    });

    const percent = Math.round((currentStep / totalSteps) * 100);
    stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
    stepPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    previous.hidden = currentStep === 1;
    next.hidden = currentStep === totalSteps;
    submit.hidden = currentStep !== totalSteps;
  }

  function choosePlan(plan) {
    selectedPlan = plan;
    planInput.value = plan;
    selectedName.textContent = plan;
    selected.hidden = false;

    $$(".plan").forEach((card) => {
      card.classList.toggle("selected", card.dataset.card === plan);
    });

    localStorage.setItem("tecnosaude-plan", plan);
  }

  function validateActiveStep() {
    const active = $(".form-step.active");
    if (!active) return false;

    for (const field of $$('[required]', active)) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }

    return true;
  }

  function whatsappMessage(data) {
    const labels = {
      plano: "Plano",
      nome: "Nome",
      email: "E-mail",
      whatsapp: "WhatsApp",
      dataNascimento: "Nascimento",
      sexo: "Sexo",
      objetivo: "Objetivo",
      peso: "Peso",
      altura: "Altura",
      nivel: "Nível",
      frequencia: "Frequência",
      localTreino: "Local de treino",
      tempoTreino: "Tempo de treino",
      motivacao: "Motivação",
      limitacoes: "Limitações",
      refeicoes: "Refeições",
      agua: "Água",
      alimentosPreferidos: "Alimentos preferidos",
      restricoes: "Restrições",
      rotinaAlimentar: "Rotina alimentar",
      condicoesSaude: "Condições de saúde",
      medicamentosSuplementos: "Medicamentos/suplementos",
      observacoes: "Observações"
    };

    return [
      "Olá! Recebi uma nova ficha de aluno pela Tecnosaude.",
      "",
      ...Object.entries(labels).map(([key, label]) => `${label}: ${data[key] || "Não informado"}`)
    ].join("\n");
  }

  $$(".choose-plan").forEach((button) => {
    button.addEventListener("click", () => choosePlan(button.dataset.plan));
  });

  $("#continueButton").addEventListener("click", () => {
    $("#formulario").scrollIntoView({ behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    if (!selectedPlan) {
      alert("Escolha um plano antes de continuar.");
      $("#planos").scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!validateActiveStep()) return;

    if (currentStep < totalSteps) {
      currentStep += 1;
      renderStep();
      $("#formulario").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  previous.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      renderStep();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateActiveStep()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("tecnosaude-form", JSON.stringify(data));

    const number = WHATSAPP_NUMBER.replace(/\D/g, "");
    if (!number || number.length < 10 || number === "5511999999999") {
      alert("Configure o número do WhatsApp no arquivo script.js antes de divulgar o site.");
      return;
    }

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(data))}`,
      "_blank",
      "noopener,noreferrer"
    );

    form.hidden = true;
    $(".progress").hidden = true;
    $("#successMessage").hidden = false;
  });

  const savedPlan = localStorage.getItem("tecnosaude-plan");
  if (savedPlan) {
    const savedButton = document.querySelector(`.choose-plan[data-plan="${savedPlan}"]`);
    if (savedButton) choosePlan(savedButton.dataset.plan);
  }

  if (!selectedPlan) {
    selected.hidden = true;
  }

  renderStep();
  setupIdentity();
  setupReveal();
}

function setupIdentity() {
  const saved = JSON.parse(localStorage.getItem("tecnosaude-identification") || "null");

  if (saved?.nome && saved?.telefone) {
    $("#nome").value = saved.nome;
    $("#whatsapp").value = saved.telefone;
    return;
  }

  const modal = document.createElement("div");
  modal.className = "identity-modal";
  modal.innerHTML = `
    <div class="identity-box">
      <p class="kicker">IDENTIFICAÇÃO</p>
      <h2>Antes de começar</h2>
      <p>Informe seu nome e telefone para identificarmos sua ficha.</p>
      <form id="identityForm">
        <label>Nome completo<input id="identityName" required /></label>
        <label>Telefone/WhatsApp<input id="identityPhone" type="tel" placeholder="(11) 966205035" required /></label>
        <label class="identity-check"><input id="identityConsent" type="checkbox" required /> Autorizo o uso para identificação e contato.</label>
        <small id="identityError"></small>
        <button class="button" type="submit">CONTINUAR</button>
      </form>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .identity-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.86);backdrop-filter:blur(12px)}
    .identity-box{width:min(450px,100%);padding:30px;background:#111516;border:1px solid rgba(183,243,74,.4);border-radius:20px;box-shadow:0 20px 70px #000}
    .identity-box h2{margin:0 0 8px;font-size:2rem}
    .identity-box>p:not(.kicker){color:#9da8a3}
    .identity-box form{display:grid;gap:14px;margin-top:22px}
    .identity-box label{display:grid;gap:6px;font-size:.85rem;font-weight:700}
    .identity-box input:not([type=checkbox]){padding:13px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:#1a2021;color:#fff}
    .identity-check{display:flex!important;align-items:flex-start;gap:10px;color:#9da8a3;font-size:.78rem!important}
    .identity-check input{margin-top:4px;accent-color:#b7f34a}
    .identity-box small{color:#ff7676;min-height:16px}
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);

  $("#identityForm", modal).addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = $("#identityName", modal).value.trim();
    const telefone = $("#identityPhone", modal).value.trim();

    if (nome.length < 3 || telefone.replace(/\D/g, "").length < 10) {
      $("#identityError", modal).textContent = "Informe um nome válido e telefone com DDD.";
      return;
    }

    localStorage.setItem("tecnosaude-identification", JSON.stringify({ nome, telefone }));
    $("#nome").value = nome;
    $("#whatsapp").value = telefone;
    modal.remove();
  });
}

function setupReveal() {
  const items = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", init);
