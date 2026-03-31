import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
from pathlib import Path

class DiseasePredictor:
    def __init__(self):
        self.model = None
        self.all_symptoms = []

    def load_and_preprocess_data(self, csv_path):
        print("Loading dataset...")

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(BASE_DIR, csv_path)

        print("Reading from:", full_path)

        df = pd.read_csv(full_path)

        # Clean column names
        df.columns = df.columns.str.strip().str.lower()

        # Identify symptom columns
        symptom_cols = [col for col in df.columns if col.startswith("symptom")]

        if len(symptom_cols) == 0:
            raise Exception("No symptom columns found!")

        print("Symptom columns:", symptom_cols)

        # Collect all unique symptoms
        all_symptoms = set()
        for col in symptom_cols:
            all_symptoms.update(df[col].dropna().unique())

        self.all_symptoms = sorted(list(all_symptoms))

        print("Total unique symptoms:", len(self.all_symptoms))

        X = []
        y = []

        for _, row in df.iterrows():
            feature_vector = [0] * len(self.all_symptoms)

            for col in symptom_cols:
                symptom = row[col]
                if pd.notna(symptom):
                    if symptom in self.all_symptoms:
                        idx = self.all_symptoms.index(symptom)
                        feature_vector[idx] = 1

            X.append(feature_vector)
            y.append(row['disease'])

        return np.array(X), np.array(y)

    def train_model(self, X, y):
        print("\nTraining model...")

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X_train, y_train)

        acc = self.model.score(X_test, y_test)
        print("Accuracy:", acc)

    def save_model(self):
        Path("models").mkdir(exist_ok=True)

        with open("models/model.pkl", "wb") as f:
            pickle.dump(self.model, f)

        print("Model saved in models/")

def main():
    print("=" * 50)
    print("SmartHealth AI Training")
    print("=" * 50)

    predictor = DiseasePredictor()

    X, y = predictor.load_and_preprocess_data(
        "datasets/disease_symptom_dataset.csv"
    )

    predictor.train_model(X, y)

    predictor.save_model()

    print("\n✅ DONE SUCCESSFULLY")

if __name__ == "__main__":
    main()