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
    data-bs-target="#learningModal" >
      <img
      data-alphabet="${i}"
        class="alphabet"
        src="../assets/alphabet/${i}-alphabet.png"
        alt="${i} alphabet"
      />
      </div>`;
  }
  const alphabetCard = document.querySelectorAll("div.alphabet-card");

  const completeListRes = await fetch(`/games/complete-learning-list`);
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

  const learningModal = document.getElementById("learningModal");
  const allModal = document.querySelectorAll(".modal");
  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const demoImg = document.querySelector(".left img");
  const bookmarkButton = document.querySelector(".fa-bookmark");
  const denyMessage = document.querySelector(".deny-message");
  let isBookmark;

  alphabetCard.forEach((i) => {
    i.addEventListener("click", async (event) => {
      isBookmark = false;
      controlBookmarkStyle(isBookmark);
      startWebCam();
      const signLanguage = event.target.dataset.alphabet;
      demoImg.src = `../assets/sign-language/${signLanguage}-sign.png`;
      learningModal.setAttribute("data-alphabet", `${signLanguage}`);

      captureBtn.setAttribute("data-alphabet", `${signLanguage}`);

      const bookmarksRes = await fetch(`/users/bookmarks`);
      const bookmarkList = await bookmarksRes.json();
      console.log(bookmarkList);

      for (let i of bookmarkList) {
        if (i.sign_language === signLanguage) {
          isBookmark = true;
          console.log(isBookmark);
          controlBookmarkStyle(isBookmark);
        } else {
          controlBookmarkStyle(isBookmark);
        }
      }
    });
  });

  bookmarkButton.addEventListener("click", async (event) => {
    const signLanguage = event.target
      .closest("[data-alphabet]")
      .getAttribute("data-alphabet");

    if (isBookmark) {
      isBookmark = false;
      await fetch(`/users/bookmarks/${signLanguage}`, {
        method: "DELETE",
      });
    } else {
      isBookmark = true;
      await fetch("/users/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signLanguage: signLanguage }),
      });
    }

    controlBookmarkStyle(isBookmark);
  });

  function controlBookmarkStyle(isBookmark) {
    if (isBookmark) {
      bookmarkButton.classList.remove("fa-regular");
      bookmarkButton.classList.add("fa-solid");
      bookmarkButton.classList.add("saved");
    } else {
      bookmarkButton.classList.add("fa-regular");
      bookmarkButton.classList.remove("fa-solid");
      bookmarkButton.classList.remove("saved");
    }
  }

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

      denyMessage.style.display = "block";
      video.style.display = "none";
      captureBtn.style.display = "none";
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
