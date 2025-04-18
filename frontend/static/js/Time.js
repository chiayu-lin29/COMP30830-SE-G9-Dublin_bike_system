/**
 * Time Selection UI Controller
 * 
 * Handles the display, formatting, and selection of time slots
 * for features such as bike prediction or weather forecasting.
 * 
 * @module Time
 */

const timeButton = document.getElementById("select-time");
const dropdown = document.getElementById("timeDropdown");

/**
 * Formats a Date object into a readable time string.
 * 
 * @param {Date} date - The date to format.
 * @returns {string} - Formatted time string (e.g. "Monday, 13:00").
 */
function formatTime(date) {
  return date.toLocaleString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

/**
 * Updates the button text to reflect the currently selected time.
 */
function updateTime() {
  const newTime = formatTime(AppState.selectedTime);
  timeButton.innerHTML = newTime;
}

/**
 * Displays the time dropdown and populates it with hourly intervals.
 */
function showTime() {
  dropdown.innerHTML = ""; // Clear existing options
  generateHours();
  dropdown.style.display = "block";
}

/**
 * Hides the time dropdown menu.
 */
function hideTime() {
  dropdown.style.display = "none";
}

/**
 * Generates time options for the next 48 hours in 1-hour increments.
 * Appends each time as a clickable element to the dropdown.
 */
function generateHours() {
  const now = new Date();
  AppState.selectedTime = now;

  for (let i = 0; i < 48; i++) {
    const optionTime = new Date(now.getTime() + i * 60 * 60 * 1000); // +1 hour
    const label = optionTime.toLocaleString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric"
    });

    const div = document.createElement("div");
    div.textContent = label;
    div.classList.add("dropdown-option");
    div.onclick = () => handleTimeClick(optionTime);
    dropdown.appendChild(div);
  }
}

/**
 * Handles user selection of a time from the dropdown.
 * 
 * @param {Date} time - The selected time.
 */
function handleTimeClick(time) {
  AppState.selectedTime = time;
  updateTime();
  hideTime();
}
