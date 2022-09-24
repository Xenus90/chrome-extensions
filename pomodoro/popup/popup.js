let tasks = [];
const addTaskBtnEl = document.getElementById("add-task-btn");
const startTimerBtnEl = document.getElementById("start-timer-btn");
const resetTimerBtnEl = document.getElementById("reset-timer-btn");
const time = document.getElementById("time");

addTaskBtnEl.addEventListener("click", addTask);

startTimerBtnEl.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], res => {
    chrome.storage.local.set({ isRunning: !res.isRunning }, () => {
      startTimerBtnEl.textContent = !res.isRunning ? "Pause timer" : "Start timer";
    });
  });
});

resetTimerBtnEl.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
  }, () => {
    startTimerBtnEl.textContent = "Start timer";
  });
});

chrome.storage.sync.get(["tasks"], res => {
  tasks = res.tasks ?? [];
  renderTasks();
});

updateTime();
setInterval(updateTime, 1000);

function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"], res => {
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
    let seconds = "00";
    if (res.timer % 60 !== 0) {
      seconds = `${60 - res.timer % 60}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
  });
}

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

function renderTask(taskNum) {
  const taskContainer = document.getElementById("task-container");
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  const deleteBtn = document.createElement("input");

  text.type = "text";
  text.placeholder = "Add task";
  text.value = tasks[taskNum];
  text.className = "task-input";
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.className = "task-delete";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  taskContainer.appendChild(taskRow);
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((_task, index) => {
    renderTask(index);
  });
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
}