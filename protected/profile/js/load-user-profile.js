export async function loadUserProfile() {
  const profileRes = await fetch(`/users/profile`);
  const completeQuizCountRes = await fetch(`/users/complete-quiz-count`);
  const completeLessonCountRes = await fetch(`/users/complete-lesson-count`);
  const lessonCountRes = await fetch(`/games/learning-list`);
  const quizCountRes = await fetch(`/games/quiz-list`);

  const userProfile = await profileRes.json();

  const completeLessonCount = await completeLessonCountRes.json();
  const completeQuizCount = await completeQuizCountRes.json();
  const lessonCount = await lessonCountRes.json();
  const quizCount = await quizCountRes.json();

  const name = document.querySelector(".welcome-text span");
  const userIcon = document.querySelector(".user-information .user-icon img");
  const username = document.querySelector(".user-information .username");
  const quizTracker = document.querySelector(".quiz-tracker .number");
  const lessonTracker = document.querySelector(".lesson-tracker .number");

  name.innerText = userProfile[0].nickname;
  userIcon.src = `../assets/profile/${userProfile[0].icon}`;
  username.innerText = `@${userProfile[0].username}`;
  lessonTracker.innerText = `${completeLessonCount[0].total_complete_lesson}/${lessonCount.length}`;
  quizTracker.innerText = `${completeQuizCount[0].total_complete_quiz}/${quizCount.length}`;
}
