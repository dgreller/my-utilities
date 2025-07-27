document.addEventListener('DOMContentLoaded', () => {
    const dailyWordEl = document.getElementById('daily-word');
    const dailyDefinitionEl = document.getElementById('daily-definition');
    const dailyExampleEl = document.getElementById('daily-example');

    const randomWordEl = document.getElementById('random-word-text');
    const randomDefinitionEl = document.getElementById('random-definition');
    const randomExampleEl = document.getElementById('random-example');
    const randomWordCard = document.getElementById('random-word');

    const randomWordBtn = document.getElementById('random-word-btn');

    let words = [];

    fetch('vocabulary.json')
        .then(response => response.json())
        .then(data => {
            words = data.words;
            setWordOfTheDay();
            randomWordBtn.addEventListener('click', setRandomWord);
        });

    function setWordOfTheDay() {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const wordIndex = dayOfYear % words.length;
        const word = words[wordIndex];

        dailyWordEl.textContent = word.word;
        dailyDefinitionEl.textContent = word.definition;
        dailyExampleEl.textContent = `"${word.example}"`;
    }

    function setRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];

        randomWordEl.textContent = word.word;
        randomDefinitionEl.textContent = word.definition;
        randomExampleEl.textContent = `"${word.example}"`;
        randomWordCard.style.display = 'block';
    }
});
