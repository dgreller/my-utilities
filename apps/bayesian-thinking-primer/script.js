document.addEventListener('DOMContentLoaded', () => {
    const priorInput = document.getElementById('prior');
    const likelihoodInput = document.getElementById('likelihood');
    const marginalInput = document.getElementById('marginal');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultText = document.getElementById('result-text');

    calculateBtn.addEventListener('click', () => {
        const prior = parseFloat(priorInput.value);
        const likelihood = parseFloat(likelihoodInput.value);
        const marginal = parseFloat(marginalInput.value);

        if (isNaN(prior) || isNaN(likelihood) || isNaN(marginal)) {
            resultText.textContent = 'Please enter valid numbers in all fields.';
            return;
        }

        if (prior < 0 || prior > 1 || likelihood < 0 || likelihood > 1 || marginal < 0 || marginal > 1) {
            resultText.textContent = 'Probabilities must be between 0 and 1.';
            return;
        }

        if (marginal === 0) {
            resultText.textContent = 'Marginal probability cannot be zero.';
            return;
        }

        const posterior = (likelihood * prior) / marginal;

        resultText.textContent = posterior.toFixed(4);
    });
});
