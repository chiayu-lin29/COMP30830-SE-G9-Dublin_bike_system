// Initialize and add the map
let map;
let sourceMarker;
let destMarker;
let selectionMode = false;
let directionsService;
let directionsRenderer;
let selectingDestination = false;
let stationMap = {};
let pinMap = {};
let glyphDiv = "availableBikes";

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
        if (searchParams["searchMode"]){
            if (searchParams["searchSource"]){
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
            data.stations.forEach((station) => {
                stationMap[station.id] = station;
                const pin = new PinElement({
                    background: "#001f3d",
                    borderColor: "#ffffff",
                    glyph: `${station.availableBikes || 0}`,
                    glyphColor: "#ffffff",
                });

                pinMap[station.id] = pin;

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: map,
                    position: { lat: station.latitude, lng: station.longitude },
                    content: pin.element
                });

                const infoWindow = new google.maps.InfoWindow({
                    // style="font-size: 14px; color: black; background-color: white; padding: 10px; border-radius: 5px;"
                    content: `<div class="info-window" >
                                <div style="text-align:center;"><h1>${station.address}<h1></div>
                                <div style="display:flex; gap:0.5rem; align-items:center;justify-content:center;">
                                    <div class="icon"><h1 id="mechanicalBikes">${station.availableBikes || 0}</h1><i class="icon-fa fa-solid fa-bicycle"></i></div>
                                    <div class="icon"><h1 id="stands">${station.capacity - station.availableBikes}</h1><i class="icon-fa fa-solid fa-square-parking"></i></div>
                                </div>
                              </div>`
                });

                

                // Attach hover effect listeners to pin.element (the actual DOM element)
                pin.element.addEventListener('mouseover', () => {
                    infoWindow.open({
                        anchor: marker,
                        map: map,
                        shouldFocus: false // Optional: prevents auto-focusing on the info window
                    });
                    pin.element.style.transform = 'scale(1.2)';
                    pin.element.style.transition = 'transform 0.3s ease'; // Smooth scaling transition
                });

                pin.element.addEventListener('mouseout', () => {
                    infoWindow.close({
                        anchor: marker,
                        map: map,
                        shouldFocus: false // Optional: prevents auto-focusing on the info window
                    });
                    pin.element.style.transform = 'scale(1)'; // Reset scale after hover
                });

                marker.addListener("gmp-click", () => {openNavWithStation(station)});
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}


function setMarker(loc, marker, colour){

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

    searchParams["searchMode"] = false;
    return marker;
}

async function markerToStn(marker, start){
    const pos = marker["position"];
    console.log("position: ", pos);
    console.log("Latitude: ", pos["BC"]);
    console.log("Longitude: ", pos["AC"]);
    const long = pos["BC"];
    const lat = pos["AC"];
    const addr = await getStreetName(lat, long);
    const obj = {"address": addr, "latitude": lat, "longitude": long}
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
                console.log("Working");
                let streetName = "";
                console.log(results);
                results[0].address_components.forEach(component => {
                    if (component.types.includes("route")) {
                        streetName = component.long_name;
                    }
                });

                resolve(streetName); // Return the street name
            } else {
                console.error("Geocoder failed due to: " + status);
                reject("No street name found");
            }
        });
    });
}

function updateGlyphs(glyphType){
    const currGlyph = document.getElementById(`glyph-${glyphDiv}`);
    const newGlyph = document.getElementById(`glyph-${glyphType}`);
    glyphDiv = glyphType;

    currGlyph.style.color = "white";
    newGlyph.style.color = "#87CEEB";

    for (let key in pinMap){
        const pin = pinMap[key];
        const station = stationMap[key];
        if (pin && station){
            if (glyphType == "parking"){
                pin.glyph = `${Math.max(0, (station.capacity ?? 0) - (station.availableBikes ?? 0))}`;
            }else{
                pin.glyph = `${station[glyphType] || 0}`
            }
            
        }
    }
}
initMap();
