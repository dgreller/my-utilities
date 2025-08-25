document.addEventListener('DOMContentLoaded', () => {
    const fallacyGrid = document.getElementById('fallacy-grid');
    const tagFilter = document.getElementById('tag-filter');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalLongDescription = document.getElementById('modal-long-description');
    const modalExample = document.getElementById('modal-example');
    const modalRealWorldExamples = document.getElementById('modal-real-world-examples');
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

        modalRealWorldExamples.innerHTML = '';
        if (fallacy.real_world_examples && fallacy.real_world_examples.length > 0) {
            const ul = document.createElement('ul');
            fallacy.real_world_examples.forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                ul.appendChild(li);
            });
            modalRealWorldExamples.appendChild(ul);
        } else {
            modalRealWorldExamples.textContent = 'No real-world examples available.';
        }

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

    // Quiz Logic
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizModal = document.getElementById('quiz-modal');
    const closeQuizBtn = document.querySelector('.close-quiz-btn');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizNextBtn = document.getElementById('quiz-next-btn');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizResults = document.getElementById('quiz-results');
    const quizContainer = document.getElementById('quiz-container');
    const quizScore = document.getElementById('quiz-score');
    const quizRestartBtn = document.getElementById('quiz-restart-btn');

    let quizFallacies = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = null;

    function startQuiz() {
        quizFallacies = [...fallacies].sort(() => 0.5 - Math.random());
        currentQuestionIndex = 0;
        score = 0;
        quizContainer.classList.remove('hidden');
        quizResults.classList.add('hidden');
        showQuestion();
        quizModal.style.display = 'block';
    }

    function showQuestion() {
        selectedAnswer = null;
        quizFeedback.textContent = '';
        quizNextBtn.disabled = true;
        quizNextBtn.textContent = 'Next';

        const currentFallacy = quizFallacies[currentQuestionIndex];
        quizQuestion.textContent = currentFallacy.short_description;

        const options = getQuizOptions(currentFallacy);
        quizOptions.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.name;
            button.dataset.fallacyName = option.name;
            button.addEventListener('click', () => selectAnswer(button, currentFallacy));
            quizOptions.appendChild(button);
        });
    }

    function getQuizOptions(correctFallacy) {
        const incorrectFallacies = fallacies
            .filter(f => f.name !== correctFallacy.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const options = [correctFallacy, ...incorrectFallacies];
        return options.sort(() => 0.5 - Math.random());
    }

    function selectAnswer(selectedButton, correctFallacy) {
        if (selectedAnswer) return; // Prevent changing answer

        selectedAnswer = selectedButton;
        const isCorrect = selectedButton.dataset.fallacyName === correctFallacy.name;

        if (isCorrect) {
            score++;
            quizFeedback.textContent = "Correct!";
            quizFeedback.style.color = '#15803d'; // green-700
        } else {
            quizFeedback.textContent = `Incorrect. The correct answer is ${correctFallacy.name}.`;
            quizFeedback.style.color = '#b91c1c'; // red-700
        }

        Array.from(quizOptions.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.fallacyName === correctFallacy.name) {
                button.classList.add('correct');
            } else if (button === selectedButton) {
                button.classList.add('incorrect');
            }
        });

        quizNextBtn.disabled = false;
        if (currentQuestionIndex === quizFallacies.length - 1) {
            quizNextBtn.textContent = 'Show Results';
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizFallacies.length) {
            resetOptionButtons();
            showQuestion();
        } else {
            showResults();
        }
    }

    function resetOptionButtons() {
        Array.from(quizOptions.children).forEach(button => {
            button.disabled = false;
            button.classList.remove('correct', 'incorrect', 'selected');
        });
    }

    function showResults() {
        quizContainer.classList.add('hidden');
        quizResults.classList.remove('hidden');
        quizScore.textContent = `${score} / ${quizFallacies.length}`;
    }

    function closeQuiz() {
        quizModal.style.display = 'none';
        resetOptionButtons();
    }

    startQuizBtn.addEventListener('click', startQuiz);
    quizNextBtn.addEventListener('click', nextQuestion);
    quizRestartBtn.addEventListener('click', startQuiz);
    closeQuizBtn.addEventListener('click', closeQuiz);
});
