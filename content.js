/* Add an informative message to indicate that the extension for this site is on */
(function () {
  // Create a new message element
  const messageDiv = document.createElement("div");
  messageDiv.className = "my-extension-banner";

  // The message's text container
  const textSpan = document.createElement("span");

  const messageHTML = `
    <div>
      🟢 התוסף שלי לסינון המשרות פעיל.
      <hr>
      בתפריט משמאל:
      <br><br>
       1️⃣ בחר 'תחום' וסמן:
       <br><br>
       'דרושים פיתוח תוכנה'
       <hr>
      2️⃣ בחר 'מקצוע' וסמן: 
      <br><br>
      'Frontend Developer'
       <br>
       +
       <br>
       'Fullstack Developer'
       <br>
       +
       <br>
       ' מפתח React '
       <hr>
       3️⃣ בחר 'אזור' וסמן:
       <br><br>
        'ת"א והמרכז'
       <br>
        +
       <br>
        'השרון'
        <br>
        +
       <br>
        'שפלה'
        <hr>
       ✅ בסיום הקלק על 'חיפוש'
    </div>
  `;

  textSpan.innerHTML = messageHTML;

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.className = "my-extension-close";

  closeBtn.addEventListener("click", () => {
    messageDiv.remove();
  });

  messageDiv.appendChild(textSpan);
  messageDiv.appendChild(closeBtn);

  document.body.appendChild(messageDiv);
})();

(function () {
  // Filter jobs by experience and mark applied jobs from localStorage
  const filterAndMarkJobs = () => {
    const jobs = document.querySelectorAll(".item");
    let countHidden = 0;

    const appliedJobIds = JSON.parse(
      localStorage.getItem("appliedJobIds") || "[]"
    );

    jobs.forEach((job) => {
      const jobText = job.innerText.toLowerCase();
      const experienceRegex = /(\d+)\s*(שנות|שנה)\s*ניסיון/g;
      let match;
      let hideJob = false;

      // Mark job as applied if its ID exists in localStorage
      const jobIdElement = job.querySelector(".career_num");
      if (jobIdElement) {
        const idMatch = jobIdElement.innerText.match(/(\d+)/);
        if (idMatch) {
          const jobId = idMatch[1];
          if (appliedJobIds.includes(jobId)) {
            job.classList.add("applied-job");
          } else {
            job.classList.remove("applied-job");
          }
        }
      }

      // Filter by experience (hide jobs that require 4+ years)
      while ((match = experienceRegex.exec(jobText)) !== null) {
        const experienceYears = parseInt(match[1], 10);
        if (!isNaN(experienceYears) && experienceYears >= 4) {
          hideJob = true;
          break;
        }
      }

      if (hideJob) {
        job.style.display = "none";
        countHidden++;
      } else {
        job.style.display = "";
      }
    });

    console.log(
      `Filtering complete: ${countHidden} jobs with 4+ years of experience were hidden.`
    );
  };

  // Event delegation: handle clicks on "Send CV" buttons and mark jobs immediately
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button.popupHpOpen.button");
    if (!button) return;

    const jobContainer = button.closest(".item");
    if (!jobContainer) return;

    const jobIdElement = jobContainer.querySelector(".career_num");
    if (!jobIdElement) return;

    const match = jobIdElement.innerText.match(/(\d+)/);
    if (!match) return;

    const jobId = match[1];

    let appliedJobIds = JSON.parse(
      localStorage.getItem("appliedJobIds") || "[]"
    );

    if (!appliedJobIds.includes(jobId)) {
      appliedJobIds.push(jobId);
      localStorage.setItem("appliedJobIds", JSON.stringify(appliedJobIds));
      console.log(`Job ID ${jobId} saved to local storage.`);
    }

    // Mark visually immediately
    jobContainer.classList.add("applied-job");
  });

  // Handle automatic navigation from "thank you" page back to jobs list (if exists)
  const handleAutomaticNavigation = () => {
    const backButton = document.querySelector('a.button[href*="/jobs/"]');

    if (backButton) {
      console.log("Back button found. Automatically navigating back.");
      localStorage.setItem("shouldReload", "true");
      window.history.back();
    }
  };

  // Main function
  const main = () => {
    handleAutomaticNavigation();

    if (window.location.href.includes("/jobs/")) {
      if (localStorage.getItem("shouldReload") === "true") {
        localStorage.removeItem("shouldReload");
        console.log("Navigated back to jobs page, reloading to apply the filter.");
        window.location.reload();
      } else {
        // Try once in case jobs already exist
        filterAndMarkJobs();
      }
    }
  };

  // Observe DOM changes to handle dynamically loaded job items
  const jobsObserver = new MutationObserver(() => {
    const jobs = document.querySelectorAll(".item");
    if (jobs.length > 0) {
      filterAndMarkJobs();
    }
  });

  jobsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial run
  main();
})();
