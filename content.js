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
  // 1. Helper to get clean numeric ID
  const getJobId = (container) => {
    const idElem = container.querySelector(".career_num");
    if (!idElem) return null;
    const match = idElem.innerText.match(/(\d+)/);
    return match ? match[1] : null;
  };

  // 2. Main logic
  const filterAndMarkJobs = () => {
    const jobs = document.querySelectorAll(".item_content");
    if (jobs.length === 0) return;

    // Clean Storage: Remove non-numeric garbage once per run
    let stored = JSON.parse(localStorage.getItem("appliedJobIds") || "[]");
    const appliedJobIds = stored.filter((id) => /^\d+$/.test(id));
    if (stored.length !== appliedJobIds.length) {
      localStorage.setItem("appliedJobIds", JSON.stringify(appliedJobIds));
    }

    const expRegex =
      /(\d+)\s*(שנות|שנה|שנים)\s*([^0-9\r\n]{0,15})\s*נ[י]?סיון/g;

    jobs.forEach((job) => {
      const jobId = getJobId(job);

      // --- THE CRITICAL FIX ---
      // Only apply the green class if we have a VALID numeric ID and it's in the list
      if (jobId && appliedJobIds.includes(jobId)) {
        job.classList.add("applied-job");
      } else {
        job.classList.remove("applied-job");
      }

      // Experience Filtering (keeping your logic)
      const text = job.innerText;
      expRegex.lastIndex = 0;
      let match;
      let shouldHide = false;
      while ((match = expRegex.exec(text)) !== null) {
        if (parseInt(match[1], 10) >= 4) {
          shouldHide = true;
          break;
        }
      }
      job.style.display = shouldHide ? "none" : "";
    });
  };

  // 3. Click Listener
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("button.popupHpOpen");
    if (!btn) return;

    const container = btn.closest(".item_content") || btn.closest(".inner");
    if (!container) return;

    const jobId = getJobId(container);
    if (jobId && /^\d+$/.test(jobId)) {
      let ids = JSON.parse(localStorage.getItem("appliedJobIds") || "[]");
      if (!ids.includes(jobId)) {
        ids.push(jobId);
        localStorage.setItem("appliedJobIds", JSON.stringify(ids));
        container.classList.add("applied-job");
        console.log(`[Applied] Job ID ${jobId} saved.`);
      }
    }
  });

  // 4. Navigation & Initial Run
  const main = () => {
    const backBtn = document.querySelector('a.button[href*="/jobs/"]');
    if (backBtn) {
      localStorage.setItem("shouldReload", "true");
      window.history.back();
      return;
    }

    if (window.location.href.includes("/jobs/")) {
      if (localStorage.getItem("shouldReload") === "true") {
        localStorage.removeItem("shouldReload");
        window.location.reload();
      } else {
        setTimeout(filterAndMarkJobs, 600);
      }
    }
  };

  // 5. Optimized Observer (Throttled)
  let timeout = null;
  const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(filterAndMarkJobs, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });
  main();
})();
