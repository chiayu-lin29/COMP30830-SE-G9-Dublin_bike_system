# import mysql.connector

# def get_db_connection():
#     """Returns a MySQL connection object and cursor."""
#     conn = mysql.connector.connect(
#         host="localhost",  # e.g., "localhost"
#         user="root",
#         password="password",
#         database="SWE"
#     )
#     cursor = conn.cursor()
#     return conn, cursor


# MySQL
# MYSQL_HOST = "127.0.0.1"
# MYSQL_PORT = 3306
# MYSQL_USER = "root"
# MYSQL_PASSWORD = "2025!Group9"
# MYSQL_DB = "dbbikes"


# import mysql.connector
# def get_db_connection():
#     """Returns a MySQL connection object and cursor."""
#     conn = mysql.connector.connect(
#         host="13.60.186.246",
#         user="root",
#         password="2025!Group9",
#         database="dbbikes"
#     )
#     cursor = conn.cursor()
#     return conn, cursor

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
