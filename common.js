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

    let quizTask1Complete = false;
    let quizTask1Correct = false;
    let quizTask2Complete = false;
    let quizTask2Correct = false;
    let quizTask3Complete = false;
    let quizTask3Correct = false;
    const quizTotalResult = document.getElementById('quizTotalResult');

    const updateQuizTotalResult = () => {
        if (!quizTotalResult) return;
        if (!(quizTask1Complete && quizTask2Complete && quizTask3Complete)) {
            quizTotalResult.hidden = true;
            return;
        }
        const score = [quizTask1Correct, quizTask2Correct, quizTask3Correct].filter(Boolean).length;
        const total = 3;
        const message = score === total
            ? 'Молодец! Ты успешно прошёл викторину.'
            : score >= 1
                ? 'Хороший результат. Можно стать ещё внимательнее.'
                : 'Стоит повторить правила безопасности и попробовать снова.';
        quizTotalResult.hidden = false;
        quizTotalResult.innerHTML = `
            <h4>Общий результат</h4>
            <p>Правильных ответов: <strong>${score}</strong> из ${total}.</p>
            <p>${message}</p>
        `;
    };

    // === ДЕТЕКТОР ФИШИНГА ===
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
                el.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', JSON.stringify({ index, type: card.type })));
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
                    if (dragScore === phishingCards.length) {
                        quizTask1Complete = true;
                        quizTask1Correct = true;
                        updateQuizTotalResult();
                    }
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

        let quizTask1Complete = false;
        let quizTask1Correct = false;
        let quizTask2Complete = false;
        let quizTask2Correct = false;
        let quizTask3Complete = false;
        let quizTask3Correct = false;
        const quizTotalResult = document.getElementById('quizTotalResult');

        const updateQuizTotalResult = () => {
            if (!quizTotalResult) return;
            if (!(quizTask1Complete && quizTask2Complete && quizTask3Complete)) {
                quizTotalResult.hidden = true;
                return;
            }
            const score = [quizTask1Correct, quizTask2Correct, quizTask3Correct].filter(Boolean).length;
            const total = 3;
            const message = score === total
                ? 'Молодец! Ты успешно прошёл викторину.'
                : score >= 1
                    ? 'Хороший результат. Можно стать ещё внимательнее.'
                    : 'Стоит повторить правила безопасности и попробовать снова.';
            quizTotalResult.hidden = false;
            quizTotalResult.innerHTML = `
                <h4>Общий результат</h4>
                <p>Правильных ответов: <strong>${score}</strong> из ${total}.</p>
                <p>${message}</p>
            `;
        };

        comparePairs.forEach(pair => {
            const row = document.createElement('div');
            row.className = 'compare-row';
            row.innerHTML = `<button class="compare-btn" data-choice="left">${pair.left}</button><span>VS</span><button class="compare-btn" data-choice="right">${pair.right}</button>`;
            
            row.querySelectorAll('.compare-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (row.dataset.done === 'true') return;
                    row.dataset.done = 'true';
                    compareAnswered++;
                    const isCorrect = btn.dataset.choice === pair.dangerous;
                    if (isCorrect) compareScore++;
                    btn.style.background = isCorrect ? '#32a852' : '#d94b4b';
                    if (compareResult) {
                        compareResult.innerHTML = compareAnswered === comparePairs.length
                            ? `<h4>Результат</h4><p>Раунд завершён. Итог: ${compareScore} из ${comparePairs.length}</p>`
                            : `<h4>Результат</h4><p>${isCorrect ? 'Верно' : 'Неверно'}! Счёт: ${compareScore} из ${comparePairs.length}</p>`;
                    }
                    if (compareAnswered === comparePairs.length) {
                        quizTask2Complete = true;
                        quizTask2Correct = compareScore === comparePairs.length;
                        updateQuizTotalResult();
                    }
                });
            });
            compareGame.appendChild(row);
        });
    }

    // === ТРЕТИЙ ИНТЕРАКТИВНЫЙ ВОПРОС ===
    const scenarioQuiz = document.getElementById('scenarioQuiz');
    if (scenarioQuiz) {
        const scenarioResult = document.getElementById('scenarioQuizResult');
        scenarioQuiz.querySelectorAll('.quiz-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const correct = btn.dataset.correct === 'true';
                scenarioResult.innerHTML = `
                    <h4>Результат</h4>
                    <p>${correct ? 'Правильно! Это самое безопасное действие.' : 'Неверно. Выберите вариант, который не позволит атакующим получить доступ к аккаунту.'}</p>
                `;
                scenarioResult.classList.toggle('quiz-correct', correct);
                scenarioResult.classList.toggle('quiz-wrong', !correct);
                quizTask3Complete = true;
                quizTask3Correct = correct;
                updateQuizTotalResult();
                scenarioQuiz.querySelectorAll('.quiz-btn').forEach(button => button.disabled = true);
            });
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
            { label: 'A-Z', regex: /[A-Z]/ }, { label: 'a-z', regex: /[a-z]/ },
            { label: '0-9', regex: /\d/ }, { label: '!@#', regex: /[!@#$%&*?]/ },
            { label: 'Длина 12+', regex: /.{12,}/ }
        ];

        function renderCriteria() {
            passwordParts.innerHTML = '';
            criteria.forEach(c => {
                const el = document.createElement('div');
                el.className = 'password-criterion';
                el.textContent = c.label;
                el.dataset.criterion = c.label;
                passwordParts.appendChild(el);
            });
        }

        function checkCriteria(pass) {
            criteria.forEach(c => {
                const el = document.querySelector(`[data-criterion="${c.label}"]`);
                if (el) el.classList.toggle('active', c.regex.test(pass));
            });
        }

        function generatePassword() {
            const chars = { upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ', lower: 'abcdefghijkmnopqrstuvwxyz', digits: '23456789', symbols: '!@#$%&*?' };
            let result = chars.upper[Math.floor(Math.random()*chars.upper.length)] + chars.lower[Math.floor(Math.random()*chars.lower.length)] + chars.digits[Math.floor(Math.random()*chars.digits.length)] + chars.symbols[Math.floor(Math.random()*chars.symbols.length)];
            const pool = chars.upper + chars.lower + chars.digits + chars.symbols;
            while (result.length < 14) result += pool[Math.floor(Math.random()*pool.length)];
            return result.split('').sort(() => Math.random() - 0.5).join('');
        }

        function evaluatePassword(pass) {
            if (!pass) return { score: 0, text: '—' };
            let score = 0;
            if (pass.length >= 12) score += 40; if (pass.length >= 16) score += 10;
            if (/[A-Z]/.test(pass)) score += 15; if (/[a-z]/.test(pass)) score += 15;
            if (/\d/.test(pass)) score += 15; if (/[!@#$%&*?]/.test(pass)) score += 15;
            if (/^(.)\1+$/.test(pass)) score -= 20; if (/123456|qwerty|password|admin|111111/i.test(pass)) score -= 25;
            score = Math.max(0, Math.min(score, 100));
            const text = score < 30 ? 'Слабый' : score < 60 ? 'Средний' : score < 85 ? 'Хороший' : 'Очень сильный';
            return { score, text };
        }

        function updateMeter(pass) {
            if (!pass) { meterFill.style.width = '0%'; meterFill.style.background = 'red'; meterText.textContent = 'Сила пароля: —'; return; }
            const { score, text } = evaluatePassword(pass); 
            meterFill.style.width = `${score}%`; meterFill.style.background = score < 40 ? 'red' : score < 70 ? 'orange' : '#32a852';
            meterText.textContent = `Сила пароля: ${text}`;
        }

        function updatePassword() {
            const pass = generatePassword(); passwordInput.value = pass; updateMeter(pass); checkCriteria(pass);
        }

        passwordInput.removeAttribute('readonly');
        passwordInput.addEventListener('input', () => { updateMeter(passwordInput.value); checkCriteria(passwordInput.value); });
        generatePasswordBtn?.addEventListener('click', updatePassword);
        clearPasswordBtn?.addEventListener('click', () => { passwordInput.value = ''; updateMeter(''); checkCriteria(''); });

        renderCriteria(); updateMeter(passwordInput.value); checkCriteria(passwordInput.value);
    }

    // === ПЕРЕКЛЮЧАТЕЛЬ ВИДА ===
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
                    const v = e.target.value;
                    document.body.classList.remove('view-phone', 'view-pc');
                    document.body.classList.add('view-' + v);
                    localStorage.setItem('view-mode', v);
                    screenshotsList.forEach(l => { l.style.opacity = '0.6'; setTimeout(() => l.style.opacity = '1', 150); });
                }
            });
        });
    }

    function initScreenshotLightbox() {
        const overlay = document.createElement('div');
        overlay.className = 'image-lightbox hidden';
        overlay.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" type="button" aria-label="Закрыть">×</button>
                <button class="lightbox-prev" type="button" aria-label="Предыдущее">‹</button>
                <div class="lightbox-frame"><img src="" alt="" /></div>
                <button class="lightbox-next" type="button" aria-label="Следующее">›</button>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const imgElement = overlay.querySelector('.lightbox-frame img');
        const closeBtn = overlay.querySelector('.lightbox-close');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');
        const counter = overlay.querySelector('.lightbox-counter');
        const content = overlay.querySelector('.lightbox-content');
        let gallery = [];
        let currentIndex = 0;

        const updateLightbox = () => {
            const item = gallery[currentIndex];
            if (!item) return;
            imgElement.src = item.src;
            imgElement.alt = item.alt || '';
            counter.textContent = gallery.length > 1 ? `${currentIndex + 1} / ${gallery.length}` : '';
            content.classList.toggle('has-controls', gallery.length > 1);
        };

        const closeLightbox = () => {
            overlay.classList.add('hidden');
            document.documentElement.style.overflow = '';
        };

        const openLightbox = () => {
            overlay.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
            updateLightbox();
        };

        const visibleImages = (container) => {
            return Array.from(container.querySelectorAll('img')).filter(img => {
                const screenshot = img.closest('.screenshot');
                return screenshot && window.getComputedStyle(screenshot).display !== 'none';
            });
        };

        document.querySelectorAll('.screenshots-list').forEach(list => {
            const images = Array.from(list.querySelectorAll('img'));
            if (!images.length) return;
            images.forEach((img) => {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    const visible = visibleImages(list);
                    gallery = visible.map(el => ({ src: el.src, alt: el.alt }));
                    currentIndex = visible.indexOf(img);
                    if (currentIndex < 0) currentIndex = 0;
                    openLightbox();
                });
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            updateLightbox();
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % gallery.length;
            updateLightbox();
        });
        window.addEventListener('keydown', (e) => {
            if (overlay.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && gallery.length > 1) {
                currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
                updateLightbox();
            }
            if (e.key === 'ArrowRight' && gallery.length > 1) {
                currentIndex = (currentIndex + 1) % gallery.length;
                updateLightbox();
            }
        });
    }

    initScreenshotLightbox();

    // === ИНТЕРАКТИВНЫЙ ЧЕК-ЛИСТ (ШАГ 4) ===
    const checklistContainer = document.querySelector('.checklist-container');
    if (checklistContainer) {
        const platform = checklistContainer.dataset.platform || 'unknown';
        const storageKey = `checklist-${platform}`;
        const savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const items = checklistContainer.querySelectorAll('.checklist-item');

        const updateProgress = () => {
            const checked = checklistContainer.querySelectorAll('input:checked').length;
            const percent = items.length ? Math.round((checked / items.length) * 100) : 0;
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (progressText) progressText.textContent = `${checked} / ${items.length} выполнено`;
        };

        const saveState = () => {
            const state = {};
            checklistContainer.querySelectorAll('input').forEach(i => state[i.dataset.stepId] = i.checked);
            try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch(e) {}
            updateProgress();
        };

        items.forEach(item => {
            const cb = item.querySelector('input');
            if (savedState[cb.dataset.stepId]) { cb.checked = true; item.classList.add('completed'); }

            const toggle = () => {
                cb.checked = !cb.checked;
                item.classList.toggle('completed', cb.checked);
                cb.dispatchEvent(new Event('change'));
            };

            item.addEventListener('click', (e) => {
                if (e.target !== cb) toggle();
            });
            cb.addEventListener('change', () => { item.classList.toggle('completed', cb.checked); saveState(); });
        });
        updateProgress();
    }

    const quizForm = document.querySelector('.quiz-form');
    if (quizForm) {
        const submitBtn = quizForm.querySelector('#quizSubmit');
        const resultBox = quizForm.querySelector('#quizResult');
        const questions = ['q1', 'q2', 'q3'];

        const showResult = (score) => {
            resultBox.hidden = false;
            const total = questions.length;
            const message = score === total
                ? 'Отлично! Вы ответили правильно на все вопросы.'
                : score >= total - 1
                    ? 'Хорошо! Почти всё правильно.'
                    : 'Постарайтесь внимательнее — безопасность важна.';
            resultBox.innerHTML = `
                <h4>Результат</h4>
                <p>Правильных ответов: <strong>${score}</strong> из ${total}.</p>
                <p>${message}</p>
            `;
        };

        submitBtn.addEventListener('click', () => {
            const selected = questions.map(name => quizForm.querySelector(`input[name="${name}"]:checked`));
            if (selected.some(item => !item)) {
                resultBox.hidden = false;
                resultBox.innerHTML = '<p class="quiz-error">Ответьте на все вопросы, чтобы получить результат.</p>';
                return;
            }
            const score = selected.reduce((sum, input) => sum + (input.dataset.correct === 'true' ? 1 : 0), 0);
            showResult(score);
        });

        quizForm.addEventListener('change', () => {
            if (!resultBox.hidden) resultBox.hidden = true;
        });
    }
});