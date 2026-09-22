/* global document, fetch, FormData, window */

const authSection = document.querySelector("#authSection");
const taskSection = document.querySelector("#taskSection");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const logoutButton = document.querySelector("#logoutButton");
const authMessage = document.querySelector("#authMessage");
const taskMessage = document.querySelector("#taskMessage");
const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const filterButtons = document.querySelectorAll(".filter");

let currentStatus = "all";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function showMessage(element, message, success = false) {
  element.textContent = message;
  element.classList.toggle("success", success);
}

function clearMessages() {
  showMessage(authMessage, "");
  showMessage(taskMessage, "");
}

function showLogin() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  clearMessages();
}

function showRegister() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  clearMessages();
}

function showAuthentication() {
  authSection.classList.remove("hidden");
  taskSection.classList.add("hidden");
  logoutButton.classList.add("hidden");
  showLogin();
}

function showDashboard() {
  authSection.classList.add("hidden");
  taskSection.classList.remove("hidden");
  logoutButton.classList.remove("hidden");
}

function createTaskElement(task) {
  const article = document.createElement("article");
  article.className = `task-item${task.completed ? " completed" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Complete ${task.title}`);
  checkbox.addEventListener("change", async () => {
    try {
      await apiRequest(`/api/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          completed: checkbox.checked,
        }),
      });

      await loadTasks();
    } catch (error) {
      checkbox.checked = !checkbox.checked;
      showMessage(taskMessage, error.message);
    }
  });

  const content = document.createElement("div");

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;
  content.appendChild(title);

  if (task.description) {
    const description = document.createElement("p");
    description.className = "task-description";
    description.textContent = task.description;
    content.appendChild(description);
  }

  if (task.dueDate) {
    const dueDate = document.createElement("p");
    dueDate.className = "task-date";
    dueDate.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
    content.appendChild(dueDate);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", async () => {
    const updatedTitle = window.prompt("Edit task title:", task.title);

    if (updatedTitle === null) {
      return;
    }

    const updatedDescription = window.prompt(
      "Edit description:",
      task.description || "",
    );

    if (updatedDescription === null) {
      return;
    }

    try {
      await apiRequest(`/api/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: updatedTitle,
          description: updatedDescription,
        }),
      });

      showMessage(taskMessage, "Task updated successfully", true);
      await loadTasks();
    } catch (error) {
      showMessage(taskMessage, error.message);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "danger";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      `Delete the task "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/api/tasks/${task._id}`, {
        method: "DELETE",
      });

      showMessage(taskMessage, "Task deleted successfully", true);
      await loadTasks();
    } catch (error) {
      showMessage(taskMessage, error.message);
    }
  });

  actions.append(editButton, deleteButton);
  article.append(checkbox, content, actions);

  return article;
}

function renderTasks(tasks) {
  taskList.replaceChildren();

  const label = tasks.length === 1 ? "task" : "tasks";
  taskCount.textContent = `${tasks.length} ${label}`;

  if (tasks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks found. Add your first task above.";
    taskList.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
}

async function loadTasks() {
  try {
    const query =
      currentStatus === "all" ? "" : `?status=${currentStatus}`;

    const data = await apiRequest(`/api/tasks${query}`);
    renderTasks(data.tasks);
  } catch (error) {
    if (error.message === "Authentication required") {
      showAuthentication();
      return;
    }

    showMessage(taskMessage, error.message);
  }
}

loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessages();

  const formData = new FormData(loginForm);

  try {
    await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    loginForm.reset();
    showDashboard();
    await loadTasks();
  } catch (error) {
    showMessage(authMessage, error.message);
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessages();

  const formData = new FormData(registerForm);

  try {
    await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    registerForm.reset();
    showDashboard();
    await loadTasks();
  } catch (error) {
    showMessage(authMessage, error.message);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await apiRequest("/api/auth/logout", {
      method: "POST",
    });

    showAuthentication();
    taskList.replaceChildren();
  } catch (error) {
    showMessage(taskMessage, error.message);
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessages();

  const formData = new FormData(taskForm);

  try {
    await apiRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate") || null,
      }),
    });

    taskForm.reset();
    showMessage(taskMessage, "Task created successfully", true);
    await loadTasks();
  } catch (error) {
    showMessage(taskMessage, error.message);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    currentStatus = button.dataset.status;
    await loadTasks();
  });
});

async function restoreSession() {
  try {
    const data = await apiRequest("/api/tasks");
    showDashboard();
    renderTasks(data.tasks);
  } catch {
    showAuthentication();
  }
}

restoreSession();
