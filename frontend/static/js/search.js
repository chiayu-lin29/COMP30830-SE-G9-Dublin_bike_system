
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
  