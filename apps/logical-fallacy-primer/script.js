document.addEventListener('DOMContentLoaded', () => {
    const fallacyList = document.getElementById('fallacy-list');
    const aboutButton = document.getElementById('about-button');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutPanel = document.getElementById('close-about-panel');

    // Fetch and display fallacies
    fetch('logical-fallacies.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(fallacy => {
                const card = document.createElement('div');
                card.className = 'fallacy-card';

                const name = document.createElement('div');
                name.className = 'fallacy-name';
                name.textContent = fallacy.name;

                const details = document.createElement('div');
                details.className = 'fallacy-details';
                details.innerHTML = `
                    <p class="fallacy-definition">${fallacy.definition}</p>
                    <p class="fallacy-example"><strong>Example:</strong> ${fallacy.example}</p>
                `;

                card.appendChild(name);
                card.appendChild(details);
                fallacyList.appendChild(card);

                // Add click event to toggle details
                card.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
            });
        })
        .catch(error => {
            console.error('Error fetching logical fallacies:', error);
            fallacyList.textContent = 'Failed to load logical fallacies. Please try again later.';
        });

    // --- About Panel Logic ---
    const showAboutPanel = () => {
        aboutPanel.classList.remove('hidden');
    };

    const hideAboutPanel = () => {
        aboutPanel.classList.add('hidden');
    };

    aboutButton.addEventListener('click', showAboutPanel);
    closeAboutPanel.addEventListener('click', hideAboutPanel);

    // Close panel when clicking outside the modal content
    aboutPanel.addEventListener('click', (event) => {
        if (event.target === aboutPanel) {
            hideAboutPanel();
        }
    });
});
