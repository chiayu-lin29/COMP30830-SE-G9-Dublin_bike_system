import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Returns a MySQL connection object and cursor."""
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    cursor = conn.cursor()
    return conn, cursor