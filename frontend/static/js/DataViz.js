/**
 * Data Visualization Functions for Bike and Weather Predictions.
 * 
 * Handles fetching prediction data from the server and rendering corresponding charts.
 * Also includes utilities to switch between weather and bike views.
 * 
 * @module DataViz
 * @example
 * // Plot bike predictions for a station
 * plot_station_predictions(113);
 * 
 * // Predict bikes at a specific time
 * predict_bike_at_time(113);
 * 
 * // Show weather-based charts
 * displayWeatherNav();
 * 
 * // Show bike and parking prediction charts
 * displayBikeNav();
 */


/**
 * Fetches and plots bike and parking predictions for a given station.
 * Updates AppState datasets and triggers chart rendering.
 * 
 * @async
 * @function
 * @param {number} station_id - ID of the station to fetch predictions for.
 */
async function plot_station_predictions(station_id) {
  try {
    const response = await fetch(`/bike_predict?station_id=${station_id}`);
    const data = await response.json();

    const times = data.times;
    const capacity = AppState.startingLoc.capacity;
    let predictions = data.predictions;

    // Clamp predictions between 0 and station capacity
    predictions = predictions.map(pred => Math.min(capacity, Math.max(0, pred)));
    AppState.datasets.bikePredictions = predictions;

    // Calculate remaining parking spaces
    const park = predictions.map(num => capacity - num);
    AppState.datasets.parkPredictions = park;

    displayBikeNav(); // Update the chart UI
  } catch (err) {
    console.error("Failed to load chart data:", err);
    alert("There was an error loading the chart.");
  }
}


/**
 * Fetches the closest prediction to a selected time and displays it.
 * Updates the prediction text on the UI.
 * 
 * @async
 * @function
 * @param {number} station_id - ID of the station for prediction.
 */
async function predict_bike_at_time(station_id) {
  try {
    const response = await fetch(`/closest_time_pred?station_id=${station_id}&selected_time=${AppState.selectedTime}`);
    const data = await response.json();
    const prediction = data.predictions;

    const predictionText = document.getElementById("prediction-time");
    const newTime = formatTime(AppState.selectedTime);

    predictionText.innerText = `The number of bikes at station at ${newTime} is ${prediction}`;
  } catch (err) {
    console.error("Error calculating predictions: ", err);
    alert("There was an error finding bike predictions at given time");
  }
}


/**
 * Displays weather-related charts in the UI.
 * Renders a double-line chart for temperature and feels-like,
 * and a single-line chart for wind speed.
 * 
 * @function
 */
function displayWeatherNav() {
  chartDoubleLine('bike-chart', 'temperatures', 'feelsLike', 'Temperature °C', 'Feels Like °C', 'Temperature °C');
  chartSingleLine('park-chart', 'windSpeeds', 'WindSpeed m/s');
}


/**
 * Displays bike and parking prediction charts.
 * Renders bar charts using data from AppState.datasets.
 * 
 * @function
 */
function displayBikeNav() {
  chartBar("bike-chart", "bikePredictions", "Predicted Bikes");
  chartBar("park-chart", "parkPredictions", "Predicted Parking");
}
