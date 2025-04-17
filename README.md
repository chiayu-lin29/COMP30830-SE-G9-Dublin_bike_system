# COMP30830-SE-G9-Dublin_bike_system

## Team 9 Members
- Lin, Chiayu
- Huggard, John
- Kavanagh, Ellie

## Features

- Interactive Google Map displaying bike stations (All/Mech/Elec/Park)

- Real-time weather widget via OpenWeather API

- Search and directions between bike stations

- Route Planning by custom drop off the place on google map

- Suggestion route and show previous searching route

- Bike and parking spot predictions

- Historical and forecast weather database

- Unit and integration testing using unittest


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
