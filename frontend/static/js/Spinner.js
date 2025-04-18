/**
 * UI Loading Indicator Control
 * 
 * These utility functions manage the visibility of loading spinners
 * or loading overlays during data fetching or processing.
 * 
 * @module Spinner
 */

/**
 * Displays the loading element with the given ID.
 * Typically used to show a spinner or overlay while async operations run.
 * 
 * @param {string} id - The ID of the loading element to show.
 */
function showLoading(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
}


/**
 * Hides the loading element with the given ID.
 * Used after data is loaded or a task completes.
 * 
 * @param {string} id - The ID of the loading element to hide.
 */
function hideLoading(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
