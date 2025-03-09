// Initialize and add the map
let map;
let directionsService;
let directionsRenderer;
let selectingDestination = false;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const location = { lat: 53.3438, lng: -6.2546 };
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap();

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        mapId: "DEMO_MAP_ID",
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    fetch('/stations')
        .then(response => response.json())
        .then(data => {
            console.log("test", data)
            data.stations.forEach((station) => {
                const pin = new PinElement({
                    background: "#001f3d",
                    borderColor: "#ffffff",
                    glyph: `${station.bikes || 0}`,
                    glyphColor: "#ffffff",
                });

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: map,
                    position: { lat: station.latitude, lng: station.longitude },
                    content: pin.element
                });

                marker.addListener("gmp-click", () => {
                    console.log("Station Clicked:", station);

                    if (selectingDestination) {
                        destinationLoc = { ...station };
                        console.log("Destination Set:", destinationLoc);
                        setDest();
                        selectingDestination = false;
                    } else {
                        startingLoc = { ...station };
                        console.log("Starting Station Set:", startingLoc);
                        setStart();
                        updateNavbar(
                            station.number,
                            station.address,
                            station.mechanical_bikes || 0,
                            station.electrical_bikes || 0,
                            station.capacity || "N/A"
                        );
                        navDisplay();
                    }
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

function selectDestination() {
    console.log("Switching to destination selection mode...");
    selectingDestination = true;
}

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
        console.log("Destination Input Updated:", input.value);
    } else {
        console.warn("No destination selected yet.");
    }
}

initMap();
