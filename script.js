const totalSteps = 5;
let currentStep = 1;
let selectedPlan = "";
const WHATSAPP_NUMBER = "5511999999999"; // Substitua pelo seu WhatsApp, com DDI e DDD.

const loadStylesheet = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

["premium.css", "site-enhancements.css", "motion.css"].forEach(loadStylesheet);

const form = document.getElementById("studentForm");
const formSteps = document.querySelectorAll(".form-step");
const planButtons = document.querySelectorAll(".choose-plan");
const selectedPlanBox = document.getElementById("selectedPlan");
const selectedPlanName = document.getElementById("selectedPlanName");
const continueButton = document.getElementById("continueButton");
const planInput = document.getElementById("planInput");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const submitButton = document.getElementById("submitButton");
const stepLabel = document.getElementById("stepLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const successMessage = document.getElementById("successMessage");

function createIdentificationGate() {
  const style = document.createElement("style");
  style.textContent = `
    .identity-gate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(5,7,8,.92);backdrop-filter:blur(12px)}
    .identity-card{width:min(480px,100%);padding:34px;background:#111516;color:#f5f7f2;border:1px solid rgba(183,243,74,.35);border-radius:22px;box-shadow:0 25px 80px #000;animation:identity-in .45s ease both}
    .identity-card h2{margin:0 0 8px;font-size:2rem;line-height:1.05}.identity-card p{margin:0 0 24px;color:#a6afab}.identity-field{display:grid;gap:7px;margin:14px 0}.identity-field label{font-size:.85rem;font-weight:700}.identity-field input{width:100%;padding:13px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:#242b2c;color:#fff;outline:0}.identity-field input:focus{border-color:#b7f34a;box-shadow:0 0 0 3px rgba(183,243,74,.1)}.identity-error{min-height:20px;color:#ff7676;font-size:.82rem}.identity-submit{width:100%;border:0;border-radius:999px;padding:14px;background:#b7f34a;color:#10140c;font-weight:900;cursor:pointer}.identity-submit:hover{background:#c9ff6a}@keyframes identity-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  `;
  document.head.appendChild(style);

  const gate = document.createElement("div");
  gate.className = "identity-gate";
  gate.innerHTML = `
    <div class="identity-card" role="dialog" aria-modal="true" aria-labelledby="identity-title">
      <div class="eyebrow">Identificação do aluno</div>
      <h2 id="identity-title">Antes de começar</h2>
      <p>Informe seu nome e telefone para identificarmos seu cadastro.</p>
      <form id="identityForm">
        <div class="identity-field"><label for="identityName">Nome completo *</label><input id="identityName" type="text" autocomplete="name" required /></div>
        <div class="identity-field"><label for="identityPhone">Número de telefone/WhatsApp *</label><input id="identityPhone" type="tel" autocomplete="tel" placeholder="(11) 99999-9999" required /></div>
        <div class="identity-error" id="identityError" aria-live="polite"></div>
        <button class="identity-submit" type="submit">CONTINUAR</button>
      </form>
    </div>`;
  document.body.appendChild(gate);

  document.getElementById("identityForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("identityName").value.trim();
    const phone = document.getElementById("identityPhone").value.trim();
    const error = document.getElementById("identityError");
    const digits = phone.replace(/\D/g, "");

    if (name.length < 3 || digits.length < 10) {
      error.textContent = "Digite um nome válido e um telefone com DDD.";
      return;
    }

    const nameField = document.getElementById("name");
    const phoneField = document.getElementById("phone");
    if (nameField) nameField.value = name;
    if (phoneField) phoneField.value = phone;
    localStorage.setItem("tecnosaude-identificacao", JSON.stringify({ nome: name, telefone: phone }));
    gate.remove();
    document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
  });
}

function selectPlan(plan) {
  selectedPlan = plan;
  if (planInput) planInput.value = plan;
  if (selectedPlanName) selectedPlanName.textContent = plan;
  selectedPlanBox?.classList.add("visible");
  document.querySelectorAll(".plan").forEach((card) => {
    card.classList.toggle("selected", card.querySelector("[data-plan]")?.dataset.plan === plan);
  });
  localStorage.setItem("tecnosaude-plano", plan);
}

function updateForm() {
  formSteps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === currentStep));
  const percentage = currentStep / totalSteps * 100;
  if (stepLabel) stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  if (progressPercent) progressPercent.textContent = `${Math.round(percentage)}%`;
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (previousButton) previousButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
  if (nextButton) nextButton.hidden = currentStep === totalSteps;
  if (submitButton) submitButton.hidden = currentStep !== totalSteps;
}

function validateStep() {
  const active = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  for (const field of active.querySelectorAll("input[required],select[required],textarea[required]")) {
    if (!field.checkValidity()) { field.reportValidity(); return false; }
  }
  return true;
}

function buildWhatsAppMessage(data) {
  const labels = { plano:"Plano", nome:"Nome", email:"E-mail", whatsapp:"Telefone", dataNascimento:"Nascimento", objetivo:"Objetivo", peso:"Peso", altura:"Altura", nivel:"Nível", frequencia:"Frequência", prazo:"Prazo", motivacao:"Motivação", limitacoes:"Limitações", refeicoes:"Refeições", agua:"Água", alimentosPreferidos:"Alimentos", restricoes:"Restrições", rotinaAlimentar:"Rotina", condicoesSaude:"Saúde", medicamentosSuplementos:"Medicamentos/Suplementos", observacoes:"Observações" };
  return ["Olá! Nova inscrição na Tecnosaude.", "", ...Object.entries(labels).map(([key, label]) => `${label}: ${data[key] || "Não informado"}`)].join("\n");
}

planButtons.forEach((button) => button.addEventListener("click", () => selectPlan(button.dataset.plan)));
continueButton?.addEventListener("click", () => document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" }));
nextButton?.addEventListener("click", () => {
  if (!selectedPlan) { alert("Escolha um plano antes de continuar."); document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" }); return; }
  if (!validateStep()) return;
  if (currentStep < totalSteps) { currentStep += 1; updateForm(); document.querySelector(".form-card")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
});
previousButton?.addEventListener("click", () => { if (currentStep > 1) { currentStep -= 1; updateForm(); } });

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem("tecnosaude-formulario", JSON.stringify(data));
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (phone && phone !== "5511999999999") window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`, "_blank");
  form.style.display = "none";
  document.querySelector(".progress-area")?.style && (document.querySelector(".progress-area").style.display = "none");
  successMessage?.classList.add("visible");
});

const savedPlan = localStorage.getItem("tecnosaude-plano");
if (savedPlan) selectPlan(savedPlan);
updateForm();
if (!localStorage.getItem("tecnosaude-identificacao")) createIdentificationGate();
