document.addEventListener('DOMContentLoaded', () => {
    const deviceList = document.getElementById('device-list');
    const aboutButton = document.getElementById('about-button');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutPanel = document.getElementById('close-about-panel');

    // Fetch and display rhetorical devices
    fetch('rhetorical-devices.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(device => {
                const card = document.createElement('div');
                card.className = 'device-card';

                const name = document.createElement('div');
                name.className = 'device-name';
                name.textContent = device.name;

                const details = document.createElement('div');
                details.className = 'device-details';
                details.innerHTML = `
                    <p class="device-definition">${device.definition}</p>
                    <p class="device-example"><strong>Example:</strong> ${device.example}</p>
                `;

                card.appendChild(name);
                card.appendChild(details);
                deviceList.appendChild(card);

                // Add click event to toggle details
                card.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
            });
        })
        .catch(error => {
            console.error('Error fetching rhetorical devices:', error);
            deviceList.textContent = 'Failed to load rhetorical devices. Please try again later.';
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
