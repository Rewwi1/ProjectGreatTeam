document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;

    // === КНОПКА "НАВЕРХ" ===
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑ Наверх';
    backToTopButton.classList.add('back-to-top', 'back-btn');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === ИНТЕРАКТИВЫ ===
    const cardsContainer = document.getElementById('cardsContainer');
    const compareGame = document.getElementById('compareGame');
    const passwordInput = document.getElementById('passwordInput');

    // ----------------------------
    // 1) ДЕТЕКТОР ФИШИНГА
    // ----------------------------
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
        const dragTotal = phishingCards.length;

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
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        index,
                        type: card.type
                    }));
                });

                cardsContainer.appendChild(el);
            });
        }

        [safeZone, dangerZone].forEach(zone => {
            if (!zone) return;

            const dropWrapper = zone.parentElement;

            dropWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            dropWrapper.addEventListener('drop', (e) => {
                e.preventDefault();

                const raw = e.dataTransfer.getData('text/plain');
                if (!raw) return;

                const data = JSON.parse(raw);
                const targetType = dropWrapper.dataset.answer;

                const card = document.querySelector(`.drag-card[data-index="${data.index}"]`);
                if (!card || card.parentElement !== cardsContainer) return;

                if (data.type === targetType) {
                    zone.appendChild(card);
                    card.style.opacity = '0.7';
                    card.draggable = false;
                    dragScore++;

                    if (dragResult) {
                        dragResult.innerHTML = `<h4>Результат</h4><p>Верно! Очков: ${dragScore} из ${dragTotal}</p>`;
                    }

                    if (dragScore === dragTotal && dragResult) {
                        dragResult.innerHTML = '<h4>Результат</h4><p>Отлично! Ты распознал все фишинговые сообщения.</p>';
                    }
                } else {
                    if (dragResult) {
                        dragResult.innerHTML = '<h4>Результат</h4><p>Неверно. Подумай, безопасно ли это сообщение.</p>';
                    }
                }
            });
        });

        renderDragCards();
    }

    // ----------------------------
    // 2) ЧТО ОПАСНЕЕ?
    // ----------------------------
    if (compareGame) {
        const comparePairs = [
            {
                left: 'Открыть ссылку от незнакомца',
                right: 'Поставить длинный пароль',
                dangerous: 'left'
            },
            {
                left: 'Сказать код из SMS',
                right: 'Включить 2FA',
                dangerous: 'left'
            },
            {
                left: 'Закрыть профиль',
                right: 'Публиковать номер телефона в открытом доступе',
                dangerous: 'right'
            },
            {
                left: 'Проверить устройства входа',
                right: 'Игнорировать уведомление о подозрительном входе',
                dangerous: 'right'
            }
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

                    const choice = btn.dataset.choice;
                    if (choice === pair.dangerous) {
                        compareScore++;
                        btn.style.background = '#32a852';
                        if (compareResult) {
                            compareResult.innerHTML = `<h4>Результат</h4><p>Верно! Счёт: ${compareScore} из ${comparePairs.length}</p>`;
                        }
                    } else {
                        btn.style.background = '#d94b4b';
                        if (compareResult) {
                            compareResult.innerHTML = `<h4>Результат</h4><p>Неверно. Счёт: ${compareScore} из ${comparePairs.length}</p>`;
                        }
                    }

                    if (compareAnswered === comparePairs.length && compareResult) {
                        compareResult.innerHTML = `<h4>Результат</h4><p>Раунд завершён. Итог: ${compareScore} из ${comparePairs.length}</p>`;
                    }
                });
            });

            compareGame.appendChild(row);
        });
    }

    // ----------------------------
    // 3) ПАРОЛЬ: ВВОД + ГЕНЕРАЦИЯ + ПРОВЕРКА
    // ----------------------------
    if (passwordInput) {
        const passwordParts = document.getElementById('passwordParts');
        const meterFill = document.getElementById('meterFill');
        const meterText = document.getElementById('meterText');
        const generatePasswordBtn = document.getElementById('generatePasswordBtn');
        const clearPasswordBtn = document.getElementById('clearPasswordBtn');

        const parts = [
            { label: 'A-Z', value: 'ABCDEFGHJKLMNPQRSTUVWXYZ' },
            { label: 'a-z', value: 'abcdefghijkmnopqrstuvwxyz' },
            { label: '0-9', value: '23456789' },
            { label: '!@#', value: '!@#$%&*?' },
            { label: 'Длина 12+', value: 'length12' }
        ];

        const selected = new Set(['A-Z', 'a-z', '0-9', '!@#']);

        function randomChar(chars) {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        function renderParts() {
            if (!passwordParts) return;

            passwordParts.innerHTML = '';
            parts.forEach(part => {
                const el = document.createElement('div');
                el.className = 'password-part' + (selected.has(part.label) ? ' active' : '');
                el.textContent = part.label;

                el.addEventListener('click', () => {
                    if (selected.has(part.label)) selected.delete(part.label);
                    else selected.add(part.label);

                    renderParts();
                    updatePassword();
                });

                passwordParts.appendChild(el);
            });
        }

        function generatePassword() {
            const useUpper = selected.has('A-Z');
            const useLower = selected.has('a-z');
            const useDigits = selected.has('0-9');
            const useSymbols = selected.has('!@#');
            const long = selected.has('Длина 12+');

            let pool = '';
            let result = '';

            if (useUpper) pool += parts[0].value;
            if (useLower) pool += parts[1].value;
            if (useDigits) pool += parts[2].value;
            if (useSymbols) pool += parts[3].value;

            if (!pool) return '';

            const length = long ? 14 : 8;

            if (useUpper) result += randomChar(parts[0].value);
            if (useLower) result += randomChar(parts[1].value);
            if (useDigits) result += randomChar(parts[2].value);
            if (useSymbols) result += randomChar(parts[3].value);

            while (result.length < length) {
                result += randomChar(pool);
            }

            return result.split('').sort(() => Math.random() - 0.5).join('');
        }

        function evaluatePassword(pass) {
            if (!pass) {
                return { score: 0, text: '—' };
            }

            let score = 0;

            // длина
            if (pass.length >= 8) score += 20;
            if (pass.length >= 12) score += 20;
            if (pass.length >= 16) score += 10;

            // типы символов
            if (/[A-Z]/.test(pass)) score += 15;
            if (/[a-z]/.test(pass)) score += 15;
            if (/\d/.test(pass)) score += 15;
            if (/[^A-Za-z0-9]/.test(pass)) score += 15;

            // штрафы за очевидно слабые пароли
            if (/^(.)\1+$/.test(pass)) score -= 20;
            if (/123456|qwerty|password|admin|111111/i.test(pass)) score -= 25;
            if (pass.length < 8) score -= 20;

            score = Math.max(0, Math.min(score, 100));

            let text = '';
            if (score < 30) text = 'Слабый';
            else if (score < 60) text = 'Средний';
            else if (score < 85) text = 'Хороший';
            else text = 'Очень сильный';

            return { score, text };
        }

        function updateMeter(pass) {
            if (!meterFill || !meterText) return;

            if (!pass) {
                meterFill.style.width = '0%';
                meterFill.style.background = 'red';
                meterText.textContent = 'Сила пароля: —';
                return;
            }

            const data = evaluatePassword(pass);
            meterFill.style.width = `${data.score}%`;

            if (data.score < 40) meterFill.style.background = 'red';
            else if (data.score < 70) meterFill.style.background = 'orange';
            else meterFill.style.background = '#32a852';

            meterText.textContent = `Сила пароля: ${data.text}`;
        }

        function updatePassword() {
            const pass = generatePassword();
            passwordInput.value = pass;
            updateMeter(pass);
        }

        passwordInput.removeAttribute('readonly');
        passwordInput.addEventListener('input', () => {
            updateMeter(passwordInput.value);
        });

        if (generatePasswordBtn) {
            generatePasswordBtn.addEventListener('click', updatePassword);
        }

        if (clearPasswordBtn) {
            clearPasswordBtn.addEventListener('click', () => {
                passwordInput.value = '';
                updateMeter('');
            });
        }

        renderParts();
        updateMeter(passwordInput.value);
    }
});
