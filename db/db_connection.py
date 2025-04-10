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
# MYSQL_HOST = "16.16.13.59"
# MYSQL_PORT = 3306
# MYSQL_USER = "root"
# MYSQL_PASSWORD = "2025!Group9"
# MYSQL_DB = "dbbikes"


import mysql.connector
def get_db_connection():
    """Returns a MySQL connection object and cursor."""
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="2025!Group9",
        database="dbbikes"
    )
    cursor = conn.cursor()
    return conn, cursor