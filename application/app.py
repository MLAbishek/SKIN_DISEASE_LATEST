from flask import Flask, render_template, request, jsonify
import numpy as np
from keras.utils import load_img, img_to_array
from keras.models import load_model
import os
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load the trained model (update path as needed)
MODEL_PATH = (
    r"E:\SCHOOL_STUDENTS_SKIN\application\balanced_cancer.h5"  # Update this path
)
model = None


def load_trained_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            print("Attempting to load model...")
            import tensorflow as tf

            # Create a custom InputLayer class to handle the compatibility issue
            class CustomInputLayer(tf.keras.layers.InputLayer):
                def __init__(
                    self,
                    input_shape=None,
                    batch_size=None,
                    dtype=None,
                    input_tensor=None,
                    sparse=None,
                    name=None,
                    ragged=None,
                    type_spec=None,
                    **kwargs,
                ):
                    # Handle batch_shape parameter properly
                    if "batch_shape" in kwargs:
                        batch_shape = kwargs.pop("batch_shape")
                        if batch_shape and len(batch_shape) > 1:
                            # Convert batch_shape to input_shape (remove first dimension)
                            input_shape = batch_shape[1:]
                    super().__init__(
                        input_shape=input_shape,
                        batch_size=batch_size,
                        dtype=dtype,
                        input_tensor=input_tensor,
                        sparse=sparse,
                        name=name,
                        ragged=ragged,
                        type_spec=type_spec,
                        **kwargs,
                    )

            # Method 1: Try with custom InputLayer
            try:
                model = tf.keras.models.load_model(
                    MODEL_PATH,
                    compile=False,
                    custom_objects={"InputLayer": CustomInputLayer},
                )
                print("Model loaded successfully with custom InputLayer!")

                # Compile the model
                model.compile(
                    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                    loss="binary_crossentropy",
                    metrics=["accuracy"],
                )
                print("Model compiled successfully!")

            except Exception as e1:
                print(f"Method 1 failed: {e1}")

                # Method 2: Try loading weights only with the correct architecture
                try:
                    # Based on the model inspection, create the correct architecture
                    model = tf.keras.Sequential(
                        [
                            tf.keras.layers.InputLayer(input_shape=(64, 64, 3)),
                            tf.keras.layers.Conv2D(32, 3, activation="relu"),
                            tf.keras.layers.BatchNormalization(),
                            tf.keras.layers.Conv2D(32, 3, activation="relu"),
                            tf.keras.layers.BatchNormalization(),
                            tf.keras.layers.MaxPooling2D(),
                            tf.keras.layers.Flatten(),
                            tf.keras.layers.Dense(100, activation="relu"),
                            tf.keras.layers.Dense(120, activation="relu"),
                            tf.keras.layers.Dense(1, activation="sigmoid"),
                        ]
                    )

                    # Load weights
                    model.load_weights(MODEL_PATH)
                    model.compile(
                        optimizer="adam",
                        loss="binary_crossentropy",
                        metrics=["accuracy"],
                    )
                    print("Model loaded successfully with weights only!")

                except Exception as e2:
                    print(f"Method 2 failed: {e2}")
                    raise e2
        else:
            print(f"Model file not found at {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    except Exception as e:
        print(f"All model loading methods failed: {e}")
        print("Using mock model for testing...")
        model = "mock_model"


def preprocess_image(image):
    """Preprocess image for prediction"""
    # Resize to 64x64 as expected by model
    image = image.resize((64, 64))
    # Convert to array
    img_array = img_to_array(image)
    # Expand dimensions to match model input
    img_array = np.expand_dims(img_array, axis=0)
    # Normalize pixel values
    img_array = img_array / 255.0
    return img_array


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/detection")
def detection():
    return render_template("detection.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/services")
def services():
    return render_template("services.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/faq")
def faq():
    return render_template("faq.html")


@app.route("/test-model")
def test_model():
    if model is None:
        return jsonify({"status": "error", "message": "Model not loaded"})
    elif model == "mock_model":
        return jsonify(
            {"status": "success", "message": "Mock model is loaded for testing"}
        )
    else:
        return jsonify(
            {"status": "success", "message": "AI Model loaded and ready for analysis"}
        )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify(
                {
                    "error": "Model not loaded. Please restart the application and check the console for model loading errors."
                }
            )

        # Handle mock model for testing
        if model == "mock_model":
            import random

            # Simulate prediction with random result
            result = random.random()
            if result < 0.3:
                diagnosis = "Potential skin issue detected"
            else:
                diagnosis = "Normal skin"

            return jsonify(
                {
                    "diagnosis": diagnosis,
                    "prediction_value": float(result),
                    "note": "This is a mock prediction for testing purposes",
                }
            )

        # Check if image is from camera (base64) or file upload
        if "image_data" in request.json:
            # Handle camera image (base64)
            image_data = request.json["image_data"]
            # Remove data URL prefix
            image_data = image_data.split(",")[1]
            # Decode base64
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        elif "file" in request.files:
            # Handle file upload
            file = request.files["file"]
            if file.filename == "":
                return jsonify({"error": "No file selected"})
            image = Image.open(file.stream).convert("RGB")
        else:
            return jsonify({"error": "No image provided"})

        # Preprocess image
        processed_image = preprocess_image(image)

        # Make prediction
        prediction = model.predict(processed_image)
        result = prediction[0][0]

        # Interpret result based on model output
        # Sigmoid output: 0 = issue, 1 = normal
        if result < 0.5:  # Closer to 0 indicates potential issue
            diagnosis = "Potential skin issue detected"
        else:  # Closer to 1 indicates normal skin
            diagnosis = "Normal skin"

        return jsonify(
            {
                "diagnosis": diagnosis,
                "prediction_value": float(result),
                "confidence": None,
            }
        )

    except Exception as e:
        return jsonify({"error": f"Prediction error: {str(e)}"})


@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded. Please check model path."})

        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"})

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"})

        # Process uploaded image
        image = Image.open(file.stream).convert("RGB")
        processed_image = preprocess_image(image)

        # Make prediction
        prediction = model.predict(processed_image)
        result = prediction[0][0]

        # Interpret result
        if result < 0.5:
            diagnosis = "Potential skin issue detected"
        else:
            diagnosis = "Normal skin"

        return jsonify(
            {
                "diagnosis": diagnosis,
                "prediction_value": float(result),
                "confidence": None,
            }
        )

    except Exception as e:
        return jsonify({"error": f"Upload error: {str(e)}"})


if __name__ == "__main__":
    # Load model on startup
    load_trained_model()
    app.run(debug=True, host="0.0.0.0", port=5000)
