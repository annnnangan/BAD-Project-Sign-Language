from sanic import Sanic
from sanic.response import json
import numpy as np
import cv2
from cvzone.HandTrackingModule import HandDetector
import math
import tensorflow as tf


# Load the trained model
model = tf.keras.models.load_model('my_model.keras')


app = Sanic("Sign-language2")


detector = HandDetector(maxHands=1)
offset = 20
imgSize = 150


def get_class_names():
    return "ABCDEFGHIKLMNOPQRSTUVWXY"


def model_detection(image):
    try:
        # img = np.array(image)

        # print(img)
        
        hands, img = detector.findHands(image)
        # cv2.imshow("received image", img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        print(hands)

        if hands:
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

            # Preprocess the image for prediction
            img_array = imgWhite.astype("float32")
            img_array = np.expand_dims(img_array, axis=0)
            print(img_array.shape)

            # Make predictions
            predictions = model.predict(img_array, verbose=False)
            predicted_label_idx = np.argmax(predictions)
            class_names = get_class_names()
            predicted_label = class_names[predicted_label_idx]

            # # Draw the bounding box and label on the hand
            # cv2.rectangle(
            #     img,
            #     (x - offset, y - offset),
            #     (x + w + offset, y + h + offset),
            #     (255, 0, 255),
            #     2,
            # )
            # cv2.putText(
            #     img,
            #     predicted_label,
            #     (x, y - 20),
            #     cv2.FONT_HERSHEY_SIMPLEX,
            #     0.9,
            #     (36, 255, 12),
            #     2,
            # )

            # # Convert annotated image to base64
            # _, buffer = cv2.imencode(".jpg", img)
            # annotated_img_str = base64.b64encode(buffer).decode("utf-8")

            # annotated_img_path = os.path.join(SAVE_DIR, "annotated_image.jpg")
            # with open(annotated_img_path, "wb") as f:
            #     f.write(base64.b64decode(annotated_img_str))

            return predicted_label
        else:
            return "NO HAND DETECTED", "", ""
    except Exception as e:
        return f"Error: {e}", "", ""


# @app.route("/detectSign", methods=["POST"])
@app.post("/")
def detect_sign(request):
    
        # # Receive JSON data containing imageString
        # data = request.json
        # image_string = data["imageString"]

        # # Extract base64 encoded image data
        # imgdata = base64.b64decode(image_string.split(",")[1])

        # # Convert bytes to image
        # image = Image.open(io.BytesIO(imgdata))

        # if image:
        #     print("Image received")
        # else:
        #     print("Failed to receive image")

        # # Convert RGBA to RGB if necessary
        # if image.mode == "RGBA":
        #     image = image.convert("RGB")
        #     print("Converted image from RGBA to RGB")

        # # Save the uploaded image
        # upload_image_path = os.path.join(UPLOAD_DIR, "uploaded_image.jpg")
        # print(f"Saving uploaded image to: {upload_image_path}")
        # image.save(upload_image_path)
        # print("Uploaded image saved successfully")

        # Process the image and get the results
        content = request.json
        print(content) 
        img = cv2.imread(content)
        print(img.shape)
        img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        
        sign = model_detection(img_rgb)
        print(sign)
        return json({ "data": sign})

    # except Exception as e:
    #     print(f"Error in detect_sign: {e}")
    #     return json({"Error": f"Internal server error: {e}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)