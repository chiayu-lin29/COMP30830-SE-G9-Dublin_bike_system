const weatherButton = document.getElementById("weather-button");
let times = [];
let temperatures = [];
let feelsLike = [];
let clouds = [];
let windSpeeds = [];
let weatherChart;
let chartDisplay = false;

displayCurrWeather();

async function displayCurrWeather() {
    try {
        const response = await fetch('/currWeather');
        const data = await response.json();
        const weatherData = data.weather
        
        weatherButton.innerHTML = ""; // Clear any previous content

        var buttonContents = document.createElement("div");
        var weatherText = document.createElement("h1");
        var weatherIcon = document.createElement("i");

        // Assign weather text (e.g., temperature) to weatherText element
        weatherText.innerText = `${weatherData.temperature}°C`; // Assuming temperature is in Celsius

        // Assign appropriate weather icon based on weather description
        switch (weatherData.weatherDesc) {
            case "Clouds":
                weatherIcon.className = "fa-solid fa-cloud"; // Cloud icon
                break;
            default:
                weatherIcon.className = "fa-light fa-sun"; // Default sunny icon
                break;
        }

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

function closeChart(){
    if (chartDisplay){
        const chart = document.getElementById("weather-chart-container")
        chart.style.display = 'none';
        chartDisplay = false;
    }
}

async function openChart(){
    if (!chartDisplay){
        const chart = document.getElementById("weather-chart-container");
        chart.style.display = 'flex';
        chartDisplay = true;
        await getWeather()
        chartWeather()
    }
    
}

async function toggleWeatherChart(){
    if (chartDisplay){
        closeChart()
    }else{
        openChart()
    }
}

async function getWeather(){
    const response = await fetch('/weather');
    const data = await response.json();
    const weatherData = data.weather;
    console.log(weatherData);

    // Clear arrays before pushing new data
    times = [];
    temperatures = [];
    feelsLike = [];
    clouds = [];
    windSpeeds = [];
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
}




function chartWeather(){
    const ctx = document.getElementById('weather-chart').getContext('2d');
    if (weatherChart){
        weatherChart.destroy();
    }
    weatherChart = new Chart(ctx, {
        type: 'line',  // Line chart to show temperature over time
        data: {
            labels: times,  // Use the 'times' array for the x-axis
            datasets: [{
                label: 'Temperature (°C)',  // Label for the dataset
                data: temperatures,  // Use the 'temperatures' array for the y-axis
                borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                fill: false,  // Don't fill under the line
            },
            {
                label: 'Feels Like (°C)',  // Label for the feels-like dataset
                data: feelsLike,  // Data for the y-axis (feels-like array)
                borderColor: 'rgba(255, 159, 64, 1)',  // Line color for feels-like
                fill: false,  // Don't fill under the feels-like line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',  // X-axis will be based on categories (times)
                    title: {
                        display: true,
                        text: 'Time'  // Label for the X-axis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'  // Label for the Y-axis
                    }
                }
            }
        }
    })
}

function chartClouds(){
    const ctx = document.getElementById('weather-chart').getContext('2d');
    // Destroy the previous chart instance if it exists
    if (weatherChart) {
        weatherChart.destroy();
    }

    console.log(clouds)
    // Create a new chart
    weatherChart = new Chart(ctx, {
        type: 'line',  // Line chart to show cloud coverage over time
        data: {
            labels: times,  // Use the 'times' array for the x-axis
            datasets: [{
                label: 'Cloud Coverage (%)',  // Label for the dataset
                data: clouds,  // Use the 'clouds' array for the y-axis
                borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                fill: false,  // Don't fill under the line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',  // X-axis will be based on categories (times)
                    title: {
                        display: true,
                        text: 'Time'  // Label for the X-axis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cloud Coverage (%)'  // Label for the Y-axis
                    }
                }
            }
        }
    });
}

function chartWind(){
    const ctx = document.getElementById('weather-chart').getContext('2d');
    // Destroy the previous chart instance if it exists
    if (weatherChart) {
        weatherChart.destroy();
    }
    // Create a new chart
    weatherChart = new Chart(ctx, {
        type: 'line',  // Line chart to show cloud coverage over time
        data: {
            labels: times,  // Use the 'times' array for the x-axis
            datasets: [{
                label: 'Wind Speed (m/s)',  // Label for the dataset
                data: windSpeeds,  // Use the 'clouds' array for the y-axis
                borderColor: 'rgba(75, 192, 192, 1)',  // Line color
                fill: false,  // Don't fill under the line
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',  // X-axis will be based on categories (times)
                    title: {
                        display: true,
                        text: 'Time'  // Label for the X-axis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'  // Label for the Y-axis
                    }
                }
            }
        }
    });
}