import dbinfo
import requests
import json
import sqlalchemy as sqla
from sqlalchemy import create_engine, text  # Import text() for SQL execution
import traceback
import os
from pprint import pprint
import simplejson as json
import time
from IPython.display import display

# Database credentials
host=URI
user=USER
password=PASSWORD
port=PORT
database=DB

# Connection string
connection_string = f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DB}"

# Create SQLAlchemy engine
engine = create_engine(connection_string, echo=True)

# Use raw connection to execute CREATE DATABASE
conn = engine.raw_connection()
try:
    conn.cursor().execute(f"CREATE DATABASE IF NOT EXISTS {DB};")
    print(f"Database {DB} created or already exists.")
except Exception as e:
    print(f"Error creating database: {e}")
finally:
    conn.close()

# Define SQL statements properly formatted
create_locations_table = text('''
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station VARCHAR(255) UNIQUE NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL
);
''')

create_weather_forecast_table = text('''
CREATE TABLE IF NOT EXISTS weather_forecast (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT,
    forecast_time DATETIME NOT NULL,
    temperature_celsius FLOAT NOT NULL,  
    feels_like_celsius FLOAT NOT NULL,  
    temp_min_celsius FLOAT NOT NULL,  
    temp_max_celsius FLOAT NOT NULL,  
    humidity INT NOT NULL,  
    pressure INT NOT NULL,  
    wind_speed FLOAT NOT NULL,  
    wind_direction INT NOT NULL,  
    cloudiness INT NOT NULL,  
    visibility INT NOT NULL,  
    weather_description VARCHAR(255) NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);
''')

# Execute the CREATE TABLE statements
with engine.connect() as conn:
    try:
        conn.execute(create_locations_table)
        print("Locations table created successfully or already exists.")

        conn.execute(create_weather_forecast_table)
        print("Weather Forecast table created successfully or already exists.")

    except Exception as e:
        print(f"Error creating tables: {e}")

    # Verify the structure of the tables
    print("\nTable structure for 'locations':")
    pprint(conn.execute(text("SHOW COLUMNS FROM locations;")).fetchall())

    print("\nTable structure for 'weather_forecast':")
    pprint(conn.execute(text("SHOW COLUMNS FROM weather_forecast;")).fetchall())
