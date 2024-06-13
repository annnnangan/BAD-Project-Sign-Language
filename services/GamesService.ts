import { Knex } from "knex";

export class GamesService {
  constructor(private knex: Knex) {}
  async getCompleteLanguage(userID: number) {
    return await this.knex
      .select("sign_language")
      .from("complete_learning_list")
      .leftJoin(
        "sign_languages",
        "complete_learning_list.sign_language_id",
        "sign_languages.id"
      )
      .where("user_id", userID);
  }

  async completeLanguage(userID: number, signLanguage: string) {
    console.log(`signLanguage: ${signLanguage}`);
    //get sign language ID based on sign language
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0]?.id;

    //search if the sign language id exist in the table for the particular user
    const completedList = await this.knex
      .select("id")
      .from("complete_learning_list")
      .where("user_id", userID)
      .andWhere("sign_language_id", signLanguageID);

    console.log(`completedList: ${completedList}`);

    //if the sign language id doesn't exist for that user, insert a new row
    if (completedList.length === 0) {
      await this.knex
        .insert({
          user_id: userID,
          sign_language_id: signLanguageID,
        })
        .into("complete_learning_list");
    }
  }

  async getQuizList() {
    return await this.knex.select("*").from("quizzes");
  }

  async getQuizQuestion(quizID: number) {
    return await this.knex
      .select(
        "quizzes.quiz",
        "quizzes.description",
        "quiz_questions.question_type_id",
        "quiz_questions.question",
        "quiz_questions.image",
        "quiz_questions.answer",
        "quiz_choices.choice"
      )
      .from("quiz_questions")
      .orderByRaw("RANDOM()")
      .limit(5)
      .leftJoin("quiz_choices", "quiz_questions.id", "quiz_choices.question_id")
      .leftJoin("quizzes", "quiz_questions.quiz_id", "quizzes.id")
      .where("quiz_id", quizID);
  }
}
