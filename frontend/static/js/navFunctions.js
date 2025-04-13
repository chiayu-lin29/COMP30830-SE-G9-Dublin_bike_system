// 初始化變數
var searchMode = false;
var searchSource = true;

var startingLoc = {
    "address": "Leinster Street South",
    "availableBikes": 27,
    "capacity": 30,
    "elecBikes": 8,
    "id": 113,
    "latitude": 53.3422,
    "longitude": -6.25449,
    "mechBikes": 19,
    "name": "LEINSTER STREET SOUTH",
    "number": 21
};
var destinationLoc = {};
var routes = [];

let bikesChart;
let parkChart;

function setStart() {
    const input = document.getElementById("route-input");
    if (startingLoc && startingLoc.address) {
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("route-input").addEventListener("input", function () {
        searchSuggestions("route-input", "starting-suggestions");
    });

    document.getElementById("route-input-dest").addEventListener("input", function () {
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

    plot_station_predictions(startingLoc.id);
}

function plot_station_predictions(station_id) {
    fetch(`/bike_predict?station_id=${station_id}`)
        .then(response => response.json())
        .then(data => {
            const times = data.times;
            const capacity = startingLoc.capacity;
            let predictions = data.predictions.map(pred =>
                Math.min(Math.max(pred, 0), capacity)
            );
            chartBikes(times, predictions);
            const park = predictions.map(num => startingLoc.capacity - num);
            chartPark(times, park);
        });
}

function chartBikes(times, predictions) {
    const ctx = document.getElementById('bike-chart').getContext('2d');
    if (bikesChart) bikesChart.destroy();
    bikesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: times,
            datasets: [{
                label: 'Available Bikes',
                data: predictions,
                backgroundColor: '#001f3d',
                borderColor: '#001f3d',
                borderWidth: 2,
                hoverBackgroundColor: '#001f3d',
                hoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
}

function chartPark(times, predictions) {
    const ctx = document.getElementById('park-chart').getContext('2d');
    if (parkChart) parkChart.destroy();
    parkChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: times,
            datasets: [{
                label: 'Available Parking',
                data: predictions,
                backgroundColor: '#001f3d',
                borderColor: '#001f3d',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
}

function showDirections() {
    searchMode = true;
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    info.style.display = "none";
    directions.style.display = "flex";
}

function hideDirections() {
    searchMode = false;
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    info.style.display = "flex";
    directions.style.display = "none";
}

function showSearch() {
    navDisplay();
    showDirections();
}

function searchSuggestions(searchLoc, destLoc) {
    const query = document.getElementById(searchLoc).value;
    const suggestionsContainer = document.getElementById(destLoc);

    if (query.length >= 3) {
        fetch(`/search_suggestions?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => displaySuggestions(destLoc, data.stations));
    } else {
        suggestionsContainer.innerHTML = '';
    }
}

function clickStartSuggestion(station) {
    startingLoc = station;
    setStart();
    document.getElementById("starting-suggestions").innerHTML = '';
}

function clickEndSuggestion(station) {
    destinationLoc = station;
    setDest();
    document.getElementById("destination-suggestions").innerHTML = '';
}

function displaySuggestions(destLoc, suggestions) {
    const suggestionsContainer = document.getElementById(destLoc);
    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = 'No results found';
        return;
    }

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("suggestion-element");

        const nameElement = document.createElement("h2");
        nameElement.textContent = suggestion.name || "Unknown";

        const addressElement = document.createElement("h2");
        addressElement.textContent = suggestion.address;

        const suggestionBikes = document.createElement("div");
        suggestionBikes.classList.add("suggestion-bikes");

        const bikes = document.createElement("h2");
        bikes.textContent = suggestion.bikes;

        const bikeIcon = document.createElement("i");
        bikeIcon.classList.add("icon-fa", "fa-solid", "fa-bicycle");

        suggestionBikes.appendChild(bikes);
        suggestionBikes.appendChild(bikeIcon);

        suggestionElement.appendChild(nameElement);
        suggestionElement.appendChild(addressElement);
        suggestionElement.appendChild(suggestionBikes);

        suggestionElement.onclick = () => {
            destLoc === "starting-suggestions"
                ? clickStartSuggestion(suggestion)
                : clickEndSuggestion(suggestion);
        };

        suggestionsContainer.appendChild(suggestionElement);
    });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findClosestStation(currentLat, currentLon) {
    let closestStation = null;
    let minDistance = Infinity;
    stations.forEach(station => {
        const distance = haversineDistance(currentLat, currentLon, station.latitude, station.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestStation = station;
        }
    });
    return closestStation;
}

function renderRoutes() {
    const routeContainer = document.getElementById("routes");
    routeContainer.innerHTML = "";
    if (!routes || !Array.isArray(routes)) return;

    routes.forEach(route => {
        const routeElement = document.createElement("div");
        routeElement.classList.add("route-element");

        const path = document.createElement("h2");
        path.textContent = `${route.start} - ${route.destination}`;
        routeElement.appendChild(path);

        ["first", "second", "third"].forEach((key, index) => {
            if (route[key]) {
                const div = document.createElement("div");
                const h = document.createElement("h4");
                h.textContent = route[key];

                const icon = document.createElement("i");
                if (index % 2 === 0) {
                    icon.classList.add("fas", "fa-walking");
                    div.classList.add("route-element-walk");
                } else {
                    icon.classList.add("fa-solid", "fa-person-biking");
                    div.classList.add("route-element-bike");
                }

                div.appendChild(icon);
                div.appendChild(h);
                routeElement.appendChild(div);
            }
        });

        routeContainer.appendChild(routeElement);
    });
}
