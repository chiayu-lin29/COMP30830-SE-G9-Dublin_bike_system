"""
This module provides utility functions for weather data feature extraction
and preprocessing for machine learning models.

Functions:
- get_features: Fetches and extracts features from weather forecast data.
- clean_datapoint: Cleans and formats a single weather data point.
"""

import requests
import json
import datetime
import os
from typing import List, Union, Dict, Any

# Constants for the OpenWeatherMap API
URI: str = "https://api.openweathermap.org/data/2.5/forecast"
CITY: str = "Dublin"
API: Union[str, None] = os.getenv("OPENWEATHER_API_KEY")

def get_features() -> List[List[Union[str, int, float]]]:
    """
    Fetch and process weather forecast data from OpenWeatherMap API.

    Returns:
        A list of lists containing:
            - times (List[str]): Formatted timestamps (e.g., 'Monday 15:00')
            - is_weekday (List[int]): 1 if weekday, 0 if weekend
            - hour (List[str]): Hour in 24h format (e.g., '15')
            - temperature (List[float]): Temperature in Celsius
            - humidity (List[int]): Relative humidity percentage
            - pressure (List[int]): Atmospheric pressure in hPa
    """
    res = requests.get(URI, params={"q": CITY, "appid": API, "units": "metric"})
    data = res.json()

    times: List[str] = []
    is_weekday: List[int] = []
    hour: List[str] = []
    temperature: List[float] = []
    humidity: List[int] = []
    pressure: List[int] = []

    for forecast in data["list"]:
        timestamp = datetime.datetime.fromtimestamp(forecast["dt"])
        day = timestamp.strftime('%A')
        times.append(timestamp.strftime('%A %H:%M'))
        hour.append(timestamp.strftime('%H'))

        is_weekday.append(0 if day in ["Saturday", "Sunday"] else 1)

        main = forecast["main"]
        temperature.append(main["temp"])
        humidity.append(main["humidity"])
        pressure.append(main["pressure"])

    return [times, is_weekday, hour, temperature, humidity, pressure]

def clean_datapoint(weather: Dict[str, Any]) -> List[Union[str, int, float]]:
    """
    Clean and format a single weather data point.

    Args:
        weather (dict): A dictionary with keys:
            - "time" (datetime): Datetime object of the reading
            - "temperature" (float)
            - "humidity" (int)
            - "pressure" (int)

    Returns:
        A list with:
            - time (str): Formatted timestamp (e.g., 'Monday 15:00')
            - is_weekday (int): 1 if weekday, 0 if weekend
            - hour (str): Hour in 24h format
            - temperature (float)
            - humidity (int)
            - pressure (int)
    """
    day = weather["time"].strftime('%A')
    time = weather["time"].strftime('%A %H:%M')
    hour = weather["time"].strftime('%H')
    is_weekday = 0 if day in ["Saturday", "Sunday"] else 1

    return [time, is_weekday, hour, weather["temperature"], weather["humidity"], weather["pressure"]]
