document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');

    fetch('bayesian-concepts.json')
        .then(response => response.json())
        .then(data => {
            displayContent(data);
        })
        .catch(error => {
            console.error('Error fetching Bayesian concepts:', error);
            contentContainer.textContent = 'Failed to load content. Please try again later.';
        });

    function displayContent(concepts) {
        concepts.forEach(concept => {
            const section = document.createElement('section');
            const title = document.createElement('h2');
            title.textContent = concept.title;
            const content = document.createElement('div');
            content.innerHTML = concept.content;

            section.appendChild(title);
            section.appendChild(content);
            contentContainer.appendChild(section);
        });
    }

    // About panel logic
    const aboutBtn = document.getElementById('about-btn');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutBtn = document.querySelector('.close-about-btn');

    aboutBtn.addEventListener('click', () => {
        aboutPanel.style.display = 'block';
    });

    closeAboutBtn.addEventListener('click', () => {
        aboutPanel.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == aboutPanel) {
            aboutPanel.style.display = 'none';
        }
    });
});
