"""
This module serves as the main Flask application for the bike sharing prediction service.

Routes:
- '/': Main map view with current weather and stations.
- '/weather': Returns all historical weather data.
- '/currWeather': Returns the most recent weather entry.
- '/stations': Returns all bike station data.
- '/search_suggestions': Returns bike stations that match a search query.
- '/closest_time_pred': Predicts bike availability at a specific time and station.
- '/bike_predict': Predicts bike availability over time for a given station.
"""

from flask import Flask, render_template, jsonify, request
import os
from typing import List, Dict, Any, Optional, Tuple
import mysql.connector
from db.db_connection import get_db_connection
from ML.model_predict import bikes_predict, predict_one
from datetime import datetime

app = Flask(__name__)

GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")


@app.route('/')
def show_map() -> str:
    """
    Render the main map page with station and current weather data.
    """
    stations = get_stations().json['stations']
    weather = get_current_weather().json['weather']
    return render_template('map.html', stations=stations, weather=weather, api_key=GOOGLE_MAPS_API_KEY)


@app.route('/weather', methods=["GET"])
def get_weather() -> Any:
    """
    Get all historical weather data from the database.
    """
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM weather")
    res = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify({"weather": res})


@app.route("/currWeather", methods=["GET"])
def get_current_weather() -> Any:
    """
    Get the most recent weather record.
    """
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM weather ORDER BY time DESC LIMIT 1")
    res = cursor.fetchone()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    weather_data = dict(zip(columns, res))

    cursor.close()
    conn.close()

    return jsonify({"weather": weather_data})


@app.route('/stations')
def get_stations() -> Any:
    """
    Get all bike stations and return them as a JSON response.
    """
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM bikes")
    res = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    stations = [dict(zip(columns, row)) for row in res]

    cursor.close()
    conn.close()
    return jsonify({"stations": stations})


@app.route('/search_suggestions', methods=['GET'])
def search_suggestions() -> Any:
    """
    Provide search suggestions for stations matching the query string.
    """
    query: str = request.args.get('query', '')

    if len(query) >= 3:
        conn, cursor = get_db_connection()
        cursor.execute("SELECT * FROM bikes WHERE name LIKE %s", (f"{query}%",))
        res = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        results = [dict(zip(columns, row)) for row in res]

        cursor.close()
        conn.close()
        return jsonify({"stations": results})

    return jsonify({'suggestions': []})


@app.route('/closest_time_pred', methods=['GET'])
def closest_time_pred() -> Any:
    """
    Predict bike availability for a specific station at the closest time
    matching the selected time based on weather data.
    """
    station_id: str = request.args.get("station_id")
    selected_time: str = request.args.get("selected_time")

    conn, cursor = get_db_connection()
    query = """
    SELECT * FROM weather
    ORDER BY ABS(TIMESTAMPDIFF(SECOND, time, %s))
    LIMIT 1;
    """
    cursor.execute(query, (selected_time,))
    res = cursor.fetchone()
    columns = [desc[0] for desc in cursor.description]
    weather_data = dict(zip(columns, res))

    cursor.close()
    conn.close()

    time, prediction = predict_one(station_id, weather_data)
    return jsonify({'times': time, 'predictions': prediction})


@app.route('/bike_predict', methods=['GET'])
def bike_predict() -> Any:
    """
    Predict bike availability for a station across future time intervals.
    """
    station_id: str = request.args.get("station_id")
    times, predictions = bikes_predict(station_id)
    return jsonify({'times': times, 'predictions': predictions})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5500, debug=True)

