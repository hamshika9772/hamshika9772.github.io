let welcomeSlides = [];
let currentSlideIndex = 0;
const overlay = document.getElementById('modal-overlay');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/welcome.json');
        const json = await res.json();
        welcomeSlides = json.slides || [];
    } catch (e) {
        console.error("Failed to load welcome.json", e);
    }

    const welcomeSeen = localStorage.getItem('bloxcraftwelcomesyousmile');

    if (!welcomeSeen && welcomeSlides.length) {
        showWelcome();
    } else {
        checkAnnouncements();
    }
});

function exitFlow(id, callback) {
    const el = document.getElementById(id);
    el.classList.add('leaving');
    setTimeout(() => {
        el.style.display = 'none';
        el.classList.remove('leaving');
        callback();
    }, 200);
}

function showWelcome() {
    overlay.style.display = 'flex';
    const card = document.getElementById('welcome-card');
    card.style.display = 'flex';

    const dots = document.getElementById('pagination-dots');
    dots.innerHTML = '';
    welcomeSlides.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = i === 0 ? 'dot active' : 'dot';
        dots.appendChild(d);
    });

    renderSlide();
}

function renderSlide() {
    const slide = welcomeSlides[currentSlideIndex];
    if (!slide) return;

    document.getElementById('welcome-title').innerText = slide.title;
    document.getElementById('welcome-description').innerText = slide.text;

    const icon = document.getElementById('welcome-icon-container');
    icon.innerHTML = slide.type === "img"
        ? `<img src="${slide.content}">`
        : slide.content;

    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlideIndex);
    });

    document.getElementById('next-btn').innerText =
        currentSlideIndex === welcomeSlides.length - 1 ? "Finish" : "Next";
}

function handleNext() {
    if (currentSlideIndex < welcomeSlides.length - 1) {
        currentSlideIndex++;
        renderSlide();
    } else {
        exitFlow('welcome-card', closeWelcome);
    }
}

function closeWelcome() {
    localStorage.setItem('bloxcraftisbetterthenyoursitelmao', 'true');
    checkAnnouncements();
}

async function checkAnnouncements() {
    try {
        const res = await fetch('https://cdn.jsdelivr.net/gh/tharun9772/game-assets@main/annc.json');
        const json = await res.json();
        const data = json.announcements?.[0];

        if (!data) return;

        const key = `announcement-${data.id}`;

        if (!localStorage.getItem(key)) {
            overlay.style.display = 'flex';

            document.getElementById('announcement-title').innerText = data.title;
            document.getElementById('announcement-text').innerText = data.content;
            document.getElementById('announcement-icon-container').innerHTML = data.icon;
            document.getElementById('announcement-btn').innerText = data.buttonText;

            document.getElementById('announcement-card').setAttribute('data-id', data.id);
            document.getElementById('announcement-card').style.display = 'flex';
        }
    } catch (e) {
        console.error("Failed to load announcements.json", e);
    }
}

function closeAnnouncement() {
    const el = document.getElementById('announcement-card');
    const id = el.getAttribute('data-id');
    localStorage.setItem(`announcement-${id}`, 'true');
    overlay.style.display = 'none';
}
