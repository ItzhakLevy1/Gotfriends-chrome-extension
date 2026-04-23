/* Add an informative message to indicate that the extension for this site is on */
(function () {
  const messageDiv = document.createElement("div");
  messageDiv.className = "my-extension-banner";

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

  messageDiv.innerHTML = messageHTML;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.className = "my-extension-close";
  closeBtn.addEventListener("click", () => messageDiv.remove());

  messageDiv.appendChild(closeBtn);
  document.body.appendChild(messageDiv);
})();

(function () {
  // Main logic to filter jobs and mark applied ones
  const filterAndMarkJobs = () => {
    // Select all job containers
    const jobs = document.querySelectorAll(".item");
    let countHidden = 0;

    // Retrieve applied job IDs from local storage
    const appliedJobIds = JSON.parse(
      localStorage.getItem("appliedJobIds") || "[]",
    );

    /**
     * Improved Regex patterns:
     * 1. Matches: "X years [of/in/with] experience" (Supports spelling variations)
     * 2. Matches: "Experience [of/above] X years"
     */
    const expRegex =
      /(\d+)\s*(שנות|שנה|שנים)\s*([^0-9\r\n]{0,15})\s*נ[י]?סיון/g;
    const reverseExpRegex =
      /נ[י]?סיון\s*([^0-9\r\n]{0,15})\s*(\d+)\s*(שנות|שנה|שנים)/g;

    jobs.forEach((job) => {
      const jobText = job.innerText;
      let hideJob = false;

      // Logic to mark job if it was already applied for
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

      // Check if job requires 4 or more years of experience
      const isHighExperience = (text) => {
        let match;
        // Reset regex index before testing
        expRegex.lastIndex = 0;
        reverseExpRegex.lastIndex = 0;

        // Test standard pattern
        while ((match = expRegex.exec(text)) !== null) {
          if (parseInt(match[1], 10) >= 4) return true;
        }
        // Test reverse pattern
        while ((match = reverseExpRegex.exec(text)) !== null) {
          if (parseInt(match[2], 10) >= 4) return true;
        }
        return false;
      };

      if (isHighExperience(jobText)) {
        hideJob = true;
      }

      // Final visibility toggle
      if (hideJob) {
        job.style.display = "none";
        countHidden++;
      } else {
        job.style.display = "";
      }
    });

    if (countHidden > 0) {
      console.log(`[JobFilter] Hidden ${countHidden} high-experience jobs.`);
    }
  };

  // Track clicks on "Send CV" button using event delegation
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button.popupHpOpen.button");
    if (!button) return;

    const jobContainer = button.closest(".item");
    if (!jobContainer) return;

    const jobIdElement = jobContainer.querySelector(".career_num");
    if (!jobIdElement) return;

    const idMatch = jobIdElement.innerText.match(/(\d+)/);
    if (!idMatch) return;

    const jobId = idMatch[1];
    let appliedJobIds = JSON.parse(
      localStorage.getItem("appliedJobIds") || "[]",
    );

    if (!appliedJobIds.includes(jobId)) {
      appliedJobIds.push(jobId);
      localStorage.setItem("appliedJobIds", JSON.stringify(appliedJobIds));
      jobContainer.classList.add("applied-job");
    }
  });

  // Handle automatic return navigation from 'thank you' page
  const handleAutomaticNavigation = () => {
    const backButton = document.querySelector('a.button[href*="/jobs/"]');
    if (backButton) {
      localStorage.setItem("shouldReload", "true");
      window.history.back();
    }
  };

  const main = () => {
    handleAutomaticNavigation();

    if (window.location.href.includes("/jobs/")) {
      if (localStorage.getItem("shouldReload") === "true") {
        localStorage.removeItem("shouldReload");
        window.location.reload();
      } else {
        // Initial execution delay to ensure items are rendered
        setTimeout(filterAndMarkJobs, 500);
      }
    }
  };

  // Monitor DOM for dynamic content changes (Infinite scroll/Filter updates)
  const observer = new MutationObserver(() => {
    filterAndMarkJobs();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  main();
})();
