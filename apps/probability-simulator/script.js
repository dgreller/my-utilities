document.addEventListener('DOMContentLoaded', () => {
    const distributionSelect = document.getElementById('distribution');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const canvas = document.getElementById('simulation-canvas');
    const ctx = canvas.getContext('2d');
    const resultsDiv = document.getElementById('results');

    let simulationId;
    let simulationRunning = false;

    let coinFlips = { heads: 0, tails: 0 };

    function drawCoinFlip() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalFlips = coinFlips.heads + coinFlips.tails;
        if (totalFlips === 0) {
            return;
        }

        const headsPercentage = coinFlips.heads / totalFlips;
        const tailsPercentage = coinFlips.tails / totalFlips;

        const headsHeight = headsPercentage * canvas.height;
        const tailsHeight = tailsPercentage * canvas.height;

        ctx.fillStyle = 'gold';
        ctx.fillRect(0, canvas.height - headsHeight, canvas.width / 2, headsHeight);

        ctx.fillStyle = 'silver';
        ctx.fillRect(canvas.width / 2, canvas.height - tailsHeight, canvas.width / 2, tailsHeight);

        resultsDiv.innerHTML = `Heads: ${coinFlips.heads} (${(headsPercentage * 100).toFixed(2)}%)<br>Tails: ${coinFlips.tails} (${(tailsPercentage * 100).toFixed(2)}%)`;
    }

    function coinFlipSimulation() {
        if (Math.random() < 0.5) {
            coinFlips.heads++;
        } else {
            coinFlips.tails++;
        }
        drawCoinFlip();
    }

    function startSimulation() {
        stopSimulation();
        simulationRunning = true;
        const selectedDistribution = distributionSelect.value;
        if (selectedDistribution === 'coin') {
            coinFlips = { heads: 0, tails: 0 };
            simulationId = setInterval(coinFlipSimulation, 100);
        }
    }

    function stopSimulation() {
        simulationRunning = false;
        clearInterval(simulationId);
    }

    startBtn.addEventListener('click', startSimulation);
    stopBtn.addEventListener('click', stopSimulation);

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
