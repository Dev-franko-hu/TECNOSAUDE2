const CONFIG = {
  whatsappNumber: "5511999999999", // troque pelo seu número real com DDI e DDD
  totalSteps: 5,
};

let currentStep = 1;
let selectedPlan = "";

document.addEventListener("DOMContentLoaded", () => {
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

  function ensureStyle(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }

  ["premium.css", "site-enhancements.css", "motion.css"].forEach(ensureStyle);

  function selectPlan(plan) {
    selectedPlan = plan;
    planInput.value = plan;
    selectedPlanName.textContent = plan;
    selectedPlanBox.classList.add("visible");

    $$(".plan").forEach((card) => {
      const button = $("[data-plan]", card);
      card.classList.toggle("selected", button?.dataset.plan === plan);
    });

    localStorage.setItem("tecnosaude-plano", plan);
  }

  function updateStep() {
    steps.forEach((step) => {
      const active = Number(step.dataset.step) === currentStep;
      step.classList.toggle("active", active);
      step.style.display = active ? "block" : "none";
    });

    const percent = Math.round((currentStep / CONFIG.totalSteps) * 100);
    progressLabel.textContent = `Etapa ${currentStep} de ${CONFIG.totalSteps}`;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    previousButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
    nextButton.hidden = currentStep === CONFIG.totalSteps;
    submitButton.hidden = currentStep !== CONFIG.totalSteps;
  }

  function validateStep() {
    const activeStep = $(".form-step.active");
    if (!activeStep) return false;

    const requiredFields = $$("input[required], select[required], textarea[required]", activeStep);
    for (const field of requiredFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  }

  function buildWhatsAppMessage(data) {
    const fields = [
      ["Plano", data.plano],
      ["Nome", data.nome],
      ["Telefone", data.whatsapp],
      ["E-mail", data.email],
      ["Nascimento", data.dataNascimento],
      ["Objetivo", data.objetivo],
      ["Peso", data.peso ? `${data.peso} kg` : "Não informado"],
      ["Altura", data.altura ? `${data.altura} cm` : "Não informado"],
      ["Nível", data.nivel],
      ["Frequência", data.frequencia],
      ["Local de treino", data.localTreino],
      ["Tempo de treino", data.tempoTreino],
      ["Prazo", data.prazo],
      ["Motivação", data.motivacao],
      ["Limitações", data.limitacoes],
      ["Refeições", data.refeicoes],
      ["Água", data.agua],
      ["Alimentos preferidos", data.alimentosPreferidos],
      ["Restrições", data.restricoes],
      ["Rotina alimentar", data.rotinaAlimentar],
      ["Condições de saúde", data.condicoesSaude],
      ["Medicamentos/suplementos", data.medicamentosSuplementos],
      ["Observações", data.observacoes],
    ];

    return [
      "Olá! Recebi uma nova ficha de aluno pela Tecnosaude.",
      "",
      ...fields.map(([label, value]) => `${label}: ${value || "Não informado"}`),
      "",
      "Mensagem gerada automaticamente pelo site.",
    ].join("\n");
  }

  function openWhatsApp(data) {
    const phone = CONFIG.whatsappNumber.replace(/\D/g, "");
    if (!phone || phone === "5511966205035") {
      alert("Configure o seu número real do WhatsApp no arquivo script.js.");
      return false;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function createIdentityGate() {
    const saved = JSON.parse(localStorage.getItem("tecnosaude-identificacao") || "null");
    if (saved?.nome && saved?.telefone) {
      $("#name").value = saved.nome;
      $("#phone").value = saved.telefone;
      return;
    }

    const gateStyle = document.createElement("style");
    gateStyle.textContent = `
      .identity-gate {
        position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center;
        background: rgba(5, 7, 8, 0.94); backdrop-filter: blur(12px); padding: 20px;
      }
      .identity-card {
        width: min(480px, 100%); background: #111516; color: #f5f7f2;
        border: 1px solid rgba(183, 243, 74, 0.38); border-radius: 22px;
        box-shadow: 0 25px 80px rgba(0,0,0,0.6); padding: 34px;
      }
      .identity-card h2 { margin: 0 0 8px; font-size: 2rem; }
      .identity-card p { margin: 0 0 20px; color: #a6afab; }
      .identity-field { display: grid; gap: 7px; margin: 14px 0; }
      .identity-field label { font-size: 0.85rem; font-weight: 700; }
      .identity-field input { width: 100%; padding: 13px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: #242b2c; color: #fff; }
      .identity-field input:focus { outline: none; border-color: #b7f34a; box-shadow: 0 0 0 3px rgba(183,243,74,0.12); }
      .identity-consent { display: flex; align-items: flex-start; gap: 8px; color: #a6afab; font-size: 0.78rem; margin: 14px 0; }
      .identity-consent input { margin-top: 3px; accent-color: #b7f34a; }
      .identity-error { min-height: 20px; color: #ff7676; font-size: 0.82rem; }
      .identity-submit { width: 100%; padding: 14px; border: 0; border-radius: 999px; background: #b7f34a; color: #10140c; font-weight: 900; cursor: pointer; }
      .identity-submit:hover { background: #c9ff6a; }
    `;
    document.head.appendChild(gateStyle);

    const gate = document.createElement("div");
    gate.className = "identity-gate";
    gate.innerHTML = `
      <div class="identity-card" role="dialog" aria-modal="true">
        <div class="eyebrow">Identificação do aluno</div>
        <h2>Antes de começar</h2>
        <p>Informe seu nome e telefone para identificarmos seu cadastro.</p>
        <form id="identityForm">
          <div class="identity-field">
            <label for="identityName">Nome completo *</label>
            <input id="identityName" type="text" autocomplete="name" required />
          </div>
          <div class="identity-field">
            <label for="identityPhone">Telefone/WhatsApp *</label>
            <input id="identityPhone" type="tel" autocomplete="tel" placeholder="(11) 99999-9999" required />
          </div>
          <label class="identity-consent">
            <input id="identityConsent" type="checkbox" required />
            Autorizo o uso desses dados para identificação e contato.
          </label>
          <div class="identity-error" id="identityError" aria-live="polite"></div>
          <button class="identity-submit" type="submit">CONTINUAR</button>
        </form>
      </div>
    `;
    document.body.appendChild(gate);

    $("#identityForm", gate).addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = $("#identityName", gate).value.trim();
      const telefone = $("#identityPhone", gate).value.trim();
      const digits = telefone.replace(/\D/g, "");

      const error = $("#identityError", gate);

      if (nome.length < 3 || digits.length < 10) {
        error.textContent = "Digite um nome válido e um telefone com DDD.";
        return;
      }

      localStorage.setItem("tecnosaude-identificacao", JSON.stringify({ nome, telefone }));
      $("#name").value = nome;
      $("#phone").value = telefone;
      gate.remove();
      $("#planos")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  planButtons.forEach((button) => {
    button.addEventListener("click", () => selectPlan(button.dataset.plan));
  });

  continueButton?.addEventListener("click", () => {
    $("#formulario")?.scrollIntoView({ behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    if (!selectedPlan) {
      alert("Escolha um plano antes de continuar.");
      $("#planos")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!validateStep()) return;

    if (currentStep < CONFIG.totalSteps) {
      currentStep += 1;
      updateStep();
      $(".form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    if (!openWhatsApp(data)) {
      form.style.display = "none";
      $(".progress-area").style.display = "none";
      successMessage.classList.add("visible");
      return;
    }

    form.style.display = "none";
    $(".progress-area").style.display = "none";
    successMessage.classList.add("visible");
  });

  const savedPlan = localStorage.getItem("tecnosaude-plano");
  if (savedPlan) {
    selectPlan(savedPlan);
  }

  updateStep();
  createIdentityGate();
});
