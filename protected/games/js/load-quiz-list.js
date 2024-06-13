const quizTab = document.querySelector(".tabs .quiz");
const learningTab = document.querySelector(".tabs .learning");
const alphabetContainer = document.querySelector(".alphabet-lists");
const quizContainer = document.querySelector(".quiz-lists");

const monsterColor = ["green", "orange", "blue", "yellow", "red"];

quizTab.addEventListener("click", async (event) => {
  alphabetContainer.style.display = "none";
  quizContainer.style.display = "grid";
  learningTab.classList.remove("selected");
  quizTab.classList.add("selected");

  await loadQuizList();
});

learningTab.addEventListener("click", (event) => {
  alphabetContainer.style.display = "grid";
  quizContainer.style.display = "none";
  learningTab.classList.add("selected");
  quizTab.classList.remove("selected");
});

async function loadQuizList() {
  const quizListRes = await fetch(`/games/quiz-list`);
  const quizList = await quizListRes.json();

  await quizList.forEach((quiz, index) => {
    quizContainer.innerHTML += `<a href="/games/quiz/quiz.html?quiz=${
      quiz.id
    }"><div class="quiz-card quiz${index + 1}" data-quiz="${quiz.id}">
    <img data-quiz="${quiz.id}" src="assets/character/monster-${
      monsterColor[index]
    }.png" alt="" />
    <div class="description" data-quiz="${quiz.id}">
      <span data-quiz="${quiz.id}" >${quiz.quiz}</span>
      <h5 data-quiz="${quiz.id}">${quiz.description}</h5>
    </div>
  </div>
  </a>`;
  });
}
