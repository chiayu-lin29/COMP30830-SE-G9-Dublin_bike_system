
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

function searchSuggestions(searchLoc, destLoc) {
    const query = document.getElementById(searchLoc).value;
  
    if (query.length >= 3) {
      fetch(`/search_suggestions?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => { displaySuggestions(destLoc, data.stations) })
        .catch(err => console.error("Error fetching suggestions:", err));
    } else {
      const suggestionsContainer = document.getElementById(destLoc);
      suggestionsContainer.innerHTML = '';
    }
  }
  
  function displaySuggestions(destLoc, suggestions) {
    const suggestionsContainer = document.getElementById(destLoc);
    suggestionsContainer.innerHTML = '';
  
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement("div");
        const suggestionBikes = document.createElement("div");
        suggestionBikes.classList.add("suggestion-bikes");
        suggestionElement.classList.add("suggestion-element");
  
        // Display station name
        const nameElement = document.createElement("h2");
        nameElement.textContent = suggestion.name || "Unknown";
        suggestionElement.appendChild(nameElement);
  
        // Create element for available bikes
        const bikes = document.createElement("h2");
        bikes.textContent = suggestion.bikes;
        suggestionBikes.appendChild(bikes);
  
        // Add bike icon
        const bikeIcon = document.createElement("i");
        bikeIcon.classList.add("icon-fa", "fa-solid", "fa-bicycle");
        suggestionBikes.appendChild(bikeIcon);
  
        // Add address
        const addressElement = document.createElement("h2");
        addressElement.textContent = suggestion.address;
        suggestionElement.appendChild(addressElement);
  
        // Add bikes container
        suggestionElement.appendChild(suggestionBikes);
        
        // Set click handlers based on suggestion type
        switch (destLoc) {
          case "starting-suggestions":
            suggestionElement.onclick = function () { clickStartSuggestion(suggestion) };
            break;
          case "destination-suggestions":
            suggestionElement.onclick = function () { clickEndSuggestion(suggestion) };
            break;
          case "station-suggestions":
            suggestionElement.onclick = function () { clickStationSuggestion(suggestion) };
            break;
        }
        
        // Add to container
        suggestionsContainer.appendChild(suggestionElement);
      });
    } else {
      suggestionsContainer.innerHTML = 'No results found';
    }
  }
  
