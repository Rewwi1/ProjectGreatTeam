// common.js - Общий скрипт для страниц инструкций
document.addEventListener('DOMContentLoaded', function() {
    // Определяем платформу по data-platform на body
    const platform = document.body.dataset.platform || 'vk'; // default vk
    const storageKey = platform + '-view';

    // === ЛОГИКА ПЕРЕКЛЮЧАТЕЛЯ ===
    const radios = document.querySelectorAll('input[name="view-mode"]');
    const body = document.body;

    function updateView(mode) {
        body.className = mode === 'pc' ? 'view-pc' : 'view-phone';
        localStorage.setItem(storageKey, mode);
    }

    radios.forEach(radio => {
        radio.addEventListener('change', e => updateView(e.target.value));
    });

    // Восстановление выбора
    const saved = localStorage.getItem(storageKey) || 'phone';
    const activeRadio = document.querySelector(`input[name="view-mode"][value="${saved}"]`);
    if (activeRadio) { activeRadio.checked = true; updateView(saved); }
    else { updateView(saved); }

    // === НАВИГАЦИЯ И ПОДСВЕТКА (только если есть .steps-nav) ===
    const navLinks = document.querySelectorAll('.steps-nav a');
    const sections = document.querySelectorAll('.step-section');

    if (navLinks.length > 0 && sections.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
            });
            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').includes(current)) a.classList.add('active');
            });
        });
    }
});