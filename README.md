# COMP30830-SE-G9-Dublin_bike_system

Features

- Interactive Google Map displaying bike stations

- Real-time weather widget via OpenWeather API

- Search and directions between bike stations

- Bike and parking spot predictions (15-min interval)

- Historical and forecast weather database

- Unit and integration testing using unittest


Project structure
```
COMP30830-SE-G9-Dublin_bike_system/
├── app.py                 # Main Flask app
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (MySQL credentials)
├── README.md
│
├── backend/              
│   └── db/              # Database interaction scripts
│       ├── SQLpw.py          # DB credentials (URI, USER, etc.)
│       ├── dbinfo.py         # API base path config
│       ├── db_connection.py  # DB connection helper
│       ├── *.py              # Table creation and CSV loaders
│       └── weather.csv       
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
