
/* 
*********************
Hiding and Displaying
*********************
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

function navDisplay() {
    const navElement = document.getElementById("nav-container"); 

    navElement.style.width = "500px";
    navElement.style.visibility = "visible";
    navElement.style.opacity = "1";
    navElement.style.paddingLeft = "10px";
    navElement.style.paddingRight = "10px";

    plot_station_predictions(startingLoc.id)
}


function showDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    searchParams["searchMode"] = true;

    info.style.display = "none";  
    directions.style.display = "flex";  
}

function hideDirections(){
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    searchParams["searchSource"] = false;

    info.style.display = "flex";  
    directions.style.display = "none";
    hideDirectionsText();
}

function showSearch(){
    navDisplay();
    showDirections();
}


function hideDirectionsText(){
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "none";
}


function showDirectionsText(){
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "flex";
}


/*
***********************
Setting States and Data
***********************
*/

function setStart() {
    const input = document.getElementById("route-input");
    if (input && startingLoc && startingLoc.address) {
        input.value = startingLoc.address;
    }
}

function setDest() {
    const input = document.getElementById("route-input-dest");
    if (input && destinationLoc && destinationLoc.address) {
        input.value = destinationLoc.address;
    } else {
        console.warn("No destination selected yet.");
    }
}

function clickSourceInput(){
    searchParams["searchMode"] = true;
    searchParams["searchSource"] = true;
}

function clickDestInput(){
    searchParams["searchMode"] = true;
    searchParams["searchSource"] = false;
}


function plot_station_predictions(station_id){
    fetch(`/bike_predict?station_id=${station_id}`)
    .then(response => response.json())
    .then(data => {
        const times = data.times;
        const capacity = startingLoc.capacity
        let predictions = data.predictions;
        predictions = predictions.map(pred => pred > capacity ? capacity : pred).map(pred => pred < 0 ? 0 : pred);
        datasets["bikePredictions"] = predictions;
        
        const park = predictions.map(num => startingLoc.capacity - num);
        datasets["parkPredictions"] = park;
        
        displayBikeNav();
    })
}

function setSearchWithButton(start, dest){
    startingLoc = start;
    destinationLoc = dest;
    setStart();
    setDest();
}

function updateNavbar(number, name, mechanical_bikes, electrical_bikes, stands){
    navDisplay();
    const navbarName = document.getElementById("station-address");
    const navbarNum = document.getElementById("station-number");
    const numMechBikes = document.getElementById("mechanicalBikes");
    const numElecBikes = document.getElementById("electricalBikes");
    const numParking = document.getElementById("stands");

    if (navbarName){
    navbarName.innerHTML = `${name || "Unknown"}`;
    }
    if (navbarNum){
        navbarNum.innerHTML = `${number || "N/A"}`;
    }
    if (numMechBikes){
        numMechBikes.innerHTML = `${mechanical_bikes || 0}`;
    }
    if (numElecBikes){
        numElecBikes.innerHTML = `${electrical_bikes || 0}`;
    }
    if (numParking){
        numParking.innerHTML = `${stands || 0}`;
    }
}


function displayWeatherNav(){
    chartDoubleLine('bike-chart', 'temperatures', 'feelsLike', 'Temperature °C', 'Feels Like °C', 'Temperature °C');
    chartSingleLine('park-chart', 'windSpeeds', 'WindSpeed m/s');
}

function displayBikeNav(){
    chartBar("bike-chart", "bikePredictions", "Predicted Bikes");
    chartBar("park-chart", "parkPredictions", "Predicted Parking");
}


/*
*********
Rendering
*********
*/

function renderRoutes() {
    const routeContainer = document.getElementById("routes");
    routeContainer.innerHTML = "";
    console.log("Routes", routes);

    if (routes) {
        routes.forEach(route => {
            const routeButton = document.createElement("button");
            routeButton.classList.add("route-button");
            routeButton.onclick = () => setSearchWithButton(route.start, route.destination);
            const routeElement = document.createElement("div");
            routeElement.classList.add("route-element");  // Fixed here

            const path = document.createElement("h2");
            path.textContent = `${route.start.address} - ${route.destination.address}`;
            routeElement.appendChild(path);

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
            routeButton.appendChild(routeElement);

            // Append the final route element to the container
            routeContainer.appendChild(routeButton);
        });
        
        
    }
}




