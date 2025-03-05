var startingLoc = {};
var destinationLoc = {};

var routes = [];

function setStart(){
    const input = document.getElementById("route-input");
    if (startingLoc && startingLoc.address){
        input.value = startingLoc.address;
    }
}

function setDest(){
    const input = document.getElementById("route-input-dest");
    if (destinationLoc && destinationLoc.address){  
        input.value = destinationLoc.address;
    }
}



document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".close-nav").addEventListener("click", navHide);
});
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

function navDisplay() {
    const navElement = document.getElementById("nav-container"); 

    navElement.style.width = "500px";
    navElement.style.visibility = "visible";
    navElement.style.opacity = "1";
    navElement.style.paddingLeft = "10px";
    navElement.style.paddingRight = "10px";
}

function showDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");

    info.style.display = "none";  
    directions.style.display = "flex";  
}

function hideDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");

    info.style.display = "flex";  
    directions.style.display = "none";
}



function searchSuggestions(searchLoc, destLoc){
    const query = document.getElementById(searchLoc).value;

    if (query.length >= 3){
        fetch(`/search_suggestions?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data=> {displaySuggestions(destLoc, data.stations)})
    }else{
        const suggestionsContainer = document.getElementById(destLoc);
        suggestionsContainer.innerHTML = '';
    }
}

function clickStartSuggestion(station){
    startingLoc = station;
    setStart();
    const suggestionsContainer = document.getElementById("starting-suggestions");
    suggestionsContainer.innerHTML = '';
    console.log(startingLoc);
    console.log(destinationLoc);
}

function clickEndSuggestion(station){
    destinationLoc = station;
    setDest();
    const suggestionsContainer = document.getElementById("destination-suggestions");
    suggestionsContainer.innerHTML = '';
    console.log(startingLoc);
    console.log(destinationLoc);
}

function displaySuggestions(destLoc, suggestions){
    console.log(suggestions);
    console.log(destLoc);
    const suggestionsContainer = document.getElementById(destLoc);
    suggestionsContainer.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement("div");
            const suggestionBikes = document.createElement("div");
            suggestionBikes.classList.add("suggestion-bikes");
            suggestionElement.classList.add("suggestion-element");

            // Create and append a <h1> element for available bikes
            const availableBikes = document.createElement("h2");
            availableBikes.textContent = suggestion.availableBikes;
            suggestionBikes.appendChild(availableBikes);

            // Create and append the icon
            const bikeIcon = document.createElement("i");
            bikeIcon.classList.add("icon-fa", "fa-solid", "fa-bicycle");
            suggestionBikes.appendChild(bikeIcon);

            // Append the address inside a <h1> element
            const addressElement = document.createElement("h2");
            addressElement.textContent = suggestion.address;
            suggestionElement.appendChild(addressElement);

            // Append suggestionBikes to suggestionElement
            suggestionElement.appendChild(suggestionBikes);
            suggestionElement.onclick = function() {
                (destLoc === "starting-suggestions") ? clickStartSuggestion(suggestion) : clickEndSuggestion(suggestion);
            };
            
            // Append suggestionElement to the container
            suggestionsContainer.appendChild(suggestionElement);
        });
    } else {
        suggestionsContainer.innerHTML = 'No results found';
    }
}

function renderRoutes() {
    const routeContainer = document.getElementById("routes");
    routeContainer.innerHTML = "";
    if (routes && Array.isArray(routes)) { // Check if routes is an array
        routes.forEach(route => {
            const routeElement = document.createElement("div");
            routeElement.classList.add("route-element");  // Fixed here

            const path = document.createElement("h2");
            path.textContent = `${route.start} - ${route.destination}`;
            routeElement.appendChild(path);

            // Create the div for time
            const timeElement = document.createElement("div");
            timeElement.classList.add("route-element-time");  // Fixed here
            const timeElementText = document.createElement("h4");
            timeElementText.textContent = route.travelTime;
            const timeIcon = document.createElement("i");
            timeIcon.classList.add("fa-solid", "fa-clock");
            timeElement.appendChild(timeIcon);
            timeElement.appendChild(timeElementText);
            routeElement.appendChild(timeElement);

            // Create the div for distance
            const distanceElement = document.createElement("div");
            distanceElement.classList.add("route-element-distance");  // Fixed here
            const distanceElementText = document.createElement("h4");
            distanceElementText.textContent = route.distance;
            const distanceIcon = document.createElement("i");
            distanceIcon.classList.add("fa-solid", "fa-ruler-vertical");
            distanceElement.appendChild(distanceIcon);
            distanceElement.appendChild(distanceElementText);
            routeElement.appendChild(distanceElement);

            // Append the final route element to the container
            routeContainer.appendChild(routeElement);
        });
    }
}


function stationToStation(){
    updateRoute(startingLoc.latitude, startingLoc.longitude, destinationLoc.latitude, destinationLoc.longitude)
    setTimeout(() => renderRoutes(), 400);
}

