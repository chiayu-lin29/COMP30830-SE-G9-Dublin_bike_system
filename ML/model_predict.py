import pandas as pd
import pickle
import datetime
from ML.get_weather_info import get_features, clean_datapoint

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

def predict_one(station_id, weather):
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


