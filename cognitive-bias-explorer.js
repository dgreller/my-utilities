document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    fetch('cognitive-biases.json')
        .then(response => response.json())
        .then(data => {
            data.biases.forEach(bias => {
                const card = document.createElement('div');
                card.className = 'bias-card';

                const title = document.createElement('h2');
                title.textContent = bias.name;

                const description = document.createElement('p');
                description.textContent = bias.description;

                card.appendChild(title);
                card.appendChild(description);

                appContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching cognitive biases:', error);
            appContainer.textContent = 'Failed to load cognitive biases. Please try again later.';
        });
});
