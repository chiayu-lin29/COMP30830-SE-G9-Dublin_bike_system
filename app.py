from flask import Flask, render_template, jsonify, request
import mysql.connector
from db.db_connection import get_db_connection
from ML.model_predict import bikes_predict
app = Flask(__name__)

@app.route('/')
def show_map():
    stations = get_stations()
    weather = get_current_weather()
    return render_template('map.html', stations = stations, weather=weather)

@app.route('/weather', methods=["GET"])
def get_weather():
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM weather")
    res = cursor.fetchall()
    cursor.close()
    conn.close()
    print(res)
    return jsonify({"weather": res})

@app.route("/currWeather", methods=["GET"])
def get_current_weather():
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM weather ORDER BY time DESC LIMIT 1")
    res = cursor.fetchone()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    weather_data = dict(zip(columns, res))
    cursor.close()
    conn.close()
    print(res)

    return jsonify({"weather": weather_data})

@app.route('/stations')
def get_stations():
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM bikes")
    res = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    res = [dict(zip(columns, row)) for row in res]
    cursor.close()
    conn.close()
    return jsonify({"stations":res})

@app.route('/search_suggestions', methods=['GET'])
def search_suggestions():
    query = request.args.get('query', '')
    if len(query) >= 3:
        conn, cursor = get_db_connection()
        cursor.execute("SELECT * FROM bikes WHERE name LIKE %s", (f"{query}%",))
        res = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]  # Get column names
        res = [dict(zip(columns, row)) for row in res]

        cursor.close()
        conn.close()
        return jsonify({"stations":res})
    return jsonify({'suggestions': []})

# @app.route('/bike_predict', methods=['GET'])
# def bike_predict():
#     station_id = request.args.get("station_id")
#     times, predictions = bikes_predict(station_id)
#     print(times)
#     return jsonify({'times': times, 'predictions': predictions})

@app.route('/bike_predict', methods=['GET', 'POST'])
def bike_predict():
    if request.method == 'POST':
        station_id = request.get_json().get("station_number")
    else:
        station_id = request.args.get("station_id")

    times, predictions = bikes_predict(station_id)
    print(times)
    return jsonify({'times': times, 'predictions': predictions})



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5500, debug=True)