<<<<<<< HEAD
=======
let renderer1;
let renderer2;
let renderer3;
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
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

<<<<<<< HEAD

function updateRoute(startLat, startLng, endLat, endLng) {
    if (!startLat || !startLng || !endLat || !endLng) {
=======
function removeRoute(renderer1, renderer2, renderer3){
    if (renderer1){
        renderer1.setMap(null)
    }

    if (renderer2){
        renderer2.setMap(null)
    }

    if (renderer3){
        renderer3.setMap(null)
    }
}

function updateRoute(startLat, startLng, station1Lat, station1Lng, station2Lat, station2Lng, destLat, destLng) {
    if (!startLat || !startLng || !destLat || !destLng) {
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
        console.error("Error: Missing coordinates for route");
        return;
    }

<<<<<<< HEAD
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
    }

    const request = {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: "BICYCLING"
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            const travelTime = route.duration.text;
            const distance = route.distance.text;

            const newRoute = {
                "distance": distance, 
                "travelTime": travelTime, 
                "start": startingLoc?.address || "Unknown", 
                "destination": destinationLoc?.address || "Unknown"
            };

            routes.push(newRoute);
            console.log(routes);
            renderRoutes();
=======
    removeRoute(renderer1, renderer2, renderer3);

    renderer1 = new google.maps.DirectionsRenderer({polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 }, // Blue
        suppressMarkers: true
    });
    renderer2 = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "#001f3d", strokeWeight: 5 }, // Green
        suppressMarkers: true
    });
    renderer3 = new google.maps.DirectionsRenderer({polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 }, // Blue
        suppressMarkers: true
    });

    renderer1.setMap(map);
    renderer2.setMap(map);
    renderer3.setMap(map);

    const request1 = {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: station1Lat, lng: station1Lng },
        travelMode: "WALKING"
    };

    const request2 = {
        origin: { lat: station1Lat, lng: station1Lng },
        destination: { lat: station2Lat, lng: station2Lng },
        travelMode: "BICYCLING"
    };

    const request3 = {
        origin: { lat: station2Lat, lng: station2Lng },
        destination: { lat: destLat, lng: destLng },
        travelMode: "WALKING"
    };

    let newRoute = {"start": startingLoc?.address || "Unknown", 
                    "destination": destinationLoc?.address || "Unknown"};

    directionsService.route(request1, (result, status) => {
        if (status === "OK") {
            renderer1.setDirections(result);
            const route = result.routes[0].legs[0];
            // time += parseInt(route.duration.text);
            distance = route.distance.text;

            newRoute["first"] = distance
            // const newRoute = {
            //     "distance": distance, 
            //     "travelTime": travelTime, 
            //     "start": startingLoc?.address || "Unknown", 
            //     "destination": destinationLoc?.address || "Unknown"
            // };

>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
        } else {
            console.error("Error fetching directions:", status);
        }
    });

<<<<<<< HEAD
    selectingNewStart = true;
}

=======
    directionsService.route(request2, (result, status) => {
        if (status === "OK") {
            renderer2.setDirections(result);
            const route = result.routes[0].legs[0];
            // time += parseInt(route.duration.text);
            distance = route.distance.text;

            newRoute["second"] = distance
            // const newRoute = {
            //     "first": 5, 
            //     "second": 10, 
            //     "third": 12,
            //     "start": startingLoc?.address || "Unknown", 
            //     "destination": destinationLoc?.address || "Unknown"
            // };


        } else {
            console.error("Error fetching directions:", status);
        }
    });

    directionsService.route(request3, (result, status) => {
        if (status === "OK") {
            renderer3.setDirections(result);
            const route = result.routes[0].legs[0];
            // time += parseInt(route.duration.text);
            distance = route.distance.text;
            
            newRoute["third"] = distance
            // const newRoute = {
            //     "distance": distance, 
            //     "travelTime": travelTime, 
            //     "start": startingLoc?.address || "Unknown", 
            //     "destination": destinationLoc?.address || "Unknown"
            // };


        } else {
            console.error("Error fetching directions:", status);
        }
    });
    console.log(newRoute);
    routes.push(newRoute);
    renderRoutes();
}



>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
function stationToStation() {
    if (!startingLoc.latitude || !startingLoc.longitude || !destinationLoc.latitude || !destinationLoc.longitude) {
        console.error("Error: Missing coordinates for route", {
            startingLoc, destinationLoc
        });
        return;
    }

<<<<<<< HEAD
    updateRoute(
        startingLoc.latitude, startingLoc.longitude,
=======
    const sourceStation = findClosestStation(startingLoc.latitude, startingLoc.longitude);
    const destStation = findClosestStation(destinationLoc.latitude, destinationLoc.longitude);
    console.log(sourceStation);
    console.log(destStation);

    updateRoute(
        startingLoc.latitude, startingLoc.longitude,
        sourceStation.latitude, sourceStation.longitude,
        destStation.latitude, destStation.longitude,
>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
        destinationLoc.latitude, destinationLoc.longitude
    );

    setTimeout(() => renderRoutes(), 400);
}
<<<<<<< HEAD
=======


>>>>>>> e793e1348c6d4d95c49eeb0728d85495a5e3963c
