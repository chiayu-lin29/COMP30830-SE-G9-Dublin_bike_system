// Initialize and add the map
let map;
let sourceMarker;
let destMarker;
let selectionMode = false;
let directionsService;
let directionsRenderer;
let selectingDestination = false;
let stations;


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

    map.addListener("click", function(event) {
        if (searchMode){
            if (searchSource){
                sourceMarker = setMarker(event.latLng, sourceMarker, "#006400");
                markerToStn(sourceMarker, true);
            }else{
                destMarker = setMarker(event.latLng, destMarker, "#8B0000");
                markerToStn(destMarker, false);
            }
                
        }
    })

    fetch('/stations')
        .then(response => response.json())
        .then(data => {
            console.log("test", data)
            stations = data.stations
            data.stations.forEach((station) => {
                const pin = new PinElement({
                    background: "#001f3d",
                    borderColor: "#ffffff",
                    glyph: `${station.availableBikes || 0}`,
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
                            station.mechBikes || 0,
                            station.elecBikes || 0,
                            station.capacity || "N/A"
                        );
                        navDisplay();
                    }
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

function setMarker(loc, marker, colour){

    console.log(marker)
    if (marker){
        marker.setMap(null);
    }

    const pin = new google.maps.marker.PinElement({
        background: colour,
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
    });

    marker = new google.maps.marker.AdvancedMarkerElement({
        position: loc,
        map: map,
        content: pin.element
    });
    console.log(marker)

    searchMode = false;
    return marker;
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

document.getElementById("route-input").addEventListener("click", function() {
    searchMode = true;
    searchSource = true;
});

document.getElementById("route-input-dest").addEventListener("click", function() {
    searchMode = true;
    searchSource = false;
});

async function markerToStn(marker, start){
    const pos = marker["position"];
    const lat = pos["wC"];
    const long = pos["xC"];
    const addr = await getStreetName(lat, long);
    const obj = {"address": addr, "latitude": pos["wC"], "longitude": pos["xC"]}
    if (start){
        clickStartSuggestion(obj);
    }else{
        clickEndSuggestion(obj);
    }
}

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

                console.log("Street Name:", streetName);
                resolve(streetName); // Return the street name
            } else {
                console.error("Geocoder failed due to: " + status);
                reject("No street name found");
            }
        });
    });
}
initMap();
