#test flask router including intergration
import unittest
from app import app

class TestFlaskRoutes(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_homepage(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)

    def test_weather(self):
        res = self.client.get("/weather")
        self.assertEqual(res.status_code, 200)
        self.assertIn("weather", res.get_json())

    def test_predict(self):
        res = self.client.get("/bike_predict?station_id=42")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("times", data)
        self.assertIn("predictions", data)

if __name__ == '__main__':
    unittest.main()
