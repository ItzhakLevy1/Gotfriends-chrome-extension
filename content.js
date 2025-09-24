(function() {
    // The main job filtering function. It will be called when the jobs page content is ready.
    const filterJobs = () => {
        // Correct selector for job listings.
        const jobs = document.querySelectorAll('.inner');
        let countHidden = 0;

        jobs.forEach(job => {
            const jobText = job.innerText.toLowerCase();
            const experienceRegex = /(\d+)\s*(שנות|שנה)\s*ניסיון/g;
            let match;
            let hideJob = false;

            while ((match = experienceRegex.exec(jobText)) !== null) {
                const experienceYears = parseInt(match[1], 10);
                if (!isNaN(experienceYears)) {
                    if (experienceYears >= 5) {
                        hideJob = true;
                        break;
                    }
                }
            }

            if (hideJob) {
                job.style.display = 'none';
                countHidden++;
            } else {
                job.style.display = '';
            }
        });

        console.log(`Filtering complete: ${countHidden} jobs with 5+ years of experience were hidden.`);
        console.log('Note: The filtering relies on basic text analysis and may not be 100% accurate.');
    };

    // This function will handle the automatic navigation.
    const handleAutomaticNavigation = () => {
        const backButton = document.querySelector('a.button[href*="/jobs/"]');

        if (backButton) {
            console.log("Back button found. Automatically navigating back.");
            // Navigate back to the jobs page.
            window.history.back();
            // Set a flag to tell the next page that it needs to reload.
            localStorage.setItem('shouldReload', 'true');
        }
    };
    
    // The main function to run on every page load and URL change.
    const main = () => {
        // Handle navigation first. If a back button is present, we handle the navigation
        // and do not proceed with filtering on this page.
        handleAutomaticNavigation();

        // Check if the current URL is the jobs page.
        if (window.location.href.includes('/jobs/')) {
            // Check if we need to reload the page based on the flag set earlier.
            if (localStorage.getItem('shouldReload') === 'true') {
                localStorage.removeItem('shouldReload');
                console.log("Navigated back to jobs page, reloading to apply the filter.");
                window.location.reload();
            } else {
                // If the URL is the jobs page and no reload is needed, apply the filter.
                // We wrap it in a setTimeout to give the page a moment to render content,
                // which is a common pattern for SPAs.
                setTimeout(filterJobs, 500); // 500ms delay
            }
        }
    };

    // Use a MutationObserver to listen for URL changes and re-run the main logic.
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            main();
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Run the main function on the initial page load.
    main();

})();