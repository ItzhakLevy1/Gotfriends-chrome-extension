README
# Job Filter for GotFriends

This Chrome extension is designed to streamline your job search on the `gotfriends.co.il` website. It automates two key tasks to improve your efficiency: filtering job listings and navigating the site.

## Features

### 1. Job Filtering
The extension automatically hides job listings that require **5 or more years of experience**. This helps you focus only on opportunities that match your experience level. The filter works by scanning each job posting's text for phrases like "שנות ניסיון" (years of experience) and hiding any jobs that exceed the specified threshold.

### 2. Automated Navigation
After you apply for a job, the website navigates you to a confirmation page. This extension simplifies the process of returning to the job listings by:
* Automatically detecting the "back" button on the post-application page.
* Navigating you back to the main jobs page using the browser's history.
* Immediately refreshing the page to apply the filter to the newly loaded list of jobs.

## How to Install

1.  **Download the files**: Get the `manifest.json` and `content.js` files.
2.  **Open Chrome Extensions**: In your Chrome browser, type `chrome://extensions` in the address bar and press Enter.
3.  **Enable Developer Mode**: In the top right corner of the Extensions page, toggle on the "Developer mode" switch.
4.  **Load the Extension**: Click the "Load unpacked" button that appears.
5.  **Select the Folder**: Navigate to and select the folder containing the `manifest.json` and `content.js` files.

The extension will now be active and ready to use whenever you visit `gotfriends.co.il`.

## Usage

Simply browse the job listings on `gotfriends.co.il` and set your filtering  parameters available on the site. The extension will automatically hide jobs that require 5+ years of experience. After submitting your CV, the extension will handle the navigation and reload for you, making your job search seamless.

## How It Works

The core of this extension is the `content.js` file, which is injected into the website's pages. It uses standard JavaScript to interact with the page's content. A `MutationObserver` is also used to listen for changes on the page, which makes the extension robust and effective on single-page applications (SPAs) like `gotfriends.co.il`. This ensures that even if the page content changes without a full reload, the filtering and navigation logic will still work correctly.
