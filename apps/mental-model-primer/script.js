document.addEventListener('DOMContentLoaded', () => {
    const modelGrid = document.getElementById('model-grid');
    const tagFilter = document.getElementById('tag-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLongDescription = document.getElementById('modal-long-description');
    const modalExample = document.getElementById('modal-example');
    const closeButton = document.querySelector('.close-button');

    let models = [];
    let allTags = new Set();

    fetch('mental-models.json')
        .then(response => response.json())
        .then(data => {
            models = data;
            models.forEach(model => {
                model.tags.forEach(tag => allTags.add(tag));
            });
            populateTags();
            displayModels(models);
        })
        .catch(error => {
            console.error('Error fetching mental models:', error);
            modelGrid.textContent = 'Failed to load mental models. Please try again later.';
        });

    function populateTags() {
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    function displayModels(modelsToDisplay) {
        modelGrid.innerHTML = '';
        modelsToDisplay.forEach(model => {
            const card = document.createElement('div');
            card.className = 'model-card';
            card.addEventListener('click', () => openModal(model));

            const title = document.createElement('h2');
            title.textContent = model.name;

            const description = document.createElement('p');
            description.textContent = model.short_description;

            card.appendChild(title);
            card.appendChild(description);

            modelGrid.appendChild(card);
        });
    }

    function openModal(model) {
        modalTitle.textContent = model.name;
        modalLongDescription.textContent = model.long_description;
        modalExample.textContent = model.example_application;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    tagFilter.addEventListener('change', () => {
        const selectedTag = tagFilter.value;
        if (selectedTag === 'all') {
            displayModels(models);
        } else {
            const filteredModels = models.filter(model => model.tags.includes(selectedTag));
            displayModels(filteredModels);
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
