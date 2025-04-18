"""
This module provides prediction functions for bike availability
based on weather features using pre-trained machine learning models.

Functions:
- bikes_predict: Predicts bike availability for all future forecast times at a station.
- predict_one: Predicts bike availability for a single, custom weather data point.
"""

import pandas as pd
import pickle
import datetime
from typing import List, Tuple, Dict, Any

from ML.get_weather_info import get_features, clean_datapoint

def bikes_predict(station_id: int) -> List[List[Any]]:
    """
    Predict bike availability at a given station for upcoming forecast times.

    Args:
        station_id (int): The ID of the bike station.

    Returns:
        List containing:
            - times (List[str]): Formatted timestamps for each forecast point.
            - predictions (List[int]): Predicted number of available bikes.
    """
    model_filename = f"ML/pkl_files/avail_station_{station_id}.pkl" 
    with open(model_filename, "rb") as file:
        model = pickle.load(file)

    times, is_weekday, hour, temperature, humidity, pressure = get_features()

    new_data = pd.DataFrame({
        "is_weekday": is_weekday,  
        "hour": hour,       
        "temperature": temperature,
        "humidity": humidity,
        "pressure": pressure
    })

    predictions = model.predict(new_data)
    predictions = [round(pred) for pred in predictions]
    print("Predictions:", predictions)
    return [times, predictions]

def predict_one(station_id: int, weather: Dict[str, Any]) -> List[Any]:
    """
    Predict bike availability for a single weather data point.

    Args:
        station_id (int): The ID of the bike station.
        weather (dict): A dictionary containing:
            - "time" (datetime): Datetime object
            - "temperature" (float)
            - "humidity" (int)
            - "pressure" (int)

    Returns:
        A list containing:
            - time (str): Formatted timestamp of prediction
            - prediction (int): Predicted number of available bikes
    """
    model_filename = f"ML/pkl_files/avail_station_{station_id}.pkl" 
    with open(model_filename, "rb") as file:
        model = pickle.load(file)
    
    time, is_weekday, hour, temperature, humidity, pressure = clean_datapoint(weather)

    new_data = pd.DataFrame({
        "is_weekday": [is_weekday],  
        "hour": [hour],       
        "temperature": [temperature],
        "humidity": [humidity],
        "pressure": [pressure]
    })

    prediction = model.predict(new_data)
    prediction = [round(pred) for pred in prediction]
    print("Prediction:", prediction[0])
    return [time, prediction[0]]
