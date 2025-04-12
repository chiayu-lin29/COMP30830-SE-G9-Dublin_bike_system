# Test for a successful connection to the database
# test_db_connection.py
import unittest
from db.SQLpw import USER, PASSWORD, PORT, DB, URI
import mysql.connector

class TestDBConnection(unittest.TestCase):
    def test_connection(self):
        try:
            conn = mysql.connector.connect(
                host=URI,
                user=USER,
                password=PASSWORD,
                port=int(PORT),
                database=DB
            )
            conn.close()
            result = True
        except Exception as e:
            print(f"Connection failed: {e}")
            result = False
        self.assertTrue(result)

if __name__ == "__main__":
    unittest.main()
