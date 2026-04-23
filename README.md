# Job Application Optimizer - Chrome Extension
A productivity-focused Chrome Extension designed to streamline the job searching process on recruitment portals. This tool automates the filtering of irrelevant positions and provides visual tracking for submitted applications.

# Features
Smart Experience Filtering: Automatically hides job postings that require high seniority (4+ years of experience) based on real-time text analysis.

Application Tracking: Visually marks jobs you've already applied for with a distinct green highlight and a "Submitted" badge.

Persistence: Uses localStorage to remember your applied jobs across sessions.

Automatic Navigation: Detects "Thank You" pages after submission and automatically navigates back to the job list to save time.

Dynamic Content Support: Utilizes MutationObserver to handle infinite scrolling and dynamically loaded job postings.

On-Page Instructions: Displays a helpful guide (banner) to help users set the correct search filters on the website.

# Technology Stack
JavaScript (ES6+): Core logic, DOM manipulation, and Event Delegation.

CSS3: Custom UI components and visual states.

Chrome Extension API: Manifest V3 integration.

RegEx: Advanced pattern matching for Hebrew text and job ID extraction.

# Installation
Clone this repository or download the source code.

Open Chrome and navigate to chrome://extensions/.

Enable "Developer mode" (top right corner).

Click "Load unpacked" and select the extension folder.

# Project Structure
content.js: Contains the logic for job filtering, ID extraction, and application tracking.

style.css: Defines the visual styles for the extension banner and the "Applied" job state.

manifest.json: Configuration file for the Chrome Extension.

# How It Works
The extension assigns a unique ID to each job by extracting it from the career_num field or data attributes. When the "Send CV" button is clicked, this ID is stored in the browser's local storage. Upon page load or scroll, the script cross-references the visible jobs with the stored IDs and updates the UI accordingly.

