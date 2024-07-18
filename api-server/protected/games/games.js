import { loadAlphabet } from "./js/load-alphabet.js";
import "./js/load-quiz-list.js";
import { loadQuizList } from "./js/load-quiz-list.js";
import { loadUserIcon } from "./js/load-icon.js";

window.onload = loadPage();

async function loadPage() {
  const searchParams = new URLSearchParams(location.search);
  const gamesType = searchParams.get("games");

  const preload = document.querySelector(".preload");

  setTimeout(() => {
    preload.classList.add("preload-finish");
  }, 2000);

  loadUserIcon();

  const quizTab = document.querySelector(".tabs .quiz");
  const learningTab = document.querySelector(".tabs .learning");
  const quizContainer = document.querySelector(".quiz-lists");
  const alphabetContainer = document.querySelector(".alphabet-lists");

  const monsterColor = ["green", "orange", "blue", "yellow", "red"];

  if (gamesType === "quiz") {
    quizContainer.innerHTML = "";
    alphabetContainer.style.display = "none";
    quizContainer.style.display = "flex";
    learningTab.classList.remove("selected");
    quizTab.classList.add("selected");

    loadQuizList();
  } else {
    loadAlphabet();
  }

  learningTab.addEventListener("click", (event) => {
    alphabetContainer.style.display = "grid";
    quizContainer.style.display = "none";
    learningTab.classList.add("selected");
    quizTab.classList.remove("selected");
    loadAlphabet();
  });

  const learningModal = document.getElementById("learningModal");
  const allModal = document.querySelectorAll(".modal");

  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const demoImg = document.querySelector(".left img");

  //Capture User Sign Language with webcam and pass to server for detection
  captureBtn.addEventListener("click", async (event) => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    // get image data as string
    const imageString = canvas.toDataURL("image/jpeg", 1.0);

    const currentLearningAlphabet = event.target.getAttribute("data-alphabet");

    // send image to server

    appendModal();
    const feedbackModal = document.querySelector("#feedbackModal");
    const feedback = document.querySelector(".feedback");
    const characterFace = document.querySelector(".character-face");
    const modalTitle = document.querySelector(".feedback .modal-title");
    const modalDescription = document.querySelector(
      ".feedback .modal-description"
    );
    const backButton = document.querySelector(".feedback .modal-footer button");
    try {
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

      console.log(
        "compare result",
        currentLearningAlphabet != detectedCharacter.toLowerCase()
      );

      if (currentLearningAlphabet != detectedCharacter.toLowerCase()) {
        throw Error();
      } else {
        await fetch(`/games/complete-list/${currentLearningAlphabet}`, {
          method: "PUT",
        });
        characterFace.src = `../assets/character/monster-excited-face.png`;
        modalTitle.innerText = "Congratulations!";
        modalDescription.innerText = `You've got it right!`;
        backButton.innerText = `Back`;
        backButton.setAttribute("data-bs-dismiss", "modal");
        backButton.removeAttribute("data-bs-target");
        backButton.removeAttribute("data-bs-toggle");

        feedbackModal.classList.toggle("d-block");

        backButton.addEventListener("click", (e) => {
          e.preventDefault();
          feedbackModal.classList.toggle("d-block");
        });
        confetti({
          particleCount: 500,
          spread: 120,
          origin: { x: 1, y: 0.9 },
        });

        confetti({
          particleCount: 500,
          spread: 120,
          origin: { x: 0, y: 0.9 },
        });

        loadAlphabet();
      }
    } catch (error) {
      characterFace.src = `../assets/character/monster-sad-face.png`;
      modalTitle.innerText = "It seems wrong.";
      modalDescription.innerText = `Never Give Up and Try Again!`;
      backButton.innerText = `Try Again!`;
      backButton.removeAttribute("data-bs-dismiss");
      backButton.setAttribute("data-bs-target", "#learningModal");
      backButton.setAttribute("data-bs-toggle", "modal");

      backButton.addEventListener("click", (e) => {
        e.preventDefault();
        feedbackModal.classList.toggle("d-block");
        startWebCam();
      });
      feedbackModal.classList.toggle("d-block");
    }
  });
}

function appendModal() {
  let target = document.querySelector("#feedback-modal-container");

  target.innerHTML = `<div
      class="modal"
      id="feedbackModal"
      aria-hidden="true"
      aria-labelledby="feedbackModalLabel"
      tabindex="-1"
    >
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
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
`;
}

async function startWebCam() {
  try {
    const video = document.querySelector(".web-cam");
    console.log("hello");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    window.stream = stream;
  } catch (e) {
    console.log(e.toString());
  }
}
