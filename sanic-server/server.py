from sanic import Sanic
from sanic.response import json
import numpy as np
import cv2
from cvzone.HandTrackingModule import HandDetector
import math
import tensorflow as tf

tf.keras.backend.clear_session(
    free_memory=True
)

# tf.config.experimental.set_visible_devices([], 'GPU')

# Load the trained model
model = tf.keras.models.load_model('my_model.keras')


app = Sanic("Sign-language2")


detector = HandDetector(staticMode=True, maxHands=1)
offset = 20
imgSize = 150


def get_class_names():
    return "ABCDEFGHIKLMNOPQRSTUVWXY"


def model_detection(image):
    print("HELLO 2")
    # global detector
    # global model

    hands, img = detector.findHands(image)
    print(hands)

    if hands:
        print("HELLO 3")

        hand = hands[0]
        x, y, w, h = hand["bbox"]
        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        imgCrop = img[y - offset : y + h + offset, x - offset : x + w + offset]

        if imgCrop.size == 0:
            return "NO HAND DETECTED", "", ""

        aspectRatio = h / w

        if aspectRatio > 1:
            k = imgSize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap : wCal + wGap] = imgResize
        else:
            k = imgSize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap : hCal + hGap, :] = imgResize
        
        print("HELLO 4")
        
        # Preprocess the image for prediction
        img_array = imgWhite.astype("float32")
        img_array = np.expand_dims(img_array, axis=0)
        print(img_array.shape)
        print("HELLO 5")
        # Make predictions
        try:
            print("HELLO 6")
            
            predictions = model.predict(img_array, verbose=False)
            print("HELLO 7")
            predicted_label_idx = np.argmax(predictions)
            print("HELLO 8")
            class_names = get_class_names()
            predicted_label = class_names[predicted_label_idx]
            print(predicted_label)
            
            return predicted_label
        except Exception as e:
            print(e)
    print("HELLO 9")
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    return "NO HAND DETECTED", "", ""


# @app.route("/detectSign", methods=["POST"])
@app.post("/")
def detect_sign(request):
        print("HELLO 1")
        # Process the image and get the results
        content = request.json
        print(content) 
        img = cv2.imread(content)
        print(img.shape)

        sign = model_detection(img)
   
        return json({ "data": sign})

    # except Exception as e:
    #     print(f"Error in detect_sign: {e}")
    #     return json({"Error": f"Internal server error: {e}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)