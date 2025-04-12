#use v3 API
import json as js
import os
from dotenv import load_dotenv
import requests


# load .env
load_dotenv()

import random

api_keys = [
    os.getenv("API_KEY_1"),
    os.getenv("API_KEY_2"),
    os.getenv("API_KEY_3")
]

# random API Key
api_key = random.choice(api_keys)
url = f"https://api.jcdecaux.com/vls/v3/stations?contract=dublin&apiKey={api_key}"

#test
print(api_key)
response = requests.get(url)
print(response.json())


if response.status_code == 200:
    station_data = response.json()
    
    bike_list = []
    for station in station_data:
        station_info = {
            "number": station["number"],
            "name": station["name"],
            "address": station["address"],
            "status": station["status"],  #open or closed
            "totalStands": {
                "availabilities": {
                    "bikes": station["totalStands"]["availabilities"]["bikes"],
                    "stands": station["totalStands"]["availabilities"]["stands"]
                },
                "capacity": station["totalStands"]["capacity"]
            },
            "lastUpdate": station["lastUpdate"],
            # "mechanical": station["totalStands"]["availabilities"]["mechanicalBikes"],
            # "electrical_bikes": station["totalStands"]["availabilities"]["electricalBikes"],
            
        }
        bike_list.append(station_info)
        
    # Convert to JSON format
    with open("bike.json","w", encoding="utf=8") as f:
        js.dump(bike_list, f, indent=4)
    print("bike data saved to bike.json")
else:
    print(f"Error fetching data: {response.status_code}")