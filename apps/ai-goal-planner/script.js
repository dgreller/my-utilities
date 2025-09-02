document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const goalInput = document.getElementById('goal-input');
    const modelSelect = document.getElementById('model-select');
    const generateBtn = document.getElementById('generate-btn');
    const planOutput = document.getElementById('plan-output');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const placeholderText = document.querySelector('.placeholder');

    // --- Mock AI Data (Simulated AI Response) ---
    const mockPlans = {
        SMART: {
            title: "SMART Goal Plan",
            plan: `
Goal: Learn to play the guitar in 6 months.

S (Specific): I will learn to play the acoustic guitar by practicing 3 times a week for 30 minutes each session. I will focus on learning basic chords, strumming patterns, and playing 3 complete songs.

M (Measurable): I will track my practice sessions. My progress will be measured by my ability to play the G, C, D, Em, and Am chords cleanly and transition between them, and by learning one new song each month for the last 3 months.

A (Achievable): I have access to a guitar and online learning resources. A 6-month timeframe is realistic for a beginner to learn basic skills.

R (Relevant): Learning guitar is a personal goal for creative expression and relaxation.

T (Time-bound): The goal will be achieved in 6 months from today's date. I will re-evaluate my progress at the 3-month mark.
            `
        },
        FirstPrinciples: {
            title: "First-Principles Plan",
            plan: `
Goal: Learn to play the guitar in 6 months.

Deconstruction from First Principles:
1.  What is a guitar? A stringed instrument that produces sound via vibration.
2.  What is "playing" it? Causing the strings to vibrate in a specific, controlled way to create melody and harmony.
3.  What is absolutely necessary to do this?
    -   An instrument (the guitar).
    -   A way to make strings vibrate (fingers/pick).
    -   Knowledge of which strings to press (chords/notes).
    -   A sense of timing (rhythm).

Action Plan based on First Principles:
Phase 1: Acquire the Fundamentals (Months 1-2)
- Task 1: Procure a functional acoustic guitar.
- Task 2: Learn the anatomy of the guitar (strings, frets, body).
- Task 3: Master the foundational motor skills: holding the pick, basic strumming, and pressing a string to produce a clean note.
- Task 4: Learn the 5 most common "campfire" chords (G, C, D, Em, Am) until transitions are smooth.

Phase 2: Application & Synthesis (Months 3-4)
- Task 5: Learn basic strumming patterns (e.g., 4/4 down-up).
- Task 6: Combine chords and strumming to play a simple song (e.g., "Three Little Birds").
- Task 7: Introduce music theory: learn what a scale is and practice the C Major scale.

Phase 3: Expansion & Refinement (Months 5-6)
- Task 8: Learn 2 more complex songs involving faster chord changes.
- Task 9: Practice fingerpicking patterns.
- Task 10: Record myself playing to identify areas for improvement.
            `
        },
        BackwardPlanning: {
            title: "Backward-Planning Plan",
            plan: `
Goal: Learn to play the guitar in 6 months.

Step 5 (End Goal - Month 6): I can confidently play at least 3 songs from start to finish at a small gathering of friends.

Step 4 (Month 5): To be able to play 3 songs, I must have them fully memorized and be able to play them smoothly.
- Action: Practice the 3 chosen songs daily. Refine tricky sections.

Step 3 (Month 4): To have 3 songs to practice, I must have learned them.
- Action: Learn one new song this month. Choose the final 3 songs for the goal.

Step 2 (Month 3): To learn a full song, I need to know basic chords and how to switch between them.
- Action: Be able to switch between G, C, D, Em, and Am cleanly. Learn my first complete (but simple) song.

Step 1 (Months 1-2): To learn chords, I need a guitar and knowledge of where to put my fingers.
- Action: Get a guitar. Use an app or a video course to learn the finger positions for the basic chords. Practice daily for 30 minutes.
            `
        }
    };

    // --- Event Listeners ---
    generateBtn.addEventListener('click', () => {
        const selectedModel = modelSelect.value;
        const goalText = goalInput.value;

        // In a real app, you'd send goalText and selectedModel to an AI API.
        // Here, we just use our mock data.
        const result = mockPlans[selectedModel];

        if (result) {
            // Dynamically insert the user's goal into the plan
            const dynamicPlan = result.plan.replace(/Goal: .*/, `Goal: ${goalText}`);
            planOutput.innerText = dynamicPlan;

            if (placeholderText) {
                placeholderText.style.display = 'none';
            }
            copyBtn.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
        } else {
            planOutput.innerText = 'Sorry, something went wrong. Please try again.';
            if (placeholderText) {
                placeholderText.style.display = 'none';
            }
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(planOutput.innerText).then(() => {
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = 'Copy to Clipboard';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    downloadBtn.addEventListener('click', () => {
        const textToSave = planOutput.innerText;
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'goal-plan.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
