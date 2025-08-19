document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const subTasksList = document.getElementById('sub-tasks-list');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = taskInput.value.trim();

        if (!task) {
            alert('Please enter a task.');
            return;
        }

        // --- Clear previous results and show loading ---
        subTasksList.innerHTML = '';
        errorMessage.style.display = 'none';
        loadingIndicator.style.display = 'block';

        try {
            const response = await fetch('/api/generate-subtasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: task }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred.');
            }

            const data = await response.json();

            // --- Display the sub-tasks ---
            if (data.sub_tasks && data.sub_tasks.length > 0) {
                data.sub_tasks.forEach(subTask => {
                    const li = document.createElement('li');
                    li.textContent = subTask;
                    subTasksList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = "The model didn't return any sub-tasks. Try rephrasing your main task.";
                subTasksList.appendChild(li);
            }

        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = 'block';
        } finally {
            // --- Hide loading indicator ---
            loadingIndicator.style.display = 'none';
        }
    });
});
