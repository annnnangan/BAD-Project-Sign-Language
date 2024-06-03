const alphabetContainer = document.querySelector(".alphabet-lists");
const exampleModal = document.getElementById("exampleModal");
const allModal = document.querySelectorAll(".modal");

const captureBtn = document.querySelector(".capture-btn");
const video = document.querySelector(".web-cam");
const canvas = document.querySelector(".canvas");
const answer = document.querySelector(".answer");
const demoImg = document.querySelector(".left img");

const lowerCaseLetters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
];

//Looping out A - Z images in games overview
for (let i of lowerCaseLetters) {
  alphabetContainer.innerHTML += `<img
    class="alphabet"
    data-alphabet="${i}"
    src="./assets/alphabet/${i}-alphabet.png"
    alt="${i} alphabet"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  />`;
}

const alphabetImg = document.querySelectorAll(".alphabet-lists img");

alphabetImg.forEach((i) => {
  i.addEventListener("click", (event) => {
    console.log("clicked");
    startWebCam();
    console.log(event.target.dataset.alphabet);

    demoImg.src = `./assets/sign-language/${event.target.dataset.alphabet}-sign.png`;
    exampleModal.setAttribute(
      "data-alphabet",
      `${event.target.dataset.alphabet}`
    );
    captureBtn.setAttribute(
      "data-alphabet",
      `${event.target.dataset.alphabet}`
    );
  });
});

exampleModal.addEventListener("shown.bs.modal", (event) => {
  startWebCam();
});

allModal.forEach((i) => {
  i.addEventListener("hidden.bs.modal", (event) => {
    stopWebCam(stream);
  });
});

// Opening User Webcam
async function startWebCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    window.stream = stream;
  } catch (e) {
    console.log(e.toString());
  }
}

async function stopWebCam(stream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState == "live") {
      track.stop();
    }
  });
}

//Capture User Sign Language with webcam and pass to server for detection
captureBtn.addEventListener("click", async (event) => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  // get image data as string
  const imageString = canvas.toDataURL("image/jpeg");

  const currentLearningAlphabet = event.target.getAttribute("data-alphabet");

  // send image to server
  const response = await fetch("/upload", {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageString: imageString,
    }),
  });

  const detectedCharacter = (await response.json()).data;

  const feedback = document.querySelector(".feedback");
  const characterFace = document.querySelector(".character-face");
  const modalTitle = document.querySelector(".feedback .modal-title");
  const modalDescription = document.querySelector(
    ".feedback .modal-description"
  );
  const backButton = document.querySelector(".feedback .modal-footer button");

  if (currentLearningAlphabet != detectedCharacter.toLowerCase()) {
    characterFace.src = `./assets/character/monster-sad-face.png`;
    modalTitle.innerText = "It seems wrong.";
    modalDescription.innerText = `Never Give Up and Try Again!`;
    backButton.innerText = `Try Again!`;
    backButton.removeAttribute("data-bs-dismiss");
    backButton.setAttribute("data-bs-target", "#exampleModal");
    backButton.setAttribute("data-bs-toggle", "modal");
  } else {
    characterFace.src = `./assets/character/monster-excited-face.png`;
    modalTitle.innerText = "Congratulations!";
    modalDescription.innerText = `You've got it right!`;
    backButton.innerText = `Back`;
    backButton.setAttribute("data-bs-dismiss", "modal");
    backButton.removeAttribute("data-bs-target");
    backButton.removeAttribute("data-bs-toggle");
  }
});
