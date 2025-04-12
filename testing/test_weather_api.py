#test OpenWeather API + feature preprocessing

import unittest
from get_weather_info import get_features

class TestWeatherFeature(unittest.TestCase):
    def test_feature_shape(self):
        features = get_features()
        self.assertEqual(len(features), 6)
        self.assertTrue(all(len(col) > 0 for col in features))

if __name__ == "__main__":
    unittest.main()
