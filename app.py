from flask import Flask, render_template, jsonify, request
import mysql.connector
from db.db_connection import get_db_connection
app = Flask(__name__)

@app.route('/')
def show_map():
    stations = get_stations()
    return render_template('map.html', stations = stations)

@app.route('/weather', methods=["GET"])
def get_weather():
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM weather")
    res = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(res)

@app.route('/stations')
def get_stations():
    conn, cursor = get_db_connection()

    cursor.execute("SELECT * FROM bike_stations")
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
        cursor.execute("SELECT * FROM bike_stations WHERE name LIKE %s", (f"{query}%",))
        res = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]  # Get column names
        res = [dict(zip(columns, row)) for row in res]

        cursor.close()
        conn.close()
        return jsonify({"stations":res})
    return jsonify({'suggestions': []})



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5500, debug=True)