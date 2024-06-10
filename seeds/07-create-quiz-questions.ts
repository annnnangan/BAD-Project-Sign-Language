import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quiz_questions").del();

  const quizzes = [
    ["A", "B", "C", "D", "E", "F"],
    ["G", "H", "I", "K", "L", "M"],
    ["N", "O", "P", "Q", "R", "S"],
    ["T", "U", "V", "W", "X", "Y"],
  ];

  const quizImages = [
    [
      "question-1-7.png",
      "question-1-8.png",
      "question-1-9.png",
      "question-1-10.png",
    ],
    [
      "question-2-17.png",
      "question-2-18.png",
      "question-2-19.png",
      "question-2-20.png",
    ],
    [
      "question-3-27.png",
      "question-3-28.png",
      "question-3-29.png",
      "question-3-30.png",
    ],
    [
      "question-4-37.png",
      "question-4-38.png",
      "question-4-39.png",
      "question-4-40.png",
    ],
  ];

  const quizImagesAnswer = [
    ["A", "B", "F", "C"],
    ["L", "I", "H", "G"],
    ["N", "O", "S", "Q"],
    ["Y", "V", "T", "X"],
  ];

  let insertRow = [];

  for (let j = 0; j < 4; j++) {
    const quiz = quizzes[j];
    const images = quizImages[j];
    const imagesAns = quizImagesAnswer[j];

    for (let i = 0; i < quiz.length; i++) {
      insertRow.push({
        quiz_id: j + 1,
        question_type_id: 1,
        question: `What is the sign language of ${quiz[i]}?`,
        answer: quiz[i],
      });
    }

    for (let x = 0; x < images.length; x++) {
      insertRow.push({
        quiz_id: j + 1,
        question_type_id: 2,
        question: "What sign language is it?",
        image: images[x],
        answer: imagesAns[x],
      });
    }
  }

  // Inserts seed entries
  await knex("quiz_questions").insert(insertRow);
}
