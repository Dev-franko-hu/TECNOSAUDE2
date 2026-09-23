const CONFIG = {
  whatsappNumber: "5511999999999", // Troque pelo seu número real.
  totalSteps: 5,
};

let currentStep = 1;
let selectedPlan = "";

function initTecnosaude() {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const form = $("#studentForm");
  if (!form) return;

  const steps = $$(".form-step");
  const planButtons = $$(".choose-plan");
  const planInput = $("#planInput");
  const selectedPlanBox = $("#selectedPlan");
  const selectedPlanName = $("#selectedPlanName");
  const continueButton = $("#continueButton");
  const nextButton = $("#nextButton");
  const previousButton = $("#previousButton");
  const submitButton = $("#submitButton");
  const progressLabel = $("#stepLabel");
  const progressPercent = $("#progressPercent");
  const progressFill = $("#progressFill");
  const successMessage = $("#successMessage");

  ["premium.css", "site-enhancements.css", "motion.css"].forEach((href) => {
    if (!$(link[href="${href}"])) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  });

  function selectPlan(plan) {
    selectedPlan = plan;
    planInput.value = plan;
    selectedPlanName.textContent = plan;
    selectedPlanBox.classList.add("visible");
    $$(".plan").forEach((card) => {
      card.classList.toggle("selected", $("[data-plan]", card)?.dataset.plan === plan);
    });
    localStorage.setItem("tecnosaude-plano", plan);
  }

  function updateStep() {
    steps.forEach((step) => {
      const active = Number(step.dataset.step) === currentStep;
      step.classList.toggle("active", active);
      step.hidden = !active;
    });

    const percent = Math.round((currentStep / CONFIG.totalSteps) * 100);
    progressLabel.textContent = `Etapa ${currentStep} de ${CONFIG.totalSteps}`;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    previousButton.hidden = currentStep === 1;
    nextButton.hidden = currentStep === CONFIG.totalSteps;
    submitButton.hidden = currentStep !== CONFIG.totalSteps;
  }

  function validateStep() {
    const activeStep = $(`.form-step[data-step="${currentStep}"]`);
    if (!activeStep) return false;

    for (const field of $$('input[required], select[required], textarea[required]', activeStep)) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  }

  function messageForWhatsApp(data) {
    const fields = [
      ["Plano", data.plano], ["Nome", data.nome], ["Telefone", data.whatsapp],
      ["E-mail", data.email], ["Nascimento", data.dataNascimento], ["Objetivo", data.objetivo],
      ["Peso", data.peso ? `${data.peso} kg` : ""], ["Altura", data.altura ? `${data.altura} cm` : ""],
      ["Nível", data.nivel], ["Frequência", data.frequencia], ["Local de treino", data.localTreino],
      ["Tempo de treino", data.tempoTreino], ["Prazo", data.prazo], ["Motivação", data.motivacao],
      ["Limitações", data.limitacoes], ["Refeições", data.refeicoes], ["Água", data.agua],
      ["Alimentos preferidos", data.alimentosPreferidos], ["Restrições", data.restricoes],
      ["Rotina alimentar", data.rotinaAlimentar], ["Condições de saúde", data.condicoesSaude],
      ["Medicamentos/suplementos", data.medicamentosSuplementos], ["Observações", data.observacoes],
    ];
    return ["Olá! Recebi uma nova ficha de aluno pela Tecnosaude.", "", ...fields.map(([label, value]) => `${label}: ${value || "Não informado"}`)].join("\n");
  }

  function createIdentityGate() {
    const saved = JSON.parse(localStorage.getItem("tecnosaude-identificacao") || "null");
    if (saved?.nome && saved?.telefone) {
      $("#name").value = saved.nome;
      $("#phone").value = saved.telefone;
      return;
    }

    const gate = document.createElement("div");
    gate.className = "identity-gate";
    gate.innerHTML = `<div class="identity-card" role="dialog" aria-modal="true"><div class="eyebrow">Identificação do aluno</div><h2>Antes de começar</h2><p>Informe seus dados para identificarmos sua ficha.</p><form id="identityForm"><div class="identity-field"><label for="identityName">Nome completo *</label><input id="identityName" required /></div><div class="identity-field"><label for="identityPhone">Telefone/WhatsApp com DDD *</label><input id="identityPhone" type="tel" placeholder="(11) 99999-9999" required /></div><label class="identity-consent"><input id="identityConsent" type="checkbox" required /> Autorizo o uso desses dados para identificação.</label><div class="identity-error" id="identityError"></div><button class="identity-submit" type="submit">CONTINUAR</button></form></div>`;
    document.body.appendChild(gate);

    $("#identityForm", gate).addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = $("#identityName", gate).value.trim();
      const telefone = $("#identityPhone", gate).value.trim();
      if (nome.length < 3 || telefone.replace(/\D/g, "").length < 10) {
        $("#identityError", gate).textContent = "Digite um nome válido e um telefone com DDD.";
        return;
      }
      localStorage.setItem("tecnosaude-identificacao", JSON.stringify({ nome, telefone }));
      $("#name").value = nome;
      $("#phone").value = telefone;
      gate.remove();
    });
  }

  planButtons.forEach((button) => button.addEventListener("click", () => selectPlan(button.dataset.plan)));
  continueButton.addEventListener("click", () => $("#formulario").scrollIntoView({ behavior: "smooth" }));

  nextButton.addEventListener("click", () => {
    if (!selectedPlan) {
      alert("Escolha um plano antes de continuar.");
      $("#planos").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!validateStep()) return;
    if (currentStep < CONFIG.totalSteps) {
      currentStep += 1;
      updateStep();
      $(".form-card").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  previousButton.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      updateStep();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("tecnosaude-formulario", JSON.stringify(data));
    const phone = CONFIG.whatsappNumber.replace(/\D/g, "");

    if (!phone || phone === "5511999999999") {
      alert("Formulário preenchido. Configure seu número real no arquivo script.js para enviar pelo WhatsApp.");
      return;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(messageForWhatsApp(data))}`, "_blank", "noopener,noreferrer");
    form.style.display = "none";
    $(".progress-area").style.display = "none";
    successMessage.classList.add("visible");
  });

  const savedPlan = localStorage.getItem("tecnosaude-plano");
  if (savedPlan) selectPlan(savedPlan);
  updateStep();
  createIdentityGate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTecnosaude);
} else {
  initTecnosaude();
}
