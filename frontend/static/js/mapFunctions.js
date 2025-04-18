
/**
 * Route Planning Functions
 */
function removeRoute() {
    // Clear all renderers
    Object.values(AppState.renderers).forEach(renderer => {
      if (renderer) {
        renderer.setMap(null);
      }
    });
  }


async function updateRoute(sourceStation, destStation) {
    if (!AppState.startingLoc || !AppState.destinationLoc) {
      console.error("Missing starting or destination location");
      return;
    }
    
    const startLat = AppState.startingLoc.latitude;
    const startLng = AppState.startingLoc.longitude;
    const station1Lat = sourceStation.latitude;
    const station1Lng = sourceStation.longitude;
    const station2Lat = destStation.latitude;
    const station2Lng = destStation.longitude;
    const destLat = AppState.destinationLoc.latitude;
    const destLng = AppState.destinationLoc.longitude;
    
    if (!startLat || !startLng || !destLat || !destLng) {
      console.error("Error: Missing coordinates for route");
      return;
    }
    
    let distanceMetrics = [];
    removeRoute();
  
    // Create renderers for each leg of the journey
    AppState.renderers.walking1 = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 },
      suppressMarkers: true,
      preserveViewport: true 
    });
    
    AppState.renderers.cycling = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: "#001f3d", strokeWeight: 5 },
      suppressMarkers: true,
      preserveViewport: true 
    });
    
    AppState.renderers.walking2 = new google.maps.DirectionsRenderer({
      polylineOptions: { strokeColor: "#4682B4", strokeWeight: 5 },
      suppressMarkers: true,
      preserveViewport: true 
    });
  
    // Set map for all renderers
    Object.values(AppState.renderers).forEach(renderer => renderer.setMap(AppState.map));
  
    // Set up route requests
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
      "start": AppState.startingLoc || "Unknown", 
      "destination": AppState.destinationLoc || "Unknown"
    };
  
    // Process first leg - walk to source bike station
    await new Promise((resolve) => {
      AppState.directionsService.route(request1, (result, status) => {
        if (status === "OK") {
          AppState.renderers.walking1.setDirections(result);
          const route = result.routes[0].legs[0];
          const time = route.duration.text;
          const distance = route.distance.text;
          newRoute["first"] = distance;
          distanceMetrics.push(["Walk", distance, time, AppState.startingLoc.address, sourceStation.address]);
        } else {
          console.error("Error fetching directions:", status);
        }
        resolve();
      });
    });
  
    // Process second leg - cycle between stations
    await new Promise((resolve) => {
      AppState.directionsService.route(request2, (result, status) => {
        if (status === "OK") {
          AppState.renderers.cycling.setDirections(result);
          const route = result.routes[0].legs[0];
          const time = route.duration.text;
          const distance = route.distance.text;
          newRoute["second"] = distance;
          distanceMetrics.push(["Cycle", distance, time, sourceStation.address, destStation.address]);
        } else {
          console.error("Error fetching directions:", status);
        }
        resolve();
      });
    });
  
    // Process third leg - walk to destination
    await new Promise((resolve) => {
      AppState.directionsService.route(request3, (result, status) => {
        if (status === "OK") {
          AppState.renderers.walking2.setDirections(result);
          const route = result.routes[0].legs[0];
          const time = route.duration.text;
          const distance = route.distance.text;
          newRoute["third"] = distance;
          distanceMetrics.push(["Walk", distance, time, destStation.address, AppState.destinationLoc.address]);
        } else {
          console.error("Error fetching directions:", status);
        }
        resolve();
      });
    });
  
    // Store route and update UI
    AppState.routes.push(newRoute);
    renderRoutes();
    routeDistanceText(distanceMetrics);
  }
  


async function stationToStation() {
    showLoading("nav-loading");
    if (!AppState.startingLoc.latitude || !AppState.startingLoc.longitude || 
        !AppState.destinationLoc.latitude || !AppState.destinationLoc.longitude) {
      console.error("Error: Missing coordinates for route", {
        startingLoc: AppState.startingLoc, 
        destinationLoc: AppState.destinationLoc
      });
      hideLoading("nav-loading");
      return;
    }
    
    showDirectionsText();
    const sourceStation = findClosestStation(AppState.startingLoc.latitude, AppState.startingLoc.longitude);
    const destStation = findClosestStation(AppState.destinationLoc.latitude, AppState.destinationLoc.longitude);
    console.log(sourceStation);
    await predict_bike_at_time(sourceStation.id);
    await updateRoute(sourceStation, destStation);
    hideLoading("nav-loading");    
  }



function routeDistanceText(distances) {
    const title = document.getElementById("direction-title");
    title.innerText = `${distances[0][3]} to ${distances[2][4]}`;
    
    for (var i = 0; i < 3; i++) {
      const distArray = distances[i];
      const distanceHtmlEl = document.getElementById(`direction-${i}`);
      const text = `${distArray[0]}, ${distArray[1]} (${distArray[2]}) from ${distArray[3]} to ${distArray[4]}`;
      distanceHtmlEl.innerHTML = text;
    }
  }


/**
 * Utility Functions
 */
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
    for (let key in AppState.stationMap) {
      const station = AppState.stationMap[key];
      const distance = haversineDistance(currentLat, currentLon, station.latitude, station.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    }
    return closestStation;
  }
