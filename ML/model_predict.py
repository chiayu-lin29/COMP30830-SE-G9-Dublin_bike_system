import pandas as pd
import pickle
import datetime
from ML.get_weather_info import get_features

def bikes_predict(station_id):
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


