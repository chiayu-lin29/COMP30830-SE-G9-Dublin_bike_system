import mysql.connector

def get_db_connection():
    """Returns a MySQL connection object and cursor."""
    conn = mysql.connector.connect(
        host="localhost",  # e.g., "localhost"
        user="root",
        password="2025!Group9",
        database="SWE"
        )
    cursor = conn.cursor()
    return conn, cursor
