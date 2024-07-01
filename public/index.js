const cover = document.querySelector(".cover");
const loadingBtn = document.querySelector(".loading");
const startTrialBtn = document.querySelector(".cover button");
const games = document.querySelector(".games-container");
const captureBtn = document.querySelector(".capture-btn");
const video = document.querySelector(".web-cam");
const canvas = document.querySelector(".canvas");

startTrialBtn.addEventListener("click", async (event) => {
  startTrialBtn.style.display = "none";
  loadingBtn.style.display = "block";

  setTimeout(async () => {
    await startWebCam();
    cover.style.display = "none";
    games.style.display = "flex";
  }, 500);
});

//Capture User Sign Language with webcam and pass to server for detection
captureBtn.addEventListener("click", async (event) => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  // get image data as string
  const imageString = canvas.toDataURL("image/jpeg", 1.0);

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
  const characterFace = document.querySelector(".modal-header .character-face");
  const modalTitle = document.querySelector(".feedback .modal-title");
  const modalDescription = document.querySelector(
    ".feedback .modal-description"
  );

  if (detectedCharacter != "L") {
    characterFace.src = `assets/others/monster-sad-face.png`;
    modalTitle.innerText = "It seems wrong.";
    modalDescription.innerText = `Never Give Up!`;
  } else {
    characterFace.src = `assets/others/monster-excited-face.png`;
    modalTitle.innerText = "Congratulations!";
    modalDescription.innerText = `You've got it right!`;
  }
});

async function startWebCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

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
