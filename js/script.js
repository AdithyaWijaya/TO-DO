document.addEventListener("DOMContentLoaded", () => {
  const paymentOverlay = document.getElementById("paymentOverlay");
  const paymentForm = document.getElementById("paymentForm");
  const paymentSuccess = document.getElementById("paymentSuccess");
  const payButton = document.getElementById("payButton");
  const cardNumber = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");
  const buttonText = payButton.querySelector(".button-text");
  const buttonLoading = payButton.querySelector(".button-loading");

  let isPaid = localStorage.getItem("dashboardPaid") === "true";
  let firstInteraction = !isPaid;
  let interactionsBlocked = false;

  function showPaymentModal() {
    paymentOverlay.classList.add("show");
    document.body.classList.add("locked");
  }

  function hidePaymentModal() {
    paymentOverlay.classList.remove("show");
    document.body.classList.remove("locked");
    interactionsBlocked = false;
  }

  function validatePayment() {
    const card = cardNumber.value.trim().replace(/\s/g, "");
    const exp = expiry.value.trim();
    const cvvVal = cvv.value.trim();

    const isValid =
      card === "9256619126291708" && exp === "07/29" && cvvVal === "0874";

    [cardNumber, expiry, cvv].forEach((input) => {
      const val = input.value.trim();
      if (!val) {
        input.classList.add("invalid");
      } else if (
        input === cardNumber &&
        val.replace(/\s/g, "") !== "9256619126291708"
      ) {
        input.classList.add("invalid");
      } else if (input === expiry && val !== "07/29") {
        input.classList.add("invalid");
      } else if (input === cvv && val !== "0874") {
        input.classList.add("invalid");
      } else {
        input.classList.remove("invalid");
      }
    });

    return isValid;
  }

  function processPayment() {
    buttonText.style.display = "none";
    buttonLoading.style.display = "inline";
    payButton.disabled = true;
    payButton.style.cursor = "wait";

    setTimeout(() => {
      if (validatePayment()) {
        paymentForm.style.display = "none";
        paymentSuccess.style.display = "block";
        localStorage.setItem("dashboardPaid", "true");
        isPaid = true;
        interactionsBlocked = false;
        setTimeout(() => {
          hidePaymentModal();
        }, 2000);
      } else {
        paymentOverlay.style.animation = "shake 0.5s ease";
        setTimeout(() => {
          paymentOverlay.style.animation = "";
        }, 500);

        buttonText.style.display = "inline";
        buttonLoading.style.display = "none";
        payButton.disabled = false;
        payButton.style.cursor = "pointer";
      }
    }, 1500);
  }

  function checkPayment(callback) {
    if (!isPaid) {
      showPaymentModal();
      interactionsBlocked = true;
      return;
    }

    callback();
  }

  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    processPayment();
  });

  cardNumber.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    val = val.match(/.{1,4}/g)?.join(" ") || val;
    e.target.value = val;
    e.target.classList.remove("invalid");
  });

  expiry.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    e.target.value = val;
    e.target.classList.remove("invalid");
  });

  cvv.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/gi, "");
    e.target.classList.remove("invalid");
  });
  const greeting = document.getElementById("greeting");
  const timeEl = document.getElementById("time");
  const date = document.getElementById("date");
  const nameInput = document.getElementById("nameInput");
  const setNameBtn = document.getElementById("setNameBtn");

  const timerDisplay = document.getElementById("timerDisplay");
  const timerMinutes = document.getElementById("timerMinutes");
  const timerSeconds = document.getElementById("timerSeconds");
  const setTimerBtn = document.getElementById("setTimer");

  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");

  const linkName = document.getElementById("linkName");
  const linkURL = document.getElementById("linkURL");
  const linkList = document.getElementById("linkList");

  const themeToggle = document.getElementById("themeToggle");

  let timer = 1500;
  let interval = null;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let links = JSON.parse(localStorage.getItem("links")) || [];
  const savedTimerMin = localStorage.getItem("timerMinutes") || 25;
  const savedTimerSec = localStorage.getItem("timerSeconds") || 0;
  timerMinutes.value = savedTimerMin;
  timerSeconds.value = savedTimerSec;
  timer = parseInt(savedTimerMin) * 60 + parseInt(savedTimerSec);

  function updateTime() {
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    timeEl.textContent =
      hour.toString().padStart(2, "0") +
      ":" +
      minute.toString().padStart(2, "0") +
      ":" +
      second.toString().padStart(2, "0");
    date.textContent = now.toDateString();
    updateGreeting(hour);
  }

  function updateGreeting(hour) {
    let name = localStorage.getItem("name") || "";
    let greet = "";
    if (hour >= 5 && hour < 12) greet = "Good morning";
    else if (hour < 17) greet = "Good afternoon";
    else if (hour < 21) greet = "Good evening";
    else greet = "Good night";

    greeting.innerHTML = name
      ? `${greet}, <span style="color: var(--accent-primary);">${name}</span>`
      : greet;
  }

  nameInput.value = localStorage.getItem("name") || "";
  function setName() {
    const name = nameInput.value.trim();
    if (name) {
      localStorage.setItem("name", name);
    } else {
      localStorage.removeItem("name");
    }
    updateGreeting(new Date().getHours());
  }

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPayment(setName);
  });
  setNameBtn.onclick = () => checkPayment(setName);

  setInterval(updateTime, 1000);
  updateTime();

  function updateTimer() {
    let m = Math.floor(timer / 60);
    let s = timer % 60;
    timerDisplay.textContent =
      m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  }

  updateTimer();

  setTimerBtn.onclick = () =>
    checkPayment(() => {
      const min = parseInt(timerMinutes.value) || 0;
      const sec = parseInt(timerSeconds.value) || 0;
      if (min === 0 && sec === 0) return;
      if (min > 120 || sec > 59) {
        alert("Max 120 min / 59 sec");
        return;
      }
      timer = min * 60 + sec;
      localStorage.setItem("timerMinutes", min);
      localStorage.setItem("timerSeconds", sec);
      updateTimer();
    });

  document.getElementById("startTimer").onclick = () =>
    checkPayment(() => {
      if (interval) return;
      interval = setInterval(() => {
        if (timer <= 0) {
          clearInterval(interval);
          interval = null;
          timerDisplay.style.color = "var(--accent-success)";
          setTimeout(() => {
            alert("🎉 Focus session complete!");
            timerDisplay.style.color = "";
          }, 100);
          return;
        }
        timer--;
        updateTimer();
      }, 1000);
    });

  document.getElementById("stopTimer").onclick = () =>
    checkPayment(() => {
      clearInterval(interval);
      interval = null;
    });

  document.getElementById("resetTimer").onclick = () =>
    checkPayment(() => {
      const min = parseInt(timerMinutes.value) || 25;
      const sec = parseInt(timerSeconds.value) || 0;
      timer = min * 60 + sec;
      updateTimer();
      clearInterval(interval);
      interval = null;
    });

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      };

      const taskText = document.createElement("span");
      taskText.className = "task-text";
      taskText.textContent = task.text;
      if (task.completed) taskText.classList.add("completed");

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.innerHTML = "×";
      del.onclick = (e) => {
        e.stopPropagation();
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
      };

      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(del);
      taskList.appendChild(li);
    });
  }

  document.getElementById("addTask").onclick = () =>
    checkPayment(() => {
      const text = taskInput.value.trim();
      if (!text) return;
      if (tasks.some((t) => t.text === text)) {
        alert("Task already exists!");
        return;
      }
      tasks.push({
        id: Date.now(),
        text,
        completed: false,
      });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("addTask").click();
  });

  renderTasks();

  function saveLinks() {
    localStorage.setItem("links", JSON.stringify(links));
  }

  function renderLinks() {
    linkList.innerHTML = "";
    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "task-text";
      a.innerHTML = `<i class="fas fa-external-link-alt"></i> ${link.name}`;

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.innerHTML = "×";
      del.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        links = links.filter((l) => l.id !== link.id);
        saveLinks();
        renderLinks();
      };

      li.appendChild(a);
      li.appendChild(del);
      linkList.appendChild(li);
    });
  }

  document.getElementById("addLink").onclick = () =>
    checkPayment(() => {
      let name = linkName.value.trim();
      let url = linkURL.value.trim();
      if (!name || !url) return;
      if (!url.startsWith("http")) url = "https://" + url;
      links.push({ id: Date.now(), name, url });
      linkName.value = linkURL.value = "";
      saveLinks();
      renderLinks();
    });

  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeToggle.onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.innerHTML =
      next === "dark"
        ? '<i class="fas fa-moon"></i> Dark'
        : '<i class="fas fa-sun"></i> Light';
  };
  themeToggle.innerHTML =
    savedTheme === "dark"
      ? '<i class="fas fa-sun"></i> Light'
      : '<i class="fas fa-moon"></i> Dark';
});
