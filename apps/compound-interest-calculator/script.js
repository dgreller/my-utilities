document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const initialPrincipalSlider = document.getElementById('initialPrincipal');
    const annualRateSlider = document.getElementById('annualRate');
    const yearsSlider = document.getElementById('years');
    const monthlyContributionSlider = document.getElementById('monthlyContribution');

    const initialPrincipalValue = document.getElementById('initialPrincipalValue');
    const annualRateValue = document.getElementById('annualRateValue');
    const yearsValue = document.getElementById('yearsValue');
    const monthlyContributionValue = document.getElementById('monthlyContributionValue');

    const futureValueDisplay = document.getElementById('futureValue');
    const tableBody = document.getElementById('resultsTableBody');

    const chartCanvas = document.getElementById('growthChart');

    // Chart.js instance
    let growthChart;

    // Format numbers as currency
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    function initializeChart() {
        const ctx = chartCanvas.getContext('2d');
        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Total Contributions',
                        data: [],
                        borderColor: '#6b7280', // gray-500
                        backgroundColor: 'rgba(107, 114, 128, 0.1)',
                        fill: true,
                    },
                    {
                        label: 'Future Value',
                        data: [],
                        borderColor: '#059669', // emerald-600
                        backgroundColor: 'rgba(5, 150, 105, 0.2)',
                        fill: true,
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return currencyFormatter.format(value);
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += currencyFormatter.format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function calculateAndRender() {
        const P = parseFloat(initialPrincipalSlider.value);
        const r = parseFloat(annualRateSlider.value) / 100;
        const t = parseInt(yearsSlider.value);
        const M = parseFloat(monthlyContributionSlider.value);
        const n = 12; // Compounded monthly

        // Update display values
        initialPrincipalValue.textContent = currencyFormatter.format(P);
        annualRateValue.textContent = `${(r * 100).toFixed(1)}%`;
        yearsValue.textContent = `${t} years`;
        monthlyContributionValue.textContent = currencyFormatter.format(M);

        let futureValue = P;
        const annualData = [];
        const labels = [];
        const contributionData = [];

        for (let year = 1; year <= t; year++) {
            let yearEndValue = P * Math.pow(1 + r / n, n * year);
            if (M > 0) {
                yearEndValue += M * ((Math.pow(1 + r / n, n * year) - 1) / (r / n));
            }

            const totalContributions = P + (M * 12 * year);
            const interestEarned = yearEndValue - totalContributions;

            annualData.push({
                year: year,
                interestEarned: interestEarned,
                endBalance: yearEndValue,
            });
            labels.push(year);
            contributionData.push(totalContributions);
            futureValue = yearEndValue;
        }

        // Update UI
        futureValueDisplay.textContent = currencyFormatter.format(futureValue);

        // Update Table
        tableBody.innerHTML = '';
        annualData.forEach(data => {
            const row = `
                <tr>
                    <td class="py-2 px-4">${data.year}</td>
                    <td class="py-2 px-4">${currencyFormatter.format(data.interestEarned)}</td>
                    <td class="py-2 px-4 font-semibold">${currencyFormatter.format(data.endBalance)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Update Chart
        growthChart.data.labels = labels;
        growthChart.data.datasets[0].data = contributionData;
        growthChart.data.datasets[1].data = annualData.map(d => d.endBalance);
        growthChart.update();
    }

    // Event Listeners
    const sliders = [initialPrincipalSlider, annualRateSlider, yearsSlider, monthlyContributionSlider];
    sliders.forEach(slider => {
        slider.addEventListener('input', calculateAndRender);
    });

    // About Panel Logic
    const aboutButton = document.getElementById('about-button');
    const aboutPanel = document.getElementById('about-panel');
    const closeAboutPanelButton = document.getElementById('close-about-panel');

    if (aboutButton && aboutPanel && closeAboutPanelButton) {
        aboutButton.addEventListener('click', () => aboutPanel.classList.remove('hidden'));
        closeAboutPanelButton.addEventListener('click', () => aboutPanel.classList.add('hidden'));
        aboutPanel.addEventListener('click', (e) => {
            if (e.target === aboutPanel) aboutPanel.classList.add('hidden');
        });
    }

    // Initial setup
    initializeChart();
    calculateAndRender();
});
