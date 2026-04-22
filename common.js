document.addEventListener('DOMContentLoaded', function () {
    // === КНОПКА "НАВЕРХ" ===
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑ Наверх';
    backToTopButton.classList.add('back-to-top', 'back-btn');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 300);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === ДЕТЕКТОР ФИШИНГА (Drag & Drop) ===
    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
        const phishingCards = [
            { text: 'Твой аккаунт заблокируют за 10 минут! Срочно перейди по ссылке.', type: 'danger' },
            { text: 'Проверь настройки приватности и включи 2FA.', type: 'safe' },
            { text: 'Скинь код из SMS, чтобы подтвердить личность.', type: 'danger' },
            { text: 'Обнови приложение только через официальный магазин.', type: 'safe' },
            { text: 'Ты выиграл приз! Открой вложение прямо сейчас.', type: 'danger' },
            { text: 'Используй уникальный пароль для каждого аккаунта.', type: 'safe' }
        ];

        const safeZone = document.getElementById('safeZone');
        const dangerZone = document.getElementById('dangerZone');
        const dragResult = document.getElementById('dragResult');

        let dragScore = 0;

        function renderDragCards() {
            cardsContainer.innerHTML = '';
            phishingCards.forEach((card, index) => {
                const el = document.createElement('div');
                el.className = 'drag-card';
                el.draggable = true;
                el.textContent = card.text;
                el.dataset.type = card.type;
                el.dataset.index = index;

                el.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify({ index, type: card.type }));
                });

                cardsContainer.appendChild(el);
            });
        }

        function setupDragZone(zone) {
            if (!zone) return;
            const dropWrapper = zone.parentElement;

            dropWrapper.addEventListener('dragover', (e) => e.preventDefault());

            dropWrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                const raw = e.dataTransfer.getData('text/plain');
                if (!raw) return;

                const data = JSON.parse(raw);
                const card = document.querySelector(`.drag-card[data-index="${data.index}"]`);
                if (!card || card.parentElement !== cardsContainer) return;

                const isCorrect = data.type === dropWrapper.dataset.answer;
                if (isCorrect) {
                    zone.appendChild(card);
                    card.style.opacity = '0.7';
                    card.draggable = false;
                    dragScore++;
                    dragResult.innerHTML = dragScore === phishingCards.length 
                        ? '<h4>Результат</h4><p>Отлично! Ты распознал все фишинговые сообщения.</p>'
                        : `<h4>Результат</h4><p>Верно! Очков: ${dragScore} из ${phishingCards.length}</p>`;
                } else {
                    dragResult.innerHTML = '<h4>Результат</h4><p>Неверно. Подумай, безопасно ли это сообщение.</p>';
                }
            });
        }

        setupDragZone(safeZone);
        setupDragZone(dangerZone);
        renderDragCards();
    }

    // === ЧТО ОПАСНЕЕ? ===
    const compareGame = document.getElementById('compareGame');
    if (compareGame) {
        const comparePairs = [
            { left: 'Открыть ссылку от незнакомца', right: 'Поставить длинный пароль', dangerous: 'left' },
            { left: 'Сказать код из SMS', right: 'Включить 2FA', dangerous: 'left' },
            { left: 'Закрыть профиль', right: 'Публиковать номер телефона в открытом доступе', dangerous: 'right' },
            { left: 'Проверить устройства входа', right: 'Игнорировать уведомление о подозрительном входе', dangerous: 'right' }
        ];

        const compareResult = document.getElementById('compareResult');
        let compareScore = 0;
        let compareAnswered = 0;

        comparePairs.forEach(pair => {
            const row = document.createElement('div');
            row.className = 'compare-row';
            row.innerHTML = `
                <button class="compare-btn" data-choice="left" type="button">${pair.left}</button>
                <span>VS</span>
                <button class="compare-btn" data-choice="right" type="button">${pair.right}</button>
            `;

            row.querySelectorAll('.compare-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (row.dataset.done === 'true') return;
                    row.dataset.done = 'true';
                    compareAnswered++;

                    const isCorrect = btn.dataset.choice === pair.dangerous;
                    btn.style.background = isCorrect ? '#32a852' : '#d94b4b';
                    if (compareResult) {
                        compareResult.innerHTML = compareAnswered === comparePairs.length
                            ? `<h4>Результат</h4><p>Раунд завершён. Итог: ${compareScore} из ${comparePairs.length}</p>`
                            : `<h4>Результат</h4><p>${isCorrect ? 'Верно' : 'Неверно'}! Счёт: ${isCorrect ? ++compareScore : compareScore} из ${comparePairs.length}</p>`;
                    }
                });
            });

            compareGame.appendChild(row);
        });
    }

    // === ГЕНЕРАТОР И ПРОВЕРКА ПАРОЛЯ ===
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        const passwordParts = document.getElementById('passwordParts');
        const meterFill = document.getElementById('meterFill');
        const meterText = document.getElementById('meterText');
        const generatePasswordBtn = document.getElementById('generatePasswordBtn');
        const clearPasswordBtn = document.getElementById('clearPasswordBtn');

        const criteria = [
            { label: 'A-Z', regex: /[A-Z]/ },
            { label: 'a-z', regex: /[a-z]/ },
            { label: '0-9', regex: /\d/ },
            { label: '!@#', regex: /[!@#$%&*?]/ },
            { label: 'Длина 12+', regex: /.{12,}/ }
        ];

        function renderCriteria() {
            passwordParts.innerHTML = '';
            criteria.forEach(criterion => {
                const el = document.createElement('div');
                el.className = 'password-criterion';
                el.textContent = criterion.label;
                el.dataset.criterion = criterion.label;
                passwordParts.appendChild(el);
            });
        }

        function checkCriteria(pass) {
            criteria.forEach(criterion => {
                const el = document.querySelector(`[data-criterion="${criterion.label}"]`);
                if (el) {
                    el.classList.toggle('active', criterion.regex.test(pass));
                }
            });
        }

        function generatePassword() {
            const chars = {
                upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
                lower: 'abcdefghijkmnopqrstuvwxyz',
                digits: '23456789',
                symbols: '!@#$%&*?'
            };

            let result = '';
            result += chars.upper[Math.floor(Math.random() * chars.upper.length)];
            result += chars.lower[Math.floor(Math.random() * chars.lower.length)];
            result += chars.digits[Math.floor(Math.random() * chars.digits.length)];
            result += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

            const pool = chars.upper + chars.lower + chars.digits + chars.symbols;
            while (result.length < 14) {
                result += pool[Math.floor(Math.random() * pool.length)];
            }

            return result.split('').sort(() => Math.random() - 0.5).join('');
        }

        function generatePassword() {
            let pool = '';
            let result = '';

            parts.forEach(part => {
                if (selected.has(part.label)) {
                    pool += part.value;
                    result += part.value[Math.floor(Math.random() * part.value.length)];
                }
            });

            if (!pool) return '';

            const length = selected.has('Длина 12+') ? 14 : 8;
            while (result.length < length) {
                result += pool[Math.floor(Math.random() * pool.length)];
            }

            return result.split('').sort(() => Math.random() - 0.5).join('');
        }

        function evaluatePassword(pass) {
            if (!pass) return { score: 0, text: '—' };

            let score = 0;
            if (pass.length >= 12) score += 40;
            if (pass.length >= 16) score += 10;
            if (/[A-Z]/.test(pass)) score += 15;
            if (/[a-z]/.test(pass)) score += 15;
            if (/\d/.test(pass)) score += 15;
            if (/[!@#$%&*?]/.test(pass)) score += 15;

            if (/^(.)\1+$/.test(pass)) score -= 20;
            if (/123456|qwerty|password|admin|111111/i.test(pass)) score -= 25;

            score = Math.max(0, Math.min(score, 100));
            const text = score < 30 ? 'Слабый' : score < 60 ? 'Средний' : score < 85 ? 'Хороший' : 'Очень сильный';

            return { score, text };
        }

        function updateMeter(pass) {
            if (!pass) {
                meterFill.style.width = '0%';
                meterFill.style.background = 'red';
                meterText.textContent = 'Сила пароля: —';
                return;
            }

            const { score, text } = evaluatePassword(pass);
            meterFill.style.width = `${score}%`;
            meterFill.style.background = score < 40 ? 'red' : score < 70 ? 'orange' : '#32a852';
            meterText.textContent = `Сила пароля: ${text}`;
        }

        function updatePassword() {
            const pass = generatePassword();
            passwordInput.value = pass;
            updateMeter(pass);
            checkCriteria(pass);
        }

        passwordInput.removeAttribute('readonly');
        passwordInput.addEventListener('input', () => {
            updateMeter(passwordInput.value);
            checkCriteria(passwordInput.value);
        });
        generatePasswordBtn?.addEventListener('click', updatePassword);
        clearPasswordBtn?.addEventListener('click', () => {
            passwordInput.value = '';
            updateMeter('');
            checkCriteria('');
        });

        renderCriteria();
        updateMeter(passwordInput.value);
        checkCriteria(passwordInput.value);
    }

    // === ПЕРЕКЛЮЧАТЕЛЬ ВИДА (ТЕЛЕФОН/ПК) ===
    const viewSwitcher = document.querySelector('.view-switcher');
    const radioButtons = document.querySelectorAll('input[name="view-mode"]');
    const screenshotsList = document.querySelectorAll('.screenshots-list');

    if (viewSwitcher && radioButtons.length > 0) {
        const savedView = localStorage.getItem('view-mode') || 'phone';
        document.body.classList.add('view-' + savedView);

        radioButtons.forEach(btn => {
            btn.checked = (btn.value === savedView);
            btn.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const viewMode = e.target.value;
                    document.body.classList.remove('view-phone', 'view-pc');
                    document.body.classList.add('view-' + viewMode);
                    localStorage.setItem('view-mode', viewMode);

                    screenshotsList.forEach(list => {
                        list.style.opacity = '0.6';
                        setTimeout(() => list.style.opacity = '1', 150);
                    });
                }
            });
        });
    }
});
