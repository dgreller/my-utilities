

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

Always have a Return to Hub button on the home page of an app

Would you like a YAML or JSON version of this spec for use in other automation tools or LLM context windows?
