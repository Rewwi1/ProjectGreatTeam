document.addEventListener('DOMContentLoaded', function() {
    // Карусели
    document.querySelectorAll('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = track.querySelectorAll('.slide');
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let index = 0;

        // Создаем точки
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => goTo(i);
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === slides.length - 1;
            dots.forEach((d, i) => d.className = 'dot' + (i === index ? ' active' : ''));
        }

        function goTo(i) {
            if (i >= 0 && i < slides.length) {
                index = i;
                update();
            }
        }

        prevBtn.onclick = () => goTo(index - 1);
        nextBtn.onclick = () => goTo(index + 1);

        // Свайп для мобильных
        let start = 0;
        track.addEventListener('touchstart', e => start = e.touches[0].clientX);
        track.addEventListener('touchend', e => {
            const diff = start - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(index + 1) : goTo(index - 1);
            }
        });
    });

    // Навигация и подсветка при скролле
    const navLinks = document.querySelectorAll('.steps-nav a');
    const sections = document.querySelectorAll('.step-section');

    navLinks.forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        };
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
});