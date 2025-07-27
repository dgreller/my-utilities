document.addEventListener('DOMContentLoaded', () => {
    const dailyDayEl = document.getElementById('daily-day');
    const dailyWordEl = document.getElementById('daily-word');
    const dailyDefinitionEl = document.getElementById('daily-definition');
    const dailySynonymsEl = document.getElementById('daily-synonyms');
    const dailyExamplesEl = document.getElementById('daily-examples');

    const randomWordEl = document.getElementById('random-word-text');
    const randomDefinitionEl = document.getElementById('random-definition');
    const randomSynonymsEl = document.getElementById('random-synonyms');
    const randomExamplesEl = document.getElementById('random-examples');
    const randomWordCard = document.getElementById('random-word');

    const randomWordBtn = document.getElementById('random-word-btn');

    let words = [];

    fetch('vocabulary.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            setWordOfTheDay();
            randomWordBtn.addEventListener('click', setRandomWord);
        });

    function setWordOfTheDay() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const word = words[dayOfYear - 1];

        dailyDayEl.textContent = `Word of the Day: ${word.day}`;
        dailyWordEl.textContent = word.word;
        dailyDefinitionEl.textContent = word.definition;
        dailySynonymsEl.textContent = word.synonyms.join(', ');
        dailyExamplesEl.innerHTML = '';
        word.examples.forEach(example => {
            const li = document.createElement('li');
            li.textContent = `"${example}"`;
            dailyExamplesEl.appendChild(li);
        });
    }

    function setRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];

        randomWordEl.textContent = word.word;
        randomDefinitionEl.textContent = word.definition;
        randomSynonymsEl.textContent = word.synonyms.join(', ');
        randomExamplesEl.innerHTML = '';
        word.examples.forEach(example => {
            const li = document.createElement('li');
            li.textContent = `"${example}"`;
            randomExamplesEl.appendChild(li);
        });
        randomWordCard.style.display = 'block';
    }
});
