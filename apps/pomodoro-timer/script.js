document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.querySelector('.timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const sessionIndicator = document.querySelector('.session-indicator');

    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');

    let isPaused = true;
    let isWorkSession = true;
    let timerId;
    let timeRemaining;

    const updateDisplay = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const switchSession = () => {
        isWorkSession = !isWorkSession;
        sessionIndicator.textContent = isWorkSession ? 'Work' : 'Break';
        const breakDuration = parseInt(breakDurationInput.value, 10);
        timeRemaining = (isWorkSession ? parseInt(workDurationInput.value, 10) : breakDuration) * 60;
        updateDisplay();
        isPaused = true;
        clearInterval(timerId);
        startTimer(); // Automatically start the next session
    };

    const startTimer = () => {
        if (isPaused) {
            isPaused = false;
            timerId = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining--;
                    updateDisplay();
                } else {
                    switchSession();
                }
            }, 1000);
        }
    };

    const pauseTimer = () => {
        isPaused = true;
        clearInterval(timerId);
    };



    const resetTimer = () => {
        isPaused = true;
        clearInterval(timerId);
        isWorkSession = true;
        const workDuration = parseInt(workDurationInput.value, 10);
        timeRemaining = workDuration * 60;
        sessionIndicator.textContent = 'Work';
        updateDisplay();
    };

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    workDurationInput.addEventListener('input', resetTimer);
    breakDurationInput.addEventListener('input', resetTimer);

    resetTimer(); // Initialize timer with default values
});
