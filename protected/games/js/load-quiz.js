const quizTab = document.querySelector(".tabs .quiz");
const learningTab = document.querySelector(".tabs .learning");
const alphabetContainer = document.querySelector(".alphabet-lists");
const quizContainer = document.querySelector(".quiz-lists");

quizTab.addEventListener("click", (event) => {
  alphabetContainer.style.display = "none";
  quizContainer.style.display = "grid";
  learningTab.classList.remove("selected");
  quizTab.classList.add("selected");
});

learningTab.addEventListener("click", (event) => {
  alphabetContainer.style.display = "grid";
  quizContainer.style.display = "none";
  learningTab.classList.add("selected");
  quizTab.classList.remove("selected");
});
