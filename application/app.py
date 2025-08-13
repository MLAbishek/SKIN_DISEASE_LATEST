from flask import Flask, render_template, request, jsonify
import numpy as np
from keras.utils import load_img, img_to_array
from keras.models import load_model
import os
from PIL import Image
import io
import base64
import tensorflow as tf

app = Flask(__name__)

# Load the trained model - use relative path for deployment
MODEL_PATH = os.path.join(os.path.dirname(__file__), "balanced_cancer.h5")
model = None


def load_trained_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            print("Loading your original model...")

            # Try loading with suppress_warnings to handle compatibility issues
            import warnings

            with warnings.catch_warnings():
                warnings.simplefilter("ignore")

                # Method 1: Try direct loading first
                try:
                    model = load_model(MODEL_PATH, compile=False)
                    print("Model loaded directly!")
                except Exception as e1:
                    print(f"Direct loading failed: {e1}")

                    # Method 2: Try with custom objects for InputLayer
                    class CustomInputLayer(tf.keras.layers.InputLayer):
                        def __init__(self, **kwargs):
                            # Handle batch_shape properly
                            if "batch_shape" in kwargs:
                                batch_shape = kwargs.pop("batch_shape")
                                if batch_shape and len(batch_shape) > 1:
                                    # Convert batch_shape to input_shape
                                    kwargs["input_shape"] = batch_shape[1:]
                            super().__init__(**kwargs)

                    model = load_model(
                        MODEL_PATH,
                        compile=False,
                        custom_objects={"InputLayer": CustomInputLayer},
                    )
                    print("Model loaded with custom InputLayer!")

            # Recompile with the same settings as in your training
            model.compile(
                optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"]
            )

            print("Your original model loaded successfully!")

        else:
            print(f"Model file not found at {MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    except Exception as e:
        print(f"Error loading model: {e}")
        raise e


def preprocess_image(image):
    """Preprocess image for prediction - exactly as in your training"""
    # Resize to 64x64 as expected by model
    image = image.resize((64, 64))
    # Convert to array
    img_array = img_to_array(image)
    # Expand dimensions to match model input
    img_array = np.expand_dims(img_array, axis=0)
    # Normalize pixel values (same as your training data)
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
    else:
        return jsonify(
            {
                "status": "success",
                "message": "Your original AI model loaded and ready for analysis",
            }
        )


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify(
                {"error": "Model not loaded. Please restart the application."}
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

        # Preprocess image exactly as in your training
        processed_image = preprocess_image(image)

        # Make prediction using your original model
        prediction = model.predict(processed_image)
        result = prediction[0][0]

        # Interpret result exactly as in your training code
        # Your model: 0 = cancer, 1 = not cancer
        if result < 0.5:  # Sigmoid output: closer to 0 = cancer, closer to 1 = normal
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

        # Process uploaded image exactly as in your training
        image = Image.open(file.stream).convert("RGB")
        processed_image = preprocess_image(image)

        # Make prediction using your original model
        prediction = model.predict(processed_image)
        result = prediction[0][0]

        # Interpret result exactly as in your training code
        if result < 0.5:  # Sigmoid output: closer to 0 = cancer, closer to 1 = normal
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
    # Use environment variables for production
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
