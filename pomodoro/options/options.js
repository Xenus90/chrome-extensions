const timeOptionInputEl = document.getElementById("time-option");
const saveBtnEl = document.getElementById("save-btn");

timeOptionInputEl.addEventListener("change", event => {
  const value = event.target.value;
  if (value < 1 || value > 60) {
    timeOptionInputEl.value = 25;
  }
});

saveBtnEl.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
    timeOption: timeOptionInputEl.value,
  });
});

chrome.storage.local.get(["timeOption"], res => {
  timeOptionInputEl.value = res.timeOption;
});
