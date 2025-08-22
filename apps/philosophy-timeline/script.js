document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('timeline-container');
    const aboutBtn = document.getElementById('about-btn');
    const aboutPanel = document.getElementById('about-panel');
    const aboutCloseBtn = document.getElementById('about-close-btn');

    // Fetch data and populate the timeline
    fetch('philosophy-data.json')
        .then(response => response.json())
        .then(data => {
            populateTimeline(data.periods);
        })
        .catch(error => {
            console.error('Error fetching philosophy data:', error);
            timelineContainer.innerHTML = '<p class="text-center text-red-500">Failed to load timeline data.</p>';
        });

    function populateTimeline(periods) {
        if (!periods) {
            timelineContainer.innerHTML = '<p class="text-center">No periods to display.</p>';
            return;
        }

        periods.forEach(period => {
            const periodSection = document.createElement('section');
            periodSection.className = 'period-section';

            const periodHeader = document.createElement('h2');
            periodHeader.className = 'period-header';
            periodHeader.textContent = period.name;
            periodSection.appendChild(periodHeader);

            const philosophersContainer = document.createElement('div');
            philosophersContainer.className = 'period-philosophers';
            period.philosophers.forEach(philosopher => {
                const card = createPhilosopherCard(philosopher);
                philosophersContainer.appendChild(card);
            });
            periodSection.appendChild(philosophersContainer);

            timelineContainer.appendChild(periodSection);
        });
    }

    function createPhilosopherCard(philosopher) {
        const card = document.createElement('div');
        card.className = 'philosopher-card';
        card.innerHTML = `
            <h3 class="text-xl font-bold">${philosopher.name}</h3>
            <p class="text-sm text-gray-600">${philosopher.lifespan}</p>
        `;
        card.addEventListener('click', () => {
            window.location.href = `philosopher.html?name=${encodeURIComponent(philosopher.name)}`;
        });
        return card;
    }

    // About Panel Logic
    aboutBtn.addEventListener('click', () => {
        aboutPanel.classList.remove('hidden');
        aboutPanel.classList.add('flex');
    });

    aboutCloseBtn.addEventListener('click', () => {
        aboutPanel.classList.add('hidden');
        aboutPanel.classList.remove('flex');
    });

    aboutPanel.addEventListener('click', (e) => {
        if (e.target === aboutPanel) {
            aboutPanel.classList.add('hidden');
            aboutPanel.classList.remove('flex');
        }
    });
});
