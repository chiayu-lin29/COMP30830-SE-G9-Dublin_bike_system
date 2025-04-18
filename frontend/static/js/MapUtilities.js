/**
 * Location Utility Functions
 * 
 * Handles marker-to-address conversion, distance calculation, and geocoding via Google Maps API.
 * These functions assist with location selection and route setup in the app.
 * 
 * @module MapUtilities
 */


/**
 * Converts a marker's position to a street name using reverse geocoding,
 * then sets the resulting location as either the start or destination.
 * 
 * @async
 * @function
 * @param {object} marker - A Google Maps marker object with a position.
 * @param {boolean} isStart - Flag indicating whether this is the start location.
 * 
 * @example
 * markerToStn(myMarker, true); // Sets the starting location
 */
async function markerToStn(marker, isStart) {
  const pos = marker.position;
  console.log(pos);

  const lng = pos.vC;
  const lat = pos.uC;

  const addr = await getStreetName(lat, lng);
  const obj = {
    address: addr,
    latitude: lat,
    longitude: lng
  };

  if (isStart) {
    clickStartSuggestion(obj);
  } else {
    clickEndSuggestion(obj);
  }
}


/**
 * Uses Google Maps Geocoding API to get the street name from latitude and longitude coordinates.
 * 
 * @function
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @returns {Promise<string>} - A promise that resolves to the street name.
 * 
 * @example
 * getStreetName(53.3438, -6.2546).then(name => console.log(name));
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


/**
 * Calculates the great-circle distance between two coordinates using the Haversine formula.
 * 
 * @function
 * @param {number} lat1 - Latitude of the first location.
 * @param {number} lon1 - Longitude of the first location.
 * @param {number} lat2 - Latitude of the second location.
 * @param {number} lon2 - Longitude of the second location.
 * @returns {number} - Distance in kilometers.
 * 
 * @example
 * const dist = haversineDistance(53.3438, -6.2546, 53.3498, -6.2603);
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}
