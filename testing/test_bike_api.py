#test successful called bike api
import unittest
from app import app

class TestBikeEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_get_stations(self):
        """test /stations whether the data was successfully returned"""
        res = self.client.get("/stations")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("stations", data)
        self.assertIsInstance(data["stations"], list)
        if data["stations"]:  #if data, check format
            self.assertIn("number", data["stations"][0])
            self.assertIn("latitude", data["stations"][0])

    def test_search_suggestions(self):
        """Test /search_suggestions to search for sites"""
        res = self.client.get("/search_suggestions?query=SMITH")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("stations", data)
        self.assertIsInstance(data["stations"], list)

    def test_bike_prediction(self):
        """Test if the /bike_predict API returns predictions properly"""
        res = self.client.get("/bike_predict?station_id=42")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("times", data)
        self.assertIn("predictions", data)
        self.assertEqual(len(data["times"]), len(data["predictions"]))

if __name__ == '__main__':
    unittest.main()
