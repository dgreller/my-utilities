document.addEventListener('DOMContentLoaded', () => {
    const biasGrid = document.getElementById('bias-grid');
    const tagFilter = document.getElementById('tag-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLongDescription = document.getElementById('modal-long-description');
    const modalExample = document.getElementById('modal-example');
    const modalLink = document.getElementById('modal-link');
    const closeButton = document.querySelector('.close-button');

    let biases = [];
    let allTags = new Set();

    fetch('cognitive-biases.json')
        .then(response => response.json())
        .then(data => {
            biases = data;
            biases.forEach(bias => {
                bias.tags.forEach(tag => allTags.add(tag));
            });
            populateTags();
            displayBiases(biases);
        })
        .catch(error => {
            console.error('Error fetching cognitive biases:', error);
            biasGrid.textContent = 'Failed to load cognitive biases. Please try again later.';
        });

    function populateTags() {
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    function displayBiases(biasesToDisplay) {
        biasGrid.innerHTML = '';
        biasesToDisplay.forEach(bias => {
            const card = document.createElement('div');
            card.className = 'bias-card';
            card.addEventListener('click', () => openModal(bias));

            const title = document.createElement('h2');
            title.textContent = bias.name;

            const description = document.createElement('p');
            description.textContent = bias.short_description;

            card.appendChild(title);
            card.appendChild(description);

            biasGrid.appendChild(card);
        });
    }

    function openModal(bias) {
        modalTitle.textContent = bias.name;
        modalLongDescription.textContent = bias.long_description;
        modalExample.textContent = bias.example_application;
        modalLink.href = bias.wikipedia_url;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    tagFilter.addEventListener('change', () => {
        const selectedTag = tagFilter.value;
        if (selectedTag === 'all') {
            displayBiases(biases);
        } else {
            const filteredBiases = biases.filter(bias => bias.tags.includes(selectedTag));
            displayBiases(filteredBiases);
        }
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
