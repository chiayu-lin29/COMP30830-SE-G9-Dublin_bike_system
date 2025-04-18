import requests
import json
import datetime
import os

URI = "https://api.openweathermap.org/data/2.5/forecast"
CITY = "Dublin"
API = os.getenv("OPENWEATHER_API_KEY")

def get_features():
    res = requests.get(URI, params={"q":CITY,"appid":API, "units": "metric"})
    data = res.json()

    times = []
    is_weekday = []
    hour = []
    temperature = []
    humidity = []
    pressure = []

    for forecast in data["list"]:
        day = datetime.datetime.fromtimestamp(forecast["dt"]).strftime('%A')
        times.append(datetime.datetime.fromtimestamp(forecast["dt"]).strftime('%A %H:%M'))
        hour.append(datetime.datetime.fromtimestamp(forecast["dt"]).strftime('%H'))
        if day == "Saturday" or day == "Sunday":
            is_weekday.append(0)
        else:
            is_weekday.append(1)
        main = forecast["main"]
        temperature.append(main["temp"])
        humidity.append(main["humidity"])
        pressure.append(main["pressure"])
    return [times, is_weekday, hour, temperature, humidity, pressure]
    
def clean_datapoint(weather):
    day = weather["time"].strftime('%A')
    time = weather["time"].strftime('%A %H:%M')
    hour = weather["time"].strftime('%H')
    is_weekday = 1
    if day == "Saturday" or day == "Sunday":
        is_weekday = (0)
    return [time, is_weekday, hour, weather["temperature"], weather["humidity"], weather["pressure"]]