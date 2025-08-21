

* * *

### 📦 App Metadata & Registry Requirements

  

#### 1. 🆔 About Panel

  

Each app must include an accessible About panel that displays:

- Version number (e.g., Version: 1.2.3)
- Last updated date (e.g., 2025-07-30)
- Release notes: A short bulleted list of recent changes (3--5 items max)

  

Implementation Requirements:

- Add a floating "About" button in the bottom-left corner of the screen.
- On click/tap, toggle the panel showing version info and release notes.
- The panel must:

    - Be mobile- and desktop-friendly

    - Match app styling

    - Use readable font (≥14px)

    - Include a Close button or dismiss on outside click
- Do not use hover-only behavior (must work on touch devices).

  

Display Format Example:
    
    
    Version: 1.2.3  
    Last Updated: 2025-07-30
    
    Release Notes:
    - 🆕 Added About panel
    - 🐛 Fixed crash on submit
    - 💄 Improved styling for mobile
* * *

#### 2. 🧭 Update

#### hub.html

####  When Adding a New App

  

When a new app is added to the repository, the agent must:

- Locate hub.html in the repo root (or specified directory).
- Append a new entry/link for the app using this format:
    
    
    <li><a href="./apps/[app-folder-name]/index.html">[App Display Name]</a></li>

Example:
    
    
    <li><a href="./apps/task-tracker/index.html">Task Tracker</a></li>

Additional Notes:

- The app folder must be inside the /apps/ directory.
- If hub.html doesn't exist, create it with a basic unordered list structure.
- Keep the entries sorted alphabetically by display name for easier navigation.
* * *

#### 3. ✅ Highlighting New Features

When a new capability or app is added, it should be highlighted to the user.

- In the `FutureProjects.html` and `apps/idea-explorer/index.html` files, mark the project or idea as "accomplished" by changing its title color to green.
- Use the Tailwind CSS class `text-green-500` for this purpose.

* * *

### YAML File

- apps_inventory.yaml

#### 4. App Inventory File

When a new app is added, the agent must:

- Locate the `apps_inventory.yaml` file in the repo root.
- Append a new entry for the app, including:
    - `name`: The user-facing display name of the app.
    - `description`: A detailed, well-written paragraph describing the app's purpose, key features, and user benefits.
    - `path`: The relative path to the app's main HTML file (e.g., `apps/[app-folder-name]/index.html`).

Example Entry:

```yaml
- name: "New Awesome App"
  description: "This app helps users achieve [goal] by providing [key feature 1] and [key feature 2]. It is designed for [target audience] and solves the problem of [problem solved]."
  path: "apps/new-awesome-app/index.html"
```

**Important:** Ensure the YAML syntax is valid. Keep the list sorted alphabetically by the `name` field.

* * *

Always have a Return to Hub button on the home page of an app

Would you like a YAML or JSON version of this spec for use in other automation tools or LLM context windows?
