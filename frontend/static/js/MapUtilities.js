

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
  
