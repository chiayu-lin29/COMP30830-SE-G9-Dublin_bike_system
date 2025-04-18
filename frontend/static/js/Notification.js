/**
 * Notification UI Management
 * 
 * Handles displaying and hiding user notifications in the app,
 * including guidance for selecting a start or destination location.
 * 
 * @module Notification
 */

// DOM element references
const notificationDiv = document.getElementById("notification-container");
const notificationText = document.getElementById("notification-text");
const notificationIcon = document.getElementById("notification-icon");


/**
 * Clears the contents of the notification, including text and icon.
 * 
 * @function
 */
function clearNotification() {
  notificationText.innerText = "";
  notificationIcon.className = "";
}


/**
 * Shows the notification container on the screen.
 * 
 * @function
 */
function showNotification() {
  notificationDiv.classList.add("active");
}


/**
 * Hides the notification container from the screen.
 * 
 * @function
 */
function hideNotification() {
  notificationDiv.classList.remove("active");
}


/**
 * Cancels the current input process and hides the notification.
 * Also disables search mode in AppState.
 * 
 * @function
 */
function cancelInput() {
  AppState.searchParams.searchMode = false;
  hideNotification();
}


/**
 * Displays a notification prompting the user to select a **starting station**.
 * Includes an icon, color styling, and cancellation behavior on click.
 * 
 * @function
 */
function startInputNotification() {
  notificationText.innerHTML = "Type or Click the Map to set Starting Station. Click me to Cancel!";
  notificationIcon.className = "fa-solid fa-location-dot";
  notificationIcon.style.color = "#006400"; // Dark green for start
  showNotification();
  notificationDiv.onclick = cancelInput;
}


/**
 * Displays a notification prompting the user to select a **destination station**.
 * Includes an icon, color styling, and cancellation behavior on click.
 * 
 * @function
 */
function destInputNotification() {
  notificationText.innerHTML = "Type or Click the Map to set Destination Station. Click me to Cancel!";
  notificationIcon.className = "fa-solid fa-location-dot";
  notificationIcon.style.color = "#8B0000"; // Dark red for destination
  showNotification();
  notificationDiv.onclick = cancelInput;
}
