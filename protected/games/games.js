import { loadAlphabet } from "./js/load-alphabet.js";
import "./js/load-quiz-list.js";

window.onload = loadPage();

async function loadPage() {
  const preload = document.querySelector(".preload");

  await loadAlphabet();
  setTimeout(() => {
    preload.classList.add("preload-finish");
  }, 2000);
  const alphabetContainer = document.querySelector(".alphabet-lists");
  const exampleModal = document.getElementById("exampleModal");
  const allModal = document.querySelectorAll(".modal");

  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const demoImg = document.querySelector(".left img");

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
      await fetch(`/games/complete-list/${currentLearningAlphabet}`, {
        method: "PUT",
      });
      characterFace.src = `./assets/character/monster-excited-face.png`;
      modalTitle.innerText = "Congratulations!";
      modalDescription.innerText = `You've got it right!`;
      backButton.innerText = `Back`;
      backButton.setAttribute("data-bs-dismiss", "modal");
      backButton.removeAttribute("data-bs-target");
      backButton.removeAttribute("data-bs-toggle");
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

      await loadAlphabet();
    }
  });
}
