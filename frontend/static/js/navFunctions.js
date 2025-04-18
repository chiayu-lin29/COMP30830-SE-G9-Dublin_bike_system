
/**
 * Navigation and Panel Controls
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
  
  function showDirections() {
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    AppState.searchParams.searchMode = true;
  
    info.style.display = "none";  
    directions.style.display = "flex";  
  }
  
  function hideDirections() {
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    AppState.searchParams.searchSource = false;
  
    info.style.display = "flex";  
    directions.style.display = "none";
    hideDirectionsText();
  }
  
  function showSearch() {
    navDisplay();
    showDirections();
  }
  
  function hideDirectionsText() {
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "none";
  }
  
  function showDirectionsText() {
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "flex";
  }
  
  function closeDirections() {
    hideDirectionsText();
    removeRoute();
  }



/**
 * Search and Selection Functions
 */
function setStart() {
    const input = document.getElementById("route-input");
    if (input && AppState.startingLoc && AppState.startingLoc.address) {
      input.value = AppState.startingLoc.address;
    }
  }
  
  function setDest() {
    const input = document.getElementById("route-input-dest");
    if (input && AppState.destinationLoc && AppState.destinationLoc.address) {
      input.value = AppState.destinationLoc.address;
    } else {
      console.warn("No destination selected yet.");
    }
  }
  
  function clickSourceInput() {
    AppState.searchParams.searchMode = true;
    AppState.searchParams.searchSource = true;
    startInputNotification();
  }
  
  function clickDestInput() {
    AppState.searchParams.searchMode = true;
    AppState.searchParams.searchSource = false;
    destInputNotification();
  }


  function openNavWithStation(station) {
    if (AppState.selectingDestination) {
      AppState.destinationLoc = station;
      setDest();
      AppState.selectingDestination = false;
    } else {
      AppState.startingLoc = station;
      setStart();
      updateNavbar(
        station.number,
        station.address,
        station.mechBikes || 0,
        station.elecBikes || 0,
        station.capacity || "N/A"
      );
      navDisplay();
    }
  }


  function clickStartSuggestion(station) {
    AppState.startingLoc = station;
    setStart();
    const suggestionsContainer = document.getElementById("starting-suggestions");
    suggestionsContainer.innerHTML = '';
  }
  
  function clickEndSuggestion(station) {
    AppState.destinationLoc = station;
    setDest();
    const suggestionsContainer = document.getElementById("destination-suggestions");
    suggestionsContainer.innerHTML = '';
  }
  
  function clickStationSuggestion(station) {
    openNavWithStation(station);
    const suggestionsContainer = document.getElementById("station-suggestions");
    const searchInput = document.getElementById("station-input");
    suggestionsContainer.innerHTML = '';
    searchInput.value = '';
  }
  
  function setSearchWithButton(start, dest) {
    AppState.startingLoc = start;
    AppState.destinationLoc = dest;
    setStart();
    setDest();
  }

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




function renderRoutes() {
    const routeContainer = document.getElementById("routes");
    routeContainer.innerHTML = "";
  
    if (AppState.routes && AppState.routes.length) {
      AppState.routes.forEach(route => {
        const routeButton = document.createElement("button");
        routeButton.classList.add("route-button");
        routeButton.onclick = () => setSearchWithButton(route.start, route.destination);
        
        const routeElement = document.createElement("div");
        routeElement.classList.add("route-element");
  
        // Create route title
        const path = document.createElement("h2");
        path.textContent = `${route.start.address} - ${route.destination.address}`;
        routeElement.appendChild(path);
  
        // First walking segment
        const firstElement = createRouteSegment(route.first, "fa-walking", "route-element-walk");
        routeElement.appendChild(firstElement);
  
        // Cycling segment
        const secondElement = createRouteSegment(route.second, "fa-person-biking", "route-element-bike");
        routeElement.appendChild(secondElement);
  
        // Second walking segment
        const thirdElement = createRouteSegment(route.third, "fa-walking", "route-element-walk");
        routeElement.appendChild(thirdElement);
        
        routeButton.appendChild(routeElement);
        routeContainer.appendChild(routeButton);
      });
    }
  }
  
  function createRouteSegment(distance, iconClass, className) {
    const element = document.createElement("div");
    element.classList.add(className);
    
    const elementText = document.createElement("h4");
    elementText.textContent = distance;
    
    const icon = document.createElement("i");
    if (iconClass === "fa-person-biking") {
      icon.classList.add("fa-solid", iconClass);
    } else {
      icon.classList.add("fas", iconClass);
    }
    
    element.appendChild(icon);
    element.appendChild(elementText);
    
    return element;
  }
  