document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const philosopherName = params.get('name');

    const philosopherNameHeader = document.getElementById('philosopher-name-header');
    const philosopherLifespan = document.getElementById('philosopher-lifespan');
    const philosopherSchool = document.getElementById('philosopher-school');
    const philosopherQuote = document.getElementById('philosopher-quote');
    const philosopherIdeas = document.getElementById('philosopher-ideas');
    const philosopherContributions = document.getElementById('philosopher-contributions');

    const aboutBtn = document.getElementById('about-btn');
    const aboutPanel = document.getElementById('about-panel');
    const aboutCloseBtn = document.getElementById('about-close-btn');

    fetch('philosophy-data.json')
        .then(response => response.json())
        .then(data => {
            const philosopher = findPhilosopher(data.periods, philosopherName);
            if (philosopher) {
                displayPhilosopher(philosopher);
            } else {
                displayError();
            }
        })
        .catch(error => {
            console.error('Error fetching philosophy data:', error);
            displayError();
        });

    function findPhilosopher(periods, name) {
        for (const period of periods) {
            const found = period.philosophers.find(p => p.name === name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    function displayPhilosopher(philosopher) {
        document.title = philosopher.name;
        philosopherNameHeader.textContent = philosopher.name;
        philosopherLifespan.textContent = philosopher.lifespan;
        philosopherSchool.textContent = philosopher.school;

        if (philosopher.quote) {
            philosopherQuote.textContent = `"${philosopher.quote}"`;
        } else {
            philosopherQuote.style.display = 'none';
        }

        philosopherIdeas.innerHTML = '';
        philosopher.ideas.forEach(idea => {
            const li = document.createElement('li');
            li.textContent = idea;
            philosopherIdeas.appendChild(li);
        });

        philosopherContributions.textContent = philosopher.detailed_contributions || "No detailed contributions available.";
    }

    function displayError() {
        philosopherNameHeader.textContent = "Philosopher not found";
        document.querySelector('main div').innerHTML = '<p class="text-center text-red-500">Could not load philosopher data. Please return to the timeline.</p>';
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
