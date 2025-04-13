import dbinfo
import requests
import json
import sqlalchemy as sqla
from sqlalchemy import create_engine
import traceback
import glob
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

connection_string = "mysql+pymysql://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB)

engine = create_engine(connection_string, echo=True)

# Use raw connection to execute CREATE DATABASE
conn = engine.raw_connection()
try:
    # Create the database if it doesn't exist
    conn.cursor().execute(f"CREATE DATABASE IF NOT EXISTS {DB};")
    print(f"Database {DB} created or already exists.")
except Exception as e:
    print(f"Error creating database: {e}")
finally:
    # Close the raw connection manually after execution
    conn.close()

# Now that the database is created, we can create the table
sql = '''
CREATE TABLE IF NOT EXISTS weather (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Time of data retrieval
    temperature_celsius FLOAT NOT NULL,  -- Temperature in Celsius
    feels_like_celsius FLOAT NOT NULL,  -- Feels-like temperature in Celsius
    temp_min_celsius FLOAT NOT NULL,  -- Minimum temperature in Celsius
    temp_max_celsius FLOAT NOT NULL,  -- Maximum temperature in Celsius
    humidity INT NOT NULL,  -- Humidity in %
    pressure INT NOT NULL,  -- Atmospheric pressure in hPa
    wind_speed FLOAT NOT NULL,  -- Wind speed in m/s
    wind_direction INT NOT NULL,  -- Wind direction in degrees
    cloudiness INT NOT NULL,  -- Cloudiness in %
    visibility INT NOT NULL,  -- Visibility in meters
    weather_description VARCHAR(255) NOT NULL,  -- Weather condition description (e.g., "overcast clouds")
    city VARCHAR(100) NOT NULL DEFAULT 'Dublin'  -- City name (for multi-city support in the future)
);
CREATE TABLE IF NOT EXISTS locations (
    
)
'''

# Execute the CREATE TABLE statement using the engine's connection
with engine.connect() as conn:
    try:
        conn.execute(sql)  # Use engine's connection to execute the raw SQL
        print("Weather table created successfully or already exists.")
    except Exception as e:
        print(f"Error creating table: {e}")

    # Get the structure of the 'weather' table
    tab_structure = conn.execute("SHOW COLUMNS FROM weather;")

    # Fetch and pretty-print the column details
    columns = tab_structure.fetchall()
    pprint(columns)  # This will display the table structure for verification
