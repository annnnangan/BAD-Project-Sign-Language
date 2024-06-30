const quizTab = document.querySelector(".tabs .quiz");
const learningTab = document.querySelector(".tabs .learning");
const alphabetContainer = document.querySelector(".alphabet-lists");
const quizContainer = document.querySelector(".quiz-lists");

const monsterColor = ["green", "orange", "blue", "yellow", "red"];

quizTab.addEventListener("click", async (event) => {
  quizContainer.innerHTML = "";
  alphabetContainer.style.display = "none";
  quizContainer.style.display = "flex";
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

export async function loadQuizList() {
  const quizListRes = await fetch(`/games/quiz-list`);
  const quizScoresRes = await fetch(`/games/quiz-score`);
  const quizList = await quizListRes.json();
  const quizScore = await quizScoresRes.json();

  //load quiz card
  await quizList.forEach((quiz, index) => {
    quizContainer.innerHTML += `<a href="/quiz/quiz.html?quiz=${
      quiz.id
    }"><div class="quiz-card quiz${index + 1}" data-quiz="${quiz.id}">
    <img data-quiz="${quiz.id}" src="../assets/character/monster-${
      monsterColor[index]
    }.png" alt="" />

    <div class="highest-score"> 
      <h6>Your highest score:</h6>
      <div class="star" data-quiz="${quiz.id}"></div> 
    </div>

    <div class="description" data-quiz="${quiz.id}">
      <span data-quiz="${quiz.id}" >${quiz.quiz}</span>
      <h5 data-quiz="${quiz.id}">${quiz.description}</h5>
    </div>
  </div>
  </a>`;
  });

  //load highest score to the quiz card
  const quizCards = document.querySelectorAll(".quiz-card");

  for (let i of quizCards) {
    const quizID = i.getAttribute("data-quiz");
    const starContainer = document.querySelector(
      `.star[data-quiz='${quizID}']`
    );

    for (let j in quizScore) {
      //if score could be found in database
      if (parseInt(i.getAttribute("data-quiz")) === quizScore[j]["quiz_id"]) {
        //amount of filled star based on the score
        for (let s = 0; s < quizScore[j]["highest_score"]; s++) {
          const star = document.createElement("i");
          star.innerHTML = "★";
          star.classList.add("scored");
          starContainer.appendChild(star);
        }

        //append remaining star
        for (let s = 0; s < 5 - quizScore[j]["highest_score"]; s++) {
          const star = document.createElement("i");
          star.innerHTML = "★";
          starContainer.appendChild(star);
        }
      }
    }

    //if no result in database, append grey star
    if (starContainer.innerHTML == "") {
      for (let s = 0; s < 5; s++) {
        const star = document.createElement("i");
        star.innerHTML = "★";
        starContainer.appendChild(star);
      }
    }
  }
}
