document.addEventListener('DOMContentLoaded', () => {
    const enhancementsContainer = document.getElementById('enhancements-container');

    fetch('future-enhancements.json')
        .then(response => response.json())
        .then(data => {
            displayEnhancements(data);
        })
        .catch(error => {
            console.error('Error fetching future enhancements:', error);
            enhancementsContainer.textContent = 'Failed to load future enhancements. Please try again later.';
        });

    function displayEnhancements(enhancements) {
        enhancementsContainer.innerHTML = '';
        enhancements.forEach(app => {
            const appContainer = document.createElement('div');
            appContainer.className = 'app-container';

            const appName = document.createElement('h2');
            appName.textContent = app.name;

            const featureList = document.createElement('ul');
            featureList.className = 'feature-list';

            app.features.forEach(feature => {
                const featureItem = document.createElement('li');
                featureItem.textContent = feature;
                featureList.appendChild(featureItem);
            });

            appContainer.appendChild(appName);
            appContainer.appendChild(featureList);

            enhancementsContainer.appendChild(appContainer);
        });
    }
});
