/**
 * A module for controlling navigation panels and UI states.
 * Provides functionality to show, hide, and update various UI panels and components.
 * @module NavUI
 * @example
 * // Show the navigation panel
 * await navDisplay();
 * 
 * // Update navbar with station information
 * updateNavbar(stationNumber, stationName, mechBikes, elecBikes, availableStands);
 */

/**
 * Hides the navigation panel with animation.
 * @function
 * @returns {void}
 */
function navHide() {
  const navElement = document.getElementById("nav-container"); 

  navElement.style.width = "0px";

  setTimeout(() => {
    navElement.style.opacity = "0";
    navElement.style.paddingLeft = "0px";
    navElement.style.paddingRight = "0px";
  }, 450);

  setTimeout(() => {
    navElement.style.visibility = "hidden";
  }, 500);
}

/**
* Displays the navigation panel with animation and loads station data.
* @function
* @async
* @returns {Promise<void>}
*/
async function navDisplay() {
showLoading("nav-loading");
try {
  const navElement = document.getElementById("nav-container"); 

  navElement.style.width = "500px";
  navElement.style.visibility = "visible";
  navElement.style.opacity = "1";
  navElement.style.paddingLeft = "10px";
  navElement.style.paddingRight = "10px";

  updateTime();
  if (AppState.startingLoc && AppState.startingLoc.id) {
    await plot_station_predictions(AppState.startingLoc.id);
  }
} catch (err) {
  console.error("Failed to load chart data:", err);
  alert("There was an error loading the chart.");
} finally {
  hideLoading("nav-loading");
}
}

/**
* Shows the directions container and hides the info container.
* @function
* @returns {void}
*/
function showDirections() {
let info = document.getElementById("info-container");
let directions = document.getElementById("directions-container");
AppState.searchParams.searchMode = true;

info.style.display = "none";  
directions.style.display = "flex";  
}

/**
* Hides the directions container and shows the info container.
* @function
* @returns {void}
*/
function hideDirections() {
let info = document.getElementById("info-container");
let directions = document.getElementById("directions-container");
AppState.searchParams.searchSource = false;

info.style.display = "flex";  
directions.style.display = "none";
hideDirectionsText();
}

/**
* Shows the navigation panel and directions container together.
* @function
* @returns {void}
*/
function showSearch() {
navDisplay();
showDirections();
}

/**
* Hides the directions text section.
* @function
* @returns {void}
*/
function hideDirectionsText() {
const directionsText = document.getElementById("directionsText");
directionsText.style.display = "none";
}

/**
* Shows the directions text section.
* @function
* @returns {void}
*/
function showDirectionsText() {
const directionsText = document.getElementById("directionsText");
directionsText.style.display = "flex";
}

/**
* Closes the directions panel and removes any active routes.
* @function
* @returns {void}
*/
function closeDirections() {
hideDirectionsText();
removeRoute();
}

/**
* Updates the navigation bar with station information.
* @function
* @param {string|number} number - The station ID number.
* @param {string} name - The station name or address.
* @param {number} mechanical_bikes - Number of available mechanical bikes.
* @param {number} electrical_bikes - Number of available electrical bikes.
* @param {number} stands - Number of available parking stands.
* @returns {void}
*/
function updateNavbar(number, name, mechanical_bikes, electrical_bikes, stands) {
navDisplay();
const navbarName = document.getElementById("station-address");
const navbarNum = document.getElementById("station-number");
const numMechBikes = document.getElementById("mechanicalBikes");
const numElecBikes = document.getElementById("electricalBikes");
const numParking = document.getElementById("stands");

if (navbarName) {
  navbarName.innerHTML = `${name || "Unknown"}`;
}
if (navbarNum) {
  navbarNum.innerHTML = `${number || "N/A"}`;
}
if (numMechBikes) {
  numMechBikes.innerHTML = `${mechanical_bikes || 0}`;
}
if (numElecBikes) {
  numElecBikes.innerHTML = `${electrical_bikes || 0}`;
}
if (numParking) {
  numParking.innerHTML = `${stands || 0}`;
}
}