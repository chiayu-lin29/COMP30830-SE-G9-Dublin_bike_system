#test if model is successful call
import unittest
from ML.model_predict import bikes_predict

class TestModel(unittest.TestCase):
    def test_prediction_output(self):
        times, preds = bikes_predict(42)
        self.assertEqual(len(times), len(preds))
        self.assertTrue(all(isinstance(p, int) for p in preds))

if __name__ == "__main__":
    unittest.main()
