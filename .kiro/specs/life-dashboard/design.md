# Design Document: Life Dashboard

## Overview

Life Dashboard is a personal productivity web application built with vanilla HTML, CSS, and JavaScript. The application provides a unified interface for time awareness, focus management, task tracking, and quick website access. All data persists in browser Local Storage, enabling deployment as a static site on platforms like GitHub Pages.

The design emphasizes simplicity and maintainability through a component-based architecture where each major feature (greeting, timer, tasks, links, theme) operates as an independent module with clear responsibilities. The application uses a grayscale color palette and minimal design language to reduce visual distractions and maintain focus on productivity.

### Key Design Principles

1. **Static Site Architecture**: No server-side dependencies, all logic runs client-side
2. **Local Storage First**: All state persists immediately to browser storage
3. **Component Isolation**: Each feature module manages its own DOM, state, and storage
4. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactivity
5. **Minimal Dependencies**: Zero external libraries or frameworks

## Architecture

### System Architecture

The application follows a modular component architecture where each feature is encapsulated in its own module:

```
┌─────────────────────────────────────────────────────────┐
│                    Life Dashboard                        │
│                     (index.html)                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Greeting   │  │ Focus Timer  │  │    Tasks     │ │
│  │   Module     │  │   Module     │  │   Module     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐ │
│  │    Links     │  │    Theme     │  │   Storage    │ │
│  │   Module     │  │   Module     │  │   Manager    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  Local Storage   │
                │  (Browser API)   │
                └──────────────────┘
```

### Component Responsibilities

**Greeting Module**
- Displays current time (updates every second)
- Displays current date
- Determines and displays contextual greeting based on time of day
- Manages user name input and display
- Persists user name to Local Storage

**Focus Timer Module**
- Manages countdown timer state (running, paused, stopped)
- Displays time remaining in MM:SS format
- Handles start, stop, reset controls
- Allows custom duration configuration (1-60 minutes)
- Persists custom duration to Local Storage
- Triggers audio and visual notifications on completion

**Tasks Module**
- Manages task list state (add, edit, delete, toggle completion)
- Prevents duplicate task creation
- Sorts tasks by completion status or creation time
- Persists task list to Local Storage after every operation
- Validates task input (non-empty descriptions)

**Links Module**
- Manages quick links list (add, delete)
- Opens links in new tabs
- Persists links to Local Storage after every operation
- Validates link input (requires both name and URL)

**Theme Module**
- Manages light/dark mode toggle
- Applies theme-specific CSS classes to document root
- Persists theme preference to Local Storage
- Defaults to dark mode on first load

**Storage Manager**
- Provides abstraction layer over Local Storage API
- Handles JSON serialization/deserialization
- Manages storage keys consistently
- Provides error handling for storage operations

### Data Flow

1. **Initialization Flow**
   - Page loads → Storage Manager reads from Local Storage
   - Each module retrieves its persisted state
   - Modules render initial UI based on stored state
   - Event listeners are attached to interactive elements

2. **User Interaction Flow**
   - User triggers action (click, input, etc.)
   - Module handles event and updates internal state
   - Module updates DOM to reflect new state
   - Module persists new state to Local Storage via Storage Manager

3. **Timer Update Flow**
   - setInterval triggers every second
   - Greeting Module updates time display
   - Focus Timer Module (if running) decrements countdown
   - Focus Timer Module updates display
   - On timer completion, notification is triggered

## Components and Interfaces

### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Dashboard</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <!-- Theme Toggle -->
    <div class="theme-toggle">
      <button id="theme-toggle-btn" aria-label="Toggle theme"></button>
    </div>

    <!-- Greeting Section -->
    <section class="greeting-section">
      <div class="time-display" id="time-display"></div>
      <div class="date-display" id="date-display"></div>
      <div class="greeting-message" id="greeting-message"></div>
      <input type="text" id="user-name-input" placeholder="Enter your name" />
    </section>

    <!-- Focus Timer Section -->
    <section class="timer-section">
      <h2>Focus Timer</h2>
      <div class="timer-display" id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop">Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
      <div class="timer-settings">
        <label for="timer-duration">Duration (minutes):</label>
        <input type="number" id="timer-duration" min="1" max="60" value="25" />
      </div>
      <div class="timer-notification" id="timer-notification" style="display: none;">
        <p>Focus session complete!</p>
        <button id="notification-dismiss">Dismiss</button>
      </div>
    </section>

    <!-- Task Manager Section -->
    <section class="task-section">
      <h2>Tasks</h2>
      <div class="task-input-container">
        <input type="text" id="task-input" placeholder="Add a new task" />
        <button id="task-add">Add</button>
      </div>
      <div class="task-sort-controls">
        <button id="sort-status">Sort by Status</button>
        <button id="sort-time">Sort by Time</button>
      </div>
      <ul class="task-list" id="task-list"></ul>
    </section>

    <!-- Quick Links Section -->
    <section class="links-section">
      <h2>Quick Links</h2>
      <div class="link-input-container">
        <input type="text" id="link-name" placeholder="Link name" />
        <input type="url" id="link-url" placeholder="https://example.com" />
        <button id="link-add">Add Link</button>
      </div>
      <ul class="link-list" id="link-list"></ul>
    </section>
  </div>

  <audio id="timer-audio" src="data:audio/wav;base64,..." preload="auto"></audio>
  <script src="js/script.js"></script>
</body>
</html>
```

### JavaScript Module Structure

```javascript
// Storage Manager
const StorageManager = {
  get(key, defaultValue = null) { /* ... */ },
  set(key, value) { /* ... */ },
  remove(key) { /* ... */ }
};

// Greeting Module
const GreetingModule = {
  userName: '',
  init() { /* ... */ },
  updateTime() { /* ... */ },
  updateGreeting() { /* ... */ },
  handleNameInput() { /* ... */ },
  getGreetingText(hour) { /* ... */ }
};

// Focus Timer Module
const FocusTimerModule = {
  duration: 25 * 60, // seconds
  remaining: 25 * 60,
  isRunning: false,
  intervalId: null,
  init() { /* ... */ },
  start() { /* ... */ },
  stop() { /* ... */ },
  reset() { /* ... */ },
  tick() { /* ... */ },
  updateDisplay() { /* ... */ },
  handleCompletion() { /* ... */ },
  setDuration(minutes) { /* ... */ }
};

// Tasks Module
const TasksModule = {
  tasks: [],
  sortPreference: 'status', // 'status' or 'time'
  init() { /* ... */ },
  addTask(description) { /* ... */ },
  editTask(id, newDescription) { /* ... */ },
  deleteTask(id) { /* ... */ },
  toggleTask(id) { /* ... */ },
  sortTasks() { /* ... */ },
  renderTasks() { /* ... */ },
  saveTasks() { /* ... */ },
  isDuplicate(description) { /* ... */ }
};

// Links Module
const LinksModule = {
  links: [],
  init() { /* ... */ },
  addLink(name, url) { /* ... */ },
  deleteLink(id) { /* ... */ },
  renderLinks() { /* ... */ },
  saveLinks() { /* ... */ }
};

// Theme Module
const ThemeModule = {
  currentTheme: 'dark',
  init() { /* ... */ },
  toggle() { /* ... */ },
  apply(theme) { /* ... */ },
  saveTheme() { /* ... */ }
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  GreetingModule.init();
  FocusTimerModule.init();
  TasksModule.init();
  LinksModule.init();
  ThemeModule.init();
});
```

### CSS Architecture

The CSS follows a component-based structure with theme variables:

```css
/* Theme Variables */
:root {
  --color-bg-primary: #1A1A1A;
  --color-bg-secondary: #2E2E2E;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #E5E5E5;
  --color-border: #6E6E6E;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --radius: 8px;
}

[data-theme="light"] {
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #E5E5E5;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #2E2E2E;
  --color-border: #6E6E6E;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Component Styles */
.container { /* ... */ }
.greeting-section { /* ... */ }
.timer-section { /* ... */ }
.task-section { /* ... */ }
.links-section { /* ... */ }
```

## Data Models

### Local Storage Schema

**Storage Keys:**
- `life-dashboard-user-name`: String
- `life-dashboard-timer-duration`: Number (minutes)
- `life-dashboard-tasks`: JSON Array
- `life-dashboard-links`: JSON Array
- `life-dashboard-theme`: String ('light' | 'dark')
- `life-dashboard-sort-preference`: String ('status' | 'time')

### Task Object

```typescript
interface Task {
  id: string;           // UUID or timestamp-based unique identifier
  description: string;  // Task description text
  completed: boolean;   // Completion status
  createdAt: number;    // Unix timestamp (milliseconds)
}
```

Example:
```json
{
  "id": "1704067200000-abc123",
  "description": "Review design document",
  "completed": false,
  "createdAt": 1704067200000
}
```

### Quick Link Object

```typescript
interface QuickLink {
  id: string;    // UUID or timestamp-based unique identifier
  name: string;  // Display name for the link
  url: string;   // Full URL including protocol
}
```

Example:
```json
{
  "id": "1704067200000-def456",
  "name": "GitHub",
  "url": "https://github.com"
}
```

### Storage Operations

**Read Operations:**
```javascript
// Get user name
const userName = StorageManager.get('life-dashboard-user-name', '');

// Get tasks
const tasks = StorageManager.get('life-dashboard-tasks', []);

// Get theme
const theme = StorageManager.get('life-dashboard-theme', 'dark');
```

**Write Operations:**
```javascript
// Save user name
StorageManager.set('life-dashboard-user-name', 'John');

// Save tasks
StorageManager.set('life-dashboard-tasks', tasksArray);

// Save theme
StorageManager.set('life-dashboard-theme', 'light');
```

### Data Validation

**Task Validation:**
- Description must be non-empty after trimming whitespace
- Description must not match existing task (case-insensitive comparison)
- Completed must be boolean
- CreatedAt must be valid timestamp

**Link Validation:**
- Name must be non-empty after trimming whitespace
- URL must be non-empty after trimming whitespace
- URL should start with http:// or https:// (auto-prepend if missing)

**Timer Duration Validation:**
- Must be integer between 1 and 60 (inclusive)
- Defaults to 25 if invalid value provided

**User Name Validation:**
- Can be empty string (no name set)
- Trimmed of leading/trailing whitespace before storage

