/**
 * A module for handling weather data retrieval and chart display.
 * Provides functionality to fetch current and forecasted weather data, 
 * display it in charts, and update UI elements accordingly.
 * @module Weather
 * @example
 * // Toggle the weather chart display
 * toggleWeatherChart();
 */

// Get the weather button element
const weatherButton = document.getElementById("weather-button");

/**
 * Fetches the current weather data from the server and updates AppState.
 * @async
 * @function getCurrWeather
 * @returns {Promise<void>}
 */
async function getCurrWeather() {
    try {
        const response = await fetch("/currWeather");
        const data = await response.json();
        AppState.currWeather = data.weather;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

/**
 * Fetches the weather forecast data and updates AppState datasets.
 * @async
 * @function getWeather
 * @returns {Promise<void>}
 */
async function getWeather() {
    const response = await fetch('/weather');
    const data = await response.json();
    const weatherData = data.weather;

    // Clear arrays before pushing new data
    let times = [];
    let temperatures = [];
    let feelsLike = [];
    let clouds = [];
    let windSpeeds = [];
    const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };

    // Loop through the weather data and push the values to the arrays
    weatherData.forEach(entry => {
        const rawDate = new Date(entry[1]);
        times.push(rawDate.toLocaleString('en-US', options));  // Time
        temperatures.push(entry[2]); // Temperature
        feelsLike.push(entry[3]);   // Feels Like
        clouds.push(entry[5]);      // Cloud Description
        windSpeeds.push(entry[6]);  // Wind Speed
    });

    AppState.datasets["times"] = times;
    AppState.datasets["temperatures"] = temperatures;
    AppState.datasets["feelsLike"] = feelsLike;
    AppState.datasets["clouds"] = clouds;
    AppState.datasets["windSpeeds"] = windSpeeds;
}

/**
 * Returns an appropriate weather icon class based on current weather description.
 * @function getWeatherIcon
 * @returns {string} Font Awesome class name representing weather icon
 */
function getWeatherIcon() {
    switch (AppState.currWeather.weatherDesc) {
        case "Clouds":
            return "fa-solid fa-cloud";
        default:
            return "fa-solid fa-wind";
    }
}

/**
 * Hides the weather chart container and updates AppState.
 * @function closeChart
 */
function closeChart() {
    if (AppState.chartDisplay) {
        const chart = document.getElementById("weather-chart-container");
        chart.style.display = 'none';
        AppState.chartDisplay = false;
    }
}

/**
 * Displays the weather chart, fetches latest data, and updates UI.
 * @async
 * @function openChart
 * @returns {Promise<void>}
 */
async function openChart() {
    if (!AppState.chartDisplay) {
        showLoading("weather-loading");
        const chart = document.getElementById("weather-chart-container");
        chart.style.display = 'flex';
        AppState.chartDisplay = true;
        await getCurrWeather();
        await getWeather();
        await updateHeader();
        chartDoubleLine('weather-chart', 'temperatures', 'feelsLike', 'Temperature °C', 'Feels Like °C', 'Temperature °C');
        hideLoading("weather-loading");
    }
}

/**
 * Toggles the weather chart display on and off.
 * @async
 * @function toggleWeatherChart
 * @returns {Promise<void>}
 */
async function toggleWeatherChart() {
    if (AppState.chartDisplay) {
        closeChart();
        await displayCurrWeather();
    } else {
        openChart();
    }
}

/**
 * Displays current weather information on the weather button.
 * @async
 * @function displayCurrWeather
 * @returns {Promise<void>}
 */
async function displayCurrWeather() {
    try {
        await getCurrWeather();
        await getWeather();

        weatherButton.innerHTML = ""; // Clear any previous content

        const buttonContents = document.createElement("div");
        const weatherText = document.createElement("h1");
        const weatherIcon = document.createElement("i");

        weatherText.innerText = `${AppState.currWeather.temperature}°C`;
        weatherIcon.className = getWeatherIcon();

        buttonContents.appendChild(weatherIcon);
        buttonContents.appendChild(weatherText);
        buttonContents.className = "button-contents";

        weatherButton.appendChild(buttonContents);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

/**
 * Updates the weather header section with current weather information.
 * @async
 * @function updateHeader
 * @returns {Promise<void>}
 */
async function updateHeader() {
    const headerTemp = document.getElementById("weather-header-temp");
    const headerTime = document.getElementById("weather-header-time");
    const metric1 = document.getElementById("weather-metric-1");
    const metric2 = document.getElementById("weather-metric-2");
    const metric3 = document.getElementById("weather-metric-3");
    const icon = document.getElementById("weather-header-summary-icon");

    headerTemp.innerText = AppState.currWeather.temperature;

    const weatherTime = new Date(AppState.currWeather.time);
    const hours = String(weatherTime.getHours()).padStart(2, '0');
    const minutes = String(weatherTime.getMinutes()).padStart(2, '0');
    headerTime.innerText = `${hours}:${minutes}, ${AppState.currWeather.weatherDesc}`;

    metric1.innerText = `Feels Like: ${AppState.currWeather.feelsLike}°C`;
    metric2.innerText = `Cloud Coverage: ${AppState.currWeather.clouds}%`;
    metric3.innerText = `windSpeed: ${AppState.currWeather.windSpeed}m/s`;

    icon.classList = `${getWeatherIcon()} primary`;
}
