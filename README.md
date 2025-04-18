# COMP30830-SE-G9-Dublin_bike_system

## Team 9 Members
- Lin, Chiayu
- Huggard, John
- Kavanagh, Ellie

# Overview

Dublin Bikes Journey Planner is an interactive web application that helps users navigate Dublin using the city's bike-sharing system. The application combines real-time bike station data, weather information, route planning, and predictive analytics to provide a comprehensive tool for planning and optimizing bike journeys throughout Dublin.

# Features

## Interactive Map Interface

- View all Dublin Bikes stations with real-time availability  
- Toggle between viewing available bikes or available parking spaces  
- Click directly on the map to select start and end locations  
- Street names automatically resolved via Google's Geocoder API  

## Journey Planning

Plan multi-modal journeys:  
- Walking to the nearest bike station  
- Cycling between stations  
- Walking to final destination  

- View detailed route information with distances and estimated times  
- Save frequently used routes for quick access  

## Real-time Data and Predictions

- Current bike and parking space availability  
- Predictive models showing expected bike availability throughout the day  
- Weather information including temperature, feels-like temperature, and wind speed  
- Visualize data through interactive charts  

## Search and Navigation

- Search for stations by name or location  
- Get suggestions based on partial inputs  
- Simple navigation between panels and views  

# Technical Architecture

The application follows a modular architecture organized into functional areas:

### App Core
- Core application state and initialization functions  

### Stations Module
- Functions for creating, displaying, and interacting with bike station markers  

### Routing Module
- Route calculation, rendering, and management functions  

### Navigation UI Module
- Interface components for navigation panels and route display  

### Search Module
- Location search functionality and suggestion handling  

### Map Utilities
- Geocoding, distance calculations, and marker management  

### Data Visualization Module
- Cleaning data and calculating predictions

### Chart Module
- Chart generation and prediction display functions

### Notification Module
- Inform Users of errors or handling custom onclick functions

### Spinner 
- Loading Components

### Time 
- Pull and Format time information

### Weather Module 
- Pull, format and display weather information

# Backend Architecture

The application uses Flask as its backend framework with the following components:

## API Endpoints

- `/` - Main application view with stations and current weather data  
- `/stations` - Get all bike stations data  
- `/weather` - Get all weather data  
- `/currWeather` - Get current weather conditions  
- `/bike_predict?station_id={id}` - Get predictions for bike availability  
- `/closest_time_pred?station_id={id}&selected_time={time}` - Get predictions for a specific time  
- `/search_suggestions?query={query}` - Get location search suggestions based on station names  

## Database Integration

- MySQL database connection for storing and retrieving bike station and weather data  
- Custom connection management through `db_connection` module  

## Machine Learning Integration

- Predictive models for bike availability implemented in the `ML.model_predict` module  
- Functions for both batch predictions (`bikes_predict`) and single timepoint predictions (`predict_one`)  

# Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3  
- **Backend**: Flask (Python)  
- **Database**: MySQL  
- **Maps**: Google Maps JavaScript API, Directions API, Geocoding API  
- **Data Visualization**: Custom charting implementation  
- **Predictive Analytics**: Custom prediction models for bike availability  



# Installation and Setup

1. Clone this repository

```bash
git clone https://github.com/chiayu-lin29/COMP30830-SE-G9-Dublin_bike_system.git
cd COMP30830-SE-G9-Dublin_bike_system
```

2. Install Python dependencies

```bash
pip install -r requirements.txt
```

3. Set up environment variables
```bash
export GOOGLE_MAPS_API_KEY="your_api_key_here"
export OPENWEATHER_API_KEY="your_actual_key_here"
export FLASK_APP=app.py
```

4. Configure your MySQL database connection in `db/db_connection.py` using a .env that looks similar to the following:
```bash
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name
```

5. Run the application

```bash
python app.py
```

6. Open your browser and navigate to `http://localhost:5500`

# Future Enhancements

- User accounts for saving favorite routes and stations
- Mobile app version with offline capabilities
- Historical data analysis for optimizing routes based on typical conditions

# Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

# License
This project is licensed under the MIT License - see the LICENSE file for details.


## Project structure
```
COMP30830-SE-G9-Dublin_bike_system/
├── app.py                 # Main Flask app
├── requirements.txt       # Python dependencies
├── README.md
│
├── backend/
│   └── db/              # Database interaction scripts
│       └── db_connection.py  # DB connection helper
│
├── data/                 # SQL dump files
│   └── DumpWeatherData/weather/
│       ├── *.sql
│
├── frontend/
│   ├── static/            # Front-end static files
│   │   ├── css/
│   │   └── js/
│   └── templates/         # HTML templates
│       ├── map.html
│       ├── nav.html
│       └── weather.html
│       └── notification.html
│
├── ML/                   # Machine learning logic
│   ├── model_predict.py     # Predict function using .pkl
│   ├── get_weather_info.py  # Real-time weather fetch
│   ├── model.ipynb          # Model development notebook
│   └── pkl_files/           # Trained model files
│
├── testing/              # All test scripts using unittest
    ├── test_app.py
    ├── test_bike_api.py
    ├── test_db_connection.py
    ├── test_model_predict.py
    └── test_weather_api.py
```
