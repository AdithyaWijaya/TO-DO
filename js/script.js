document.addEventListener("DOMContentLoaded", () => {
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
    if (e.key === "Enter") setName();
  });
  setNameBtn.onclick = setName;

  setInterval(updateTime, 1000);
  updateTime();

  function updateTimer() {
    let m = Math.floor(timer / 60);
    let s = timer % 60;
    timerDisplay.textContent =
      m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
  }

  updateTimer();

  setTimerBtn.onclick = () => {
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
  };

  document.getElementById("startTimer").onclick = () => {
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
  };

  document.getElementById("stopTimer").onclick = () => {
    clearInterval(interval);
    interval = null;
  };

  document.getElementById("resetTimer").onclick = () => {
    const min = parseInt(timerMinutes.value) || 25;
    const sec = parseInt(timerSeconds.value) || 0;
    timer = min * 60 + sec;
    updateTimer();
    clearInterval(interval);
    interval = null;
  };

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

  document.getElementById("addTask").onclick = () => {
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
  };

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

  document.getElementById("addLink").onclick = () => {
    let name = linkName.value.trim();
    let url = linkURL.value.trim();
    if (!name || !url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    links.push({ id: Date.now(), name, url });
    linkName.value = linkURL.value = "";
    saveLinks();
    renderLinks();
  };

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
