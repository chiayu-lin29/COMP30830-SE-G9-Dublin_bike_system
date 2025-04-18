
/**
 * Data Visualization Functions
 */
async function plot_station_predictions(station_id) {
    try {
      const response = await fetch(`/bike_predict?station_id=${station_id}`);
      const data = await response.json();
  
      const times = data.times;
      const capacity = AppState.startingLoc.capacity;
      let predictions = data.predictions;
  
      predictions = predictions.map(pred => Math.min(capacity, Math.max(0, pred)));
      AppState.datasets.bikePredictions = predictions;
  
      const park = predictions.map(num => capacity - num);
      AppState.datasets.parkPredictions = park;
  
      displayBikeNav(); // Update charts
    } catch (err) {
      console.error("Failed to load chart data:", err);
      alert("There was an error loading the chart.");
    }
  }
  
  async function predict_bike_at_time(station_id) {
    try {
      const response = await fetch(`/closest_time_pred?station_id=${station_id}&selected_time=${AppState.selectedTime}`);
      const data = await response.json();
      const prediction = data.predictions;
      const predictionText = document.getElementById("prediction-time");
      const newTime = formatTime(AppState.selectedTime);
      predictionText.innerText = `The number of bikes at station at ${newTime} is ${prediction}`;
    } catch(err) {
      console.error("Error calculating predictions: ", err);
      alert("There was an error finding bike predictions at given time");
    }
  }
  
  function displayWeatherNav() {
    chartDoubleLine('bike-chart', 'temperatures', 'feelsLike', 'Temperature °C', 'Feels Like °C', 'Temperature °C');
    chartSingleLine('park-chart', 'windSpeeds', 'WindSpeed m/s');
  }
  
  function displayBikeNav() {
    chartBar("bike-chart", "bikePredictions", "Predicted Bikes");
    chartBar("park-chart", "parkPredictions", "Predicted Parking");
  }



