const pomodoroTimer = document.querySelector("#pomodoro-timer");
const startButton = document.querySelector("#pomodoro-start");
const pauseButton = document.querySelector("#pomodoro-pause");
const stopButton = document.querySelector("#pomodoro-stop");
// const breakButton = document.querySelector("#pomodoro-break");
let currentTaskLabel = document.querySelector("#pomodoro-clock-task");
const pointerContainer = document.querySelector(".pointer-container");
const taskOrBreakSelect = document.querySelector("#task-or-break-select");
const tooltip = document.querySelector("#tooltip");

let isClockRunning = false;

let timeSpentInCurrentSession = 0;

//20 min work session * 60 seconds
let workSessionDuration;

//time left
let currentTimeLeftInSession;

//break time
let breakSessionDuration = 5 * 60;

//start timer
startButton.addEventListener("click", function () {
  if (currentTaskLabel.value === "") {
    tooltip.classList.remove("hide");
    tooltip.classList.add("show");
    setTimeout(function () {
      tooltip.classList.add("hide");
      tooltip.classList.remove("show");
    }, 3000);
    return;
  }
  taskOrBreak();
  toggleClock();
  startAnimation();
});

//Pause timer
pauseButton.addEventListener("click", function () {
  if (currentTaskLabel.value === "") {
    return;
  }
  isClockRunning = true;
  toggleClock();
  pauseAnimation();
});

//Stop timer
stopButton.addEventListener("click", function () {
  if (currentTaskLabel.value === "") {
    return;
  }
  toggleClock(true);
  stopAnimation();
  currentTaskLabel.value = "";
});

//select change
taskOrBreakSelect.addEventListener("change", function () {
  taskOrBreak();
  displayStartTimeLeftInSession();
});

//selection function
function taskOrBreak() {
  if (document.getElementById("task-or-break-select").value === "task") {
    workSessionDuration = 20 * 60;
    currentTimeLeftInSession = 20 * 60;
    currentTaskLabel.placeholder = "Enter your task title...";
  } else if (
    document.getElementById("task-or-break-select").value === "break"
  ) {
    workSessionDuration = 5 * 60;
    currentTimeLeftInSession = 5 * 60;
    currentTaskLabel.placeholder = "Enter your break title...";
  }
}

//toggle clock
function toggleClock(reset) {
  if (reset) {
    //stop timer
    stopClock();
  } else {
    if (isClockRunning === true) {
      //pause timer
      clearInterval(clockTimer);
      isClockRunning = false;
    } else {
      //start timer

      isClockRunning = true;
      clockTimer = setInterval(() => {
        stepDown();
        displayCurrentTimeLeftInSession();
      }, 1000);
    }
  }
}

// start animation
function startAnimation() {
  if (pointerContainer.classList.contains("animation-pause")) {
    pointerContainer.classList.remove("animation-pause");
    pointerContainer.classList.remove("animation");
  }
  pointerContainer.classList.add("animation");
}
// stop animation
function stopAnimation() {
  if (pointerContainer.classList.contains("animation-pause")) {
    pointerContainer.classList.remove("animation-pause");
    pointerContainer.classList.remove("animation");
  }
  pointerContainer.classList.remove("animation");
}

function pauseAnimation() {
  pointerContainer.classList.add("animation-pause");
}

//display current time
function displayCurrentTimeLeftInSession() {
  const secondsLeft = currentTimeLeftInSession;
  let result = "";
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time;
  }
  if (hours > 0) result += `${hours}:`;
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  pomodoroTimer.innerHTML = `<h2>${result.toString()}</h2>`;
}

function displayStartTimeLeftInSession() {
  const secondsLeft = workSessionDuration;
  let result = "";
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time;
  }
  if (hours > 0) result += `${hours}:`;
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
  pomodoroTimer.innerHTML = `<h2>${result.toString()}</h2>`;
}

//stop clock
function stopClock() {
  // new
  let type = currentTaskLabel.value;
  displaySessionLog(type);
  clearInterval(clockTimer);
  isClockRunning = false;
  currentTimeLeftInSession = workSessionDuration;
  displayCurrentTimeLeftInSession();
  // new
  if (currentTaskLabel.value === "") {
    type = "N/A";
  } else {
    type = currentTaskLabel.value;
  }
}

//steps down and calls display session log
function stepDown() {
  // if (type === "Work") {
  //   currentTimeLeftInSession = 20 * 60;
  // } else if (type === "Break") {
  //   currentTimeLeftInSession = 5 * 60;
  // }
  if (currentTimeLeftInSession > 0) {
    // decrease time left / increase time spent
    currentTimeLeftInSession--;
    timeSpentInCurrentSession++;
  } else if (currentTimeLeftInSession === 0) {
    timeSpentInCurrentSession = 0;
  }
  displayCurrentTimeLeftInSession();
}

//display session log
function displaySessionLog(type) {
  const sessionsList = document.querySelector("#pomodoro-sessions");
  // append li to it
  const li = document.createElement("li");

  let sessionLabel = currentTaskLabel.value;
  let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
  elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1";
  const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
  li.appendChild(text);
  sessionsList.appendChild(li);
}
