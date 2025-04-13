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

def check_existing_data(conn, station):
    """Check if a station already exists in the database."""
    query = text("SELECT 1 FROM locations WHERE station = :station LIMIT 1;")
    result = conn.execute(query, {"station": station}).fetchone()
    return result is not None  # Fix: Return `True` if record exists, `False` otherwise

def insert_location_data(json_data, engine):
    """Inserts location data into the MySQL database."""
    with engine.connect() as conn:
        for entry in json_data:
            try:
                station = entry["station"]
                latitude = entry["lat"]
                longitude = entry["lng"]

                # Check if the data already exists
                if check_existing_data(conn, station):
                    print(f"Data for {station} already exists. Skipping insertion.")
                    continue 

                # Insert query
                query = text("""
                INSERT INTO locations (station, latitude, longitude) 
                VALUES (:station, :latitude, :longitude);
                """)
                
                conn.execute(query, {"station": station, "latitude": latitude, "longitude": longitude})
                conn.commit()  
                print(f"Inserted weather data for {station}")

            except Exception as e:
                print(f"Error inserting data: {e}")

def main():
    folder_path = "/Users/elliekavanagh/COMP30830/locations"  # Updated path
    json_data = load_json_data(folder_path)
    
    if json_data:
        insert_location_data(json_data, engine)
    else:
        print("No valid JSON data found!")

if __name__ == "__main__":
    main()