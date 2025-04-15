let renderer1;
let renderer2;
let renderer3;


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

async function updateRoute(sourceStation, destStation) {
    
    const startLat = startingLoc.latitude;
    const startLng = startingLoc.longitude;
    const station1Lat = sourceStation.latitude;
    const station1Lng = sourceStation.longitude;
    const station2Lat = destStation.latitude;
    const station2Lng = destStation.longitude;
    const destLat = destinationLoc.latitude;
    const destLng = destinationLoc.longitude;
    if (!startLat || !startLng || !destLat || !destLng) {
        console.error("Error: Missing coordinates for route");
        return;
    }
    let distanceMetrics = [];
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

    let newRoute = {"start": startingLoc || "Unknown", 
                    "destination": destinationLoc || "Unknown"};

    await directionsService.route(request1, (result, status) => {
        if (status === "OK") {
            renderer1.setDirections(result);
            const route = result.routes[0].legs[0];
            time = route.duration.text;
            distance = route.distance.text;
            newRoute["first"] = distance;
            distanceMetrics.push(["Walk",distance, time, startingLoc.address, sourceStation.address]);
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

    await directionsService.route(request2, (result, status) => {
        if (status === "OK") {
            renderer2.setDirections(result);
            const route = result.routes[0].legs[0];
            time = route.duration.text;
            distance = route.distance.text;

            newRoute["second"] = distance;
            distanceMetrics.push(["Cycle",distance, time, sourceStation.address, destStation.address]);
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

    await directionsService.route(request3, (result, status) => {
        if (status === "OK") {
            renderer3.setDirections(result);
            const route = result.routes[0].legs[0];
            time = route.duration.text;
            distance = route.distance.text;
            
            newRoute["third"] = distance;
            distanceMetrics.push(["Walk",distance, time, destStation.address, destinationLoc.address]);
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
    console.log("Distance metrics: ", distanceMetrics);
    routes.push(newRoute);
    renderRoutes();
    routeDistanceText(distanceMetrics);
}



function stationToStation() {
    if (!startingLoc.latitude || !startingLoc.longitude || !destinationLoc.latitude || !destinationLoc.longitude) {
        console.error("Error: Missing coordinates for route", {
            startingLoc, destinationLoc
        });
        return;
    }
    showDirectionsText();
    const sourceStation = findClosestStation(startingLoc.latitude, startingLoc.longitude);
    const destStation = findClosestStation(destinationLoc.latitude, destinationLoc.longitude);

    updateRoute(sourceStation, destStation);

    setTimeout(() => renderRoutes(), 400);
    
}


function routeDistanceText(distances){
    const title = document.getElementById("direction-title");
    title.innerText = `${distances[0][3]} to ${distances[2][4]}`;
    for (var i = 0; i < 3; i++){
        const distArray = distances[i];
        const distanceHtmlEl = document.getElementById(`direction-${i}`);
        const text = `${distArray[0]}, ${distArray[1]} (${distArray[2]}) from ${distArray[3]} to ${distArray[4]}`;
        distanceHtmlEl.innerHTML = text;
    }
}

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
    for (let key in stationMap){
        const station = stationMap[key];
        const distance = haversineDistance(currentLat, currentLon, station.latitude, station.longitude);
        if (distance < minDistance) {
            minDistance = distance;
            closestStation = station;
        }
    }

    return closestStation;
}

