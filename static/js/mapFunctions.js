function updateNavbar(number, name, mech, elec, stands){
    navDisplay();
    const navbarName = document.getElementById("station-address");
    const navbarNum = document.getElementById("station-number");
    const numMechBikes = document.getElementById("mechanicalBikes");
    const numElecBikes = document.getElementById("electricalBikes");
    const numParking = document.getElementById("stands");
    if (navbarName){
      navbarName.innerHTML = `${name}`;
    }
    if (navbarNum){
        navbarNum.innerHTML = `${number}`;
    }
    if (numMechBikes){
        numMechBikes.innerHTML = `${mech}`;
    }
    if (numElecBikes){
        numElecBikes.innerHTML = `${elec}`;
    }
    if (numParking){
        numParking.innerHTML = `${stands}`;
    }
}


function updateRoute(startLat, startLng, endLat, endLng) {
    if (directionsRenderer) {
        directionsRenderer.setMap(null); // Remove old directions
        directionsRenderer = new google.maps.DirectionsRenderer(); // Create new instance
        directionsRenderer.setMap(map);
    }

    const request = {
        origin: { lat: startLat, lng: startLng },  // Start coordinates
        destination: { lat: endLat, lng: endLng }, // End coordinates
        travelMode: "BICYCLING"
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            const travelTime = route.duration.text;  
            const distance = route.distance.text;    
            const newRoute = {"distance": distance, "travelTime": travelTime, "start": startingLoc.address, "destination": destinationLoc.address};
            routes.push(newRoute);
            console.log(routes);
        } else {
            console.error("Error fetching directions:", status);
        }
    });

    
}


