// js/timer.js

let workoutStartTime = null;
let workoutEndTime = null;
let workoutTimerInterval = null;

let restInterval = null;

/* ----------------------------------------
   Initialize all timers (rest + workout)
----------------------------------------- */
export function initTimers(config) {
  const {
    restInput,
    restDisplay,
    startRestButton,
    startWorkoutButton,
    endWorkoutButton,
    workoutDurationDisplay,
    onWorkoutStart,
    onWorkoutEnd
  } = config;

  /* -------------------------
     Rest Timer
  -------------------------- */
  startRestButton.addEventListener("click", () => {
    const total = Number(restInput.value || 0);
    if (total <= 0) return;

    // stop any running rest
    if (restInterval) clearInterval(restInterval);

    let remaining = total;
    restDisplay.textContent = `${remaining}s`;

    restInterval = setInterval(() => {
      remaining -= 1;

      if (remaining <= 0) {
        clearInterval(restInterval);
        restInterval = null;
        restDisplay.textContent = "Done!";
        try {
          if (navigator.vibrate) navigator.vibrate(300);
        } catch (e) {}
        return;
      }

      restDisplay.textContent = `${remaining}s`;
    }, 1000);
  });

  /* -------------------------
     Workout Duration Timer
  -------------------------- */

  // Start workout
  startWorkoutButton.addEventListener("click", () => {
    if (workoutTimerInterval) return; // already running

    workoutStartTime = new Date();
    workoutEndTime = null;

    startWorkoutButton.disabled = true;
    endWorkoutButton.disabled = false;

    if (typeof onWorkoutStart === "function") onWorkoutStart();

    workoutTimerInterval = setInterval(() => {
      updateWorkoutDurationDisplay(workoutDurationDisplay);
    }, 1000);

    updateWorkoutDurationDisplay(workoutDurationDisplay);
  });

  // End workout
  endWorkoutButton.addEventListener("click", () => {
    if (!workoutTimerInterval) return;

    workoutEndTime = new Date();

    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;

    startWorkoutButton.disabled = false;
    endWorkoutButton.disabled = true;

    if (typeof onWorkoutEnd === "function") onWorkoutEnd();

    updateWorkoutDurationDisplay(workoutDurationDisplay);
  });
}

/* ------------------------------------------------
   Update the workout duration display
------------------------------------------------- */
function updateWorkoutDurationDisplay(el) {
  if (!workoutStartTime) {
    el.textContent = "Duration: 0:00";
    return;
  }

  const end = workoutEndTime ? workoutEndTime : new Date();
  let diffSec = Math.max(0, Math.round((end - workoutStartTime) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  el.textContent = `Duration: ${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ------------------------------------------------
   Public helper for other modules
------------------------------------------------- */
export function getWorkoutTimes() {
  return {
    startTime: workoutStartTime,
    endTime: workoutEndTime
  };
}

export function resetWorkoutTimes() {
  workoutStartTime = null;
  workoutEndTime = null;

  if (workoutTimerInterval) {
    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;
  }
}
