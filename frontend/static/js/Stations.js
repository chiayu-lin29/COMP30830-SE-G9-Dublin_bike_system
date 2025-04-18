/**
 * A module for managing bike station markers on a map.
 * Provides functionality to create, update, and interact with bike station markers.
 * @module Stations
 * @example
 * // Create markers for all stations
 * createStationMarkers(stationData, google.maps.marker.PinElement, google.maps.marker.AdvancedMarkerElement);
 * 
 * // Update display to show available parking instead of available bikes
 * updateGlyphs('parking');
 */

/**
 * Creates markers for each bike station on the map.
 * @function
 * @param {Array} stations - Array of station objects with location and availability data.
 * @param {Object} PinElement - Google Maps Pin Element constructor.
 * @param {Object} AdvancedMarkerElement - Google Maps Advanced Marker Element constructor.
 * @returns {void}
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
* Creates an info window with station details.
* @function
* @param {Object} station - Station object containing address, capacity, and availability data.
* @returns {google.maps.InfoWindow} The configured info window for the station.
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
* Sets a new marker at a specific location on the map.
* @function
* @param {Object} loc - Location object with lat and lng properties.
* @param {google.maps.marker.AdvancedMarkerElement} marker - Existing marker to replace (if any).
* @param {string} colour - Hex color code for the marker background.
* @returns {google.maps.marker.AdvancedMarkerElement} The newly created marker.
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
* Adds hover effects to station markers.
* @function
* @param {google.maps.marker.PinElement} pin - The pin element to add hover effects to.
* @param {google.maps.marker.AdvancedMarkerElement} marker - The marker associated with the pin.
* @param {google.maps.InfoWindow} infoWindow - The info window to display on hover.
* @returns {void}
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
* Updates the glyph display type for all markers (bikes or parking).
* @function
* @param {string} glyphType - The type of data to display ('bikes' or 'parking').
* @returns {void}
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
* Finds the closest bike station to a given location.
* @function
* @param {number} currentLat - The current latitude.
* @param {number} currentLon - The current longitude.
* @returns {Object} The closest station object.
*/
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