/**
 * Navigation and Panel Controls
 */
function navHide() {
    const navElement = document.getElementById("nav-container"); 
  
    navElement.style.width = "0px";
  
    setTimeout(() => {
      navElement.style.opacity = "0";
      navElement.style.paddingLeft = "0px";
      navElement.style.paddingRight = "0px";
    }, 450);
  
    setTimeout(() => {
      navElement.style.visibility = "hidden";
    }, 500);
  }
  
  async function navDisplay() {
    showLoading("nav-loading");
    try {
      const navElement = document.getElementById("nav-container"); 
  
      navElement.style.width = "500px";
      navElement.style.visibility = "visible";
      navElement.style.opacity = "1";
      navElement.style.paddingLeft = "10px";
      navElement.style.paddingRight = "10px";
  
      updateTime();
      if (AppState.startingLoc && AppState.startingLoc.id) {
        await plot_station_predictions(AppState.startingLoc.id);
      }
    } catch (err) {
      console.error("Failed to load chart data:", err);
      alert("There was an error loading the chart.");
    } finally {
      hideLoading("nav-loading");
    }
  }
  
  function showDirections() {
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    AppState.searchParams.searchMode = true;
  
    info.style.display = "none";  
    directions.style.display = "flex";  
  }
  
  function hideDirections() {
    let info = document.getElementById("info-container");
    let directions = document.getElementById("directions-container");
    AppState.searchParams.searchSource = false;
  
    info.style.display = "flex";  
    directions.style.display = "none";
    hideDirectionsText();
  }
  
  function showSearch() {
    navDisplay();
    showDirections();
  }
  
  function hideDirectionsText() {
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "none";
  }
  
  function showDirectionsText() {
    const directionsText = document.getElementById("directionsText");
    directionsText.style.display = "flex";
  }
  
  function closeDirections() {
    hideDirectionsText();
    removeRoute();
  }


  function updateNavbar(number, name, mechanical_bikes, electrical_bikes, stands) {
    navDisplay();
    const navbarName = document.getElementById("station-address");
    const navbarNum = document.getElementById("station-number");
    const numMechBikes = document.getElementById("mechanicalBikes");
    const numElecBikes = document.getElementById("electricalBikes");
    const numParking = document.getElementById("stands");
  
    if (navbarName) {
      navbarName.innerHTML = `${name || "Unknown"}`;
    }
    if (navbarNum) {
      navbarNum.innerHTML = `${number || "N/A"}`;
    }
    if (numMechBikes) {
      numMechBikes.innerHTML = `${mechanical_bikes || 0}`;
    }
    if (numElecBikes) {
      numElecBikes.innerHTML = `${electrical_bikes || 0}`;
    }
    if (numParking) {
      numParking.innerHTML = `${stands || 0}`;
    }
  }

