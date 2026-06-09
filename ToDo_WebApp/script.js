let tasks = JSON.parse(localStorage.tasks || "[]");

const t = (id) => document.getElementById(id);

const save = () => {
  localStorage.tasks = JSON.stringify(tasks);
};

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const updateStats = () => {
  const done = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  const pending = total - done;

  t("totalTasksStat").textContent = total;
  t("completedTasksStat").textContent = done;
  t("pendingTasksStat").textContent = pending;

  t("completionPercent").textContent = total
    ? Math.round((done / total) * 100) + "%"
    : "0%";

  t("completedBadge").textContent = done;
  t("pendingBadge").textContent = pending;

  t("totalCountCard").textContent = total;
  t("pendingCountCard").textContent = pending;
};

const renderTask = (task) => `
  <li class="task-item ${task.completed ? "completed" : ""}">
    <label class="task-row">
      <input
        type="checkbox"
        onchange="toggleComplete(${task.id})"
        ${task.completed ? "checked" : ""}
      />
      <span class="task-title">${escapeHtml(task.text)}</span>
    </label>

    <button class="btn-action btn-delete" onclick="deleteTask(${task.id})">
      Delete
    </button>
  </li>
`;

const render = () => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  t("pendingList").innerHTML = pendingTasks.length
    ? pendingTasks.map(renderTask).join("")
    : '<div class="empty-message">No pending tasks</div>';

  t("completedList").innerHTML = completedTasks.length
    ? completedTasks.map(renderTask).join("")
    : '<div class="empty-message">No completed tasks</div>';
};

const addTask = () => {
  const input = t("taskInput");
  const text = input.value.trim();

  if (!text) {
    alert("Please enter a task");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
  });

  input.value = "";
  save();
  render();
  updateStats();
};

const toggleComplete = (id) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;

  save();
  render();
  updateStats();
};

const deleteTask = (id) => {
  if (!confirm("Delete this task?")) return;

  tasks = tasks.filter((t) => t.id !== id);

  save();
  render();
  updateStats();
};

const searchTasks = (term) => {
  const query = term.toLowerCase();

  document.querySelectorAll(".task-item").forEach((li) => {
    const text = li.querySelector(".task-title").textContent.toLowerCase();

    li.style.display = text.includes(query) ? "flex" : "none";
  });
};

const filterTasks = (btn, type) => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  btn.classList.add("active");

  t("pendingSection").style.display = type === "completed" ? "none" : "block";
  t("completedSection").style.display = type === "pending" ? "none" : "block";
};


window.addEventListener("DOMContentLoaded", () => {
  render();
  updateStats();

  t("taskInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  t("searchInput").addEventListener("input", (e) => {
    searchTasks(e.target.value);
  });

  t("dateDisplay").textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
