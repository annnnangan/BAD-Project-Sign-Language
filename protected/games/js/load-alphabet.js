export async function loadAlphabet() {
  const alphabetContainer = document.querySelector(".alphabet-lists");
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

  alphabetContainer.innerHTML = "";
  //Looping out A - Z images in games overview
  for (let i of lowerCaseLetters) {
    alphabetContainer.innerHTML += `<div class="alphabet-card" data-alphabet="${i}" data-bs-toggle="modal"
    data-bs-target="#exampleModal" >
      <img
      data-alphabet="${i}"
        class="alphabet"
        src="./assets/alphabet/${i}-alphabet.png"
        alt="${i} alphabet"
      />
      </div>`;
  }
  const alphabetCard = document.querySelectorAll("div.alphabet-card");

  const completeListRes = await fetch(`/games/learning-list`);
  const completeList = await completeListRes.json();

  for (let i of alphabetCard) {
    for (let j in completeList) {
      if (
        i.getAttribute("data-alphabet") === completeList[j]["sign_language"]
      ) {
        i.classList.add("completed");
      }
    }
  }

  const exampleModal = document.getElementById("exampleModal");
  const allModal = document.querySelectorAll(".modal");
  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const demoImg = document.querySelector(".left img");

  alphabetCard.forEach((i) => {
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
}
