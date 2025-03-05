//import { bikes } from "./bikes.js"


// Initialize and add the map
let map; 
let directionsService;
let directionsRenderer;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    // The location of the marker (center of the map)
    const location = { lat: 53.3438, lng: -6.2546 };
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap();
    
    // Create the map centered at the location
    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: location,
      mapId: "DEMO_MAP_ID",
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    fetch('/stations').then(response => response.json()).then(data => {
        console.log("test", data)
        data.stations.forEach((station) =>{
            const pin = new PinElement({
              background: "#001f3d",   
              borderColor: "#ffffff",  
              glyph: `${station.availableBikes}`,           
              glyphColor: "#ffffff",   
          });
    
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: station.latitude, lng: station.longitude },
            content: pin.element
            })
    
          marker.addListener("click", () => {
            updateNavbar(station.number, station.address, station.mechBikes, station.elecBikes, station.capacity);
            startingLoc = station;
            setStart();
          })
    
          marker.addListener("hover", (event) => {
            console.log("Hover")
          })
        })
        
    })
  }

initMap();


