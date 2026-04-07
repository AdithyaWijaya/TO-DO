# Implementation Plan: Life Dashboard

## Overview

This implementation plan breaks down the Life Dashboard feature into discrete coding tasks. The application is built with vanilla HTML, CSS, and JavaScript following a modular component architecture. Each module manages its own state, DOM interactions, and Local Storage persistence. Tasks are organized to build incrementally, starting with core infrastructure, then implementing each feature module, and finally integrating everything together.

## Tasks

- [ ] 1. Set up Storage Manager and core infrastructure
  - Implement StorageManager object with get, set, and remove methods
  - Add JSON serialization/deserialization with error handling
  - Create consistent storage key naming convention (life-dashboard-* prefix)
  - _Requirements: 3.2, 7.3, 11.1, 12.3, 13.1, 14.4, 16.5_

- [ ] 2. Implement Greeting Module
  - [ ] 2.1 Create GreetingModule with time and date display
    - Implement updateTime function to display current time in 12-hour format with AM/PM
    - Implement date display in human-readable format
    - Set up setInterval to update time every second
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ] 2.2 Implement contextual greeting logic
    - Create getGreetingText function with time-based logic (morning/afternoon/evening/night)
    - Implement greeting display that updates based on current hour
    - Add user name integration to greeting message
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 2.3 Implement user name input and persistence
    - Add event listener for name input field
    - Save user name to Local Storage on input change
    - Load user name from Local Storage on page load
    - Update greeting immediately when name changes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3. Implement Focus Timer Module
  - [ ] 3.1 Create FocusTimerModule with basic timer state
    - Initialize timer with 25-minute default duration
    - Implement timer state management (duration, remaining, isRunning)
    - Create updateDisplay function to show time in MM:SS format
    - _Requirements: 4.1, 4.7_
  
  - [ ] 3.2 Implement timer controls (start, stop, reset)
    - Add start function that begins countdown using setInterval
    - Add stop function that pauses countdown
    - Add reset function that returns to initial duration
    - Implement tick function that decrements remaining time
    - Prevent multiple intervals from running simultaneously
    - _Requirements: 4.2, 4.3, 4.5, 4.6_
  
  - [ ] 3.3 Implement timer completion and notification
    - Detect when timer reaches zero and stop automatically
    - Display visual completion notification
    - Play audio notification on completion
    - Add dismiss button for notification
    - _Requirements: 4.4, 6.1, 6.2, 6.3_
  
  - [ ] 3.4 Implement adjustable timer duration
    - Add input field for custom duration (1-60 minutes)
    - Validate duration input range
    - Save custom duration to Local Storage
    - Load custom duration from Local Storage on page load
    - Prevent duration changes while timer is running
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4. Implement Tasks Module
  - [ ] 4.1 Create TasksModule with task list state
    - Initialize tasks array
    - Implement task data model (id, description, completed, createdAt)
    - Create saveTasks function to persist to Local Storage
    - Load tasks from Local Storage on initialization
    - _Requirements: 7.3, 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 4.2 Implement task creation
    - Add event listener for task input and add button
    - Validate task description (non-empty, no duplicates)
    - Create new task with unique ID and timestamp
    - Add task to array and save to Local Storage
    - Clear input field after successful creation
    - Prevent duplicate task creation with case-insensitive comparison
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6, 7.7_
  
  - [ ] 4.3 Implement task completion toggle
    - Add click handler for task completion checkbox
    - Toggle task completed status
    - Update task in Local Storage
    - Apply visual styling for completed tasks
    - Allow toggling between complete and incomplete states
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 4.4 Implement task editing and deletion
    - Add edit button for each task
    - Show input field with current description when editing
    - Update task description and save to Local Storage
    - Add delete button for each task
    - Remove task from array and Local Storage on delete
    - Update displayed task list after edit or delete
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ] 4.5 Implement task sorting
    - Add sort by status button (incomplete tasks first)
    - Add sort by time button (newest first)
    - Implement sortTasks function with sort preference
    - Save sort preference to Local Storage
    - Load sort preference on page load
    - Re-render task list after sorting
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 4.6 Implement task rendering
    - Create renderTasks function to display all tasks
    - Generate task list HTML with checkboxes, descriptions, and action buttons
    - Apply completion styling to completed tasks
    - Attach event listeners to task elements
    - Call renderTasks after any task operation
    - _Requirements: 7.4, 8.4, 9.6, 11.2_

- [ ] 5. Implement Links Module
  - [ ] 5.1 Create LinksModule with links list state
    - Initialize links array
    - Implement link data model (id, name, url)
    - Create saveLinks function to persist to Local Storage
    - Load links from Local Storage on initialization
    - _Requirements: 12.3, 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 5.2 Implement link creation
    - Add event listeners for link name, URL inputs, and add button
    - Validate link inputs (both name and URL required)
    - Auto-prepend https:// if protocol missing from URL
    - Create new link with unique ID
    - Add link to array and save to Local Storage
    - Clear input fields after successful creation
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ] 5.3 Implement link deletion and navigation
    - Add delete button for each link
    - Remove link from array and Local Storage on delete
    - Open link in new tab when clicked (target="_blank")
    - Update displayed link list after deletion
    - _Requirements: 12.5, 12.6, 12.7_
  
  - [ ] 5.4 Implement link rendering
    - Create renderLinks function to display all links
    - Generate link list HTML with clickable links and delete buttons
    - Attach event listeners to link elements
    - Call renderLinks after any link operation
    - _Requirements: 12.4, 13.2_

- [ ] 6. Implement Theme Module
  - [ ] 6.1 Create ThemeModule with theme state
    - Initialize with dark mode as default
    - Implement apply function to set data-theme attribute on document root
    - Create saveTheme function to persist to Local Storage
    - Load theme preference from Local Storage on initialization
    - _Requirements: 14.2, 14.4, 14.5, 14.6_
  
  - [ ] 6.2 Implement theme toggle functionality
    - Add event listener for theme toggle button
    - Toggle between light and dark themes
    - Apply theme immediately when toggled
    - Save theme preference to Local Storage
    - Update button label or icon to reflect current theme
    - _Requirements: 14.1, 14.3, 14.4_

- [ ] 7. Update HTML structure to match design
  - [ ] 7.1 Add missing HTML elements
    - Add theme toggle button with aria-label
    - Add timer duration input field with label
    - Add timer notification container with dismiss button
    - Add task sort control buttons
    - Add audio element for timer notification
    - Ensure all IDs match the design document
    - _Requirements: 4.1, 5.1, 6.1, 10.1, 14.1_
  
  - [ ] 7.2 Update HTML structure for accessibility
    - Add proper ARIA labels to interactive elements
    - Ensure semantic HTML structure
    - Add proper heading hierarchy
    - _Requirements: 15.4, 17.2_

- [ ] 8. Implement CSS styling
  - [ ] 8.1 Create CSS theme variables
    - Define CSS custom properties for grayscale color palette
    - Create light theme variables with [data-theme="light"] selector
    - Define spacing, border radius, and shadow variables
    - _Requirements: 15.1, 15.6, 15.7_
  
  - [ ] 8.2 Style container and layout
    - Style main container with max-width and centering
    - Add responsive layout with proper spacing
    - Apply consistent padding and margins
    - _Requirements: 15.5_
  
  - [ ] 8.3 Style Greeting Section
    - Style time and date displays with appropriate typography
    - Style greeting message with larger font size
    - Style user name input field
    - _Requirements: 15.4_
  
  - [ ] 8.4 Style Focus Timer Section
    - Style timer display with large, readable font
    - Style timer control buttons with hover states
    - Style timer duration input field
    - Style timer notification with visual prominence
    - _Requirements: 15.2, 15.3_
  
  - [ ] 8.5 Style Tasks Section
    - Style task input container and buttons
    - Style task list items with checkboxes
    - Apply strikethrough styling to completed tasks
    - Style edit and delete buttons
    - Style sort control buttons
    - _Requirements: 15.2, 15.3_
  
  - [ ] 8.6 Style Links Section
    - Style link input container and buttons
    - Style link list items as clickable elements
    - Style delete buttons for links
    - Add hover effects for links
    - _Requirements: 15.2, 15.3_
  
  - [ ] 8.7 Style Theme Toggle
    - Position theme toggle button (top-right corner)
    - Style toggle button with appropriate icon or text
    - Add hover and active states
    - _Requirements: 15.2, 15.3_

- [ ] 9. Initialize application and wire modules together
  - [ ] 9.1 Create DOMContentLoaded event listener
    - Initialize all modules in correct order
    - Call init functions for GreetingModule, FocusTimerModule, TasksModule, LinksModule, ThemeModule
    - Ensure all event listeners are attached
    - _Requirements: 17.4_
  
  - [ ] 9.2 Add audio notification file
    - Generate or embed base64-encoded audio for timer completion
    - Ensure audio element is properly configured with preload
    - Test audio playback on timer completion
    - _Requirements: 6.2_

- [ ] 10. Final checkpoint - Ensure all functionality works
  - Test all features in both light and dark themes
  - Verify Local Storage persistence across page reloads
  - Test edge cases (empty inputs, duplicate tasks, timer edge cases)
  - Ensure all requirements are met
  - Verify static site compatibility (no server dependencies)
  - _Requirements: All_

## Notes

- All tasks build incrementally on previous work
- Each module is independent and can be tested in isolation
- Local Storage persistence is implemented at the module level
- The application uses vanilla JavaScript with no external dependencies
- CSS uses custom properties for easy theme switching
- All data validation happens before storage operations
- The design emphasizes simplicity and maintainability
