<<<<<<< HEAD
var startingLoc = {};
var destinationLoc = {};

var routes = [];
=======
var searchMode = false;
var searchSource = true;

var startingLoc = {"address": "Leinster Street South",
  "availableBikes": 27,
  "capacity": 30,
  "elecBikes": 8,
  "id": 113,
  "latitude": 53.3422,
  "longitude": -6.25449,
  "mechBikes": 19,
  "name": "LEINSTER STREET SOUTH",
  "number": 21};
var destinationLoc = {};

var routes = [];
let bikesChart;
let parkChart;
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c

function setStart(){
    const input = document.getElementById("route-input");
    if (startingLoc && startingLoc.address){
        input.value = startingLoc.address;
    }
}

function setDest() {
    const input = document.getElementById("route-input-dest");
    if (destinationLoc && destinationLoc.address) {
        console.log("Updating Destination Input:", destinationLoc.address);
        input.value = destinationLoc.address;
    } else {
        console.warn("No destination selected yet.");
    }
}



// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelector(".close-nav").addEventListener("click", navHide);
// });

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("route-input").addEventListener("input", function(){
        searchSuggestions("route-input", "starting-suggestions");
    });

    document.getElementById("route-input-dest").addEventListener("input", function(){
        searchSuggestions("route-input-dest", "destination-suggestions");
    });

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
<<<<<<< HEAD
}

function showDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
=======

    plot_station_predictions(startingLoc.id)
}

function plot_station_predictions(station_id){
    fetch(`/bike_predict?station_id=${station_id}`)
    .then(response => response.json())
    .then(data => {
        const times = data.times;
        const capacity = startingLoc.capacity
        let predictions = data.predictions;
        predictions = predictions.map(pred => pred > capacity ? capacity : pred).map(pred => pred < 0 ? 0 : pred);
        
        chartBikes(times, predictions)
        const park = predictions.map(num => startingLoc.capacity - num);
        chartPark(times, park)
    })
}

function chartBikes(times, predictions){
    const ctx = document.getElementById('bike-chart').getContext('2d');
    // Destroy the previous chart instance if it exists
    if (bikesChart) {
        bikesChart.destroy();
    }

    // Create a new chart
    bikesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: times,
            datasets: [{
                label: 'Available Bikes',
                data: predictions,
                backgroundColor: '#001f3d',  // Softer fill color
                borderColor: '#001f3d',  // Darker border
                borderWidth: 2,
                hoverBackgroundColor: '#001f3d',  // Highlight on hover
                hoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',  // Darker text for better contrast
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Dark tooltip background
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 10
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false  // Remove vertical grid lines
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Predictions',
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)'  // Lighten the grid
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1  // Ensures integer steps
                    }
                }
            }
        }
    });
    
}


function chartPark(times, predictions){
    const ctx = document.getElementById('park-chart').getContext('2d');
    // Destroy the previous chart instance if it exists
    if (parkChart) {
        parkChart.destroy();
    }

    // Create a new chart
    parkChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: times,
            datasets: [{
                label: 'Available Parking',
                data: predictions,
                backgroundColor: '#001f3d',  // Softer fill color
                borderColor: '#001f3d',  // Darker border
                borderWidth: 2,
                hoverBackgroundColor: '#001f3d',  // Highlight on hover
                hoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#333',  // Darker text for better contrast
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Dark tooltip background
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 10
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false  // Remove vertical grid lines
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Predictions',
                        color: '#444',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)'  // Lighten the grid
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1  // Ensures integer steps
                    }
                }
            }
        }
    });
    
}


function showDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    searchMode = true;
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c

    info.style.display = "none";  
    directions.style.display = "flex";  
}

function hideDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
<<<<<<< HEAD
=======
    searchMode = false;
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c

    info.style.display = "flex";  
    directions.style.display = "none";
}

<<<<<<< HEAD
=======
function showSearch(){
    navDisplay();
    showDirections();
}

>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c


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
<<<<<<< HEAD
    setStart();
    const suggestionsContainer = document.getElementById("starting-suggestions");
    suggestionsContainer.innerHTML = '';
    console.log(startingLoc);
    console.log(destinationLoc);
=======
    console.log(startingLoc);
    setStart();
    const suggestionsContainer = document.getElementById("starting-suggestions");
    suggestionsContainer.innerHTML = '';
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
}

function clickEndSuggestion(station){
    destinationLoc = station;
    setDest();
    const suggestionsContainer = document.getElementById("destination-suggestions");
    suggestionsContainer.innerHTML = '';
<<<<<<< HEAD
    console.log(startingLoc);
    console.log(destinationLoc);
=======
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
}

function displaySuggestions(destLoc, suggestions){
    console.log("Suggestions Data:", suggestions);
    const suggestionsContainer = document.getElementById(destLoc);
    suggestionsContainer.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement("div");
            const suggestionBikes = document.createElement("div");
            suggestionBikes.classList.add("suggestion-bikes");
            suggestionElement.classList.add("suggestion-element");

            // **顯示站點名稱**
            const nameElement = document.createElement("h2");
            nameElement.textContent = suggestion.name || "Unknown";
            suggestionElement.appendChild(nameElement);


            // Create and append a <h1> element for available bikes
            // availableBikes --> bikes
            const bikes = document.createElement("h2");
            bikes.textContent = suggestion.bikes;
            suggestionBikes.appendChild(bikes);

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

<<<<<<< HEAD
=======
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function findClosestStation(currentLat, currentLon) {
    let closestStation = null;
    let minDistance = Infinity;
    console.log(stations)
    stations.forEach(station => {
        const distance = haversineDistance(currentLat, currentLon, station.latitude, station.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestStation = station;
        }
    });

    return closestStation;
}

>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
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

<<<<<<< HEAD
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
=======
            // Create the div for first
            const firstElement = document.createElement("div");
            firstElement.classList.add("route-element-walk");  // Fixed here
            const firstElementText = document.createElement("h4");
            firstElementText.textContent = route.first;
            const firstIcon = document.createElement("i");
            firstIcon.classList.add("fas", "fa-walking");
            firstElement.appendChild(firstIcon);
            firstElement.appendChild(firstElementText);
            routeElement.appendChild(firstElement);

            // Create the div for second
            const secondElement = document.createElement("div");
            secondElement.classList.add("route-element-bike");  // Fixed here
            const secondElementText = document.createElement("h4");
            secondElementText.textContent = route.second;
            const secondIcon = document.createElement("i");
            secondIcon.classList.add("fa-solid", "fa-person-biking");
            secondElement.appendChild(secondIcon);
            secondElement.appendChild(secondElementText);
            routeElement.appendChild(secondElement);

            // Create the div for third
            const thirdElement = document.createElement("div");
            thirdElement.classList.add("route-element-walk");  // Fixed here
            const thirdElementText = document.createElement("h4");
            thirdElementText.textContent = route.third;
            const thirdIcon = document.createElement("i");
            thirdIcon.classList.add("fas", "fa-walking");
            thirdElement.appendChild(thirdIcon);
            thirdElement.appendChild(thirdElementText);
            routeElement.appendChild(thirdElement);
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c

            // Append the final route element to the container
            routeContainer.appendChild(routeElement);
        });
    }
}


// function stationToStation(){
//     if (!startingLoc.latitude || !startingLoc.longitude || !destinationLoc.latitude || !destinationLoc.longitude) {
//         console.error("Error: Missing coordinates for route", {
//             startingLoc, destinationLoc
//         });
//         return;
//     }

//     updateRoute(
//         startingLoc.latitude, startingLoc.longitude, 
//         destinationLoc.latitude, destinationLoc.longitude
//     );
    
//     setTimeout(() => renderRoutes(), 400);
// }

