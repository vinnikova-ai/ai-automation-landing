(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$('[data-scroll]').forEach(b =>
    b.addEventListener('click', () => document.getElementById(b.dataset.scroll).scrollIntoView()));

  // ---- Калькулятор ----
  const boxes = $$('#calc input[type=checkbox]');
  const fmt = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  function calc() {
    const sum = boxes.filter(b => b.checked).reduce((s, b) => s + Number(b.dataset.price), 0);
    $('#total').textContent = fmt(sum);
  }
  boxes.forEach(b => b.addEventListener('change', calc));
  calc();

  // ---- Квиз ----
  const steps = $$('.quiz-step'), next = $('#quiz-next');
  const picked = [];
  let cur = 0;
  function render() {
    steps.forEach((s, i) => (s.hidden = i !== cur));
    next.disabled = !picked[cur];
    next.textContent = cur === steps.length - 1 ? 'Показать расчёт' : 'Далее';
    $('#quiz-count').textContent = `Шаг ${cur + 1} из ${steps.length}`;
    $('#quiz-bar').style.width = ((cur + 1) / steps.length) * 100 + '%';
  }
  steps.forEach((step, i) => step.addEventListener('click', e => {
    const opt = e.target.closest('.opt');
    if (!opt) return;
    $$('.opt', step).forEach(o => o.classList.toggle('active', o === opt));
    picked[i] = opt;
    next.disabled = false;
  }));
  next.addEventListener('click', () => {
    if (cur < steps.length - 1) { cur++; render(); return; }
    // финал: отмечаем в калькуляторе компоненты, подходящие под ответы
    picked.forEach(o => { const a = o.dataset.addon; if (a) $('#addon-' + a).checked = true; });
    calc();
    document.getElementById('calc').scrollIntoView();
  });
  render();

  // ---- Лид-форма ----
  const form = $('#lead-form'), status = $('#lead-status');
  const say = (t, err) => { status.textContent = t; status.classList.toggle('err', !!err); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name')).trim();
    const tg = String(fd.get('telegram')).trim().replace(/^@/, '');
    if (!name || !/^[A-Za-z]\w{4,31}$/.test(tg)) {
      say('Укажите имя и Telegram в формате @username (от 5 символов, латиницей).', true);
      return;
    }
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, telegram: '@' + tg }),
      });
      if (!r.ok) throw new Error(r.status);
      say('Заявка принята. Отправим гайд в Telegram.');
      form.reset();
    } catch {
      say('Не удалось отправить заявку. Попробуйте ещё раз чуть позже.', true);
    }
  });
})();
