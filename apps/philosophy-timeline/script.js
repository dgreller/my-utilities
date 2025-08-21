document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.getElementById('timeline-container');
    const modal = document.getElementById('philosopher-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

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
        card.addEventListener('click', () => openModal(philosopher));
        return card;
    }

    function openModal(philosopher) {
        document.getElementById('modal-name').textContent = philosopher.name;
        document.getElementById('modal-lifespan').textContent = philosopher.lifespan;
        document.getElementById('modal-school').textContent = philosopher.school;

        const ideasList = document.getElementById('modal-ideas');
        ideasList.innerHTML = '';
        philosopher.ideas.forEach(idea => {
            const li = document.createElement('li');
            li.textContent = idea;
            ideasList.appendChild(li);
        });

        document.getElementById('modal-contributions').textContent = philosopher.detailed_contributions || "No detailed contributions available.";

        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // Event listeners for closing the modal
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
