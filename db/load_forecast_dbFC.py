from sqlalchemy import create_engine, text
import pymysql
import os
import json

# Database credentials
host="localhost"
user="root"
password="2025!Group9"
database="dbbikes"

# Create database connection
connection_string = f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DB}"
engine = create_engine(connection_string, echo=True)

def load_json_data(folder_path):
    """Reads JSON files from the specified folder and returns a list of dictionaries."""
    json_data = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                try:
                    data = json.load(file)
                    json_data.extend(data)  # Append list items if JSON contains multiple entries
                except json.JSONDecodeError as e:
                    print(f"Error decoding {filename}: {e}")
    return json_data

def get_location_id(conn, station):
    """Get the location_id from the locations table based on the station."""
    query = text("""
        SELECT id FROM locations 
        WHERE station = :station
        LIMIT 1;
    """)
    result = conn.execute(query, {"station": station}).fetchone()
    return result[0] if result else None

def check_existing_forecast(conn, location_id, forecast_time):
    """Check if a forecast already exists in the database for the given location_id and forecast_time."""
    query = text("""
        SELECT 1 FROM weather_forecast 
        WHERE location_id = :location_id AND forecast_time = :forecast_time
        LIMIT 1;
    """)
    result = conn.execute(query, {"location_id": location_id, "forecast_time": forecast_time}).fetchone()
    return result is not None  

def insert_forecast_data(json_data, engine):
    """Inserts forecast data into the weather_forecast table."""
    with engine.connect() as conn:
        # Start a transaction block
        with conn.begin():  # This ensures that the transaction is committed or rolled back properly
            for entry in json_data:
                try:
                    station = entry["location"]["station"]
                    latitude = entry["location"]["lat"]
                    longitude = entry["location"]["lng"]
                    
                    if station and latitude and longitude:
                        print(f"Successfully accessed station, latitude, and longitude from JSON")
                        print(f"Station:", station, " Latitude:", latitude, " Longitude:", longitude)
                    
                    forecast_list = entry["data"]["list"]
                    
                    # If forecast_list is empty, continue to next entry
                    if not forecast_list:
                        print(f"No forecast data found for {station}. Skipping entry.")
                        continue

                    # Get location_id from locations table
                    location_id = get_location_id(conn, station)
                    if not location_id:
                        print(f"Location for {station} not found. Skipping forecast insertion.")
                        continue

                    for forecast in forecast_list:
                        forecast_time = forecast["dt_txt"]
                        if not forecast_time:
                            print(f"Forecast time not found")
                            continue
                        temperature = forecast["main"]["temp"]
                        feels_like = forecast["main"]["feels_like"]
                        temp_min = forecast["main"]["temp_min"]
                        temp_max = forecast["main"]["temp_max"]
                        humidity = forecast["main"]["humidity"]
                        pressure = forecast["main"]["pressure"]
                        wind_speed = forecast["wind"]["speed"]
                        wind_direction = forecast["wind"]["deg"]
                        cloudiness = forecast["clouds"]["all"]
                        visibility = forecast["visibility"]
                        weather_description = forecast["weather"][0]["description"]

                        # Check if the forecast already exists for this location_id and forecast_time
                        if check_existing_forecast(conn, location_id, forecast_time):
                            print(f"Forecast for {station} at {forecast_time} already exists. Skipping insertion.")
                            continue 

                        # Insert query for forecast data
                        query = text("""
                        INSERT INTO weather_forecast (location_id, forecast_time, temperature_celsius, feels_like_celsius, 
                            temp_min_celsius, temp_max_celsius, humidity, pressure, wind_speed, wind_direction, 
                            cloudiness, visibility, weather_description) 
                        VALUES (:location_id, :forecast_time, :temperature, :feels_like, :temp_min, :temp_max, :humidity, 
                            :pressure, :wind_speed, :wind_direction, :cloudiness, :visibility, :weather_description);
                        """)
                        
                        conn.execute(query, {
                            "location_id": location_id, 
                            "forecast_time": forecast_time,
                            "temperature": temperature, 
                            "feels_like": feels_like, 
                            "temp_min": temp_min, 
                            "temp_max": temp_max, 
                            "humidity": humidity, 
                            "pressure": pressure,
                            "wind_speed": wind_speed, 
                            "wind_direction": wind_direction, 
                            "cloudiness": cloudiness, 
                            "visibility": visibility, 
                            "weather_description": weather_description
                        })

                    print(f"Processed forecast data for {station}")

                except Exception as e:
                    print(f"Error inserting data: {e}")
                    conn.rollback()  # Explicitly rollback the transaction in case of an error

def main():
    folder_path = "/Users/elliekavanagh/COMP30830/weather_forecast"  # Updated path
    json_data = load_json_data(folder_path)
    
    if json_data:
        insert_forecast_data(json_data, engine)
    else:
        print("No valid JSON data found!")

if __name__ == "__main__":
    main()
