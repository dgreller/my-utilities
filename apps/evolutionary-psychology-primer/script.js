document.addEventListener('DOMContentLoaded', () => {
    const conceptGrid = document.getElementById('concept-grid');
    const tagFilter = document.getElementById('tag-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLongDescription = document.getElementById('modal-long-description');
    const modalExample = document.getElementById('modal-example');
    const closeButton = document.querySelector('.close-button');

    let concepts = [];
    let allTags = new Set();

    fetch('evolutionary-psychology-concepts.json')
        .then(response => response.json())
        .then(data => {
            concepts = data;
            concepts.forEach(concept => {
                concept.tags.forEach(tag => allTags.add(tag));
            });
            populateTags();
            displayConcepts(concepts);
        })
        .catch(error => {
            console.error('Error fetching evolutionary psychology concepts:', error);
            conceptGrid.textContent = 'Failed to load evolutionary psychology concepts. Please try again later.';
        });

    function populateTags() {
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    function displayConcepts(conceptsToDisplay) {
        conceptGrid.innerHTML = '';
        conceptsToDisplay.forEach(concept => {
            const card = document.createElement('div');
            card.className = 'concept-card';
            card.addEventListener('click', () => openModal(concept));

            const title = document.createElement('h2');
            title.textContent = concept.name;

            const description = document.createElement('p');
            description.textContent = concept.short_description;

            card.appendChild(title);
            card.appendChild(description);

            conceptGrid.appendChild(card);
        });
    }

    function openModal(concept) {
        modalTitle.textContent = concept.name;
        modalLongDescription.textContent = concept.long_description;
        modalExample.textContent = concept.example_application;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    tagFilter.addEventListener('change', () => {
        const selectedTag = tagFilter.value;
        if (selectedTag === 'all') {
            displayConcepts(concepts);
        } else {
            const filteredConcepts = concepts.filter(concept => concept.tags.includes(selectedTag));
            displayConcepts(filteredConcepts);
        }
    });

    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

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
