from flask import Flask, render_template, request, jsonify
from ctransformers import AutoModelForCausalLM
import os

app = Flask(__name__)

# --- Model Loading ---
# We'll load the model once at the start.
# Note: The model path will be set later. For now, we'll use a placeholder.
MODEL_PATH = "models/gemma-270m-it.Q4_K_M.gguf"
llm = None

if os.path.exists(MODEL_PATH):
    try:
        # For GGUF models, device_map="auto" is not a valid parameter.
        # GPU acceleration is handled by 'gpu_layers' parameter.
        # Set gpu_layers to a number > 0 to enable GPU acceleration
        llm = AutoModelForCausalLM.from_pretrained(MODEL_PATH, model_type="gemma", gpu_layers=0)
    except Exception as e:
        print(f"Error loading model: {e}")
        # The app can still run, but the API will return an error.

# --- Routes ---
@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/api/generate-subtasks', methods=['POST'])
def generate_subtasks():
    """API endpoint to generate sub-tasks from a main task."""
    if llm is None:
        return jsonify({"error": "Model not loaded. Please check the model path and try again."}), 500

    data = request.json
    main_task = data.get('task')

    if not main_task:
        return jsonify({"error": "Task not provided"}), 400

    # --- Prompt Engineering ---
    # We create a clear prompt for the LLM.
    prompt = f"Break down the following task into a short, numbered list of actionable sub-tasks. Do not add any extra commentary before or after the list. Task: {main_task}"

    try:
        # --- LLM Inference ---
        response = llm(prompt, max_new_tokens=150, temperature=0.4, top_k=40, repetition_penalty=1.1)

        # --- Parsing the Output ---
        # The output needs to be cleaned and parsed into a list of strings.
        sub_tasks = []
        # Splitting by newline and filtering out empty lines or list numbers.
        for line in response.split('\\n'):
            line = line.strip()
            if line and line[0].isdigit():
                # Removing the number and period (e.g., "1. ")
                sub_tasks.append(line.split('.', 1)[-1].strip())

        return jsonify({"sub_tasks": sub_tasks})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Note: For production, use a WSGI server like Gunicorn or Waitress.
    app.run(debug=True, port=5001)
