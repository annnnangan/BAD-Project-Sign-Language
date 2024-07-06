window.load = loadPage();

async function loadPage() {
  const preload = document.querySelector(".preload");

  const searchParams = new URLSearchParams(location.search);
  const quizID = searchParams.get("quiz");

  let questions;
  let currentQuestionIndex = 0;
  let score = 0;
  const app = document.querySelector(".app");
  const errorModal = document.querySelector(".error");
  const detectLoader = document.querySelector(".detect-load");
  const questionElement = document.getElementById("question");
  const questionImage = document.querySelector(".question-image");
  const answerButtons = document.getElementById("answer-buttons");
  const multipleChoices = document.querySelector(".multiple-choices");
  const handDetect = document.querySelector(".web-cam-container");
  const nextButtons = document.querySelectorAll(".next-btn");
  const feedbackNextButton = document.querySelector(
    ".detect-feedback .next-btn"
  );
  const choiceNextButton = document.querySelector(
    ".multiple-choices .next-btn"
  );

  const restartButton = document.querySelector(".restart-btn");
  const backButton = document.querySelector(".back-btn");
  const captureBtn = document.querySelector(".capture-btn");
  const video = document.querySelector(".web-cam");
  const canvas = document.querySelector(".canvas");
  const quizSmallTitle = document.querySelector(".app span");
  const quizTitle = document.querySelector(".app h1");
  const detectFeedback = document.querySelector(".detect-feedback");
  const feedbackImage = document.querySelector(".feedback-image");
  const feedbackText = document.querySelector(".feedback-text");
  const signLanguageDemo = document.querySelector(".sign-language-demo");

  await startQuiz();

  setTimeout(() => {
    preload.classList.add("preload-finish");
  }, 2000);

  async function startQuiz() {
    const quizQuestionRes = await fetch(`/games/quiz?quiz=${quizID}`);
    questions = await quizQuestionRes.json();
    console.log(questions);
    currentQuestionIndex = 0;
    score = 0;

    if (questions.status === "error") {
      app.style.display = "none";
      errorModal.style.display = "flex";
    } else {
      questions = questions.data;
      quizSmallTitle.innerText = questions[0].quiz;
      quizTitle.innerText = questions[0].description;
      showQuestion();
    }
  }

  function showQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
    feedbackNextButton.style.display = "none";
    choiceNextButton.style.display = "none";
    restartButton.style.display = "none";
    backButton.style.display = "none";

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
      captureBtn.style.display = "block";
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

    choiceNextButton.style.display = "block";
  }

  nextButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      detectFeedback.style.display = "none";
      if (currentQuestionIndex < questions.length) {
        await handleNextButton();
      } else {
        startQuiz();
      }
    });
  });

  async function handleNextButton() {
    currentQuestionIndex = currentQuestionIndex + 1;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showScore();
      console.log("Save Score");
      await fetch("/games/quiz-score", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz: quizID, score: score }),
      });
    }
  }

  function showScore() {
    questionImage.src = "";
    multipleChoices.style.display = "none";
    handDetect.style.display = "none";
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
    restartButton.style.display = "block";
    backButton.style.display = "block";
    //stopWebCam();
    console.log("show scores");
  }

  captureBtn.addEventListener("click", async (event) => {
    captureBtn.style.display = "none";
    app.classList.add("predicting");
    detectLoader.style.display = "flex";

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

    setTimeout(() => {
      app.classList.remove("predicting");
      detectLoader.style.display = "none";
      detectFeedback.style.display = "flex";
      signLanguageDemo.src = `../assets/sign-language/${questionAnswer.toLowerCase()}-sign.png`;
    }, 2000);

    if (detectedCharacter === questionAnswer) {
      score++;
      feedbackImage.src = "../assets/feedback-images/quiz-correct.png";
      feedbackText.innerText = "Correct!";
      feedbackNextButton.style.display = "block";
    } else {
      feedbackImage.src = "../assets/feedback-images/quiz-incorrect.png";
      feedbackText.innerText = "Incorrect";
      feedbackNextButton.style.display = "block";
    }
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
