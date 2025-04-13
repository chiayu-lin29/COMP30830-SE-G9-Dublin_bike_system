let renderer1;
let renderer2;
let renderer3;

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

function removeRoute(renderer1, renderer2, renderer3) {
    if (renderer1) renderer1.setMap(null);
    if (renderer2) renderer2.setMap(null);
    if (renderer3) renderer3.setMap(null);
}

function updateRoute(startLat, startLng, station1Lat, station1Lng, station2Lat, station2Lng, destLat, destLng) {
    if (!startLat || !startLng || !destLat || !destLng) {
        console.error("Error: Missing coordinates for route");
        return;
    }

    removeRoute(renderer1, renderer2, renderer3);

    renderer1 = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 }, // Blue
        suppressMarkers: true
    });
    renderer2 = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "#001f3d", strokeWeight: 5 }, // Dark Blue
        suppressMarkers: true
    });
    renderer3 = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 }, // Blue
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

    let newRoute = {
        start: startingLoc?.address || "Unknown",
        destination: destinationLoc?.address || "Unknown"
    };

    directionsService.route(request1, (result, status) => {
        if (status === "OK") {
            renderer1.setDirections(result);
            newRoute.first = result.routes[0].legs[0].distance.text;
        } else {
            console.error("Error fetching route 1:", status);
        }
    });

    directionsService.route(request2, (result, status) => {
        if (status === "OK") {
            renderer2.setDirections(result);
            newRoute.second = result.routes[0].legs[0].distance.text;
        } else {
            console.error("Error fetching route 2:", status);
        }
    });

    directionsService.route(request3, (result, status) => {
        if (status === "OK") {
            renderer3.setDirections(result);
            newRoute.third = result.routes[0].legs[0].distance.text;
        } else {
            console.error("Error fetching route 3:", status);
        }
    });

    setTimeout(() => {
        console.log("Route summary:", newRoute);
        routes.push(newRoute);
        renderRoutes();
    }, 1000);
}

function stationToStation() {
    if (
        !startingLoc.latitude || !startingLoc.longitude ||
        !destinationLoc.latitude || !destinationLoc.longitude
    ) {
        console.error("Missing coordinates", { startingLoc, destinationLoc });
        return;
    }

    const sourceStation = findClosestStation(startingLoc.latitude, startingLoc.longitude);
    const destStation = findClosestStation(destinationLoc.latitude, destinationLoc.longitude);

    updateRoute(
        startingLoc.latitude, startingLoc.longitude,
        sourceStation.latitude, sourceStation.longitude,
        destStation.latitude, destStation.longitude,
        destinationLoc.latitude, destinationLoc.longitude
    );

    setTimeout(() => renderRoutes(), 400);
}
