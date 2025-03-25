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


function updateRoute(startLat, startLng, endLat, endLng) {
    if (!startLat || !startLng || !endLat || !endLng) {
        console.error("Error: Missing coordinates for route");
        return;
    }

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
        } else {
            console.error("Error fetching directions:", status);
        }
    });

    selectingNewStart = true;
}

function stationToStation() {
    if (!startingLoc.latitude || !startingLoc.longitude || !destinationLoc.latitude || !destinationLoc.longitude) {
        console.error("Error: Missing coordinates for route", {
            startingLoc, destinationLoc
        });
        return;
    }

    updateRoute(
        startingLoc.latitude, startingLoc.longitude,
        destinationLoc.latitude, destinationLoc.longitude
    );

    setTimeout(() => renderRoutes(), 400);
}
