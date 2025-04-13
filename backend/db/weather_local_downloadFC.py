import requests
import traceback
import datetime
import time
import os
import dbinfo
import json

# Will be used to store text in a single file
def write_to_file(all_weather_data):
    weather_data_dir = "/Users/elliekavanagh/COMP30830/weatherdata"
    if not os.path.exists('weather_data_dir'):
        os.mkdir('weather_data_dir')
        print("Folder 'weatherdata' created!")
    else:
        print("Folder 'weatherdata' already exists.")
    
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use the timestamp as the filename to keep track of when the data was written
    filename = f"weatherdata/weather_data_{timestamp.replace(' ', '_').replace(':', '-')}.json"
    
    with open(filename, "w") as f:
        json.dump(all_weather_data, f, indent=4)
        print(f"Data written to file: {filename}")

def main():
        all_weather_data = []  # List to accumulate all weather data
        
        try:
            for location in dbinfo.locations:  # Loop through each location
                lat, lng = location.get("lat"), location.get("lng")

                if lat is None or lng is None:
                    print(f"Skipping location {location.get('station', 'unknown')}: Missing lat/lng")
                    continue

                params = {
                    "apiKey": dbinfo.WeatherKey,
                    "lat": lat,
                    "lon": lng   # Ensure correct API parameters
                }

                Weather_URI = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={params['apiKey']}&units=metric"
                r = requests.get(Weather_URI, params=params)
                print(f"Fetching weather data for {location['station']} ({lat}, {lng}): {r.status_code}")

                if r.status_code == 200:
                    # Add weather data to the list
                    weather_data = {
                        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "location": location,
                        "data": r.json()  # Parse the JSON response directly
                    }
                    all_weather_data.append(weather_data)
                else:
                    print(f"Failed to fetch data for {location['station']}: {r.status_code}")

            # Write all weather data to a single file
            write_to_file(all_weather_data)

        
        except Exception as e:
            print(f"Error: {traceback.format_exc()}")

# CTRL + Z to stop it
main()
