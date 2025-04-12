import mysql.connector
import pymysql
import time
import requests
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.sql import text
import SQLpw
import dbinfo
from dotenv import load_dotenv


load_dotenv()


USER = SQLpw.USER
PASSWORD = SQLpw.PASSWORD
PORT = int(SQLpw.PORT)
DB = SQLpw.DB
URI = SQLpw.URI

try:
    conn = mysql.connector.connect(
        host=URI,
        user=USER,
        password=PASSWORD,
        port=PORT,
        database=DB
    )
    print("Successfullly connect mySQL on EC2")
except Exception as e:
    print(f"Error in connecting database: {e}")


connection_string = f"mysql+pymysql://{USER}:{PASSWORD}@{URI}:{PORT}/{DB}"
engine = create_engine(connection_string, echo=True, execution_options={"autocommit": True})


def update_bike_data():
    print(f"catching API: {dbinfo.url}")

    response = requests.get(dbinfo.url)
    if response.status_code != 200:
        print(f"API response failed: {response.status_code}")
        return

    station_data = response.json()
    if not station_data:
        print("API no data")
        return

    with engine.begin() as connection:
        for station in station_data:
            number = station.get("number")
            contract_name = station.get("contractName", "Unknown")
            name = station.get("name")
            address = station.get("address", "N/A")
            status = station.get("status", "CLOSED")
            bikes = station.get("totalStands", {}).get("availabilities", {}).get("bikes", 0) or 0
            mechanical_bikes = station.get("totalStands", {}).get("availabilities", {}).get("mechanicalBikes", 0) or 0
            electrical_bikes = station.get("totalStands", {}).get("availabilities", {}).get("electricalBikes", 0) or 0
            electrical_internal_battery = station.get("totalStands", {}).get("availabilities", {}).get("electricalInternalBatteryBikes", 0) or 0
            electrical_removable_battery = station.get("totalStands", {}).get("availabilities", {}).get("electricalRemovableBatteryBikes", 0) or 0
            charging_stations = station.get("totalStands", {}).get("availabilities", {}).get("chargingStations", 0) or 0
            stands = station.get("totalStands", {}).get("availabilities", {}).get("stands", 0) or 0
            capacity = station.get("totalStands", {}).get("capacity", 0) or 0
            latitude = station.get("position", {}).get("latitude", None)
            longitude = station.get("position", {}).get("longitude", None)


            raw_api_time = station.get("lastUpdate", None)
            try:
                api_last_update = datetime.strptime(raw_api_time, "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d %H:%M:%S") if raw_api_time else None
            except Exception as e:
                print(f"Time format error: {e}")
                api_last_update = None

            recorded_at = time.strftime("%Y-%m-%d %H:%M:%S")

            # SQL
            sql_insert = """
            INSERT INTO bike_station_records (
                number, contract_name, name, address, status, bikes, mechanical_bikes, electrical_bikes, 
                electrical_internal_battery, electrical_removable_battery, charging_stations, stands, 
                capacity, latitude, longitude, api_last_update, recorded_at
            ) VALUES (
                :number, :contract_name, :name, :address, :status, :bikes, :mechanical_bikes, :electrical_bikes, 
                :electrical_internal_battery, :electrical_removable_battery, :charging_stations, :stands, 
                :capacity, :latitude, :longitude, :api_last_update, :recorded_at
            )
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                bikes = VALUES(bikes),
                mechanical_bikes = VALUES(mechanical_bikes),
                electrical_bikes = VALUES(electrical_bikes),
                electrical_internal_battery = VALUES(electrical_internal_battery),
                electrical_removable_battery = VALUES(electrical_removable_battery),
                charging_stations = VALUES(charging_stations),
                stands = VALUES(stands),
                capacity = VALUES(capacity),
                latitude = VALUES(latitude),
                longitude = VALUES(longitude),
                api_last_update = VALUES(api_last_update),
                recorded_at = VALUES(recorded_at);
            """

            connection.execute(text(sql_insert), {
                "number": number,
                "contract_name": contract_name,
                "name": name,
                "address": address,
                "status": status,
                "bikes": bikes,
                "mechanical_bikes": mechanical_bikes,
                "electrical_bikes": electrical_bikes,
                "electrical_internal_battery": electrical_internal_battery,
                "electrical_removable_battery": electrical_removable_battery,
                "charging_stations": charging_stations,
                "stands": stands,
                "capacity": capacity,
                "latitude": latitude,
                "longitude": longitude,
                "api_last_update": api_last_update,
                "recorded_at": recorded_at
            })

    print(f"Successfully update {len(station_data)} station data")


if __name__ == "__main__":
    while True:
        try:
            update_bike_data()
            print("wait for 15 mins...")
        except Exception as e:
            print(f"error：{e}，retry in one minute")
            time.sleep(60)
            continue
        time.sleep(900)
