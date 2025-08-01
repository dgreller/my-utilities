document.addEventListener('DOMContentLoaded', () => {
    const fallacyGrid = document.getElementById('fallacy-grid');
    const tagFilter = document.getElementById('tag-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLongDescription = document.getElementById('modal-long-description');
    const modalExample = document.getElementById('modal-example');
    const closeButton = document.querySelector('.close-button');

    let fallacies = [];
    let allTags = new Set();

    fetch('statistical-fallacies.json')
        .then(response => response.json())
        .then(data => {
            fallacies = data;
            fallacies.forEach(fallacy => {
                fallacy.tags.forEach(tag => allTags.add(tag));
            });
            populateTags();
            displayFallacies(fallacies);
        })
        .catch(error => {
            console.error('Error fetching statistical fallacies:', error);
            fallacyGrid.textContent = 'Failed to load statistical fallacies. Please try again later.';
        });

    function populateTags() {
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }

    function displayFallacies(fallaciesToDisplay) {
        fallacyGrid.innerHTML = '';
        fallaciesToDisplay.forEach(fallacy => {
            const card = document.createElement('div');
            card.className = 'fallacy-card';
            card.addEventListener('click', () => openModal(fallacy));

            const title = document.createElement('h2');
            title.textContent = fallacy.name;

            const description = document.createElement('p');
            description.textContent = fallacy.short_description;

            card.appendChild(title);
            card.appendChild(description);

            fallacyGrid.appendChild(card);
        });
    }

    function openModal(fallacy) {
        modalTitle.textContent = fallacy.name;
        modalLongDescription.textContent = fallacy.long_description;
        modalExample.textContent = fallacy.example_application;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    tagFilter.addEventListener('change', () => {
        const selectedTag = tagFilter.value;
        if (selectedTag === 'all') {
            displayFallacies(fallacies);
        } else {
            const filteredFallacies = fallacies.filter(fallacy => fallacy.tags.includes(selectedTag));
            displayFallacies(filteredFallacies);
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
