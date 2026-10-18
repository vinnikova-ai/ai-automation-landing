let quizAnswers = {
  businessType: "",
  automationTarget: "",
  platformType: ""
};

let currentStep = 1;

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function nextQuizStep(selectedValue) {
  if (currentStep === 1) {
    quizAnswers.businessType = selectedValue;
    currentStep = 2;
    renderQuizStep("Шаг 2 из 3", "Что в бизнесе нужно автоматизировать?", [
      { title: "Сбор и обработка заявок", desc: "Захват лидов, авто-ответы клиентам, интеграция форм." },
      { title: "Ведение CRM и аналитики", desc: "Связка логов, ведение сквозных финансовых метрик." },
      { title: "Генерация отчетов через ИИ", desc: "Автоматический сбор данных и психологические саммари." },
      { title: "Всё вышеперечисленное", desc: "Комплексная инфраструктура с базами данных и LLM." }
    ]);
  } else if (currentStep === 2) {
    quizAnswers.automationTarget = selectedValue;
    currentStep = 3;
    renderQuizStep("Шаг 3 из 3", "Где должен функционировать продукт?", [
      { title: "Текстовый Telegram-бот", desc: "Асинхронные команды и рассылки на aiogram 3." },
      { title: "Telegram Mini App (Интерфейс)", desc: "Полноценный Web App веб-интерфейс внутри чата." },
      { title: "Интеграция на текущий сайт", desc: "FastAPI эндпоинты и обработка REST API." }
    ]);
  } else if (currentStep === 3) {
    quizAnswers.platformType = selectedValue;
    applyQuizToCalculator();
  }
}

function renderQuizStep(stepText, questionText, options) {
  document.getElementById("quiz-step-title").innerText = stepText;
  document.getElementById("quiz-question").innerText = questionText;

  let container = document.getElementById("quiz-options-container");
  container.innerHTML = "";

  options.forEach(opt => {
    let card = document.createElement("div");
    card.className = "bg-[var(--card)] border border-[var(--border)] p-7 rounded-[var(--radius)] cursor-pointer transition-all hover:border-white/30 hover:-translate-y-0.5";
    card.onclick = function () { nextQuizStep(opt.title); };
    card.innerHTML = `<h3 class="m-0 mb-3 text-lg font-bold text-white tracking-tight">${opt.title}</h3><p class="m-0 text-sm text-[var(--muted-foreground)] leading-relaxed">${opt.desc}</p>`;
    container.appendChild(card);
  });
}

function applyQuizToCalculator() {
  document.getElementById("db-addon").checked = true;
  document.getElementById("ai-addon").checked = true;
  document.getElementById("ui-addon").checked = true;

  calculateTotal();
  scrollToSection("calc-section");

  currentStep = 1;
  setTimeout(() => {
    renderQuizStep("Шаг 1 из 3", "Какая у вас сфера бизнеса?", [
      { title: "EdTech / Онлайн-школы", desc: "Автоматизация расписания, контроля транзакций, оплат и AlfaCRM/AmoCRM." },
      { title: "Ритейл / E-commerce", desc: "Интеграция товарных матриц, воронки продаж и автоматическая обработка лидов." },
      { title: "Сфера услуг / Фриланс", desc: "Сбор заявок, запись клиентов и репутационный маркетинг в гео-сервисах." },
      { title: "Производство / Инженерия", desc: "Декомпозиция ТЗ, ведение проектных логов и автоматизация отчетности." }
    ]);
  }, 1000);
}

function calculateTotal() {
  let basePrice = 30000;
  let dbValue = document.getElementById('db-addon').checked ? parseInt(document.getElementById('db-addon').value) : 0;
  let aiValue = document.getElementById('ai-addon').checked ? parseInt(document.getElementById('ai-addon').value) : 0;
  let uiValue = document.getElementById('ui-addon').checked ? parseInt(document.getElementById('ui-addon').value) : 0;

  let total = basePrice + dbValue + aiValue + uiValue;
  document.getElementById('total-render').innerText = total.toLocaleString('ru-RU') + ' ₽';
}

function downloadGuide() {
  let name = document.getElementById("lead-name").value;
  let tg = document.getElementById("lead-tg").value;
  if (!name || !tg) {
    alert("Пожалуйста, заполните имя и ваш Telegram для отправки гайда!");
    return;
  }
  alert(`Спасибо, ${name}! Демонстрационный лид зафиксирован. В боевой версии бэкенд на FastAPI запишет юзернейм ${tg} в базу данных.`);
}

function submitOrder() {
  alert('MVP-концепция успешно сформирована! Данные калькулятора готовы к передаче.');
}
