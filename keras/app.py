import io
import logging
from datetime import datetime

import exifread
import numpy as np
import pymongo
import sentry_sdk
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image, ImageOps
from sentry_sdk.integrations.flask import FlaskIntegration
from tensorflow.keras.models import load_model

sentry_sdk.init(
    dsn="https://e15909bb1602d37fdd1e106a63db557e@o4507560794914816.ingest.de.sentry.io/4507560798715984",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0  
)

app = Flask(__name__)
CORS(app)  

model = load_model('wildlens_transfer_learning.keras')

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["wildlens"]
images_collection = db["images"]
predictions_collection = db["predictions"]

logging.basicConfig(level=logging.DEBUG)

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((100, 100))  
    img_array = np.array(img) / 255.0  
    img_array = np.expand_dims(img_array, axis=0)  
    return img_array

def get_exifData(image_bytes):
    try:
        img = io.BytesIO(image_bytes)
        exifData = exifread.process_file(img, details=False)
        if not exifData:
            logging.debug("Aucune donnée EXIF trouvée")
        else:
            logging.debug(f"Données EXIF: {exifData}")
        return {tag: str(value) for tag, value in exifData.items()}
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction des données EXIF: {e}")
        sentry_sdk.capture_exception(e)
        return {}

def compress_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img) 
    img = img.convert("RGB") 
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=60)
    compressed_image = output.getvalue()
    return compressed_image

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Aucun fichier trouvé'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'})

    image_bytes = file.read()
    image_array = preprocess_image(image_bytes)

    try:
        prediction = model.predict(image_array)
        predicted_class_index = np.argmax(prediction)
        confidence = prediction[0][predicted_class_index]
        sentry_sdk.add_breadcrumb(
            category='prediction',
            message=f'Index de la classe prédite : {predicted_class_index}, Confiance : {confidence}',
            level='info'
        )
    except Exception as e:
        logging.error(f"Erreur lors de la prédiction : {e}")
        sentry_sdk.capture_exception(e) 
        return jsonify({'error': 'Prédiction échouée'})

    class_names = [
        "Castor", "Chat", "Chien", "Coyote", "Ecureuil",
        "Lapin", "Loup", "Lynx", "Ours", "Puma", 
        "Rat", "Raton laveur", "Renard"
    ]
    predicted_class = class_names[predicted_class_index]

    score = confidence * 100
    exifData = get_exifData(image_bytes)
    compressed_image = compress_image(image_bytes)

    logging.debug(f"Données EXIF : {exifData}")

    predictedClasses = {
        "class": predicted_class,
        "score": float(confidence)
    }
    image_data = {
        "imageData": compressed_image,
        "imageContentType": file.content_type,
        "predictedClasses": [predictedClasses],
        "exifData": exifData,
        "timestamp": datetime.now()
    }
    result = images_collection.insert_one(image_data)

    prediction_log = {
        "image_id": str(result.inserted_id),
        "predicted_class": predicted_class,
        "confidence_score": score,
        "timestamp": datetime.now()
    }
    predictions_collection.insert_one(prediction_log)

    sentry_sdk.capture_message(
        f"Prédiction effectuée : {predicted_class} avec une confiance de {score:.2f}%",
        level='info'
    )

    return jsonify({
        'prediction': f"{predictedClasses['class']}: {score:.2f}%",
        'class': predictedClasses['class'],
        'score': f"{score:.2f}%"
    })

if __name__ == '__main__':
    app.run(port=5000)
