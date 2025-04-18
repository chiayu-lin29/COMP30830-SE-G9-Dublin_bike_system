const weatherButton = document.getElementById("weather-button");
let currWeather;
let chartDisplay = false;
let datasets = {"times": null, "temperatures": null, "feelsLike": null, "clouds": null, "windSpeeds": null, "bikePredictions": null, "parkPredictions": null};


async function getCurrWeather(){
    try{
        const response = await fetch("/currWeather");
        const data = await response.json();
        currWeather = data.weather;
        console.log(currWeather);
    }catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getWeather(){
    const response = await fetch('/weather');
    const data = await response.json();
    const weatherData = data.weather;
    console.log(weatherData);

    // Clear arrays before pushing new data
    let times = [];
    let temperatures = [];
    let feelsLike = [];
    let clouds = [];
    let windSpeeds = [];
    const options = { weekday: 'short', hour: '2-digit', minute: '2-digit' };

    // Loop through the weather data and push the values to the arrays
    weatherData.forEach(entry => {
        const rawDate = new Date(entry[1])
        times.push(rawDate.toLocaleString('en-US', options));  // Time
        temperatures.push(entry[2]); // Temperature
        feelsLike.push(entry[3]);   // Feels Like
        clouds.push(entry[5]);      // Cloud Description
        windSpeeds.push(entry[6]);  // Wind Speed
    });
    datasets["times"] = times;
    datasets["temperatures"] = temperatures;
    datasets["feelsLike"] = feelsLike;
    datasets["clouds"] = clouds;
    datasets["windSpeeds"] = windSpeeds;
}

function getWeatherIcon(){
    switch(currWeather.weatherDesc){
        case "Clouds":
                return "fa-solid fa-cloud"; 
            default:
                return "fa-solid fa-wind"; 
    }
}

function closeChart(){
    if (chartDisplay){
        const chart = document.getElementById("weather-chart-container")
        chart.style.display = 'none';
        chartDisplay = false;
    }
}

async function openChart(){
    if (!chartDisplay){
        showLoading("weather-loading");
        const chart = document.getElementById("weather-chart-container");
        chart.style.display = 'flex';
        chartDisplay = true;
        await getCurrWeather();
        await getWeather()
        await updateHeader();
        chartDoubleLine('weather-chart', 'temperatures', 'feelsLike', 'Temperature °C', 'Feels Like °C', 'Temperature °C');
        hideLoading("weather-loading");
    }
    
}

async function toggleWeatherChart(){
    if (chartDisplay){
        closeChart()
        await displayCurrWeather();
    }else{
        openChart()
        console.log(currWeather);
    }
}




async function displayCurrWeather() {
    try {
        await getCurrWeather();
        await getWeather();
        
        weatherButton.innerHTML = ""; // Clear any previous content

        var buttonContents = document.createElement("div");
        var weatherText = document.createElement("h1");
        var weatherIcon = document.createElement("i");

        // Assign weather text (e.g., temperature) to weatherText element
        weatherText.innerText = `${currWeather.temperature}°C`; // Assuming temperature is in Celsius


        weatherIcon.className = getWeatherIcon();

        // Append elements to buttonContents
        buttonContents.appendChild(weatherIcon);
        buttonContents.appendChild(weatherText);


        // Finally, add the buttonContents to the weatherButton
        buttonContents.className = "button-contents"
        weatherButton.appendChild(buttonContents);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}



async function updateHeader(){
    const headerTemp = document.getElementById("weather-header-temp");
    const headerTime = document.getElementById("weather-header-time");
    const metric1 = document.getElementById("weather-metric-1");
    const metric2 = document.getElementById("weather-metric-2");
    const metric3 = document.getElementById("weather-metric-3");
    const icon = document.getElementById("weather-header-summary-icon");

    headerTemp.innerText = currWeather.temperature;

    const weatherTime = new Date(currWeather.time);
    const hours = String(weatherTime.getHours()).padStart(2, '0');
    const minutes = String(weatherTime.getMinutes()).padStart(2, '0');
    headerTime.innerText = `${hours}:${minutes}, ${currWeather.weatherDesc}`;

    metric1.innerText = `Feels Like: ${currWeather.feelsLike}°C`;
    metric2.innerText = `Cloud Coverage: ${currWeather.clouds}%`;
    metric3.innerText = `windSpeed: ${currWeather.windSpeed}m/s`;

    icon.classList = `${getWeatherIcon()} primary`;
}



