import pickle
from sanic import Sanic
from sanic.response import json
import cv2
import mediapipe as mp
import numpy as np

app = Sanic("Sign-language")

labels_dict = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'K', 10: 'L', 11: 'M', 12: 'N', 13: 'O', 14: 'P', 15: 'Q', 16: 'R', 17: 'S', 18: 'T', 19: 'U', 20: 'V', 21: 'W', 22: 'X', 23: 'Y'}

mp_hands = mp.solutions.hands #initialize the Hands class an store it in a variable
mp_drawing = mp.solutions.drawing_utils #draw all the hand’s landmarks points on the output image
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(static_image_mode=True,min_detection_confidence=0.3)

model_dict = pickle.load(open('./model-final.p','rb'))
model = model_dict['model']

@app.post("/")
def callModel(request):
    content = request.json
    print(content)
    img = cv2.imread(content)
    

    data = []
    data_aux = []

    img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB) #Mediapipe processes frames in RGB format.
    results = hands.process(img_rgb) #detects hand landmarks in the frame
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            for i in range(len(hand_landmarks.landmark)): #each hand keypoints
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                data_aux.append(x)
                data_aux.append(y)
                data.append(data_aux)

    prediction = model.predict([np.asarray(data_aux)])
    predicted_character = labels_dict[int(prediction[0])]



    return json({ "data": predicted_character})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, single_process=True)