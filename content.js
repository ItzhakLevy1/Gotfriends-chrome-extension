(function() {
    // The main job filtering and marking function
    const filterAndMarkJobs = () => {
        const jobs = document.querySelectorAll('.inner');
        let countHidden = 0;
        const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobIds') || '[]');

        jobs.forEach(job => {
            const jobText = job.innerText.toLowerCase();
            const experienceRegex = /(\d+)\s*(שנות|שנה)\s*ניסיון/g;
            let match;
            let hideJob = false;
            
            // Check if this job has already been applied for by its ID
            const jobIdElement = job.querySelector('.career_num');
            if (jobIdElement) {
                const jobId = jobIdElement.innerText.match(/(\d+)/)[1];
                if (appliedJobIds.includes(jobId)) {
                    job.classList.add('applied-job');
                } else {
                    job.classList.remove('applied-job');
                }
            }

            // The rest of the filtering logic remains the same
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

    // This function adds a click listener to the "send CV" button on the main jobs list
    const addApplyButtonListeners = () => {
        const applyButtons = document.querySelectorAll('.item .bottom .button');
        
        applyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const jobContainer = event.target.closest('.item');
                if (jobContainer) {
                    const jobIdElement = jobContainer.querySelector('.career_num');
                    if (jobIdElement) {
                        const jobId = jobIdElement.innerText.match(/(\d+)/)[1];
                        let appliedJobIds = JSON.parse(localStorage.getItem('appliedJobIds') || '[]');
                        if (!appliedJobIds.includes(jobId)) {
                            appliedJobIds.push(jobId);
                            localStorage.setItem('appliedJobIds', JSON.stringify(appliedJobIds));
                            console.log(`Job ID ${jobId} saved to local storage on button click.`);
                        }
                    }
                }
            });
        });
    };

    // This function handles the automatic navigation.
    const handleAutomaticNavigation = () => {
        // Look for the specific back button on the "thank you" page
        const backButton = document.querySelector('a.button[href*="/jobs/"]');

        if (backButton) {
            console.log("Back button found. Automatically navigating back.");
            // Set a flag to tell the next page that it needs to reload.
            localStorage.setItem('shouldReload', 'true');
            // Navigate back to the jobs page.
            window.history.back();
        }
    };
    
    // The main function to run on every page load and URL change.
    const main = () => {
        // Handle navigation first.
        handleAutomaticNavigation();

        // Check if we need to reload the page based on the flag set earlier.
        if (window.location.href.includes('/jobs/')) {
            if (localStorage.getItem('shouldReload') === 'true') {
                localStorage.removeItem('shouldReload');
                console.log("Navigated back to jobs page, reloading to apply the filter.");
                window.location.reload();
            } else {
                // If the URL is the jobs page and no reload is needed, apply the filter and add listeners.
                setTimeout(filterAndMarkJobs, 500);
                addApplyButtonListeners();
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