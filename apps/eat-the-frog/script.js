document.addEventListener('DOMContentLoaded', () => {
    const inputSection = document.getElementById('input-section');
    const displaySection = document.getElementById('display-section');
    const frogTaskInput = document.getElementById('frog-task-input');
    const saveFrogBtn = document.getElementById('save-frog-btn');
    const currentFrogText = document.getElementById('current-frog-text');
    const completeFrogBtn = document.getElementById('complete-frog-btn');
    const streakCount = document.getElementById('streak-count');
    const newDayBtn = document.getElementById('new-day-btn');

    let state = {
        frog: null,
        isCompleted: false,
        streak: 0,
        lastCompleted: null
    };

    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('eatTheFrogState'));
        if (savedState) {
            state = savedState;
        }
        updateUI();
    }

    function saveState() {
        localStorage.setItem('eatTheFrogState', JSON.stringify(state));
    }

    function updateUI() {
        if (state.frog) {
            inputSection.classList.add('hidden');
            displaySection.classList.remove('hidden');
            currentFrogText.textContent = state.frog;
            if (state.isCompleted) {
                displaySection.classList.add('completed');
                completeFrogBtn.disabled = true;
                completeFrogBtn.textContent = 'Frog Eaten! 🐸';
                completeFrogBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                completeFrogBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
            } else {
                displaySection.classList.remove('completed');
                completeFrogBtn.disabled = false;
                completeFrogBtn.textContent = 'I Ate the Frog! 🐸';
                completeFrogBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                completeFrogBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
            }
        } else {
            inputSection.classList.remove('hidden');
            displaySection.classList.add('hidden');
        }
        streakCount.textContent = state.streak;
    }

    saveFrogBtn.addEventListener('click', () => {
        const task = frogTaskInput.value.trim();
        if (task) {
            state.frog = task;
            state.isCompleted = false;
            frogTaskInput.value = '';
            saveState();
            updateUI();
        }
    });

    completeFrogBtn.addEventListener('click', () => {
        if (!state.isCompleted) {
            state.isCompleted = true;

            const today = new Date().toDateString();
            const lastCompletedDate = state.lastCompleted ? new Date(state.lastCompleted).toDateString() : null;
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastCompletedDate === yesterday) {
                state.streak++;
            } else if (lastCompletedDate !== today) {
                state.streak = 1;
            }

            state.lastCompleted = new Date().toISOString();
            saveState();
            updateUI();
        }
    });

    newDayBtn.addEventListener('click', () => {
        state.frog = null;
        state.isCompleted = false;
        saveState();
        updateUI();
    });

    loadState();
});
