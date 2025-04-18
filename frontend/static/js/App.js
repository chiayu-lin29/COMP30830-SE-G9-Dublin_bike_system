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

  initMap();