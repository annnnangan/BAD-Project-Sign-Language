const feedbackContainer = document.querySelector(".feedback-container");
const trialContainer = document.querySelector(".trial-container");
const cover = document.querySelector(".cover");
const loadingBtn = document.querySelector(".loading");
const startTrialBtn = document.querySelector(".cover button");
const games = document.querySelector(".games-container");
const captureBtn = document.querySelector(".capture-btn");
const video = document.querySelector(".web-cam");
const canvas = document.querySelector(".canvas");
const detectLoading = document.querySelector(".detect-load");

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
  games.classList.add("black-screen");
  detectLoading.style.display = "flex";

  showFeedbackModal();

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

  const feedbackContent = document.querySelector("#feedbackModal");
  const characterFace = document.querySelector(".feedback .character-face");
  const modalTitle = document.querySelector(".feedback .modal-title");
  const modalDescription = document.querySelector(
    ".feedback .modal-description"
  );
  const closeButton = document.querySelector(".btn-close");
  closeButton.addEventListener("click", () => {
    feedbackContent.classList.remove("d-block");
  });

  if (detectedCharacter != "L") {
    characterFace.src = `assets/others/monster-sad-face.png`;
    modalTitle.innerText = "It seems wrong.";
    modalDescription.innerText = `Never Give Up!`;
  } else {
    characterFace.src = `assets/others/monster-excited-face.png`;
    modalTitle.innerText = "Congratulations!";
    modalDescription.innerText = `You've got it right!`;
  }

  setTimeout(() => {
    games.classList.remove("black-screen");
    detectLoading.style.display = "none";
    feedbackContent.classList.add("d-block");
  }, 2000);
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

function showFeedbackModal() {
  feedbackContainer.innerHTML = `
  <div class="modal" id="feedbackModal"  aria-hidden="true"
      aria-labelledby="feedbackModalLabel"
      tabindex="-1">
  <div class="modal-dialog modal-dialog-centered feedback">
      <div class="modal-content">
            <div class="modal-header">
              <img
                class="character-face"
                src="../assets/character/monster-excited-face.png"
                alt=""
              />

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <h5 class="modal-title">Congratulations!</h5>
              <p class="modal-description">You've got it right!</p>
            </div>
            <div class="modal-footer">
              <a href="register/register.html"
                ><button type="button" class="button btn-secondary">
                  I like this games!!!
                </button>
              </a>
            </div>

            </div>
            </div>
          </div>`;
}
