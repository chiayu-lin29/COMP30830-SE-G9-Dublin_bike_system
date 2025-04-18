const AppState = {
    map: null,
    directionsService: null,
    directionsRenderer: null,
    sourceMarker: null,
    destMarker: null,
    stationMap: {},
    pinMap: {},
    currentGlyphType: "availableBikes",
    routes: [],
    searchParams: {
      searchMode: false,
      searchSource: true
    },
    startingLoc: null,
    destinationLoc: null,
    renderers: {
      walking1: null,
      cycling: null,
      walking2: null
    },
    datasets: {
      bikePredictions: [],
      parkPredictions: [],
      temperatures: [],
      feelsLike: [],
      windSpeeds: []
    },
    selectedTime: null,
    charts: {
        "weatherChart": null,
        "parkChart": null,
        "bikesChart": null,
    }
  };


/**
 * Map Initialization and Station Setup
 */
async function initMap() {
    showLoading("app-loading");
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  
    const dublinLocation = { lat: 53.3438, lng: -6.2546 };
    
    // Initialize directions services
    AppState.directionsService = new google.maps.DirectionsService();
    AppState.directionsRenderer = new google.maps.DirectionsRenderer();
    AppState.directionsRenderer.setMap();
  
    // Create map instance
    AppState.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: dublinLocation,
      mapId: "DEMO_MAP_ID",
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
  
    // Add click listener for map for location selection
    AppState.map.addListener("click", function(event) {
      if (AppState.searchParams.searchMode) {
        if (AppState.searchParams.searchSource) {
          AppState.sourceMarker = setMarker(event.latLng, AppState.sourceMarker, "#006400");
          markerToStn(AppState.sourceMarker, true);
        } else {
          AppState.destMarker = setMarker(event.latLng, AppState.destMarker, "#8B0000");
          markerToStn(AppState.destMarker, false);
        }
        cancelInput();
      }
    });
    // Load station data
    try {
      const response = await fetch('/stations');
      const data = await response.json();
      
        createStationMarkers(data.stations, PinElement, AdvancedMarkerElement);
        console.log("HELLO End Of Function");
       
      
    } catch (error) {
      console.error("Error fetching stations data:", error);
    }
    generateHours();
    updateTime();
    await displayCurrWeather();
    hideLoading("app-loading");
  }
  
  function initStartLoc(){
    if (!AppState.startingLoc) {
        AppState.startingLoc = {
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
    }
  }



/**
 * Create markers for each bike station on the map
 */
function createStationMarkers(stations, PinElement, AdvancedMarkerElement) {
    try{
        stations.forEach((station) => {
            // Store station data in app state
            AppState.stationMap[station.id] = station;
            
            // Create pin with bike availability info
            const pin = new PinElement({
              background: "#001f3d",
              borderColor: "#ffffff",
              glyph: `${station.availableBikes || 0}`,
              glyphColor: "#ffffff",
            });
        
            AppState.pinMap[station.id] = pin;
        
            // Create marker with the pin
            const marker = new AdvancedMarkerElement({
              map: AppState.map,
              position: { lat: station.latitude, lng: station.longitude },
              content: pin.element
            });
        
            // Create info window for the marker
            const infoWindow = createStationInfoWindow(station);
            
            // Add hover effects
            addMarkerHoverEffects(pin, marker, infoWindow);
            
            // Add click handler to open navigation panel with station info
            marker.addListener("gmp-click", () => openNavWithStation(station));
          });
          console.log("NO ERROR");
    }catch (err){
        console.log("Create markers Error: ", err);
    }
    
  }

  /**
 * Create info window content for a station
 */
function createStationInfoWindow(station) {
    return new google.maps.InfoWindow({
      content: `<div class="info-window">
                  <div style="text-align:center;"><h1>${station.address}<h1></div>
                  <div style="display:flex; gap:0.5rem; align-items:center;justify-content:center;">
                    <div class="icon"><h1 id="mechanicalBikes">${station.availableBikes || 0}</h1><i class="icon-fa fa-solid fa-bicycle"></i></div>
                    <div class="icon"><h1 id="stands">${station.capacity - station.availableBikes}</h1><i class="icon-fa fa-solid fa-square-parking"></i></div>
                  </div>
                </div>`
    });
  }
  

  /**
 * Add hover effects to station markers
 */
function addMarkerHoverEffects(pin, marker, infoWindow) {
    pin.element.addEventListener('mouseover', () => {
      infoWindow.open({
        anchor: marker,
        map: AppState.map,
        shouldFocus: false 
      });
      pin.element.style.transform = 'scale(1.2)';
      pin.element.style.transition = 'transform 0.3s ease'; 
    });
  
    pin.element.addEventListener('mouseout', () => {
      infoWindow.close({
        anchor: marker,
        map: AppState.map,
        shouldFocus: false 
      });
      pin.element.style.transform = 'scale(1)'; 
    });
  }

  /**
 * Update the glyph display type for all markers (bikes or parking)
 */
function updateGlyphs(glyphType) {
    const currGlyph = document.getElementById(`glyph-${AppState.currentGlyphType}`);
    const newGlyph = document.getElementById(`glyph-${glyphType}`);
    AppState.currentGlyphType = glyphType;
  
    currGlyph.style.color = "white";
    newGlyph.style.color = "#87CEEB";
  
    for (let key in AppState.pinMap) {
      const pin = AppState.pinMap[key];
      const station = AppState.stationMap[key];
      if (pin && station) {
        if (glyphType == "parking") {
          pin.glyph = `${Math.max(0, (station.capacity ?? 0) - (station.availableBikes ?? 0))}`;
        } else {
          pin.glyph = `${station[glyphType] || 0}`;
        }
      }
    }
  }
  
  /**
 * Set a new marker on the map
 */
function setMarker(loc, marker, colour) {
    if (marker) {
      marker.setMap(null);
    }
  
    const pin = new google.maps.marker.PinElement({
      background: colour,
      borderColor: "#ffffff",
      glyphColor: "#ffffff",
    });
  
    marker = new google.maps.marker.AdvancedMarkerElement({
      position: loc,
      map: AppState.map,
      content: pin.element
    });
  
    AppState.searchParams.searchMode = false;
    return marker;
  }


/**
 * Convert marker position to street name and set as location
 */
async function markerToStn(marker, isStart) {
    const pos = marker.position;
    console.log(pos);
    const lng = pos.vC;
    const lat = pos.uC;
    const addr = await getStreetName(lat, lng);
    const obj = {"address": addr, "latitude": lat, "longitude": lng};
    
    if (isStart) {
      clickStartSuggestion(obj);
    } else {
      clickEndSuggestion(obj);
    }
  }



/**
 * Get street name from coordinates using Google's Geocoder
 */
function getStreetName(lat, lng) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
  
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          let streetName = "";
          results[0].address_components.forEach(component => {
            if (component.types.includes("route")) {
              streetName = component.long_name;
            }
          });
          resolve(streetName); 
        } else {
          console.error("Geocoder failed due to: " + status);
          reject("No street name found");
        }
      });
    });
  }
  
initMap();
