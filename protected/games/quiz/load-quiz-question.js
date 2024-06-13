window.load = loadPage();

async function loadPage() {
  const searchParams = new URLSearchParams(location.search);
  const quizID = searchParams.get("quiz");

  let questions;
  let currentQuestionIndex = 0;
  let score = 0;
  const questionElement = document.getElementById("question");
  const questionImage = document.querySelector(".question-image");
  const answerButtons = document.getElementById("answer-buttons");
  const multipleChoices = document.querySelector(".multiple-choices");
  const handDetect = document.querySelector(".web-cam-container");
  const nextButton = document.getElementById("next-btn");
  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const quizSmallTitle = document.querySelector(".app span");
  const quizTitle = document.querySelector(".app h1");

  await startQuiz();

  quizSmallTitle.innerText = questions[0].quiz;
  quizTitle.innerText = questions[0].description;

  async function startQuiz() {
    const quizQuestionRes = await fetch(`/games/quiz?quiz=${quizID}`);
    questions = await quizQuestionRes.json();
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
  }

  function showQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    nextButton.style.display = "none";

    if (currentQuestion.question_type_id === 2) {
      multipleChoices.style.display = "block";
      handDetect.style.display = "none";
      answerButtons.innerHTML = "";
      let choices = currentQuestion.choice.split(",");
      questionImage.src = `../assets/quiz-images/${currentQuestion.image}`;
      choices.forEach((choice) => {
        const button = document.createElement("button");
        button.innerHTML = choice;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        button.addEventListener("click", selectAnswer);
      });
    } else if (currentQuestion.question_type_id === 1) {
      multipleChoices.style.display = "none";
      handDetect.style.display = "flex";
      startWebCam();
    }
  }

  function selectAnswer(e) {
    let currentQuestion = questions[currentQuestionIndex];

    const selectedBtn = e.target;

    console.log(currentQuestion);

    if (selectedBtn.innerText === currentQuestion.answer) {
      selectedBtn.classList.add("correct");
      score++;
    } else {
      selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach((button) => {
      if (button.innerText === currentQuestion.answer) {
        button.classList.add("correct");
      }
      button.disabled = true;
    });

    nextButton.style.display = "block";
  }

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
      handleNextButton();
    } else {
      startQuiz();
    }
  });

  function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }

  function showScore() {
    resetState();

    questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
  }

  function resetState() {
    nextButton.style.display = "none";
    questionImage.src = "";
    multipleChoices.style.display = "none";
    handDetect.style.display = "none";
    stopWebCam();

    while (answerButtons.firstChild) {
      answerButtons.removeChild(answerButtons.firstChild);
    }
  }

  captureBtn.addEventListener("click", async (event) => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    // get image data as string
    const imageString = canvas.toDataURL("image/jpeg");

    let questionAnswer = questions[currentQuestionIndex].answer;

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

    if (detectedCharacter === questionAnswer) {
      score++;
    }

    nextButton.style.display = "block";
  });

  async function startWebCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      window.stream = stream;
    } catch (e) {
      console.log(e.toString());
    }
  }

  function stopWebCam(stream) {
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  }
}
