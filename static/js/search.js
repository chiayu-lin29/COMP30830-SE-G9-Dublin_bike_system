// var searchParams = {"searchMode": false, "searchSource": true}
// var startingLoc = {"address": "Leinster Street South", "availableBikes": 27, "capacity": 30, "elecBikes": 8, "id": 113, "latitude": 53.3422, "longitude": -6.25449, "mechBikes": 19, "name": "LEINSTER STREET SOUTH", "number": 21};
// var destinationLoc = {};
// var routes = [];


// function setStart(){
//     const input = document.getElementById("route-input");
//     if (startingLoc && startingLoc.address){
//         input.value = startingLoc.address;
//     }
// }

// function setDest() {
//     const input = document.getElementById("route-input-dest");
//     if (destinationLoc && destinationLoc.address) {
//         input.value = destinationLoc.address;
//     } else {
//         console.warn("No destination selected yet.");
//     }
// }

// function openNavWithStation(station){
//     if (selectingDestination) {
//         destinationLoc = station;
//         setDest();
//         selectingDestination = false;
//     } else {
//         startingLoc = station;
//         setStart();
//         updateNavbar(
//             station.number,
//             station.address,
//             station.mechBikes || 0,
//             station.elecBikes || 0,
//             station.capacity || "N/A"
//         );
//     navDisplay();
//     }
// }


// function clickStartSuggestion(station){
//     startingLoc = station;
//     setStart();
//     const suggestionsContainer = document.getElementById("starting-suggestions");
//     suggestionsContainer.innerHTML = '';
// }

// function clickEndSuggestion(station){
//     destinationLoc = station;
//     setDest();
//     const suggestionsContainer = document.getElementById("destination-suggestions");
//     suggestionsContainer.innerHTML = '';
// }

// function clickStationSuggestion(station){
//     openNavWithStation(station);
//     const suggestionsContainer = document.getElementById("station-suggestions");
//     const searchInput = document.getElementById("station-input");
//     suggestionsContainer.innerHTML = '';
//     searchInput.value = '';
// }


// function displaySuggestions(destLoc, suggestions){
//     console.log(destLoc);
//     const suggestionsContainer = document.getElementById(destLoc);
//     suggestionsContainer.innerHTML = '';

//     if (suggestions.length > 0) {
//         suggestions.forEach(suggestion => {
//             const suggestionElement = document.createElement("div");
//             const suggestionBikes = document.createElement("div");
//             suggestionBikes.classList.add("suggestion-bikes");
//             suggestionElement.classList.add("suggestion-element");

//             // **顯示站點名稱**
//             const nameElement = document.createElement("h2");
//             nameElement.textContent = suggestion.name || "Unknown";
//             suggestionElement.appendChild(nameElement);


//             // Create and append a <h1> element for available bikes
//             // availableBikes --> bikes
//             const bikes = document.createElement("h2");
//             bikes.textContent = suggestion.bikes;
//             suggestionBikes.appendChild(bikes);

//             // Create and append the icon
//             const bikeIcon = document.createElement("i");
//             bikeIcon.classList.add("icon-fa", "fa-solid", "fa-bicycle");
//             suggestionBikes.appendChild(bikeIcon);

//             // Append the address inside a <h1> element
//             const addressElement = document.createElement("h2");
//             addressElement.textContent = suggestion.address;
//             suggestionElement.appendChild(addressElement);

//             // Append suggestionBikes to suggestionElement
//             suggestionElement.appendChild(suggestionBikes);
//             switch (destLoc){
//                 case "starting-suggestions":
//                     suggestionElement.onclick = function () {clickStartSuggestion(suggestion)};
//                     break;
//                 case "destination-suggestions":
//                     console.log("SUGGESTION! ", suggestion);
//                     suggestionElement.onclick = function () {clickEndSuggestion(suggestion)};
//                     console.log("Suggestion ELement:", suggestionElement.onclick)
//                     break;
//                 case "station-suggestions":
//                     console.log("SUGGESTION< ", suggestion);
//                     suggestionElement.onclick = function () {clickStationSuggestion(suggestion)};
//                     console.log("Suggestion ELement:", suggestionElement.onclick)
//                     break;
//                 default:
//                     break;
//             }
//             // if (destLoc)
//             // suggestionElement.onclick = function() {
//             //     (destLoc === "destination-suggestions") ? clickEndSuggestion(suggestion)  : clickStartSuggestion(suggestion);
//             // };
            
//             // Append suggestionElement to the container
//             suggestionsContainer.appendChild(suggestionElement);
//         });
//     } else {
//         suggestionsContainer.innerHTML = 'No results found';
//     }
// }


// function searchSuggestions(searchLoc, destLoc){
//     const query = document.getElementById(searchLoc).value;

//     if (query.length >= 3){
//         fetch(`/search_suggestions?query=${encodeURIComponent(query)}`)
//         .then(response => response.json())
//         .then(data=> {displaySuggestions(destLoc, data.stations)})
//     }else{
//         const suggestionsContainer = document.getElementById(destLoc);
//         suggestionsContainer.innerHTML = '';
//     }
// }

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
  