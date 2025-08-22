document.addEventListener('DOMContentLoaded', () => {
    const ideasContainer = document.getElementById('ideas-container');

    fetch('ideas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!ideasContainer) {
                console.error('Error: ideas-container element not found.');
                return;
            }
            ideasContainer.innerHTML = ''; // Clear any loading text
            data.forEach(category => {
                const categoryElement = createCategoryElement(category);
                ideasContainer.appendChild(categoryElement);

                const grid = categoryElement.querySelector('.grid');
                if (grid) {
                    category.ideas.forEach(idea => {
                        const ideaElement = createIdeaCard(idea);
                        grid.appendChild(ideaElement);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing ideas:', error);
            if (ideasContainer) {
                ideasContainer.innerHTML = '<p class="text-center text-red-500">Could not load ideas. Please check the console for more information.</p>';
            }
        });

    function createCategoryElement(category) {
        const categoryWrapper = document.createElement('div');
        categoryWrapper.innerHTML = `
            <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-2">${category.category}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Idea cards for this category will be inserted here -->
            </div>
        `;
        return categoryWrapper;
    }

    const completedIdeas = [
        "Logical Fallacy of the Day",
        "Key Philosophers Primer",
        "'Idea Inbox' Capture Tool",
        "Compound Interest Calculator",
        "Central Limit Theorem Visualizer"
    ];

    function createIdeaCard(idea) {
        const card = document.createElement('div');
        card.className = 'idea-card bg-white p-6 rounded-lg shadow-lg h-full flex flex-col';

        const isCompleted = completedIdeas.includes(idea.name);
        if (isCompleted) {
            card.classList.add('completed-idea');
        }

        const featuresHtml = idea.features.map((feature, index) => `
            <li class="feature-item flex items-start" style="animation-delay: ${index * 100}ms;">
                <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>${feature}</span>
            </li>
        `).join('');

        const titleColor = isCompleted ? 'text-green-500' : 'text-indigo-700';

        card.innerHTML = `
            <div class="flex-grow">
                <h3 class="text-2xl font-semibold ${titleColor} mb-4">${idea.name}</h3>
                <h4 class="font-semibold mb-2 text-gray-600">Key Features:</h4>
                <ul class="list-none text-gray-700 space-y-2">
                    ${featuresHtml}
                </ul>
            </div>
        `;

        if (isCompleted) {
            const completedBanner = document.createElement('div');
            completedBanner.className = 'bg-green-100 text-green-800 text-sm font-semibold mt-4 px-3 py-1 rounded-full text-center';
            completedBanner.textContent = 'Accomplished';
            card.appendChild(completedBanner);
        }

        return card;
    }

    // About Panel Logic
    const aboutButton = document.getElementById('about-button');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutPanelButton = document.getElementById('close-about-panel');

    if (aboutButton && aboutPanel && closeAboutPanelButton) {
        aboutButton.addEventListener('click', () => {
            aboutPanel.classList.remove('hidden');
        });

        closeAboutPanelButton.addEventListener('click', () => {
            aboutPanel.classList.add('hidden');
        });

        aboutPanel.addEventListener('click', (event) => {
            if (event.target === aboutPanel) {
                aboutPanel.classList.add('hidden');
            }
        });
    } else {
        console.error('About panel elements not found.');
    }
});
