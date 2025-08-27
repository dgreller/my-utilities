document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const philosopherName = params.get('name');

    const philosopherNameHeader = document.getElementById('philosopher-name-header');
    const philosopherLifespan = document.getElementById('philosopher-lifespan');
    const philosopherSchool = document.getElementById('philosopher-school');
    const philosopherQuote = document.getElementById('philosopher-quote');
    const philosopherIdeas = document.getElementById('philosopher-ideas');
    const sectionsNav = document.getElementById('sections-nav');
    const sectionContent = document.getElementById('section-content');

    const aboutBtn = document.getElementById('about-btn');
    const aboutPanel = document.getElementById('about-panel');
    const aboutCloseBtn = document.getElementById('about-close-btn');

    fetch('philosophy-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
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

        // Handle structured detailed contributions
        const contributions = philosopher.detailed_contributions;
        if (typeof contributions === 'object' && contributions !== null) {
            sectionsNav.innerHTML = '';
            const sectionKeys = Object.keys(contributions);

            sectionKeys.forEach((key, index) => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = key;
                link.className = 'inline-block px-4 py-2 text-gray-600 hover:text-blue-600';
                if (index === 0) {
                    link.classList.add('font-bold', 'text-blue-600', 'border-b-2', 'border-blue-600');
                }

                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Update content
                    let formattedContent = contributions[key].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    sectionContent.innerHTML = formattedContent.replace(/\\n/g, '<br><br>');

                    // Update active link style
                    document.querySelectorAll('#sections-nav a').forEach(a => {
                        a.classList.remove('font-bold', 'text-blue-600', 'border-b-2', 'border-blue-600');
                    });
                    link.classList.add('font-bold', 'text-blue-600', 'border-b-2', 'border-blue-600');
                });
                sectionsNav.appendChild(link);
            });

            // Display the first section by default
            if (sectionKeys.length > 0) {
                let formattedContent = contributions[sectionKeys[0]].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                sectionContent.innerHTML = formattedContent.replace(/\\n/g, '<br><br>');
            } else {
                sectionContent.textContent = "No detailed contributions available.";
            }

        } else {
            // Fallback for old string format
            sectionsNav.style.display = 'none';
            sectionContent.textContent = contributions || "No detailed contributions available.";
        }
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
